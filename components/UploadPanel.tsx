'use client';

import { useState, useRef, ChangeEvent, DragEvent, KeyboardEvent } from 'react';
import { SAMPLES } from '@/lib/constants';
import { generateRandomScore, getVerdictForScore, generateMetrics } from '@/lib/utils';
import type { AnalyzerState, AnalysisResult } from '@/types';

interface UploadPanelProps {
  state: AnalyzerState;
  setState: (state: AnalyzerState) => void;
  setResult: (result: AnalysisResult | null) => void;
}

export default function UploadPanel({ state, setState, setResult }: UploadPanelProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [selectedSample, setSelectedSample] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectURLRef = useRef<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    // Clean up previous object URL
    if (objectURLRef.current) {
      URL.revokeObjectURL(objectURLRef.current);
    }

    const url = URL.createObjectURL(file);
    objectURLRef.current = url;
    setPreview(url);
    setFileName(file.name);
    setSelectedSample(null);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const loadSample = (n: number) => {
    setSelectedSample(n);
    setPreview('sample');
    setFileName(`Sample: ${SAMPLES[n].name}`);
  };

  const startAnalysis = () => {
    if (state === 'analyzing') return;
    setState('analyzing');

    const finalScore = selectedSample ? SAMPLES[selectedSample].score : generateRandomScore();
    
    // Simulate analysis delay
    setTimeout(() => {
      const verdict = getVerdictForScore(finalScore);
      const metrics = generateMetrics(finalScore);
      
      setResult({
        score: finalScore,
        verdict,
        metrics,
      });
      setState('done');
    }, 3000);
  };

  const canAnalyze = (preview !== null || selectedSample !== null) && state === 'idle';

  return (
    <div className="bg-[#111827] border border-[rgba(255,255,255,0.07)] rounded-2xl p-8">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload dosa image for analysis"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed ${
          isDragOver ? 'border-[#f59e0b] bg-[rgba(245,158,11,0.05)]' : 'border-[rgba(245,158,11,0.3)]'
        } rounded-xl min-h-[220px] flex items-center justify-center cursor-pointer transition-all mb-6 relative overflow-hidden focus:outline-2 focus:outline-[#f59e0b] focus:outline-offset-2`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          aria-label="Choose dosa image file"
        />
        
        {preview ? (
          <div className="text-center w-full p-8">
            {preview === 'sample' ? (
              <div className="w-[100px] h-[100px] mx-auto mb-4 rounded-[50%_48%_52%_49%/51%_47%_53%_50%] bg-[radial-gradient(ellipse_at_35%_35%,#f5c842,#c47a15_60%,#8a4a08)] shadow-[0_0_30px_rgba(245,158,11,0.4)]" />
            ) : (
              <img src={preview} alt="Dosa specimen" className="max-w-full h-[200px] object-contain rounded-lg mx-auto" />
            )}
            <p className="mt-2 text-sm text-[#8b98b0]">{fileName}</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-[50%_48%_52%_49%/51%_47%_53%_50%] bg-[radial-gradient(ellipse,#f5c842,#c47a15)] opacity-40 animate-wobble" />
            <p className="text-[#8b98b0] mb-1">Drop your dosa here</p>
            <span className="text-sm text-[#4a5568]">or click to upload</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-3 rounded-lg bg-[#161e30] border border-[rgba(255,255,255,0.07)] text-[#e2e8f0] font-semibold text-sm transition-all hover:bg-[rgba(255,255,255,0.08)] focus:outline-2 focus:outline-[#f59e0b] focus:outline-offset-2"
        >
          📁 Choose Image
        </button>
        <button
          onClick={startAnalysis}
          disabled={!canAnalyze}
          className="px-4 py-3 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-black font-bold text-sm transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(245,158,11,0.5)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 focus:outline-2 focus:outline-[#f59e0b] focus:outline-offset-2"
        >
          🔬 Analyze Circularity
        </button>
      </div>

      <div>
        <p className="text-sm text-[#8b98b0] mb-3">No dosa? Try a sample:</p>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map(n => (
            <button
              key={n}
              onClick={() => loadSample(n)}
              className={`bg-[#161e30] border ${
                selectedSample === n ? 'border-[#f59e0b]' : 'border-[rgba(255,255,255,0.07)]'
              } text-[#e2e8f0] px-2.5 py-2.5 rounded-lg cursor-pointer text-xs transition-all hover:border-[#f59e0b] hover:bg-[rgba(245,158,11,0.08)] text-center focus:outline-2 focus:outline-[#f59e0b] focus:outline-offset-2`}
            >
              {n === 1 && '🟡'} {n === 2 && '🟠'} {n === 3 && '🟤'} Sample #{n}
              <br />
              <small className="text-[#8b98b0] text-[0.7rem]">
                {n === 1 && 'The Grandma Special'}
                {n === 2 && 'The Tragic Rectangle'}
                {n === 3 && 'The Philosophical Oval'}
              </small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
