import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCalculationCanvas } from './AnimatedCalculationCanvas';
import { Statistics, StatType } from '../types/statistics';

interface VisualizationPanelProps {
  data: number[];
  stats: Statistics;
  onAddData: (value: number) => void;
  onRemoveData: (index: number) => void;
  onGenerateRandomData: (count: number) => void;
  onClearData: () => void;
  onViewChange: (view: StatType) => void;
}

export const VisualizationPanel: React.FC<VisualizationPanelProps> = ({
  data,
  stats,
  onAddData,
  onRemoveData,
  onGenerateRandomData,
  onClearData,
  onViewChange,
}) => {
  const handleGenerateData = (count: number) => {
    if (count === -1) {
      onClearData();
      return;
    }
    const newData = Array.from({ length: count }, () =>
      Math.round(Math.random() * 80 + 10)
    );
    onClearData();
    newData.forEach(value => onAddData(value));
  };

  const calculateIQR = () => {
    if (data.length < 4) return null;
    const sorted = [...data].sort((a, b) => a - b);
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    return q3 - q1;
  };

  const findOutliers = () => {
    if (data.length < 4) return [];
    const sorted = [...data].sort((a, b) => a - b);
    const q1Index = Math.floor(sorted.length * 0.25);
    const q3Index = Math.floor(sorted.length * 0.75);
    const q1 = sorted[q1Index];
    const q3 = sorted[q3Index];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;
    return data.filter(value => value < lowerBound || value > upperBound);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <h2 className="text-xl font-bold text-gray-900 text-center">
          🎓 Interactive Statistics Learning Canvas
        </h2>
        <p className="text-sm text-gray-600 text-center mt-1">
          Watch numbers fall from the sky and see step-by-step calculations!
        </p>
      </div>

      <div className="flex-1">
        <AnimatedCalculationCanvas
          data={data}
          stats={stats}
          onGenerateRandomData={handleGenerateData}
          onAddData={onAddData}
          onClearData={onClearData}
          onStatisticClick={(statType) => onViewChange(statType)}
        />
      </div>

      
    </div>
  );
};
