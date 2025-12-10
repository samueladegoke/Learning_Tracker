import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion'
import {
  Calendar,
  Clock,
  ShoppingBag,
  Coins,
  Swords,
  Heart,
  Gift,
  Flag,
  Map,
  Award,
  Compass,
  AlertTriangle,
  Check,
  Scroll,
  Timer,
  Trophy
} from 'lucide-react'
import { progressAPI, weeksAPI, tasksAPI, rpgAPI, badgesAPI } from '../api/client'
import ProgressRing from '../components/ProgressRing'
import StatCard from '../components/StatCard'
import ProgressBar from '../components/ProgressBar'
import CharacterCard from '../components/CharacterCard'
import QuestLog from '../components/QuestLog'
import ShopModal from '../components/ShopModal'
import { soundManager } from '../utils/SoundManager'

// Animated Number Component
function NumberTicker({ value, className = "" }) {
  const ref = useRef(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 })
  const isInView = useInView(ref, { once: true, margin: "-10px" })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, isInView, value])

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString()
      }
    })
  }, [springValue])

  return <span ref={ref} className={className} />
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } }
}

// calculateXpProgress logic removed - imported from utils

// Isolated component to prevent full Dashboard re-renders on every second tick
const CurrentSyncStatus = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const { date: formattedDate, time: formattedTime } = {
    date: currentDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    time: currentDateTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    })
  }

  return (
    <motion.div variants={itemVariants} className="card p-5 bg-gradient-to-r from-primary-900/10 to-surface-900 border-primary-500/10">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-1">Current Sync</div>
          <div className="text-lg font-display font-semibold text-surface-100">{formattedDate}</div>
          <div className="text-sm text-primary-400 font-mono">{formattedTime}</div>
        </div>
        <div className="p-3 bg-surface-800/50 rounded-xl border border-white/5">
          <Calendar className="w-6 h-6 text-primary-400" />
        </div>
      </div>
    </motion.div>
  )
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

  const CACHE_DURATION = 60000 // 1 minute

  const fetchData = async (force = false) => {
    try {
      const now = Date.now()
      const cached = sessionStorage.getItem('dashboard_cache')

      if (!force && cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (now - timestamp < CACHE_DURATION) {
          setProgress(data.progress)
          setWeekCount(data.weekCount)
          setRpgState(data.rpgState)
          setBadges(data.badges)
          if (data.currentWeek) setCurrentWeek(data.currentWeek)
          setLoading(false)
          return
        }
      }

      setLoading(true)
      const [progressData, weeksData, rpgData, badgesData] = await Promise.all([
        progressAPI.get(),
        weeksAPI.getAll(),
        rpgAPI.getState(),
        badgesAPI.getAll(),
      ])

      let weekDetails = null
      const firstIncomplete = weeksData.find(w => w.tasks_completed < w.tasks_total)
      const weekToLoad = firstIncomplete || weeksData[weeksData.length - 1]

      if (weekToLoad) {
        weekDetails = await weeksAPI.getById(weekToLoad.id)
        setCurrentWeek(weekDetails)
      }

      setProgress(progressData)
      setWeekCount(weeksData.length)
      setRpgState(rpgData)
      setBadges(badgesData)

      sessionStorage.setItem('dashboard_cache', JSON.stringify({
        data: {
          progress: progressData,
          weekCount: weeksData.length,
          rpgState: rpgData,
          badges: badgesData,
          currentWeek: weekDetails
        },
        timestamp: now
      }))

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
      fetchData(true)
    } catch (err) {
      console.error('Failed to toggle task:', err)
      soundManager.error()
    }
  }

  const handlePurchase = async (itemId) => {
    try {
      await rpgAPI.buyItem(itemId)
      await fetchData(true)
    } catch (err) {
      throw err
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-surface-400 font-mono text-sm animate-pulse">Synchronizing timeline...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center max-w-md mx-auto mt-20"
      >
        <div className="flex justify-center mb-4">
          <AlertTriangle className="w-12 h-12 text-rose-500" />
        </div>
        <h2 className="text-xl font-semibold text-surface-100 mb-2">Sync Failure</h2>
        <p className="text-surface-500 mb-6">{error}</p>
        <button onClick={() => fetchData(true)} className="btn-primary w-full">
          Reinitialize Connection
        </button>
      </motion.div>
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

  // formatDateTime helper removed as logic moved to CurrentSyncStatus

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      {/* Date and Time Display */}
      <CurrentSyncStatus />

      {/* Character Status */}
      <motion.div variants={itemVariants}>
        <CharacterCard rpgState={rpgState} progress={progress} />
      </motion.div>

      {/* Shop Button */}
      <motion.div variants={itemVariants} className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShopOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-yellow-600/90 to-yellow-500/90 hover:from-yellow-500 hover:to-yellow-400 text-white rounded-xl font-medium transition-all shadow-lg shadow-yellow-900/20 flex items-center gap-3 backdrop-blur-md border border-white/10"
        >
          <ShoppingBag className="w-6 h-6" />
          <span className="font-display">Quest Shop</span>
          <span className="bg-black/20 px-3 py-1 rounded-full text-xs font-mono border border-white/10 flex items-center gap-1">
            <Coins className="w-3 h-3 text-yellow-300" /> <NumberTicker value={rpgState?.gold || 0} />
          </span>
        </motion.button>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Quests & Current Week */}
        <div className="lg:col-span-2 space-y-6">

          {/* Active Boss Quest (if any) */}
          <AnimatePresence>
            {activeQuest && (
              <motion.div
                variants={itemVariants}
                className="rpg-card p-6 min-h-[200px]"
                layout
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none select-none">
                  <Swords className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="badge-primary mb-2">Boss Battle</span>
                      <h3 className="text-xl font-display font-bold text-surface-100">{activeQuest.name}</h3>
                    </div>
                    <div className="text-right text-sm text-surface-400 bg-surface-950/30 px-3 py-2 rounded-lg border border-white/5">
                      <p className="text-xs uppercase tracking-wider mb-1">Boss HP</p>
                      <p className="text-surface-100 font-mono font-bold text-lg">
                        <NumberTicker value={activeQuest.boss_hp_remaining} /> / {activeQuest.boss_hp}
                      </p>
                    </div>
                  </div>

                  {/* Boss Image/Visual Area - simplified as noise texture for now */}
                  <motion.div
                    key={activeQuest.boss_hp_remaining}
                    initial={{ scale: 1 }}
                    animate={{ x: [0, -5, 5, -5, 5, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <ProgressBar progress={questProgress} showLabel={false} height="h-4" />
                  </motion.div>

                  <div className="flex items-center justify-between text-xs text-surface-500 mt-4 font-medium">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                      Complete tasks to deal damage!
                    </span>
                    {activeQuest.reward_badge_id && (
                      <span className="text-primary-400 bg-primary-900/20 px-2 py-1 rounded border border-primary-500/20 flex items-center gap-1">
                        <Gift className="w-3 h-3" /> Reward: {getBadgeName(activeQuest.reward_badge_id)}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Quest Log (Daily Tasks) */}
          {currentWeek && <QuestLog tasks={currentWeek.tasks || []} onToggle={handleTaskToggle} />}

          {/* Current Week Progress */}
          {currentWeek && (
            <motion.div variants={itemVariants} className="card p-8 bg-gradient-to-br from-surface-900/80 to-surface-800/80">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <span className="badge-surface mb-3">Current Chapter</span>
                  <h2 className="text-2xl font-display font-bold text-surface-100 mb-2">{currentWeek.title}</h2>
                  <p className="text-surface-400 leading-relaxed max-w-md">{currentWeek.focus}</p>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full"></div>
                  <ProgressRing progress={weekProgress} size={100} strokeWidth={8}>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-2xl font-bold font-mono text-primary-400"
                    >
                      {Math.round(weekProgress)}%
                    </motion.span>
                  </ProgressRing>
                </div>
              </div>

              {currentWeek.milestone && (
                <div className="flex items-center gap-3 text-sm p-4 bg-surface-950/30 rounded-xl border border-primary-500/10 shadow-inner">
                  <Flag className="w-6 h-6 text-primary-500" />
                  <div>
                    <span className="text-primary-500 font-bold uppercase text-xs tracking-wider block mb-0.5">Current Objective</span>
                    <span className="text-surface-200">{currentWeek.milestone}</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Right Column: Stats & Actions */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="card p-6">
            <h3 className="text-lg font-semibold text-surface-100 mb-4 flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary-400" /> Navigation
            </h3>
            <div className="space-y-2">
              {[
                { to: "/planner", icon: Map, title: "World Map", subtitle: "View full roadmap" },
                { to: "/reflections", icon: Scroll, title: "Chronicles", subtitle: "Write reflections" },
                { to: "/progress", icon: Trophy, title: "Hall of Fame", subtitle: "View badges" }
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="flex items-center gap-4 p-4 rounded-xl bg-surface-800/30 hover:bg-surface-800/60 transition-all border border-transparent hover:border-surface-700 group relative overflow-hidden"
                >
                  <item.icon className="w-6 h-6 text-surface-500 group-hover:text-primary-400 group-hover:scale-110 transition-all duration-300" />
                  <div className="relative z-10">
                    <p className="font-bold text-surface-200 group-hover:text-white transition-colors">{item.title}</p>
                    <p className="text-xs text-surface-500 group-hover:text-surface-400 transition-colors uppercase tracking-wide">{item.subtitle}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Active Challenge */}
          {activeChallenge && (
            <motion.div variants={itemVariants} className="card p-6 border-accent-500/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="badge-accent mb-2">Side Quest</span>
                  <h3 className="text-lg font-bold text-surface-100">{activeChallenge.name}</h3>
                </div>
                <div className="text-right text-sm">
                  <p className="text-surface-500 text-xs uppercase mb-1">Progress</p>
                  <p className="text-accent-300 font-mono font-bold">
                    <NumberTicker value={activeChallenge.progress} />/<NumberTicker value={activeChallenge.goal} />
                  </p>
                </div>
              </div>
              <ProgressBar progress={challengeProgress} showLabel={false} colorClass="bg-accent-500" />
              {activeChallenge.ends_at && (
                <div className="flex items-center gap-2 mt-4 text-xs text-surface-500 bg-surface-950/30 p-2 rounded">
                  <Timer className="w-3 h-3" />
                  <span>Ends: {new Date(activeChallenge.ends_at).toLocaleString()}</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Overall Progress */}
          <motion.div variants={itemVariants} className="card p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-900/5 pointer-events-none"></div>
            <h3 className="text-lg font-semibold text-surface-100 mb-6">Campaign Progress</h3>
            <div className="flex justify-center mb-6 relative">
              <div className="absolute inset-0 bg-primary-500/10 blur-3xl rounded-full transform scale-150"></div>
              <ProgressRing progress={progress?.completion_percentage || 0} size={160} strokeWidth={12}>
                <div className="text-center">
                  <span className="text-4xl font-display font-bold text-surface-100 tracking-tight block">
                    <NumberTicker value={progress?.completion_percentage || 0} />%
                  </span>
                  <span className="text-xs font-bold text-primary-500 uppercase tracking-widest mt-1 block">Complete</span>
                </div>
              </ProgressRing>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-800/50 rounded-full border border-surface-700/50 text-sm text-surface-400">
              <Check className="w-4 h-4 text-primary-500" />
              <span>
                <strong className="text-surface-200">{progress?.tasks_completed || 0}</strong> of {progress?.tasks_total || 0} quests completed
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <ShopModal
        isOpen={shopOpen}
        onClose={() => setShopOpen(false)}
        rpgState={rpgState}
        onPurchase={handlePurchase}
      />
    </motion.div>
  )
}

export default Dashboard
