import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Medal, Clock, TrendingUp } from 'lucide-react'
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useAuth } from "../contexts/AuthContext"

function Leaderboard() {
    const { user } = useAuth()
    const entries = useQuery(api.quizzes.getQuizHistory, user?.id ? { clerkUserId: user.id } : "skip")
    const loading = entries === undefined

    const formatDate = (isoString) => {
        if (!isoString) return '-'
        const date = new Date(isoString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getRankIcon = (index) => {
        if (index === 0) return <span className="text-2xl">🥇</span>
        if (index === 1) return <span className="text-2xl">🥈</span>
        if (index === 2) return <span className="text-2xl">🥉</span>
        return <span className="text-surface-500 font-mono">#{index + 1}</span>
    }

    const getQuizDisplayName = (quizId) => {
        // Convert "day-1-practice" to "Day 1"
        const match = quizId.match(/day-(\d+)/)
        if (match) return `Day ${match[1]}`
        return quizId
    }

    if (loading) {
        return (
            <div className="card p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-surface-400">Loading leaderboard...</p>
            </div>
        )
    }

    if (entries.length === 0) {
        return (
            <div className="card p-8 text-center">
                <Trophy className="w-12 h-12 text-surface-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-surface-300 mb-2">No Quiz Results Yet</h3>
                <p className="text-surface-500">Complete quizzes to see your scores on the leaderboard!</p>
            </div>
        )
    }

    return (
        <div className="card overflow-hidden">
            <div className="p-6 border-b border-surface-700 bg-gradient-to-r from-primary-900/20 to-accent-900/20">
                <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h2 className="text-xl font-bold text-surface-100">Quiz Leaderboard</h2>
                </div>
                <p className="text-surface-400 text-sm mt-1">Your top quiz performances</p>
            </div>

            <div className="divide-y divide-surface-800">
                <AnimatePresence>
                    {entries.map((entry, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-center gap-4 p-4 hover:bg-surface-800/50 transition-colors ${index < 3 ? 'bg-surface-800/30' : ''
                                }`}
                        >
                            {/* Rank */}
                            <div className="w-12 text-center">
                                {getRankIcon(index)}
                            </div>

                            {/* Quiz Info */}
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-surface-200 truncate">
                                    {getQuizDisplayName(entry.quiz_id)}
                                </p>
                                <p className="text-xs text-surface-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatDate(entry.completed_at)}
                                </p>
                            </div>

                            {/* Score */}
                            <div className="text-right">
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-surface-100">
                                        {entry.score}/{entry.total_questions}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${entry.percentage === 100
                                            ? 'bg-green-500/20 text-green-400'
                                            : entry.percentage >= 80
                                                ? 'bg-primary-500/20 text-primary-400'
                                                : entry.percentage >= 60
                                                    ? 'bg-yellow-500/20 text-yellow-400'
                                                    : 'bg-rose-500/20 text-rose-400'
                                        }`}>
                                        {entry.percentage}%
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Stats Summary */}
            <div className="p-4 bg-surface-900/50 border-t border-surface-700">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-surface-500">Total Attempts</span>
                    <span className="font-mono text-surface-300">{entries.length}</span>
                </div>
                {entries.length > 0 && (
                    <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-surface-500">Best Score</span>
                        <span className="font-mono text-green-400">
                            {Math.max(...entries.map(e => e.percentage))}%
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Leaderboard
