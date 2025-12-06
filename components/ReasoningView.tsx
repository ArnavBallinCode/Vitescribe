import React, { useState } from 'react';
import { ReasoningStep } from '../types';
import { BrainCircuit, ChevronDown, ChevronUp } from 'lucide-react';

interface ReasoningViewProps {
  steps: ReasoningStep[];
}

export const ReasoningView: React.FC<ReasoningViewProps> = ({ steps }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!steps || steps.length === 0) return null;

  return (
    <div className="mt-8 border border-indigo-100 rounded-xl overflow-hidden bg-indigo-50/30">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-indigo-900 bg-indigo-50 hover:bg-indigo-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-sm">View AI Reasoning Trace</span>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      
      {isOpen && (
        <div className="p-4 space-y-4 bg-white">
          <p className="text-xs text-slate-500 italic mb-4">
            Gemini 3 Pro analyzed this document using the following chain-of-thought process:
          </p>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-indigo-200 before:to-transparent">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex items-start group">
                <div className="absolute left-0 top-0 mt-1 ml-3 h-4 w-4 rounded-full border-2 border-indigo-400 bg-white z-10 group-hover:bg-indigo-400 transition-colors"></div>
                <div className="ml-10">
                  <h5 className="font-semibold text-sm text-indigo-900 mb-1">{step.step}</h5>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};