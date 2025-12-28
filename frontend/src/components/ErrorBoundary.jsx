import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

/**
 * Error Boundary component for catching React errors in child components.
 * Particularly useful for lazy-loaded components that may fail to load.
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught error:', error, errorInfo)
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            const { fallback, componentName = 'Component' } = this.props

            if (fallback) {
                return fallback
            }

            return (
                <div className="flex flex-col items-center justify-center p-8 bg-surface-800/50 rounded-xl border border-red-500/20">
                    <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
                    <h3 className="text-lg font-medium text-surface-100 mb-2">
                        Failed to load {componentName}
                    </h3>
                    <p className="text-sm text-surface-400 mb-4 text-center max-w-md">
                        {this.state.error?.message || 'An unexpected error occurred.'}
                    </p>
                    <button
                        onClick={this.handleRetry}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-500/10 text-primary-400 rounded-lg hover:bg-primary-500/20 transition-colors"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
