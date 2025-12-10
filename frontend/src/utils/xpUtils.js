/**
 * Calculates XP progress towards the next level.
 * @param {number} totalXp - The user's total XP.
 * @param {number} currentLevel - The user's current level.
 * @param {number} [nextLevelCost] - Optional specific cost for next level. Use -1 or null to calculate based on curve.
 * @returns {object} { percent: number, levelCost: number, remaining: number, xpIntoLevel: number }
 */
export const calculateXpProgress = (totalXp = 0, currentLevel = 1, nextLevelCost) => {
    // Standard exponential curve: 100 * (level^1.2)
    const xpNeeded = (!nextLevelCost || nextLevelCost === -1)
        ? Math.floor(100 * Math.pow(currentLevel, 1.2))
        : nextLevelCost

    // Calculate cumulative XP required to reach current level
    let cumulativeXpToCurrentLevel = 0
    for (let lvl = 1; lvl < currentLevel; lvl++) {
        cumulativeXpToCurrentLevel += Math.floor(100 * Math.pow(lvl, 1.2))
    }

    // XP earned within the current level
    const xpIntoLevel = Math.max(0, totalXp - cumulativeXpToCurrentLevel)

    // Calculate percentage progress toward next level
    const percent = xpNeeded > 0 ? Math.min(100, Math.floor((xpIntoLevel / xpNeeded) * 100)) : 0

    return {
        percent,
        levelCost: xpNeeded,
        remaining: Math.max(0, xpNeeded - xpIntoLevel),
        xpIntoLevel
    }
}
