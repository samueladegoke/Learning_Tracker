import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, X, Star, GitBranch, Briefcase } from 'lucide-react'

const STORAGE_KEY = 'portfolio-onboarding-dismissed'

/**
 * A dismissible onboarding banner displayed for Days 82-100.
 * Welcomes students to the portfolio building phase.
 */
export default function PortfolioOnboarding() {
    const [isDismissed, setIsDismissed] = useState(() => {
        try {
            return localStorage.getItem(STORAGE_KEY) === 'true'
        } catch {
            return false
        }
    })

    const handleDismiss = () => {
        setIsDismissed(true)
        try {
            localStorage.setItem(STORAGE_KEY, 'true')
        } catch {
            // localStorage unavailable
        }
    }

    if (isDismissed) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="relative mb-6 p-5 rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-surface-800/50 to-surface-900/80 backdrop-blur-sm shadow-lg"
            >
                {/* Dismiss Button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 p-1.5 rounded-lg text-surface-400 hover:text-white hover:bg-surface-700/50 transition-colors"
                    aria-label="Dismiss"
                >
                    <X size={18} />
                </button>

                {/* Content */}
                <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="flex-shrink-0 p-3 rounded-xl bg-amber-500/20 border border-amber-500/30">
                        <Rocket className="w-7 h-7 text-amber-400" aria-hidden="true" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 pr-6">
                        <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-400" aria-hidden="true" />
                            Welcome to Portfolio Mode!
                        </h3>
                        <p className="text-surface-300 text-sm leading-relaxed mb-3">
                            Congratulations! You've reached the <strong className="text-amber-300">final phase</strong> of the 100 Days of Code.
                            From here on, there are no more video tutorials—you'll be building <strong className="text-amber-300">professional, portfolio-worthy projects</strong> independently.
                        </p>

                        {/* Action Items */}
                        <div className="flex flex-wrap gap-3 mt-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface-700/60 text-surface-200 border border-surface-600/50">
                                <GitBranch size={13} aria-hidden="true" />
                                Create a GitHub Repo
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface-700/60 text-surface-200 border border-surface-600/50">
                                <Briefcase size={13} aria-hidden="true" />
                                Build Your Portfolio
                            </span>
                        </div>
                    </div>
                </div>

                {/* Got it Button */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleDismiss}
                        className="px-4 py-1.5 rounded-lg text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-colors"
                    >
                        Got it!
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
