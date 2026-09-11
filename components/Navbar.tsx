'use client';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 lg:px-12 py-4 bg-[#0c0e12]/85 backdrop-blur-md border-b border-[rgba(253,251,247,0.08)]">
      {/* Directorate Emblem & Brand */}
      <a href="#" className="flex items-center gap-3.5 group text-left">
        <div className="relative w-9 h-9 flex items-center justify-center border border-[rgba(253,251,247,0.2)] rounded-full bg-[#151922] group-hover:border-[#f59e0b] transition-colors">
          <svg className="w-5 h-5 text-[#f59e0b] animate-spin-slow" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
            <circle cx="50" cy="50" r="42" strokeDasharray="6 4" />
            <circle cx="50" cy="50" r="28" />
            <circle cx="50" cy="50" r="14" strokeDasharray="3 3" />
            <line x1="50" y1="4" x2="50" y2="96" strokeWidth="1.5" />
            <line x1="4" y1="50" x2="96" y2="50" strokeWidth="1.5" />
          </svg>
        </div>
        <div>
          <div className="font-marcellus text-base tracking-wider text-[#fdfbf7] flex items-center gap-1.5">
            <span>Dosa Metrology Directorate</span>
            <span className="text-[0.65rem] font-mono px-1.5 py-0.5 rounded bg-[rgba(245,158,11,0.15)] text-[#f59e0b] border border-[rgba(245,158,11,0.3)]">DMD-LAB</span>
          </div>
          <div className="text-[0.68rem] tracking-widest text-[#94a3b8] uppercase font-mono">
            National Standards of Circularity
          </div>
        </div>
      </a>

      {/* Navigation Links */}
      <ul className="hidden md:flex items-center list-none gap-8 font-sans">
        <li>
          <a href="#analyzer" className="text-sm text-[#94a3b8] hover:text-[#fdfbf7] transition-colors tracking-wide">
            Calibration Bay
          </a>
        </li>


        <li>
          <a href="#charter" className="text-sm text-[#94a3b8] hover:text-[#fdfbf7] transition-colors tracking-wide">
            Charter
          </a>
        </li>
      </ul>

      {/* Official Status Seal Badge */}
      <div className="flex items-center gap-2.5 font-mono text-[0.72rem] bg-[#141720] border border-[rgba(253,251,247,0.1)] px-3 py-1.5 rounded-lg text-[#fdfbf7]">
        <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
        <span className="hidden sm:inline text-[#94a3b8]">CALIBRATION:</span>
        <span className="text-[#f59e0b] font-semibold">CLASS 0 (ACTIVE)</span>
      </div>
    </nav>
  );
}
