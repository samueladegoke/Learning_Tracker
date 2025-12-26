import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import {
    Layout,
    BookOpen,
    Zap,
    ScrollText,
    ArrowUpRight
} from 'lucide-react'

import { quizzesAPI } from '../api/client'
import { DAY_META } from '@data/dayMeta.js'

// Custom Components
import { DeepDiveRenderer } from '../components/practice/DeepDiveRenderer'
import { DaySelector } from '../components/practice/DaySelector'
import { Quiz } from '../components/practice/Quiz'
import PortfolioOnboarding from '../components/PortfolioOnboarding'

function Practice() {
    const location = useLocation()
    const navigate = useNavigate()
    const queryParams = new URLSearchParams(location.search)

    const [activeTab, setActiveTab] = useState('deep-dive')
    const [activeDay, setActiveDay] = useState(() => {
        const day = queryParams.get('day')
        return day && DAY_META[day] ? day : 'day-5'
    })
    const [completedQuizzes, setCompletedQuizzes] = useState([])
    const [stats, setStats] = useState({ totalCompleted: 0, currentStreak: 0 })

    // Sync with URL (only one-way: state to URL for consistency)
    useEffect(() => {
        const params = new URLSearchParams()
        params.set('day', activeDay)
        navigate({ search: params.toString() }, { replace: true })
    }, [activeDay, navigate])

    // Load initial global data (Completed quizzes)
    useEffect(() => {
        const fetchGlobalData = async () => {
            try {
                const completed = await quizzesAPI.getCompleted()
                setCompletedQuizzes(completed.map(q => q.quiz_id))
                setStats({
                    totalCompleted: completed.length,
                    currentStreak: 0 // Placeholder for real streak logic
                })
            } catch (err) {
                console.error('Failed to fetch completed quizzes:', err)
            }
        }
        fetchGlobalData()
    }, [])

    const handleQuizComplete = () => {
        // Refresh completed status
        quizzesAPI.getCompleted().then(completed => {
            setCompletedQuizzes(completed.map(q => q.quiz_id))
        }).catch(err => console.error('Failed to refresh completed quizzes:', err))
    }

    const currentDayMeta = DAY_META[activeDay]

    return (
        <div className="min-h-screen bg-surface-950 pb-20">
            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-900/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-surface-800/20 blur-[100px] rounded-full" />
            </div>

            {/* Portfolio Onboarding Overlay */}
            <PortfolioOnboarding />

            <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-900/40 transform -rotate-3">
                                <ScrollText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-surface-50 whitespace-nowrap tracking-tight">
                                    Knowledge <span className="text-primary-400">Chronicles</span>
                                </h1>
                                <p className="text-surface-400 text-sm font-medium">Documenting the 100 Days of Code Odyssey</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="px-5 py-3 rounded-2xl bg-surface-900/80 border border-primary-500/20 backdrop-blur-xl shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="text-right border-r border-surface-800 pr-4">
                                    <div className="text-[10px] font-bold text-surface-500 uppercase tracking-widest mb-0.5">Collection</div>
                                    <div className="text-xl font-black text-surface-100 leading-none">{stats.totalCompleted} <span className="text-xs text-primary-400 font-bold">/ 100</span></div>
                                </div>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-surface-950 bg-surface-800 flex items-center justify-center">
                                            <div className={`w-full h-full rounded-full opacity-40 ${i === 1 ? 'bg-primary-500' : i === 2 ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Day Selection Slider */}
                <DaySelector
                    activeDay={activeDay}
                    setActiveDay={setActiveDay}
                    completedQuizzes={completedQuizzes}
                    dayMeta={DAY_META}
                />

                {/* Hero Card for Selected Day */}
                <motion.div
                    key={activeDay}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mb-8 rounded-[2.5rem] bg-surface-900 border border-surface-800 p-8 md:p-12 overflow-hidden shadow-2xl group"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/5 blur-[100px] -mr-32 -mt-32 rounded-full transition-all group-hover:bg-primary-600/10" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/5 blur-[80px] -ml-24 -mb-24 rounded-full" />

                    <div className="relative z-10 grid md:grid-cols-[1fr_auto] gap-8 items-start">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] border border-primary-500/20 backdrop-blur-sm">
                                    Module {Math.floor((parseInt(activeDay.split('-')[1]) - 1) / 10) + 1}
                                </span>
                                <span className="flex items-center gap-1.5 text-surface-500 text-[10px] font-bold uppercase tracking-widest">
                                    <Layout className="w-3 h-3" /> {currentDayMeta.level || 'Beginner'} Level
                                </span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-surface-50 leading-tight tracking-tighter">
                                {currentDayMeta.title}
                            </h2>
                            <p className="text-surface-400 text-lg max-w-2xl font-medium leading-relaxed">
                                {currentDayMeta.subtitle}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-2">
                                {currentDayMeta.topics.map(topic => (
                                    <span key={topic} className="px-4 py-1.5 rounded-xl bg-surface-950/60 text-surface-300 text-xs font-bold border border-surface-800 group-hover:border-primary-500/30 transition-colors">
                                        # {topic}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <div className="w-24 h-24 rounded-[2rem] bg-surface-950/50 border border-surface-800 flex items-center justify-center backdrop-blur-xl group-hover:scale-110 transition-transform duration-500">
                                <div className="text-center">
                                    <div className="text-4xl font-black text-primary-400 mb-0.5">{activeDay.split('-')[1]}</div>
                                    <div className="text-[10px] font-black text-surface-500 uppercase tracking-widest">Day</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content Area with Custom Tabs */}
                <div className="space-y-8">
                    <div className="flex items-center p-1.5 bg-surface-900 rounded-2xl border border-surface-800 w-fit mx-auto md:mx-0 shadow-xl backdrop-blur-xl">
                        {[
                            { id: 'deep-dive', label: 'Compendium', icon: BookOpen },
                            { id: 'quiz', label: 'Trials', icon: Zap }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 px-8 py-3 rounded-xl text-sm font-black transition-all uppercase tracking-widest group ${activeTab === tab.id
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/40 scale-[1.02]'
                                    : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'deep-dive' ? (
                                <motion.div
                                    key="deep-dive"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="prose prose-invert max-w-none"
                                >
                                    <div className="bg-surface-900/40 rounded-[2.5rem] border border-surface-800 p-8 md:p-12 shadow-2xl backdrop-blur-sm">
                                        <header className="mb-12 border-b border-surface-800 pb-10">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="h-0.5 w-12 bg-primary-500" />
                                                <span className="text-primary-400 font-black uppercase tracking-[0.3em] text-xs">Core Curriculum</span>
                                            </div>
                                            <h3 className="text-3xl md:text-4xl font-black text-surface-50 mb-4 tracking-tight">The Neural Pathway</h3>
                                            <p className="text-surface-400 font-medium">Systematic breakdown of daily concepts and architectural patterns.</p>
                                        </header>
                                        <DeepDiveRenderer activeDay={activeDay} />
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="quiz"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="relative"
                                >
                                    <div className="absolute top-0 left-0 w-full h-full bg-primary-600/5 blur-[120px] rounded-full pointer-events-none" />
                                    <Quiz
                                        quizId={currentDayMeta.quizId}
                                        onComplete={handleQuizComplete}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Section */}
                <div className="mt-20 pt-10 border-t border-surface-800 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-surface-900 border border-surface-700 flex items-center justify-center">
                            <span className="text-[10px] font-black text-primary-400">100D</span>
                        </div>
                        <p className="text-xs font-bold text-surface-500 uppercase tracking-widest">Learning Tracker • V2.0.0</p>
                    </div>
                    <div className="flex items-center gap-8">
                        <a href="https://github.com/samueladegoke" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[10px] font-black text-surface-500 hover:text-primary-400 uppercase tracking-widest transition-colors">
                            Repository <ArrowUpRight className="w-3 h-3" />
                        </a>
                        <a href="#" className="flex items-center gap-2 text-[10px] font-black text-surface-500 hover:text-primary-400 uppercase tracking-widest transition-colors">
                            Documentation <ArrowUpRight className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Practice
