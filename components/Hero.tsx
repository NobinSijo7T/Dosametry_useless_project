'use client';

import { useEffect, useState } from 'react';
import DosaCSSArt from './DosaCSSArt';
import { CreepyButton } from '@/components/ui/creepy-button';

export default function Hero() {
  const [specimenCount, setSpecimenCount] = useState(2847391);

  useEffect(() => {
    const interval = setInterval(() => {
      setSpecimenCount(prev => prev + Math.floor(Math.random() * 2) + 1);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="home" className="relative z-[1] min-h-[85vh] flex flex-col justify-center px-6 lg:px-12 pt-28 pb-16 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Authoritative Academic Headline & Telemetry */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6">
          <h1 className="font-marcellus text-4xl sm:text-5xl lg:text-6xl font-normal text-[#fdfbf7] tracking-tight leading-[1.1]">
            National Directorate for Dosa Circularity.
          </h1>

          <p className="text-base sm:text-lg text-[#94a3b8] max-w-[560px] leading-relaxed font-light">
            Evaluating the radial perfection of South Indian dosas through sub-millimeter polar metrology and maternal heuristics.
          </p>

          {/* Minimal Telemetry Divider Strip */}
          <div className="flex items-center gap-6 sm:gap-8 py-2">
            <div>
              <span className="block font-mono text-xl sm:text-2xl font-bold text-[#f59e0b]" suppressHydrationWarning>
                {specimenCount.toLocaleString('en-IN')}
              </span>
              <span className="block text-[0.68rem] font-mono text-[#64748b] uppercase tracking-wider mt-0.5">
                Inspected
              </span>
            </div>

            <div className="h-8 w-px bg-[rgba(253,251,247,0.1)]" />

            <div>
              <span className="block font-mono text-xl sm:text-2xl font-bold text-[#fdfbf7]">
                0
              </span>
              <span className="block text-[0.68rem] font-mono text-[#64748b] uppercase tracking-wider mt-0.5">
                Platonic Ideals
              </span>
            </div>

            <div className="h-8 w-px bg-[rgba(253,251,247,0.1)]" />

            <div>
              <span className="block font-mono text-xl sm:text-2xl font-bold text-[#ef4444]">
                99.8%
              </span>
              <span className="block text-[0.68rem] font-mono text-[#64748b] uppercase tracking-wider mt-0.5">
                Amma Skepticism
              </span>
            </div>
          </div>

          {/* Single Primary Action */}
          <div className="pt-2">
            <CreepyButton
              onClick={() => {
                document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-xl min-h-[52px]"
              coverClassName="bg-[#f59e0b] hover:bg-[#d97706] text-[#0c0e12] font-semibold text-sm tracking-wide flex items-center justify-center gap-3 px-8 py-4 shadow-[0_4px_24px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_32px_rgba(245,158,11,0.4)]"
            >
              <span>Initiate Specimen Analysis</span>
              <span className="text-lg font-bold">→</span>
            </CreepyButton>
          </div>
        </div>

        {/* Right Column: High-Precision Metrology Reticle Showcase */}
        <div className="lg:col-span-6 xl:col-span-5 flex justify-center items-center">
          <DosaCSSArt />
        </div>
      </div>
    </header>
  );
}
