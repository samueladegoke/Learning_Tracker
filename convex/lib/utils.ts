/**
 * Shared utility functions for Convex backend
 */

/**
 * Check if two timestamps are on the same day (UTC)
 */
export function isSameDay(ts1: number, ts2: number): boolean {
    const d1 = new Date(ts1);
    const d2 = new Date(ts2);
    return (
        d1.getUTCFullYear() === d2.getUTCFullYear() &&
        d1.getUTCMonth() === d2.getUTCMonth() &&
        d1.getUTCDate() === d2.getUTCDate()
    );
}

/**
 * Check if ts1 is yesterday relative to ts2 (UTC)
 */
export function isYesterday(ts1: number, ts2: number): boolean {
    const d1 = new Date(ts1);
    const d1PlusOne = new Date(d1.getTime() + 24 * 60 * 60 * 1000);
    const d2 = new Date(ts2);
    return (
        d1PlusOne.getUTCFullYear() === d2.getUTCFullYear() &&
        d1PlusOne.getUTCMonth() === d2.getUTCMonth() &&
        d1PlusOne.getUTCDate() === d2.getUTCDate()
    );
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
