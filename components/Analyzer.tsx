'use client';

import { useState, useRef, useCallback } from 'react';
import UploadPanel from './UploadPanel';
import ResultsPanel from './ResultsPanel';
import AmmaMode from './AmmaMode';
import type { AnalyzerState, AnalysisResult, AmmaVerdict, AmmaLanguage } from '@/types';
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
  const [ammaVerdict, setAmmaVerdict] = useState<AmmaVerdict | null>(null);
  const [ammaLanguage, setAmmaLanguage] = useState<AmmaLanguage>('malayalam');
  const isCancelledRef = useRef(false);

  const handleVerdictChange = useCallback((verdict: AmmaVerdict, language: AmmaLanguage) => {
    setAmmaVerdict(prev => (prev?.verdict === verdict.verdict && prev?.approvalScore === verdict.approvalScore ? prev : verdict));
    setAmmaLanguage(prev => (prev === language ? prev : language));
  }, []);

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
    setAmmaVerdict(null);
  };

  return (
    <section className="relative z-[1] px-6 lg:px-12 py-28 max-w-[1440px] mx-auto" id="analyzer">
      {/* Section Header */}
      <div className="max-w-[760px] mx-auto text-center mb-16 space-y-4">
        <h2 className="font-gayathri text-3xl sm:text-4xl lg:text-5xl font-bold text-[#fdfbf7] tracking-tight">
          ദോശ പരിശോധനാ കേന്ദ്രം
        </h2>
        <p className="font-gayathri text-base sm:text-lg lg:text-xl text-[#94a3b8] leading-relaxed font-normal">
          ദോശയുടെ ഫോട്ടോ അപ്‌ലോഡ് ചെയ്ത് വട്ടത്തിന്റെ കൃത്യതയും, അരികുകളുടെ ഭംഗിയും, അമ്മയുടെ പൂർണ്ണ സമ്മതവും അളക്കാം.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm font-gayathri text-[#94a3b8] pt-2">
          <span className="text-[#10b981] font-semibold">● ഓൺ-ഡിവൈസ് AI</span>
          <span>•</span>
          <span>100% സ്വകാര്യം</span>
          <span>•</span>
          <span>തത്സമയ ഫലം</span>
        </div>
      </div>

      {/* Two-Column Workbench Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Stage 01: Specimen Deposition & Amma Inspection */}
        <div className="lg:col-span-6 flex flex-col gap-6 w-full">
          <UploadPanel
            state={state}
            onStartAnalysis={handleStartAnalysis}
            previewUrl={previewUrl}
            setPreviewUrl={setPreviewUrl}
            fileName={fileName}
            setFileName={setFileName}
          />

          {result && result.geometry && (
            <div className="w-full">
              <AmmaMode
                circularity={result.score}
                roundness={result.metrics.roundness}
                jitter={result.metrics.jitter}
                diameter={result.geometry.equivalentDiameter}
                onVerdictChange={handleVerdictChange}
              />
            </div>
          )}
        </div>

        {/* Stage 02: Results & Metrology */}
        <div className="lg:col-span-6 flex flex-col gap-6 w-full">
          <ResultsPanel
            state={state}
            setState={setState}
            result={result}
            progress={progress}
            currentStep={currentStep}
            logs={logs}
            error={error}
            onReset={handleReset}
            ammaVerdict={ammaVerdict}
            ammaLanguage={ammaLanguage}
          />
        </div>
      </div>
    </section>
  );
}
