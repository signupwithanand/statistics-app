import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (helpButtonRef.current) {
      const rect = helpButtonRef.current.getBoundingClientRect();
      setModalPosition({ top: rect.bottom + 10, left: rect.right });
    }
  }, [isHelpVisible]);


  return (
    <header className="h-20 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
      <div className="h-full px-6 flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <span className="text-white text-2xl">📊</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              StatPlayground
            </h1>
            <p className="text-sm text-gray-600">Visual Statistics Learning Platform</p>
          </div>
        </motion.div>

        <div className="flex items-center space-x-2">
          <motion.button
            ref={helpButtonRef}
            onClick={() => setIsHelpVisible(!isHelpVisible)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Help"
          >
            <HelpCircle className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isHelpVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: modalPosition.top,
              right: 0,
            }}
            className="bg-white rounded-xl shadow-2xl max-w-sm w-full z-50"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">How to Use</h2>
                <button
                  onClick={() => setIsHelpVisible(false)}
                  className="p-2 -mr-2 -mt-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="text-gray-700 space-y-3">
                <div>
                  <h3 className="font-semibold mb-1">1. Generate Numbers</h3>
                  <p className="text-sm">Click <strong>Generate 5</strong> or <strong>Generate 10</strong> to start.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">2. Explore Concepts</h3>
                  <p className="text-sm">Click on a statistic in the right panel to see a step-by-step calculation.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
