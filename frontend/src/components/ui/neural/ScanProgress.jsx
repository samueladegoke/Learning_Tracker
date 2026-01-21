import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function ScanProgress({ value, max = 100, className, colorClass = "bg-primary-500" }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className={cn("relative h-2 w-full bg-surface-800 rounded-full overflow-hidden", className)}>
      <motion.div
        className={cn("h-full relative", colorClass)}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {/* Animated Gloss/Scan Effect */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </motion.div>
    </div>
  )
}
