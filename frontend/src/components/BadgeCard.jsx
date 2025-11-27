function BadgeCard({ badge }) {
  const isUnlocked = badge.unlocked

  return (
    <div className={`card p-4 text-center transition-all duration-300
      ${isUnlocked 
        ? 'border-primary-700/50 shadow-primary-900/20' 
        : 'opacity-50 grayscale'
      }`}
    >
      {/* Badge Icon */}
      <div className={`w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center text-3xl
        ${isUnlocked 
          ? 'bg-gradient-to-br from-primary-500/20 to-primary-700/20 border border-primary-600/30' 
          : 'bg-surface-800 border border-surface-700'
        }`}
      >
        {isUnlocked ? '🏆' : '🔒'}
      </div>

      {/* Badge Name */}
      <h4 className={`font-semibold mb-1 ${isUnlocked ? 'text-surface-100' : 'text-surface-500'}`}>
        {badge.name}
      </h4>

      {/* Description */}
      <p className="text-xs text-surface-500 mb-2">{badge.description}</p>

      {/* XP Value */}
      <span className={`badge ${isUnlocked ? 'badge-primary' : 'badge-surface'}`}>
        +{badge.xp_value} XP
      </span>

      {/* Earned Date */}
      {isUnlocked && badge.earned_at && (
        <p className="text-xs text-surface-500 mt-2">
          Earned {new Date(badge.earned_at).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}

export default BadgeCard

