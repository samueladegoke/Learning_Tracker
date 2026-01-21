import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, RefreshCw, Sparkles, ChevronRight, AlertCircle, Trophy } from 'lucide-react'
import { srsAPI } from '../api/client'

/**
 * DailyReviewWidget - Displays the Spaced Repetition "Combat Training" widget on the Dashboard.
 * Shows due review questions and links to the review session.
 */
function DailyReviewWidget() {
    const [srsStats, setSrsStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSrsStats = async () => {
            try {
                setLoading(true)
                const stats = await srsAPI.getStats()
                setSrsStats(stats)
            } catch (err) {
                console.error('[SRS] Error fetching stats:', err)
                // Don't show error if no reviews exist yet
                if (!err.message.includes('not found')) {
                    setError(err.message)
                }
                setSrsStats({ total_in_queue: 0, mastered_count: 0, due_now: 0 })
            } finally {
                setLoading(false)
            }
        }
        fetchSrsStats()
    }, [])

    if (loading) {
        return (
            <div className="card p-6 border-purple-500/20 bg-gradient-to-br from-purple-900/10 to-surface-900">
                <div className="flex items-center gap-3 text-purple-400">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span className="text-sm font-mono">Loading memory training...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="card p-6 border-rose-500/20 bg-gradient-to-br from-rose-900/10 to-surface-900">
                <div className="flex items-center gap-3 text-rose-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{error}</span>
                </div>
            </div>
        )
    }

    const { total_in_queue, mastered_count, due_now } = srsStats || { total_in_queue: 0, mastered_count: 0, due_now: 0 }

    // If queue is empty, show a proactive onboarding state instead of null
    const isEmpty = total_in_queue === 0

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`card p-6 border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-surface-900 shadow-[0_0_20px_rgba(147,51,234,0.1)] relative overflow-hidden group ${isEmpty ? 'opacity-80' : ''}`}
        >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Brain className="w-32 h-32 text-purple-400 rotate-12" />
            </div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-purple-400">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Combat Training</span>
                    </div>
                    {mastered_count > 0 && (
                        <div className="flex items-center gap-1 text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
                            <Trophy className="w-3 h-3" />
                            <span>{mastered_count} Mastered</span>
                        </div>
                    )}
                </div>

                {/* Title and description */}
                <h3 className="text-xl font-bold text-surface-100 mb-2">
                    {isEmpty ? 'Memory Training' : 'Memory Reinforcement'}
                </h3>
                <p className="text-surface-400 text-sm mb-4">
                    {isEmpty
                        ? "Master your knowledge! Any quiz questions you find difficult will automatically appear here for review."
                        : due_now > 0
                            ? `${due_now} question${due_now > 1 ? 's' : ''} ready for review. Strengthen your memory!`
                            : 'All reviews complete! Check back later for more training.'}
                </p>

                {/* Stats bar */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1 bg-surface-800/50 rounded-lg p-3 border border-surface-700/30">
                        <div className="text-2xl font-bold text-purple-400 font-mono">{due_now}</div>
                        <div className="text-[10px] text-surface-500 uppercase tracking-wider">Due Now</div>
                    </div>
                    <div className="flex-1 bg-surface-800/50 rounded-lg p-3 border border-surface-700/30">
                        <div className="text-2xl font-bold text-surface-300 font-mono">{total_in_queue}</div>
                        <div className="text-[10px] text-surface-500 uppercase tracking-wider">In Queue</div>
                    </div>
                    <div className="flex-1 bg-surface-800/50 rounded-lg p-3 border border-surface-700/30">
                        <div className="text-2xl font-bold text-yellow-400 font-mono">{mastered_count}</div>
                        <div className="text-[10px] text-surface-500 uppercase tracking-wider">Mastered</div>
                    </div>
                </div>

                {/* Action button */}
                <AnimatePresence>
                    {(due_now > 0 || isEmpty) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <Link
                                to={isEmpty ? "/practice" : "/practice?mode=review"}
                                className={`w-full px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 ${isEmpty
                                        ? "bg-surface-800 hover:bg-surface-700 text-purple-400 border border-purple-500/30 shadow-purple-900/10"
                                        : "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-900/40"
                                    } hover:scale-[1.02] active:scale-[0.98]`}
                            >
                                <Brain className="w-4 h-4" />
                                {isEmpty ? "Populate Review Queue" : "Start Review Session"}
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default DailyReviewWidget
