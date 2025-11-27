import { useState } from 'react'

function TaskCard({ task, onToggle }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    if (isLoading) return
    setIsLoading(true)
    try {
      await onToggle(task.task_id, !task.completed)
    } finally {
      setIsLoading(false)
    }
  }

  const dayColors = {
    Monday: 'border-l-blue-500',
    Tuesday: 'border-l-purple-500',
    Wednesday: 'border-l-amber-500',
    Thursday: 'border-l-rose-500',
    Friday: 'border-l-emerald-500',
    'Day 1': 'border-l-blue-500',
    'Day 2': 'border-l-purple-500',
    'Day 3': 'border-l-amber-500',
    'Day 4': 'border-l-rose-500',
    'Day 5': 'border-l-emerald-500',
  }

  return (
    <div
      className={`card p-4 border-l-4 ${dayColors[task.day] || 'border-l-surface-600'} 
        ${task.completed ? 'opacity-60' : ''} transition-all duration-200`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`flex-shrink-0 w-6 h-6 rounded-md border-2 transition-all duration-200
            flex items-center justify-center mt-0.5
            ${task.completed 
              ? 'bg-primary-600 border-primary-600 text-white' 
              : 'border-surface-600 hover:border-primary-500'
            }
            ${isLoading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
          `}
        >
          {task.completed && (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="badge-surface text-xs">{task.day}</span>
            {task.type && (
              <span className="text-xs text-surface-500 capitalize">{task.type}</span>
            )}
          </div>
          <p className={`text-surface-200 ${task.completed ? 'line-through text-surface-500' : ''}`}>
            {task.description}
          </p>
        </div>

        {/* XP Badge */}
        <div className="flex-shrink-0">
          <span className={`badge-primary ${task.completed ? 'opacity-50' : ''}`}>
            +{task.xp_reward} XP
          </span>
        </div>
      </div>
    </div>
  )
}

export default TaskCard

