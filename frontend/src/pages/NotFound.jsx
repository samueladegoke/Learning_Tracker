import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass } from 'lucide-react'

function NotFound() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4"
        >
            <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
                <Compass className="w-20 h-20 text-primary-500/60 mb-6" />
            </motion.div>

            <h1 className="text-6xl font-bold font-display text-surface-100 mb-2">404</h1>
            <p className="text-xl text-surface-400 mb-2">Lost in the void</p>
            <p className="text-surface-600 text-sm mb-8 max-w-sm">
                This page doesn't exist in the curriculum. Head back to base camp.
            </p>

            <Link
                to="/"
                className="btn-primary px-6 py-2.5 inline-flex items-center gap-2"
            >
                Return to Dashboard
            </Link>
        </motion.div>
    )
}

export default NotFound
