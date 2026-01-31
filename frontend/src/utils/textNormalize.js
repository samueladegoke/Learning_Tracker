/**
 * Shared text normalization utilities
 * Used across components that handle data from Convex/JSON sources
 */

/**
 * Normalize escaped newlines/tabs in strings from JSON/database data.
 * The database may store literal '\\n' and '\\t' sequences that need 
 * to be converted to actual newline and tab characters.
 * 
 * @param text - The text to normalize
 * @returns The text with escaped sequences converted to actual characters
 */
export function normalizeNewlines(text) {
    if (!text) return text
    return text.replace(/\\n/g, '\n').replace(/\\t/g, '\t')
}

/**
 * Check if text contains escaped newlines that need normalization
 * @param text - The text to check
 * @returns true if text contains escaped newline sequences
 */
export function hasEscapedNewlines(text) {
    if (!text) return false
    return text.includes('\\n') || text.includes('\\t')
}
