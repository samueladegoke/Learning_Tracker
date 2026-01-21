import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InlineCode } from '../InlineCode'

describe('InlineCode', () => {
    it('renders null for empty text', () => {
        const { container } = render(<InlineCode text="" />)
        expect(container.firstChild).toBeNull()
    })

    it('renders null for undefined text', () => {
        const { container } = render(<InlineCode text={undefined} />)
        expect(container.firstChild).toBeNull()
    })

    it('renders plain text without backticks as-is', () => {
        render(<InlineCode text="Hello World" />)
        expect(screen.getByText('Hello World')).toBeInTheDocument()
    })

    it('renders backtick content as code elements', () => {
        render(<InlineCode text="Use `print()` to output" />)

        expect(screen.getByText('Use')).toBeInTheDocument()
        expect(screen.getByText('print()')).toBeInTheDocument()
        expect(screen.getByText('to output')).toBeInTheDocument()

        // Check that print() is in a code element
        const codeElement = screen.getByText('print()')
        expect(codeElement.tagName).toBe('CODE')
    })

    it('handles multiple inline code segments', () => {
        render(<InlineCode text="`a` and `b`" />)

        expect(screen.getByText('a')).toBeInTheDocument()
        expect(screen.getByText('b')).toBeInTheDocument()
        expect(screen.getByText('and')).toBeInTheDocument()
    })

    it('converts newline characters in code to display format', () => {
        // When text contains actual newline in the code part
        render(<InlineCode text="The `\n` character" />)

        // Should display as \\n
        expect(screen.getByText('\\n')).toBeInTheDocument()
    })
})
