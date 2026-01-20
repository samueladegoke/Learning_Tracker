import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion'
import {
  ShoppingBag,
  Coins,
  Swords,
  Map,
  Compass,
  AlertTriangle,
  Check,
  Scroll,
  ArrowRight,
  Trophy
} from 'lucide-react'
import { progressAPI, weeksAPI, tasksAPI, rpgAPI, badgesAPI } from '../api/client'
import ProgressRing from '../components/ProgressRing'
import ProgressBar from '../components/ProgressBar'
import CharacterCard from '../components/CharacterCard'
import QuestLog from '../components/QuestLog'
import ShopModal from '../components/ShopModal'
import DailyReviewWidget from '../components/DailyReviewWidget'
import { soundManager } from '../utils/SoundManager'
import { useAuth } from '../contexts/AuthContext'
import { useCourse } from '../contexts/CourseContext'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'

import CurrentSyncStatus from '../components/CurrentSyncStatus'

// Shadcn UI Components
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

// Loading States
import { DashboardLoadingSkeleton } from '../components/DashboardLoadingSkeleton'
import OnboardingBanner from '../components/OnboardingBanner'

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

  // Display initial value (0) as fallback until animation kicks in
  return <span ref={ref} className={className}>{Math.floor(value).toLocaleString()}</span>
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

