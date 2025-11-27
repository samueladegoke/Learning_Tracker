import { NavLink } from 'react-router-dom'

function Navbar() {
  const navItems = [
    { to: '/', label: 'Dashboard', icon: '◉' },
    { to: '/planner', label: 'Planner', icon: '☰' },
    { to: '/reflections', label: 'Reflections', icon: '✎' },
    { to: '/progress', label: 'Progress', icon: '◈' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-surface-950/80 backdrop-blur-xl border-b border-surface-800">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-900/30 group-hover:shadow-primary-900/50 transition-shadow">
              <span className="text-white font-bold text-lg">✓</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-lg text-surface-100">Learning Tracker</h1>
              <p className="text-xs text-surface-500 -mt-0.5">100 Days of Code</p>
            </div>
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                    isActive
                      ? 'bg-primary-600/20 text-primary-400 shadow-inner'
                      : 'text-surface-400 hover:text-surface-100 hover:bg-surface-800/50'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

