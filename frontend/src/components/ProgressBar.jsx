function ProgressBar({ progress, className = '', showLabel = true, size = 'md' }) {
  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm text-surface-400">Progress</span>
          <span className="text-sm font-medium text-primary-400">{Math.round(progress)}%</span>
        </div>
      )}
      <div className={`w-full bg-surface-800 rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${heights[size]} rounded-full bg-gradient-to-r from-primary-600 to-primary-500 transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar

