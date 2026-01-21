import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth as useClerkAuth, useUser, useSignIn, useSignUp, useClerk } from "@clerk/clerk-react";

/**
 * Authentication Context (Clerk Adapter)
 * Adapts Clerk's hooks to match the legacy AuthContext interface.
 */
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const { isLoaded: isAuthLoaded, userId, sessionId } = useClerkAuth();
    const { isLoaded: isUserLoaded, user: clerkUser } = useUser();
    const { signIn: clerkSignIn, isLoaded: isSignInLoaded, setActive } = useSignIn();
    const { signUp: clerkSignUp, isLoaded: isSignUpLoaded, setActive: setSignUpActive } = useSignUp();
    const { signOut: clerkSignOut } = useClerk();

    const [error, setError] = useState(null)

    const loading = !isAuthLoaded || !isUserLoaded || !isSignInLoaded || !isSignUpLoaded;

    // Map Clerk user to legacy user shape if needed, or just pass it through
    // Legacy user had: email, id, etc. Clerk user has id, primaryEmailAddress
    const user = clerkUser ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        ...clerkUser
    } : null;

    /**
     * Sign in with email and password
     */
    const signIn = useCallback(async (email, password) => {
        setError(null)
        if (!isSignInLoaded) return { success: false, error: 'Auth not ready' };

        try {
            const result = await clerkSignIn.create({
                identifier: email,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                return { success: true, user: result.userData };
            } else {
                console.log("SignIn requires next step:", result);
                return { success: false, error: "Multi-factor authentication or other steps required (not supported in legacy UI)" };
            }
        } catch (err) {
            const message = err.errors?.[0]?.message || err.message || 'An unexpected error occurred'
            setError(message)
            return { success: false, error: message }
        }
    }, [isSignInLoaded, clerkSignIn, setActive]);

    /**
     * Sign up with email and password
     */
    const signUp = useCallback(async (email, password) => {
        setError(null)
        if (!isSignUpLoaded) return { success: false, error: 'Auth not ready' };

        try {
            const result = await clerkSignUp.create({
                emailAddress: email,
                password,
            });

            if (result.status === "complete") {
                await setSignUpActive({ session: result.createdSessionId });
                return { success: true, user: result.userData };
            } else if (result.status === "missing_requirements") {
                 return { success: false, error: "Missing requirements (e.g. captcha)" };
            } else {
                // Usually verification needed
                return {
                    success: true, // Treat as success for "check email" flow
                    user: result.userData,
                    message: 'Check your email to confirm your account'
                }
            }
        } catch (err) {
            const message = err.errors?.[0]?.message || err.message || 'An unexpected error occurred'
            setError(message)
            return { success: false, error: message }
        }
    }, [isSignUpLoaded, clerkSignUp, setSignUpActive]);

    /**
     * Sign out
     */
    const signOut = useCallback(async () => {
        setError(null)
        try {
            await clerkSignOut();
            return { success: true }
        } catch (err) {
            const message = err.message || 'An unexpected error occurred'
            setError(message)
            return { success: false, error: message }
        }
    }, [clerkSignOut]);

    const value = {
        user,
        session: sessionId ? { user, access_token: "clerk_token_handled_automatically" } : null, // Mock session object for compatibility
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
