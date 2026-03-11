import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Component } from 'react';
import ErrorBoundary from '../../src/components/ErrorBoundary';

// Component that throws an error for testing
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
    if (shouldThrow) {
        throw new Error('Test error');
    }
    return <div>No error</div>;
}

// Suppress console.error for cleaner test output
const originalError = console.error;

/**
 * ErrorBoundary Component Tests
 * Tests the error boundary wrapper that catches React errors
 */
describe('ErrorBoundary', () => {
    beforeEach(() => {
        console.error = vi.fn();
    });

    afterEach(() => {
        console.error = originalError;
    });

    describe('Normal Operation', () => {
        it('renders children when no error occurs', () => {
            render(
                <ErrorBoundary>
                    <div data-testid="child">Child Component</div>
                </ErrorBoundary>
            );

            expect(screen.getByTestId('child')).toBeInTheDocument();
            expect(screen.getByText('Child Component')).toBeInTheDocument();
        });

        it('does not show error UI when children render successfully', () => {
            render(
                <ErrorBoundary>
                    <div>Normal content</div>
                </ErrorBoundary>
            );

            expect(screen.queryByText('SYSTEM MALFUNCTION')).not.toBeInTheDocument();
        });
    });

    describe('Error Handling', () => {
        it('catches errors from children and displays error UI', () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            expect(screen.getByText('SYSTEM MALFUNCTION')).toBeInTheDocument();
        });

        it('displays error message in diagnostics', () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            // Open diagnostics details
            const diagnostics = screen.getByText('Diagnostics');
            fireEvent.click(diagnostics);

            // Error should be visible in the pre element
            expect(screen.getByText(/Test error/)).toBeInTheDocument();
        });

        it('shows "Return to Base" button', () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            expect(screen.getByText('Return to Base')).toBeInTheDocument();
        });

        it('shows "Reboot System" button', () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            expect(screen.getByText('Reboot System')).toBeInTheDocument();
        });
    });

    describe('Inline Mode', () => {
        it('shows inline error when componentName is provided', () => {
            render(
                <ErrorBoundary componentName="TestComponent">
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            expect(screen.getByText(/Failed to load TestComponent/)).toBeInTheDocument();
        });

        it('shows "Try Again" button in inline mode', () => {
            render(
                <ErrorBoundary componentName="TestComponent">
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            expect(screen.getByText('Try Again')).toBeInTheDocument();
        });
    });

    describe('Custom Fallback', () => {
        it('renders custom fallback when provided', () => {
            render(
                <ErrorBoundary fallback={<div>Custom error message</div>}>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            expect(screen.getByText('Custom error message')).toBeInTheDocument();
        });
    });

    describe('Recovery Actions', () => {
        it('has clickable "Reboot System" button', () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            const rebootButton = screen.getByText('Reboot System');
            expect(rebootButton).toBeInTheDocument();
            expect(rebootButton).toBeEnabled();
        });

        it('has clickable "Return to Base" button', () => {
            render(
                <ErrorBoundary>
                    <ThrowError shouldThrow={true} />
                </ErrorBoundary>
            );

            const returnButton = screen.getByText('Return to Base');
            expect(returnButton).toBeInTheDocument();
            expect(returnButton).toBeEnabled();
        });
    });

    describe('Component Structure', () => {
        it('exports as default', () => {
            expect(ErrorBoundary).toBeDefined();
        });

        it('is a class component', () => {
            // Error boundaries must be class components
            expect(ErrorBoundary.prototype).toBeInstanceOf(Component);
        });
    });
});
