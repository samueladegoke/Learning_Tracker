import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Confetti celebration component
 * Renders animated confetti particles for celebration moments
 */
function Confetti({ isActive, duration = 3000, onComplete }) {
    const [particles, setParticles] = useState([])

    useEffect(() => {
        if (!isActive) {
            setParticles([])
            return
        }

        // Generate confetti particles
        const colors = [
            '#facc15', // primary gold
            '#d946ef', // accent fuchsia
            '#22c55e', // success green
            '#3b82f6', // blue
            '#f97316', // orange
            '#ec4899', // pink
        ]

        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            delay: Math.random() * 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
        }))

        setParticles(newParticles)

        // Clear after duration
        const timer = setTimeout(() => {
            setParticles([])
            onComplete?.()
        }, duration)

        return () => clearTimeout(timer)
    }, [isActive, duration, onComplete])

    if (!isActive && particles.length === 0) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            <AnimatePresence>
                {particles.map((particle) => (
                    <motion.div
                        key={particle.id}
                        initial={{
                            x: `${particle.x}vw`,
                            y: -20,
                            rotate: particle.rotation,
                            opacity: 1,
                        }}
                        animate={{
                            y: '100vh',
                            rotate: particle.rotation + 360,
                            opacity: [1, 1, 0.8, 0],
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 2.5 + Math.random(),
                            delay: particle.delay,
                            ease: 'easeOut',
                        }}
                        style={{
                            position: 'absolute',
                            width: particle.size,
                            height: particle.size,
                            backgroundColor: particle.color,
                            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    )
}

export default Confetti
