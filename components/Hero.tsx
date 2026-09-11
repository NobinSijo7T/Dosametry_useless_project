'use client';

import { useEffect, useState } from 'react';
import DosaCSSArt from './DosaCSSArt';

export default function Hero() {
  const [dosaCount, setDosaCount] = useState(2847391);

  useEffect(() => {
    const interval = setInterval(() => {
      setDosaCount(prev => prev + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative z-[1] min-h-screen grid grid-cols-1 md:grid-cols-2 items-center gap-16 px-[5%] pt-32 pb-16 max-w-[1400px] mx-auto">
      <div className="hero-content">
        <div className="inline-block bg-gradient-to-r from-[rgba(245,158,11,0.2)] to-[rgba(234,88,12,0.2)] border border-[rgba(245,158,11,0.4)] text-[#f59e0b] px-5 py-1.5 rounded-full text-sm font-mono mb-6 animate-pulse-badge">
          🏆 World's #1 Dosa Analysis Platform
        </div>
        <h1 className="font-orbitron text-[clamp(3rem,6vw,5.5rem)] leading-[1.05] font-black tracking-tight mb-6">
          <span className="block">Dosa</span>
          <span className="block bg-gradient-to-r from-[#f59e0b] to-[#ea580c] bg-clip-text text-transparent">Circularity</span>
          <span className="block">Analyzer<sup>™</sup></span>
        </h1>
        <p className="text-lg text-[#8b98b0] mb-8 max-w-[520px] leading-7">
          Powered by <strong className="text-[#e2e8f0]">AI</strong>, <strong className="text-[#e2e8f0]">Machine Learning</strong>, <strong className="text-[#e2e8f0]">Deep Learning</strong>, 
          <strong className="text-[#e2e8f0]"> Blockchain</strong>, and <strong className="text-[#e2e8f0]">the tears of disappointed grandmothers</strong>.
        </p>
        <div className="flex gap-4 mb-8 flex-wrap">
          <div className="bg-[#111827] border border-[rgba(255,255,255,0.07)] rounded-xl px-5 py-3 text-center">
            <span className="block font-orbitron text-xl text-[#f59e0b] font-bold">{dosaCount.toLocaleString('en-IN')}</span>
            <span className="block text-[0.7rem] text-[#8b98b0] uppercase tracking-wider mt-0.5">Dosas Analyzed</span>
          </div>
          <div className="bg-[#111827] border border-[rgba(255,255,255,0.07)] rounded-xl px-5 py-3 text-center">
            <span className="block font-orbitron text-xl text-[#f59e0b] font-bold">0</span>
            <span className="block text-[0.7rem] text-[#8b98b0] uppercase tracking-wider mt-0.5">Perfect Circles Found</span>
          </div>
          <div className="bg-[#111827] border border-[rgba(255,255,255,0.07)] rounded-xl px-5 py-3 text-center">
            <span className="block font-orbitron text-xl text-[#f59e0b] font-bold">∞</span>
            <span className="block text-[0.7rem] text-[#8b98b0] uppercase tracking-wider mt-0.5">Amma Disappointments</span>
          </div>
        </div>
        <a 
          href="#analyzer" 
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-black font-orbitron font-bold text-sm px-8 py-4 rounded-xl tracking-wider transition-all hover:-translate-y-1 shadow-[0_4px_20px_rgba(245,158,11,0.4)] hover:shadow-[0_8px_32px_rgba(245,158,11,0.6)]"
        >
          <span>Analyze My Dosa</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </a>
        <p className="text-[0.72rem] text-[#4a5568] mt-3 italic">
          * Results may cause existential dread. Not liable for dosa-related emotional damage.
        </p>
      </div>

      <DosaCSSArt />
    </header>
  );
}
