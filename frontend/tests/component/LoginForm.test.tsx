import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../src/pages/Login';

const { mockSignIn, mockSignUp } = vi.hoisted(() => ({
    mockSignIn: vi.fn().mockResolvedValue({ success: true }),
    mockSignUp: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock('../../src/contexts/AuthContext', () => ({
    useAuth: () => ({
        signIn: mockSignIn,
        signUp: mockSignUp,
        isAuthenticated: false,
        loading: false,
        error: null,
    }),
}));

vi.mock('../../src/contexts/CourseContext', () => ({
    useCourse: () => ({
        title: 'Learning Tracker',
    }),
}));

function renderLogin() {
    return render(
        <BrowserRouter>
            <Login />
        </BrowserRouter>
    );
}

describe('Login Page', () => {
    beforeEach(() => {
        mockSignIn.mockClear();
        mockSignUp.mockClear();
    });

    it('renders login form correctly', () => {
        renderLogin();

        expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });

    it('validates empty inputs', async () => {
        renderLogin();

        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
        });
    });

    it('submits sign-in credentials through AuthContext', async () => {
        renderLogin();

        fireEvent.change(screen.getByPlaceholderText('you@example.com'), {
            target: { value: 'user@example.com' },
        });
        fireEvent.change(screen.getByPlaceholderText('••••••••'), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(mockSignIn).toHaveBeenCalledWith('user@example.com', 'password123');
        });
    });
});
