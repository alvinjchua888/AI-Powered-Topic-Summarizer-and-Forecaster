
import React from 'react';
import { Reference } from '../types';

interface ReferencesListProps {
  references: Reference[];
}

const ReferencesList: React.FC<ReferencesListProps> = ({ references }) => {
  if (references.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-700">
      <h2 className="text-2xl font-bold text-sky-400 mb-4">References</h2>
      <ul className="space-y-3">
        {references.map((ref, index) => (
          <li key={index} className="flex items-start">
            <span className="text-sky-400 mr-3 mt-1">&#10148;</span>
            <a
              href={ref.uri}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-sky-400 transition-colors duration-200 group"
            >
              <span className="font-semibold group-hover:underline">{ref.title}</span>
              <p className="text-xs text-slate-500 break-all">{ref.uri}</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReferencesList;
