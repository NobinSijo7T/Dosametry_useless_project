'use client';

import { useRef } from 'react';
import type { AnalysisResult, AmmaVerdict, AmmaLanguage } from '@/types';

interface DosaPassportProps {
  result: AnalysisResult;
  ammaVerdict: AmmaVerdict | null;
  ammaLanguage: AmmaLanguage;
  onClose: () => void;
}

export default function DosaPassport({
  result,
  ammaVerdict,
  ammaLanguage,
  onClose,
}: DosaPassportProps) {
  const passportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getClassificationColor = () => {
    const score = result.score;
    if (score >= 95) return 'text-[#10b981]';
    if (score >= 80) return 'text-[#f59e0b]';
    if (score >= 60) return 'text-[#3b82f6]';
    if (score >= 40) return 'text-[#f97316]';
    return 'text-[#ef4444]';
  };

  return (
    <>
      {/* Overlay backdrop */}
      <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 no-print">
        <div className="bg-[#0c0e12] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-[#181c25] hover:bg-[#ef4444] text-[#fdfbf7] flex items-center justify-center transition-colors no-print"
            aria-label="Close passport"
          >
            ✕
          </button>

          {/* Action buttons */}
          <div className="flex gap-3 p-6 border-b border-[rgba(253,251,247,0.1)] no-print">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] text-[#0c0e12] font-bold text-sm rounded-xl transition-all shadow-lg font-mono uppercase tracking-wider"
            >
              🖨️ Print / Save as PDF
            </button>
          </div>

          {/* Passport Content */}
          <div ref={passportRef} id="dosa-passport" className="passport-content">
            <PassportDocument
              result={result}
              ammaVerdict={ammaVerdict}
              ammaLanguage={ammaLanguage}
              formatDate={formatDate}
              formatTime={formatTime}
              getClassificationColor={getClassificationColor}
            />
          </div>
        </div>
      </div>
    </>
  );
}

