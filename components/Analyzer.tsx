'use client';

import { useState, useRef } from 'react';
import UploadPanel from './UploadPanel';
import ResultsPanel from './ResultsPanel';
import type { AnalyzerState, AnalysisResult } from '@/types';
import type { AnalysisError } from '@/types/u2net';
import { preprocessImage, runU2NetSegmentation } from '@/lib/u2net';
import { analyzeDosaGeometry, deriveMetricsFromGeometry } from '@/lib/dosaGeometry';
import { ANALYSIS_STEPS } from '@/lib/constants';

export default function Analyzer() {
  const [state, setState] = useState<AnalyzerState>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<AnalysisError | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const isCancelledRef = useRef(false);

  const handleStartAnalysis = async (source: File | string, specimenName?: string) => {
    isCancelledRef.current = false;
    setError(null);
    setResult(null);
    setState('loading_model');
    setProgress(5);
    setLogs(['> Initiating Stage 01 specimen load sequence...']);
    setCurrentStep('Connecting to local optical interferometer...');

    // Synchronize minimum 3.2s scan animation with actual U-2-Net inference pipeline
    const startTime = Date.now();
    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      if (stepIdx < ANALYSIS_STEPS.length - 1 && !isCancelledRef.current) {
        const nextStep = ANALYSIS_STEPS[stepIdx];
        setCurrentStep(nextStep.replace('> ', ''));
        setLogs(prev => [...prev, nextStep]);
        setProgress(Math.min(92, Math.round(((stepIdx + 1) / ANALYSIS_STEPS.length) * 100)));
        stepIdx++;
      }
    }, 220);

    try {
      // 1. Preprocess image
      setState('preprocessing');
      const preprocessed = await preprocessImage(source, (step, pct) => {
        if (!isCancelledRef.current) {
          setCurrentStep(step);
          setLogs(prev => [...prev, `> ${step}`]);
          setProgress(prev => Math.max(prev, pct));
        }
      });

      if (isCancelledRef.current) {
        clearInterval(stepInterval);
        return;
      }

      // 2. Run U-2-Net inference
      setState('scanning');
      const mask = await runU2NetSegmentation(preprocessed, 0.45, (step, pct) => {
        if (!isCancelledRef.current) {
          setCurrentStep(step);
          setLogs(prev => [...prev, `> ${step}`]);
          setProgress(prev => Math.max(prev, pct));
        }
      });

      if (isCancelledRef.current) {
        clearInterval(stepInterval);
        return;
      }

      // 3. Extract boundary & calculate circularity geometry
      setState('extracting_boundary');
      setLogs(prev => [...prev, '> Extracting primary connected component and Moore boundary...']);
      const geometry = analyzeDosaGeometry(mask.data, mask.width, mask.height);

      if (!geometry.isIsolated || geometry.contour.length < 5) {
        clearInterval(stepInterval);
        setState('error');
        setError({
          title: 'Specimen Isolation Failed',
          message: 'The optical comparator could not clearly delineate the dosa from the surrounding plate or background. Please provide an image with higher edge contrast.',
          technicalDetails: `Detected foreground pixels: ${geometry.area} px (Insufficient salient connected component).`,
        });
        return;
      }

      // 4. Derive deterministic metrics
      setState('calculating_metrics');
      const { metrics, verdict } = deriveMetricsFromGeometry(geometry);

      // Determine original image URL for visualization
      const originalImageUrl = typeof source === 'string'
        ? source
        : preprocessed.originalCanvas.toDataURL('image/jpeg', 0.92);

      const analysisResult: AnalysisResult = {
        score: geometry.circularityPercentage,
        verdict,
        metrics,
        geometry,
        maskDataUrl: mask.maskDataUrl,
        originalImageUrl,
        specimenName: specimenName || fileName || 'Unidentified Culinary Specimen',
        timestamp: new Date().toISOString(),
      };

      // 5. Ensure minimum theatrical scan duration (at least 3.2s total elapsed)
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 3200 - elapsed);

      setTimeout(() => {
        clearInterval(stepInterval);
        if (!isCancelledRef.current) {
          setProgress(100);
          setCurrentStep('Analysis complete. Certification ready.');
          setLogs(prev => [...prev, '> Analysis complete.', '> Verification seal attached.']);
          setResult(analysisResult);
          setState('done');
        }
      }, remaining);

    } catch (err: any) {
      clearInterval(stepInterval);
      console.error('[Analyzer] Analysis pipeline error:', err);
      setState('error');
      setError({
        title: 'Metrology Pipeline Error',
        message: 'An error occurred while executing client-side neural inference. Please verify browser WebGPU/WASM compatibility.',
        technicalDetails: err?.message || String(err),
      });
    }
  };

  const handleReset = () => {
    isCancelledRef.current = true;
    setState('idle');
    setResult(null);
    setError(null);
    setProgress(0);
    setLogs([]);
    setCurrentStep('');
  };

  return (
    <section className="relative z-[1] px-6 lg:px-12 py-28 max-w-[1440px] mx-auto" id="analyzer">
      {/* Section Header */}
      <div className="max-w-[760px] mx-auto text-center mb-16 space-y-4">
        <h2 className="font-marcellus text-3xl sm:text-4xl lg:text-5xl font-normal text-[#fdfbf7] tracking-tight">
          Primary Calibration Bay
        </h2>
        <p className="text-base sm:text-lg text-[#94a3b8] leading-relaxed">
          Subject your culinary specimen to 100% private, browser-side U-2-Net salient foreground isolation, polar boundary extraction, and isoperimetric circularity ($4\pi A / P^2$).
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#64748b] pt-2">
          <span>STATION: CAL-BAY-01</span>
          <span>•</span>
          <span>ENGINE: U-2-NET (LOCAL ONNX)</span>
          <span>•</span>
          <span>PRIVACY: 100% CLIENT-SIDE</span>
        </div>
      </div>

      {/* Two-Column Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6">
          <UploadPanel
            state={state}
            onStartAnalysis={handleStartAnalysis}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            fileName={fileName}
            setFileName={setFileName}
          />
        </div>
        <div className="lg:col-span-6">
          <ResultsPanel
            state={state}
            setState={setState}
            result={result}
            progress={progress}
            currentStep={currentStep}
            logs={logs}
            error={error}
            onReset={handleReset}
          />
        </div>
      </div>
    </section>
  );
}
