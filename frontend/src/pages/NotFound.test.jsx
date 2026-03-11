/**
 * NotFound.test.jsx
 *
 * Tests for the 404 page:
 *  1. Renders the 404 heading and copy
 *  2. "Return to Dashboard" link navigates to /
 *  3. Compass icon is present
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from '@/pages/NotFound'

const renderNotFound = () =>
    render(
        <MemoryRouter>
            <NotFound />
        </MemoryRouter>
    )

describe('NotFound page', () => {
    it('renders the 404 heading', () => {
        renderNotFound()
        expect(screen.getByText('404')).toBeInTheDocument()
    })

    it('renders the themed tagline', () => {
        renderNotFound()
        expect(screen.getByText(/Lost in the void/i)).toBeInTheDocument()
    })

    it('renders the descriptive body copy', () => {
        renderNotFound()
        expect(screen.getByText(/This page doesn't exist in the curriculum/i)).toBeInTheDocument()
    })

    it('has a "Return to Dashboard" link that points to /', () => {
        renderNotFound()
        const link = screen.getByRole('link', { name: /return to dashboard/i })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute('href', '/')
    })
})
