import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Planner from './pages/Planner'
import Reflections from './pages/Reflections'
import Progress from './pages/Progress'

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/planner" element={<Planner />} />
            <Route path="/reflections" element={<Reflections />} />
            <Route path="/progress" element={<Progress />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App

