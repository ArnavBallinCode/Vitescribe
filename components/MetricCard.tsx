import React from 'react';
import { VitalMetric } from '../types';
import { Activity, AlertCircle, CheckCircle, HelpCircle, ArrowUp, ArrowDown } from 'lucide-react';

interface MetricCardProps {
  metric: VitalMetric;
}

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  let statusColor = 'bg-slate-100 text-slate-600 border-slate-200';
  let Icon = HelpCircle;

  switch (metric.status) {
    case 'Normal':
      statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
      Icon = CheckCircle;
      break;
    case 'High':
      statusColor = 'bg-amber-50 text-amber-700 border-amber-200';
      Icon = ArrowUp;
      break;
    case 'Low':
      statusColor = 'bg-blue-50 text-blue-700 border-blue-200';
      Icon = ArrowDown;
      break;
    case 'Critical':
      statusColor = 'bg-red-50 text-red-700 border-red-200 animate-pulse';
      Icon = AlertCircle;
      break;
  }

  return (
    <div className={`p-4 rounded-xl border ${statusColor.replace('bg-', 'border-opacity-50 ')} bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-slate-700 truncate pr-2" title={metric.name}>{metric.name}</h4>
        <div className={`p-1 rounded-full ${statusColor}`}>
          <Icon size={16} />
        </div>
      </div>
      
      <div className="flex items-baseline gap-1 mb-2">
        <span className="text-2xl font-bold text-slate-800">{metric.value}</span>
        <span className="text-sm text-slate-500 font-medium">{metric.unit}</span>
      </div>

      {metric.range && (
        <div className="text-xs text-slate-400 mb-2">
          Range: {metric.range}
        </div>
      )}

      <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-2 mt-auto">
        {metric.insight}
      </p>
    </div>
  );
};