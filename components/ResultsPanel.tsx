'use client';

import { useEffect, useState, useRef } from 'react';
import type { AnalyzerState, AnalysisResult, AmmaVerdict, AmmaLanguage } from '@/types';
import type { AnalysisError } from '@/types/u2net';
import DosaPassport from './DosaPassport';
import { generateSpecimenId } from '@/lib/specimenId';
import { MALAYALAM_LOADING_DIALOGUES } from '@/lib/constants';

interface ResultsPanelProps {
  state: AnalyzerState;
  setState: (state: AnalyzerState) => void;
  result: AnalysisResult | null;
  progress: number;
  currentStep: string;
  logs: string[];
  error: AnalysisError | null;
  onReset: () => void;
  ammaVerdict?: AmmaVerdict | null;
  ammaLanguage?: AmmaLanguage;
}

export default function ResultsPanel({
  state,
  setState,
  result,
  progress,
  currentStep,
  logs,
  error,
  onReset,
  ammaVerdict = null,
  ammaLanguage = 'malayalam',
}: ResultsPanelProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [viewMode, setViewMode] = useState<'overlay' | 'mask'>('overlay');
  const [showPassport, setShowPassport] = useState(false);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (state === 'done' && result) {
      let current = 0;
      const target = result.score;
      const interval = setInterval(() => {
        current = Math.min(current + 1.8, target);
        setAnimatedScore(current);
        if (current >= target) {
          setAnimatedScore(target);
          clearInterval(interval);
        }
      }, 20);

      // Generate specimen ID if not present
      if (!result.specimenId && result.geometry) {
        const specimenId = generateSpecimenId(
          result.score,
          parseFloat(result.metrics.roundness),
          result.geometry.equivalentDiameter,
          Date.now()
        );
        result.specimenId = specimenId;
      }

      return () => clearInterval(interval);
    }
  }, [state, result]);

  // Render contour overlay on canvas when done
  useEffect(() => {
    if (state === 'done' && result?.geometry && result.originalImageUrl) {
      const canvas = overlayCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const geom = result.geometry;
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw base image
        ctx.drawImage(img, 0, 0);

        if (geom.isIsolated && geom.contour.length > 0) {
          // 2. Draw subtle dark tint outside contour for focus
          ctx.save();
          ctx.fillStyle = 'rgba(12, 14, 18, 0.45)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Clip to contour and redraw unshadowed specimen
          ctx.beginPath();
          geom.contour.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, 0, 0);
          ctx.restore();

          // 3. Draw Equivalent Perfect Circle reticle (Golden Ghee)
          ctx.save();
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
          ctx.lineWidth = Math.max(2, Math.round(canvas.width / 240));
          ctx.setLineDash([8, 6]);
          ctx.beginPath();
          ctx.arc(geom.center.x, geom.center.y, geom.meanRadius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // 4. Draw Detected Dosa Outer Boundary Contour (Emerald Neon)
          ctx.save();
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = Math.max(2.5, Math.round(canvas.width / 200));
          ctx.shadowColor = 'rgba(16, 185, 129, 0.8)';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          geom.contour.forEach((pt, i) => {
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          });
          ctx.closePath();
          ctx.stroke();
          ctx.restore();

          // 5. Centroid Crosshair
          ctx.save();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          const crossSize = Math.max(12, Math.round(canvas.width / 35));
          ctx.beginPath();
          ctx.moveTo(geom.center.x - crossSize, geom.center.y);
          ctx.lineTo(geom.center.x + crossSize, geom.center.y);
          ctx.moveTo(geom.center.x, geom.center.y - crossSize);
          ctx.lineTo(geom.center.x, geom.center.y + crossSize);
          ctx.stroke();

          // Center dot
          ctx.fillStyle = '#fdfbf7';
          ctx.beginPath();
          ctx.arc(geom.center.x, geom.center.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // 6. Caliper Dimension annotation text
          ctx.save();
          ctx.font = `bold ${Math.max(12, Math.round(canvas.width / 30))}px 'Inconsolata', monospace`;
          ctx.fillStyle = '#f59e0b';
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.shadowBlur = 4;
          const label = `Ø ${geom.equivalentDiameter.toFixed(1)}px (Circularity: ${geom.circularityPercentage}%)`;
          ctx.fillText(label, 16, Math.max(24, Math.round(canvas.height / 20)));
          ctx.restore();
        }
      };

      img.src = result.originalImageUrl;
    }
  }, [state, result, viewMode]);

  // IDLE STATE
  if (state === 'idle') {
    return (
      <div className="bg-[#12151c] border border-[rgba(253,251,247,0.12)] rounded-2xl p-8 min-h-[520px] flex flex-col items-center justify-center text-center relative overflow-hidden shadow-xl">
        <div className="w-48 h-48 rounded-full border border-[rgba(253,251,247,0.06)] flex items-center justify-center mb-6 relative">
          <div className="w-32 h-32 rounded-full border border-dashed border-[rgba(253,251,247,0.1)] animate-spin-slow" />
          <div className="w-16 h-16 rounded-full border border-[#f59e0b]/30 flex items-center justify-center text-[#f59e0b] font-mono text-xl animate-pulse">
            ◎
          </div>
        </div>

        <h4 className="font-marcellus text-xl text-[#fdfbf7] mb-2">Awaiting Dosa Specimen</h4>
        <p className="text-sm text-[#94a3b8] max-w-[380px] leading-relaxed">
          Upload a photo or choose a preset on the left to measure circularity and maternal approval.
        </p>
        <div className="mt-6 font-mono text-xs text-[#64748b] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
          <span>AI SCANNER ONLINE</span>
          <span>•</span>
          <span>WAITING FOR INPUT</span>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (state === 'error' && error) {
    return (
      <div className="bg-[#12151c] border border-[rgba(185,28,28,0.3)] rounded-2xl p-8 min-h-[520px] flex flex-col justify-between shadow-xl">
        <div className="text-center pt-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[rgba(185,28,28,0.15)] border border-[#ef4444]/40 flex items-center justify-center text-3xl mb-6">
            ⚠️
          </div>
          <h4 className="font-marcellus text-2xl text-[#fdfbf7] mb-3">{error.title}</h4>
          <p className="text-sm text-[#94a3b8] max-w-[420px] mx-auto leading-relaxed mb-4">
            {error.message}
          </p>

          {error.technicalDetails && (
            <div className="bg-[#0e1015] border border-[rgba(253,251,247,0.08)] rounded-xl p-4 font-mono text-xs text-[#ef4444] text-left max-w-[460px] mx-auto overflow-x-auto">
              {error.technicalDetails}
            </div>
          )}

          <div className="mt-6 p-4 bg-[#181c25] rounded-xl text-left max-w-[460px] mx-auto text-xs text-[#94a3b8] space-y-2 border border-[rgba(253,251,247,0.06)]">
            <div className="font-bold text-[#fdfbf7]">Metrological Guidelines for Valid Specimens:</div>
            <ul className="list-disc pl-5 space-y-1">
              <li>Ensure the dosa is well-lit and contrasts against the plate or tawa.</li>
              <li>Position the entire perimeter inside the camera frame.</li>
              <li>Avoid extreme perspective tilt; capture from directly overhead when possible.</li>
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="w-full py-3 px-6 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0c0e12] font-semibold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-md"
        >
          ↺ Return to Calibration Stage
        </button>
      </div>
    );
  }

  // ANALYZING STATE
  const isAnalyzing = state !== 'done' && state !== 'error';
  if (isAnalyzing) {
    const dialogueIdx = Math.min(
      MALAYALAM_LOADING_DIALOGUES.length - 1,
      Math.floor((progress / 100) * MALAYALAM_LOADING_DIALOGUES.length)
    );
    const activeDialogue = MALAYALAM_LOADING_DIALOGUES[dialogueIdx];

    return (
      <div className="bg-[#12151c] border border-[rgba(253,251,247,0.12)] rounded-2xl p-6 sm:p-8 min-h-[520px] flex flex-col justify-between shadow-xl">
        <div className="text-center pt-2">
          {/* Scanning Polar Radar Reticle */}
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 mx-auto mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-[rgba(253,251,247,0.15)]" />
            <div className="absolute inset-3 rounded-full border border-dashed border-[rgba(245,158,11,0.3)] animate-spin-slow" />
            <div className="absolute inset-8 rounded-full border border-[rgba(253,251,247,0.1)]" />
            <div className="absolute inset-14 rounded-full border border-[#f59e0b]/40" />

            {/* Radar Sweep Needle */}
            <div className="absolute inset-0 rounded-full overflow-hidden animate-polar-sweep pointer-events-none">
              <div 
                className="w-1/2 h-1/2 origin-bottom-right"
                style={{
                  background: 'linear-gradient(45deg, rgba(245,158,11,0.4) 0%, transparent 70%)',
                }}
              />
            </div>

            <div className="relative z-10 font-mono text-3xl font-bold text-[#f59e0b]">
              {Math.round(progress)}%
            </div>
          </div>

          {/* Malayalam Funny Live Commentary Card */}
          <div className="mb-4 px-4 py-3 bg-gradient-to-r from-[#181c25] via-[#1a202c] to-[#181c25] border border-[#f59e0b]/40 rounded-xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-[rgba(253,251,247,0.08)] pb-1">
              <div className="flex items-center gap-1.5">
                <span className="text-sm">👩‍🍳</span>
                <span className="font-gayathri text-xs font-bold text-[#f59e0b]">
                  {activeDialogue.speaker}
                </span>
              </div>
              <span className="font-mono text-[0.62rem] text-[#94a3b8] uppercase tracking-wider">
                തത്സമയ കമന്ററി
              </span>
            </div>
            <p className="font-gayathri text-base sm:text-lg text-[#fdfbf7] font-bold leading-snug">
              "{activeDialogue.dialogue}"
            </p>
          </div>

          <div className="font-gayathri text-base sm:text-lg text-[#fdfbf7] font-bold mb-1">
            ദോശയുടെ വട്ടം ശാസ്ത്രീയമായി അളക്കുന്നു...
          </div>
          <p className="text-xs font-gayathri text-[#f59e0b] font-medium tracking-wide mb-4 truncate max-w-[440px] mx-auto">
            {currentStep || 'മാവിന്റെ ഘടന പരിശോധിക്കുന്നു...'}
          </p>
        </div>

        {/* Real-time Telemetry Terminal Log */}
        <div 
          role="status" 
          aria-live="polite"
          className="font-mono text-[0.72rem] bg-[#0a0c10] border border-[rgba(253,251,247,0.1)] text-[#10b981] rounded-xl p-3.5 max-h-[130px] overflow-y-auto space-y-1 text-left"
        >
          {logs.map((log, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-[#f59e0b] opacity-60 shrink-0">›</span>
              <span className="font-gayathri text-[0.8rem] text-[#10b981] leading-tight">{log}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="mt-4 w-full py-2.5 px-4 rounded-xl border border-[rgba(185,28,28,0.4)] text-[#ef4444] hover:bg-[rgba(185,28,28,0.15)] text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
        >
          ✕ Abort Calibration Sequence
        </button>
      </div>
    );
  }

  // DONE STATE: OFFICIAL REPORT & REAL GEOMETRIC VISUALIZER
  if (state === 'done' && result) {
    const circumference = 2 * Math.PI * 72;
    const offset = circumference - (result.score / 100) * circumference;

    return (
      <div className="bg-[#12151c] border border-[rgba(253,251,247,0.15)] rounded-2xl p-6 sm:p-8 min-h-[520px] shadow-2xl relative">
        {/* Certificate Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-[rgba(253,251,247,0.08)] mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="font-mono text-xs text-[#94a3b8] uppercase tracking-wider">
              METROLOGY REPORT #{result.timestamp ? `DMD-${result.timestamp.slice(-4)}` : 'DMD-VERIFIED'}
            </span>
          </div>
          <span className="font-mono text-xs text-[#f59e0b]">OFFICIAL VERDICT</span>
        </div>

        {/* Central Metrology Score Card with Wax Seal */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#0e1015] border border-[rgba(253,251,247,0.08)] rounded-xl p-6 mb-6">
          {/* Circular Reticle Gauge */}
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="72"
                fill="none"
                stroke="rgba(253, 251, 247, 0.08)"
                strokeWidth="8"
              />
              <circle
                cx="80"
                cy="80"
                r="72"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="font-mono text-3xl font-bold text-[#fdfbf7]">
                {animatedScore.toFixed(1)}%
              </span>
              <span className="text-[0.65rem] font-mono text-[#94a3b8] uppercase tracking-wider">
                Circularity
              </span>
            </div>
          </div>

          {/* Classification Summary */}
          <div className="text-left space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{result.verdict.emoji}</span>
              <h4 className="font-marcellus text-xl text-[#fdfbf7]">{result.verdict.title}</h4>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-[rgba(245,158,11,0.3)]">
                GRADE {result.verdict.grade}
              </span>
            </div>
            <p className="text-xs text-[#94a3b8] leading-relaxed">
              {result.verdict.desc}
            </p>
            {result.geometry && (
              <div className="text-[0.68rem] font-mono text-[#64748b]">
                Area: {result.geometry.area.toLocaleString()} px² • Perimeter: {result.geometry.perimeter.toFixed(1)} px
              </div>
            )}
          </div>

          {/* Red Wax Seal Stamp Badge */}
          <div className="wax-seal-badge w-20 h-20 shrink-0 rounded-full flex flex-col items-center justify-center p-1 text-center shadow-lg border border-[rgba(254,202,202,0.4)] transform rotate-3 select-none">
            <span className="font-mono text-[0.45rem] tracking-wider text-[#fee2e2] uppercase">METROLOGY</span>
            <span className="font-marcellus text-[0.75rem] font-bold text-[#fef2f2] leading-tight my-0.5">GRADE {result.verdict.grade}</span>
            <span className="font-mono text-[0.45rem] tracking-widest text-[#fecaca] uppercase">VERIFIED</span>
          </div>
        </div>

        {/* Real Geometric Visualization Section */}
        {result.geometry && result.originalImageUrl && (
          <div className="mb-6 bg-[#0e1015] border border-[rgba(253,251,247,0.1)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-mono text-[#fdfbf7] font-semibold flex items-center gap-2">
                <span>POLAR COMPARATOR INTERFEROGRAM</span>
                <span className="text-[0.65rem] px-1.5 py-0.2 rounded bg-[#181c25] text-[#10b981]">
                  U-2-NET DETECTED
                </span>
              </div>
              <div className="flex gap-1.5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setViewMode('overlay')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    viewMode === 'overlay'
                      ? 'bg-[#f59e0b] text-[#0c0e12] font-semibold'
                      : 'bg-[#181c25] text-[#94a3b8] hover:text-[#fdfbf7]'
                  }`}
                >
                  Contour Overlay
                </button>
                {result.maskDataUrl && (
                  <button
                    type="button"
                    onClick={() => setViewMode('mask')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      viewMode === 'mask'
                        ? 'bg-[#f59e0b] text-[#0c0e12] font-semibold'
                        : 'bg-[#181c25] text-[#94a3b8] hover:text-[#fdfbf7]'
                    }`}
                  >
                    Binary Mask
                  </button>
                )}
              </div>
            </div>

            <div className="relative w-full max-h-[260px] flex items-center justify-center bg-[#07090c] rounded-lg overflow-hidden border border-[rgba(253,251,247,0.06)]">
              {viewMode === 'overlay' ? (
                <canvas
                  ref={overlayCanvasRef}
                  className="max-h-[250px] w-auto max-w-full object-contain"
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={result.maskDataUrl}
                  alt="U-2-Net Binary Mask"
                  className="max-h-[250px] w-auto max-w-full object-contain"
                />
              )}
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[0.68rem] font-mono text-[#64748b]">
              <span>Green: Detected Boundary</span>
              <span>Dashed Gold: Equivalent Circle Reticle</span>
              <span>Crosshair: Centroid</span>
            </div>
          </div>
        )}

        {/* 6 Calibrated Metrology Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          <div className="bg-[#0e1015] border border-[rgba(253,251,247,0.08)] rounded-lg p-3 text-left">
            <div className="text-[0.65rem] font-mono text-[#94a3b8] uppercase tracking-wider mb-1">
              Roundness Index
            </div>
            <div className="font-mono text-sm font-bold text-[#f59e0b]">
              {result.metrics.roundness}
            </div>
          </div>

          <div className="bg-[#0e1015] border border-[rgba(253,251,247,0.08)] rounded-lg p-3 text-left">
            <div className="text-[0.65rem] font-mono text-[#94a3b8] uppercase tracking-wider mb-1">
              Edge Jitter (σ)
            </div>
            <div className="font-mono text-sm font-bold text-[#fdfbf7]">
              {result.metrics.jitter}
            </div>
          </div>

          <div className="bg-[#0e1015] border border-[rgba(253,251,247,0.08)] rounded-lg p-3 text-left">
            <div className="text-[0.65rem] font-mono text-[#94a3b8] uppercase tracking-wider mb-1">
              Sambar Eligibility
            </div>
            <div className="font-mono text-sm font-bold text-[#38bdf8]">
              {result.metrics.sambarEligibility}
            </div>
          </div>

          <div className="bg-[#0e1015] border border-[rgba(253,251,247,0.08)] rounded-lg p-3 text-left">
            <div className="text-[0.65rem] font-mono text-[#94a3b8] uppercase tracking-wider mb-1">
              Amma Approval
            </div>
            <div className="font-mono text-sm font-bold text-[#10b981]">
              {result.metrics.amma}
            </div>
          </div>

          <div className="bg-[#0e1015] border border-[rgba(253,251,247,0.08)] rounded-lg p-3 text-left">
            <div className="text-[0.65rem] font-mono text-[#94a3b8] uppercase tracking-wider mb-1">
              Crispiness Factor
            </div>
            <div className="font-mono text-sm font-bold text-[#f59e0b]">
              {result.metrics.crispy}
            </div>
          </div>

          <div className="bg-[#0e1015] border border-[rgba(253,251,247,0.08)] rounded-lg p-3 text-left">
            <div className="text-[0.65rem] font-mono text-[#94a3b8] uppercase tracking-wider mb-1">
              Existential Shame
            </div>
            <div className="font-mono text-sm font-bold text-[#b91c1c]">
              {result.metrics.shame}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <button
            type="button"
            onClick={() => setShowPassport(true)}
            className="flex-1 py-3 px-4 rounded-xl border-2 border-[#f59e0b] bg-gradient-to-r from-[#f59e0b]/10 to-[#ea580c]/10 hover:from-[#f59e0b]/20 hover:to-[#ea580c]/20 text-[#f59e0b] text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
          >
            <span>📋 Generate Dosa Passport</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="py-3 px-6 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-[#0c0e12] font-semibold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            ↺ Analyze Another Specimen
          </button>
        </div>

        {/* Dosa Passport Modal */}
        {showPassport && (
          <DosaPassport
            result={result}
            ammaVerdict={ammaVerdict}
            ammaLanguage={ammaLanguage}
            onClose={() => setShowPassport(false)}
          />
        )}
      </div>
    );
  }

  return null;
}
