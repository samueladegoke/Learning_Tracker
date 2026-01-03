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
    // Guest experience messaging (for white-labeling)
    guestPrompts: {
        dashboardHeading: 'Ready to master Python?',
        dashboardSubheading: 'Track your progress, earn achievements, and build a professional portfolio through our focused curriculum.',
        dashboardCta: 'Sign In to Start',
        progressHeading: 'Sign In to Track Progress',
        progressDescription: 'Achievements, streaks, and statistics are exclusive to members. Start your journey today!',
        calendarHeading: 'Sign In for Activity Stats',
        calendarDescription: 'Keep track of your daily streaks and learning activity. Sign in to see your calendar in action!',
        reflectionsHeading: 'Sign In for Reflections',
        reflectionsDescription: 'Journal your learning journey and track your growth by signing in today!',
        plannerHeading: 'Learning Roadmap',
        plannerDescription: 'Your focused curriculum to master technical skills through intentional practice.',
        practiceDeepDive: 'Unlock Deep Dive Content',
        practiceDeepDiveDesc: 'Get access to detailed lessons, code examples, and in-depth explanations for all 100 days.',
        practiceQuiz: 'Sign In to Practice',
        practiceQuizDesc: 'Quizzes help reinforce what you learn. Sign in to track progress, earn XP, and unlock achievements.',
        practiceChallenge: 'Sign In for Coding Challenges',
        practiceChallengeDesc: 'Test your skills with hands-on coding exercises. Sign in to submit solutions and earn XP.',
        practiceReview: 'Memory Training',
        practiceReviewDesc: 'Spaced Repetition is a personalized learning system. Sign in to access your custom review queue.',
        guestCta: 'Go to Sign In',
    },
}

const CourseContext = createContext(null)

export function CourseProvider({ children, courseId = null }) {
    const [course, setCourse] = useState(DEFAULT_COURSE)
    const [isLoading, setIsLoading] = useState(false)

    // Calculate derived values
    const totalUnits = useMemo(() => Object.keys(DAY_META).length, [])

    // Update document title dynamically
    useEffect(() => {
        document.title = `${course.title} - Learning Tracker`
    }, [course.title])

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
