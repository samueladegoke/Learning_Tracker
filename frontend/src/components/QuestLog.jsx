import React from 'react'
import { Link } from 'react-router-dom'
import TaskCard from './TaskCard'

const QuestLog = ({ tasks, onToggle }) => {
    const activeTasks = tasks.filter(t => !t.completed)
    const completedTasks = tasks.filter(t => t.completed)

    return (
        <div className="card p-0 overflow-hidden border-primary-900/30 bg-surface-900/40 backdrop-blur-sm">
            {/* Header */}
            <div className="p-4 border-b border-surface-800 bg-surface-800/30 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-xl">📜</span>
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
                            {activeTasks.map((task) => (
                                <TaskCard
                                    key={task.task_id}
                                    task={task}
                                    onToggle={onToggle}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-6 border-2 border-dashed border-surface-800 rounded-xl bg-surface-800/20">
                            <p className="text-surface-500 text-sm">No active quests. Time to rest or find more!</p>
                        </div>
                    )}
                </div>

                {/* Completed Quests (Collapsed or smaller) */}
                {completedTasks.length > 0 && (
                    <div>
                        <h4 className="text-xs font-bold text-surface-600 uppercase tracking-widest mb-3 pl-1">Completed Today</h4>
                        <div className="space-y-2 opacity-60 hover:opacity-100 transition-opacity">
                            {completedTasks.map((task) => (
                                <TaskCard
                                    key={task.task_id}
                                    task={task}
                                    onToggle={onToggle}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default QuestLog
