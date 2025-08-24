import React from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialOverlayProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onEnd: () => void;
  isActive: boolean;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  currentStep,
  onNext,
  onPrev,
  onEnd,
  isActive
}) => {
  const tutorialSteps = [
    {
      title: "Welcome to StatPlayground!",
      content: "This interactive platform helps you understand descriptive statistics through hands-on exploration. Let's start by learning how to add data and see statistics in action.",
      target: null,
      position: "center"
    },
    {
      title: "Add Your Data",
      content: "Use the control panel to generate random data points or add them manually. Click 'Generate 5' or 'Generate 10' to create sample datasets and watch the numbers fall from the sky!",
      target: "control-panel",
      position: "right"
    },
    {
      title: "Interactive Number Line",
      content: "Click anywhere on this number line to quickly add data points. Click existing points to remove them. This gives you immediate visual feedback.",
      target: "number-line",
      position: "bottom"
    },
    {
      title: "Real-time Visualizations",
      content: "Switch between different chart types to see your data from multiple perspectives. Each visualization highlights different aspects of your dataset.",
      target: "visualization-panel",
      position: "left"
    },
    {
      title: "Live Statistics",
      content: "Watch how statistics update in real-time as you modify your data. The control panel shows current values for all major statistical measures.",
      target: "stats-panel",
      position: "right"
    },
    {
      title: "Deep Dive into Concepts",
      content: "The explanation panel provides detailed information about each statistical concept, including formulas, interpretations, and data insights.",
      target: "explanation-panel",
      position: "left"
    },
    {
      title: "Explore Sample Datasets",
      content: "Try the sample dataset buttons to see how different data distributions affect statistical measures. Compare normal, skewed, and bimodal distributions.",
      target: "sample-data",
      position: "right"
    },
    {
      title: "Start Exploring!",
      content: "You're ready to explore statistics! Try different datasets, compare visualizations, and discover how statistical measures reveal patterns in data.",
      target: null,
      position: "center"
    }
  ];

  const currentStepData = tutorialSteps[currentStep];

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl p-6 max-w-lg mx-4 shadow-2xl"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Play className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">
                Step {currentStep + 1} of {tutorialSteps.length}
              </span>
            </div>
            <button
              onClick={onEnd}
              className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-4">
            <div className="flex space-x-1 mb-4">
              {tutorialSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-3">
            {currentStepData.title}
          </h2>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            {currentStepData.content}
          </p>

          <div className="flex items-center justify-between">
            <button
              onClick={onPrev}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {currentStep === tutorialSteps.length - 1 ? (
              <button
                onClick={onEnd}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Start Exploring!
              </button>
            ) : (
              <button
                onClick={onNext}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
