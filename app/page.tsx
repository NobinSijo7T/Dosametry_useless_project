import ParticleCanvas from '@/components/ParticleCanvas';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Analyzer from '@/components/Analyzer';

export default function Home() {
  return (
    <>
      <ParticleCanvas />
      <Navbar />
      <main className="relative">
        <Hero />
        <Analyzer />
      </main>

      {/* Minimal Footer */}
      <footer id="charter" className="relative z-[1] border-t border-[rgba(253,251,247,0.06)] py-6 px-6 lg:px-12 bg-[#0a0c10]">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#64748b]">
          <div className="flex items-center gap-2">
            <span className="text-[#f59e0b]">◎</span>
            <span className="font-marcellus text-sm text-[#fdfbf7] tracking-wide">
              National Metrology Directorate for Dosa Circularity
            </span>
          </div>
          <p className="text-[0.72rem] text-[#64748b]">
            © 2026 • Satirical Culinary Metrology
          </p>
        </div>
      </footer>
    </>
  );
}
