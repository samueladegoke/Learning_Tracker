export const XP_BASE = 100;
export const XP_EXPONENT = 1.2;
export const FOCUS_CAP = 5;

// Pure functions
export function xpForNextLevel(level: number): number {
    return Math.floor(XP_BASE * Math.pow(level, XP_EXPONENT));
}

export function levelFromXp(xp: number): number {
    let level = 1;
    let remaining = xp;
    while (remaining >= xpForNextLevel(level)) {
        remaining -= xpForNextLevel(level);
        level++;
    }
    return level;
}

// Database helper functions (require context-like objects or just modify objects)
// Since we can't pass `ctx` easily to pure functions, we'll return updates or take objects

export function calculateStreakUpdate(
    lastCheckinAt: number | undefined | null,
    currentStreak: number
): { streak: number; lastCheckinAt: number } {
    const now = Date.now();
    // UTC day calculation
    const getDay = (ts: number) => Math.floor(ts / (24 * 60 * 60 * 1000));

    const todayVal = getDay(now);
    const lastVal = lastCheckinAt ? getDay(lastCheckinAt) : -1;

    let newStreak = currentStreak;

    if (lastVal === todayVal) {
        // Already checked in
    } else if (lastVal === todayVal - 1) {
        newStreak += 1;
    } else {
        newStreak = 1; // Reset or first time
    }

    return { streak: newStreak, lastCheckinAt: now };
}

export const DIFFICULTY_MULTIPLIER: Record<string, number> = {
    "trivial": 0.5,
    "easy": 0.5,
    "normal": 1.0,
    "medium": 1.0,
    "hard": 1.5,
    "boss": 2.0,
};
