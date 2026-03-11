import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../src/components/ProtectedRoute';

const authState = vi.hoisted(() => ({
    state: {
        isAuthenticated: false,
        loading: false,
    },
}));

vi.mock('../../src/contexts/AuthContext', () => ({
    useAuth: () => authState.state,
}));

function renderProtectedRoute() {
    return render(
        <MemoryRouter initialEntries={['/private']}>
            <Routes>
                <Route
                    path="/private"
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
}

describe('ProtectedRoute smoke', () => {
    beforeEach(() => {
        authState.state = {
            isAuthenticated: false,
            loading: false,
        };
    });

    it('redirects guests to login', async () => {
        renderProtectedRoute();
        expect(await screen.findByText('Login Page')).toBeInTheDocument();
    });

    it('renders protected content for authenticated users', async () => {
        authState.state = {
            isAuthenticated: true,
            loading: false,
        };

        renderProtectedRoute();
        expect(await screen.findByText('Protected Content')).toBeInTheDocument();
    });
});
