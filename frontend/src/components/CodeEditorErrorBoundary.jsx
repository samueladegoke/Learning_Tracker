import React from 'react'
import { AlertTriangle } from 'lucide-react'

/**
 * Error Boundary for CodeEditor - M4 Fix
 * Gracefully handles Pyodide initialization failures without crashing the Quiz
 */
class CodeEditorErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('CodeEditor Error:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center bg-orange-500/5 rounded-2xl border border-orange-500/20">
                    <AlertTriangle className="w-10 h-10 text-orange-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-surface-100 mb-2">Code Editor Unavailable</h3>
                    <p className="text-surface-400 text-sm mb-4">
                        The Python runtime failed to load. This may be due to network issues or browser compatibility.
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="px-4 py-2 bg-surface-800 text-surface-200 rounded-lg border border-surface-700 hover:bg-surface-700 transition-colors text-sm font-medium"
                    >
                        Try Again
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default CodeEditorErrorBoundary
