import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { clearSessionCache } from '../api/client'

/**
 * Authentication Context
 * Provides global auth state and methods for sign in, sign up, and sign out.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Initialize auth state on mount
    useEffect(() => {
        let mounted = true

        async function initializeAuth() {
            try {
                // Get initial session
                const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession()

                if (sessionError) {
                    console.error('[Auth] Session error:', sessionError)
                }

                if (mounted) {
                    setSession(initialSession)
                    setUser(initialSession?.user ?? null)
                    setLoading(false)
                }
            } catch (err) {
                console.error('[Auth] Initialization error:', err)
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        initializeAuth()

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, currentSession) => {
                if (mounted) {
                    setSession(currentSession)
                    setUser(currentSession?.user ?? null)
                    setLoading(false)

                    // Clear API cache on sign out to prevent stale token usage
                    if (event === 'SIGNED_OUT') {
                        clearSessionCache()
                    }
                }
            }
        )

        return () => {
            mounted = false
            subscription.unsubscribe()
        }
    }, [])

    /**
     * Sign in with email and password
     */
    const signIn = useCallback(async (email, password) => {
        setError(null)
        setLoading(true)

        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (signInError) {
                setError(signInError.message)
                setLoading(false)
                return { success: false, error: signInError.message }
            }

            setLoading(false)
            return { success: true, user: data.user }
        } catch (err) {
            const message = err.message || 'An unexpected error occurred'
            setError(message)
            setLoading(false)
            return { success: false, error: message }
        }
    }, [])

    /**
     * Sign up with email and password
     */
    const signUp = useCallback(async (email, password) => {
        setError(null)
        setLoading(true)

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            })

            if (signUpError) {
                setError(signUpError.message)
                setLoading(false)
                return { success: false, error: signUpError.message }
            }

            // Check if email confirmation is required
            if (data.user && !data.session) {
                setLoading(false)
                return {
                    success: true,
                    user: data.user,
                    message: 'Check your email to confirm your account'
                }
            }

            setLoading(false)
            return { success: true, user: data.user }
        } catch (err) {
            const message = err.message || 'An unexpected error occurred'
            setError(message)
            setLoading(false)
            return { success: false, error: message }
        }
    }, [])

    /**
     * Sign out
     */
    const signOut = useCallback(async () => {
        setError(null)

        try {
            const { error: signOutError } = await supabase.auth.signOut()

            if (signOutError) {
                setError(signOutError.message)
                return { success: false, error: signOutError.message }
            }

            // Clear local state
            setUser(null)
            setSession(null)
            clearSessionCache()

            return { success: true }
        } catch (err) {
            const message = err.message || 'An unexpected error occurred'
            setError(message)
            return { success: false, error: message }
        }
    }, [])

    const value = {
        user,
        session,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        isAuthenticated: !!user,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

/**
 * Hook to access auth context
 */
export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}

export default AuthContext
