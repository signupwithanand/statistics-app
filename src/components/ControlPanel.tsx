import React, { useState } from 'react';
import { Upload, Plus, Trash2, RotateCcw, BarChart3, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DataInputForm } from './DataInputForm';
import { StatisticsCard } from './StatisticsCard';
import { FileUpload } from './FileUpload';
import { Statistics } from '../types/statistics';

interface ControlPanelProps {
  data: number[];
  onAddData: (value: number) => void;
  onRemoveData: (index: number) => void;
  onClearData: () => void;
  onSetData: (data: number[]) => void;
  stats: Statistics;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  data,
  onAddData,
  onRemoveData,
  onClearData,
  onSetData,
  stats
}) => {
  const [activeTab, setActiveTab] = useState<'input' | 'upload'>('input');
  const [inputError, setInputError] = useState<string>('');

  const generateSampleData = (type: 'normal' | 'skewed' | 'bimodal' | 'uniform') => {
    let sampleData: number[] = [];
    
    switch (type) {
      case 'normal':
        // Normal distribution around 50
        sampleData = Array.from({ length: 20 }, () => 
          Math.max(10, Math.min(90, Math.round(50 + (Math.random() - 0.5) * 30)))
        );
        break;
      case 'skewed':
        // Right-skewed data
        sampleData = Array.from({ length: 15 }, () => 
          Math.round(Math.pow(Math.random(), 2) * 60 + 20)
        );
        break;
      case 'bimodal':
        // Two peaks at 30 and 70
        sampleData = [
          ...Array.from({ length: 8 }, () => Math.round(30 + (Math.random() - 0.5) * 8)),
          ...Array.from({ length: 8 }, () => Math.round(70 + (Math.random() - 0.5) * 8))
        ];
        break;
      case 'uniform':
        // Evenly distributed
        sampleData = Array.from({ length: 20 }, () => Math.round(Math.random() * 60 + 20));
        break;
    }
    
    onSetData(sampleData);
    setInputError('');
  };

  const handleAddData = (value: number) => {
    // Validate input range
    if (value < -1000 || value > 1000) {
      setInputError('Please enter a value between -1000 and 1000 for meaningful statistics');
      return;
    }
    
    if (data.length >= 50) {
      setInputError('Maximum 50 data points allowed for clear visualization');
      return;
    }
    
    onAddData(value);
    setInputError('');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Data Controls</h2>
        </div>
        
        {/* Input Validation Warning */}
        {inputError && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <p className="text-sm text-red-800">{inputError}</p>
            </div>
          </motion.div>
        )}
        
        {/* Quick Start Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-1">How to Use</h3>
          <p className="text-xs text-blue-800">
            1. Add data points (numbers between -1000 and 1000)<br/>
            2. Watch calculations update in real-time<br/>
            3. See step-by-step explanations in the right panel
          </p>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'input'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Plus className="w-4 h-4 inline mr-1" />
            Add Data
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'upload'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Upload className="w-4 h-4 inline mr-1" />
            Upload
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'input' ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <DataInputForm onAddData={handleAddData} />
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FileUpload onDataLoaded={onSetData} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sample Data Generation */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Datasets</h3>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => generateSampleData('normal')}
              className="px-2 py-1 text-xs bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
              title="Bell-shaped distribution around center value"
            >
              Normal
            </button>
            <button
              onClick={() => generateSampleData('skewed')}
              className="px-2 py-1 text-xs bg-orange-50 text-orange-700 rounded hover:bg-orange-100 transition-colors"
              title="Most values clustered on one side"
            >
              Skewed
            </button>
            <button
              onClick={() => generateSampleData('bimodal')}
              className="px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition-colors"
              title="Two distinct peaks in the data"
            >
              Bimodal
            </button>
            <button
              onClick={() => generateSampleData('uniform')}
              className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
              title="Values spread evenly across range"
            >
              Uniform
            </button>
          </div>
        </div>

        {/* Data Actions */}
        {data.length > 0 && (
          <motion.div
            className="mt-4 pt-4 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex space-x-2">
              <button
                onClick={onClearData}
                className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-sm font-medium">Clear All</span>
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Current Data */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Current Dataset ({data.length} points)
          {data.length > 0 && (
            <span className="text-sm text-gray-500 ml-2">
              Range: {stats.min} to {stats.max}
            </span>
          )}
        </h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {data.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No data points added yet</p>
          ) : (
            <div className="grid grid-cols-6 gap-1">
              {data.map((value, index) => (
                <motion.div
                  key={`${value}-${index}`}
                  className="flex items-center justify-center bg-gray-50 rounded px-2 py-1 text-xs font-mono text-gray-900 hover:bg-red-50 cursor-pointer group"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => onRemoveData(index)}
                  title={`Click to remove ${value}`}
                >
                  <span className="group-hover:hidden">{value}</span>
                  <Trash2 className="w-3 h-3 text-red-500 hidden group-hover:block" />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Live Statistics</h3>
        <StatisticsCard stats={stats} />
      </div>
    </div>
  );
};