function Dashboard() {
  const { isAuthenticated, user } = useAuth()
  const { guestPrompts } = useCourse()
  const [progress, setProgress] = useState(null)
  const [currentWeek, setCurrentWeek] = useState(null)
  const [rpgState, setRpgState] = useState(null)
  const [badges, setBadges] = useState([])
  const [shopItems, setShopItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [shopOpen, setShopOpen] = useState(false)

  // Get Clerk user ID for Convex operations (fallback to 'dev-user' for local dev)
  const clerkUserId = user?.id || 'dev-user'

  // Convex queries - pass clerkUserId where required
  const convexWeeks = useQuery(api.curriculum.getWeeks)
  const convexRPGState = useQuery(api.rpg.getRPGState, { clerkUserId })

  // Convex mutations
  const completeTaskMutation = useMutation(api.tasks.completeTask)
  const uncompleteTaskMutation = useMutation(api.tasks.uncompleteTask)
  const buyItemMutation = useMutation(api.rpg.buyItem)

  const CACHE_DURATION = 300000 // 5 minutes

  const fetchData = async (force = false) => {
    try {
      const now = Date.now()
      // ... cache logic removed for brevity or kept if desired, but Convex handles cache well.
      // Let's rely on Convex for RPG state primarily, fallback to cache for non-convex if needed.

      setLoading(true)
      const [progressData, badgesData] = await Promise.all([
        progressAPI.get(),
        badgesAPI.getAll(),
      ])

      // Use Convex weeks if available, otherwise fall back to API
      const weeksData = convexWeeks || await weeksAPI.getAll()

      // Use Convex RPG state if available
      const rpgData = convexRPGState || await rpgAPI.getState()

      // Find current week or last week
      const firstIncomplete = weeksData.find(w => w.tasks_completed < w.tasks_total)
      const weekToLoad = firstIncomplete || weeksData[weeksData.length - 1]

      let weekDetails = null
      if (weekToLoad) {
        // Prefer fetching by week number to avoid ID format mismatches (Convex string vs SQL int)
        if (weekToLoad.weekNumber !== undefined) {
          weekDetails = await weeksAPI.getByNumber(weekToLoad.weekNumber)
        } else if (weekToLoad.week_number !== undefined) {
          weekDetails = await weeksAPI.getByNumber(weekToLoad.week_number)
        } else {
          // Fallback to ID
          const weekId = weekToLoad.id || weekToLoad._id
          weekDetails = await weeksAPI.getById(weekId)
        }
      }

      // Shop items (placeholder or fetch if api exists)
      const shopItemsData = [] // rpgAPI.getShopItems() if it existed

      setProgress(progressData)
      setCurrentWeek(weekDetails)
      setRpgState(rpgData)
      setBadges(badgesData)
      setShopItems(shopItemsData)

      // Update Cache
      sessionStorage.setItem('dashboard_cache', JSON.stringify({
        data: {
          progress: progressData,
          currentWeek: weekDetails,
          rpgState: rpgData,
          badges: badgesData,
          shopItems: shopItemsData
        },
        timestamp: now
      }))

    } catch (err) {
      console.error('[Dashboard] Error fetching data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (convexRPGState) {
      setRpgState(convexRPGState);
    }
  }, [convexRPGState]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, convexWeeks]) // Re-run when convexWeeks loads

  const handleTaskToggle = async (taskId, complete) => {
    // Deep clone to preserve original state on revert
    const originalWeek = currentWeek ? { ...currentWeek, tasks: [...currentWeek.tasks] } : null

    // Optimistic update - update UI immediately
    if (currentWeek) {
      const updatedTasks = currentWeek.tasks.map(t =>
        t.task_id === taskId ? { ...t, completed: complete } : t
      )
      const updatedWeek = {
        ...currentWeek,
        tasks: updatedTasks,
        tasks_completed: complete ? currentWeek.tasks_completed + 1 : currentWeek.tasks_completed - 1
      }
      setCurrentWeek(updatedWeek)
    }

    if (complete) soundManager.completeTask()

    try {
      // Use Convex mutations for real-time, atomic task completion
      if (complete) {
        const result = await completeTaskMutation({ clerkUserId, taskId })
        console.log('[Convex] Task completed:', result)
        // If Convex returned bonus info, could show XP popup here
        if (result?.levelUp) {
          soundManager.levelUp?.()
        }
      } else {
        const result = await uncompleteTaskMutation({ clerkUserId, taskId })
        console.log('[Convex] Task uncompleted:', result)
      }
      // Convex will auto-update via subscriptions, but also refresh legacy data
      fetchData(true)
    } catch (err) {
      console.error('Failed to toggle task:', err)
      soundManager.error()
      setCurrentWeek(originalWeek)
    }
  }

  const handlePurchase = async (itemId) => {
    try {
      await buyItemMutation({ itemId })
      // Convex auto-updates rpgState via query subscription
      console.log('[Convex] Item bought:', itemId)
    } catch (err) {
      console.error('Purchase failed:', err)
      throw err
    }
  }

  if (loading) {
    return <DashboardLoadingSkeleton />
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

  const weekProgress = currentWeek && currentWeek.tasks_total > 0
    ? (currentWeek.tasks_completed / currentWeek.tasks_total) * 100
    : 0
  const activeQuest = rpgState?.active_quest
  const activeChallenge = rpgState?.active_challenges?.[0]
  const questProgress = activeQuest && activeQuest.boss_hp
    ? ((activeQuest.boss_hp - (activeQuest.boss_hp_remaining || activeQuest.boss_hp)) / activeQuest.boss_hp) * 100
    : 0
  const challengeProgress = activeChallenge && activeChallenge.goal
    ? (activeChallenge.progress / activeChallenge.goal) * 100
    : 0


  if (!isAuthenticated) {
    return (
      <motion.div
        role="region"
        aria-label="Guest welcome and sign-in prompt"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8 pb-12"
      >
        <div className="card p-12 text-center bg-gradient-to-br from-primary-900/10 to-surface-900 border-primary-500/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Compass className="w-64 h-64 text-primary-400" />
          </div>
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto space-y-6 relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold text-surface-100 font-display leading-tight">
              {guestPrompts.dashboardHeading}
            </h1>
            <p className="text-xl text-surface-400 leading-relaxed">
              {guestPrompts.dashboardSubheading}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/login"
                className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-primary-900/40 hover:scale-105 active:scale-95 w-full sm:w-auto text-center"
              >
                {guestPrompts.dashboardCta}
              </Link>
              <Link
                to="/practice"
                className="px-8 py-4 bg-surface-800 hover:bg-surface-700 text-surface-100 rounded-xl font-bold text-lg transition-all border border-white/5 w-full sm:w-auto"
              >
                Browse Curriculum
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Trophy, title: "Achievements", desc: "Unlock badges and earn XP as you complete daily goals." },
            { icon: Swords, title: "Boss Battles", desc: "Test your skills with coding challenges and interval review." },
            { icon: Scroll, title: "Chronicles", desc: "Write reflections and build a learning journal." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="card p-6 bg-surface-900/40 border-white/5 hover:border-primary-500/20 transition-colors"
            >
              <feature.icon className="w-8 h-8 text-primary-400 mb-4" />
              <h3 className="text-lg font-bold text-surface-100 mb-2">{feature.title}</h3>
              <p className="text-sm text-surface-500 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      <CurrentSyncStatus />

      {/* Onboarding for new users */}
      {progress?.completion_percentage === 0 && (
        <motion.div variants={itemVariants}>
          <OnboardingBanner />
        </motion.div>
      )}

      <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="relative z-20">
        <CharacterCard rpgState={rpgState} progress={progress} />
      </motion.div>

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

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Review Widget (SRS) */}
          <motion.div variants={itemVariants}>
            <DailyReviewWidget />
          </motion.div>

          {/* Daily Training Card */}
          {rpgState && (
            <motion.div
              variants={itemVariants}
              className="card p-6 border-primary-500/20 bg-gradient-to-br from-primary-900/20 to-surface-900 shadow-[0_0_20px_rgba(59,130,246,0.1)] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Compass className="w-32 h-32 text-primary-400 rotate-12" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary-400">
                    <Trophy className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Active Mission</span>
                  </div>
                  <h3 className="text-2xl font-bold text-surface-100">
                    <span className="text-primary-400">Day {rpgState.level}:</span> Journey Continued
                  </h3>
                  <p className="text-surface-400 text-sm max-w-md">
                    Your training path awaits. Complete today's Chronicles of Code to earn XP and advance your rank.
                  </p>
                </div>
                <Link
                  to="/practice"
                  className="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary-900/40 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  Start Training <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}

          <AnimatePresence>
            {activeQuest && (
              <motion.div variants={itemVariants} className="rpg-card p-6 min-h-[200px]" layout>
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
                  <motion.div key={activeQuest.boss_hp_remaining} animate={{ x: [0, -5, 5, -5, 5, 0] }} transition={{ duration: 0.4 }}>
                    <ProgressBar progress={questProgress} showLabel={false} height="h-4" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {currentWeek && <QuestLog tasks={currentWeek.tasks || []} onToggle={handleTaskToggle} />}

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
                    <motion.span className="text-2xl font-bold font-mono text-primary-400">
                      {Math.round(weekProgress)}%
                    </motion.span>
                  </ProgressRing>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card className="bg-surface-900/60 border-white/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-surface-100 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-primary-400" /> Navigation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
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
              </CardContent>
            </Card>
          </motion.div>

          {activeChallenge && (
            <motion.div variants={itemVariants} className="card p-6 border-accent-500/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="badge-accent mb-2">Side Quest</span>
                  <h3 className="text-lg font-bold text-surface-100">{activeChallenge.name}</h3>
                </div>
                <div className="text-right text-sm font-mono font-bold text-accent-300">
                  <NumberTicker value={activeChallenge.progress} />/<NumberTicker value={activeChallenge.goal} />
                </div>
              </div>
              <ProgressBar progress={challengeProgress} showLabel={false} colorClass="bg-accent-500" />
            </motion.div>
          )}

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
                <strong className="text-surface-200">{progress?.tasks_completed || 0}</strong> of {progress?.tasks_total || 0} quests
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <ShopModal isOpen={shopOpen} onClose={() => setShopOpen(false)} rpgState={rpgState} onPurchase={handlePurchase} />
    </motion.div>
  )
}

export default Dashboard
