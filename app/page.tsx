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
      <Hero />
      <Ticker />
      <Analyzer />
      
      {/* Footer placeholder - add other sections as needed */}
      <footer className="relative z-[1] bg-[#080b14] border-t border-[rgba(255,255,255,0.07)] py-16 px-[5%] text-center">
        <div className="font-orbitron text-2xl text-[#f59e0b] mb-2 flex items-center justify-center gap-2">
          <span className="inline-block animate-spin-slow">◎</span>
          <span>DCA™</span>
        </div>
        <p className="text-[#8b98b0] mb-6 italic">Making Dosa Science Great Again.</p>
        <div className="flex flex-wrap gap-6 justify-center mb-8 text-sm">
          <a href="#" className="text-[#4a5568] hover:text-[#f59e0b] transition-colors">Privacy Policy</a>
          <a href="#" className="text-[#4a5568] hover:text-[#f59e0b] transition-colors">Terms of Service</a>
          <a href="#" className="text-[#4a5568] hover:text-[#f59e0b] transition-colors">Nobel Committee Submission</a>
          <a href="#" className="text-[#4a5568] hover:text-[#f59e0b] transition-colors">Cookie Policy (Sambar Flavored)</a>
        </div>
        <p className="text-xs text-[#4a5568] max-w-[700px] mx-auto leading-relaxed">
          © 2024 Dosa Circularity Analyzer™. All rights reserved. No dosas were harmed in the making of this website 
          (several were consumed). This tool is for entertainment purposes only. Not responsible for family arguments, 
          damaged self-esteem, or wasted batches of dosa batter.
        </p>
      </footer>
    </>
  );
}
