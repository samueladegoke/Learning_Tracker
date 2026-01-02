import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Brain } from 'lucide-react'
import { quizzesAPI, srsAPI } from '../api/client'
import { useCourse } from '../contexts/CourseContext'
import { useAuth } from '../contexts/AuthContext'

// Shadcn UI Components
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

// Extracted data and components
import { DAY_META } from '@/data/dayMeta.js'
import { DeepDiveLoader } from '../components/content/DeepDiveLoader'
import { PracticeLoadingSkeleton, QuizLoadingSkeleton } from '../components/PracticeLoadingSkeleton'
import DaySelectorBar from '../components/Quiz/DaySelectorBar'
import Quiz from '../components/Quiz/Quiz'

function Practice() {
    // Get course config from context
    const { startDate, totalDays } = useCourse()
    // Get auth state to guard user-specific API calls
    const { isAuthenticated } = useAuth()

    // Calculate today's day dynamically
    const getTodayKey = () => {
        const now = new Date()
        const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24))
        const day = Math.min(totalDays, Math.max(1, diffDays + 1))
        return `day-${day}`
    }

    const [activeTab, setActiveTab] = useState('deep-dive')
    const [activeDay, setActiveDay] = useState(getTodayKey)
    const [completedQuizzes, setCompletedQuizzes] = useState([])
    const [quizData, setQuizData] = useState({ questions: [], hasCoding: false })
    const [isChallengeCleared, setIsChallengeCleared] = useState(false)
    const [loading, setLoading] = useState(true)
    const [isReviewMode, setIsReviewMode] = useState(() => {
        const params = new URLSearchParams(window.location.search)
        return params.get('mode') === 'review'
    })

    const location = useLocation()

    // Sync review mode if URL changes 
    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const review = params.get('mode') === 'review'
        if (review) setActiveTab('practice')
        if (review !== isReviewMode) setIsReviewMode(review)
    }, [location.search, isReviewMode])

    const currentDay = DAY_META[activeDay]

    // Only fetch completed quizzes if authenticated (prevents 401 for guests)
    useEffect(() => {
        if (isAuthenticated) {
            quizzesAPI.getCompleted()
                .then(setCompletedQuizzes)
                .catch(err => console.error('Failed to load completed quizzes:', err))
        }
    }, [isAuthenticated])

    useEffect(() => {
        let active = true
        const loadDayData = async () => {
            setLoading(true)
            try {
                if (isReviewMode) {
                    // SRS review requires authentication
                    if (!isAuthenticated) {
                        if (active) setQuizData({ questions: [], hasCoding: false })
                        return
                    }
                    const data = await srsAPI.getDailyReview()
                    if (active) setQuizData({ questions: data.questions || [], hasCoding: false })
                } else {
                    const quizId = currentDay?.quizId
                    if (!quizId) return
                    // Quiz questions require authentication
                    if (!isAuthenticated) {
                        if (active) setQuizData({ questions: [], hasCoding: false })
                        return
                    }
                    const questions = await quizzesAPI.getQuestions(quizId)
                    if (active) {
                        const hasCoding = questions.some(q => q.question_type === 'coding')
                        setQuizData({ questions, hasCoding })
                    }
                }
            } catch (err) {
                console.error('Failed to load day data:', err)
            } finally {
                if (active) setLoading(false)
            }
        }
        loadDayData()
        return () => { active = false }
    }, [activeDay, isReviewMode, currentDay?.quizId, isAuthenticated])

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
                        ) : currentDay.title}
                    </h1>
                    {!isReviewMode && (
                        <span className="px-3 py-1 rounded-full bg-surface-800/50 border border-surface-700 text-xs font-medium text-primary-400">
                            {currentDay.level}
                        </span>
                    )}
                </div>
                <p className="text-surface-400 text-lg max-w-2xl">
                    {isReviewMode
                        ? "Strengthening your knowledge with Spaced Repetition. Master these questions to lock them into long-term memory."
                        : currentDay.subtitle}
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

            {/* Celebration Overlay */}
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

            {/* Main Content Area */}
            {!isReviewMode ? (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="w-full justify-start bg-transparent border-b border-surface-700 rounded-none h-auto p-0 mb-6">
                        <TabsTrigger value="deep-dive" className="tab-trigger">Deep Dive</TabsTrigger>
                        <TabsTrigger value="practice" className="tab-trigger">Quiz</TabsTrigger>
                        {quizData.hasCoding && <TabsTrigger value="challenges" className="tab-trigger">Challenges</TabsTrigger>}
                    </TabsList>

                    <div className="min-h-[400px]">
                        {loading ? (
                            activeTab === 'deep-dive' ? <PracticeLoadingSkeleton /> : <QuizLoadingSkeleton />
                        ) : (
                            <>
                                <TabsContent value="deep-dive" className="mt-0">
                                    <DeepDiveLoader activeDay={activeDay} />
                                </TabsContent>
                                <TabsContent value="practice" className="mt-0">
                                    <Quiz
                                        key={`${activeDay}-practice`}
                                        quizId={currentDay.quizId}
                                        activeDay={activeDay}
                                        initialQuestions={quizData.questions.filter(q => q.question_type !== 'coding')}
                                        setIsChallengeCleared={setIsChallengeCleared}
                                        isReviewMode={isReviewMode}
                                    />
                                </TabsContent>
                                <TabsContent value="challenges" className="mt-0">
                                    <Quiz
                                        key={`${activeDay}-challenges`}
                                        quizId={currentDay.quizId}
                                        activeDay={activeDay}
                                        initialQuestions={quizData.questions.filter(q => q.question_type === 'coding')}
                                        isChallengeTab={true}
                                        setIsChallengeCleared={setIsChallengeCleared}
                                        isReviewMode={isReviewMode}
                                    />
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
                            initialQuestions={quizData.questions}
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
