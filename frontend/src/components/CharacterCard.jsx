import React from 'react'
import ProgressBar from './ProgressBar'

const CharacterCard = ({ rpgState, progress }) => {
    if (!rpgState) return null

    const xpNeededForLevel = (level) => Math.floor(100 * Math.pow(level, 1.2))

    const calculateXpProgress = (totalXp = 0, currentLevel = 1, nextLevelCost) => {
        const level = Math.max(currentLevel || 1, 1)
        const levelCost = nextLevelCost || xpNeededForLevel(level)

        let xpSpent = 0
        for (let lvl = 1; lvl < level; lvl += 1) {
            xpSpent += xpNeededForLevel(lvl)
        }

        const xpIntoLevel = Math.max(Math.min(totalXp - xpSpent, levelCost || 0), 0)
        const percent = levelCost ? Math.min(Math.max((xpIntoLevel / levelCost) * 100, 0), 100) : 0

        return {
            percent,
            xpIntoLevel,
            levelCost: levelCost || 1,
        }
    }

    const xpProgress = calculateXpProgress(rpgState.xp, rpgState.level, rpgState.next_level_xp)
    const xpPercent = xpProgress.percent

    // Determine Class based on level (Simple logic for now)
    const getCharacterClass = (level) => {
        if (level < 5) return "Novice Coder"
        if (level < 10) return "Apprentice Developer"
        if (level < 20) return "Code Warrior"
        return "Tech Archmage"
    }

    return (
        <div className="card p-6 relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
                {/* Avatar Section */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-2xl bg-surface-800 border-2 border-primary-500/30 flex items-center justify-center shadow-lg shadow-primary-900/20 overflow-hidden">
                        <img src="/assets/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-surface-900 rounded-lg border border-surface-700 flex items-center justify-center text-xs font-bold text-primary-400 shadow-sm">
                        {rpgState.level}
                    </div>
                </div>

                {/* Stats Section */}
                <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h2 className="text-2xl font-bold text-surface-100">{getCharacterClass(rpgState.level)}</h2>
                            <p className="text-surface-500 text-sm">Level {rpgState.level} Character</p>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-1 justify-end mb-1">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <span key={i} className={`text-xl ${i < (rpgState.hearts ?? 3) ? 'grayscale-0' : 'grayscale opacity-30'}`}>
                                        ❤️
                                    </span>
                                ))}
                            </div>
                            <div className="text-xs text-surface-500 uppercase tracking-wider">Lives</div>
                        </div>
                    </div>

                    {/* XP Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs text-surface-400 mb-1.5">
                            <span>Progress to Level {rpgState.level + 1}</span>
                            <span>{Math.round(xpPercent)}%</span>
                        </div>
                        <div className="h-3 bg-surface-800 rounded-full overflow-hidden border border-surface-700/50">
                            <div
                                className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-1000 ease-out relative"
                                style={{ width: `${xpPercent}%` }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse-slow"></div>
                            </div>
                        </div>
                        <div className="flex justify-between text-[10px] text-surface-600 mt-1">
                            <span>{xpProgress.xpIntoLevel} XP</span>
                            <span>{xpProgress.levelCost} XP needed</span>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-surface-800/50 rounded-lg p-2 text-center border border-surface-700/30">
                            <div className="text-lg mb-1">🔥</div>
                            <div className="text-xs text-surface-400">Streak</div>
                            <div className="font-bold text-surface-200">{rpgState.streak}</div>
                        </div>
                        <div className="bg-surface-800/50 rounded-lg p-2 text-center border border-surface-700/30">
                            <div className="text-lg mb-1">💰</div>
                            <div className="text-xs text-surface-400">Gold</div>
                            <div className="font-bold text-yellow-500">{rpgState.gold}</div>
                        </div>
                        <div className="bg-surface-800/50 rounded-lg p-2 text-center border border-surface-700/30">
                            <div className="text-lg mb-1">⚡</div>
                            <div className="text-xs text-surface-400">Focus</div>
                            <div className="font-bold text-blue-400">{rpgState.focus_points}/{rpgState.focus_cap}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CharacterCard
