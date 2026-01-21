import { useState } from 'react'
import { Check } from 'lucide-react'
import confetti from 'canvas-confetti'

function TaskCard({ task, onToggle }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    if (isLoading) return
    setIsLoading(true)
    
    // Trigger confetti if we are marking as complete (currently not completed)
    if (!task.completed) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FACC15', '#EC4899', '#10B981'] // Primary, Accent, Success colors
      })
    }

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
          aria-label={task.completed ? "Mark task as incomplete" : "Mark task as complete"}
        >
          {task.completed && (
            <Check className="w-4 h-4" strokeWidth={3} />
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

