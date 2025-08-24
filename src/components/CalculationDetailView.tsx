import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Statistics, StatType } from '../types/statistics';

interface CalculationDetailViewProps {
  activeCalculation: StatType;
  onBack: () => void;
  data: number[];
  stats: Statistics;
}

export const CalculationDetailView: React.FC<CalculationDetailViewProps> = ({
  activeCalculation,
  onBack,
  data,
  stats,
}) => {
  const [calculationStep, setCalculationStep] = useState(0);
  const [animatedSum, setAnimatedSum] = useState(0);

  useEffect(() => {
    setCalculationStep(0);
    setAnimatedSum(0);
  }, [activeCalculation]);

  useEffect(() => {
    if (!activeCalculation) return;

    if (activeCalculation === 'mean') {
      if (calculationStep === 0) {
        setCalculationStep(1);
      } else if (calculationStep === 1) {
        const sum = data.reduce((a, b) => a + b, 0);
        setAnimatedSum(sum);
        setCalculationStep(2);
      } else if (calculationStep === 2) {
        setCalculationStep(3);
      }
    } else {
      if (calculationStep === 0) {
        setCalculationStep(1);
      } else if (calculationStep === 1) {
        setCalculationStep(2);
      }
    }
  }, [calculationStep, activeCalculation, data]);

  const renderCalculationSteps = () => {
    const sortedData = [...data].sort((a, b) => a - b);

    switch (activeCalculation) {
      case 'mean':
        return (
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            {calculationStep >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h3 className="text-lg font-semibold mb-3">Step 1: List all numbers</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {data.map((num, index) => (
                    <motion.div
                      key={index}
                      className="w-12 h-12 bg-blue-500 text-white rounded-lg flex items-center justify-center font-bold"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {calculationStep >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h3 className="text-lg font-semibold mb-3">Step 2: Add all numbers together</h3>
                <div className="text-center">
                  <div className="text-xl mb-2">
                    {data.join(' + ')} = <span className="font-bold text-blue-600">{animatedSum}</span>
                  </div>
                </div>
              </motion.div>
            )}
            {calculationStep >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h3 className="text-lg font-semibold mb-3">Step 3: Divide by count of numbers</h3>
                <div className="text-center">
                  <div className="text-xl mb-4">
                    {animatedSum} ÷ {data.length} = <span className="font-bold text-green-600">{stats.mean?.toFixed(2)}</span>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800">
                      🎉 The mean is <strong>{stats.mean?.toFixed(2)}</strong>! This is the balance point where all numbers would balance on a seesaw.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        );
      case 'median':
        return (
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">Step 1: Sort numbers from smallest to largest</h3>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {sortedData.map((num, index) => {
                  const isEven = sortedData.length % 2 === 0;
                  const isMedian = isEven
                    ? index === Math.floor(sortedData.length / 2) - 1 || index === Math.floor(sortedData.length / 2)
                    : index === Math.floor(sortedData.length / 2);
                  return (
                    <motion.div
                      key={index}
                      className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${
                        isMedian ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {num}
                    </motion.div>
                  );
                })}
              </div>
              <div className="text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-green-800">
                    🎯 The median is <strong>{stats.median}</strong>! This is the middle value - half the numbers are below it, half are above.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        );
      case 'mode':
        const frequency: Record<number, number> = {};
        data.forEach(val => {
          frequency[val] = (frequency[val] || 0) + 1;
        });
        const maxFreq = Math.max(...Object.values(frequency));
        const modeNumbers = stats.mode;
        return (
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">Step 1: Count how often each number appears</h3>
              <div className="space-y-2">
                {Object.entries(frequency).map(([value, count]) => (
                  <div key={value} className={`flex items-center justify-between rounded-lg p-3 ${
                    modeNumbers.includes(Number(value)) ? 'bg-purple-200' : 'bg-gray-50'
                  }`}>
                    <span className="font-medium">Number {value}:</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {Array.from({ length: count }, (_, i) => (
                          <div key={i} className={`w-6 h-6 rounded text-white text-xs flex items-center justify-center ${
                            modeNumbers.includes(Number(value)) ? 'bg-purple-600' : 'bg-purple-500'
                          }`}>
                            {value}
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({count} times)</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-800">
                    👑 The mode is <strong>{stats.mode.length > 0 ? stats.mode.join(', ') : 'None'}</strong>!
                    {stats.mode.length > 0
                      ? ` This number appears most frequently (${maxFreq} times).`
                      : ' All numbers appear equally, so there is no mode.'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        );
      case 'range':
        return (
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">Step 1: Find the highest and lowest numbers</h3>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {sortedData.map((num, index) => (
                  <motion.div
                    key={index}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${
                      index === 0 ? 'bg-red-500' :
                      index === sortedData.length - 1 ? 'bg-orange-500' :
                      'bg-gray-400'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {num}
                  </motion.div>
                ))}
              </div>
              <div className="text-center">
                <p className="mb-2">Lowest: <span className="font-bold text-red-600">{stats.min}</span></p>
                <p className="mb-4">Highest: <span className="font-bold text-orange-600">{stats.max}</span></p>
                <p className="text-xl mb-4">Range = {stats.max} - {stats.min} = <span className="font-bold text-orange-600">{stats.range}</span></p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-orange-800">
                    📏 The range is <strong>{stats.range}</strong>! This shows how spread out your data is.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        );
      case 'standardDeviation':
        const mean = stats.mean || 0;
        const differences = data.map(num => num - mean);
        const squaredDifferences = differences.map(diff => diff * diff);
        const sumOfSquares = squaredDifferences.reduce((sum, sq) => sum + sq, 0);
        const variance = data.length > 1 ? sumOfSquares / data.length : 0;
        const standardDeviation = Math.sqrt(variance);
        return (
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">Step 1: Find differences from mean</h3>
              <div className="text-center mb-4">
                <p className="text-lg">Mean = <strong>{mean.toFixed(2)}</strong></p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {data.map((num, index) => (
                  <div key={index} className="bg-blue-50 rounded-lg p-2 text-center">
                    <div>{num} - {mean.toFixed(2)} = <strong>{differences[index].toFixed(2)}</strong></div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">Step 2: Square each difference</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {differences.map((diff, index) => (
                  <div key={index} className="bg-green-50 rounded-lg p-2 text-center">
                    <div>({diff.toFixed(2)})² = <strong>{squaredDifferences[index].toFixed(2)}</strong></div>
                  </div>
                ))}
              </div>
              <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
                <p className="text-green-800">
                  Sum of squared differences = {squaredDifferences.map(sq => sq.toFixed(2)).join(' + ')} = <strong>{sumOfSquares.toFixed(2)}</strong>
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">Step 3: Calculate variance (average of squared differences)</h3>
              <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-center">
                <p className="text-yellow-800">
                  Variance = {sumOfSquares.toFixed(2)} ÷ {data.length} = <strong>{variance.toFixed(2)}</strong><br/>
                  <em>We divide by n for population standard deviation.</em>
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">Step 4: Take square root to get standard deviation</h3>
              <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 text-center">
                <p className="text-blue-800">
                  Standard Deviation = √{variance.toFixed(2)} = <strong>{standardDeviation.toFixed(2)}</strong><br/>
                  <em>This gives us the typical distance from the mean in the original units.</em>
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                <p className="text-indigo-800">
                  🌊 <strong>Final Result:</strong> Standard Deviation = {standardDeviation.toFixed(2)}<br/>
                  <em>This means most values are within {standardDeviation.toFixed(2)} units of the mean ({mean.toFixed(2)}).</em>
                </p>
              </div>
            </motion.div>
          </div>
        );
      case 'iqr':
        const { q1, q3, iqr } = stats;
        return (
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">Step 1: Sort data and find quartiles</h3>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {sortedData.map((num, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${
                      index === Math.floor(sortedData.length * 0.25) ? 'bg-orange-500' :
                      index === Math.floor(sortedData.length * 0.75) ? 'bg-purple-500' :
                      'bg-gray-400'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <div className="text-center space-y-3">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-orange-800">
                    <strong>Q1 (25th percentile) = {q1}</strong><br/>
                    This means 25% of your data falls below {q1}.
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-purple-800">
                    <strong>Q3 (75th percentile) = {q3}</strong><br/>
                    This means 75% of your data falls below {q3}.
                  </p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <p className="text-indigo-800">
                    <strong>IQR = Q3 - Q1 = {q3} - {q1} = {iqr}</strong><br/>
                    This is the range of the middle 50% of your data!
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        );
      case 'outliers':
        const { q1: oq1, q3: oq3, iqr: oiqr } = stats;
        const lowerBound = oq1! - 1.5 * oiqr!;
        const upperBound = oq3! + 1.5 * oiqr!;
        const outliers = data.filter(value => value < lowerBound || value > upperBound);
        return (
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">Step 1: Sort data and find quartiles (Q1 and Q3)</h3>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {sortedData.map((num, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${
                      index === Math.floor(sortedData.length * 0.25) ? 'bg-orange-500' :
                      index === Math.floor(sortedData.length * 0.75) ? 'bg-purple-500' :
                      'bg-gray-400'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <div className="text-center space-y-3">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p className="text-orange-800">
                    <strong>Q1 (25th percentile) = {oq1}</strong><br/>
                    This means 25% of your data falls below {oq1}.
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-purple-800">
                    <strong>Q3 (75th percentile) = {oq3}</strong><br/>
                    This means 75% of your data falls below {oq3}.
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">Step 2: Calculate IQR (Interquartile Range)</h3>
              <div className="text-center">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <p className="text-indigo-800">
                    <strong>IQR = Q3 - Q1 = {oq3} - {oq1} = {oiqr}</strong><br/>
                    This is the range of the middle 50% of your data!
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">Step 3: Calculate outlier boundaries</h3>
              <div className="text-center space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800">
                    <strong>Lower Boundary = Q1 - 1.5 × IQR</strong><br/>
                    = {oq1} - 1.5 × {oiqr}<br/>
                    = {oq1} - {(1.5 * (oiqr || 0)).toFixed(1)}<br/>
                    = <strong>{lowerBound.toFixed(1)}</strong>
                  </p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <p className="text-indigo-800">
                    <strong>Upper Boundary = Q3 + 1.5 × IQR</strong><br/>
                    = {oq3} + 1.5 × {oiqr}<br/>
                    = {oq3} + {(1.5 * (oiqr || 0)).toFixed(1)}<br/>
                    = <strong>{upperBound.toFixed(1)}</strong>
                  </p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h3 className="text-lg font-semibold mb-3">Step 4: Identify outliers</h3>
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {sortedData.map((num, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${
                      outliers.includes(num) ? 'bg-red-500' : 'bg-green-500'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800">
                  ⚠️ <strong>Outliers are values outside the boundaries:</strong><br/>
                  Values below <strong>{lowerBound.toFixed(1)}</strong> or above <strong>{upperBound.toFixed(1)}</strong><br/>
                  Found <strong>{outliers.length}</strong> outlier{outliers.length !== 1 ? 's' : ''}: {outliers.length > 0 ? outliers.sort((a, b) => a - b).join(', ') : 'None'}
                </p>
              </div>
            </motion.div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 capitalize">{activeCalculation}</h2>
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <div>{renderCalculationSteps()}</div>
      <div className="mt-6">
        <button
          onClick={onBack}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
        >
          Back to Visualization
        </button>
      </div>
    </motion.div>
  );
};