import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Map, ChevronRight, Star, Lock, CheckCircle, LayoutGrid } from 'lucide-react';
import { SKILL_TREE_MAP } from '../data/skillTreeMap';
import { DAY_META } from '../data/dayMeta';

function Planner() {
  const [expandedModule, setExpandedModule] = useState(null);

  const toggleModule = (id) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-surface-100 font-display">Curriculum</h1>
          <p className="text-surface-400">List view of all modules and days.</p>
        </div>
        <Link 
          to="/world-map" 
          className="flex items-center gap-2 px-4 py-2 bg-surface-800 hover:bg-surface-700 text-surface-200 rounded-lg transition-colors border border-surface-700"
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Map View</span>
        </Link>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {SKILL_TREE_MAP.map((module) => (
          <div 
            key={module.id} 
            className={`card overflow-hidden transition-all duration-300 ${
              module.status === 'completed' ? 'border-green-500/30' : 
              module.status === 'available' ? 'border-primary-500/30' : 
              'border-surface-700'
            }`}
          >
            {/* Module Header */}
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full px-5 py-4 flex items-center gap-4 hover:bg-surface-800/50 transition-colors"
            >
              {/* Status Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                ${module.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                  module.status === 'available' ? 'bg-primary-500/20 text-primary-400' :
                  'bg-surface-800 text-surface-500'
                }`}
              >
                {module.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                 module.status === 'available' ? <Star className="w-5 h-5" /> :
                 <Lock className="w-5 h-5" />}
              </div>

              {/* Title and Category */}
              <div className="flex-1 text-left min-w-0">
                <h3 className="font-semibold text-surface-100 truncate text-lg">{module.label}</h3>
                <p className="text-sm text-surface-500 capitalize">{module.category}</p>
              </div>

              {/* Chevron */}
              <div className={`flex-shrink-0 transition-transform duration-300 ${expandedModule === module.id ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5 text-surface-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {/* Expanded Content (Days) */}
            {expandedModule === module.id && (
              <div className="px-5 pb-5 space-y-2 border-t border-surface-800 pt-4 bg-surface-900/30">
                {module.days && module.days.length > 0 ? (
                  module.days.map((dayKey) => {
                    const dayData = DAY_META[dayKey];
                    if (!dayData) return null;

                    return (
                      <Link
                        key={dayKey}
                        to={`/practice?day=${dayKey}`}
                        className="block group"
                      >
                        <div className="p-3 bg-surface-800 hover:bg-surface-750 border border-surface-700 hover:border-primary-500/50 rounded-lg transition-all flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-surface-500 bg-surface-900 px-2 py-1 rounded uppercase tracking-wider">
                              {dayData.label}
                            </span>
                            <span className="text-surface-300 group-hover:text-white transition-colors font-medium">
                              {dayData.title.split(': ')[1] || dayData.title}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-surface-600 group-hover:text-primary-400 transition-colors" />
                        </div>
                      </Link>
                    );
                  })
                ) : (
                  <div className="text-center py-4 text-surface-500 italic">
                    No days assigned to this module.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Planner;
