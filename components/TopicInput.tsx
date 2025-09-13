
import React from 'react';
import SearchIcon from './icons/SearchIcon';

interface TopicInputProps {
  topic: string;
  setTopic: (topic: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const TopicInput: React.FC<TopicInputProps> = ({ topic, setTopic, onSubmit, isLoading }) => {
  return (
    <form onSubmit={onSubmit} className="w-full max-w-2xl">
      <div className="flex items-center bg-slate-800 border-2 border-slate-700 rounded-full shadow-lg overflow-hidden">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter a topic, e.g., 'The future of renewable energy'"
          className="w-full p-4 pl-6 bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !topic}
          className="px-6 py-4 bg-sky-600 text-white font-semibold rounded-full hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
          ) : (
             <SearchIcon className="w-6 h-6" />
          )}
        </button>
      </div>
    </form>
  );
};

export default TopicInput;
