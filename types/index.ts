// Type definitions for Dosa Circularity Analyzer

import type { GeometryResult, DetailedAnalyzerState } from './u2net';
export * from './u2net';

export interface DosaSample {
  name: string;
  score: number;
  description: string;
  imageUrl?: string;
}

export type AmmaLanguage = 'malayalam' | 'manglish' | 'english';

export interface AmmaVerdict {
  approvalScore: number;
  verdict: string;
  category: 'perfect' | 'excellent' | 'acceptable' | 'questionable' | 'disaster';
}

export interface AnalysisResult {
  score: number;
  verdict: Verdict;
  metrics: Metrics;
  geometry?: GeometryResult;
  maskDataUrl?: string;
  originalImageUrl?: string;
  specimenName?: string;
  timestamp?: string;
  specimenId?: string;
  ammaVerdict?: AmmaVerdict;
  ammaLanguage?: AmmaLanguage;
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

export type AnalyzerState =
  | 'idle'
  | 'analyzing'
  | 'loading_model'
  | 'preprocessing'
  | 'scanning'
  | 'extracting_boundary'
  | 'calculating_metrics'
  | 'done'
  | 'error';

export interface Particle {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
}
