import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, Play, RotateCcw, BookOpen } from 'lucide-react';
import { Statistics } from '../types/statistics';

interface StatisticsCalculationPanelProps {
  data: number[];
  stats: Statistics;
  onStartCalculation: (type: 'mean' | 'median' | 'mode' | 'range' | 'variance') => void;
  onGenerateData: (count: number) => void;
  onClearData: () => void;
}

export const StatisticsCalculationPanel: React.FC<StatisticsCalculationPanelProps> = ({
  data,
  stats,
  onStartCalculation,
  onGenerateData,
  onClearData
}) => {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  const concepts = [
    {
      id: 'mean',
      name: 'Mean (Average)',
      icon: '⚖️',
      color: 'bg-blue-500',
      description: 'Add all numbers and divide by count',
      example: 'Like finding the balance point of a seesaw',
      value: stats.mean?.toFixed(2) || 'N/A'
    },
    {
      id: 'median',
      name: 'Median (Middle)',
      icon: '🎯',
      color: 'bg-green-500',
      description: 'The middle number when sorted',
      example: 'Half the numbers are above, half below',
      value: stats.median?.toString() || 'N/A'
    },
    {
      id: 'mode',
      name: 'Mode (Most Common)',
      icon: '👑',
      color: 'bg-purple-500',
      description: 'The number that appears most often',
      example: 'The most popular choice',
      value: stats.mode.length > 0 ? stats.mode.join(', ') : 'None'
    },
    {
      id: 'range',
      name: 'Range (Spread)',
      icon: '📏',
      color: 'bg-orange-500',
      description: 'Difference between highest and lowest',
      example: 'How spread out the numbers are',
      value: stats.range?.toString() || 'N/A'
    },
    {
      id: 'variance',
      name: 'Standard Deviation',
      icon: '🌊',
      color: 'bg-pink-500',
      description: 'How much numbers vary from average',
      example: 'Measures the scatter of data',
      value: stats.standardDeviation?.toFixed(2) || 'N/A'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <Calculator className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Interactive Statistics Learning</h2>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">How it works:</h3>
          <ol className="text-xs text-blue-800 space-y-1">
            <li>1. Generate random numbers (they'll fall from the sky!)</li>
            <li>2. Click on any statistic to see step-by-step calculation</li>
            <li>3. Watch the animated explanation</li>
            <li>4. Understand the concept visually</li>
          </ol>
        </div>
      </div>

      {/* Data Generation */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Generate Data</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onGenerateData(5)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            >
              5 Numbers
            </button>
            <button
              onClick={() => onGenerateData(10)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
            >
              10 Numbers
            </button>
          </div>
          
          {data.length > 0 && (
            <button
              onClick={onClearData}
              className="w-full px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4 inline mr-2" />
              Clear All Data
            </button>
          )}
        </div>
      </div>

      {/* Current Data Display */}
      {data.length > 0 && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Your Data ({data.length} numbers)
          </h3>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex flex-wrap gap-2">
              {data.map((value, index) => (
                <motion.div
                  key={index}
                  className="w-10 h-10 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {value}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Statistics Concepts */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Statistical Concepts</h3>
        
        {data.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-500">Generate some data first to see statistics!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {concepts.map((concept) => (
              <motion.div
                key={concept.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedConcept(concept.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${concept.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                      {concept.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{concept.name}</h4>
                      <p className="text-sm text-gray-600">{concept.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{concept.value}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartCalculation(concept.id as any);
                      }}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                    >
                      <Play className="w-3 h-3 inline mr-1" />
                      Show How
                    </button>
                  </div>
                </div>
                
                <AnimatePresence>
                  {selectedConcept === concept.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-gray-200"
                    >
                      <p className="text-sm text-gray-700 italic">💡 {concept.example}</p>
                      <div className="mt-2 text-xs text-gray-600">
                        Click "Show How" to see the step-by-step calculation with animations!
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex items-start space-x-2">
          <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Learning Tips</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Start with 5-10 numbers to see clear patterns</li>
              <li>• Try different data sets to see how statistics change</li>
              <li>• Watch the animations carefully to understand each step</li>
              <li>• Compare mean vs median to understand data distribution</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};