/**
 * Renders text with inline code formatting.
 * Parses backtick-wrapped text and renders it as <code> elements.
 * 
 * Example: "What does `\\n` do?" becomes:
 *   What does <code>\n</code> do?
 */
export function InlineCode({ text }) {
    if (!text) return null

    // Split by backticks and alternate between text and code
    const parts = text.split(/`([^`]+)`/)

    return (
        <>
            {parts.map((part, index) => {
                // Odd indices are inside backticks (code)
                if (index % 2 === 1) {
                    // For code content, convert any interpreted escape sequences back to display text
                    // This handles cases where DB stores \n but JS interprets it as newline
                    const displayPart = part
                        .replace(/\n/g, '\\n')
                        .replace(/\t/g, '\\t')
                        .replace(/\r/g, '\\r')

                    return (
                        <code
                            key={index}
                            className="px-1.5 py-0.5 rounded bg-surface-700 text-primary-300 font-mono text-sm whitespace-pre"
                        >
                            {displayPart}
                        </code>
                    )
                }
                // Even indices are regular text
                return <span key={index}>{part}</span>
            })}
        </>
    )
}

export default InlineCode
