'use client';

import { useEffect, useState } from 'react';
import type { AnalyzerState, AnalysisResult } from '@/types';
import { ANALYSIS_STEPS } from '@/lib/constants';

interface ResultsPanelProps {
  state: AnalyzerState;
  setState: (state: AnalyzerState) => void;
  result: AnalysisResult | null;
}

export default function ResultsPanel({ state, setState, result }: ResultsPanelProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (state === 'analyzing') {
      setProgress(0);
      setLogs([]);
      let stepIndex = 0;

      const interval = setInterval(() => {
        if (stepIndex < ANALYSIS_STEPS.length) {
          const step = ANALYSIS_STEPS[stepIndex];
          setCurrentStep(step.replace('> ', ''));
          setLogs(prev => [...prev, step]);
          setProgress((stepIndex / ANALYSIS_STEPS.length) * 100);
          stepIndex++;
        }
      }, 250);

      return () => clearInterval(interval);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'done' && result) {
      let current = 0;
      const target = result.score;
      const interval = setInterval(() => {
        current = Math.min(current + 1.5, target);
        setAnimatedScore(current);
        if (current >= target) {
          setAnimatedScore(target);
          clearInterval(interval);
        }
      }, 20);

      return () => clearInterval(interval);
    }
  }, [state, result]);

  if (state === 'idle') {
    return (
      <div className="bg-[#111827] border border-[rgba(255,255,255,0.07)] rounded-2xl p-8 min-h-[500px] flex items-center justify-center">
        <div className="text-center text-[#8b98b0]">
          <div className="text-6xl mb-4 opacity-30 animate-idle-pulse">◎</div>
          <p>Awaiting dosa specimen...</p>
          <p className="text-sm text-[#4a5568] mt-2">Our algorithms are meditating. Please provide a dosa to analyze.</p>
        </div>
      </div>
    );
  }

  if (state === 'analyzing') {
    return (
      <div className="bg-[#111827] border border-[rgba(255,255,255,0.07)] rounded-2xl p-8 min-h-[500px]">
        <div className="text-center">
          <div className="relative w-40 h-40 mx-auto mb-6">
            <div className="absolute inset-0 border-2 border-[#f59e0b] rounded-full animate-spin opacity-60" />
            <div className="absolute inset-[15px] border-2 border-[#ea580c] rounded-full animate-spin-reverse opacity-60" />
            <div className="absolute inset-[30px] border-2 border-[#f59e0b] rounded-full animate-spin-fast opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center font-orbitron text-2xl text-[#f59e0b] font-bold">
              {Math.round(progress)}%
            </div>
          </div>
          <p className="text-sm text-[#8b98b0] mb-4">{currentStep}</p>
          <div 
            role="status" 
            aria-live="polite" 
            aria-atomic="false"
            className="font-mono text-[0.72rem] text-[#10b981] text-left bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.15)] rounded-lg p-3 max-h-[120px] overflow-hidden mb-4"
          >
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
          <button
            onClick={() => setState('idle')}
            className="w-full bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-[#ef4444] px-4 py-3 rounded-lg cursor-pointer text-sm transition-all hover:bg-[rgba(239,68,68,0.2)] hover:border-[#ef4444]"
          >
            ✕ Cancel Analysis
          </button>
        </div>
      </div>
    );
  }

  if (state === 'done' && result) {
    const circumference = 534;
    const offset = circumference - (result.score / 100) * circumference;

    return (
      <div className="bg-[#111827] border border-[rgba(255,255,255,0.07)] rounded-2xl p-8 min-h-[500px]">
        <div className="flex justify-center mb-6">
          <div className="relative w-[180px] h-[180px]">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="score-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b"/>
                  <stop offset="100%" stopColor="#ea580c"/>
                </linearGradient>
              </defs>
              <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="8"/>
              <circle 
                cx="100" 
                cy="100" 
                r="85" 
                fill="none" 
                stroke="url(#score-grad)" 
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-in-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-orbitron text-4xl font-black text-[#f59e0b]">{animatedScore.toFixed(1)}</span>
              <span className="text-[0.7rem] text-[#8b98b0]">% circular</span>
              <span className="text-3xl mt-1">{result.verdict.grade}</span>
            </div>
          </div>
        </div>

        <div className="bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.15)] rounded-xl p-4 mb-6 text-center">
          <div className="text-3xl mb-2">{result.verdict.emoji}</div>
          <div className="font-bold text-lg mb-1">{result.verdict.title}</div>
          <div className="text-sm text-[#8b98b0] leading-relaxed">{result.verdict.desc}</div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {Object.entries(result.metrics).map(([key, value]) => (
            <div key={key} className="bg-[#080b14] border border-[rgba(255,255,255,0.07)] rounded-lg p-3 text-center">
              <div className="text-[0.68rem] text-[#4a5568] uppercase tracking-wider mb-1">
                {key === 'roundness' && 'Roundness Index'}
                {key === 'jitter' && 'Edge Jitter'}
                {key === 'sambarEligibility' && 'Sambar Eligibility'}
                {key === 'amma' && 'Amma Approval'}
                {key === 'crispy' && 'Crispiness Factor'}
                {key === 'shame' && 'Existential Shame'}
              </div>
              <div className="font-mono text-sm text-[#f59e0b] font-bold">{value}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            setState('idle');
            setAnimatedScore(0);
          }}
          className="w-full bg-[#080b14] border border-[rgba(255,255,255,0.07)] text-[#8b98b0] px-4 py-3 rounded-lg cursor-pointer text-sm transition-all hover:border-[#f59e0b] hover:text-[#f59e0b]"
        >
          ↺ Analyze Another Dosa
        </button>
      </div>
    );
  }

  return null;
}
