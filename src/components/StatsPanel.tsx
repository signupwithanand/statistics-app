import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Statistics } from '../types/statistics';

interface StatsPanelProps {
  stats: Statistics;
  activeStatistic: string;
  showDefinitions: boolean;
  visibleStats: string[];
  theme: 'light' | 'dark';
}

const STAT_DEFINITIONS = {
  mean: {
    title: 'Mean (Average)',
    simple: 'The balance point of all your candies',
    formal: 'The sum of all values divided by the count of values',
    formula: '(sum of all values) ÷ (count of values)'
  },
  median: {
    title: 'Median (Middle)',
    simple: 'The candy in the exact middle when lined up',
    formal: 'The middle value when data is arranged in order',
    formula: 'Middle value of sorted data'
  },
  mode: {
    title: 'Mode (Most Common)',
    simple: 'The candy value that appears most often',
    formal: 'The most frequently occurring value(s)',
    formula: 'Value(s) with highest frequency'
  },
  range: {
    title: 'Range (Spread)',
    simple: 'How far apart your highest and lowest candies are',
    formal: 'The difference between maximum and minimum values',
    formula: 'Maximum value - Minimum value'
  },
  sd: {
    title: 'Standard Deviation (Scatter)',
    simple: 'How spread out your candies are from the average',
    formal: 'Average distance of values from the mean',
    formula: '√(average of squared differences from mean)'
  }
};

export const StatsPanel: React.FC<StatsPanelProps> = ({
  stats,
  activeStatistic,
  showDefinitions,
  visibleStats,
  theme
}) => {
  const formatValue = (value: number | null): string => {
    if (value === null) return 'N/A';
    return Number.isInteger(value) ? value.toString() : value.toFixed(2);
  };

  const getStatValue = (statType: string): string => {
    switch (statType) {
      case 'mean': return formatValue(stats.mean);
      case 'median': return formatValue(stats.median);
      case 'mode': return stats.mode.length > 0 ? stats.mode.join(', ') : 'None';
      case 'range': return formatValue(stats.range);
      case 'sd': return formatValue(stats.standardDeviation);
      default: return 'N/A';
    }
  };

  const getStatColor = (statType: string): string => {
    const colors = {
      mean: 'text-blue-600',
      median: 'text-green-600',
      mode: 'text-purple-600',
      range: 'text-orange-600',
      sd: 'text-pink-600'
    };
    return colors[statType as keyof typeof colors] || 'text-gray-600';
  };

  return (
    <div className="h-full bg-white dark:bg-gray-800 p-4 overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Statistics
      </h3>

      {/* Current Values */}
      <div className="space-y-3 mb-6">
        <AnimatePresence>
          {visibleStats.map((statType, index) => {
            const definition = STAT_DEFINITIONS[statType as keyof typeof STAT_DEFINITIONS];
            const isActive = activeStatistic === statType;
            
            return (
              <motion.div
                key={statType}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  isActive 
                    ? 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/30' 
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {definition.title}
                  </span>
                  <motion.span
                    className={`text-lg font-bold ${getStatColor(statType)}`}
                    key={getStatValue(statType)} // Re-animate when value changes
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {getStatValue(statType)}
                  </motion.span>
                </div>
                
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {showDefinitions ? definition.formal : definition.simple}
                </p>
                
                {showDefinitions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 p-2 bg-white dark:bg-gray-800 rounded text-xs font-mono text-gray-700 dark:text-gray-300"
                  >
                    {definition.formula}
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Data Summary */}
      {stats.count > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3"
        >
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Dataset Summary
          </h4>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Total candies:</span>
              <span className="font-medium">{stats.count}</span>
            </div>
            <div className="flex justify-between">
              <span>Lowest value:</span>
              <span className="font-medium">{stats.min}</span>
            </div>
            <div className="flex justify-between">
              <span>Highest value:</span>
              <span className="font-medium">{stats.max}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Pedagogy Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-6 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
      >
        <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300 mb-2">
          💡 Quick Tip
        </h4>
        <p className="text-xs text-purple-600 dark:text-purple-400">
          {activeStatistic === 'mean' && 'Watch how the balance plank moves as you add candies!'}
          {activeStatistic === 'median' && 'The spotlight shows the exact middle candy.'}
          {activeStatistic === 'mode' && 'Stack candies on the same number to see the mode pulse!'}
          {activeStatistic === 'range' && 'The rope stretches between your highest and lowest values.'}
          {activeStatistic === 'sd' && 'The colored area shows how spread out your candies are.'}
        </p>
      </motion.div>
    </div>
  );
};