import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Map, List, ChevronRight, Star, Lock, CheckCircle } from 'lucide-react';
import SkillTree from '../components/SkillTree/SkillTree';
import ClayDrawer from '../components/ui/ClayDrawer';
import { SKILL_TREE_MAP } from '../data/skillTreeMap';
import { DAY_META } from '../data/dayMeta';

const WorldMap = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleNodeClick = (node) => {
    // Find the full node data from SKILL_TREE_MAP to get the 'days' array
    const fullNodeData = SKILL_TREE_MAP.find(n => n.id === node.id);
    setSelectedNode(fullNodeData);
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedNode(null), 300); // Clear after animation
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface-100 font-display">World Map</h1>
          <p className="text-surface-400">Explore the curriculum and track your journey.</p>
        </div>
        <Link 
          to="/planner" 
          className="flex items-center gap-2 px-4 py-2 bg-surface-800 hover:bg-surface-700 text-surface-200 rounded-lg transition-colors border border-surface-700"
        >
          <List className="w-4 h-4" />
          <span>List View</span>
        </Link>
      </div>

      {/* Skill Tree Visualization */}
      <SkillTree onNodeClick={handleNodeClick} />

      {/* Drawer for Module Details */}
      <ClayDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        title={selectedNode?.label || 'Module Details'}
      >
        {selectedNode && (
          <div className="space-y-6">
            {/* Module Status */}
            <div className="flex items-center gap-3 p-4 bg-surface-800/50 rounded-xl border border-surface-700">
              <div className={`p-3 rounded-lg ${
                selectedNode.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                selectedNode.status === 'available' ? 'bg-primary-500/20 text-primary-400' :
                'bg-surface-700/50 text-surface-500'
              }`}>
                {selectedNode.status === 'completed' ? <CheckCircle className="w-6 h-6" /> :
                 selectedNode.status === 'available' ? <Star className="w-6 h-6" /> :
                 <Lock className="w-6 h-6" />}
              </div>
              <div>
                <div className="text-sm text-surface-400 uppercase tracking-wider font-medium">Status</div>
                <div className="text-lg font-bold text-surface-100 capitalize">{selectedNode.status}</div>
              </div>
            </div>

            {/* Days List */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-surface-200 flex items-center gap-2">
                <Map className="w-5 h-5 text-primary-400" />
                Curriculum Days
              </h3>
              
              <div className="space-y-2">
                {selectedNode.days && selectedNode.days.length > 0 ? (
                  selectedNode.days.map((dayKey) => {
                    const dayData = DAY_META[dayKey];
                    if (!dayData) return null;
                    
                    return (
                      <Link
                        key={dayKey}
                        to={`/practice?day=${dayKey}`}
                        className="block group"
                      >
                        <motion.div 
                          whileHover={{ x: 4 }}
                          className="p-4 bg-surface-800 hover:bg-surface-750 border border-surface-700 hover:border-primary-500/50 rounded-xl transition-all flex items-center justify-between group-hover:shadow-lg group-hover:shadow-primary-900/20"
                        >
                          <div>
                            <div className="text-xs font-medium text-primary-400 mb-0.5">{dayData.label}</div>
                            <div className="font-medium text-surface-200 group-hover:text-white transition-colors">
                              {dayData.title.split(': ')[1] || dayData.title}
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-surface-500 group-hover:text-primary-400 transition-colors" />
                        </motion.div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-surface-500 bg-surface-800/30 rounded-xl border border-surface-800 border-dashed">
                    No days assigned to this module yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </ClayDrawer>
    </div>
  );
};

export default WorldMap;
