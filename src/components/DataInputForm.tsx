import React, { useState } from 'react';
import { Plus, Info } from 'lucide-react';
import { motion } from 'framer-motion';

interface DataInputFormProps {
  onAddData: (value: number) => void;
}

export const DataInputForm: React.FC<DataInputFormProps> = ({ onAddData }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(inputValue);
    
    if (isNaN(value)) {
      setError('Please enter a valid number');
      return;
    }
    
    if (value < -1000 || value > 1000) {
      setError('Value must be between -1000 and 1000');
      return;
    }

    onAddData(value);
    setInputValue('');
    setError('');
  };

  const generateRandomData = () => {
    // Generate 10 random numbers between 20 and 80 for meaningful statistics
    const randomData = Array.from({ length: 10 }, () => 
      Math.round(Math.random() * 60 + 20)
    );
    randomData.forEach(value => onAddData(value));
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="data-input" className="block text-sm font-medium text-gray-700 mb-1">
            Enter a number
          </label>
          <div className="flex space-x-2">
            <input
              id="data-input"
              type="number"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError('');
              }}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 42"
              step="any"
              min="-1000"
              max="1000"
            />
            <motion.button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
          {error && (
            <motion.p
              className="mt-1 text-sm text-red-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
        </div>
      </form>

      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-gray-700">
            <p className="font-medium mb-1">Tips for meaningful data:</p>
            <ul className="space-y-1">
              <li>• Use numbers between -1000 and 1000</li>
              <li>• Add at least 5 points to see patterns</li>
              <li>• Try different ranges to see how statistics change</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-200">
        <button
          onClick={generateRandomData}
          className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Generate Sample Data (10 points)
        </button>
      </div>
    </div>
  );
};