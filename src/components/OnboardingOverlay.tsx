import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowDown } from 'lucide-react';

interface OnboardingOverlayProps {
  isActive: boolean;
  currentStep: number;
  onNext: () => void;
  onSkip: () => void;
  dataCount: number;
}

const ONBOARDING_STEPS = [
  {
    title: "Welcome to StatPlayground! 🍭",
    content: "Let's learn statistics by playing with candies. Drag 5 candies anywhere on the number line below.",
    position: "center",
    showArrow: true,
    arrowDirection: "down"
  },
  {
    title: "Great! See the Balance? ⚖️",
    content: "That blue plank shows where your candies balance - that's the MEAN (average)!",
    position: "center",
    showArrow: false
  },
  {
    title: "Let's Find the Middle 🎯",
    content: "Click 'Next: Median' to see which candy is exactly in the middle.",
    position: "left",
    showArrow: true,
    arrowDirection: "left"
  },
  {
    title: "You're a Statistics Explorer! 🌟",
    content: "Keep adding candies and watch how the statistics change. Have fun learning!",
    position: "center",
    showArrow: false
  }
];

export const OnboardingOverlay: React.FC<OnboardingOverlayProps> = ({
  isActive,
  currentStep,
  onNext,
  onSkip,
  dataCount
}) => {
  if (!isActive || currentStep >= ONBOARDING_STEPS.length) return null;

  const step = ONBOARDING_STEPS[currentStep];
  
  // Auto-advance when user has added enough candies
  React.useEffect(() => {
    if (currentStep === 0 && dataCount >= 5) {
      setTimeout(onNext, 1000);
    }
  }, [currentStep, dataCount, onNext]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md mx-4 shadow-2xl relative ${
            step.position === 'left' ? 'mr-auto ml-4' : 
            step.position === 'right' ? 'ml-auto mr-4' : 
            'mx-auto'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {step.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {step.content}
            </p>
          </div>

          {step.showArrow && (
            <motion.div
              className="flex justify-center mb-4"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowDown className="w-6 h-6 text-purple-500" />
            </motion.div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentStep ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < ONBOARDING_STEPS.length - 1 ? (
              <button
                onClick={onNext}
                disabled={currentStep === 0 && dataCount < 5}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {currentStep === 0 && dataCount < 5 ? `Add ${5 - dataCount} more` : 'Next'}
              </button>
            ) : (
              <button
                onClick={onSkip}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                Start Playing!
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};