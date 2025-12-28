import { DAY_META } from '../data/dayMeta'

// Project start date constant (outside hook to avoid recreation)
const PROJECT_START_DATE = new Date('2025-11-20')

/**
 * Custom hook for accessing day metadata.
 * Provides computed properties and helper functions for day navigation.
 * 
 * @param {string} activeDay - The active day key (e.g., 'day-1')
 * @returns {Object} Day metadata and navigation helpers
 */
function useDayMeta(activeDay) {
    const currentDay = DAY_META[activeDay] || null

    /**
     * Calculate today's day key based on project start date
     */
    const getTodayKey = () => {
        const now = new Date()
        const diffDays = Math.floor((now - PROJECT_START_DATE) / (1000 * 60 * 60 * 24))
        const day = Math.min(100, Math.max(1, diffDays + 1))
        return `day-${day}`
    }

    /**
     * Get the day number from a day key
     */
    const getDayNumber = (dayKey) => {
        return parseInt(dayKey?.replace('day-', '') || '0', 10)
    }

    /**
     * Get the next day key
     */
    const getNextDayKey = () => {
        const currentNum = getDayNumber(activeDay)
        const nextNum = Math.min(100, currentNum + 1)
        return `day-${nextNum}`
    }

    /**
     * Get the previous day key
     */
    const getPrevDayKey = () => {
        const currentNum = getDayNumber(activeDay)
        const prevNum = Math.max(1, currentNum - 1)
        return `day-${prevNum}`
    }

    /**
     * Check if a day has content available
     */
    const hasContent = (dayKey) => {
        return !!DAY_META[dayKey]
    }

    /**
     * Get all available day keys
     */
    const allDays = Object.keys(DAY_META)

    return {
        // Current day data
        currentDay,
        title: currentDay?.title || 'Unknown Day',
        subtitle: currentDay?.subtitle || '',
        level: currentDay?.level || 'Beginner',
        quizId: currentDay?.quizId || null,
        label: currentDay?.label || activeDay,

        // Navigation
        getTodayKey,
        getDayNumber,
        getNextDayKey,
        getPrevDayKey,

        // Utilities
        hasContent,
        allDays,
        totalDays: allDays.length,
        currentDayNumber: getDayNumber(activeDay),
    }
}

export default useDayMeta
