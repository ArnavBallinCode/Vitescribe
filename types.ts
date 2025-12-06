export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface VitalMetric {
  name: string;
  value: string;
  unit: string;
  status: 'Normal' | 'High' | 'Low' | 'Critical' | 'Unknown';
  range?: string;
  insight: string;
}

export interface ActionItem {
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Lifestyle' | 'Diet' | 'Follow-up' | 'Medication';
}

export interface ReasoningStep {
  step: string;
  detail: string;
}

export interface HealthAnalysis {
  summary: string;
  patientContext: string; // Age, gender inference if available, or "General"
  metrics: VitalMetric[];
  simplifiedExplanation: string;
  actionPlan: ActionItem[];
  reasoningTrace: ReasoningStep[];
  potentialRisks: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}