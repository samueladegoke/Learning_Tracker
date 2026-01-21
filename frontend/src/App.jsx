import { Component } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PythonProvider } from './contexts/PythonContext'
import { AuthProvider } from './contexts/AuthContext'
import { CourseProvider } from './contexts/CourseContext'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import WorldMap from './pages/WorldMap'
import Planner from './pages/Planner'
import Reflections from './pages/Reflections'
import Progress from './pages/Progress'
import Calendar from './pages/Calendar'
import Practice from './pages/Practice'
import Login from './pages/Login'
import { GridBackground } from './components/ui/neural/GridBackground'

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.02 }}
    transition={{ duration: 0.3, ease: "circOut" }}
    className="relative z-10"
  >
    {children}
  </motion.div>
)

function MainLayout() {
  const location = useLocation()
  return (
    <div className="min-h-screen relative overflow-hidden bg-surface-950 font-body text-surface-100 selection:bg-primary-500/30 selection:text-primary-200">
      <GridBackground />
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Dashboard /></PageWrapper>} />
            <Route path="/world-map" element={<PageWrapper><WorldMap /></PageWrapper>} />
            <Route path="/planner" element={<PageWrapper><Planner /></PageWrapper>} />
            <Route path="/reflections" element={<PageWrapper><Reflections /></PageWrapper>} />
            <Route path="/progress" element={<PageWrapper><Progress /></PageWrapper>} />
            <Route path="/calendar" element={<PageWrapper><Calendar /></PageWrapper>} />
            <Route path="/practice" element={<PageWrapper><Practice /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components and displays a fallback UI
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

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
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

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <CourseProvider>
            <PythonProvider>
              <Routes>
                {/* Public route - Login page (no navbar) */}
                <Route path="/login" element={<Login />} />

                {/* Protected routes with navbar */}
                <Route path="/*" element={<MainLayout />} />
              </Routes>
            </PythonProvider>
          </CourseProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
