import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from '../../src/components/ProtectedRoute';

// Mock the auth context
const mockAuthContext = {
    isAuthenticated: false,
    loading: false,
    user: null,
};

vi.mock('../../src/contexts/AuthContext', () => ({
    useAuth: () => mockAuthContext,
}));

// Test wrapper component with AuthProvider mock
function TestWrapper({ children }) {
    return (
        <BrowserRouter>
            {children}
        </BrowserRouter>
    );
}

// Component to display redirect state for testing
function LoginWithStateDisplay() {
    const location = useLocation();
    const fromPath = (location.state as any)?.from?.pathname;
    return (
        <div>
            <div data-testid="login-page">Login Page</div>
            {fromPath && <div data-testid="redirect-from">{fromPath}</div>}
        </div>
    );
}

/**
 * ProtectedRoute Component Tests
 * Tests the authentication guard wrapper component
 */
describe('ProtectedRoute', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset mock to default state
        mockAuthContext.isAuthenticated = false;
        mockAuthContext.loading = false;
        mockAuthContext.user = null;
    });

    describe('Loading State', () => {
        it('shows loading spinner when loading is true', () => {
            mockAuthContext.loading = true;
            mockAuthContext.isAuthenticated = false;

            render(
                <TestWrapper>
                    <ProtectedRoute>
                        <div data-testid="protected-content">Protected Content</div>
                    </ProtectedRoute>
                </TestWrapper>
            );

            // Should show loading spinner
            expect(screen.getByText(/Loading/i)).toBeInTheDocument();
        });
    });

    describe('Authenticated State', () => {
        it('renders children when authenticated', () => {
            mockAuthContext.loading = false;
            mockAuthContext.isAuthenticated = true;
            mockAuthContext.user = { id: 'test', email: 'test@example.com' };

            render(
                <TestWrapper>
                    <ProtectedRoute>
                        <div data-testid="protected-content">Protected Content</div>
                    </ProtectedRoute>
                </TestWrapper>
            );

            expect(screen.getByTestId('protected-content')).toBeInTheDocument();
        });
    });

    describe('Unauthenticated State', () => {
        it('redirects to login when not authenticated', () => {
            mockAuthContext.loading = false;
            mockAuthContext.isAuthenticated = false;

            render(
                <MemoryRouter initialEntries={['/protected']}>
                    <Routes>
                        <Route
                            path="/protected"
                            element={
                                <ProtectedRoute>
                                    <div>Protected Content</div>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<div>Login Page</div>} />
                    </Routes>
                </MemoryRouter>
            );

            // Should redirect to login - showing Login Page
            expect(screen.getByText('Login Page')).toBeInTheDocument();
        });

        it('preserves location state for post-login redirect', () => {
            mockAuthContext.loading = false;
            mockAuthContext.isAuthenticated = false;

            render(
                <MemoryRouter initialEntries={['/protected-page']}>
                    <Routes>
                        <Route
                            path="/protected-page"
                            element={
                                <ProtectedRoute>
                                    <div>Protected Content</div>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<LoginWithStateDisplay />} />
                    </Routes>
                </MemoryRouter>
            );

            // Should redirect to login
            expect(screen.getByTestId('login-page')).toBeInTheDocument();

            // Should preserve the original path in location state
            expect(screen.getByTestId('redirect-from')).toBeInTheDocument();
            expect(screen.getByTestId('redirect-from')).toHaveTextContent('/protected-page');
        });

        it('preserves nested route path in redirect state', () => {
            mockAuthContext.loading = false;
            mockAuthContext.isAuthenticated = false;

            render(
                <MemoryRouter initialEntries={['/profile/settings']}>
                    <Routes>
                        <Route
                            path="/profile/*"
                            element={
                                <ProtectedRoute>
                                    <div>Profile Settings</div>
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/login" element={<LoginWithStateDisplay />} />
                    </Routes>
                </MemoryRouter>
            );

            // Should redirect to login
            expect(screen.getByTestId('login-page')).toBeInTheDocument();

            // Should preserve the full nested path
            expect(screen.getByTestId('redirect-from')).toHaveTextContent('/profile/settings');
        });
    });

    describe('Component Structure', () => {
        it('exports as default', () => {
            expect(ProtectedRoute).toBeDefined();
            expect(typeof ProtectedRoute).toBe('function');
        });
    });
});
