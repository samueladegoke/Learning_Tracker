import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Flame, Coins, Zap, Activity, ChevronRight } from 'lucide-react'
import { calculateXpProgress } from '../utils/xpUtils'

const Counter = ({ value, className = "" }) => (
    <div className={`relative overflow-hidden inline-flex flex-col h-[1.2em] min-w-[1ch] ${className}`}>
        <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
                key={value}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "-100%", opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="absolute inset-0 flex items-center justify-center font-mono"
            >
                {value}
            </motion.span>
        </AnimatePresence>
        <span className="invisible font-mono">{value}</span>
    </div>
)

const CharacterCard = ({ rpgState, progress }) => {
    if (!rpgState) return null

    const xpProgress = calculateXpProgress(rpgState.xp, rpgState.level, rpgState.next_level_xp)
    const xpPercent = xpProgress.percent

    // Determine Class based on level
    const getCharacterClass = (level) => {
        if (level < 5) return "Novice Coder"
        if (level < 10) return "Apprentice Dev"
        if (level < 20) return "Code Warrior"
        return "Tech Archmage"
    }

    return (
        <div className="clay-card p-5 rounded-3xl relative overflow-hidden">
            {/* Decorative Screws/Rivets */}
            <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-surface-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5),1px_1px_0px_rgba(255,255,255,0.1)] opacity-50"></div>
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-surface-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5),1px_1px_0px_rgba(255,255,255,0.1)] opacity-50"></div>
            <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-surface-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5),1px_1px_0px_rgba(255,255,255,0.1)] opacity-50"></div>
            <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-surface-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.5),1px_1px_0px_rgba(255,255,255,0.1)] opacity-50"></div>

            {/* Header / Identity */}
            <div className="flex items-center gap-4 mb-5 relative z-10">
                <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl clay-inset overflow-hidden border-2 border-surface-700/50">
                        <img 
                            src={`${import.meta.env.BASE_URL}assets/avatar.png`} 
                            alt="Avatar" 
                            className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" 
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-primary-500 rounded-lg shadow-neon-glow flex items-center justify-center text-surface-900 font-bold text-xs border border-primary-400 z-20">
                        {rpgState.level}
                    </div>
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <h2 className="text-lg font-bold text-surface-200 truncate tracking-tight">
                            {getCharacterClass(rpgState.level)}
                        </h2>
                        <div className="flex gap-0.5">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <Heart 
                                    key={i} 
                                    className={`w-3.5 h-3.5 ${i < (rpgState.hearts ?? 3) ? 'text-red-500 fill-red-500 drop-shadow-[0_0_3px_rgba(239,68,68,0.5)]' : 'text-surface-600 fill-surface-800'}`} 
                                />
                            ))}
                        </div>
                    </div>
                    
                    {/* XP Bar Container */}
                    <div className="relative">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-primary-400/70 mb-1">
                            <span>Lvl {rpgState.level}</span>
                            <span className="font-mono">{Math.round(xpPercent)}%</span>
                        </div>
                        <div className="h-3 clay-inset rounded-full overflow-hidden bg-surface-900/80">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpPercent}%` }}
                                transition={{ type: "spring", stiffness: 50, damping: 15 }}
                                className="h-full bg-primary-500 shadow-neon-glow relative"
                            >
                                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] w-full h-full animate-[shimmer_2s_infinite]"></div>
                            </motion.div>
                        </div>
                        <div className="text-[9px] font-mono text-surface-500 text-right mt-1">
                            <Counter value={xpProgress.xpIntoLevel} /> / {xpProgress.levelCost} XP
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid - The "Console" Readouts */}
            <div className="grid grid-cols-3 gap-3 relative z-10">
                {/* Streak */}
                <div className="clay-inset rounded-xl p-2 flex flex-col items-center justify-center group hover:bg-surface-900/80 transition-colors">
                    <div className="mb-1">
                        <Flame className="w-4 h-4 text-orange-500 fill-orange-500 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]" />
                    </div>
                    <div className="text-[10px] text-surface-500 uppercase tracking-wider font-bold mb-0.5">Streak</div>
                    <div className="text-lg font-mono font-bold text-surface-200 leading-none">
                        <Counter value={rpgState.streak} />
                    </div>
                </div>

                {/* Gold */}
                <div className="clay-inset rounded-xl p-2 flex flex-col items-center justify-center group hover:bg-surface-900/80 transition-colors">
                    <div className="mb-1">
                        <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400/20 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]" />
                    </div>
                    <div className="text-[10px] text-surface-500 uppercase tracking-wider font-bold mb-0.5">Gold</div>
                    <div className="text-lg font-mono font-bold text-yellow-400 leading-none">
                        <Counter value={rpgState.gold} />
                    </div>
                </div>

                {/* Focus */}
                <div className="clay-inset rounded-xl p-2 flex flex-col items-center justify-center group hover:bg-surface-900/80 transition-colors">
                    <div className="mb-1">
                        <Zap className="w-4 h-4 text-blue-400 fill-blue-400 drop-shadow-[0_0_5px_rgba(96,165,250,0.5)]" />
                    </div>
                    <div className="text-[10px] text-surface-500 uppercase tracking-wider font-bold mb-0.5">Focus</div>
                    <div className="text-lg font-mono font-bold text-blue-400 leading-none flex items-baseline gap-0.5">
                        <Counter value={rpgState.focus_points} />
                        <span className="text-[10px] text-surface-600">/{rpgState.focus_cap}</span>
                    </div>
                </div>
            </div>
            
            {/* Decorative Scanline */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-20 bg-[length:100%_2px,3px_100%] opacity-20"></div>
        </div>
    )
}

export default CharacterCard
