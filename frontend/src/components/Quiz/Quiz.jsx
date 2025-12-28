import { useState, useEffect } from 'react'
import { quizzesAPI, srsAPI } from '../../api/client'
import { Progress } from '@/components/ui/progress'

// Shared Sub-components
import QuestionRenderer from './QuestionRenderer'
import QuizResult from './QuizResult'
import QuizPagination from './QuizPagination'
import QuizMasteryOverlay from './QuizMasteryOverlay'
import { QuizLoadingSkeleton } from '../PracticeLoadingSkeleton'

/**
 * Consolidated Quiz Component
 * Handles MCQ, Coding, and Code Correction questions.
 */
function Quiz({
    quizId,
    activeDay,
    initialQuestions = [],
    isChallengeTab = false,
    setIsChallengeCleared,
    isReviewMode = false
}) {
    const [questions, setQuestions] = useState(initialQuestions)
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState({}) // { questionId: selectedIndex or { code, passed, total } }
    const [showResult, setShowResult] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [resultData, setResultData] = useState(null)
    const [loading, setLoading] = useState(initialQuestions.length === 0)
    const [error, setError] = useState(null)
    const [quizStats, setQuizStats] = useState(null)
    const [xpWarning, setXpWarning] = useState(null)
    const [masteryMessage, setMasteryMessage] = useState(null)
    const [verifiedAnswers, setVerifiedAnswers] = useState({}) // { questionId: { correct_index, explanation, is_correct } }

    useEffect(() => {
        if (initialQuestions && initialQuestions.length > 0) {
            setQuestions(initialQuestions)
            setLoading(false)
        } else if (!isReviewMode && quizId) {
            loadQuiz(quizId)
        } else if (isReviewMode && initialQuestions && initialQuestions.length === 0) {
            setQuestions([])
            setLoading(false)
        }

        // Reset local state whenever props change
        setCurrentQ(0)
        setAnswers({})
        setShowResult(false)
        setResultData(null)
    }, [quizId, initialQuestions, isReviewMode])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (showResult || loading || questions.length === 0) return
            const currentQuestion = questions[currentQ]
            if (!currentQuestion) return

            const isMCQ = currentQuestion.question_type !== 'coding'
            if (!isMCQ) return

            const options = currentQuestion.options || []
            const questionId = currentQuestion.id

            if (e.key >= '1' && e.key <= '4') {
                const idx = parseInt(e.key) - 1
                if (idx < options.length && !verifiedAnswers[questionId]) {
                    e.preventDefault()
                    setAnswers(prev => ({ ...prev, [questionId]: idx }))
                }
            }
            if (e.key === 'Enter' && !e.shiftKey) {
                const sel = answers[questionId]
                if (sel !== undefined && !verifiedAnswers[questionId]) {
                    e.preventDefault()
                    handleMCQAnswer(sel)
                }
            }
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault()
                e.stopPropagation()
                if (currentQ < questions.length - 1) setCurrentQ(prev => prev + 1)
            }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault()
                e.stopPropagation()
                if (currentQ > 0) setCurrentQ(prev => prev - 1)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [currentQ, questions, answers, verifiedAnswers, showResult, loading])

    const loadQuiz = async (targetQuizId) => {
        try {
            setLoading(true)
            setError(null)
            const data = await quizzesAPI.getQuestions(targetQuizId)
            setQuestions(data || [])
            if (data?.length > 0) {
                const stats = {
                    total: data.length,
                    byType: { mcq: 0, coding: 0, 'code-correction': 0 },
                    byDifficulty: { easy: 0, medium: 0, hard: 0 }
                }
                data.forEach(q => {
                    stats.byType[q.question_type || 'mcq']++
                    stats.byDifficulty[q.difficulty || 'medium']++
                })
                setQuizStats(stats)
            }
        } catch (err) {
            setError('Failed to load questions. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleMCQAnswer = async (optionIndex) => {
        const questionId = questions[currentQ].id
        setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
        try {
            const verifyResult = await quizzesAPI.verifyAnswer(questionId, { answer_index: optionIndex })
            setVerifiedAnswers(prev => ({ ...prev, [questionId]: verifyResult }))
            if (isReviewMode) {
                const srsResult = await srsAPI.submitResult({
                    review_id: questionId,
                    was_correct: verifyResult.is_correct
                })
                if (srsResult?.message) {
                    setMasteryMessage(srsResult.message)
                    setTimeout(() => setMasteryMessage(null), 4000)
                }
            }
        } catch (err) {
            setXpWarning('Verification failed. Result may not persist.')
        }
    }

    const handleCodingResult = async (result) => {
        const questionId = questions[currentQ].id
        setAnswers(prev => ({ ...prev, [questionId]: result }))
        try {
            const verifyResult = await quizzesAPI.verifyAnswer(questionId, { code: result.code })
            setVerifiedAnswers(prev => ({ ...prev, [questionId]: verifyResult }))
            if (isReviewMode) {
                const srsResult = await srsAPI.submitResult({
                    review_id: questionId,
                    was_correct: result.allPassed
                })
                if (srsResult?.message) {
                    setMasteryMessage(srsResult.message)
                    setTimeout(() => setMasteryMessage(null), 4000)
                }
            }
        } catch (err) {
            setXpWarning('Verification failed.')
        }
        if (result.allPassed) {
            setIsChallengeCleared?.(true)
            setTimeout(() => setIsChallengeCleared?.(false), 3000)
        }
    }

    const finishQuiz = async () => {
        if (isReviewMode) {
            const total = questions.length
            const correct = questions.filter(q => verifiedAnswers[q.id]?.is_correct).length
            setResultData({
                score: correct,
                total_questions: total,
                xp_gained: 0,
                percentage: (correct / total) * 100,
                xp_saved: true
            })
            setShowResult(true)
            return
        }

        setIsSubmitting(true)
        try {
            const result = await quizzesAPI.submit({ quiz_id: quizId, answers })
            setResultData({ ...result, xp_saved: true })
            setShowResult(true)
        } catch (error) {
            setError(`Submission failed: ${error.message}`)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) return <QuizLoadingSkeleton />

    if (error) return (
        <div className="text-center p-8">
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={() => loadQuiz(quizId)} className="btn-primary px-8">Retry</button>
        </div>
    )

    if (questions.length === 0) return (
        <div className="text-center p-8 text-surface-400">No questions found for this quiz.</div>
    )

    if (showResult) return (
        <QuizResult
            resultData={resultData}
            isReviewMode={isReviewMode}
            quizStats={quizStats}
            xpWarning={xpWarning}
            onRetry={() => loadQuiz(quizId)}
            onContinue={() => (window.location.href = '/')}
        />
    )

    const currentQuestion = questions[currentQ]
    const isMCQ = currentQuestion.question_type !== 'coding'
    const isAnswered = isMCQ ? answers[currentQuestion.id] !== undefined : answers[currentQuestion.id]?.code !== undefined

    return (
        <div className="max-w-4xl mx-auto mt-4 px-4 sm:px-0">
            <QuizMasteryOverlay message={masteryMessage} />

            {/* Header & Progress */}
            <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-surface-400 text-sm font-medium">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                        <span className="whitespace-nowrap">Question {currentQ + 1} of {questions.length}</span>
                        <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${currentQuestion.question_type === 'mcq' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                            currentQuestion.question_type === 'code-correction' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30' :
                                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            }`}>
                            {currentQuestion.question_type?.replace('-', ' ')}
                        </span>
                        {currentQuestion.difficulty && (
                            <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-bold ${currentQuestion.difficulty === 'easy' ? 'text-green-400 bg-green-500/10' :
                                currentQuestion.difficulty === 'medium' ? 'text-amber-400 bg-amber-500/10' :
                                    'text-red-400 bg-red-500/10'
                                }`}>
                                {currentQuestion.difficulty}
                            </span>
                        )}
                    </div>
                </div>
                <Progress value={((currentQ + 1) / questions.length) * 100} className="h-2" />
            </div>

            <QuestionRenderer
                question={currentQuestion}
                selectedAnswer={answers[currentQuestion.id]}
                verifiedAnswer={verifiedAnswers[currentQuestion.id]}
                onMCQAnswer={handleMCQAnswer}
                onCodingResult={handleCodingResult}
            />

            <QuizPagination
                questions={questions}
                currentQ={currentQ}
                setCurrentQ={setCurrentQ}
                answers={answers}
                isAnswered={isAnswered}
                isMCQ={isMCQ}
                onNext={currentQ < questions.length - 1 ? () => setCurrentQ(c => c + 1) : finishQuiz}
            />
        </div>
    )
}

export default Quiz
