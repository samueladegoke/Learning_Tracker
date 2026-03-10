import { createContext, useContext, useState, useCallback } from 'react'
import { useAuth as useClerkAuth, useUser, useSignIn, useSignUp, useClerk } from "@clerk/clerk-react";

const DEV_MODE = import.meta.env.VITE_DEV_MODE === "true";

const AuthContext = createContext(null)

/** Dev mode provider — no Clerk hooks, mock user */
function DevAuthProvider({ children }) {
    const value = {
        user: { id: "dev_user", email: "dev@localhost" },
        session: { user: { id: "dev_user" }, access_token: "dev_token" },
        loading: false,
        error: null,
        signIn: async () => ({ success: true }),
        signUp: async () => ({ success: true }),
        signOut: async () => ({ success: true }),
        isAuthenticated: true,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

/** Production provider — full Clerk integration */
function ClerkAuthProvider({ children }) {
    const { isLoaded: isAuthLoaded, userId, sessionId } = useClerkAuth();
    const { isLoaded: isUserLoaded, user: clerkUser } = useUser();
    const { signIn: clerkSignIn, isLoaded: isSignInLoaded, setActive } = useSignIn();
    const { signUp: clerkSignUp, isLoaded: isSignUpLoaded, setActive: setSignUpActive } = useSignUp();
    const { signOut: clerkSignOut } = useClerk();

    const [error, setError] = useState(null)

    const loading = !isAuthLoaded || !isUserLoaded || !isSignInLoaded || !isSignUpLoaded;

    const user = clerkUser ? {
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        ...clerkUser
    } : null;

    const signIn = useCallback(async (email, password) => {
        setError(null)
        if (!isSignInLoaded) return { success: false, error: 'Auth not ready' };

        try {
            const result = await clerkSignIn.create({ identifier: email, password });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                return { success: true, user: result.userData };
            }

            if (result.status === "needs_first_factor") {
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
                return { success: false, error: "Two-factor authentication required." };
            }

            return { success: false, error: `Additional verification required: ${result.status}` };
        } catch (err) {
            const message = err.errors?.[0]?.message || err.message || 'An unexpected error occurred'
            setError(message)
            return { success: false, error: message }
        }
    }, [isSignInLoaded, clerkSignIn, setActive]);

    const signUp = useCallback(async (email, password) => {
        setError(null)
        if (!isSignUpLoaded) return { success: false, error: 'Auth not ready' };

        try {
            const result = await clerkSignUp.create({ emailAddress: email, password });

            if (result.status === "complete") {
                await setSignUpActive({ session: result.createdSessionId });
                return { success: true, user: result.userData };
            } else if (result.status === "missing_requirements") {
                return { success: false, error: "Missing requirements (e.g. captcha)" };
            } else {
                return {
                    success: true,
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
        session: sessionId ? { user, access_token: "clerk_token_handled_automatically" } : null,
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

export function AuthProvider({ children }) {
    if (DEV_MODE) {
        return <DevAuthProvider>{children}</DevAuthProvider>
    }
    return <ClerkAuthProvider>{children}</ClerkAuthProvider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext
