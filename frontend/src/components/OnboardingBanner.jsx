import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
    Sparkles,
    Target,
    BookOpen,
    Trophy,
    ArrowRight,
    X,
    Zap,
    Flame
} from 'lucide-react'

/**
 * OnboardingBanner - Shows welcome hints for new users (0% progress)
 * Dismissible and persists the dismissed state in localStorage
 */
function OnboardingBanner({ onDismiss }) {
    const [isVisible, setIsVisible] = useState(() => {
        return localStorage.getItem('onboarding_dismissed') !== 'true'
    })

    const handleDismiss = () => {
        localStorage.setItem('onboarding_dismissed', 'true')
        setIsVisible(false)
        if (onDismiss) onDismiss()
    }

    const steps = [
        {
            icon: BookOpen,
            title: "Start Learning",
            description: "Go to Practice and complete your first Deep Dive lesson",
            color: "primary"
        },
        {
            icon: Target,
            title: "Take a Quiz",
            description: "Test your knowledge and earn XP for correct answers",
            color: "accent"
        },
        {
            icon: Trophy,
            title: "Level Up",
            description: "Complete daily tasks to unlock badges and achievements",
            color: "yellow"
        }
    ]

    if (!isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ type: "spring", bounce: 0.3 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-900/40 via-surface-900 to-accent-900/20 border border-primary-500/20 p-6 mb-6"
            >
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-[100px] -mr-32 -mt-32 rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/10 blur-[80px] -ml-24 -mb-24 rounded-full pointer-events-none" />

                {/* Dismiss button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 p-2 text-surface-500 hover:text-surface-300 hover:bg-surface-800/50 rounded-lg transition-colors z-20"
                    aria-label="Dismiss welcome banner"
                >
                    <X className="w-4 h-4" />
                </button>

                <div className="relative z-10">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-primary-500/20 rounded-xl border border-primary-500/30">
                            <Sparkles className="w-6 h-6 text-primary-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-surface-100 flex items-center gap-2">
                                Welcome, Adventurer!
                                <Flame className="w-5 h-5 text-accent-400 animate-pulse" />
                            </h2>
                            <p className="text-sm text-surface-400">Your 100-day coding journey begins now</p>
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-6">
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * (index + 1) }}
                                className={`p-4 rounded-xl bg-surface-800/40 border border-surface-700/50 hover:border-${step.color}-500/30 transition-colors group`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-lg bg-${step.color}-500/10 group-hover:bg-${step.color}-500/20 transition-colors`}>
                                        <step.icon className={`w-5 h-5 text-${step.color}-400`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold text-surface-600 uppercase">Step {index + 1}</span>
                                        </div>
                                        <h3 className="font-semibold text-surface-200 text-sm mb-1">{step.title}</h3>
                                        <p className="text-xs text-surface-500 leading-relaxed">{step.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="flex flex-wrap items-center gap-4">
                        <Link
                            to="/practice"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary-900/40 hover:scale-105 active:scale-95"
                        >
                            <Zap className="w-4 h-4" />
                            Begin Day 1
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <button
                            onClick={handleDismiss}
                            className="text-sm text-surface-500 hover:text-surface-300 transition-colors underline-offset-2 hover:underline"
                        >
                            I know what I'm doing
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

export default OnboardingBanner
