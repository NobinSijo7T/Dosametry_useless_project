// Utility functions for Dosa Circularity Analyzer

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Verdict, Metrics } from '@/types';
import { VERDICTS } from './constants';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getVerdictForScore(score: number): Verdict {
  const verdict = VERDICTS.find(v => score >= v.min && score <= v.max);
  return verdict || VERDICTS[VERDICTS.length - 1];
}

export function generateMetrics(score: number): Metrics {
  const roundness = (score * 0.97 + Math.random() * 2).toFixed(3);
  const jitter = (Math.random() * 20 + (100 - score) * 0.3).toFixed(1) + 'px';
  const sambarEligibility = score > 50 ? '✅ YES' : '❌ NO';
  const amma = 
    score > 90 ? '😭 Joy Tears' : 
    score > 70 ? '🤷 Acceptable' : 
    score > 50 ? '😤 Disappointed' : 
    '📵 Not Picking Up';
  const crispy = (Math.random() * 30 + 60).toFixed(1) + '%';
  const shame = 
    score > 80 ? 'LOW 😊' : 
    score > 60 ? 'MEDIUM 😬' : 
    score > 40 ? 'HIGH 😰' : 
    'INFINITE ☠️';

  return {
    roundness,
    jitter,
    sambarEligibility,
    amma,
    crispy,
    shame,
  };
}

export function generateRandomScore(): number {
  return Math.round((Math.random() * 60 + 35) * 10) / 10;
}
