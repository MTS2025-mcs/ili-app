export type AreaCode = 'HR' | 'SE' | 'FI' | 'MK' | 'TI';

export type QuestionType =
  | 'diagnostic'
  | 'context'
  | 'reliability_coherence'
  | 'reliability_control'
  | 'reliability_attention'
  | 'reliability_plausibility'
  | 'reliability_accuracy';

export interface Option {
  value: number | string;
  label: string;
}

export interface DiagnosticQuestion {
  id: string;
  text: string;
  area: AreaCode;
  subdimension: string;
  direction: 'positive' | 'reverse';
  type: 'diagnostic';
}

export interface ContextQuestion {
  id: string;
  text: string;
  options: Option[];
  allowText?: boolean;
  maxLength?: number;
  type: 'context';
}

export type ReliabilityCategory =
  | 'coherence'
  | 'control'
  | 'attention'
  | 'plausibility'
  | 'accuracy';

export interface ReliabilityQuestion {
  id: string;
  text: string;
  compareWith?: string;
  direction: 'positive' | 'reverse';
  category: ReliabilityCategory;
  options?: Option[];
  type: 'reliability';
}

export type Question = DiagnosticQuestion | ContextQuestion | ReliabilityQuestion;

export interface Answer {
  questionId: string;
  value: number | string;
  timestamp: number;
}

export interface DiagnosticAnswer extends Answer {
  normalized: number;
}

export interface AreaScore {
  area: AreaCode;
  score: number;
  level: 'critical' | 'consolidate' | 'functional' | 'strength';
}

export interface SubdimensionScore {
  area: AreaCode;
  subdimension: string;
  score: number;
}

export interface CoherenceResult {
  pair: [string, string];
  difference: number;
  points: number;
}

export interface ReliabilityScore {
  coherence: number;
  attention: number;
  plausibility: number;
  process: number;
  accuracy: number;
  total: number;
  status: 'high' | 'medium' | 'low';
  alerts: string[];
  details: {
    coherencePairs: CoherenceResult[];
    va08Correct: boolean;
    va06Score: number;
    va07Score: number;
    va09Score: number;
    va10Score: number;
    activeMs: number;
    uniformRatio: number;
    answerCount: number;
  };
}

export interface ILIResult {
  ili: number;
  dependencyIndex: number;
  level: string;
  areaScores: Record<AreaCode, number>;
  bottleneck: AreaCode;
}
