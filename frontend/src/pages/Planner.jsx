import { useState, useEffect } from 'react'
import { AlertTriangle, BookX } from 'lucide-react'
import { weeksAPI, tasksAPI } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import WeekAccordion from '../components/WeekAccordion'
import ProgressBar from '../components/ProgressBar'

function Planner() {
  const { isAuthenticated } = useAuth()
  const { guestPrompts } = useCourse()
  const [weeks, setWeeks] = useState([])
  const [weekTasks, setWeekTasks] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedWeek, setExpandedWeek] = useState(null)

  const fetchWeeks = async () => {
    try {
      setLoading(true)
      const data = await weeksAPI.getAll()
      setWeeks(data)

      // Find first incomplete week to expand
      const firstIncomplete = data.find(w => w.tasks_completed < w.tasks_total)
      if (firstIncomplete) {
        setExpandedWeek(firstIncomplete.id)
        // Load its tasks
        const weekData = await weeksAPI.getById(firstIncomplete.id)
        setWeekTasks(prev => ({ ...prev, [firstIncomplete.id]: weekData.tasks }))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchWeeks()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const canEdit = isAuthenticated

  const loadWeekTasks = async (weekId) => {
    if (weekTasks[weekId]) return // Already loaded

    try {
      const weekData = await weeksAPI.getById(weekId)
      setWeekTasks(prev => ({ ...prev, [weekId]: weekData.tasks }))
    } catch (err) {
      console.error('Failed to load week tasks:', err)
    }
  }

  const handleTaskToggle = async (taskId, complete) => {
    try {
      if (complete) {
        await tasksAPI.complete(taskId)
      } else {
        await tasksAPI.uncomplete(taskId)
      }

      // Refresh weeks and the affected week's tasks
      const data = await weeksAPI.getAll()
      setWeeks(data)

      // Refresh loaded week tasks
      for (const weekId of Object.keys(weekTasks)) {
        const weekData = await weeksAPI.getById(parseInt(weekId))
        setWeekTasks(prev => ({ ...prev, [weekId]: weekData.tasks }))
      }
    } catch (err) {
      console.error('Failed to toggle task:', err)
    }
  }

  const handleWeekClick = (weekId) => {
    loadWeekTasks(weekId)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-surface-500">Loading roadmap...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-surface-100 mb-2">Failed to load roadmap</h2>
        <p className="text-surface-500 mb-4">{error}</p>
        <button onClick={fetchWeeks} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  const totalTasks = weeks.reduce((sum, w) => sum + w.tasks_total, 0)
  const completedTasks = weeks.reduce((sum, w) => sum + w.tasks_completed, 0)
  const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <div
      role="region"
      aria-label="Learning roadmap and course curriculum"
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-surface-100 mb-2">{guestPrompts.plannerHeading}</h1>
        <p className="text-surface-500">{guestPrompts.plannerDescription}</p>
      </div>

      {/* Overall Progress */}
      <div className="card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-lg font-semibold text-surface-100">Overall Progress</h2>
            <p className="text-sm text-surface-500">
              {completedTasks} of {totalTasks} tasks completed across {weeks.length} weeks
            </p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-primary-400">{Math.round(overallProgress)}%</span>
          </div>
        </div>
        <ProgressBar progress={overallProgress} showLabel={false} size="lg" />
      </div>

      {/* Weeks List */}
      <div className="space-y-3">
        {weeks.map((week, index) => (
          <div key={week.id} onClick={() => handleWeekClick(week.id)}>
            <WeekAccordion
              week={week}
              tasks={weekTasks[week.id]}
              onTaskToggle={canEdit ? handleTaskToggle : null}
              initialOpen={week.id === expandedWeek}
            />
          </div>
        ))}
      </div>

      {weeks.length === 0 && (
        <div className="card p-8 text-center">
          <BookX className="w-12 h-12 text-surface-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-surface-100 mb-2">No weeks found</h2>
          <p className="text-surface-500">Run the seed script to populate the database with the roadmap.</p>
        </div>
      )}
    </div>
  )
}

export default Planner

