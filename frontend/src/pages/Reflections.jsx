import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { reflectionsAPI, weeksAPI } from '../api/client'
import { useAuth } from '../contexts/AuthContext'
import { useCourse } from '../contexts/CourseContext'
import { AlertTriangle, PenTool } from 'lucide-react'

function Reflections() {
  const { isAuthenticated } = useAuth()
  const { guestPrompts } = useCourse()
  const [reflections, setReflections] = useState([])
  const [weeks, setWeeks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      const [reflectionsData, weeksData] = await Promise.all([
        reflectionsAPI.getAll(),
        weeksAPI.getAll()
      ])
      setReflections(reflectionsData)
      setWeeks(weeksData)

      // Select first week with tasks completed but no reflection
      const weeksWithReflections = new Set(reflectionsData.map(r => r.week_id))
      const weekToSelect = weeksData.find(w =>
        w.tasks_completed > 0 && !weeksWithReflections.has(w.id)
      ) || weeksData[0]

      if (weekToSelect) {
        setSelectedWeek(weekToSelect)
        // Check if there's an existing reflection
        const existing = reflectionsData.find(r => r.week_id === weekToSelect.id)
        setContent(existing?.content || '')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated])

  const handleWeekChange = (weekId) => {
    const week = weeks.find(w => w.id === parseInt(weekId))
    setSelectedWeek(week)

    // Load existing reflection if any
    const existing = reflections.find(r => r.week_id === parseInt(weekId))
    setContent(existing?.content || '')
    setSavedMessage('')
  }

  const handleSave = async () => {
    if (!selectedWeek || !content.trim()) return

    try {
      setSaving(true)
      await reflectionsAPI.create({
        week_id: selectedWeek.id,
        content: content.trim()
      })

      // Refresh reflections
      const data = await reflectionsAPI.getAll()
      setReflections(data)
      setSavedMessage('Reflection saved!')

      setTimeout(() => setSavedMessage(''), 3000)
    } catch (err) {
      console.error('Failed to save reflection:', err)
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

  if (error) {
    return (
      <div className="card p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-surface-100 mb-2">Failed to load data</h2>
        <p className="text-surface-500 mb-4">{error}</p>
        <button onClick={fetchData} className="btn-primary">
          Try Again
        </button>
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
                value={selectedWeek?.id || ''}
                onChange={(e) => handleWeekChange(e.target.value)}
                className="input"
              >
                {weeks.map((week) => (
                  <option key={week.id} value={week.id}>
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
                <span className={`text-sm ${savedMessage.includes('Failed') ? 'text-red-400' : 'text-primary-400'}`}>
                  {savedMessage}
                </span>
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
                    key={ref.id}
                    onClick={() => handleWeekChange(ref.week_id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors
                      ${selectedWeek?.id === ref.week_id
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

