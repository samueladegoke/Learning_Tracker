import React, { useMemo, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { SKILL_TREE_MAP } from '../../data/skillTreeMap';
import SkillNode from './SkillNode';
import CyberEdge from './CyberEdge';

const nodeTypes = {
  skill: SkillNode,
};

const edgeTypes = {
  cyber: CyberEdge,
};

const SkillTree = ({ onNodeClick }) => {
  // Process Data into Nodes and Edges
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes = SKILL_TREE_MAP.map((item) => ({
      id: item.id,
      type: 'skill',
      position: item.position,
      data: { 
        label: item.label, 
        status: item.status, 
        category: item.category 
      },
    }));

    const edges = [];
    SKILL_TREE_MAP.forEach((item) => {
      if (item.prerequisites) {
        item.prerequisites.forEach((preId) => {
          // Find source node to check status for edge styling
          const sourceNode = SKILL_TREE_MAP.find(n => n.id === preId);
          const isSourceCompleted = sourceNode?.status === 'completed';

          edges.push({
            id: `e${preId}-${item.id}`,
            source: preId,
            target: item.id,
            type: 'cyber',
            data: { active: isSourceCompleted },
          });
        });
      }
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-[800px] bg-surface-950 border border-surface-800 rounded-xl overflow-hidden shadow-2xl relative group">
      {/* Cyberpunk Grid Background Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        minZoom={0.2}
        maxZoom={2}
        defaultEdgeOptions={{ type: 'cyber' }}
        onNodeClick={(event, node) => {
          console.log('Node clicked:', node.data.label);
          if (onNodeClick) onNodeClick(node);
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background 
          color="#334155" 
          gap={40} 
          size={1} 
          variant="dots" 
          className="opacity-50"
        />
        <Controls 
          className="bg-surface-800 border-surface-700 fill-primary-400 [&>button]:border-surface-700 [&>button:hover]:bg-surface-700" 
        />
      </ReactFlow>
    </div>
  );
};

export default SkillTree;
