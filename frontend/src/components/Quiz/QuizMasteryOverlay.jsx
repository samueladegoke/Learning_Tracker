import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sword } from 'lucide-react'

function QuizMasteryOverlay({ message }) {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
                >
                    <div className="bg-primary-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 whitespace-nowrap">
                        <Sword className="w-5 h-5 text-yellow-300 animate-pulse" />
                        <span className="font-bold">{message}</span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default QuizMasteryOverlay