// Separate component for the actual passport document
function PassportDocument({
  result,
  ammaVerdict,
  ammaLanguage,
  formatDate,
  formatTime,
  getClassificationColor,
}: {
  result: AnalysisResult;
  ammaVerdict: AmmaVerdict | null;
  ammaLanguage: AmmaLanguage;
  formatDate: () => string;
  formatTime: () => string;
  getClassificationColor: () => string;
}) {
  return (
    <div className="bg-[#fdfbf7] text-[#0c0e12] p-12 min-h-[297mm] passport-page">
      {/* Header */}
      <div className="text-center border-b-4 border-[#f59e0b] pb-6 mb-8">
        <div className="font-mono text-xs tracking-[0.3em] text-[#94a3b8] mb-2">
          REPUBLIC OF SOUTH INDIA
        </div>
        <h1 className="font-marcellus text-3xl mb-2 tracking-tight">
          NATIONAL METROLOGY DIRECTORATE
        </h1>
        <h2 className="font-marcellus text-xl text-[#f59e0b] mb-1">
          FOR DOSA CIRCULARITY
        </h2>
        <div className="font-mono text-xs tracking-[0.2em] text-[#64748b]">
          OFFICIAL SPECIMEN PASSPORT
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#ea580c] flex items-center justify-center text-white text-2xl">
            ◎
          </div>
        </div>
      </div>

      {/* Specimen Information */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Left Column */}
        <div>
          <div className="bg-[#fff] border-2 border-[#f59e0b] rounded-xl p-6 mb-6">
            <div className="font-mono text-xs text-[#f59e0b] uppercase tracking-wider mb-4">
              Specimen Identification
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs text-[#64748b] uppercase tracking-wide mb-1">Specimen ID</div>
                <div className="font-mono text-lg font-bold text-[#0c0e12]">
                  {result.specimenId || 'DOSA-0000-0000'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-[#64748b] uppercase tracking-wide mb-1">Date</div>
                  <div className="font-mono text-sm">{formatDate()}</div>
                </div>
                <div>
                  <div className="text-xs text-[#64748b] uppercase tracking-wide mb-1">Time</div>
                  <div className="font-mono text-sm">{formatTime()}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-[#64748b] uppercase tracking-wide mb-1">Classification</div>
                <div className={`font-bold text-base ${getClassificationColor()}`}>
                  {result.verdict.title}
                </div>
              </div>

              <div>
                <div className="text-xs text-[#64748b] uppercase tracking-wide mb-1">Grade</div>
                <div className="font-mono text-2xl font-bold text-[#f59e0b]">
                  {result.verdict.grade}
                </div>
              </div>
            </div>
          </div>

          {/* Metrology Results */}
          <div className="bg-[#fff] border border-[#e5e7eb] rounded-xl p-6">
            <div className="font-mono text-xs text-[#f59e0b] uppercase tracking-wider mb-4 pb-2 border-b border-[#e5e7eb]">
              Metrology Results
            </div>
            
            <div className="space-y-3 text-sm">
              <MetricRow label="Circularity" value={`${result.score.toFixed(2)}%`} />
              <MetricRow label="Roundness Index" value={result.metrics.roundness} />
              <MetricRow 
                label="Diameter" 
                value={result.geometry?.equivalentDiameter 
                  ? `${result.geometry.equivalentDiameter.toFixed(1)}px` 
                  : 'N/A'
                } 
              />
              <MetricRow label="Edge Jitter σ" value={result.metrics.jitter} />
              <MetricRow label="Sambar Eligibility" value={result.metrics.sambarEligibility} />
              <MetricRow label="Crispiness Factor" value={result.metrics.crispy} />
            </div>
          </div>
        </div>

        {/* Right Column - Specimen Image */}
        <div>
          <div className="bg-[#fff] border-2 border-[#f59e0b] rounded-xl p-4 mb-6">
            <div className="font-mono text-xs text-[#f59e0b] uppercase tracking-wider mb-3">
              Specimen Image
            </div>
            <div className="aspect-square bg-[#f8f9fa] rounded-lg overflow-hidden border border-[#e5e7eb] flex items-center justify-center">
              {result.originalImageUrl ? (
                <img
                  src={result.originalImageUrl}
                  alt="Dosa specimen"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-[#94a3b8] text-sm">No image available</div>
              )}
            </div>
            <div className="mt-2 text-center text-xs text-[#64748b] font-mono">
              Original captured specimen
            </div>
          </div>

          {/* Amma Inspection */}
          {ammaVerdict && (
            <div className="bg-gradient-to-br from-[#fff5e6] to-[#fff] border-2 border-[#f59e0b] rounded-xl p-6">
              <div className="font-mono text-xs text-[#f59e0b] uppercase tracking-wider mb-4 pb-2 border-b border-[#f59e0b]/30">
                Amma Inspection Report
              </div>
              
              <div className="mb-4">
                <div className="text-xs text-[#64748b] uppercase tracking-wide mb-2">Amma Approval Score</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-4 bg-[#e5e7eb] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#f59e0b] to-[#ea580c] rounded-full transition-all"
                      style={{ width: `${ammaVerdict.approvalScore}%` }}
                    />
                  </div>
                  <div className="font-mono text-xl font-bold text-[#f59e0b]">
                    {ammaVerdict.approvalScore.toFixed(1)}%
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-[#64748b] uppercase tracking-wide mb-2">
                  Maternal Verdict ({ammaLanguage === 'malayalam' ? 'മലയാളം' : ammaLanguage === 'manglish' ? 'Manglish' : 'English'})
                </div>
                <div className="bg-white rounded-lg p-4 border border-[#f59e0b]/20">
                  <p className="text-sm leading-relaxed text-[#0c0e12]">
                    {ammaVerdict.verdict}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certification Section */}
      <div className="bg-gradient-to-r from-[#f59e0b]/10 to-[#ea580c]/10 border-2 border-[#f59e0b] rounded-xl p-6 mb-8">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            {/* Wax Seal */}
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#b91c1c] to-[#7f1d1d] shadow-lg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-xs font-mono leading-tight">
                    CERTIFIED
                    <br />
                    SPECIMEN
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-[#991b1b] opacity-30" />
            </div>
          </div>

          <div className="flex-1">
            <div className="font-mono text-xs text-[#f59e0b] uppercase tracking-wider mb-3">
              Official Certification
            </div>
            <p className="text-sm text-[#0c0e12] leading-relaxed mb-4">
              This passport certifies that the referenced dosa specimen has undergone comprehensive circularity analysis 
              using calibrated optical metrology systems and deterministic geometric algorithms. Analysis performed 
              entirely client-side using local U-2-Net neural segmentation.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-[#64748b]">Analysis Status:</span>
                <span className="ml-2 font-mono text-[#10b981] font-bold">COMPLETE</span>
              </div>
              <div>
                <span className="text-[#64748b]">Calibration Ref:</span>
                <span className="ml-2 font-mono">ISO-DOSA-2024</span>
              </div>
              <div>
                <span className="text-[#64748b]">Nobel Prize:</span>
                <span className="ml-2 font-mono text-[#f59e0b]">PENDING</span>
              </div>
              <div>
                <span className="text-[#64748b]">Privacy:</span>
                <span className="ml-2 font-mono text-[#10b981]">CLIENT-SIDE ONLY</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="border-t-2 border-[#e5e7eb] pt-6">
        <div className="text-center">
          <div className="font-mono text-xs text-[#f59e0b] uppercase tracking-wider mb-3">
            Dosa Circularity Analyzer™
          </div>
          <p className="text-xs text-[#64748b] leading-relaxed max-w-3xl mx-auto">
            <strong>Satirical Disclaimer:</strong> This passport is a satirical digital artifact generated entirely in your browser. 
            It is not an actual food-safety, metrology, culinary, medical, or governmental certification. No dosa images were 
            uploaded to external servers. All analysis is performed locally. For entertainment purposes only. Maximum maternal authority. 
            Zero scientific validity. Nobel Prize genuinely pending.
          </p>
          <div className="mt-4 text-xs text-[#94a3b8] font-mono">
            © 2024 Dosa Circularity Analyzer™ • Printed: {formatDate()} {formatTime()}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline border-b border-[#f3f4f6] pb-2">
      <span className="text-[#64748b] text-xs">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </div>
  );
}
