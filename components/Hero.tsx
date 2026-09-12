'use client';

import DosaCSSArt from './DosaCSSArt';
import { CreepyButton } from '@/components/ui/creepy-button';

export default function Hero() {
  return (
    <header id="home" className="relative z-[1] min-h-[85vh] flex flex-col justify-center px-6 lg:px-12 pt-28 pb-16 max-w-[1440px] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Authoritative Academic Headline */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-6">
          <h1 className="font-marcellus text-4xl sm:text-5xl lg:text-6xl font-normal text-[#fdfbf7] tracking-tight leading-[1.1]">
            National Directorate for Dosa Circularity.
          </h1>

          <p className="font-gayathri text-lg sm:text-xl text-[#94a3b8] max-w-[560px] leading-[1.8] font-normal">
            ദോശ എത്ര വട്ടമുണ്ട്, എത്ര ക്രിസ്പിയാണ്, നിറം എത്ര കൃത്യമാണ് എന്നൊക്കെ നോക്കി, ഒരു നല്ല ദോശയുടെ യഥാർത്ഥ പൂർണ്ണത കണ്ടെത്താം.
          </p>

          {/* Single Primary Action */}
          <div className="pt-2">
            <CreepyButton
              onClick={() => {
                document.getElementById('analyzer')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-xl min-h-[56px] w-auto inline-flex"
              coverClassName="bg-[#f59e0b] hover:bg-[#d97706] text-[#0c0e12] font-bold text-base sm:text-lg tracking-wide flex items-center justify-center gap-3 px-8 py-4 shadow-[0_4px_24px_rgba(245,158,11,0.25)] hover:shadow-[0_6px_32px_rgba(245,158,11,0.4)] transition-all whitespace-nowrap"
            >
              <span className="font-gayathri font-bold text-xl sm:text-2xl tracking-wide whitespace-nowrap shrink-0" style={{ fontWeight: 700 }}>
                ദോശ പരിശോധിക്കാം
              </span>
              <span className="text-xl font-extrabold shrink-0">→</span>
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
