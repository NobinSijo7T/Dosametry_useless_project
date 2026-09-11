'use client';

export default function Ticker() {
  const dispatches = [
    'DISPATCH [IISc BENGALURU]: High-speed thermal imaging reveals batter ladle swirl follows Archimedean spiral within 1.2% tolerance.',
    'ALERT [CHENNAI METROLOGY]: Sambar surface tension measured below critical dipping viscosity threshold in 14 commercial establishments.',
    'CIRCULAR 402/2024: Oblong dosas officially reclassified as "Geometrical Transgressions" under revised culinary penal code.',
    'STOCKHOLM COMMUNIQUE: Nobel Physics Committee requests additional batter fermentation viscosity logs before November convening.',
    'METROLOGICAL BULLETIN: Amma awarded 48th consecutive Directorate Class 0 Certification with legendary 99.4% circularity index.',
    'TAWA ADVISORY: Non-stick pans correlate with 87% increase in existential culinary shame. Cast-iron seasoning recommended.',
  ];

  return (
    <div id="ticker" className="relative z-[2] bg-[#11141c] border-y border-[rgba(253,251,247,0.12)] py-3 overflow-hidden select-none">
      <div className="flex items-center">
        {/* Left Badge: Stationary Dispatch Indicator */}
        <div className="hidden sm:flex items-center gap-2 px-6 py-1 bg-[#181c25] border-r border-[rgba(253,251,247,0.12)] z-10 text-[0.72rem] font-mono text-[#f59e0b] font-bold tracking-wider shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b] animate-ping" />
          <span>DIRECTORATE TELETYPE</span>
        </div>

        {/* Scrolling Teletype Stream */}
        <div className="flex gap-16 whitespace-nowrap animate-ticker text-xs sm:text-sm font-mono text-[#94a3b8]">
          {[...dispatches, ...dispatches].map((msg, i) => (
            <span key={i} className="flex items-center gap-3 shrink-0">
              <span className="text-[#f59e0b]">⚡</span>
              <span className="text-[#fdfbf7]">{msg}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
