// src/app/page.tsx
"use client";

import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { UNITS, BUDGET, SQUAD_SIZE, unitsById } from "~/game/units";
import { useWallet } from "~/game/useWallet";
import LobbyScreen from "~/game/ui/LobbyScreen";
import DraftScreen from "~/game/ui/DraftScreen";
import ResultScreen from "~/game/ui/ResultScreen";
import ProfileLeaderboardScreen from "~/game/ui/ProfileLeaderboardScreen";
import { submitMatchOnchain } from "~/game/web3";
import { useFarcasterUser } from "~/game/useFarcasterUser";

export type View = "lobby" | "draft" | "result" | "profile";
export type AvatarKey = "lion" | "owl" | "dragon" | "bot";

export type SimulationResponse = {
  win: boolean;
  score: number;
  rounds: number;
  friendlyHp: number;
  enemyHp: number;
  logPreview: string[];
};

export default function Page() {
  const [view, setView] = useState<View>("lobby");

  const [selectedIds, setSelectedIds] = useState<number[]>([1, 4, 6, 8, 10]);
  const [result, setResult] = useState<SimulationResponse | null>(null);

  const [loadingSim, setLoadingSim] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [shareCopied, setShareCopied] = useState(false);

  const [avatar, setAvatar] = useState<AvatarKey>("lion");

  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(
    null
  );

  const wallet = useWallet();
  const { user: farcasterUser } = useFarcasterUser();

  // نضمن أن الاسم string فقط
  const rawName =
    (farcasterUser?.displayName as unknown) ??
    (farcasterUser?.username as unknown) ??
    "Commander";

  const effectiveUsername =
    typeof rawName === "string" ? rawName : "Commander";

  const farcasterHandle =
    typeof farcasterUser?.username === "string"
      ? farcasterUser.username
      : null;

  // === Persistence: avatar فقط ===
  useEffect(() => {
    const storedAvatar = window.localStorage.getItem(
      "sd_avatar"
    ) as AvatarKey | null;
    if (storedAvatar) setAvatar(storedAvatar);
  }, []);

  useEffect(() => {
    if (avatar) {
      window.localStorage.setItem("sd_avatar", avatar);
    }
  }, [avatar]);

  // === Squad helpers ===
  const totalCost = useMemo(
    () => selectedIds.reduce((sum, id) => sum + (unitsById[id]?.cost ?? 0), 0),
    [selectedIds]
  );

  const canAddUnit = (id: number): boolean => {
    if (selectedIds.includes(id)) return true;
    if (selectedIds.length >= SQUAD_SIZE) return false;

    const unit = unitsById[id];
    if (!unit) return false;

    const newCost = totalCost + unit.cost;
    return newCost <= BUDGET;
  };

  const handleToggleUnit = (id: number) => {
    setError(null);
    setResult(null);
    setShareCopied(false);

    if (selectedIds.includes(id)) {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      return;
    }

    if (!canAddUnit(id)) {
      setError("Squad is full or budget exceeded.");
      return;
    }

    setSelectedIds((prev) => [...prev, id]);
  };

  // === Actions ===
  const handleStartDaily = () => {
    setError(null);
    setResult(null);
    setShareCopied(false);
    setView("draft");
  };

  const handleBackToLobby = () => {
    setView("lobby");
  };

  const handlePlayAgain = () => {
    setResult(null);
    setShareCopied(false);
    setView("draft");
  };

  const handleSimulate = async () => {
    setError(null);
    setResult(null);
    setShareCopied(false);

    if (selectedIds.length !== SQUAD_SIZE) {
      setError(`You must select exactly ${SQUAD_SIZE} units.`);
      return;
    }

    setLoadingSim(true);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ squadIds: selectedIds }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(data?.error ?? `Request failed with ${res.status}`);
      }

      const data: SimulationResponse = await res.json();
      setResult(data);
      setView("result");
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Simulation failed";
      setError(message);
    } finally {
      setLoadingSim(false);
    }
  };

  // === Onchain submission: Farcaster Mini App wallet → عقد Soneium ===
  const handleSubmitOnchain = async () => {
    if (!result) {
      setError("Run a simulation first before submitting onchain.");
      return;
    }

    if (!wallet.isConnected || !wallet.address) {
      setError("Farcaster Mini App wallet is not connected.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const txHash = await submitMatchOnchain(result.score, selectedIds);
      console.log("Onchain score submitted, txHash:", txHash);
    } catch (err: unknown) {
      console.error(err);

      let message = "Onchain submission failed. Please try again.";

      if (err instanceof Error) {
        const m = err.message || "";

        if (
          m.includes("missing revert data") ||
          m.includes("estimateGas") ||
          m.includes("insufficient funds") ||
          m.includes("insufficient balance")
        ) {
          message = "Not enough balance to send this transaction.";
        } else {
          message = m;
        }
      }

      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const displayName = effectiveUsername;
    const text = `I scored ${result.score} in Squad Draft: Soneium Tactics on Soneium Minato as ${displayName}! #Soneium #Startale`;
    try {
      await navigator.clipboard.writeText(text);
      setShareCopied(true);
    } catch (err) {
      console.error(err);
      setError("Could not copy share text.");
    }
  };

  // نضمن أن العنوان string أو null فقط
  const safeWalletAddress =
    typeof wallet.address === "string" ? wallet.address : "";
  const safeWalletAddressOrNull = safeWalletAddress || null;

  return (
    <div className="app-root">
      <div className="app-shell">
        <header className="app-header">
          <div className="app-header-row">
            <div>
              <h1>Squad Draft: Soneium Tactics</h1>
              <p>Draft your squad under budget and simulate the daily battle.</p>
            </div>

            <div className="wallet-box">
              {wallet.connecting && (
                <p className="wallet-meta">Connecting to Farcaster wallet…</p>
              )}

              {wallet.isConnected &&
                safeWalletAddress &&
                !wallet.connecting && (
                  <div className="wallet-info">
                    <span className="wallet-address">
                      {safeWalletAddress.slice(0, 6)}...
                      {safeWalletAddress.slice(-4)}
                    </span>
                    <span className="wallet-meta">
                      Farcaster Mini App wallet
                    </span>
                  </div>
                )}

              {!wallet.connecting &&
                !wallet.isConnected &&
                !wallet.error && (
                  <button
                    className="btn-secondary"
                    onClick={wallet.connect}
                  >
                    Retry wallet
                  </button>
                )}

              {wallet.error && (
                <div className="wallet-error">{wallet.error}</div>
              )}

              {remainingAttempts !== null && (
                <p className="wallet-meta">
                  Attempts left today: <strong>{remainingAttempts}</strong>
                </p>
              )}
            </div>
          </div>

          {/* شلنا الـ nav العلوي القديم بالكامل */}
        </header>

        {/* الشاشات الرئيسية */}
        {view === "lobby" && (
          <LobbyScreen
            username={effectiveUsername}
            farcasterHandle={farcasterHandle}
            avatar={avatar}
            setAvatar={setAvatar}
            remainingAttempts={remainingAttempts}
            onStartDaily={handleStartDaily}
          />
        )}

        {view === "draft" && (
          <DraftScreen
            totalCost={totalCost}
            selectedIds={selectedIds}
            onToggleUnit={handleToggleUnit}
            canAddUnit={canAddUnit}
            onSimulate={handleSimulate}
            loading={loadingSim}
            error={error}
            units={UNITS}
            onBackToLobby={handleBackToLobby}
          />
        )}

        {view === "result" && (
          <ResultScreen
            result={result}
            error={error}
            onSubmitOnchain={handleSubmitOnchain}
            submitting={submitting}
            walletConnected={wallet.isConnected}
            onShare={handleShare}
            shareCopied={shareCopied}
            onPlayAgain={handlePlayAgain}
          />
        )}

        {view === "profile" && (
          <ProfileLeaderboardScreen
            username={effectiveUsername}
            farcasterHandle={farcasterHandle}
            avatar={avatar}
            bestScore={result?.score ?? null}
            remainingAttempts={remainingAttempts}
            walletAddress={safeWalletAddressOrNull}
          />
        )}

        {/* ✅ البار السفلي للتنقل بين الشاشات */}
        <footer className="bottom-nav">
          <div className="bottom-nav-inner">
            <button
              className={`bottom-nav-btn ${
                view === "lobby" ? "bottom-nav-btn-active" : ""
              }`}
              onClick={() => setView("lobby")}
            >
              <span className="bottom-nav-icon">🏠</span>
              <span className="bottom-nav-label">Lobby</span>
            </button>
            <button
              className={`bottom-nav-btn ${
                view === "draft" ? "bottom-nav-btn-active" : ""
              }`}
              onClick={() => setView("draft")}
            >
              <span className="bottom-nav-icon">🧠</span>
              <span className="bottom-nav-label">Draft</span>
            </button>
            <button
              className={`bottom-nav-btn ${
                view === "result" ? "bottom-nav-btn-active" : ""
              }`}
              onClick={() => result && setView("result")}
              disabled={!result}
            >
              <span className="bottom-nav-icon">⚔️</span>
              <span className="bottom-nav-label">Result</span>
            </button>
            <button
              className={`bottom-nav-btn ${
                view === "profile" ? "bottom-nav-btn-active" : ""
              }`}
              onClick={() => setView("profile")}
            >
              <span className="bottom-nav-icon">🏆</span>
              <span className="bottom-nav-label">Season</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
