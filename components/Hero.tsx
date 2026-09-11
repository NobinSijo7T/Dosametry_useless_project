'use client';

import { useEffect, useState } from 'react';
import DosaCSSArt from './DosaCSSArt';

export default function Hero() {
  const [specimenCount, setSpecimenCount] = useState(2847391);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpecimenCount(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative z-[1] min-h-[90vh] flex flex-col justify-center px-6 lg:px-12 pt-32 pb-16 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Authoritative Academic Headline & Telemetry */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-8">
          <h1 className="font-marcellus text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-normal text-[#fdfbf7] tracking-tight leading-[1.08]">
            National Directorate for Dosa Circularity.
          </h1>

          <p className="text-lg sm:text-xl text-[#94a3b8] max-w-[620px] leading-relaxed font-light">
            Applying sub-millimeter polar coordinate metrology, fluid vortex dynamics, and matriarchal heuristic modeling to evaluate the radial perfection of South Indian dosas.
          </p>

          {/* Calibrated Laboratory Telemetry Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-[560px]">
            <div className="bg-[#141720] border border-[rgba(253,251,247,0.1)] rounded-xl p-4 text-left shadow-sm">
              <span className="block font-mono text-xl sm:text-2xl font-bold text-[#f59e0b]">
                {specimenCount.toLocaleString('en-IN')}
              </span>
              <span className="block text-[0.7rem] font-mono text-[#94a3b8] uppercase tracking-wider mt-1">
                Specimens Inspected
              </span>
            </div>

            <div className="bg-[#141720] border border-[rgba(253,251,247,0.1)] rounded-xl p-4 text-left shadow-sm">
              <span className="block font-mono text-xl sm:text-2xl font-bold text-[#fdfbf7]">
                0
              </span>
              <span className="block text-[0.7rem] font-mono text-[#94a3b8] uppercase tracking-wider mt-1">
                Platonic Ideals
              </span>
            </div>

            <div className="bg-[#141720] border border-[rgba(253,251,247,0.1)] rounded-xl p-4 text-left shadow-sm">
              <span className="block font-mono text-xl sm:text-2xl font-bold text-[#b91c1c]">
                99.8%
              </span>
              <span className="block text-[0.7rem] font-mono text-[#94a3b8] uppercase tracking-wider mt-1">
                Amma Skepticism
              </span>
            </div>
          </div>

          {/* Action Bay */}
          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="#analyzer"
              className="inline-flex items-center gap-3 bg-[#f59e0b] hover:bg-[#d97706] text-[#0c0e12] font-semibold text-sm px-8 py-4 rounded-xl transition-all shadow-[0_4px_24px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_32px_rgba(245,158,11,0.4)] tracking-wide"
            >
              <span>Initiate Specimen Analysis</span>
              <span className="text-lg font-bold">→</span>
            </a>

            <a
              href="#ticker"
              className="inline-flex items-center gap-2 text-sm text-[#94a3b8] hover:text-[#fdfbf7] px-6 py-4 rounded-xl border border-[rgba(253,251,247,0.12)] hover:border-[rgba(253,251,247,0.3)] transition-all font-mono"
            >
              <span>View Metrology Bulletin</span>
            </a>
          </div>

          <p className="text-xs text-[#64748b] font-mono leading-relaxed pt-2">
            * Calibrated under ISO/IEC 17025 satirical standards. All calculations executed via deterministic pseudo-random seed sequences.
          </p>
        </div>

        {/* Right Column: High-Precision Metrology Reticle Showcase */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center items-center">
          <DosaCSSArt />
        </div>
      </div>
    </header>
  );
}
