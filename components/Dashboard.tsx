import React from 'react';
import { HealthAnalysis } from '../types';
import { MetricCard } from './MetricCard';
import { ReasoningView } from './ReasoningView';
import { ShieldAlert, Stethoscope, Utensils, Zap } from 'lucide-react';

interface DashboardProps {
  data: HealthAnalysis;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  return (
    <div className="w-full animate-fadeIn">
      
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-r-lg">
        <div className="flex items-start">
          <ShieldAlert className="w-5 h-5 text-amber-600 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-bold text-amber-800">Important Disclaimer</h3>
            <p className="text-xs text-amber-700 mt-1">
              VitalScribe uses AI to analyze documents. Results may contain errors. 
              This is not a medical diagnosis. Always consult a qualified healthcare professional.
            </p>
          </div>
        </div>
      </div>

      {/* Risks / Red Flags */}
      {data.potentialRisks && data.potentialRisks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-red-500 rounded-full"></span>
            Attention Required
          </h2>
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 space-y-2">
            {data.potentialRisks.map((risk, idx) => (
              <div key={idx} className="flex items-start gap-3 text-red-800 text-sm">
                <AlertCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Simplified Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
            Simplified Analysis
          </h2>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-700 leading-relaxed text-lg">
              {data.simplifiedExplanation}
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-500">
               <span className="font-semibold text-teal-600">Context:</span> {data.patientContext}
            </div>
          </div>
        </div>

        {/* Action Plan Quick View */}
        <div className="lg:col-span-1">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
            Recommended Actions
          </h2>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 h-full max-h-[300px] overflow-y-auto">
             {data.actionPlan.slice(0, 3).map((action, idx) => (
               <div key={idx} className="mb-3 last:mb-0 p-3 bg-white rounded-lg shadow-sm border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    {getActionIcon(action.category)}
                    <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">{action.category}</span>
                  </div>
                  <h4 className="font-semibold text-slate-800 text-sm">{action.title}</h4>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      {data.metrics && data.metrics.length > 0 && (
        <div className="mb-8">
           <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
            Extracted Vitals & Labs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {data.metrics.map((metric, idx) => (
              <MetricCard key={idx} metric={metric} />
            ))}
          </div>
        </div>
      )}

      {/* Full Action Plan */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
            Comprehensive Care Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.actionPlan.map((action, idx) => (
            <div key={idx} className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${getCategoryColor(action.category)}`}>
                       {getActionIcon(action.category)}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getPriorityColor(action.priority)}`}>
                      {action.priority} Priority
                    </span>
                 </div>
              </div>
              <h3 className="font-bold text-slate-800 mb-2">{action.title}</h3>
              <p className="text-sm text-slate-600">{action.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Reasoning Trace */}
      <ReasoningView steps={data.reasoningTrace} />
    </div>
  );
};

// Helper Icons
const AlertCircleIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
);

const getActionIcon = (category: string) => {
  switch (category) {
    case 'Diet': return <Utensils size={16} />;
    case 'Lifestyle': return <Zap size={16} />;
    case 'Medication': return <Stethoscope size={16} />;
    default: return <ShieldAlert size={16} />;
  }
};

const getCategoryColor = (category: string) => {
   switch (category) {
    case 'Diet': return 'bg-green-100 text-green-600';
    case 'Lifestyle': return 'bg-orange-100 text-orange-600';
    case 'Medication': return 'bg-blue-100 text-blue-600';
    default: return 'bg-slate-100 text-slate-600';
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-700';
    case 'Medium': return 'bg-amber-100 text-amber-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};