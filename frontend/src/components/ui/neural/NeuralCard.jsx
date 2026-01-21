import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function NeuralCard({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "relative bg-surface-900/80 border border-surface-800 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 group hover:border-primary-500/30",
        className
      )}
      {...props}
    >
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary-500/50 rounded-tl-sm" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary-500/50 rounded-tr-sm" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary-500/50 rounded-bl-sm" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary-500/50 rounded-br-sm" />

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] opacity-20" />

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  )
}
