import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { Statistics, StatType } from '../types/statistics';

interface AnimatedCalculationCanvasProps {
  data: number[];
  stats: Statistics;
  onGenerateRandomData: (count: number) => void;
  onAddData: (value: number) => void;
  onClearData: () => void;
  onStatisticClick: (statType: StatType) => void;
}

interface FallingNumber {
  id: string;
  value: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  color: string;
  delay: number;
}

export const AnimatedCalculationCanvas: React.FC<AnimatedCalculationCanvasProps> = ({
  data,
  stats,
  onGenerateRandomData,
  onAddData,
  onClearData,
  onStatisticClick,
}) => {
  const [fallingNumbers, setFallingNumbers] = useState<FallingNumber[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const generateFallingNumbers = (count: number) => {
    setIsGenerating(true);
    setFallingNumbers([]);

    let actualNumbers = Array.from({ length: count -1 }, () => Math.round(Math.random() * 80 + 10));

    const ensureModeExists = (numbers: number[]): number[] => {
      const numSet = new Set(numbers);
      if (numSet.size === numbers.length) {
        const duplicateIndex = Math.floor(Math.random() * numbers.length);
        const valueToDuplicate = numbers[duplicateIndex];
        let replaceIndex;
        do {
          replaceIndex = Math.floor(Math.random() * numbers.length);
        } while (replaceIndex === duplicateIndex);
        numbers[replaceIndex] = valueToDuplicate;
      }
      return numbers;
    };

    const ensureOutlierExists = (numbers: number[]): number[] => {
        numbers.push(Math.round(Math.random() * 1000 + 200)); // Add a large number as an outlier
        return numbers;
    }

    actualNumbers = ensureModeExists(actualNumbers);
    actualNumbers = ensureOutlierExists(actualNumbers);

    const newNumbers: FallingNumber[] = [];
    const colors = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#8B5CF6'];

    const numberWidth = 40;
    const containerWidth = 800;
    const availableWidth = containerWidth - (numberWidth * count);
    const spacing = availableWidth / (count + 1);
    const margin = spacing;

    const pixelToPercent = (pixels: number) => (pixels / containerWidth) * 100;

    for (let i = 0; i < count; i++) {
      const value = actualNumbers[i];
      const targetXPixels = margin + (i * (numberWidth + spacing));
      const targetX = pixelToPercent(targetXPixels);
      const startXPixels = margin + (i * (numberWidth + spacing));
      const startX = pixelToPercent(startXPixels);

      newNumbers.push({
        id: `falling-${i}`,
        value,
        x: startX,
        y: -10,
        targetX,
        targetY: 70,
        color: colors[i % colors.length],
        delay: i * 250
      });
    }

    setFallingNumbers(newNumbers);

    setTimeout(() => {
      onClearData();
      setTimeout(() => {
        actualNumbers.forEach((value, index) => {
          setTimeout(() => {
            onAddData(value);
            if (index === actualNumbers.length - 1) {
              setIsGenerating(false);
            }
          }, index * 100);
        });
      }, 100);
    }, count * 200 + 1000);
  };

  return (
    <div ref={canvasRef} className="relative w-full h-full bg-gradient-to-b from-sky-200 via-sky-100 to-green-100 overflow-hidden">
      <div className="absolute top-4 left-4 text-4xl animate-bounce-gentle">☁️</div>
      <div className="absolute top-8 right-8 text-3xl animate-bounce-gentle" style={{ animationDelay: '1s' }}>☁️</div>
      <div className="absolute top-12 left-1/3 text-2xl animate-bounce-gentle" style={{ animationDelay: '2s' }}>☁️</div>

      <div className="h-full flex flex-col">
        <div className="flex-1 relative">
          <AnimatePresence>
            {fallingNumbers.map((number) => (
              <motion.div
                key={number.id}
                className="absolute w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg"
                style={{
                  backgroundColor: number.color,
                  left: `${number.x}%`,
                }}
                initial={{ y: -50, scale: 0 }}
                animate={{
                  y: `${number.targetY}%`,
                  scale: 1,
                  transition: {
                    delay: number.delay / 1000,
                    duration: 1,
                    ease: "easeOut"
                  }
                }}
                exit={{ scale: 0, opacity: 0 }}
              >
                {number.value}
              </motion.div>
            ))}
          </AnimatePresence>

          {data.length === 0 && !isGenerating && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-center">
                <motion.div
                  className="text-8xl mb-6"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🌟
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                  Ready to Learn Statistics?
                </h3>
                <p className="text-gray-600 mb-6">
                  Generate numbers and watch them fall from the sky!<br/>
                  Then see step-by-step calculations.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        <div className="h-32 bg-green-200 border-t-4 border-green-300 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            {data.length === 0 && !isGenerating ? (
              <div className="text-center">
                <div className="text-2xl mb-2">🧺</div>
                <p className="text-sm text-green-800">Collection Basket</p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 justify-center max-w-full px-4 overflow-y-auto max-h-28">
                {data.map((value, index) => (
                  <motion.div
                    key={index}
                    className="w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold text-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {value}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="h-24 bg-white border-t border-gray-200 p-4 overflow-y-auto">
          <div className="flex items-center justify-center space-x-2">
            {data.length === 0 ? (
              <>
                <motion.button
                  onClick={() => generateFallingNumbers(5)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isGenerating}
                >
                  <Play className="w-4 h-4 inline mr-1" />
                  Generate 5
                </motion.button>
                <motion.button
                  onClick={() => generateFallingNumbers(10)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isGenerating}
                >
                  <Play className="w-4 h-4 inline mr-1" />
                  Generate 10
                </motion.button>
              </>
            ) : (
              <>
                <h3 className="text-sm font-semibold text-gray-900 mr-2">Learn Statistics:</h3>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => onStatisticClick('mean')}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600"
                  >
                    ⚖️ Mean
                  </button>
                  <button
                    onClick={() => onStatisticClick('median')}
                    className="px-2 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600"
                  >
                    🎯 Median
                  </button>
                  <button
                    onClick={() => onStatisticClick('mode')}
                    className="px-2 py-1 bg-purple-500 text-white rounded text-xs font-medium hover:bg-purple-600"
                  >
                    👑 Mode
                  </button>
                  <button
                    onClick={() => onStatisticClick('range')}
                    className="px-2 py-1 bg-orange-500 text-white rounded text-xs font-medium hover:bg-orange-600"
                  >
                    📏 Range
                  </button>
                  <button
                    onClick={() => onStatisticClick('iqr')}
                    className="px-2 py-1 bg-indigo-500 text-white rounded text-xs font-medium hover:bg-indigo-600"
                  >
                     IQR
                  </button>
                  <button
                    onClick={() => onStatisticClick('standardDeviation')}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600"
                  >
                    🌊 Std Dev
                  </button>
                  <button
                    onClick={() => onStatisticClick('outliers')}
                    className="px-2 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700"
                  >
                    ⚠️ Outliers
                  </button>

                  <button
                    onClick={() => onClearData()}
                    className="px-2 py-1 bg-gray-500 text-white rounded text-xs font-medium hover:bg-gray-600"
                  >
                    <RotateCcw className="w-3 h-3 inline mr-1" />
                    Reset
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isGenerating && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="text-4xl mb-4 animate-bounce">🌟</div>
            <p className="text-lg font-medium">Numbers are falling from the sky!</p>
          </div>
        </div>
      )}
    </div>
  );
};
