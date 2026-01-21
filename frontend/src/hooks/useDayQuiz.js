import { useState, useEffect } from 'react'
import { quizzesAPI, srsAPI } from '../api/client'
import { DAY_META } from '@/data/dayMeta.js'

/**
 * Custom hook for managing day-specific quiz data fetching.
 * Handles both regular quiz mode and SRS review mode.
 * 
 * @param {string} activeDay - The active day key (e.g., 'day-1')
 * @param {boolean} isReviewMode - Whether to fetch SRS review questions instead
 * @returns {Object} Quiz state and methods
 */
function useDayQuiz(activeDay, isReviewMode = false) {
    const [questions, setQuestions] = useState([])
    const [hasCoding, setHasCoding] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [fetchCounter, setFetchCounter] = useState(0)

    const currentDay = DAY_META[activeDay]
    const quizId = currentDay?.quizId

    useEffect(() => {
        let cancelled = false

        const loadQuizData = async () => {
            setLoading(true)
            setError(null)

            try {
                if (isReviewMode) {
                    const data = await srsAPI.getDailyReview()
                    if (!cancelled) {
                        setQuestions(data.questions || [])
                        setHasCoding(false)
                    }
                } else if (quizId) {
                    const data = await quizzesAPI.getQuestions(quizId)
                    if (!cancelled) {
                        setQuestions(data || [])
                        setHasCoding(data?.some(q => q.question_type === 'coding') || false)
                    }
                } else {
                    // No quiz for this day
                    if (!cancelled) {
                        setQuestions([])
                        setHasCoding(false)
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    console.error('Failed to load quiz data:', err)
                    setError(err.message || 'Failed to load questions')
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadQuizData()

        return () => {
            cancelled = true
        }
    }, [activeDay, isReviewMode, quizId, fetchCounter])

    // Derived data
    const mcqQuestions = questions.filter(q => q.question_type !== 'coding')
    const codingQuestions = questions.filter(q => q.question_type === 'coding')

    return {
        // State
        questions,
        mcqQuestions,
        codingQuestions,
        hasCoding,
        loading,
        error,

        // Metadata
        quizId,
        currentDay,

        // Methods
        refetch: () => setFetchCounter(c => c + 1)
    }
}

export default useDayQuiz
