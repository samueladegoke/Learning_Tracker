import { useQuery } from "convex/react"
import { api } from "../../../convex/_generated/api"
import { useAuth } from "../contexts/AuthContext"
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
    const { user } = useAuth()
    const currentDay = DAY_META[activeDay]
    const quizId = currentDay?.quizId

    const reviewData = useQuery(api.srs.getDailyReview, isReviewMode && user?.id ? { clerkUserId: user.id } : "skip")
    const quizData = useQuery(api.quizzes.getQuizQuestions, !isReviewMode && quizId ? { quizId } : "skip")

    const loading = isReviewMode ? reviewData === undefined : (quizId ? quizData === undefined : false)
    const error = null

    let questions = []
    if (isReviewMode && reviewData) {
        questions = reviewData.reviews || []
    } else if (!isReviewMode && quizData) {
        questions = quizData
    }

    // Derived data
    const hasCoding = questions.some(q => q.question_type === 'coding')
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
        refetch: () => {}
    }
}

export default useDayQuiz
