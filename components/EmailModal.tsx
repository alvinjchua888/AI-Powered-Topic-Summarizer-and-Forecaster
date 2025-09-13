import React, { useState, useEffect } from 'react';
import { Reference, ForecastResult } from '../types';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  summary: string;
  references: Reference[];
  forecast: ForecastResult | null;
}

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  topic,
  summary,
  references,
  forecast,
}) => {
  const [recipientEmail, setRecipientEmail] = useState('');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  const formatEmailBody = (): string => {
    let body = `Analysis for Topic: ${topic}\n\n`;
    
    body += `--- SUMMARY ---\n${summary}\n\n`;

    if (forecast) {
      body += `--- FORECAST ---\n`;
      body += `Analysis: ${forecast.analysis}\n`;
      body += `Methodology: ${forecast.methodology}\n`;
      body += `Formula/Model: ${forecast.formula}\n`;
      body += `Estimated Error: ${forecast.errorMeasure}\n\n`;
      body += `Data Points:\n`;
      forecast.forecast.forEach(p => {
        body += `  - ${p.time}: ${p.value.toLocaleString()}\n`;
      });
      body += `\n`;
    }

    if (references.length > 0) {
      body += `--- REFERENCES ---\n`;
      references.forEach(ref => {
        body += `- ${ref.title}\n  ${ref.uri}\n`;
      });
    }
    
    return body;
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `AI Analysis for: ${topic}`;
    const body = formatEmailBody();
    window.location.href = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl shadow-lg p-8 border border-slate-700 w-full max-w-lg transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-sky-400 mb-6">Email Analysis</h2>
        <form onSubmit={handleSendEmail}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
              Recipient's Email
            </label>
            <input
              type="email"
              id="email"
              value={recipientEmail}
              onChange={e => setRecipientEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full p-3 bg-slate-700 border border-slate-600 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-slate-600 text-white font-semibold rounded-md hover:bg-slate-500 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 transition-colors duration-300 disabled:bg-slate-500"
              disabled={!recipientEmail}
            >
              Send
            </button>
          </div>
        </form>
         <p className="text-xs text-slate-500 mt-4 text-center">This will open your default email client to send the analysis.</p>
      </div>
    </div>
  );
};

export default EmailModal;
