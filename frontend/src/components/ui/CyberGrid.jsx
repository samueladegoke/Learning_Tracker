import React from 'react';

const CyberGrid = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none bg-surface-950">
      {/* Base Grid */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #334155 1px, transparent 1px),
            linear-gradient(to bottom, #334155 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
        }}
      />

      {/* Scanlines */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%)',
          backgroundSize: '100% 4px'
        }}
      />

      {/* Ambient Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-transparent to-surface-950 opacity-80" />
      
      {/* Subtle animated gradient orb */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-500/5 blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[120px] animate-pulse delay-1000" />
    </div>
  );
};

export default CyberGrid;
