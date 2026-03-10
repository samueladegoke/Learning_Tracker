import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery, useMutation } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useAuth } from '@/contexts/AuthContext'
import { useCourse } from '@/contexts/CourseContext'
import { AlertTriangle, PenTool, RefreshCw } from 'lucide-react'
import { logError } from '@/utils/logger'
import { REFLECTIONS_SAVE_FAILED } from '@/constants/errorIds'

function Reflections() {
  const { user, isAuthenticated } = useAuth()
  const { guestPrompts } = useCourse()

  const reflectionsData = useQuery(api.reflections.getAll, user?.id ? { clerkUserId: user.id } : "skip")
  const weeksData = useQuery(api.curriculum.getWeeks)
  const saveReflection = useMutation(api.reflections.saveReflection)

  const loading = isAuthenticated && (reflectionsData === undefined || weeksData === undefined)
  const reflections = reflectionsData ?? []
  const weeks = weeksData ?? []

  const [selectedWeek, setSelectedWeek] = useState(null)
  const hasInitialized = useRef(false)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  useEffect(() => {
    if (hasInitialized.current) return
    if (weeksData === undefined) return
    if (isAuthenticated && reflectionsData === undefined) return
    if (weeks.length > 0) {
      const weeksWithReflections = new Set(reflections.map(r => r.week_id))
      const weekToSelect = weeks.find(w =>
        w.tasks_completed > 0 && !weeksWithReflections.has(w._id)
      ) || weeks[0]

      if (weekToSelect) {
        hasInitialized.current = true
        setSelectedWeek(weekToSelect)
        const existing = reflections.find(r => r.week_id === weekToSelect._id)
        setContent(existing?.content || '')
      }
    }
  }, [isAuthenticated, weeksData, reflectionsData, weeks, reflections])

  const handleWeekChange = (weekId) => {
    const week = weeks.find(w => w._id === weekId)
    setSelectedWeek(week)
    const existing = reflections.find(r => r.week_id === weekId)
    setContent(existing?.content || '')
    setSavedMessage('')
  }

  const handleSave = async () => {
    if (!selectedWeek || !content.trim()) return

    try {
      setSaving(true)
      await saveReflection({
        clerkUserId: user.id,
        weekId: selectedWeek._id,
        content: content.trim()
      })

      setSavedMessage('Reflection saved!')
      setTimeout(() => setSavedMessage(''), 3000)
    } catch (err) {
      logError(REFLECTIONS_SAVE_FAILED, { weekId: selectedWeek._id, error: err.message })
      setSavedMessage('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-surface-500">Loading reflections...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <motion.div
        role="region"
        aria-label="Sign in required for reflections"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-12 text-center max-w-2xl mx-auto bg-surface-900/40 border-white/5 mt-10"
      >
        <PenTool className="w-16 h-16 text-surface-600 mx-auto mb-6 opacity-50" />
        <h2 className="text-3xl font-bold text-surface-100 mb-4 font-display">{guestPrompts.reflectionsHeading}</h2>
        <p className="text-surface-500 text-lg mb-8 max-w-md mx-auto">
          {guestPrompts.reflectionsDescription}
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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-surface-100 mb-2">Weekly Reflections</h1>
        <p className="text-surface-500">Journal your learning journey and track your growth.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Reflection Form */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-surface-100 mb-4">Write a Reflection</h2>

            {/* Week Selector */}
            <div className="mb-4">
              <label htmlFor="week-select" className="block text-sm text-surface-400 mb-2">Select Week</label>
              <select
                id="week-select"
                value={selectedWeek?._id || ''}
                onChange={(e) => handleWeekChange(e.target.value)}
                className="input"
              >
                {weeks.map((week) => (
                  <option key={week._id} value={week._id}>
                    Week {week.week_number}: {week.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Check-in Prompt */}
            {selectedWeek?.checkin_prompt && (
              <div className="mb-4 p-4 bg-primary-900/20 border border-primary-700/30 rounded-lg">
                <p className="text-sm text-primary-300">
                  <span className="font-semibold">Prompt:</span> {selectedWeek.checkin_prompt}
                </p>
              </div>
            )}

            {/* Content Textarea */}
            <div className="mb-4">
              <label className="block text-sm text-surface-400 mb-2">Your Reflection</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What did you learn this week? What was challenging? What are you proud of?"
                rows={8}
                className="input resize-none"
              />
            </div>

            {/* Save Button */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleSave}
                disabled={saving || !content.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Reflection'}
              </button>
              {savedMessage && (
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${savedMessage.includes('Failed') ? 'text-red-400' : 'text-primary-400'}`}>
                    {savedMessage}
                  </span>
                  {savedMessage.includes('Failed') && (
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Retry
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Past Reflections */}
        <div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-surface-100 mb-4">Past Reflections</h2>

            {reflections.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {reflections.map((ref) => (
                  <button
                    key={ref._id}
                    onClick={() => handleWeekChange(ref.week_id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors
                      ${selectedWeek?._id === ref.week_id
                        ? 'bg-primary-900/30 border-primary-700/50'
                        : 'bg-surface-800/50 border-surface-700 hover:border-surface-600'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-surface-200">Week {ref.week_number}</span>
                      <span className="text-xs text-surface-500">
                        {new Date(ref.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-surface-400 line-clamp-2">{ref.content}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <PenTool className="w-12 h-12 text-surface-500 mx-auto mb-2" />
                <p className="text-surface-500 text-sm">No reflections yet.</p>
                <p className="text-surface-600 text-xs">Write your first one!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reflections

