import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { DAY_META } from '../data/dayMeta'

/**
 * CourseContext - Provides dynamic course metadata throughout the application.
 * 
 * This context abstracts the hardcoded "100 Days of Code" branding into a
 * configurable course system. Future iterations will load course data from an API.
 */

// Default course configuration (100 Days of Code)
const DEFAULT_COURSE = {
    id: '100-days-of-code',
    title: '100 Days of Code',
    subtitle: 'Master Python through daily practice',
    logoUrl: '/assets/logo.png',
    startDate: new Date('2025-11-20'),
    totalDays: 100,
    themeConfig: {
        primaryColor: 'primary',
        accentColor: 'accent',
    },
}

const CourseContext = createContext(null)

export function CourseProvider({ children, courseId = null }) {
    const [course, setCourse] = useState(DEFAULT_COURSE)
    const [isLoading, setIsLoading] = useState(false)

    // Calculate derived values
    const totalUnits = useMemo(() => Object.keys(DAY_META).length, [])

    // Future: Load course from API based on courseId
    useEffect(() => {
        if (courseId) {
            // TODO: Implement API-backed course loading
            // setIsLoading(true)
            // fetch(`/api/courses/${courseId}`)
            //   .then(res => res.json())
            //   .then(data => setCourse(data))
            //   .finally(() => setIsLoading(false))
        }
    }, [courseId])

    const value = useMemo(() => ({
        ...course,
        totalUnits,
        isLoading,
        // Helper methods
        getDayMeta: (dayKey) => DAY_META[dayKey] || null,
        getAllDays: () => Object.entries(DAY_META).map(([key, meta]) => ({ key, ...meta })),
    }), [course, totalUnits, isLoading])

    return (
        <CourseContext.Provider value={value}>
            {children}
        </CourseContext.Provider>
    )
}

export function useCourse() {
    const context = useContext(CourseContext)
    if (!context) {
        throw new Error('useCourse must be used within a CourseProvider')
    }
    return context
}

export default CourseContext
