import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { progressAPI, weeksAPI, tasksAPI, rpgAPI, badgesAPI } from '../api/client'
import ProgressRing from '../components/ProgressRing'
import StatCard from '../components/StatCard'
import ProgressBar from '../components/ProgressBar'
import CharacterCard from '../components/CharacterCard'
import QuestLog from '../components/QuestLog'
import ShopModal from '../components/ShopModal'
import { soundManager } from '../utils/SoundManager'

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
  const [shopOpen, setShopOpen] = useState(false)
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
        soundManager.completeTask()
      } else {
        await tasksAPI.uncomplete(taskId)
      }
      // Refresh data
      fetchData()
    } catch (err) {
      console.error('Failed to toggle task:', err)
      soundManager.error()
    }
  }

  const handlePurchase = async (itemId) => {
    try {
      await rpgAPI.buyItem(itemId)
      await fetchData() // Refresh to get updated gold and item counts
    } catch (err) {
      throw err // Re-throw so ShopModal can handle it
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-surface-500">Summoning your dashboard...</p>
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

  const weekProgress = currentWeek ? (currentWeek.tasks_completed / currentWeek.tasks_total) * 100 : 0
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

  return (
    <div className="space-y-6">
      {/* Character Status */}
      <CharacterCard rpgState={rpgState} progress={progress} />

      {/* Shop Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShopOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white rounded-lg font-medium transition-all shadow-lg shadow-yellow-900/30 hover:shadow-yellow-900/50 active:scale-95 flex items-center gap-2"
        >
          <span>🛒</span>
          <span>Quest Shop</span>
          <span className="ml-2 bg-yellow-700 px-2 py-0.5 rounded-full text-xs">
            💰 {rpgState?.gold || 0}
          </span>
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Quests & Current Week */}
        <div className="lg:col-span-2 space-y-6">

          {/* Active Boss Quest (if any) */}
          {activeQuest && (
            <div className="card p-6 border border-primary-700/40 bg-primary-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl">🐉</div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="badge-primary mb-2">Boss Battle</span>
                    <h3 className="text-lg font-semibold text-surface-100">{activeQuest.name}</h3>
                  </div>
                  <div className="text-right text-sm text-surface-500">
                    <p>Boss HP</p>
                    <p className="text-surface-200 font-mono">
                      {activeQuest.boss_hp_remaining}/{activeQuest.boss_hp}
                    </p>
                  </div>
                </div>
                <ProgressBar progress={questProgress} showLabel={false} />
                <div className="flex items-center justify-between text-xs text-surface-500 mt-2">
                  <span>Complete tasks to deal damage!</span>
                  {activeQuest.reward_badge_id && (
                    <span className="text-primary-400">
                      Reward: {getBadgeName(activeQuest.reward_badge_id)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Quest Log (Daily Tasks) */}
          {currentWeek && (
            <QuestLog
              tasks={currentWeek.tasks || []}
              onToggle={handleTaskToggle}
            />
          )}

          {/* Current Week Progress */}
          {currentWeek && (
            <div className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="badge-surface mb-2">Current Chapter</span>
                  <h2 className="text-xl font-semibold text-surface-100">{currentWeek.title}</h2>
                  <p className="text-surface-500 text-sm mt-1">{currentWeek.focus}</p>
                </div>
                <ProgressRing progress={weekProgress} size={80} strokeWidth={6}>
                  <span className="text-lg font-bold text-primary-400">{Math.round(weekProgress)}%</span>
                </ProgressRing>
              </div>

              {currentWeek.milestone && (
                <div className="flex items-start gap-2 text-sm text-surface-400 p-3 bg-surface-800/50 rounded-lg border border-surface-700/50">
                  <span className="text-primary-500">◆</span>
                  <span><strong>Milestone:</strong> {currentWeek.milestone}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Stats & Actions */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-surface-100 mb-4">Adventure Tools</h3>
            <div className="space-y-2">
              <Link
                to="/planner"
                className="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🗺️</span>
                <div>
                  <p className="font-medium text-surface-200">World Map</p>
                  <p className="text-xs text-surface-500">View full roadmap</p>
                </div>
              </Link>
              <Link
                to="/reflections"
                className="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">📜</span>
                <div>
                  <p className="font-medium text-surface-200">Chronicles</p>
                  <p className="text-xs text-surface-500">Write reflections</p>
                </div>
              </Link>
              <Link
                to="/progress"
                className="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50 hover:bg-surface-800 transition-colors group"
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🏆</span>
                <div>
                  <p className="font-medium text-surface-200">Hall of Fame</p>
                  <p className="text-xs text-surface-500">View badges</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Active Challenge */}
          {activeChallenge && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="badge-surface mb-2">Side Quest</span>
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

          {/* Overall Progress */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-surface-100 mb-4">Campaign Progress</h3>
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
              {progress?.tasks_completed || 0} of {progress?.tasks_total || 0} quests completed
            </div>
          </div>
        </div>
      </div>

      {/* Shop Modal */}
      <ShopModal
        isOpen={shopOpen}
        onClose={() => setShopOpen(false)}
        rpgState={rpgState}
        onPurchase={handlePurchase}
      />
    </div>
  )
}

export default Dashboard
