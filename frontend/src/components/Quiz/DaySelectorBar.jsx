import React, { useState, useRef, useEffect } from 'react'
import { CheckCircle, Flame, Search, ChevronDown, X } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DAY_META } from '@/data/dayMeta.js'

function DaySelectorBar({
    activeDay,
    setActiveDay,
    completedQuizzes,
    onJumpToToday,
    todayKey
}) {
    const [showSearch, setShowSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const searchRef = useRef(null)
    const inputRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false)
                setSearchQuery('')
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Focus input when dropdown opens
    useEffect(() => {
        if (showSearch && inputRef.current) {
            inputRef.current.focus()
        }
    }, [showSearch])

    const filteredDays = Object.entries(DAY_META).filter(([key, meta]) => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
            meta.label.toLowerCase().includes(query) ||
            meta.title.toLowerCase().includes(query) ||
            meta.level.toLowerCase().includes(query) ||
            meta.topics?.some(t => t.toLowerCase().includes(query))
        )
    })

    const currentMeta = DAY_META[activeDay]

    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3 gap-2">
                    <h2 className="text-xs font-bold text-surface-500 uppercase tracking-widest">Chronicles of Code</h2>
                    <div className="flex items-center gap-2">
                        {/* Quick Jump Dropdown */}
                        <div ref={searchRef} className="relative">
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="text-[10px] font-bold text-surface-400 hover:text-surface-200 uppercase tracking-tight flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-800 border border-surface-700 transition-all hover:bg-surface-700 hover:border-surface-600"
                                aria-label="Quick jump to day"
                            >
                                <Search className="w-3 h-3" />
                                <span className="hidden sm:inline">{currentMeta?.label || 'Jump'}</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${showSearch ? 'rotate-180' : ''}`} />
                            </button>

                            {showSearch && (
                                <div className="absolute top-full mt-2 left-0 w-72 max-h-80 bg-surface-800 border border-surface-700 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="p-3 border-b border-surface-700">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500" />
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search by day, topic, level..."
                                                className="w-full pl-10 pr-8 py-2 bg-surface-900 border border-surface-600 rounded-lg text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50"
                                            />
                                            {searchQuery && (
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-surface-500 hover:text-surface-300"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-700">
                                        {filteredDays.length === 0 ? (
                                            <div className="p-4 text-center text-surface-500 text-sm">
                                                No days found matching "{searchQuery}"
                                            </div>
                                        ) : (
                                            filteredDays.map(([key, meta]) => {
                                                const isCompleted = completedQuizzes.includes(meta.quizId)
                                                const isActive = activeDay === key
                                                const isToday = key === todayKey
                                                return (
                                                    <button
                                                        key={key}
                                                        onClick={() => {
                                                            setActiveDay(key)
                                                            setShowSearch(false)
                                                            setSearchQuery('')
                                                        }}
                                                        className={`w-full text-left px-4 py-3 flex items-center justify-between gap-2 transition-colors border-b border-surface-700/50 last:border-0 ${isActive
                                                            ? 'bg-primary-500/10 text-primary-400'
                                                            : 'hover:bg-surface-700/50 text-surface-200'
                                                            }`}
                                                    >
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-semibold text-sm">{meta.label}</span>
                                                                {isToday && (
                                                                    <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-accent-500/20 text-accent-400 rounded">Today</span>
                                                                )}
                                                            </div>
                                                            <p className="text-xs text-surface-400 truncate">{meta.title.replace(/^Day \d+: /, '')}</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 flex-shrink-0">
                                                            <span className="text-[10px] text-surface-500 uppercase">{meta.level}</span>
                                                            {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
                                                        </div>
                                                    </button>
                                                )
                                            })
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={onJumpToToday}
                            className="text-[10px] font-bold text-primary-400 hover:text-primary-300 uppercase tracking-tight flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-400/15 border border-primary-500/30 transition-all hover:bg-primary-400/25 hover:border-primary-500/50 animate-pulse-slow shadow-sm shadow-primary-500/20"
                            aria-label="Jump to today's lesson"
                        >
                            <Flame className="w-3 h-3" /> Today
                        </button>
                    </div>
                </div>
                {!showSearch && (
                    <TooltipProvider delayDuration={300}>
                        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-surface-700 snap-x snap-mandatory scroll-smooth">
                            {Object.entries(DAY_META).map(([key, meta]) => {
                                const isCompleted = completedQuizzes.includes(meta.quizId)
                                const isToday = key === todayKey
                                const isActive = activeDay === key

                                return (
                                    <Tooltip key={key}>
                                        <TooltipTrigger asChild>
                                            <button
                                                onClick={() => setActiveDay(key)}
                                                aria-label={meta.title}
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
                )}
            </div>
        </div>
    )
}

export default DaySelectorBar
