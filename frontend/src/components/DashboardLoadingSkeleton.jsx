import { Skeleton } from "@/components/ui/skeleton"

/**
 * Skeleton loading component for Dashboard
 * Provides visual feedback during initial data synchronization
 */
export function DashboardLoadingSkeleton() {
    return (
        <div className="space-y-6 pb-12">
            {/* Character Card Skeleton */}
            <div className="card p-6 flex items-center gap-6">
                <Skeleton className="w-20 h-20 rounded-full bg-surface-800" />
                <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-40 bg-surface-800" />
                    <Skeleton className="h-4 w-24 bg-surface-800" />
                    <Skeleton className="h-3 w-full max-w-xs bg-surface-800" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-8 w-20 bg-surface-800" />
                    <Skeleton className="h-8 w-20 bg-surface-800" />
                </div>
            </div>

            {/* Quest Shop Button Skeleton */}
            <div className="flex justify-end">
                <Skeleton className="h-12 w-40 rounded-xl bg-surface-800" />
            </div>

            {/* Grid Layout */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Daily Review Widget Skeleton */}
                    <div className="card p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-6 w-36 bg-surface-800" />
                            <Skeleton className="h-8 w-24 rounded-lg bg-surface-800" />
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton key={i} className="h-20 rounded-lg bg-surface-800" />
                            ))}
                        </div>
                    </div>

                    {/* Active Mission Card Skeleton */}
                    <div className="card p-6 space-y-4">
                        <Skeleton className="h-4 w-24 bg-surface-800" />
                        <Skeleton className="h-8 w-64 bg-surface-800" />
                        <Skeleton className="h-4 w-full max-w-md bg-surface-800" />
                        <Skeleton className="h-12 w-40 rounded-xl bg-surface-800" />
                    </div>

                    {/* Quest Log Skeleton */}
                    <div className="card p-6 space-y-4">
                        <Skeleton className="h-6 w-32 bg-surface-800" />
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <Skeleton className="h-5 w-5 rounded bg-surface-800" />
                                    <Skeleton className="h-5 flex-1 bg-surface-800" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Navigation Card Skeleton */}
                    <div className="card p-6 space-y-4">
                        <Skeleton className="h-6 w-28 bg-surface-800" />
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-xl bg-surface-800" />
                            ))}
                        </div>
                    </div>

                    {/* Campaign Progress Skeleton */}
                    <div className="card p-6 space-y-4 flex flex-col items-center">
                        <Skeleton className="h-6 w-36 bg-surface-800" />
                        <Skeleton className="h-40 w-40 rounded-full bg-surface-800" />
                        <Skeleton className="h-8 w-32 rounded-full bg-surface-800" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardLoadingSkeleton
