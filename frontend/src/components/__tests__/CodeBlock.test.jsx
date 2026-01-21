import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CodeBlock from '../CodeBlock'

describe('CodeBlock', () => {
    const originalClipboard = navigator.clipboard

    beforeEach(() => {
        // Mock clipboard API for each test
        Object.assign(navigator, {
            clipboard: {
                writeText: vi.fn(),
            },
        })
    })

    afterEach(() => {
        // Restore original clipboard
        Object.assign(navigator, { clipboard: originalClipboard })
    })

    it('renders code content correctly', () => {
        const code = 'print("Hello, World!")'
        render(<CodeBlock code={code} language="python" />)

        expect(screen.getByText('print("Hello, World!")')).toBeInTheDocument()
    })

    it('displays the language label', () => {
        render(<CodeBlock code="const x = 1" language="javascript" />)

        expect(screen.getByText('javascript')).toBeInTheDocument()
    })

    it('defaults to python language', () => {
        render(<CodeBlock code="x = 1" />)

        expect(screen.getByText('python')).toBeInTheDocument()
    })

    it('shows copy button and changes text on click', async () => {
        render(<CodeBlock code="test code" language="python" />)

        const copyButton = screen.getByText('Copy')
        expect(copyButton).toBeInTheDocument()

        fireEvent.click(copyButton)

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test code')
        expect(screen.getByText('Copied!')).toBeInTheDocument()
    })
})
