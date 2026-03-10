import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { PythonProvider } from '@/contexts/PythonContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { CourseProvider } from '@/contexts/CourseContext'
import Navbar from '@/components/Navbar'
import ProtectedRoute from '@/components/ProtectedRoute'
import ErrorBoundary from '@/components/ErrorBoundary'
import Dashboard from '@/pages/Dashboard'
import WorldMap from '@/pages/WorldMap'
import Planner from '@/pages/Planner'
import Reflections from '@/pages/Reflections'
import Progress from '@/pages/Progress'
import Calendar from '@/pages/Calendar'
import Practice from '@/pages/Practice'
import Login from '@/pages/Login'
import NotFound from '@/pages/NotFound'
import { GridBackground } from '@/components/ui/neural/GridBackground'

const DEV_MODE = import.meta.env.VITE_DEV_MODE === "true";

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
            <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <CourseProvider>
            <PythonProvider>
              <Routes>
                {!DEV_MODE && <Route path="/login" element={<Login />} />}

                {DEV_MODE ? (
                  <Route path="/*" element={<MainLayout />} />
                ) : (
                  <>
                    <Route path="/" element={<MainLayout />} />
                    <Route path="/*" element={
                      <ProtectedRoute>
                        <MainLayout />
                      </ProtectedRoute>
                    } />
                  </>
                )}
              </Routes>
            </PythonProvider>
          </CourseProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
