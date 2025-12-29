import { Component } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PythonProvider } from './contexts/PythonContext'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Planner from './pages/Planner'
import Reflections from './pages/Reflections'
import Progress from './pages/Progress'
import Calendar from './pages/Calendar'
import Practice from './pages/Practice'
import Login from './pages/Login'

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays a fallback UI
 * instead of crashing the entire application.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Error info:', errorInfo)
    this.setState({ errorInfo })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-surface-800 rounded-2xl border border-surface-700 p-8 text-center shadow-xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-surface-100 mb-2">
              Something went wrong
            </h1>

            <p className="text-surface-400 mb-6">
              An unexpected error occurred. Don't worry - your progress is safe.
            </p>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-surface-500 cursor-pointer hover:text-surface-400">
                  Technical details
                </summary>
                <pre className="mt-2 p-3 bg-surface-900 rounded-lg text-xs text-red-400 overflow-auto max-h-32">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleGoHome}
                className="px-6 py-3 bg-surface-700 hover:bg-surface-600 text-surface-200 rounded-xl font-medium transition-colors"
              >
                Go Home
              </button>
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl font-medium transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <PythonProvider>
            <Routes>
              {/* Public route - Login page (no navbar) */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes with navbar */}
              <Route path="/*" element={
                <div className="min-h-screen">
                  <Navbar />
                  <main className="container mx-auto px-4 py-8 max-w-7xl">
                    <Routes>
                      <Route path="/" element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/planner" element={
                        <ProtectedRoute>
                          <Planner />
                        </ProtectedRoute>
                      } />
                      <Route path="/reflections" element={
                        <ProtectedRoute>
                          <Reflections />
                        </ProtectedRoute>
                      } />
                      <Route path="/progress" element={
                        <ProtectedRoute>
                          <Progress />
                        </ProtectedRoute>
                      } />
                      <Route path="/calendar" element={
                        <ProtectedRoute>
                          <Calendar />
                        </ProtectedRoute>
                      } />
                      {/* Practice page is PUBLIC for demo purposes */}
                      <Route path="/practice" element={<Practice />} />
                    </Routes>
                  </main>
                </div>
              } />
            </Routes>
          </PythonProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App

