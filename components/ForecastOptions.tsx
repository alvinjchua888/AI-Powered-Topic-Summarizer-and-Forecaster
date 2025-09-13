// Fix: Create ForecastOptions component for user input.
import React from 'react';
import { Granularity } from '../types';

interface ForecastOptionsProps {
  duration: number;
  setDuration: (duration: number) => void;
  granularity: Granularity;
  setGranularity: (granularity: Granularity) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const ForecastOptions: React.FC<ForecastOptionsProps> = ({ duration, setDuration, granularity, setGranularity, onGenerate, isLoading }) => {
  const durationOptions = [3, 5, 10];
  const granularityOptions: { value: Granularity; label: string }[] = [
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' },
    { value: 'years', label: 'Years' },
  ];
  
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-900/50 rounded-lg">
      <div className="flex items-center gap-2">
        <label htmlFor="duration-select" className="font-semibold text-slate-300">
          Period:
        </label>
        <div className="relative">
          <select
            id="duration-select"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            disabled={isLoading}
            className="appearance-none bg-slate-700 border border-slate-600 text-white rounded-md pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {durationOptions.map(opt => (
              <option key={opt} value={opt}>{opt} Years</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
       <div className="flex items-center gap-2">
        <label htmlFor="granularity-select" className="font-semibold text-slate-300">
          Granularity:
        </label>
        <div className="relative">
          <select
            id="granularity-select"
            value={granularity}
            onChange={(e) => setGranularity(e.target.value as Granularity)}
            disabled={isLoading}
            className="appearance-none bg-slate-700 border border-slate-600 text-white rounded-md pl-4 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {granularityOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full sm:w-auto px-6 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 flex items-center justify-center sm:ml-auto"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 mr-2 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            <span>Generating...</span>
          </>
        ) : (
          'Generate Forecast'
        )}
      </button>
    </div>
  );
};

export default ForecastOptions;