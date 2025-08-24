import { useState, useCallback } from 'react';

export const useOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(true);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  const skipOnboarding = useCallback(() => {
    setIsActive(false);
  }, []);

  const completeStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  return {
    currentStep,
    isActive,
    nextStep,
    skipOnboarding,
    completeStep
  };
};