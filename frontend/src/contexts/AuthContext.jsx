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
            }

            // Handle intermediate states that require further verification
            if (result.status === "needs_first_factor") {
                // Attempt password verification
                const firstFactorResult = await clerkSignIn.attemptFirstFactor({
                    strategy: "password",
                    password,
                });

                if (firstFactorResult.status === "complete") {
                    await setActive({ session: firstFactorResult.createdSessionId });
                    return { success: true, user: firstFactorResult.userData };
                }
            }

            if (result.status === "needs_second_factor") {
                // User has 2FA enabled - would need TOTP code
                return { success: false, error: "Two-factor authentication required. Please disable 2FA in your account settings or use a different login method." };
            }

            // Fallback for other statuses
            console.log("SignIn requires next step:", result.status, result);
            return { success: false, error: `Additional verification required: ${result.status}` };
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
