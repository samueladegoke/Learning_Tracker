function StatCard({ icon, label, value, suffix = '', variant = 'default' }) {
  const variants = {
    default: 'from-surface-800 to-surface-900 border-surface-700',
    primary: 'from-primary-900/30 to-primary-950/30 border-primary-700/50',
    accent: 'from-accent-900/30 to-accent-950/30 border-accent-700/50',
  }

  return (
    <div className={`card p-5 bg-gradient-to-br ${variants[variant]}`}>
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl
          ${variant === 'primary' ? 'bg-primary-600/20' : 
            variant === 'accent' ? 'bg-accent-600/20' : 
            'bg-surface-800'}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-surface-500">{label}</p>
          <p className="text-2xl font-display font-bold text-surface-100">
            {value}
            {suffix && <span className="text-lg text-surface-500 ml-1">{suffix}</span>}
          </p>
        </div>
      </div>
    </div>
  )
}

export default StatCard

