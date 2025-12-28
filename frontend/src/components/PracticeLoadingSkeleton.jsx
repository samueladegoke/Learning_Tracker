import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton loading component for Practice page content
 * Provides visual feedback during API data fetching
 */
export function PracticeLoadingSkeleton() {
    return (
        <div className="p-6 space-y-6">
            {/* Title skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-8 w-3/4 bg-surface-800" />
                <Skeleton className="h-4 w-1/2 bg-surface-800" />
            </div>

            {/* Content blocks skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-4 w-full bg-surface-800" />
                <Skeleton className="h-4 w-5/6 bg-surface-800" />
                <Skeleton className="h-4 w-4/5 bg-surface-800" />
            </div>

            {/* Code block skeleton */}
            <div className="rounded-lg border border-surface-700/50 p-4">
                <Skeleton className="h-3 w-20 mb-3 bg-surface-800" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full bg-surface-800/50" />
                    <Skeleton className="h-4 w-3/4 bg-surface-800/50" />
                    <Skeleton className="h-4 w-5/6 bg-surface-800/50" />
                    <Skeleton className="h-4 w-2/3 bg-surface-800/50" />
                </div>
            </div>

            {/* Additional paragraph skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-surface-800" />
                <Skeleton className="h-4 w-4/5 bg-surface-800" />
            </div>
        </div>
    )
}

/**
 * Skeleton loading component for Quiz content
 */
export function QuizLoadingSkeleton() {
    return (
        <div className="p-6 space-y-6">
            {/* Question header skeleton */}
            <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-32 bg-surface-800" />
                <Skeleton className="h-6 w-20 bg-surface-800" />
            </div>

            {/* Question text skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-6 w-full bg-surface-800" />
                <Skeleton className="h-6 w-3/4 bg-surface-800" />
            </div>

            {/* Answer options skeleton */}
            <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton
                        key={i}
                        className="h-14 w-full rounded-lg bg-surface-800"
                    />
                ))}
            </div>

            {/* Submit button skeleton */}
            <Skeleton className="h-12 w-40 rounded-xl bg-surface-800" />
        </div>
    )
}

export default PracticeLoadingSkeleton
