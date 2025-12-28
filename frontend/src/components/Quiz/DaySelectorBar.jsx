import React from 'react'
import { Sparkles, CheckCircle, Flame } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DAY_META } from '@/data/dayMeta.js'

function DaySelectorBar({
    activeDay,
    setActiveDay,
    completedQuizzes,
    onJumpToToday,
    todayKey
}) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold text-surface-500 uppercase tracking-widest">Chronicles of Code</h2>
                    <button
                        onClick={onJumpToToday}
                        className="text-[10px] font-bold text-primary-400 hover:text-primary-300 uppercase tracking-tight flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-400/15 border border-primary-500/30 transition-all hover:bg-primary-400/25 hover:border-primary-500/50 animate-pulse-slow shadow-sm shadow-primary-500/20"
                        aria-label="Jump to today's lesson"
                    >
                        <Flame className="w-3 h-3" /> Today
                    </button>
                </div>
                <TooltipProvider delayDuration={300}>
                    <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-surface-700 snap-x snap-mandatory scroll-smooth -mx-2 px-2">
                        {Object.entries(DAY_META).map(([key, meta]) => {
                            const isCompleted = completedQuizzes.includes(meta.quizId)
                            const isToday = key === todayKey
                            const isActive = activeDay === key

                            return (
                                <Tooltip key={key}>
                                    <TooltipTrigger asChild>
                                        <button
                                            onClick={() => setActiveDay(key)}
                                            aria-label={`Day ${meta.label}: ${meta.title}`}
                                            aria-current={isActive ? 'true' : undefined}
                                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 sm:gap-2 border snap-start min-w-[3.5rem] sm:min-w-fit relative ${isActive
                                                ? 'bg-primary-500/15 text-primary-400 border-primary-500/50 scale-105 shadow-lg shadow-primary-500/25'
                                                : isToday
                                                    ? 'bg-accent-500/10 text-accent-400 border-accent-500/40 hover:bg-accent-500/20'
                                                    : 'text-surface-400 border-transparent hover:text-surface-200 hover:bg-surface-800/50 active:bg-surface-700/50'
                                                }`}
                                        >
                                            {isToday && !isActive && (
                                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-500 rounded-full animate-pulse" />
                                            )}
                                            {meta.label}
                                            {isCompleted && (
                                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                                            )}
                                        </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="bg-surface-800 text-surface-100 border border-surface-700">
                                        <p className="font-medium">{meta.title}</p>
                                        <p className="text-xs text-surface-400">{meta.level}</p>
                                        {isToday && <p className="text-xs text-accent-400 font-medium">Today's Lesson</p>}
                                    </TooltipContent>
                                </Tooltip>
                            )
                        })}
                    </div>
                </TooltipProvider>
            </div>
        </div>
    )
}

export default DaySelectorBar
