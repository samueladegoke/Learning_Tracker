import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, Flame, Check, X, ArrowLeft, ArrowRight } from 'lucide-react'
import { progressAPI, rpgAPI } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import { useCourse } from '../contexts/CourseContext'

function Calendar() {
  const { isAuthenticated } = useAuth()
  const { guestPrompts } = useCourse()
  const [calendarData, setCalendarData] = useState(null)
  const [rpgState, setRpgState] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [calendar, rpg] = await Promise.all([
        progressAPI.getCalendar(),
        rpgAPI.getState(),
      ])
      setCalendarData(calendar)
      setRpgState(rpg)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [fetchData, isAuthenticated])


  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const formatDateKey = (date) => {
    if (!date) return null
    // Use CA locale for YYYY-MM-DD format, which is consistent and sortable
    return new Intl.DateTimeFormat('en-CA', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date)
  }

  const getDayStatus = (date) => {
    if (!date) return null

    const dateKey = formatDateKey(date)
    const today = formatDateKey(new Date())
    const isToday = dateKey === today

    if (!calendarData) return { type: 'empty', isToday }

    const hasTasks = dateKey in calendarData.completion_dates
    const isStreakDay = calendarData.streak_days?.includes(dateKey)

    // Compare dates only (not times) to determine if past
    const compareDate = new Date(date)
    compareDate.setHours(0, 0, 0, 0)
    const todayDate = new Date()
    todayDate.setHours(0, 0, 0, 0)
    const isPast = compareDate < todayDate && !isToday

    if (hasTasks) {
      return { type: 'completed', isToday, taskCount: calendarData.completion_dates[dateKey], isStreakDay }
    } else if (isPast && !isToday) {
      return { type: 'missed', isToday }
    } else {
      return { type: 'empty', isToday }
    }
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-surface-500">Loading calendar...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-surface-100 mb-2">Failed to load calendar</h2>
        <p className="text-surface-500 mb-4">{error}</p>
        <button onClick={fetchData} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  const days = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  if (!isAuthenticated) {
    return (
      <motion.div
        role="region"
        aria-label="Sign in required for activity calendar"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-12 text-center max-w-2xl mx-auto bg-surface-900/40 border-white/5 mt-10"
      >
        <Flame className="w-16 h-16 text-surface-600 mx-auto mb-6 opacity-50" />
        <h2 className="text-3xl font-bold text-surface-100 mb-4 font-display">{guestPrompts.calendarHeading}</h2>
        <p className="text-surface-500 text-lg mb-8 max-w-md mx-auto">
          {guestPrompts.calendarDescription}
        </p>
        <Link
          to="/login"
          className="btn-primary px-8 py-3 text-lg inline-block"
        >
          {guestPrompts.guestCta}
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-100 mb-2">Activity Calendar</h1>
            <p className="text-surface-500">Track your learning streak and missed days</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-surface-500">Current Streak</div>
              <div className="text-2xl font-bold text-primary-400 flex items-center justify-end gap-2">
                {rpgState?.streak || 0} <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="px-4 py-2 bg-surface-800 hover:bg-surface-700 text-surface-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <h2 className="text-xl font-semibold text-surface-100">{monthName}</h2>
          <button
            onClick={() => navigateMonth(1)}
            className="px-4 py-2 bg-surface-800 hover:bg-surface-700 text-surface-100 rounded-lg transition-colors flex items-center gap-2"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-center">
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors text-sm"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="card p-6">
        <div className="grid grid-cols-7 gap-2">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-surface-500 py-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((date, index) => {
            const status = getDayStatus(date)
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square"></div>
            }

            const dayNumber = date.getDate()
            const isToday = status?.isToday

            return (
              <div
                key={date.toISOString()}
                className={`
                  aspect-square rounded-lg border-2 transition-all cursor-pointer
                  flex flex-col items-center justify-center p-1
                  ${isToday ? 'border-primary-500 ring-2 ring-primary-500/50' : 'border-surface-700'}
                  ${status?.type === 'completed'
                    ? 'bg-primary-600/30 hover:bg-primary-600/40'
                    : status?.type === 'missed'
                      ? 'bg-red-900/20 hover:bg-red-900/30'
                      : 'bg-surface-800/30 hover:bg-surface-800/50'
                  }
                `}
                title={
                  status?.type === 'completed'
                    ? `${status.taskCount} task${status.taskCount > 1 ? 's' : ''} completed`
                    : status?.type === 'missed'
                      ? 'No tasks completed'
                      : 'No activity'
                }
              >
                <span
                  className={`
                    text-sm font-medium
                    ${isToday ? 'text-primary-300 font-bold' : 'text-surface-300'}
                  `}
                >
                  {dayNumber}
                </span>
                {status?.type === 'completed' && (
                  <span className="text-xs text-primary-300 mt-0.5">
                    {status.isStreakDay
                      ? <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                      : <Check className="w-3 h-3" />
                    }
                  </span>
                )}
                {status?.type === 'missed' && (
                  <span className="text-xs text-red-400 mt-0.5"><X className="w-3 h-3" /></span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-surface-100 mb-4">Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-600/30 border-2 border-primary-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-primary-300" />
            </div>
            <div>
              <div className="text-sm font-medium text-surface-200">Completed</div>
              <div className="text-xs text-surface-500">Tasks finished</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-600/30 border-2 border-primary-500 flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            </div>
            <div>
              <div className="text-sm font-medium text-surface-200">Streak Day</div>
              <div className="text-xs text-surface-500">Part of current streak</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-900/20 border-2 border-surface-700 flex items-center justify-center">
              <X className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-surface-200">Missed</div>
              <div className="text-xs text-surface-500">No tasks completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar

