// src/game/ui/ResultScreen.tsx
"use client";

// نفس النوع المستخدم في page.tsx
export type SimulationResponse = {
  win: boolean;
  score: number;
  rounds: number;
  friendlyHp: number;
  enemyHp: number;
  logPreview: string[];
};

type Props = {
  result: SimulationResponse | null;
  error: string | null;
  onSubmitOnchain: () => Promise<void> | void;
  submitting: boolean;
  walletConnected: boolean;
  onShare: () => Promise<void> | void;
  shareCopied: boolean;
  onPlayAgain: () => void;
};

export default function ResultScreen({
  result,
  error,
  onSubmitOnchain,
  submitting,
  walletConnected,
  onShare,
  shareCopied,
  onPlayAgain,
}: Props) {
  const outcomeText = result
    ? result.win
      ? "WIN"
      : "LOSS"
    : "No result yet";

  const outcomeClass = result
    ? result.win
      ? "text-win"
      : "text-lose"
    : "";

  return (
    <main className="app-main">
      <section className="panel">
        <h2>Match Result</h2>

        {!result && !error && (
          <p className="muted">
            Run a simulation first from the Draft tab to see your daily result.
          </p>
        )}

        {error && (
          <div className="alert alert-error" style={{ marginTop: "0.75rem" }}>
            {error}
          </div>
        )}

        {result && (
          <div className="result-card result-anim">
            <p>
              Outcome: <strong className={outcomeClass}>{outcomeText}</strong>
            </p>
            <p>
              Score: <strong>{result.score}</strong>
            </p>
            <p>
              Rounds: <strong>{result.rounds}</strong>
            </p>
            <p>
              Friendly HP: <strong>{result.friendlyHp}</strong> | Enemy HP:{" "}
              <strong>{result.enemyHp}</strong>
            </p>

            {result.logPreview?.length > 0 && (
              <>
                <h3 style={{ marginTop: "0.75rem" }}>Battle log (preview)</h3>
                <ul className="log-list">
                  {result.logPreview.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="actions" style={{ marginTop: "1rem" }}>
              <button
                className="btn-primary"
                onClick={onSubmitOnchain}
                disabled={submitting || !walletConnected}
              >
                {submitting
                  ? "Submitting..."
                  : walletConnected
                  ? "Submit Score Onchain"
                  : "Connect wallet to submit"}
              </button>

              <button
                className="btn-secondary"
                style={{ marginTop: "0.5rem" }}
                onClick={onShare}
                disabled={!result}
              >
                {shareCopied ? "Copied share text!" : "Copy share text"}
              </button>

              <button
                className="btn-secondary"
                style={{ marginTop: "0.5rem" }}
                onClick={onPlayAgain}
              >
                Play again
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
