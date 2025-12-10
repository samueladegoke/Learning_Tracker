import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } }
}

const CurrentSyncStatus = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date())
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const { date: formattedDate, time: formattedTime } = {
        date: currentDateTime.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        time: currentDateTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        })
    }

    return (
        <motion.div variants={itemVariants} className="card p-5 bg-gradient-to-r from-primary-900/10 to-surface-900 border-primary-500/10">
            <div className="flex items-center justify-between">
                <div>
                    <div className="text-xs font-bold text-surface-500 uppercase tracking-widest mb-1">Current Sync</div>
                    <div className="text-lg font-display font-semibold text-surface-100">{formattedDate}</div>
                    <div className="text-sm text-primary-400 font-mono">{formattedTime}</div>
                </div>
                <div className="p-3 bg-surface-800/50 rounded-xl border border-white/5">
                    <Calendar className="w-6 h-6 text-primary-400" />
                </div>
            </div>
        </motion.div>
    )
}

export default CurrentSyncStatus
