export interface Statistics {
  count: number;
  mean: number | null;
  median: number | null;
  mode: number[];
  range: number | null;
  min: number | null;
  max: number | null;
  sum: number | null;
  variance: number | null;
  standardDeviation: number | null;
  q1: number | null;
  q3: number | null;
  iqr: number | null;
}

export type StatType = 'mean' | 'median' | 'mode' | 'range' | 'variance' | 'iqr' | 'outliers' | 'standardDeviation';