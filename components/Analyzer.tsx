'use client';

import { useState } from 'react';
import UploadPanel from './UploadPanel';
import ResultsPanel from './ResultsPanel';
import type { AnalyzerState, AnalysisResult } from '@/types';

export default function Analyzer() {
  const [state, setState] = useState<AnalyzerState>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  return (
    <section className="relative z-[1] px-[5%] py-24 max-w-[1200px] mx-auto" id="analyzer">
      <div className="text-center mb-12">
        <div className="inline-block bg-[rgba(245,158,11,0.15)] border border-[rgba(245,158,11,0.3)] text-[#f59e0b] text-xs font-mono tracking-[2px] uppercase px-3.5 py-1 rounded-full mb-4">
          Core Feature
        </div>
        <h2 className="font-orbitron text-[clamp(2rem,5vw,3.5rem)] mb-3 tracking-tight">
          The <span className="bg-gradient-to-r from-[#f59e0b] to-[#ea580c] bg-clip-text text-transparent">Analyzer</span>
        </h2>
        <p className="text-[#8b98b0] text-lg max-w-[600px] mx-auto">
          Upload your dosa image and receive a comprehensive 47-point circularity report in milliseconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <UploadPanel state={state} setState={setState} setResult={setResult} />
        <ResultsPanel state={state} setState={setState} result={result} />
      </div>
    </section>
  );
}
