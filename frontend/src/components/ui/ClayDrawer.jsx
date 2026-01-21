import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const ClayDrawer = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-surface-900 border-l border-surface-700 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-surface-800 flex items-center justify-between bg-surface-900/50 backdrop-blur-md sticky top-0 z-10">
              <h2 className="text-2xl font-bold text-surface-100 font-display tracking-tight">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-800 rounded-full text-surface-400 hover:text-surface-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {children}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500/50 via-accent-500/50 to-primary-500/50 opacity-50" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ClayDrawer;
