import React from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Scroll, Sparkles } from 'lucide-react'
import TaskCard from './TaskCard'

const QuestLog = ({ tasks, onToggle }) => {
    const activeTasks = tasks.filter(t => !t.completed)
    const completedTasks = tasks.filter(t => t.completed)

    return (
        <div className="card p-0 overflow-hidden border-primary-900/30 bg-surface-900/40 backdrop-blur-sm">
            {/* Header */}
            <div className="p-4 border-b border-surface-800 bg-surface-800/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Scroll className="w-5 h-5 text-primary-400" />
                    <h3 className="font-display font-bold text-surface-100">Quest Log</h3>
                </div>
                <Link to="/planner" className="text-xs text-primary-400 hover:text-primary-300 uppercase tracking-wider font-bold">
                    View All Quests
                </Link>
            </div>

            <div className="p-4 space-y-6">
                {/* Active Quests */}
                <div>
                    <h4 className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-3 pl-1">Active Quests</h4>
                    {activeTasks.length > 0 ? (
                        <div className="space-y-3">
                            <AnimatePresence mode='popLayout'>
                                {activeTasks.map((task) => (
                                    <motion.div
                                        key={task.task_id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    >
                                        <TaskCard
                                            task={task}
                                            onToggle={onToggle}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-6 border-2 border-dashed border-surface-800 rounded-xl bg-surface-800/20"
                        >
                            <div className="flex flex-col items-center gap-3">
                                <div className="p-3 bg-surface-800/50 rounded-full animate-float">
                                    <Sparkles className="w-6 h-6 text-primary-400" />
                                </div>
                                <p className="text-surface-400 text-sm font-medium">No active quests. Time to rest or find more!</p>
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Completed Quests (Collapsed or smaller) */}
                {completedTasks.length > 0 && (
                    <motion.div layout>
                        <h4 className="text-xs font-bold text-surface-600 uppercase tracking-widest mb-3 pl-1">Completed Today</h4>
                        <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                            <AnimatePresence mode='popLayout'>
                                {completedTasks.map((task) => (
                                    <motion.div
                                        key={task.task_id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                    >
                                        <TaskCard
                                            task={task}
                                            onToggle={onToggle}
                                        />
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default QuestLog
