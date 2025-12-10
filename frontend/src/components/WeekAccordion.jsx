import { useState } from 'react'
import { Diamond } from 'lucide-react'
import TaskCard from './TaskCard'
import ProgressBar from './ProgressBar'

function WeekAccordion({ week, tasks, onTaskToggle, initialOpen = false }) {
  const [isOpen, setIsOpen] = useState(initialOpen)

  const tasksCompleted = tasks
    ? tasks.filter((t) => t.completed).length
    : week.tasks_completed ?? 0
  const tasksTotal = tasks ? tasks.length : week.tasks_total ?? 0
  const progress = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 100 : 0
  const isComplete = progress === 100

  return (
    <div className={`card overflow-hidden transition-all duration-300 ${isComplete ? 'ring-1 ring-primary-700/50' : ''}`}>
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center gap-4 hover:bg-surface-800/50 transition-colors"
      >
        {/* Week number badge */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold
          ${isComplete
            ? 'bg-primary-600 text-white'
            : 'bg-surface-800 text-surface-300'
          }`}
        >
          W{week.week_number}
        </div>

        {/* Title and info */}
        <div className="flex-1 text-left min-w-0">
          <h3 className="font-semibold text-surface-100 truncate">{week.title}</h3>
          <p className="text-sm text-surface-500 truncate">{week.focus || week.milestone}</p>
        </div>

        {/* Progress indicator */}
        <div className="flex-shrink-0 hidden sm:flex items-center gap-3">
          <div className="text-right">
            <span className="text-sm font-medium text-surface-300">
              {tasksCompleted}/{tasksTotal}
            </span>
            <span className="text-xs text-surface-500 ml-1">tasks</span>
          </div>
          <div className="w-24">
            <ProgressBar progress={progress} showLabel={false} size="sm" />
          </div>
        </div>

        {/* Chevron */}
        <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expandable content */}
      {isOpen && (
        <div className="px-5 pb-5 space-y-3 border-t border-surface-800 pt-4">
          {/* Milestone */}
          {week.milestone && (
            <div className="flex items-start gap-2 text-sm text-surface-400 mb-4">
              <Diamond className="w-3 h-3 text-primary-500 fill-primary-500" />
              <span>Milestone: {week.milestone}</span>
            </div>
          )}

          {/* Tasks */}
          {tasks && tasks.length > 0 ? (
            <div className="space-y-2">
              {tasks.map((task) => (
                <TaskCard
                  key={task.task_id}
                  task={task}
                  onToggle={onTaskToggle}
                />
              ))}
            </div>
          ) : (
            <p className="text-surface-500 text-sm text-center py-4">Loading tasks...</p>
          )}
        </div>
      )}
    </div>
  )
}

export default WeekAccordion

