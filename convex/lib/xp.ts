/**
 * XP and Level Utilities for Gamification
 * ========================================
 * Ported EXACTLY from backend/app/utils/gamification.py
 * 
 * CRITICAL: Do NOT change these formulas - they must match backend exactly.
 */

// Constants - MUST match backend
export const XP_BASE = 100;
export const XP_EXPONENT = 1.2;
export const FOCUS_CAP = 5;

/**
 * Calculate XP required to complete a given level.
 * Formula: 100 * level^1.2 (soft exponential curve)
 */
export function xpForNextLevel(level: number): number {
  return Math.floor(XP_BASE * Math.pow(level, XP_EXPONENT));
}

/**
 * Calculate level based on total XP.
 * Iterates through levels until XP is exhausted.
 */
export function levelFromXp(xp: number): number {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpForNextLevel(level)) {
    remaining -= xpForNextLevel(level);
    level += 1;
  }
  return level;
}

/**
 * Calculate XP required to complete the current level.
 */
export function nextLevelRequirement(xp: number): number {
  const level = levelFromXp(xp);
  return xpForNextLevel(level);
}

/**
 * Calculate total XP required to reach a given level from level 1.
 */
export function cumulativeXpToLevel(level: number): number {
  if (level <= 1) return 0;
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForNextLevel(i);
  }
  return total;
}

// Difficulty multipliers - MUST match backend DIFFICULTY_MULTIPLIER
export const DIFFICULTY_MULTIPLIER: Record<string, number> = {
  trivial: 0.5,
  normal: 1.0,
  hard: 1.5,
  boss: 2.0,
};

// Reward multipliers for badges/achievements - MUST match backend
export const REWARD_MULTIPLIER: Record<string, number> = {
  trivial: 1.0,
  normal: 1.0,
  hard: 1.5,
  epic: 2.0,
};

// Streak badge thresholds - MUST match backend STREAK_BADGES
export const STREAK_BADGES: Record<number, string> = {
  3: "b-streak-3",
  7: "b-streak-7",
  14: "b-streak-14",
  30: "b-streak-30",
};

// Task count achievement thresholds
export const TASK_ACHIEVEMENTS: Array<[number, string]> = [
  [1, "a-first-task"],
  [10, "a-ten-tasks"],
  [50, "a-fifty-tasks"],
  [100, "a-hundred-tasks"],
];
