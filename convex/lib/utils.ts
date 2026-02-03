/**
 * Shared utility functions for Convex backend
 */

/**
 * Get the start of the UTC day for a given timestamp
 */
function startOfUTCDay(ts: number): number {
    const d = new Date(ts);
    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/**
 * Check if two timestamps are on the same day (UTC)
 */
export function isSameDay(ts1: number, ts2: number): boolean {
    return startOfUTCDay(ts1) === startOfUTCDay(ts2);
}

/**
 * Check if ts1 is yesterday relative to ts2 (UTC)
 */
export function isYesterday(ts1: number, ts2: number): boolean {
    const day1 = startOfUTCDay(ts1);
    const day2 = startOfUTCDay(ts2);
    return day1 + 24 * 60 * 60 * 1000 === day2;
}

/**
 * Add days to a timestamp
 */
export function addDays(timestamp: number, days: number): number {
    return timestamp + days * 24 * 60 * 60 * 1000;
}

/**
 * Clean data for Convex insertion (null -> undefined)
 */
export function cleanData<T extends Record<string, any>>(data: T): T {
    const cleaned = { ...data };
    for (const key in cleaned) {
        if (cleaned[key] === null) {
            delete cleaned[key];
        }
    }
    return cleaned;
}
