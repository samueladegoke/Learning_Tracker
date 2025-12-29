import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Trophy,
    PartyPopper,
    BookOpen,
    Check,
    X,
    AlertTriangle,
    ArrowLeft,
    ArrowRight,
    Loader2,
    Crown,
    Sword,
    Lightbulb,
    Zap
} from 'lucide-react'
import { quizzesAPI, srsAPI, rpgAPI } from '../../api/client'
import CodeEditor from '../CodeEditor'
import CodeEditorErrorBoundary from '../CodeEditorErrorBoundary'
import InlineCode from '../InlineCode'

// Maximum visible page buttons in quiz pagination
const MAX_VISIBLE_PAGES = 7

export function Quiz({ quizId, onComplete }) {
    const navigate = useNavigate()
    const [questions, setQuestions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState({})
    const [verifiedAnswers, setVerifiedAnswers] = useState({})
    const [showResults, setShowResults] = useState(false)
    const [score, setScore] = useState(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [masteryMessage, setMasteryMessage] = useState('')
    const [srsError, setSrsError] = useState(false) // M4 Fix: Track SRS sync failures
    const navRef = useRef(null)

    // H2 Fix: Scroll navigation into view when explanation appears
    useEffect(() => {
        if (questions.length > 0 && answers[questions[currentQ]?.id] !== undefined && navRef.current) {
            navRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
    }, [answers, currentQ, questions])

    // M3 Fix: Memoize progress stats to prevent recalculation on every render
    // Moved to top level to avoid React Hook violation
    const progressStats = useMemo(() => {
        if (questions.length === 0) return { answered: 0, correct: 0, percentage: 0 }
        const answered = Object.keys(answers).length
        const correct = Object.values(verifiedAnswers).filter(v => v?.is_correct).length
        const percentage = Math.round((answered / questions.length) * 100)
        return { answered, correct, percentage }
    }, [questions.length, answers, verifiedAnswers])

    // H1 Fix: AbortController prevents race conditions on rapid day switching
    useEffect(() => {
        const controller = new AbortController()
        const loadQuestions = async () => {
            setLoading(true)
            setError(null)
            try {
                const data = await quizzesAPI.getDayQuestions(quizId)
                // H1 Fix: Check if aborted before updating state
                if (controller.signal.aborted) return
                if (import.meta.env.DEV) {
                    console.log(`[Quiz Debug] Loaded questions for ${quizId}:`, data)
                }
                setQuestions(data.questions || data || []) // Handle both direct arrays and {questions: []}
                // Reset state for new quiz
                setCurrentQ(0)
                setAnswers({})
                setVerifiedAnswers({})
                setShowResults(false)
                setScore(0)
            } catch (err) {
                if (controller.signal.aborted) return // Ignore aborted fetches
                console.error('Failed to load quiz:', err)
                setError('Failed to load quiz questions.')
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }
        loadQuestions()
        return () => controller.abort()
    }, [quizId])

    const handleMCQAnswer = async (optionIdx) => {
        const currentQuestion = questions[currentQ]
        if (verifiedAnswers[currentQuestion.id]) return

        setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIdx }))

        try {
            const result = await quizzesAPI.verifyAnswer(currentQuestion.id, {
                answer_index: optionIdx,
                is_mcq: true
            })
            setVerifiedAnswers(prev => ({ ...prev, [currentQuestion.id]: result }))

            if (result.is_correct) {
                setScore(prev => prev + 1)
                // Minimal RPG integration: increment mastery or send to backend
                try {
                    const srsResult = await srsAPI.submitReview({
                        question_id: currentQuestion.id,
                        quality: 5
                    })
                    if (srsResult.mastery_level > 1) {
                        setMasteryMessage(`Mastery Level ${srsResult.mastery_level}!`)
                        setTimeout(() => setMasteryMessage(''), 3000)
                    }
                } catch (e) {
                    console.error('SRS Submit failed', e)
                    setSrsError(true) // M4 Fix: Track failure for user visibility
                }
            } else {
                try {
                    await srsAPI.submitReview({
                        question_id: currentQuestion.id,
                        quality: 0
                    })
                } catch (e) {
                    console.error('SRS Submit failed', e)
                    setSrsError(true) // M4 Fix: Track failure
                }
            }
        } catch (err) {
            console.error('Failed to verify answer:', err)
        }
    }

    const handleCodingResult = async (result) => {
        const currentQuestion = questions[currentQ]
        setAnswers(prev => ({ ...prev, [currentQuestion.id]: result }))

        if (result.allPassed) {
            try {
                const verification = await quizzesAPI.verifyAnswer(currentQuestion.id, {
                    answer: { allPassed: Boolean(result?.allPassed) }
                })
                setVerifiedAnswers(prev => ({ ...prev, [currentQuestion.id]: verification }))
                setScore(prev => prev + 1)

                await srsAPI.submitReview({
                    question_id: currentQuestion.id,
                    quality: 5
                })
            } catch (err) {
                console.error('Failed to verify coding answer:', err)
            }
        }
    }

    const nextQuestion = () => {
        if (currentQ < questions.length - 1) {
            setCurrentQ(prev => prev + 1)
        } else {
            submitQuiz()
        }
    }

    const prevQuestion = () => {
        if (currentQ > 0) {
            setCurrentQ(prev => prev - 1)
        }
    }

    const submitQuiz = async () => {
        setIsSubmitting(true)
        try {
            // M2 Fix: Pass score to backend for persistence
            await quizzesAPI.completeQuiz(quizId, score)
            setShowResults(true)
            if (onComplete) onComplete()
        } catch (err) {
            console.error('Failed to submit quiz:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
                <Loader2 className="w-10 h-10 text-primary-400 animate-spin" />
                <p className="text-surface-400 font-medium">Summoning questions...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="p-12 text-center bg-red-500/5 rounded-3xl border border-red-500/20">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-surface-100 mb-2">Failed to Load Quiz</h3>
                <p className="text-surface-400 mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-surface-800 text-surface-200 rounded-xl border border-surface-700 hover:bg-surface-700 transition-colors"
                >
                    Retry
                </button>
            </div>
        )
    }

    if (questions.length === 0) {
        return (
            <div className="p-12 text-center bg-surface-800/50 rounded-3xl border border-surface-700">
                <BookOpen className="w-12 h-12 text-surface-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-surface-300">No questions available for this day.</h3>
            </div>
        )
    }

    if (showResults) {
        const percentage = Math.round((score / questions.length) * 100)
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xl mx-auto p-10 bg-surface-800 rounded-[2.5rem] border border-surface-700 shadow-2xl text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600" />
                <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                <h2 className="text-3xl font-black text-surface-100 mb-4 tracking-tight">Quiz Complete!</h2>
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <svg className="w-32 h-32 transform -rotate-90">
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                className="text-surface-700"
                            />
                            <circle
                                cx="64"
                                cy="64"
                                r="58"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={364.4}
                                strokeDashoffset={364.4 - (364.4 * percentage) / 100}
                                className="text-primary-500 transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black text-surface-100 leading-none">{percentage}%</span>
                            <span className="text-[10px] font-bold text-surface-400 uppercase tracking-tighter">Score</span>
                        </div>
                    </div>
                </div>
                <p className="text-surface-300 text-lg mb-8 leading-relaxed">
                    You answered <span className="font-bold text-primary-400">{score}</span> out of <span className="font-bold">{questions.length}</span> questions correctly.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => {
                            setCurrentQ(0)
                            setAnswers({})
                            setVerifiedAnswers({})
                            setShowResults(false)
                            setScore(0)
                        }}
                        className="px-6 py-3 bg-surface-700 text-surface-200 rounded-2xl font-bold hover:bg-surface-600 transition-all flex items-center justify-center gap-2"
                    >
                        Retake Quiz
                    </button>
                    <button
                        onClick={() => navigate('/progress')}
                        className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-bold hover:bg-primary-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-900/20"
                    >
                        View Progress <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        )
    }

    const currentQuestion = questions[currentQ]
    const isAnswered = answers[currentQuestion.id] !== undefined
    const selectedOption = answers[currentQuestion.id]
    // L1 Fix: Use question_type field from API instead of inferring from starter_code
    const isCoding = currentQuestion.question_type === 'coding'
    const isMCQ = currentQuestion.question_type === 'mcq' || currentQuestion.question_type === 'code-correction'


    return (
        <div className="max-w-4xl mx-auto">
            {/* M1 Fix: Simplified Progress Header - reduced cognitive load */}
            <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center border border-primary-500/20">
                        <Zap className="w-5 h-5 text-primary-400" />
                    </div>
                    <div>
                        <p className="text-lg font-bold text-surface-100 leading-tight">Question {currentQ + 1}<span className="text-surface-500 font-medium">/{questions.length}</span></p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <span className="text-sm font-bold text-primary-400">{progressStats.correct}</span>
                        <span className="text-xs text-surface-500"> correct</span>
                    </div>
                    {/* M3 Fix: Single progress bar instead of 29 individual dots */}
                    <div className="w-24 h-2 bg-surface-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary-600 to-primary-400 transition-all duration-300"
                            style={{ width: `${progressStats.percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            <div className="relative p-8 md:p-10 bg-surface-800 rounded-[2rem] md:rounded-[3rem] border border-surface-700 shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />

                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="px-2.5 py-1 rounded-md bg-primary-600/20 text-primary-400 text-[10px] font-black uppercase tracking-widest border border-primary-500/20">
                            {isMCQ ? 'Conceptual' : 'Implementation'}
                        </span>
                        {verifiedAnswers[currentQuestion.id] && (
                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border ${verifiedAnswers[currentQuestion.id].is_correct ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                                {verifiedAnswers[currentQuestion.id].is_correct ? 'Succeeded' : 'Failed'}
                            </span>
                        )}
                    </div>
                    <h4 className="text-xl md:text-2xl font-bold text-surface-100 leading-tight">
                        <InlineCode text={currentQuestion.text} />
                    </h4>
                </div>

                {isMCQ && (
                    <div className="flex-1 space-y-4">
                        {currentQuestion.code && (
                            <div className="p-5 bg-surface-900 rounded-2xl border border-surface-700/50 mb-6 font-mono overflow-x-auto">
                                <div className="text-xs text-orange-400 mb-2 uppercase tracking-wider font-medium">Code to Fix:</div>
                                <pre className="font-mono text-sm text-primary-300 whitespace-pre-wrap">{currentQuestion.code}</pre>
                            </div>
                        )}
                        <div className="space-y-3">
                            {currentQuestion.options?.map((opt, idx) => {
                                const verified = verifiedAnswers[currentQuestion.id]
                                const isCorrect = verified && idx === verified.correct_index
                                const isSelected = selectedOption === idx
                                const showCorrectness = verified !== undefined

                                let buttonClass = 'bg-surface-700/50 border-surface-600 hover:bg-surface-700 hover:border-surface-500 text-surface-200'
                                let badgeClass = 'bg-surface-600 text-surface-300'

                                if (showCorrectness) {
                                    if (isCorrect) {
                                        buttonClass = 'bg-green-500/20 border-green-500 text-green-200'
                                        badgeClass = 'bg-green-500 text-white'
                                    } else if (isSelected) {
                                        buttonClass = 'bg-red-500/20 border-red-500 text-red-200'
                                        badgeClass = 'bg-red-500 text-white'
                                    }
                                } else if (isSelected) {
                                    buttonClass = 'bg-primary-600/20 border-primary-500 text-primary-200'
                                    badgeClass = 'bg-primary-500 text-white'
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => !showCorrectness && handleMCQAnswer(idx)}
                                        disabled={showCorrectness}
                                        className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center ${buttonClass} ${showCorrectness ? 'cursor-default' : ''}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${badgeClass}`}>
                                                {String.fromCharCode(65 + idx)}
                                            </span>
                                            <span className="font-mono text-sm">{opt}</span>
                                        </div>
                                        {showCorrectness && isCorrect && <Check className="w-5 h-5 text-green-400" />}
                                        {showCorrectness && isSelected && !isCorrect && <X className="w-5 h-5 text-red-400" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {isCoding && (
                    <div className="flex-1 space-y-4">
                        {/* M4 Fix: Error boundary prevents Pyodide crashes from breaking the entire Quiz */}
                        <CodeEditorErrorBoundary>
                            <CodeEditor
                                starterCode={currentQuestion.starter_code || '# Write your code here\n'}
                                testCases={currentQuestion.test_cases || []}
                                onResult={handleCodingResult}
                                questionId={currentQuestion.id}
                            />
                        </CodeEditorErrorBoundary>
                    </div>
                )}

                <div ref={navRef} className="mt-8 pt-6 border-t border-surface-700 flex justify-between items-center">
                    <button
                        onClick={prevQuestion}
                        disabled={currentQ === 0}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${currentQ === 0
                            ? 'text-surface-600 cursor-not-allowed opacity-50'
                            : 'text-surface-400 hover:text-primary-400 hover:bg-primary-500/5'
                            }`}
                    >
                        <ArrowLeft className="w-4 h-4" /> Previous
                    </button>

                    <nav aria-label="Question navigation" className="flex gap-1 items-center overflow-x-auto max-w-md scrollbar-none px-2">
                        {(() => {
                            const totalQ = questions.length
                            const current = currentQ

                            if (totalQ <= MAX_VISIBLE_PAGES) {
                                return questions.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentQ(idx)}
                                        aria-label={`Question ${idx + 1}${answers[questions[idx].id] !== undefined ? ', answered' : ', unanswered'}`}
                                        aria-current={idx === current ? 'true' : undefined}
                                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex-shrink-0 border ${idx === current
                                            ? 'bg-primary-500 border-primary-400 text-white shadow-lg shadow-primary-900/40'
                                            : answers[questions[idx].id] !== undefined
                                                ? 'bg-primary-500/20 border-primary-500/30 text-primary-400 hover:bg-primary-500/30'
                                                : 'bg-surface-700 border-surface-600 text-surface-400 hover:bg-surface-600 hover:text-surface-200'
                                            }`}
                                    >
                                        {idx + 1}
                                    </button>
                                ))
                            }

                            const pages = []
                            const showDots = (key) => <span key={key} className="text-surface-600 px-1 text-xs">•••</span>
                            const pageBtn = (idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentQ(idx)}
                                    aria-label={`Question ${idx + 1}${answers[questions[idx].id] !== undefined ? ', answered' : ', unanswered'}`}
                                    aria-current={idx === current ? 'true' : undefined}
                                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all flex-shrink-0 border ${idx === current
                                        ? 'bg-primary-500 border-primary-400 text-white shadow-lg shadow-primary-900/40'
                                        : answers[questions[idx].id] !== undefined
                                            ? 'bg-primary-500/20 border-primary-500/30 text-primary-400 hover:bg-primary-500/30'
                                            : 'bg-surface-700 border-surface-600 text-surface-400 hover:bg-surface-600 hover:text-surface-200'
                                        }`}
                                >
                                    {idx + 1}
                                </button>
                            )

                            pages.push(pageBtn(0))
                            const start = Math.max(1, current - 1)
                            const end = Math.min(totalQ - 2, current + 1)
                            if (start > 1) pages.push(showDots('dots-start'))
                            for (let i = start; i <= end; i++) pages.push(pageBtn(i))
                            if (end < totalQ - 2) pages.push(showDots('dots-end'))
                            if (totalQ > 1) pages.push(pageBtn(totalQ - 1))
                            return pages
                        })()}
                    </nav>

                    <button
                        onClick={nextQuestion}
                        disabled={!isAnswered && isMCQ || isSubmitting}
                        className={`px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg active:scale-95 ${isAnswered || !isMCQ
                            ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-primary-900/40 hover:from-primary-500 hover:to-primary-400'
                            : 'bg-surface-700 text-surface-500 cursor-not-allowed border border-white/5 opacity-50'
                            }`}
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            currentQ < questions.length - 1 ? <>Next <ArrowRight className="w-4 h-4" /></> : 'Submit Quiz'
                        )}
                    </button>
                </div>

                <AnimatePresence>
                    {masteryMessage && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            className="absolute top-4 left-1/2 -translate-x-1/2 z-20"
                        >
                            <div className="bg-primary-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-white/20 whitespace-nowrap">
                                <Sword className="w-5 h-5 text-yellow-300 animate-pulse" />
                                <span className="font-bold">{masteryMessage}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {currentQuestion.explanation && isAnswered && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: -10, height: 0 }}
                            className="mt-6 overflow-hidden"
                        >
                            <div className="p-5 bg-primary-500/5 rounded-xl border border-primary-500/10 shadow-inner">
                                <h4 className="text-xs font-bold text-primary-400 mb-2 flex items-center gap-2 uppercase tracking-widest">
                                    <Lightbulb className="w-4 h-4 text-yellow-400" /> Theory & Context
                                </h4>
                                <p className="text-surface-300 text-sm leading-relaxed">{currentQuestion.explanation}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
