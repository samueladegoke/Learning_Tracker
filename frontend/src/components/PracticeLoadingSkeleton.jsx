import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

/**
 * Skeleton loading component for Practice page content
 * Provides visual feedback during API data fetching
 */
export function PracticeLoadingSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 space-y-8 bg-surface-900/40 rounded-2xl border border-surface-800/50"
        >
            {/* Title skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-10 w-2/3 bg-surface-800/80 rounded-lg" />
                <Skeleton className="h-4 w-1/3 bg-surface-800/60 rounded-full" />
            </div>

            {/* Content blocks skeleton */}
            <div className="space-y-6">
                <div className="space-y-3">
                    <Skeleton className="h-4 w-full bg-surface-800/40" />
                    <Skeleton className="h-4 w-11/12 bg-surface-800/40" />
                    <Skeleton className="h-4 w-full bg-surface-800/40" />
                    <Skeleton className="h-4 w-10/12 bg-surface-800/40" />
                </div>

                {/* Code block skeleton */}
                <div className="rounded-xl border border-surface-700/30 p-5 bg-surface-950/50">
                    <div className="flex gap-2 mb-4">
                        <Skeleton className="w-3 h-3 rounded-full bg-surface-800" />
                        <Skeleton className="w-3 h-3 rounded-full bg-surface-800" />
                        <Skeleton className="w-3 h-3 rounded-full bg-surface-800" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-11/12 bg-primary-500/5" />
                        <Skeleton className="h-4 w-3/4 bg-primary-500/5" />
                        <Skeleton className="h-4 w-5/6 bg-primary-500/5" />
                        <Skeleton className="h-4 w-1/2 bg-primary-500/5" />
                    </div>
                </div>

                <div className="space-y-3">
                    <Skeleton className="h-4 w-full bg-surface-800/40" />
                    <Skeleton className="h-4 w-4/5 bg-surface-800/40" />
                </div>
            </div>
        </motion.div>
    )
}

/**
 * Skeleton loading component for Quiz content
 */
export function QuizLoadingSkeleton() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 space-y-8 bg-surface-900/40 rounded-2xl border border-surface-800/50"
        >
            {/* Question header skeleton */}
            <div className="flex items-center justify-between pb-4 border-b border-surface-800/50">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16 bg-surface-800/60 rounded-full" />
                    <Skeleton className="h-6 w-32 bg-surface-800/80 rounded-lg" />
                </div>
                <Skeleton className="h-8 w-24 bg-surface-800/80 rounded-lg" />
            </div>

            {/* Question text skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-6 w-full bg-surface-800/60" />
                <Skeleton className="h-6 w-2/3 bg-surface-800/60" />
            </div>

            {/* Answer options skeleton */}
            <div className="grid gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-surface-800/50 bg-surface-800/20">
                        <Skeleton className="w-5 h-5 rounded-full bg-surface-800" />
                        <Skeleton className="h-4 flex-1 bg-surface-800/60" />
                    </div>
                ))}
            </div>

            {/* Footer buttons skeleton */}
            <div className="flex items-center justify-between pt-6 border-t border-surface-800/50">
                <Skeleton className="h-10 w-28 rounded-lg bg-surface-800/50" />
                <Skeleton className="h-10 w-32 rounded-xl bg-primary-500/10" />
            </div>
        </motion.div>
    )
}

export default PracticeLoadingSkeleton
