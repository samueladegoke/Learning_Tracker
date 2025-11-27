import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { progressAPI, weeksAPI, tasksAPI, rpgAPI, badgesAPI } from '../api/client'
import ProgressRing from '../components/ProgressRing'
import TaskCard from '../components/TaskCard'
import StatCard from '../components/StatCard'
import ProgressBar from '../components/ProgressBar'

const xpNeededForLevel = (level) => Math.floor(100 * Math.pow(level, 1.2))

const calculateXpProgress = (totalXp = 0, currentLevel = 1, nextLevelCost) => {
  const level = Math.max(currentLevel || 1, 1)
  const levelCost = nextLevelCost || xpNeededForLevel(level)

  let xpSpent = 0
  for (let lvl = 1; lvl < level; lvl += 1) {
    xpSpent += xpNeededForLevel(lvl)
  }

  const xpIntoLevel = Math.max(Math.min(totalXp - xpSpent, levelCost || 0), 0)
  const percent = levelCost ? Math.min(Math.max((xpIntoLevel / levelCost) * 100, 0), 100) : 0

  return {
    percent,
    xpIntoLevel,
    levelCost: levelCost || 1,
  }
}

function Dashboard() {
  const [progress, setProgress] = useState(null)
  const [currentWeek, setCurrentWeek] = useState(null)
  const [rpgState, setRpgState] = useState(null)
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [weekCount, setWeekCount] = useState(0)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [progressData, weeksData, rpgData, badgesData] = await Promise.all([
        progressAPI.get(),
        weeksAPI.getAll(),
        rpgAPI.getState(),
        badgesAPI.getAll(),
      ])
      setProgress(progressData)
      setWeekCount(weeksData.length)
      setRpgState(rpgData)
      setBadges(badgesData)
      
      // Get current week (first incomplete week or last week)
      const firstIncomplete = weeksData.find(w => w.tasks_completed < w.tasks_total)
      const weekToLoad = firstIncomplete || weeksData[weeksData.length - 1]
      
      if (weekToLoad) {
        const weekDetails = await weeksAPI.getById(weekToLoad.id)
        setCurrentWeek(weekDetails)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleTaskToggle = async (taskId, complete) => {
    try {
      if (complete) {
        await tasksAPI.complete(taskId)
      } else {
        await tasksAPI.uncomplete(taskId)
      }
      // Refresh data
      fetchData()
    } catch (err) {
      console.error('Failed to toggle task:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-surface-500">Loading your progress...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-surface-100 mb-2">Failed to load data</h2>
        <p className="text-surface-500 mb-4">{error}</p>
        <button onClick={fetchData} className="btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  const todayTasks = currentWeek?.tasks?.filter(t => !t.completed).slice(0, 3) || []
  const weekProgress = currentWeek ? (currentWeek.tasks_completed / currentWeek.tasks_total) * 100 : 0
  const xpProgress = calculateXpProgress(rpgState?.xp || 0, rpgState?.level, rpgState?.next_level_xp)
  const xpPercent = rpgState ? xpProgress.percent : 0
  const focusCap = rpgState?.focus_cap || 0
  const focusPoints = rpgState?.focus_points || 0
  const activeQuest = rpgState?.active_quest
  const activeChallenge = rpgState?.active_challenges?.[0]
  const questProgress = activeQuest && activeQuest.boss_hp
    ? ((activeQuest.boss_hp - (activeQuest.boss_hp_remaining || activeQuest.boss_hp)) / activeQuest.boss_hp) * 100
    : 0
  const challengeProgress = activeChallenge && activeChallenge.goal
    ? (activeChallenge.progress / activeChallenge.goal) * 100
    : 0

  const getBadgeName = (badgeId) => {
    if (!badgeId) return null
    const badge = badges.find(b => b.badge_id === badgeId)
    return badge ? badge.name : badgeId
  }

  const renderFocusPills = () => {
    if (!focusCap) return null
    return (
      <div className="flex items-center gap-1.5">
        {Array.from({ length: focusCap }).map((_, idx) => (
          <div
            key={idx}
            className={`w-2.5 h-5 rounded-full ${
              idx < focusPoints ? 'bg-primary-500 shadow-sm shadow-primary-800/50' : 'bg-surface-700'
            }`}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-100 mb-1">Welcome back, Learner!</h1>
          <p className="text-surface-500">Let's continue your coding journey.</p>
          {weekCount > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <span className="badge-primary text-xs">New seed loaded</span>
              <span className="text-xs text-surface-500">
                {weekCount}-week bootcamp review (5 days/week)
              </span>
            </div>
          )}
        </div>
        <Link to="/planner" className="btn-primary self-start">
          View Full Roadmap
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="⚡" label="Total XP" value={progress?.total_xp || 0} variant="primary" />
        <StatCard icon="📊" label="Level" value={progress?.level || 1} />
        <StatCard icon="🔥" label="Streak" value={progress?.streak || 0} suffix="days" />
        <StatCard icon="🏆" label="Badges" value={progress?.badges_earned || 0} suffix={`/${progress?.badges_total || 0}`} variant="accent" />
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Current Week Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Week Card */}
          {currentWeek && (
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="badge-primary mb-2">Week {currentWeek.week_number}</span>
                  <h2 className="text-xl font-semibold text-surface-100">{currentWeek.title}</h2>
                  <p className="text-surface-500 text-sm mt-1">{currentWeek.focus}</p>
                </div>
                <ProgressRing progress={weekProgress} size={80} strokeWidth={6}>
                  <span className="text-lg font-bold text-primary-400">{Math.round(weekProgress)}%</span>
                </ProgressRing>
              </div>

              {currentWeek.milestone && (
                <div className="flex items-start gap-2 text-sm text-surface-400 p-3 bg-surface-800/50 rounded-lg">
                  <span className="text-primary-500">◆</span>
                  <span><strong>Milestone:</strong> {currentWeek.milestone}</span>
                </div>
              )}
            </div>
          )}

          {/* Active Quest */}
          {activeQuest && (
            <div className="card p-6 border border-primary-700/40 bg-primary-900/10">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="badge-primary mb-2">Active Quest</span>
                  <h3 className="text-lg font-semibold text-surface-100">{activeQuest.name}</h3>
                </div>
                <div className="text-right text-sm text-surface-500">
                  <p>Boss HP</p>
                  <p className="text-surface-200">
                    {activeQuest.boss_hp_remaining}/{activeQuest.boss_hp}
                  </p>
                </div>
              </div>
              <ProgressBar progress={questProgress} showLabel={false} />
              <div className="flex items-center justify-between text-xs text-surface-500 mt-2">
                <span>Damage by clearing tasks</span>
                {activeQuest.reward_badge_id && (
                  <span className="text-primary-400">
                    Reward badge: {getBadgeName(activeQuest.reward_badge_id)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Active Challenge */}
          {activeChallenge && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="badge-surface mb-2">Challenge</span>
                  <h3 className="text-lg font-semibold text-surface-100">{activeChallenge.name}</h3>
                </div>
                <div className="text-right text-sm text-surface-500">
                  <p>Progress</p>
                  <p className="text-surface-200">
                    {activeChallenge.progress}/{activeChallenge.goal}
                  </p>
                </div>
              </div>
              <ProgressBar progress={challengeProgress} showLabel={false} />
              {activeChallenge.ends_at && (
                <p className="text-xs text-surface-500 mt-2">Ends: {new Date(activeChallenge.ends_at).toLocaleString()}</p>
              )}
            </div>
          )}

          {/* Today's Tasks */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-surface-100">Up Next</h3>
              <Link to="/planner" className="text-sm text-primary-400 hover:text-primary-300">
                View all
              </Link>
            </div>

            {todayTasks.length > 0 ? (
              <div className="space-y-3">
                {todayTasks.map((task) => (
                  <TaskCard
                    key={task.task_id}
                    task={task}
                    onToggle={handleTaskToggle}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-surface-400">All tasks for this week are done!</p>
                <Link to="/planner" className="text-primary-400 hover:text-primary-300 text-sm">
                  Check the next week →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* RPG Status */}
          {rpgState && (
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-surface-100 mb-3">RPG Status</h3>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-surface-500 mb-1">
                  <span>XP to next level</span>
                  <span className="text-primary-400 font-medium">{Math.round(xpPercent)}%</span>
                </div>
                <ProgressBar progress={xpPercent} showLabel={false} size="lg" />
                <p className="text-xs text-surface-500 mt-1">
                  Level {rpgState.level} · {xpProgress.xpIntoLevel}/{xpProgress.levelCost} XP
                </p>
                </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-surface-400">
                <div className="p-3 rounded-lg bg-surface-800/60">
                  <p className="text-xs uppercase tracking-wide text-surface-500 mb-1">Streak</p>
                  <p className="text-surface-100 text-lg font-semibold flex items-center gap-2">
                    <span className="text-amber-400">streak</span>{rpgState.streak} days
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-surface-800/60">
                  <p className="text-xs uppercase tracking-wide text-surface-500 mb-1">Gold</p>
                  <p className="text-surface-100 text-lg font-semibold flex items-center gap-2">
                    <span className="text-yellow-300">gold</span>{rpgState.gold}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-xs uppercase tracking-wide text-surface-500 mb-2">Focus points</p>
                {renderFocusPills()}
              </div>
            </div>
          )}

          {/* Overall Progress */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-surface-100 mb-4">Overall Progress</h3>
            <div className="text-center mb-4">
              <ProgressRing progress={progress?.completion_percentage || 0} size={140} strokeWidth={10}>
                <div>
                  <span className="text-3xl font-bold text-surface-100">
                    {Math.round(progress?.completion_percentage || 0)}%
                  </span>
                  <p className="text-xs text-surface-500">Complete</p>
                </div>
              </ProgressRing>
            </div>
            <div className="text-center text-sm text-surface-500">
              {progress?.tasks_completed || 0} of {progress?.tasks_total || 0} tasks completed
            </div>
          </div>

          {/* Quick Links */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-surface-100 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                to="/reflections"
                className="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors"
              >
                <span className="text-xl">✎</span>
                <div>
                  <p className="font-medium text-surface-200">Weekly Reflection</p>
                  <p className="text-xs text-surface-500">Journal your progress</p>
                </div>
              </Link>
              <Link
                to="/progress"
                className="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors"
              >
                <span className="text-xl">🏆</span>
                <div>
                  <p className="font-medium text-surface-200">View Badges</p>
                  <p className="text-xs text-surface-500">Check achievements</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

