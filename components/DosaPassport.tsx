'use client';

import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return createPortal(
    <div
      id="dosa-passport-modal-root"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm print:p-0 print:static print:bg-white print:z-auto print:block"
    >
      <div className="bg-[#0c0e12] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border border-[rgba(253,251,247,0.15)] shadow-2xl print:border-none print:shadow-none print:max-h-none print:overflow-visible print:max-w-none print:static print:bg-white">
        {/* Top Control Bar - strictly no-print */}
        <div className="no-print flex items-center justify-between p-4 sm:p-5 border-b border-[rgba(253,251,247,0.1)] bg-[#12151c] sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-[#f59e0b] font-mono text-xs sm:text-sm font-semibold tracking-wider">
              ◎ OFFICIAL SPECIMEN PASSPORT
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrint}
              className="py-2.5 px-5 bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] text-[#0c0e12] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg font-mono uppercase tracking-wider flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span>🖨️</span>
              <span>Print / Save as PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-[#181c25] hover:bg-[#ef4444] text-[#fdfbf7] flex items-center justify-center transition-colors text-base font-bold cursor-pointer"
              aria-label="Close passport"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Passport Content - Printable */}
        <div ref={passportRef} id="dosa-passport" className="passport-content bg-white text-black print:block">
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
    </div>,
    document.body
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
    <div className="bg-[#fdfbf7] text-[#0c0e12] p-6 sm:p-8 passport-page flex flex-col justify-between">
      {/* Header */}
      <div className="text-center border-b-2 border-[#f59e0b] pb-2.5 mb-3.5">
        <div className="font-mono text-[0.62rem] tracking-[0.3em] text-[#94a3b8] mb-0.5">
          REPUBLIC OF SOUTH INDIA
        </div>
        <h1 className="font-marcellus text-2xl mb-0.5 tracking-tight">
          NATIONAL METROLOGY DIRECTORATE
        </h1>
        <h2 className="font-marcellus text-base text-[#f59e0b] mb-0.5">
          FOR DOSA CIRCULARITY
        </h2>
        <div className="flex items-center justify-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] text-[#64748b]">
          <span>◎</span>
          <span>OFFICIAL SPECIMEN PASSPORT</span>
          <span>◎</span>
        </div>
      </div>

      {/* Specimen Information */}
      <div className="grid grid-cols-2 gap-3.5 mb-3">
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          <div className="bg-[#fff] border border-[#f59e0b] rounded-lg p-3">
            <div className="font-mono text-[0.65rem] text-[#f59e0b] uppercase tracking-wider mb-2 font-bold">
              Specimen Identification
            </div>
            
            <div className="space-y-2">
              <div>
                <div className="text-[0.62rem] text-[#64748b] uppercase tracking-wide">Specimen ID</div>
                <div className="font-mono text-base font-bold text-[#0c0e12]">
                  {result.specimenId || 'DOSA-0000-0000'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[0.62rem] text-[#64748b] uppercase tracking-wide">Date</div>
                  <div className="font-mono text-xs font-medium">{formatDate()}</div>
                </div>
                <div>
                  <div className="text-[0.62rem] text-[#64748b] uppercase tracking-wide">Time</div>
                  <div className="font-mono text-xs font-medium">{formatTime()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#f3f4f6]">
                <div>
                  <div className="text-[0.62rem] text-[#64748b] uppercase tracking-wide">Classification</div>
                  <div className={`font-bold text-xs truncate ${getClassificationColor()}`}>
                    {result.verdict.title}
                  </div>
                </div>
                <div>
                  <div className="text-[0.62rem] text-[#64748b] uppercase tracking-wide">Grade</div>
                  <div className="font-mono text-base font-bold text-[#f59e0b]">
                    {result.verdict.grade}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrology Results */}
          <div className="bg-[#fff] border border-[#e5e7eb] rounded-lg p-3">
            <div className="font-mono text-[0.65rem] text-[#f59e0b] uppercase tracking-wider mb-2 pb-1 border-b border-[#e5e7eb] font-bold">
              Metrology Results
            </div>
            
            <div className="space-y-1.5 text-xs">
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

        {/* Right Column - Specimen Image & Amma Inspection */}
        <div className="flex flex-col gap-3">
          <div className="bg-[#fff] border border-[#f59e0b] rounded-lg p-2.5">
            <div className="font-mono text-[0.65rem] text-[#f59e0b] uppercase tracking-wider mb-1.5 font-bold">
              Specimen Image
            </div>
            <div className="h-28 bg-[#f8f9fa] rounded-md overflow-hidden border border-[#e5e7eb] flex items-center justify-center">
              {result.originalImageUrl ? (
                <img
                  src={result.originalImageUrl}
                  alt="Dosa specimen"
                  className="w-full h-full object-contain p-1"
                />
              ) : (
                <div className="text-[#94a3b8] text-xs">No image available</div>
              )}
            </div>
            <div className="mt-1 text-center text-[0.62rem] text-[#64748b] font-mono">
              Captured specimen projection
            </div>
          </div>

          {/* Amma Inspection */}
          {ammaVerdict && (
            <div className="bg-gradient-to-br from-[#fff5e6] to-[#fff] border border-[#f59e0b] rounded-lg p-2.5">
              <div className="font-mono text-[0.65rem] text-[#f59e0b] uppercase tracking-wider mb-2 pb-1 border-b border-[#f59e0b]/30 font-bold">
                Amma Inspection Report
              </div>
              
              <div className="mb-2">
                <div className="flex items-center justify-between text-[0.62rem] text-[#64748b] uppercase tracking-wide mb-1">
                  <span>Amma Approval Score</span>
                  <span className="font-mono text-sm font-bold text-[#f59e0b]">
                    {ammaVerdict.approvalScore.toFixed(1)}%
                  </span>
                </div>
                <div className="h-2 bg-[#e5e7eb] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#f59e0b] to-[#ea580c] rounded-full transition-all"
                    style={{ width: `${ammaVerdict.approvalScore}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="text-[0.62rem] text-[#64748b] uppercase tracking-wide mb-1">
                  Maternal Verdict ({ammaLanguage === 'malayalam' ? <span className="font-gayathri font-bold text-xs">മലയാളം</span> : ammaLanguage === 'manglish' ? 'Manglish' : 'English'})
                </div>
                <div className="bg-white rounded-md p-2 border border-[#f59e0b]/30 shadow-xs">
                  <p
                    className={`text-xs leading-normal text-[#0c0e12] ${
                      ammaLanguage === 'malayalam' ? 'font-gayathri text-xs sm:text-sm font-normal tracking-wide' : ''
                    }`}
                    style={ammaLanguage === 'malayalam' ? { fontFamily: "'Gayathri', sans-serif" } : undefined}
                  >
                    {ammaVerdict.verdict}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certification Section */}
      <div className="bg-gradient-to-r from-[#f59e0b]/10 to-[#ea580c]/10 border border-[#f59e0b] rounded-lg p-3 mb-2.5">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {/* Wax Seal */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#b91c1c] to-[#7f1d1d] shadow-md flex items-center justify-center border-2 border-[#991b1b]">
              <div className="text-center text-white text-[0.55rem] font-mono leading-tight font-bold tracking-tight">
                CERTIFIED
                <br />
                SPECIMEN
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-mono text-[0.65rem] text-[#f59e0b] uppercase tracking-wider mb-1 font-bold">
              Official Certification
            </div>
            <p className="text-[0.68rem] text-[#0c0e12] leading-snug mb-2">
              This passport certifies that the referenced dosa specimen has undergone comprehensive circularity analysis 
              using calibrated optical metrology systems and deterministic geometric algorithms.
            </p>
            <div className="grid grid-cols-4 gap-2 text-[0.62rem] font-mono">
              <div>
                <span className="text-[#64748b]">Status:</span>
                <span className="ml-1 text-[#10b981] font-bold">COMPLETE</span>
              </div>
              <div>
                <span className="text-[#64748b]">Ref:</span>
                <span className="ml-1">ISO-DOSA-24</span>
              </div>
              <div>
                <span className="text-[#64748b]">Nobel:</span>
                <span className="ml-1 text-[#f59e0b] font-bold">PENDING</span>
              </div>
              <div>
                <span className="text-[#64748b]">Privacy:</span>
                <span className="ml-1 text-[#10b981]">CLIENT-SIDE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div className="border-t border-[#e5e7eb] pt-2 text-center">
        <div className="font-mono text-[0.62rem] text-[#f59e0b] uppercase tracking-wider mb-0.5">
          Dosa Circularity Analyzer™
        </div>
        <p className="text-[0.58rem] text-[#64748b] leading-tight max-w-2xl mx-auto">
          <strong>Satirical Disclaimer:</strong> This passport is a satirical digital artifact generated entirely in your browser. 
          Not an actual food-safety or governmental certification. Zero scientific validity. Nobel Prize genuinely pending.
        </p>
        <div className="mt-1 text-[0.55rem] text-[#94a3b8] font-mono">
          © 2026 Dosa Circularity Analyzer™ • Specimen Generated: {formatDate()} {formatTime()}
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
