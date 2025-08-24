import { useState, useCallback } from 'react';

export const useTutorial = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const startTutorial = useCallback(() => {
    setCurrentStep(0);
    setIsActive(true);
  }, []);

  const endTutorial = useCallback(() => {
    setIsActive(false);
    setCurrentStep(0);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  }, []);

  return {
    currentStep,
    isActive,
    startTutorial,
    endTutorial,
    nextStep,
    prevStep
  };
};