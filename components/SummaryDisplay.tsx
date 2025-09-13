
import React from 'react';

interface SummaryDisplayProps {
  summary: string;
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  return (
    <div className="w-full max-w-4xl bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-700">
      <h2 className="text-2xl font-bold text-sky-400 mb-4">Generated Summary</h2>
      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{summary}</p>
    </div>
  );
};

export default SummaryDisplay;
