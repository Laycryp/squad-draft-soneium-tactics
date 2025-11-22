// src/game/simulateBattle.ts

import { unitsById, UnitDefinition } from "./units";

export type SimulationResult = {
  win: boolean;
  score: number;
  rounds: number;
  friendlyHp: number;
  enemyHp: number;
  logPreview: string[];
};

type SideUnit = {
  def: UnitDefinition;
  currentHp: number;
};

const BASE_UNIT_HP = 12; // HP أعلى لفرق أكبر
const MAX_ROUNDS = 12;   // جولات أكثر لتمييز الاستراتيجيات

function createSide(ids: number[]): SideUnit[] {
  return ids.map((id) => {
    const def = unitsById[id];
    if (!def) {
      throw new Error(`Unknown unit id: ${id}`);
    }
    return {
      def,
      currentHp: BASE_UNIT_HP,
    };
  });
}

function totalHp(side: SideUnit[]): number {
  return side.reduce((sum, u) => sum + Math.max(0, u.currentHp), 0);
}

export function simulateBattle(squadIds: number[]): SimulationResult {
  const friendly = createSide(squadIds);

  // خصم ثابت من 6 وحدات (يمكن تغييره لكل "سيزون" لاحقًا)
  const enemyIds = [1, 2, 3, 4, 5, 6];
  const enemy = createSide(enemyIds);

  const log: string[] = [];
  log.push("Battle start: Squad Draft vs Daily Lineup");

  // Buffs بسيطة حسب التركيب (تعطي عمق استراتيجي بدون تعقيد كبير)
  const friendlyDamageCount = friendly.filter(
    (u) => u.def.role === "Damage"
  ).length;
  const enemyDamageCount = enemy.filter((u) => u.def.role === "Damage").length;

  const friendlyBuffAtk =
    friendlyDamageCount >= 4 ? 2 : friendlyDamageCount >= 2 ? 1 : 0;
  const enemyBuffAtk =
    enemyDamageCount >= 4 ? 2 : enemyDamageCount >= 2 ? 1 : 0;

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    log.push(`--- Round ${round} ---`);

    // هجوم اللاعب أولاً
    for (const f of friendly) {
      if (f.currentHp <= 0) continue;
      const target = enemy.find((e) => e.currentHp > 0);
      if (!target) break;

      const atk = f.def.attack + friendlyBuffAtk;
      const def = target.def.defense;
      const dmg = Math.max(1, atk - Math.floor(def / 2));
      target.currentHp -= dmg;

      log.push(
        `Player ${f.def.name} hits ${target.def.name} for ${dmg} dmg.`
      );
    }

    // هجوم الخصم
    for (const e of enemy) {
      if (e.currentHp <= 0) continue;
      const target = friendly.find((f) => f.currentHp > 0);
      if (!target) break;

      const atk = e.def.attack + enemyBuffAtk;
      const def = target.def.defense;
      const dmg = Math.max(1, atk - Math.floor(def / 2));
      target.currentHp -= dmg;

      log.push(
        `Enemy ${e.def.name} hits ${target.def.name} for ${dmg} dmg.`
      );
    }

    const friendlyAlive = friendly.some((f) => f.currentHp > 0);
    const enemyAlive = enemy.some((e) => e.currentHp > 0);

    if (!friendlyAlive || !enemyAlive) {
      log.push("Battle ended early due to one side being wiped.");
      break;
    }
  }

  const friendlyHp = totalHp(friendly);
  const enemyHp = totalHp(enemy);

  const win = friendlyHp > enemyHp;
  const rounds =
    log.filter((l) => l.startsWith("--- Round")).length || MAX_ROUNDS;

  const survivingFriendly = friendly.filter((u) => u.currentHp > 0).length;
  const survivingEnemy = enemy.filter((u) => u.currentHp > 0).length;

  // سكور أعمق:
  // - فرق HP
  // - عدد الوحدات الباقية
  // - سرعة إنهاء المعركة
  // - بونص الفوز
  let rawScore = 0;

  // فرق HP
  rawScore += friendlyHp - enemyHp;

  // وحدات باقية
  rawScore += survivingFriendly * 12; // كل وحدة صامدة تعطي بونص محترم
  rawScore -= survivingEnemy * 6;

  // أسرع فوز = سكّور أعلى
  const speedBonus = MAX_ROUNDS - rounds + 1; // لو انتهت في راند 1 → bonus أعلى
  rawScore += speedBonus * 4;

  // بونص الفوز
  if (win) {
    rawScore += 40;
  }

  // نضمن أن السكور النهائي دائمًا >= 100
  // ونكبّر المجال للدرجات لفروق استراتيجية أكبر
  const score = 100 + Math.max(0, Math.floor(rawScore * 1.5));

  const logPreview = log.slice(0, 15);

  return {
    win,
    score,
    rounds,
    friendlyHp,
    enemyHp,
    logPreview,
  };
}
