import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export function GlitchButton({ children, className, onClick, ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative px-6 py-3 bg-primary-600 text-white font-display font-bold uppercase tracking-wider overflow-hidden group",
        "clip-path-slant", // We might need to add this utility or style
        className
      )}
      onClick={onClick}
      {...props}
    >
      {/* Glitch Layers */}
      <span className="absolute top-0 left-0 w-full h-full bg-primary-400 opacity-0 group-hover:opacity-20 translate-x-[-2px] animate-glitch" />
      <span className="absolute top-0 left-0 w-full h-full bg-accent-500 opacity-0 group-hover:opacity-20 translate-x-[2px] animate-glitch delay-75" />
      
      {/* Text Content */}
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      
      {/* Hover Scanline */}
      <div className="absolute inset-0 bg-white/20 h-[2px] w-full -translate-y-full group-hover:animate-scan" />
    </motion.button>
  )
}
