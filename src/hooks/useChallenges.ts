import { useState, useEffect } from 'react';
import { Statistics } from '../types/statistics';

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number | string;
  type: 'mean' | 'median' | 'mode' | 'range' | 'count';
  difficulty: 'easy' | 'medium' | 'hard';
  checkComplete: (stats: Statistics) => boolean;
}

const CHALLENGES: Challenge[] = [
  {
    id: 'mean-5',
    title: 'Balance at 5',
    description: 'Make the balance plank rest at exactly 5',
    target: 5,
    type: 'mean',
    difficulty: 'easy',
    checkComplete: (stats) => stats.mean !== null && Math.abs(stats.mean - 5) < 0.1
  },
  {
    id: 'median-7',
    title: 'Middle at 7',
    description: 'Create a dataset where the middle candy is at 7',
    target: 7,
    type: 'median',
    difficulty: 'easy',
    checkComplete: (stats) => stats.median === 7
  },
  {
    id: 'mode-exists',
    title: 'Find the Crown',
    description: 'Create a mode by having the same number appear twice',
    target: 'Any',
    type: 'mode',
    difficulty: 'medium',
    checkComplete: (stats) => stats.mode.length > 0
  },
  {
    id: 'range-10',
    title: 'Stretch the Rope',
    description: 'Make the range exactly 10 units',
    target: 10,
    type: 'range',
    difficulty: 'medium',
    checkComplete: (stats) => stats.range === 10
  }
];

export const useChallenges = (stats: Statistics) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const currentChallenge = CHALLENGES[currentChallengeIndex];

  useEffect(() => {
    if (currentChallenge && currentChallenge.checkComplete(stats)) {
      // Auto-complete challenge when condition is met
      setTimeout(() => {
        completeChallenge();
      }, 1000);
    }
  }, [stats, currentChallenge]);

  const completeChallenge = () => {
    if (currentChallenge) {
      setCompletedChallenges(prev => [...prev, currentChallenge.id]);
    }
  };

  const nextChallenge = () => {
    setCurrentChallengeIndex(prev => 
      prev < CHALLENGES.length - 1 ? prev + 1 : 0
    );
  };

  return {
    currentChallenge: stats.count >= 3 ? currentChallenge : null, // Only show challenges when user has some data
    completeChallenge,
    nextChallenge,
    completedChallenges
  };
};