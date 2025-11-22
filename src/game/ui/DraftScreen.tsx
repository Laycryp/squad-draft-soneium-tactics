// src/game/ui/DraftScreen.tsx
"use client";

import React from "react";
import type { UnitDefinition } from "~/game/units";

type DraftScreenProps = {
  totalCost: number;
  selectedIds: number[];
  onToggleUnit: (id: number) => void;
  canAddUnit: (id: number) => boolean;
  onSimulate: () => void;
  loading: boolean;
  error: string | null;
  units: UnitDefinition[];
  onBackToLobby: () => void;
};

const DraftScreen: React.FC<DraftScreenProps> = ({
  totalCost,
  selectedIds,
  onToggleUnit,
  canAddUnit,
  onSimulate,
  loading,
  error,
  units,
  onBackToLobby,
}) => {
  return (
    <main className="app-main">
      <section className="panel">
        <div className="panel-header-row">
          <h2>Squad Builder</h2>
          <button className="btn-link" onClick={onBackToLobby}>
            ← Back to Lobby
          </button>
        </div>

        <p className="muted">
          Budget: <strong>{totalCost}</strong> / {BUDGET} • Units:{" "}
          <strong>{selectedIds.length}</strong> / {SQUAD_SIZE}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="units-grid draft-units-grid">
          {units.map((unit) => {
            const selected = selectedIds.includes(unit.id);
            const disabled = !selected && !canAddUnit(unit.id);

            return (
              <button
                key={unit.id}
                className={`unit-card ${
                  selected ? "unit-card-selected" : ""
                } ${disabled ? "unit-card-disabled" : ""}`}
                onClick={() => onToggleUnit(unit.id)}
                disabled={disabled && !selected}
              >
                <div className="unit-header">
                  <span className="unit-name">{unit.name}</span>
                  <span className="unit-role">{unit.role}</span>
                </div>
                <div className="unit-stats">
                  <span>Cost: {unit.cost}</span>
                  <span>ATK: {unit.attack}</span>
                  <span>DEF: {unit.defense}</span>
                </div>
                <div className="unit-footer">
                  {selected
                    ? "Selected"
                    : disabled
                    ? "Can't add"
                    : "Tap to select"}
                </div>
              </button>
            );
          })}
        </div>

        <div className="actions">
          <button
            className="btn-primary"
            onClick={onSimulate}
            disabled={loading}
          >
            {loading ? "Simulating..." : "Simulate Battle"}
          </button>
        </div>
      </section>

      <section className="panel">
        <h2>Tips</h2>
        <p className="muted">
          Mix Tanks, Damage, and Support units to balance survivability and
          burst damage. Try different squads to beat the daily lineup.
        </p>
      </section>
    </main>
  );
};

import { BUDGET, SQUAD_SIZE } from "~/game/units";

export default DraftScreen;
