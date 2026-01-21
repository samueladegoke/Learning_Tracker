import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Target, Flame, Calendar as CalendarIcon, AlertTriangle, Star, Zap, Crown, Skull, Award, CheckCircle2 } from 'lucide-react'
import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useAuth } from '../contexts/AuthContext'
import { useCourse } from '../contexts/CourseContext'
import Leaderboard from '../components/Leaderboard'
import ProgressRing from '../components/ProgressRing'
import ProgressBar from '../components/ProgressBar'
import BadgeCard from '../components/BadgeCard'

// Helper to calculate level progress locally (matches backend logic)
const calculateLevelStats = (totalXp) => {
    const XP_BASE = 100
    const XP_EXPONENT = 1.2
    const getLevelDuration = (lvl) => Math.floor(XP_BASE * Math.pow(lvl, XP_EXPONENT))
    
    let level = 1
    let remaining = totalXp || 0
    let levelDuration = getLevelDuration(level)
    
    while (remaining >= levelDuration) {
        remaining -= levelDuration
        level++
        levelDuration = getLevelDuration(level)
    }
    
    return {
        level,
        level_progress: (remaining / levelDuration) * 100,
        xp_to_next_level: levelDuration - remaining
    }
}

function Progress() {
  const { user, isAuthenticated } = useAuth()
  const { guestPrompts } = useCourse()
  
  const progress = useQuery(api.progress.get, user?.id ? { clerkUserId: user.id } : "skip")
  const badges = useQuery(api.badges.getAll) || []
  const achievements = useQuery(api.achievements.getAll) || []
  const weeks = useQuery(api.curriculum.getWeeks) || []

  const loading = isAuthenticated && progress === undefined
  const error = null

  const { level_progress, xp_to_next_level } = calculateLevelStats(progress?.xp || 0)
  const levelProgress = level_progress
  const xpToNextLevel = xp_to_next_level

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

  if (!isAuthenticated) {
    return (
      <motion.div
        role="region"
        aria-label="Sign in required for progress tracking"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-12 text-center max-w-2xl mx-auto bg-surface-900/40 border-white/5 mt-10"
      >
        <Trophy className="w-16 h-16 text-surface-600 mx-auto mb-6 opacity-50" />
        <h2 className="text-3xl font-bold text-surface-100 mb-4 font-display">{guestPrompts.progressHeading}</h2>
        <p className="text-surface-500 text-lg mb-8 max-w-md mx-auto">
          {guestPrompts.progressDescription}
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
                <p className="text-3xl font-bold text-primary-400">{progress?.xp || 0}</p>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm uppercase tracking-wide text-surface-500 flex items-center gap-2">
                <Award className="w-4 h-4 text-primary-400" />
                Achievements
              </h3>
              <span className="text-xs text-surface-500">
                {progress?.achievements_earned || 0}/{progress?.achievements_total || achievements.length || 0}
              </span>
            </div>
            {achievements.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {achievements.map((ach) => {
                  const rarityStyles = {
                    trivial: 'border-surface-600 bg-surface-800/50',
                    normal: 'border-primary-600/50 bg-primary-900/20',
                    hard: 'border-amber-500/50 bg-amber-900/20',
                    epic: 'border-purple-500/50 bg-purple-900/20 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                  }
                  const rarity = (ach.difficulty || 'normal').toLowerCase()
                  const rarityClass = rarityStyles[rarity] || rarityStyles.normal

                  const getIcon = () => {
                    const name = ach.name?.toLowerCase() || ''
                    if (name.includes('boss') || name.includes('slayer')) return <Skull className="w-5 h-5" />
                    if (name.includes('streak') || name.includes('fire')) return <Flame className="w-5 h-5" />
                    if (name.includes('quiz') || name.includes('master')) return <Crown className="w-5 h-5" />
                    if (name.includes('first') || name.includes('start')) return <Zap className="w-5 h-5" />
                    return <Star className="w-5 h-5" />
                  }

                  return (
                    <motion.div
                      key={ach.id}
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className={`relative p-4 rounded-xl border-2 transition-all cursor-default ${rarityClass} ${ach.unlocked ? 'opacity-100' : 'opacity-50 grayscale'
                        }`}
                    >
                      {ach.unlocked && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                          rarity === 'hard' ? 'bg-amber-500/20 text-amber-400' :
                            rarity === 'normal' ? 'bg-primary-500/20 text-primary-400' :
                              'bg-surface-600/50 text-surface-400'
                          }`}>
                          {getIcon()}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm text-surface-100 truncate">{ach.name}</h4>
                          <p className="text-xs text-surface-400 mt-0.5 line-clamp-2">{ach.description}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${rarity === 'epic' ? 'text-purple-400' :
                          rarity === 'hard' ? 'text-amber-400' :
                            rarity === 'normal' ? 'text-primary-400' :
                              'text-surface-500'
                          }`}>
                          {rarity}
                        </span>
                        <span className="text-xs font-mono text-primary-400">+{ach.xp_value} XP</span>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-surface-500 text-center py-6">No achievements defined yet.</p>
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
