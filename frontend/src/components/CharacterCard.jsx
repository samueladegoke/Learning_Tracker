import React from 'react'
import { motion } from 'framer-motion'
import ProgressBar from './ProgressBar'
import { Heart, Flame, Coins, Zap } from 'lucide-react'
import { calculateXpProgress } from '../utils/xpUtils'

const CharacterCard = ({ rpgState, progress }) => {
    if (!rpgState) return null

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
                                        <Heart className="w-5 h-5 text-red-500 fill-red-500 inline-block" />
                                    </span>
                                ))}
                            </div>
                            <div className="text-xs text-surface-500 uppercase tracking-wider">Lives</div>
                        </div>
                    </div>

                    {/* XP Bar */}
                    <div className="mb-4">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-primary-400/80 mb-2">
                            <span>Progress to Level {rpgState.level + 1}</span>
                            <span>{Math.round(xpPercent)}%</span>
                        </div>
                        <div className="h-4 bg-surface-900 rounded-full overflow-hidden border border-surface-700/50 shadow-inner p-0.5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpPercent}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-primary-600 via-primary-400 to-primary-300 rounded-full relative group"
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:40px_40px] animate-[shimmer_2s_linear_infinite]"></div>
                                <div className="absolute inset-0 shadow-[0_0_15px_rgba(59,130,246,0.5)] rounded-full"></div>
                                <div className="absolute inset-0 bg-white/20 animate-pulse-slow rounded-full"></div>
                            </motion.div>
                        </div>
                        <div className="flex justify-between text-[10px] font-mono text-surface-500 mt-1.5 px-1">
                            <span>{xpProgress.xpIntoLevel} XP</span>
                            <span>{xpProgress.levelCost} XP needed</span>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-surface-800/50 rounded-lg p-2 text-center border border-surface-700/30">
                            <div className="mb-1 flex justify-center"><Flame className="w-5 h-5 text-orange-500 fill-orange-500" /></div>
                            <div className="text-xs text-surface-400">Streak</div>
                            <div className="font-bold text-surface-200">{rpgState.streak}</div>
                        </div>
                        <div className="bg-surface-800/50 rounded-lg p-2 text-center border border-surface-700/30">
                            <div className="mb-1 flex justify-center"><Coins className="w-5 h-5 text-yellow-500" /></div>
                            <div className="text-xs text-surface-400">Gold</div>
                            <div className="font-bold text-yellow-500">{rpgState.gold}</div>
                        </div>
                        <div className="bg-surface-800/50 rounded-lg p-2 text-center border border-surface-700/30">
                            <div className="mb-1 flex justify-center"><Zap className="w-5 h-5 text-blue-400 fill-blue-400" /></div>
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
