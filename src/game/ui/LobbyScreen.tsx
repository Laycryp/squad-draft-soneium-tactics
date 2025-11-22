// src/game/ui/LobbyScreen.tsx
"use client";

import React from "react";
import { BUDGET, SQUAD_SIZE } from "~/game/units";

type AvatarKey = "lion" | "owl" | "dragon" | "bot";

type LobbyScreenProps = {
  username: string;
  farcasterHandle: string | null;
  avatar: AvatarKey;
  setAvatar: (avatar: AvatarKey) => void;
  remainingAttempts: number | null;
  onStartDaily: () => void;
};

const AVATAR_EMOJI: Record<AvatarKey, string> = {
  lion: "🦁",
  owl: "🦉",
  dragon: "🐲",
  bot: "🤖",
};

const LobbyScreen: React.FC<LobbyScreenProps> = ({
  username,
  farcasterHandle,
  avatar,
  setAvatar,
  remainingAttempts,
  onStartDaily,
}) => {
  return (
    <main className="app-main">
      <section className="panel">
        <div className="panel-header-row">
          <h2>Command Center</h2>
          <span className="muted">Daily Soneium tactics challenge</span>
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
            {remainingAttempts !== null && (
              <div className="wallet-meta" style={{ marginTop: "0.25rem" }}>
                Attempts left today: <strong>{remainingAttempts}</strong>
              </div>
            )}
          </div>
        </div>

        <div style={{ marginTop: "0.75rem" }}>
          <span className="field-label">Avatar</span>
          <div className="avatar-options">
            {(
              ["lion", "owl", "dragon", "bot"] as AvatarKey[]
            ).map((key) => (
              <button
                key={key}
                type="button"
                className={`avatar-pill ${
                  avatar === key ? "avatar-pill-active" : ""
                }`}
                onClick={() => setAvatar(key)}
              >
                {AVATAR_EMOJI[key]} {key}
              </button>
            ))}
          </div>
        </div>

        <div className="season-banner">
          <div>
            <div className="season-label">Season Alpha</div>
            <div className="season-subtitle">
              Draft the best squad today and lock in your rank.
            </div>
          </div>
          <div className="season-rank-pill">
            <span className="season-rank-label">Status</span>
            <span className="season-rank-value">Unranked</span>
          </div>
        </div>

        <div className="actions" style={{ marginTop: "1rem" }}>
          <button className="btn-primary" onClick={onStartDaily}>
            Start Daily Draft
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>How it works</h2>
        <p className="muted">
          Draft <strong>{SQUAD_SIZE}</strong> units under{" "}
          <strong>{BUDGET}</strong> budget. Your squad fights the daily lineup.
          Earn points, climb the seasonal leaderboard, and unlock badges.
        </p>
      </section>
    </main>
  );
};

export default LobbyScreen;
