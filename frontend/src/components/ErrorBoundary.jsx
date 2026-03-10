import { Component } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { GridBackground } from '@/components/ui/neural/GridBackground'

/**
 * Error Boundary component for catching React errors in child components.
 * Supports two modes:
 * - Full-page mode (default): Shows a full-screen error with cyberpunk styling
 * - Inline mode (with fallback/componentName props): Shows a compact error card
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        console.error('[ErrorBoundary] Caught error:', error)
        console.error('[ErrorBoundary] Error info:', errorInfo)
        this.setState({ errorInfo })
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null, errorInfo: null })
    }

    handleReload = () => {
        window.location.reload()
    }

    handleGoHome = () => {
        window.location.href = '/'
    }

    render() {
        if (this.state.hasError) {
            const { fallback, componentName, fullPage } = this.props

            // If a custom fallback is provided, use it
            if (fallback) {
                return fallback
            }

            // Determine mode: explicit fullPage prop takes precedence, otherwise use componentName presence
            const isFullPage = fullPage === true || (!componentName && fullPage !== false);

            // If not full-page mode and componentName is provided, show inline error
            if (!isFullPage && componentName) {
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

            // Full-page error (default for root-level errors)
            return (
                <div className="min-h-screen bg-surface-950 flex items-center justify-center p-4 relative overflow-hidden">
                    <GridBackground />
                    <div className="max-w-md w-full bg-surface-900/80 backdrop-blur-xl rounded-2xl border border-red-500/30 p-8 text-center shadow-lg shadow-red-900/20 relative z-10">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <h1 className="text-2xl font-bold text-surface-100 mb-2 font-display tracking-tight">
                            SYSTEM MALFUNCTION
                        </h1>

                        <p className="text-surface-400 mb-6">
                            An unexpected error occurred. Neural interface reset required.
                        </p>

                        {this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="text-sm text-surface-500 cursor-pointer hover:text-surface-400 font-mono">
                                    Diagnostics
                                </summary>
                                <pre className="mt-2 p-3 bg-black/50 rounded-lg text-xs text-red-400 overflow-auto max-h-32 font-mono border border-red-500/10">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={this.handleGoHome}
                                className="px-6 py-3 bg-surface-800 hover:bg-surface-700 text-surface-200 rounded-xl font-medium transition-colors border border-white/5 uppercase text-xs tracking-wider"
                            >
                                Return to Base
                            </button>
                            <button
                                onClick={this.handleReload}
                                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-900/20 uppercase text-xs tracking-wider"
                            >
                                Reboot System
                            </button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
