'use client';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 py-4 bg-[rgba(8,11,20,0.8)] backdrop-blur-[16px] border-b border-[rgba(255,255,255,0.07)]">
      <div className="flex items-center gap-2 font-orbitron text-xl font-bold text-[#f59e0b]">
        <span className="text-2xl inline-block animate-spin-slow">◎</span>
        <span className="logo-text">DCA<sup>™</sup></span>
      </div>
      <ul className="hidden md:flex list-none gap-8">
        <li><a href="#analyzer" className="text-sm text-[#8b98b0] hover:text-[#f59e0b] transition-colors tracking-wide">Analyze</a></li>
        <li><a href="#science" className="text-sm text-[#8b98b0] hover:text-[#f59e0b] transition-colors tracking-wide">The Science</a></li>
        <li><a href="#leaderboard" className="text-sm text-[#8b98b0] hover:text-[#f59e0b] transition-colors tracking-wide">Hall of Fame</a></li>
        <li><a href="#about" className="text-sm text-[#8b98b0] hover:text-[#f59e0b] transition-colors tracking-wide">About</a></li>
      </ul>
      <div className="font-mono text-[0.7rem] bg-[rgba(245,158,11,0.1)] border border-[#f59e0b] text-[#f59e0b] px-3 py-1 rounded-full">
        v3.14 GOLDEN
      </div>
    </nav>
  );
}
