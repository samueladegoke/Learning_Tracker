import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Map,
  Calendar,
  BookOpen,
  TrendingUp,
  Swords,
  LogOut,
  User,
  Terminal,
  Activity
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCourse } from '../contexts/CourseContext'
import { GlitchButton } from './ui/neural/GlitchButton'

function Navbar() {
  const { user, isAuthenticated, signOut } = useAuth()
  const { title } = useCourse()
  const navigate = useNavigate()

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/world-map', label: 'Map', icon: Map },
    { to: '/calendar', label: 'Calendar', icon: Calendar },
    { to: '/reflections', label: 'Reflections', icon: BookOpen },
    { to: '/progress', label: 'Progress', icon: TrendingUp },
    { to: '/practice', label: 'Practice', icon: Swords },
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800/50">
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/30 group-hover:shadow-primary-900/50 transition-shadow overflow-hidden bg-surface-900 border border-white/10 relative"
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-20" />
              <img src={`${import.meta.env.BASE_URL}assets/logo.png`} alt="Logo" className="w-full h-full object-cover relative z-10" />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-lg text-surface-100 tracking-tight flex items-center gap-2">
                LEARNING_TRACKER <span className="text-primary-500 text-xs font-mono px-1 border border-primary-500 rounded">v2.0</span>
              </h1>
              <p className="text-[10px] text-surface-500 -mt-0.5 font-mono uppercase tracking-widest">{title}</p>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 z-10 font-display uppercase tracking-wide ${isActive
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
                        className="absolute inset-0 bg-primary-500/10 rounded-lg -z-10 border border-primary-500/20"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      >
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-primary-500 shadow-neon-glow" />
                      </motion.div>
                    )}
                    <item.icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                    <span className="hidden lg:inline">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* HUD Stats */}
                <div className="hidden xl:flex items-center gap-4 mr-2">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-surface-500 font-mono uppercase">System Status</span>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ONLINE
                    </div>
                  </div>
                  <div className="h-8 w-[1px] bg-surface-800" />
                </div>

                {/* User Email */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-surface-900/80 rounded-lg border border-surface-700/50">
                  <Terminal className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-xs font-mono text-surface-300 max-w-[150px] truncate">
                    {user?.email?.split('@')[0]}
                  </span>
                </div>

                {/* Logout Button */}
                <GlitchButton
                  onClick={handleSignOut}
                  className="px-4 py-2 text-xs bg-surface-800 hover:bg-red-900/20 text-surface-300 hover:text-red-400 border border-surface-700 hover:border-red-500/50"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">ABORT</span>
                  </span>
                </GlitchButton>
              </>
            ) : (
              <NavLink to="/login">
                <GlitchButton className="px-6 py-2 text-xs">
                  <span className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5" />
                    INITIALIZE
                  </span>
                </GlitchButton>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
