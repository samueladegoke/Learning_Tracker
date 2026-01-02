import { DAY_META } from '@/data/dayMeta.js'

// Default project start date (can be overridden via options)
const DEFAULT_START_DATE = new Date('2025-11-20')
const DEFAULT_TOTAL_DAYS = 100

/**
 * Custom hook for accessing day metadata.
 * Provides computed properties and helper functions for day navigation.
 * 
 * @param {string} activeDay - The active day key (e.g., 'day-1')
 * @param {Object} options - Configuration options
 * @param {Date} options.startDate - Project start date (default: 2025-11-20)
 * @param {number} options.totalDays - Total days in course (default: 100)
 * @returns {Object} Day metadata and navigation helpers
 */
function useDayMeta(activeDay, options = {}) {
    const { startDate = DEFAULT_START_DATE, totalDays = DEFAULT_TOTAL_DAYS } = options
    const currentDay = DAY_META[activeDay] || null

    /**
     * Calculate today's day key based on project start date
     */
    const getTodayKey = () => {
        const now = new Date()
        const diffDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24))
        const day = Math.min(totalDays, Math.max(1, diffDays + 1))
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
