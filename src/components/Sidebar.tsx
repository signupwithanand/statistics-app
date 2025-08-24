import React from 'react';
import { Plus, RotateCcw, Download, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  onAddCandy: (value?: number) => void;
  onClearData: () => void;
  activeStatistic: string;
  onStatisticChange: (stat: 'mean' | 'median' | 'mode' | 'range' | 'sd') => void;
  visibleStats: string[];
  currentStep: number;
  onNextStep: () => void;
  data: number[];
}

const STATISTICS = [
  { id: 'mean', name: 'Mean', emoji: '⚖️', color: 'text-blue-600' },
  { id: 'median', name: 'Median', emoji: '🎯', color: 'text-green-600' },
  { id: 'mode', name: 'Mode', emoji: '👑', color: 'text-purple-600' },
  { id: 'range', name: 'Range', emoji: '📏', color: 'text-orange-600' },
  { id: 'sd', name: 'Spread', emoji: '🌊', color: 'text-pink-600' }
];

export const Sidebar: React.FC<SidebarProps> = ({
  onAddCandy,
  onClearData,
  activeStatistic,
  onStatisticChange,
  visibleStats,
  currentStep,
  onNextStep,
  data
}) => {
  const exportCSV = () => {
    const csv = data.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'statplayground-data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 p-4 flex flex-col">
      {/* Quick Add Buttons */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Add Candies</h3>
        <div className="space-y-2">
          {[1, 5, 10].map(count => (
            <motion.button
              key={count}
              onClick={() => {
                for (let i = 0; i < count; i++) {
                  onAddCandy();
                }
              }}
              className="w-full p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add {count} 🍭
            </motion.button>
          ))}
        </div>
      </div>

      {/* Statistics Stepper */}
      <div className="mb-6 flex-1">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Concepts</h3>
        <div className="space-y-2">
          {STATISTICS.map((stat, index) => {
            const isVisible = visibleStats.includes(stat.id);
            const isActive = activeStatistic === stat.id;
            const isNext = index === visibleStats.length && index <= currentStep;
            
            return (
              <AnimatePresence key={stat.id}>
                {(isVisible || isNext) && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {isNext ? (
                      <motion.button
                        onClick={onNextStep}
                        className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 hover:border-purple-400 hover:text-purple-600 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ChevronRight className="w-4 h-4 inline mr-2" />
                        Next: {stat.name} {stat.emoji}
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => onStatisticChange(stat.id as any)}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          isActive
                            ? 'bg-purple-100 dark:bg-purple-900 border-2 border-purple-300 dark:border-purple-700'
                            : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{stat.emoji}</span>
                          <span className={`font-medium ${stat.color}`}>{stat.name}</span>
                        </div>
                      </motion.button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <motion.button
          onClick={onClearData}
          disabled={data.length === 0}
          className="w-full p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-4 h-4 inline mr-2" />
          Reset
        </motion.button>
        
        <motion.button
          onClick={exportCSV}
          disabled={data.length === 0}
          className="w-full p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-4 h-4 inline mr-2" />
          Export CSV
        </motion.button>
      </div>
    </div>
  );
};