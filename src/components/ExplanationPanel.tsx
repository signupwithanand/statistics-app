import React from 'react';
import { motion } from 'framer-motion';
import { Statistics, StatType } from '../types/statistics';

interface ExplanationPanelProps {
  stats: Statistics;
  onViewChange: (view: StatType) => void;
  data: number[];
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({
  stats,
  onViewChange,
  data,
}) => {
  const findOutliers = () => {
    if (data.length < 4 || !stats.q1 || !stats.q3 || !stats.iqr) return [];
    const lowerBound = stats.q1 - 1.5 * stats.iqr;
    const upperBound = stats.q3 + 1.5 * stats.iqr;
    return data.filter(value => value < lowerBound || value > upperBound);
  };

  const statItems: { name: string; type: StatType; icon: string; value: string; color: string; }[] = [
    {
      name: 'Mean',
      type: 'mean',
      icon: '⚖️',
      value: stats.mean?.toFixed(2) || 'N/A',
      color: 'text-red-600',
    },
    {
      name: 'Median',
      type: 'median',
      icon: '🎯',
      value: stats.median?.toString() || 'N/A',
      color: 'text-green-600',
    },
    {
      name: 'Mode',
      type: 'mode',
      icon: '👑',
      value: stats.mode.length > 0 ? stats.mode.join(', ') : 'None',
      color: 'text-purple-600',
    },
    {
      name: 'Range',
      type: 'range',
      icon: '📏',
      value: stats.range?.toString() || 'N/A',
      color: 'text-orange-600',
    },
    {
      name: 'Std Dev',
      type: 'standardDeviation',
      icon: '🌊',
      value: stats.standardDeviation?.toFixed(2) || 'N/A',
      color: 'text-blue-600',
    },
    {
        name: 'IQR',
        type: 'iqr',
        icon: '📊',
        value: stats.iqr?.toString() || 'N/A',
        color: 'text-indigo-600',
    },
    {
        name: 'Outliers',
        type: 'outliers',
        icon: '⚠️',
        value: findOutliers().length.toString(),
        color: 'text-red-700',
    },
  ];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="flex-shrink-0 p-3 sm:p-4 border-b border-gray-200">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Statistics Guide</h2>
      </div>

      <div className="flex-1 min-h-0 p-3 sm:p-4 overflow-y-auto overscroll-contain">
        <div className="space-y-3">
          {statItems.map((item, index) => (
            <motion.div
              key={item.name}
              className="bg-gray-50 rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-gray-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onViewChange(item.type)}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-semibold text-sm text-gray-900">{item.name}</span>
                </div>
                <span className={`text-sm font-bold ${item.color}`}>{item.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
