// src/game/ui/ProfileLeaderboardScreen.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  getPlayerOnchainView,
  type PlayerOnchainView,
} from "~/game/web3";

type AvatarKey = "lion" | "owl" | "dragon" | "bot";

type ProfileLeaderboardScreenProps = {
  username: string;
  farcasterHandle: string | null;
  avatar: AvatarKey;
  bestScore: number | null; // يمكن تجاهله الآن، لكن نحتفظ به لو احتجناه لاحقًا
  remainingAttempts: number | null;
  walletAddress: string | null;
};

const AVATAR_EMOJI: Record<AvatarKey, string> = {
  lion: "🦁",
  owl: "🦉",
  dragon: "🐲",
  bot: "🤖",
};

const ProfileLeaderboardScreen: React.FC<ProfileLeaderboardScreenProps> = ({
  username,
  farcasterHandle,
  avatar,
  bestScore,
  remainingAttempts,
  walletAddress,
}) => {
  const [onchain, setOnchain] = useState<PlayerOnchainView | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!walletAddress) {
        setOnchain(null);
        return;
      }
      setLoading(true);
      setLoadError(null);
      try {
        const data = await getPlayerOnchainView(walletAddress);
        if (!cancelled) {
          setOnchain(data);
        }
      } catch (err: unknown) {
        console.error(err);
        if (!cancelled) {
          setLoadError(
            err instanceof Error
              ? err.message
              : "Failed to load onchain player data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [walletAddress]);

  // 🧮 الرقم اللي بنستخدمه في الليدر بورد = totalScore التراكمي من العقد
  const seasonScore = onchain?.totalScore ?? 0;

  // عدد المحاولات المتبقية:
  // - أولاً من onchain.attemptsLeft
  // - fallback إلى remainingAttempts اللي جاي من props (لو موجودة)
  const attemptsLeft =
    typeof onchain?.attemptsLeft === "number"
      ? onchain.attemptsLeft
      : remainingAttempts;

  // leaderboard mock بسيط، مع صفك أنت مبني على seasonScore
  const leaderboard = [
    { rank: 1, name: "Top Commander", score: 420 },
    { rank: 2, name: "Arc Sniper Main", score: 380 },
    { rank: 3, name: "Shield Tactician", score: 350 },
    {
      rank: seasonScore > 0 ? 5 : 15,
      name: username,
      score: seasonScore,
      isYou: true,
    },
  ];

  return (
    <main className="app-main">
      <section className="panel">
        <div className="panel-header-row">
          <h2>Season Overview</h2>
        </div>

        <div className="profile-row" style={{ marginTop: "0.75rem" }}>
          <div className="avatar-circle">
            <span>{AVATAR_EMOJI[avatar]}</span>
          </div>
          <div className="profile-details">
            <div className="field-label">Commander</div>
            <div style={{ fontWeight: 600 }}>{username}</div>
            {farcasterHandle && (
              <div className="wallet-meta" style={{ marginTop: "0.15rem" }}>
                @{farcasterHandle}
              </div>
            )}
            {walletAddress && (
              <div className="wallet-meta" style={{ marginTop: "0.25rem" }}>
                Wallet: {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-4)}
              </div>
            )}

            <div className="wallet-meta" style={{ marginTop: "0.3rem" }}>
              Season score (onchain):{" "}
              <strong>{seasonScore}</strong>
            </div>

            {typeof attemptsLeft === "number" && (
              <div className="wallet-meta" style={{ marginTop: "0.2rem" }}>
                Attempts left today: <strong>{attemptsLeft}</strong>
              </div>
            )}

            {loading && (
              <div className="wallet-meta" style={{ marginTop: "0.2rem" }}>
                Syncing onchain state…
              </div>
            )}
            {loadError && (
              <div className="wallet-error" style={{ marginTop: "0.2rem" }}>
                {loadError}
              </div>
            )}
          </div>
        </div>

        <div className="season-banner">
          <div>
            <div className="season-label">Season Alpha</div>
            <div className="season-subtitle">
              Climb the Squad Draft leaderboard on Soneium.
            </div>
          </div>
          <div className="season-rank-pill">
            <span className="season-rank-label">Your rank</span>
            <span className="season-rank-value">
              {seasonScore > 0 ? "Top 25% (mock)" : "Unranked"}
            </span>
          </div>
        </div>

        <div className="lb-wrapper">
          <table className="lb-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Commander</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((row) => (
                <tr
                  key={row.rank}
                  className={
                    (row as any).isYou
                      ? "lb-row-you"
                      : row.rank <= 3
                      ? "lb-row-top"
                      : undefined
                  }
                >
                  <td>#{row.rank}</td>
                  <td>{row.name}</td>
                  <td>{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default ProfileLeaderboardScreen;
