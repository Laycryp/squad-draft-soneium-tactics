// frontend/src/screens/ResultScreen.tsx

import type { SimulationResponse } from "../App";

type Props = {
  result: SimulationResponse | null;
  error: string | null;
  onSubmitOnchain: () => void;
  submitting: boolean;
  walletConnected: boolean;
  onShare: () => void;
  shareCopied: boolean;
  onPlayAgain: () => void;
};

const ResultScreen = ({
  result,
  error,
  onSubmitOnchain,
  submitting,
  walletConnected,
  onShare,
  shareCopied,
  onPlayAgain,
}: Props) => {
  return (
    <main className="app-main">
      <section className="panel">
        <h2>Match Result</h2>

        {!result && !error && (
          <p className="muted">
            Run a simulation from the Draft screen to see your result.
          </p>
        )}

        {result && (
          <div className="result-card result-anim">
            <p>
              Outcome:{" "}
              <strong className={result.win ? "text-win" : "text-lose"}>
                {result.win ? "WIN" : "LOSS"}
              </strong>
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
                <h3>Battle log (preview)</h3>
                <ul className="log-list">
                  {result.logPreview.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}

        {error && <div className="alert alert-error">{error}</div>}
      </section>

      <section className="panel">
        <h2>Actions</h2>
        <div className="actions">
          <button
            className="btn-primary"
            onClick={onSubmitOnchain}
            disabled={submitting || !walletConnected || !result}
          >
            {submitting ? "Submitting..." : "Claim Badge / Submit Score"}
          </button>

          {!walletConnected && (
            <p className="muted" style={{ marginTop: "0.3rem" }}>
              Connect your wallet to save today&apos;s best score on Soneium.
            </p>
          )}

          <button
            type="button"
            className="btn-secondary"
            style={{ marginTop: "0.75rem", width: "100%" }}
            onClick={onShare}
            disabled={!result}
          >
            {shareCopied ? "Copied share text! ✅" : "Copy Share Text"}
          </button>

          <button
            type="button"
            className="btn-link"
            style={{ marginTop: "0.25rem" }}
            onClick={onPlayAgain}
          >
            Play again
          </button>
        </div>
      </section>
    </main>
  );
};

export default ResultScreen;
