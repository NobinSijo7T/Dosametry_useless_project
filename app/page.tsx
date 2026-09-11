import ParticleCanvas from '@/components/ParticleCanvas';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import Analyzer from '@/components/Analyzer';

export default function Home() {
  return (
    <>
      <ParticleCanvas />
      <Navbar />
      <main className="relative">
        <Hero />
        <Ticker />
        <Analyzer />
      </main>

      {/* Directorate Footer & Legal Charter */}
      <footer id="charter" className="relative z-[1] bg-[#090b0e] border-t border-[rgba(253,251,247,0.08)] py-16 px-6 lg:px-12 text-center">
        <div className="max-w-[800px] mx-auto space-y-6">
          <div className="flex items-center justify-center gap-3 font-marcellus text-2xl text-[#fdfbf7]">
            <span className="text-[#f59e0b]">◎</span>
            <span>National Metrology Directorate for Dosa Circularity</span>
          </div>

          <p className="text-sm font-light text-[#94a3b8] italic">
            &ldquo;Advancing Culinary Perfection Through Relentless Polar Calibration.&rdquo;
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-mono text-[#94a3b8] pt-2">
            <a href="#charter" className="hover:text-[#f59e0b] transition-colors">Metrology Charter</a>
            <a href="#charter" className="hover:text-[#f59e0b] transition-colors">Nobel Committee Submission</a>
            <a href="#charter" className="hover:text-[#f59e0b] transition-colors">Amma Dispute Tribunal</a>
            <a href="#charter" className="hover:text-[#f59e0b] transition-colors">Sambar Viscosity Protocol</a>
          </div>

          <div className="pt-6 border-t border-[rgba(253,251,247,0.06)] text-[0.72rem] text-[#64748b] leading-relaxed font-mono">
            © 2024–2026 National Metrology Directorate for Dosa Circularity™. All rights reserved. 
            All circularity indices, hydrodynamic vortices, and matriarchal verdicts are generated purely for satire and entertainment. 
            The Directorate accepts no legal liability for ruined breakfasts, damaged self-worth, or burnt cast-iron pans.
          </div>
        </div>
      </footer>
    </>
  );
}
