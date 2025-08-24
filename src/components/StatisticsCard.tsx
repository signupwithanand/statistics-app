import React from 'react';
import { motion } from 'framer-motion';
import { Statistics } from '../types/statistics';
import { TrendingUp, Target, BarChart3, Sigma } from 'lucide-react';

interface StatisticsCardProps {
  stats: Statistics;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ stats }) => {
  const formatNumber = (num: number | null): string => {
    if (num === null) return 'N/A';
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
  };

  const statItems = [
    {
      icon: Target,
      label: 'Mean',
      value: formatNumber(stats.mean),
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: BarChart3,
      label: 'Median',
      value: formatNumber(stats.median),
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: TrendingUp,
      label: 'Mode',
      value: stats.mode.length > 0 ? stats.mode.join(', ') : 'N/A',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Sigma,
      label: 'Std Dev',
      value: formatNumber(stats.standardDeviation),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  if (stats.count === 0) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Add data points to see statistics</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            className={`p-3 rounded-lg ${item.bgColor}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-2 mb-1">
              <item.icon className={`w-4 h-4 ${item.color}`} />
              <span className="text-xs font-medium text-gray-700">{item.label}</span>
            </div>
            <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Count</span>
          <span className="text-sm font-medium text-gray-900">{stats.count}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Range</span>
          <span className="text-sm font-medium text-gray-900">
            {formatNumber(stats.range)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Min / Max</span>
          <span className="text-sm font-medium text-gray-900">
            {formatNumber(stats.min)} / {formatNumber(stats.max)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Variance</span>
          <span className="text-sm font-medium text-gray-900">
            {formatNumber(stats.variance)}
          </span>
        </div>
      </div>
    </div>
  );
};