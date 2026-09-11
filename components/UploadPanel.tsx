'use client';

import { useState, useRef, ChangeEvent, DragEvent, KeyboardEvent } from 'react';
import { SAMPLES } from '@/lib/constants';
import type { AnalyzerState } from '@/types';

interface UploadPanelProps {
  state: AnalyzerState;
  onStartAnalysis: (source: File | string, specimenName?: string) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  fileName: string;
  setFileName: (name: string) => void;
}

export default function UploadPanel({
  state,
  onStartAnalysis,
  previewUrl,
  setPreviewUrl,
  fileName,
  setFileName,
}: UploadPanelProps) {
  const [selectedSample, setSelectedSample] = useState<number | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const objectURLRef = useRef<string | null>(null);

  const handleFile = (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Invalid file format. Please deposit a PNG, JPG, or WebP specimen image.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('Specimen image exceeds 25MB threshold.');
      return;
    }

    if (objectURLRef.current) {
      URL.revokeObjectURL(objectURLRef.current);
    }

    const url = URL.createObjectURL(file);
    objectURLRef.current = url;
    setSelectedFile(file);
    setPreviewUrl(url);
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
    setUploadError(null);
    setSelectedSample(n);
    setSelectedFile(null);
    const sample = SAMPLES[n];
    if (sample.imageUrl) {
      setPreviewUrl(sample.imageUrl);
      setFileName(`Calibration Reference: ${sample.name}`);
    }
  };

  const handleAnalyzeClick = () => {
    if (state !== 'idle' && state !== 'error') return;

    if (selectedFile) {
      onStartAnalysis(selectedFile, fileName);
    } else if (selectedSample && SAMPLES[selectedSample]?.imageUrl) {
      onStartAnalysis(SAMPLES[selectedSample].imageUrl!, SAMPLES[selectedSample].name);
    } else if (previewUrl) {
      onStartAnalysis(previewUrl, fileName || 'Specimen');
    }
  };

  const isBusy = state !== 'idle' && state !== 'error' && state !== 'done';
  const canAnalyze = (previewUrl !== null || selectedFile !== null) && !isBusy;

  return (
    <div className="bg-[#12151c] border border-[rgba(253,251,247,0.12)] rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Workbench Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[rgba(253,251,247,0.08)] mb-6">
        <div>
          <h3 className="font-marcellus text-xl text-[#fdfbf7]">Specimen Deposition Stage</h3>
          <p className="text-xs font-mono text-[#94a3b8] mt-0.5">Optical comparator & shadowgraph receiver</p>
        </div>
        <div className="font-mono text-xs px-2.5 py-1 rounded bg-[#181c25] border border-[rgba(253,251,247,0.1)] text-[#f59e0b]">
          BAY 01
        </div>
      </div>

      {uploadError && (
        <div className="mb-4 p-3 bg-[rgba(185,28,28,0.15)] border border-[rgba(185,28,28,0.4)] text-[#ef4444] text-xs font-mono rounded-lg flex items-center gap-2">
          <span>⚠️</span>
          <span>{uploadError}</span>
        </div>
      )}

      {/* Main Dropzone / Optical Stage */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload dosa image for optical metrology analysis"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={handleKeyDown}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 min-h-[260px] flex flex-col items-center justify-center ${
          isDragOver
            ? 'border-[#f59e0b] bg-[rgba(245,158,11,0.08)] scale-[0.99]'
            : 'border-[rgba(253,251,247,0.15)] bg-[#0e1015] hover:border-[rgba(245,158,11,0.5)] hover:bg-[#12151c]'
        }`}
      >
        {/* Kolam Corner Brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[rgba(253,251,247,0.3)] pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[rgba(253,251,247,0.3)] pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[rgba(253,251,247,0.3)] pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[rgba(253,251,247,0.3)] pointer-events-none" />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileInput}
          className="hidden"
          id="dosa-upload"
        />

        {previewUrl ? (
          <div className="relative w-full max-h-[210px] flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Uploaded specimen"
              className="max-h-[160px] max-w-full rounded-lg object-contain shadow-lg border border-[rgba(253,251,247,0.2)] bg-[#141720]"
            />
            <p className="mt-3 font-mono text-xs text-[#f59e0b] truncate max-w-[280px]">
              {fileName || 'Specimen Ready for Scan'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 pointer-events-none">
            {/* Calibration Icon Reticle */}
            <div className="w-16 h-16 mx-auto rounded-full border border-[rgba(253,251,247,0.2)] flex items-center justify-center bg-[#151922] text-[#f59e0b]">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
                <circle cx="12" cy="12" r="4" />
                <line x1="12" y1="3" x2="12" y2="7" />
                <line x1="12" y1="17" x2="12" y2="21" />
                <line x1="3" y1="12" x2="7" y2="12" />
                <line x1="17" y1="12" x2="21" y2="12" />
              </svg>
            </div>
            <div className="font-marcellus text-base text-[#fdfbf7]">
              Drop specimen photo or click to browse
            </div>
            <p className="text-xs font-mono text-[#94a3b8]">
              Supports PNG, JPG, WebP (100% Client-Side Private)
            </p>
          </div>
        )}
      </div>

      {/* Pre-calibrated Reference Samples */}
      <div className="mt-6 pt-6 border-t border-[rgba(253,251,247,0.08)]">
        <div className="text-xs font-mono text-[#94a3b8] uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>മാതൃകാ ദോശകൾ തിരഞ്ഞെടുക്കാം (REFERENCE SAMPLES):</span>
          <span className="text-[#64748b]">SYNTHETIC REF</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          <button
            type="button"
            onClick={() => loadSample(1)}
            disabled={isBusy}
            className={`px-3 py-2.5 rounded-lg border text-left transition-all ${
              selectedSample === 1
                ? 'bg-[#181c25] border-[#f59e0b] text-[#f59e0b]'
                : 'bg-[#0e1015] border-[rgba(253,251,247,0.1)] text-[#94a3b8] hover:border-[rgba(253,251,247,0.25)] hover:text-[#fdfbf7]'
            }`}
          >
            <div className="font-mono text-[0.65rem] text-[#10b981] font-semibold">ക്ലാസ് A • CLASS A</div>
            <div className="text-xs font-medium truncate text-[#fdfbf7]">അമ്മൂമ്മ സ്പെഷ്യൽ</div>
            <div className="font-mono text-[0.68rem] text-[#94a3b8]">~97% വട്ടം (Grandma)</div>
          </button>

          <button
            type="button"
            onClick={() => loadSample(3)}
            disabled={isBusy}
            className={`px-3 py-2.5 rounded-lg border text-left transition-all ${
              selectedSample === 3
                ? 'bg-[#181c25] border-[#f59e0b] text-[#f59e0b]'
                : 'bg-[#0e1015] border-[rgba(253,251,247,0.1)] text-[#94a3b8] hover:border-[rgba(253,251,247,0.25)] hover:text-[#fdfbf7]'
            }`}
          >
            <div className="font-mono text-[0.65rem] text-[#f59e0b] font-semibold">ക്ലാസ് B • CLASS B</div>
            <div className="text-xs font-medium truncate text-[#fdfbf7]">വട്ടംതെറ്റിയ ഓവൽ</div>
            <div className="font-mono text-[0.68rem] text-[#94a3b8]">~61% വട്ടം (Oval)</div>
          </button>

          <button
            type="button"
            onClick={() => loadSample(2)}
            disabled={isBusy}
            className={`px-3 py-2.5 rounded-lg border text-left transition-all ${
              selectedSample === 2
                ? 'bg-[#181c25] border-[#f59e0b] text-[#f59e0b]'
                : 'bg-[#0e1015] border-[rgba(253,251,247,0.1)] text-[#94a3b8] hover:border-[rgba(253,251,247,0.25)] hover:text-[#fdfbf7]'
            }`}
          >
            <div className="font-mono text-[0.65rem] text-[#b91c1c] font-semibold">ക്ലാസ് F • CLASS F</div>
            <div className="text-xs font-medium truncate text-[#fdfbf7]">ദുരന്ത ചതുരം</div>
            <div className="font-mono text-[0.68rem] text-[#94a3b8]">~24% വട്ടം (Tragic)</div>
          </button>
        </div>
      </div>

      {/* Main Trigger Action */}
      <div className="mt-6">
        <button
          type="button"
          disabled={!canAnalyze}
          suppressHydrationWarning
          onClick={handleAnalyzeClick}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-sm tracking-wider uppercase font-mono transition-all flex items-center justify-center gap-3 ${
            canAnalyze
              ? 'bg-[#f59e0b] hover:bg-[#d97706] text-[#0c0e12] cursor-pointer shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_28px_rgba(245,158,11,0.45)]'
              : 'bg-[#161922] text-[#475569] border border-[rgba(253,251,247,0.06)] cursor-not-allowed'
          }`}
        >
          <span>Initiate U-2-Net Metrology Scan</span>
          <span className="text-base font-bold">⚡</span>
        </button>
      </div>
    </div>
  );
}
