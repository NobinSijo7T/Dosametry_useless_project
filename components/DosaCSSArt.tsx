'use client';

export default function DosaCSSArt() {
  const polarTicks = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-[540px] mx-auto p-4 select-none">
      {/* Kolam Geometric Corner Registration Marks */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[rgba(253,251,247,0.25)] flex items-start justify-start p-1">
        <span className="font-mono text-[0.6rem] text-[#94a3b8] leading-none">0,0</span>
      </div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[rgba(253,251,247,0.25)] flex items-start justify-end p-1">
        <span className="font-mono text-[0.6rem] text-[#94a3b8] leading-none">+X</span>
      </div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[rgba(253,251,247,0.25)] flex items-end justify-start p-1">
        <span className="font-mono text-[0.6rem] text-[#94a3b8] leading-none">-Y</span>
      </div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[rgba(253,251,247,0.25)] flex items-end justify-end p-1">
        <span className="font-mono text-[0.6rem] text-[#94a3b8] leading-none">REF</span>
      </div>

      {/* SVG Polar Reticle Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 500">
        <defs>
          <radialGradient id="tawa-bed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e222d" />
            <stop offset="65%" stopColor="#141720" />
            <stop offset="92%" stopColor="#0c0e12" />
            <stop offset="100%" stopColor="#252b38" />
          </radialGradient>
          <linearGradient id="gold-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Outer Seasoned Cast Iron Tawa Disk */}
        <circle cx="250" cy="250" r="236" fill="url(#tawa-bed)" stroke="rgba(253,251,247,0.12)" strokeWidth="2" />
        <circle cx="250" cy="250" r="230" fill="none" stroke="rgba(245,158,11,0.1)" strokeWidth="1" strokeDasharray="4 4" />

        {/* Concentric Polar Metrology Rings */}
        <circle cx="250" cy="250" r="190" fill="none" stroke="rgba(253,251,247,0.08)" strokeWidth="1" />
        <circle cx="250" cy="250" r="145" fill="none" stroke="url(#gold-stroke)" strokeWidth="1.5" />
        <circle cx="250" cy="250" r="95" fill="none" stroke="rgba(253,251,247,0.08)" strokeWidth="1" strokeDasharray="2 4" />
        <circle cx="250" cy="250" r="45" fill="none" stroke="rgba(253,251,247,0.06)" strokeWidth="1" />

        {/* Crosshair Axes */}
        <line x1="25" y1="250" x2="475" y2="250" stroke="rgba(253,251,247,0.12)" strokeWidth="1" strokeDasharray="6 6" />
        <line x1="250" y1="25" x2="250" y2="475" stroke="rgba(253,251,247,0.12)" strokeWidth="1" strokeDasharray="6 6" />

        {/* Diagonal Ray Spokes */}
        <line x1="91" y1="91" x2="409" y2="409" stroke="rgba(253,251,247,0.05)" strokeWidth="1" />
        <line x1="91" y1="409" x2="409" y2="91" stroke="rgba(253,251,247,0.05)" strokeWidth="1" />

        {/* Polar Degree Markings */}
        {polarTicks.map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 250 + Math.cos(rad) * 224;
          const y1 = 250 + Math.sin(rad) * 224;
          const x2 = 250 + Math.cos(rad) * 236;
          const y2 = 250 + Math.sin(rad) * 236;
          const textX = 250 + Math.cos(rad) * 212;
          const textY = 250 + Math.sin(rad) * 212 + 3;

          return (
            <g key={deg}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(253,251,247,0.3)" strokeWidth="1.5" />
              <text
                x={textX}
                y={textY}
                textAnchor="middle"
                fontSize="8"
                fontFamily="'Inconsolata', monospace"
                fill="rgba(253,251,247,0.4)"
              >
                {deg}°
              </text>
            </g>
          );
        })}

        {/* Archimedean Batter Spiral Vortex Vector */}
        <path
          d="M 250 250 
             Q 265 240 270 255 
             Q 280 275 255 285 
             Q 220 290 220 255 
             Q 215 210 260 205 
             Q 320 205 325 270 
             Q 330 340 245 350
             Q 150 350 145 245"
          fill="none"
          stroke="rgba(245,158,11,0.35)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* Precision Vernier Dimension Leader Lines */}
        <g stroke="rgba(245,158,11,0.7)" strokeWidth="1">
          <line x1="105" y1="250" x2="105" y2="135" />
          <line x1="395" y1="250" x2="395" y2="135" />
          <line x1="100" y1="140" x2="400" y2="140" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
          <text
            x="250"
            y="132"
            textAnchor="middle"
            fontSize="10"
            fontFamily="'Inconsolata', monospace"
            fill="#f59e0b"
            fontWeight="bold"
          >
            Ø 274.8 mm ± 0.08 mm
          </text>
        </g>
      </svg>

      {/* Specimen Dosa Image */}
      <div className="relative w-[58%] aspect-square rounded-full flex items-center justify-center animate-tawa-simmer">
        {/* Dosa Body: Pristine Fully Rounded Golden Roast Dosa */}
        <div className="w-full h-full rounded-full shadow-[0_6px_36px_rgba(0,0,0,0.9)] border-2 border-[#f59e0b]/40 relative overflow-hidden">
          <img
            src="/round-dosa.png"
            alt="Fully rounded South Indian golden roast dosa specimen"
            className="w-full h-full object-cover rounded-full select-none pointer-events-none"
          />
          {/* Subtle golden ambient rim highlight */}
          <div className="absolute inset-0 rounded-full border border-[rgba(245,158,11,0.2)] pointer-events-none" />
        </div>

        {/* Laser Interferometry Overlay Reticle */}
        <div className="absolute inset-[-6px] rounded-full border border-[#f59e0b]/50 pointer-events-none animate-reticle-breathe" />
        <div className="absolute inset-[-14px] rounded-full border border-dashed border-[#f59e0b]/25 pointer-events-none animate-spin-slow" />
      </div>

      {/* Official Vermilion Wax Seal Stamp (Lower Right) */}
      <div className="absolute bottom-4 right-4 wax-seal-badge w-20 h-20 rounded-full flex flex-col items-center justify-center p-1 text-center shadow-2xl border border-[rgba(254,202,202,0.4)] transform rotate-6 hover:rotate-0 transition-transform">
        <span className="font-mono text-[0.5rem] tracking-wider text-[#fee2e2] uppercase">DIRECTORATE</span>
        <span className="font-marcellus text-[0.75rem] font-bold text-[#fef2f2] leading-tight my-0.5">CLASS 0</span>
        <span className="font-mono text-[0.45rem] tracking-widest text-[#fecaca] uppercase">VERIFIED</span>
      </div>

      {/* Metrology Specimen Tag (Bottom Center) */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-mono text-[0.72rem] bg-[#12151c] border border-[rgba(253,251,247,0.15)] text-[#fdfbf7] px-4 py-1 rounded shadow-lg flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
        <span>SPECIMEN #π-0984</span>
        <span className="text-[#f59e0b] font-bold">98.4% CIRCULAR</span>
      </div>
    </div>
  );
}
