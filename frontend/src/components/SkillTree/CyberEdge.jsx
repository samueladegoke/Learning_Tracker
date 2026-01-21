import React from 'react';
import { BaseEdge, getSmoothStepPath } from '@xyflow/react';

const CyberEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 15,
  });

  const isActive = data?.active;
  const filterId = `glow-${id}`;

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: isActive ? '#14b8a6' : '#334155', // Teal-500 vs Slate-700
          strokeWidth: isActive ? 2 : 1.5,
          strokeDasharray: isActive ? 'none' : '5,5',
          opacity: isActive ? 1 : 0.4,
          transition: 'all 0.5s ease',
        }}
      />
      
      {isActive && (
        <circle r="3" fill="#facc15" filter={`url(#${filterId})`}>
          <animateMotion 
            dur="1.5s" 
            repeatCount="indefinite" 
            path={edgePath}
            calcMode="linear"
          />
        </circle>
      )}
      
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    </>
  );
};

export default CyberEdge;
