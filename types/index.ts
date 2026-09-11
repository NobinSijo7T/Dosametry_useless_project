// Type definitions for Dosa Circularity Analyzer

export interface DosaSample {
  name: string;
  score: number;
  description: string;
}

export interface AnalysisResult {
  score: number;
  verdict: Verdict;
  metrics: Metrics;
}

export interface Verdict {
  min: number;
  max: number;
  emoji: string;
  title: string;
  desc: string;
  grade: string;
}

export interface Metrics {
  roundness: string;
  jitter: string;
  sambarEligibility: string;
  amma: string;
  crispy: string;
  shame: string;
}

export type AnalyzerState = 'idle' | 'analyzing' | 'done';

export interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}
