import { useState, useEffect } from 'react'
import { Trophy, Target, Flame, Calendar as CalendarIcon, AlertTriangle } from 'lucide-react'
import { progressAPI, badgesAPI, achievementsAPI, weeksAPI } from '../api/client'
import Leaderboard from '../components/Leaderboard'
import ProgressRing from '../components/ProgressRing'
import ProgressBar from '../components/ProgressBar'
import BadgeCard from '../components/BadgeCard'
import StatCard from '../components/StatCard'

function Progress() {
  const [progress, setProgress] = useState(null)
  const [badges, setBadges] = useState([])
  const [achievements, setAchievements] = useState([])
  const [weeks, setWeeks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [progressData, badgesData, achievementsData, weeksData] = await Promise.all([
        progressAPI.get(),
        badgesAPI.getAll(),
        achievementsAPI.getAll(),
        weeksAPI.getAll()
      ])
      setProgress(progressData)
      setBadges(badgesData)
      setAchievements(achievementsData)
      setWeeks(weeksData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-surface-500">Loading progress...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-surface-100 mb-2">Failed to load progress</h2>
        <p className="text-surface-500 mb-4">{error}</p>
        <button onClick={fetchData} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  // Level progress is now calculated on the server
  const levelProgress = progress?.level_progress || 0
  const xpToNextLevel = progress?.xp_to_next_level || 100

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-surface-100 mb-2">Progress & Stats</h1>
        <p className="text-surface-500">Track your achievements and see how far you've come.</p>
      </div>

      {/* Main Progress Card */}
      <div className="card p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Ring */}
          <div className="text-center">
            <ProgressRing progress={progress?.completion_percentage || 0} size={200} strokeWidth={14}>
              <div>
                <span className="text-5xl font-bold text-surface-100">
                  {Math.round(progress?.completion_percentage || 0)}%
                </span>
                <p className="text-surface-500 mt-1">Complete</p>
              </div>
            </ProgressRing>
            <p className="text-surface-400 mt-4">
              {progress?.tasks_completed || 0} of {progress?.tasks_total || 0} tasks done
            </p>
          </div>

          {/* Right: Stats */}
          <div className="space-y-6">
            {/* Level Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-surface-400">Level {progress?.level || 1}</span>
                <span className="text-sm text-surface-500">{xpToNextLevel} XP to next level</span>
              </div>
              <ProgressBar progress={levelProgress} showLabel={false} size="lg" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-800/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-primary-400">{progress?.total_xp || 0}</p>
                <p className="text-sm text-surface-500">Total XP</p>
              </div>
              <div className="bg-surface-800/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-accent-400">{progress?.streak || 0}</p>
                <p className="text-sm text-surface-500">Day Streak</p>
              </div>
              <div className="bg-surface-800/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-surface-100">{weeks.filter(w => w.tasks_completed === w.tasks_total).length}</p>
                <p className="text-sm text-surface-500">Weeks Done</p>
              </div>
              <div className="bg-surface-800/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-surface-100">{progress?.badges_earned || 0}</p>
                <p className="text-sm text-surface-500">Badges</p>
              </div>
              <div className="bg-surface-800/50 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-surface-100">{progress?.achievements_earned || 0}</p>
                <p className="text-sm text-surface-500">Achievements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Leaderboard />

      {/* Weekly Progress Overview */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-surface-100 mb-4">Weekly Progress</h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-16 gap-2">
          {weeks.map((week) => {
            const percent = week.tasks_total > 0
              ? (week.tasks_completed / week.tasks_total) * 100
              : 0
            const isComplete = percent === 100
            const hasStarted = week.tasks_completed > 0

            return (
              <div
                key={week.id}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                  ${isComplete
                    ? 'bg-primary-600 text-white'
                    : hasStarted
                      ? 'bg-primary-900/50 text-primary-300 border border-primary-700/50'
                      : 'bg-surface-800 text-surface-500'
                  }`}
                title={`Week ${week.week_number}: ${week.tasks_completed}/${week.tasks_total} tasks`}
              >
                {week.week_number}
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-surface-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-surface-800"></div>
            <span>Not started</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-primary-900/50 border border-primary-700/50"></div>
            <span>In progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-primary-600"></div>
            <span>Complete</span>
          </div>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div>
        <h2 className="text-lg font-semibold text-surface-100 mb-4">
          Badges & Achievements
          <span className="text-surface-500 font-normal text-sm ml-2">
            ({progress?.badges_earned || 0}/{progress?.badges_total || 0} badges · {progress?.achievements_earned || 0}/{progress?.achievements_total || achievements.length || 0} achievements)
          </span>
        </h2>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm uppercase tracking-wide text-surface-500">Achievements</h3>
              <span className="text-xs text-surface-500">
                {progress?.achievements_earned || 0}/{progress?.achievements_total || achievements.length || 0}
              </span>
            </div>
            {achievements.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-lg border text-sm ${ach.unlocked
                      ? 'border-primary-700/50 bg-primary-900/20 text-surface-100'
                      : 'border-surface-800 bg-surface-900/40 text-surface-400'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold mb-1 text-surface-200">{ach.name}</h4>
                        <p className="text-xs text-surface-500">{ach.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-surface-500 capitalize">{ach.difficulty || 'normal'}</p>
                        <p className="text-xs text-primary-400">+{ach.xp_value} XP</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-surface-500">No achievements defined yet.</p>
            )}
          </div>

          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm uppercase tracking-wide text-surface-500">Badges</h3>
              <span className="text-xs text-surface-500">
                {progress?.badges_earned || 0}/{progress?.badges_total || badges.length || 0}
              </span>
            </div>
            {badges.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {badges.map((badge) => (
                  <BadgeCard key={badge.id} badge={badge} />
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-surface-500">No badges defined yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Progress

