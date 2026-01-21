import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Lock, Check, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const SkillNode = ({ data }) => {
  const { label, status, category } = data;

  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isAvailable = status === 'available';

  return (
    <div
      className={cn(
        "relative min-w-[180px] px-4 py-3 rounded-xl transition-all duration-300",
        "shadow-clay-card bg-surface-900 border-2",
        // Locked State
        isLocked && "border-surface-700 opacity-60 grayscale cursor-not-allowed",
        // Available State
        isAvailable && "border-primary-500 shadow-neon-glow animate-pulse-slow cursor-pointer hover:scale-105",
        // Completed State
        isCompleted && "border-teal-500 shadow-[0_0_15px_rgba(20,184,166,0.3)] cursor-pointer",
        // Default/Fallback
        !isLocked && !isAvailable && !isCompleted && "border-surface-600"
      )}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className={cn(
          "!w-3 !h-3 !border-2",
          isLocked ? "!bg-surface-600 !border-surface-800" : "!bg-surface-200 !border-surface-900"
        )} 
      />
      
      <div className="flex items-center gap-3">
        <div className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full shadow-clay-inset border border-white/5",
          isLocked && "bg-surface-800 text-surface-500",
          isAvailable && "bg-primary-950 text-primary-400",
          isCompleted && "bg-teal-950 text-teal-400"
        )}>
          {isLocked && <Lock size={14} />}
          {isAvailable && <Zap size={14} className="fill-current" />}
          {isCompleted && <Check size={14} strokeWidth={3} />}
        </div>
        
        <div className="flex flex-col">
          <span className={cn(
            "text-[10px] font-mono uppercase tracking-wider mb-0.5",
            isLocked ? "text-surface-500" : "text-surface-400"
          )}>
            {category}
          </span>
          <span className={cn(
            "font-bold text-sm leading-tight",
            isLocked ? "text-surface-400" : "text-white",
            isAvailable && "text-primary-100"
          )}>
            {label}
          </span>
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        className={cn(
          "!w-3 !h-3 !border-2",
          isLocked ? "!bg-surface-600 !border-surface-800" : "!bg-surface-200 !border-surface-900"
        )} 
      />
    </div>
  );
};

export default memo(SkillNode);
