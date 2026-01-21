import { useState } from 'react'

function CodeBlock({ code, language = 'python' }) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="relative group rounded-lg overflow-hidden border border-surface-700 bg-surface-900 my-4">
            <div className="flex justify-between items-center px-4 py-2 bg-surface-800 border-b border-surface-700">
                <span className="text-xs font-mono text-surface-400 uppercase">{language}</span>
                <button
                    onClick={handleCopy}
                    className="text-xs text-surface-400 hover:text-surface-100 transition-colors"
                >
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <div className="p-4 overflow-x-auto">
                <pre className="font-mono text-sm text-surface-200">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    )
}

export default CodeBlock
