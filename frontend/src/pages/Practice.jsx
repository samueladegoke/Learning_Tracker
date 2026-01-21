import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Brain, Lock } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCourse } from '../contexts/CourseContext'

// Shadcn UI Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

// Extracted data and components
import { DAY_META } from '@/data/dayMeta.js'
import { DeepDiveLoader } from '../components/content/DeepDiveLoader'
import { PracticeLoadingSkeleton, QuizLoadingSkeleton } from '../components/PracticeLoadingSkeleton'
import DaySelectorBar from '../components/Quiz/DaySelectorBar'
import Quiz from '../components/Quiz/Quiz'

function Practice() {
    const { user } = useAuth()
    
    // Fallback for "completedQuizzes" - for now empty, or we can fetch from backend later
    const completedQuizzes = [] 

    const { startDate, totalDays, guestPrompts } = useCourse()

    const getTodayKey = () => {
        const now = new Date()
        const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24))
        const day = Math.min(totalDays, Math.max(1, diffDays + 1))
        return `day-${day}`
    }

    const [activeTab, setActiveTab] = useState('deep-dive')
    const [activeDay, setActiveDay] = useState(getTodayKey)
    const [isChallengeCleared, setIsChallengeCleared] = useState(false)
    const [isReviewMode, setIsReviewMode] = useState(() => {
        const params = new URLSearchParams(window.location.search)
        return params.get('mode') === 'review'
    })

    const location = useLocation()

    // Dynamic Query Parameters
    const currentDay = DAY_META[activeDay]
    const quizId = currentDay?.quizId

    // Mock Questions for now since Convex is removed
    // In a real implementation, this should fetch from FastAPI
    const quizQuestionsRaw = [] 
    
    // Sync review mode if URL changes 
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const review = params.get('mode') === 'review'
        if (review) setActiveTab('practice')
        if (review !== isReviewMode) setIsReviewMode(review)
    }, [location.search, isReviewMode])

    const isAuthenticated = !!user

    // Unified Guest prompt component
    const GuestPracticePrompt = ({ type = 'practice' }) => {
        const config = {
            'deep-dive': {
                icon: <Lock className="w-16 h-16 text-primary-400 mx-auto mb-6 opacity-70" />,
                title: guestPrompts.practiceDeepDive,
                desc: guestPrompts.practiceDeepDiveDesc,
                cta: 'Sign In to View'
            },
            'practice': {
                icon: <Lock className="w-16 h-16 text-primary-400 mx-auto mb-6 opacity-70" />,
                title: guestPrompts.practiceQuiz,
                desc: guestPrompts.practiceQuizDesc,
                cta: 'Go to Sign In'
            },
            'challenges': {
                icon: <Lock className="w-16 h-16 text-primary-400 mx-auto mb-6 opacity-70" />,
                title: guestPrompts.practiceChallenge,
                desc: guestPrompts.practiceChallengeDesc,
                cta: 'Go to Sign In'
            }
        }[type] || {}

        return (
            <motion.div
                role="region"
                aria-label={`Sign in required for ${type} content`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="clay-card p-12 text-center max-w-2xl mx-auto bg-surface-900/60 border-white/5 backdrop-blur-sm"
            >
                {config.icon}
                <h2 className="text-3xl font-bold text-surface-100 mb-4 font-display">
                    {config.title}
                </h2>
                <p className="text-surface-400 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                    {config.desc}
                </p>
                <Link
                    to="/login"
                    className="btn-primary px-10 py-4 text-xl inline-block shadow-neon-glow hover:scale-105 active:scale-95 transition-all"
                >
                    {config.cta}
                </Link>
            </motion.div>
        )
    }

    if (isReviewMode && !isAuthenticated) {
        return (
            <div className="space-y-8 pb-12 px-4 sm:px-6 lg:px-8">
                <motion.div
                    role="region"
                    aria-label="Sign in required for memory training"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="clay-card p-12 text-center max-w-2xl mx-auto bg-gradient-to-br from-primary-900/20 to-surface-900 border-primary-500/10"
                >
                    <Brain className="w-20 h-20 text-primary-400 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold text-surface-100 mb-4 font-display">
                        {guestPrompts.practiceReview}
                    </h1>
                    <p className="text-surface-400 text-lg mb-8 max-w-md mx-auto">
                        {guestPrompts.practiceReviewDesc}
                    </p>
                    <Link
                        to="/login"
                        className="px-8 py-4 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-bold text-lg transition-all shadow-neon-glow hover:scale-105 active:scale-95 inline-block"
                    >
                        Sign In to Start Training
                    </Link>
                </motion.div>
            </div>
        )
    }

    const quizQuestions = quizQuestionsRaw || []
    const loading = false // Mock loading false since we have no async data yet

    return (
        <div className="space-y-8 pb-12 px-4 sm:px-6 lg:px-8">
            <header className="space-y-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                        {isReviewMode ? (
                            <span className="flex items-center gap-3">
                                <Brain className="w-8 h-8 text-primary-400" />
                                Memory Training
                            </span>
                        ) : currentDay?.title}
                    </h1>
                    {!isReviewMode && currentDay?.level && (
                        <span className="px-3 py-1 rounded-full bg-surface-800/50 border border-surface-700 text-xs font-medium text-primary-400">
                            {currentDay.level}
                        </span>
                    )}
                </div>
                <p className="text-surface-400 text-lg max-w-2xl">
                    {isReviewMode
                        ? "Strengthening your knowledge with Spaced Repetition. Master these questions to lock them into long-term memory."
                        : currentDay?.subtitle}
                </p>

                {!isReviewMode && (
                    <DaySelectorBar
                        activeDay={activeDay}
                        setActiveDay={setActiveDay}
                        completedQuizzes={completedQuizzes}
                        onJumpToToday={() => setActiveDay(getTodayKey())}
                        todayKey={getTodayKey()}
                    />
                )}
            </header>

            <AnimatePresence>
                {isChallengeCleared && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                    >
                        <div className="bg-primary-500/20 backdrop-blur-md rounded-full p-12 shadow-[0_0_100px_rgba(59,130,246,0.5)] border border-primary-400/30">
                            <motion.div animate={{ rotate: [0, -10, 10, -10, 10, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
                                <Trophy className="w-24 h-24 text-yellow-400" />
                            </motion.div>
                            <h2 className="text-3xl font-bold text-white mt-4 text-center drop-shadow-lg">Mission Cleared!</h2>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isReviewMode ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full justify-start bg-transparent border-b border-surface-700 rounded-none h-auto p-0 mb-6">
                        <TabsTrigger value="deep-dive" className="tab-trigger">Deep Dive</TabsTrigger>
                        <TabsTrigger value="practice" className="tab-trigger">Quiz</TabsTrigger>
                        {quizQuestions.some(q => q.question_type === 'coding') && (
                            <TabsTrigger value="challenges" className="tab-trigger">Challenges</TabsTrigger>
                        )}
                    </TabsList>

                    <div className="min-h-[400px]">
                        {loading ? (
                            activeTab === 'deep-dive' ? <PracticeLoadingSkeleton /> : <QuizLoadingSkeleton />
                        ) : (
                            <>
                                <TabsContent value="deep-dive" className="mt-0">
                                    {!isAuthenticated ? (
                                        <GuestPracticePrompt type="deep-dive" />
                                    ) : (
                                        <DeepDiveLoader activeDay={activeDay} />
                                    )}
                                </TabsContent>
                                <TabsContent value="practice" className="mt-0">
                                    {!isAuthenticated ? (
                                        <GuestPracticePrompt type="practice" />
                                    ) : (
                                        <Quiz
                                            key={`${activeDay}-practice`}
                                            quizId={quizId}
                                            activeDay={activeDay}
                                            initialQuestions={quizQuestions.filter(q => q.question_type !== 'coding')}
                                            setIsChallengeCleared={setIsChallengeCleared}
                                            isReviewMode={isReviewMode}
                                        />
                                    )}
                                </TabsContent>
                                <TabsContent value="challenges" className="mt-0">
                                    {!isAuthenticated ? (
                                        <GuestPracticePrompt type="challenges" />
                                    ) : (
                                        <Quiz
                                            key={`${activeDay}-challenges`}
                                            quizId={quizId}
                                            activeDay={activeDay}
                                            initialQuestions={quizQuestions.filter(q => q.question_type === 'coding')}
                                            isChallengeTab={true}
                                            setIsChallengeCleared={setIsChallengeCleared}
                                            isReviewMode={isReviewMode}
                                        />
                                    )}
                                </TabsContent>
                            </>
                        )}
                    </div>
                </Tabs>
            ) : (
                <div className="min-h-[400px]">
                    {loading ? (
                        <QuizLoadingSkeleton />
                    ) : (
                        <Quiz
                            key={`review-mode`}
                            quizId={null}
                            activeDay={activeDay}
                            initialQuestions={quizQuestions}
                            setIsChallengeCleared={setIsChallengeCleared}
                            isReviewMode={isReviewMode}
                        />
                    )}
                </div>
            )}
        </div>
    )
}

export default Practice
