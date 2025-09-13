// Fix: Create ForecastDisplay component to manage and display forecast data.
import React, from 'react';
import ForecastOptions from './ForecastOptions';
import ForecastChart from './ForecastChart';
import { ForecastResult, Granularity } from '../types';
import Loader from './Loader';
import TrendUpIcon from './icons/TrendUpIcon';

interface ForecastDisplayProps {
  onGenerateForecast: (durationInYears: number, granularity: Granularity) => void;
  forecastData: ForecastResult | null;
  isLoading: boolean;
}

const ForecastDisplay: React.FC<ForecastDisplayProps> = ({ onGenerateForecast, forecastData, isLoading }) => {
  const [duration, setDuration] = React.useState<number>(5);
  const [granularity, setGranularity] = React.useState<Granularity>('years');

  const handleGenerateClick = () => {
    onGenerateForecast(duration, granularity);
  };

  const MethodologyItem = ({ title, content }: { title: string; content: string }) => (
    <div>
      <h4 className="text-md font-semibold text-sky-400">{title}</h4>
      <p className="text-slate-300 text-sm mt-1">{content}</p>
    </div>
  );

  return (
    <div className="w-full max-w-4xl bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <TrendUpIcon className="w-8 h-8 text-sky-400" />
        <h2 className="text-2xl font-bold text-sky-400">Future Trends Forecast</h2>
      </div>

      <ForecastOptions 
        duration={duration} 
        setDuration={setDuration} 
        granularity={granularity}
        setGranularity={setGranularity}
        onGenerate={handleGenerateClick}
        isLoading={isLoading}
      />

      {isLoading && !forecastData && <Loader message="Generating forecast..." />}

      {forecastData && (
        <div className="mt-8 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-slate-200 mb-4">Trend Projection</h3>
            <div className="h-80 bg-slate-900/50 rounded-lg p-4">
                <ForecastChart data={forecastData.forecast} />
            </div>
          </div>
           <div>
            <h3 className="text-xl font-semibold text-slate-200 mb-4">Forecasting Methodology</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900/50 rounded-lg p-6">
              <MethodologyItem title="Analysis" content={forecastData.analysis} />
              <MethodologyItem title="Forecasting Approach" content={forecastData.methodology} />
              <MethodologyItem title="Formula / Model" content={forecastData.formula} />
              <MethodologyItem title="Estimated Forecast Error" content={forecastData.errorMeasure} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastDisplay;