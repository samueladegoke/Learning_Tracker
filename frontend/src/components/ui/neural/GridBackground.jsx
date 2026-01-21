export function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Base Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
      
      {/* Moving Horizon/Scan */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary-900/5 to-transparent animate-scan-slow opacity-30" />
      
      {/* Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_100%)]" />
    </div>
  )
}
