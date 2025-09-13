// Fix: Create the main App component and manage application state.
import React, { useState } from 'react';
import TopicInput from './components/TopicInput';
import SummaryDisplay from './components/SummaryDisplay';
import ReferencesList from './components/ReferencesList';
import Loader from './components/Loader';
import ForecastDisplay from './components/ForecastDisplay';
import EmailModal from './components/EmailModal';
import { Reference, ForecastResult, Granularity } from './types';
import { getSummaryAndReferences, getForecast } from './services/geminiService';
import EmailIcon from './components/icons/EmailIcon';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [references, setReferences] = useState<Reference[]>([]);
  const [forecast, setForecast] = useState<ForecastResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showForecast, setShowForecast] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setSummary('');
    setReferences([]);
    setForecast(null);
    setShowForecast(false);

    try {
      const { summary, references } = await getSummaryAndReferences(topic);
      setSummary(summary);
      setReferences(references);
      setShowForecast(true); // Show forecast section after summary is loaded
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateForecast = async (durationInYears: number, granularity: Granularity) => {
    if (!topic) return;
    setIsLoading(true);
    setError(null);
    setForecast(null);
    try {
      const forecastData = await getForecast(topic, durationInYears, granularity);
      setForecast(forecastData);
    } catch (err) {
       setError(err instanceof Error ? err.message : 'An unknown error occurred while fetching forecast.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen text-white font-sans">
      <main className="container mx-auto px-4 py-8 flex flex-col items-center gap-8">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-sky-400">
            AI-Powered Topic Summarizer & Forecaster
          </h1>
          <p className="mt-4 text-lg text-slate-400">
            Get instant, web-grounded summaries and future trends for any topic.
          </p>
        </header>

        <TopicInput
          topic={topic}
          setTopic={setTopic}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        {isLoading && !summary && <Loader />}
        
        {error && (
          <div className="w-full max-w-4xl bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg">
            <p className="font-bold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {summary && (
          <div className="w-full max-w-4xl space-y-8">
            <SummaryDisplay summary={summary} />
            <div className="flex justify-end">
                <button
                    onClick={() => setIsEmailModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-sky-300 font-semibold rounded-md hover:bg-slate-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                    <EmailIcon className="w-5 h-5" />
                    Email Analysis
                </button>
            </div>
          </div>
        )}
        
        {references.length > 0 && <ReferencesList references={references} />}
        
        {showForecast && (
            <ForecastDisplay 
                onGenerateForecast={handleGenerateForecast}
                forecastData={forecast}
                isLoading={isLoading}
            />
        )}
      </main>
      <footer className="text-center py-4">
        <p className="text-slate-500 text-sm">Powered by Google Gemini</p>
      </footer>
      
      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        topic={topic}
        summary={summary}
        references={references}
        forecast={forecast}
      />
    </div>
  );
};

export default App;
