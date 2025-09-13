// Fix: Define interfaces for Reference, ForecastDataPoint, and ForecastResult.
export interface Reference {
  uri: string;
  title: string;
}

export interface ForecastDataPoint {
  time: string; // e.g., "2025", "Q1 2026"
  value: number; // Actual predicted value, not normalized
}

export type Granularity = 'weeks' | 'months' | 'years';

export interface ForecastResult {
  forecast: ForecastDataPoint[];
  analysis: string;
  methodology: string;
  formula: string;
  errorMeasure: string;
}