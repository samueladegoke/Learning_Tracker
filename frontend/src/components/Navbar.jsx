import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Map,
  Calendar,
  BookOpen,
  TrendingUp,
  Swords
} from 'lucide-react'

function Navbar() {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/planner', label: 'Planner', icon: Map },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/reflections', label: 'Reflections', icon: BookOpen },
    { to: '/progress', label: 'Progress', icon: TrendingUp },
    { to: '/practice', label: 'Practice', icon: Swords },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/30 group-hover:shadow-primary-900/50 transition-shadow overflow-hidden bg-surface-900 border border-white/10"
            >
              <img src="/assets/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-lg text-surface-100 tracking-tight">Learning Tracker</h1>
              <p className="text-xs text-surface-500 -mt-0.5 font-medium">100 Days of Code</p>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 z-10 ${isActive
                    ? 'text-primary-400'
                    : 'text-surface-400 hover:text-surface-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-surface-800/80 rounded-lg -z-10 border border-white/5"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                    <span className="hidden md:inline">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

