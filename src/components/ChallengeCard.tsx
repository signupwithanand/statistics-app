import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, CheckCircle } from 'lucide-react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number | string;
  type: 'mean' | 'median' | 'mode' | 'range' | 'count';
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ChallengeCardProps {
  challenge: Challenge;
  onComplete: () => void;
  onNext: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onComplete,
  onNext
}) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border-2 border-purple-200 dark:border-purple-700 max-w-sm"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-gray-900 dark:text-white">Challenge</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
          {challenge.difficulty}
        </span>
      </div>

      <h3 className="font-bold text-gray-900 dark:text-white mb-2">
        {challenge.title}
      </h3>
      
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {challenge.description}
      </p>

      <div className="flex items-center space-x-2">
        <Target className="w-4 h-4 text-purple-500" />
        <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
          Target: {challenge.target}
        </span>
      </div>

      <motion.button
        onClick={onComplete}
        className="w-full mt-4 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <CheckCircle className="w-4 h-4 inline mr-2" />
        Complete Challenge
      </motion.button>
    </motion.div>
  );
};