// src/game/units.ts

export type Role = "Tank" | "Damage" | "Support" | "Hybrid";

export interface UnitDefinition {
  id: number;
  name: string;
  role: Role;
  cost: number;
  attack: number;
  defense: number;
}

export const BUDGET = 150;
export const SQUAD_SIZE = 6;

export const UNITS: UnitDefinition[] = [
  {
    id: 1,
    name: "Ironwall Sentinel",
    role: "Tank",
    cost: 24,
    attack: 3,
    defense: 9,
  },
  {
    id: 2,
    name: "Mirror Guard",
    role: "Tank",
    cost: 18,
    attack: 4,
    defense: 7,
  },
  {
    id: 3,
    name: "Blade Runner",
    role: "Damage",
    cost: 22,
    attack: 9,
    defense: 3,
  },
  {
    id: 4,
    name: "Arc Sniper",
    role: "Damage",
    cost: 20,
    attack: 8,
    defense: 3,
  },
  {
    id: 5,
    name: "Chaos Brawler",
    role: "Damage",
    cost: 16,
    attack: 7,
    defense: 4,
  },
  {
    id: 6,
    name: "Field Medic",
    role: "Support",
    cost: 18,
    attack: 2,
    defense: 6,
  },
  {
    id: 7,
    name: "Shield Caster",
    role: "Support",
    cost: 20,
    attack: 3,
    defense: 5,
  },
  {
    id: 8,
    name: "Vanguard Captain",
    role: "Hybrid",
    cost: 22,
    attack: 6,
    defense: 6,
  },
  {
    id: 9,
    name: "Skirmisher",
    role: "Hybrid",
    cost: 14,
    attack: 5,
    defense: 4,
  },
  {
    id: 10,
    name: "Data Oracle",
    role: "Hybrid",
    cost: 16,
    attack: 3,
    defense: 5,
  },
];

export const unitsById: Record<number, UnitDefinition> = UNITS.reduce(
  (acc, unit) => {
    acc[unit.id] = unit;
    return acc;
  },
  {} as Record<number, UnitDefinition>
);
