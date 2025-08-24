import { useMemo } from 'react';
import { Statistics } from '../types/statistics';

export const useStats = (data: number[]): Statistics => {
  return useMemo(() => {
    if (data.length === 0) {
      return {
        count: 0,
        mean: null,
        median: null,
        mode: [],
        min: null,
        max: null,
        range: null,
        variance: null,
        standardDeviation: null,
        q1: null,
        q3: null,
        iqr: null,
        outliers: []
      };
    }

    const sortedData = [...data].sort((a, b) => a - b);
    const count = data.length;
    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / count;

    // Calculate median
    let median: number;
    if (count % 2 === 0) {
      median = (sortedData[count / 2 - 1] + sortedData[count / 2]) / 2;
    } else {
      median = sortedData[Math.floor(count / 2)];
    }

    // Calculate mode - only include values that appear more than once
    const frequency: Record<number, number> = {};
    data.forEach(val => {
      frequency[val] = (frequency[val] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const mode = Object.keys(frequency)
      .filter(key => frequency[Number(key)] === maxFreq && maxFreq > 1)
      .map(Number)
      .sort((a, b) => a - b);

    const min = sortedData[0];
    const max = sortedData[count - 1];
    const range = max - min;

    // Calculate variance and standard deviation
    const variance = count > 1 
      ? data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / count
      : 0;
    const standardDeviation = Math.sqrt(variance);

    // Calculate quartiles and IQR
    let q1: number | null = null;
    let q3: number | null = null;
    let iqr: number | null = null;
    
    if (count >= 4) {
      const q1Index = Math.floor(count * 0.25);
      const q3Index = Math.floor(count * 0.75);
      q1 = sortedData[q1Index];
      q3 = sortedData[q3Index];
      iqr = q3 - q1;
    }

    // Find outliers using IQR method
    let outliers: number[] = [];
    if (q1 !== null && q3 !== null && iqr !== null) {
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      outliers = data.filter(value => value < lowerBound || value > upperBound);
    }

    return {
      count,
      mean,
      median,
      mode,
      min,
      max,
      range,
      variance,
      standardDeviation,
      q1,
      q3,
      iqr,
      outliers
    };
  }, [data]);
};
