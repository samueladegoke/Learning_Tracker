import { Sparkles, CheckCircle } from 'lucide-react'

export function DaySelector({ activeDay, setActiveDay, completedQuizzes, dayMeta }) {
    // L2 Fix: Use env variable with fallback for deployment flexibility
    const PROJECT_START_DATE = new Date(import.meta.env.VITE_PROJECT_START_DATE || '2025-11-20')

    // Derive max available day from dayMeta keys
    const maxAvailableDay = Math.max(
        ...Object.keys(dayMeta).map(key => parseInt(key.split('-')[1], 10))
    )

    // Calculate current day based on date (for Jump to Today)
    const getTodayKey = () => {
        const now = new Date()
        const diffDays = Math.floor((now - PROJECT_START_DATE) / (1000 * 60 * 60 * 24))
        const day = Math.min(maxAvailableDay, Math.max(1, diffDays + 1))
        return `day-${day}`
    }

    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
            <div className="flex-1 overflow-hidden">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xs font-bold text-surface-500 uppercase tracking-widest">Chronicles of Code</h2>
                    <button
                        onClick={() => setActiveDay(getTodayKey())}
                        className="text-[10px] font-bold text-primary-400 hover:text-primary-300 uppercase tracking-tight flex items-center gap-1 px-2 py-1 rounded bg-primary-400/10 transition-colors"
                    >
                        <Sparkles className="w-3 h-3" /> Jump to Today
                    </button>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-surface-700">
                    {Object.entries(dayMeta).map(([key, meta]) => {
                        const isCompleted = completedQuizzes.includes(meta.quizId)
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveDay(key)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap flex items-center gap-2 border ${activeDay === key
                                    ? 'bg-primary-500/10 text-primary-400 border-primary-500/50 scale-105 shadow-lg shadow-primary-900/20'
                                    : 'text-surface-400 border-transparent hover:text-surface-200 hover:bg-surface-800/50'
                                    }`}
                            >
                                {meta.label}
                                {isCompleted && (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
