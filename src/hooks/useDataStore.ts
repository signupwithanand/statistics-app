import { useState, useCallback } from 'react';

export const useDataStore = () => {
  const [data, setData] = useState<number[]>([]);

  const addCandy = useCallback((value: number) => {
    // Validate and constrain the input
    const constrainedValue = Math.max(-1000, Math.min(1000, Math.round(value)));
    setData(prev => {
      // Limit to 50 data points for performance and clarity
      if (prev.length >= 50) {
        return prev;
      }
      return [...prev, constrainedValue];
    });
  }, []);

  const removeDataPoint = useCallback((index: number) => {
    setData(prev => prev.filter((_, i) => i !== index));
  }, []);

  const clearData = useCallback(() => {
    setData([]);
  }, []);

  const setValidatedData = useCallback((newData: number[]) => {
    // Validate and constrain all values
    const validatedData = newData
      .map(value => Math.max(-1000, Math.min(1000, Math.round(value))))
      .slice(0, 50); // Limit to 50 points
    setData(validatedData);
  }, []);

  return {
    data,
    addCandy,
    removeDataPoint,
    clearData,
    setData: setValidatedData
  };
};