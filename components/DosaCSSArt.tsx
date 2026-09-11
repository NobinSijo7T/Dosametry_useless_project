export default function DosaCSSArt() {
  return (
    <div className="relative flex items-center justify-center w-full aspect-square max-w-[480px] mx-auto">
      {/* Orbit rings */}
      <div className="absolute w-[85%] h-[85%] border border-[rgba(245,158,11,0.15)] rounded-full animate-orbit-20s" />
      <div className="absolute w-[95%] h-[95%] border border-dashed border-[rgba(245,158,11,0.08)] rounded-full animate-orbit-35s-reverse" />
      <div className="absolute w-full h-full border border-[rgba(234,88,12,0.05)] rounded-full animate-orbit-50s" />

      {/* Dosa */}
      <div className="relative w-[70%] aspect-square rounded-[50%_48%_52%_49%/51%_47%_53%_50%] bg-dosa-gradient shadow-dosa animate-dosa-float-wobble">
        {/* Bubbles */}
        <div className="absolute inset-0 rounded-[inherit] overflow-hidden">
          <div className="absolute w-[20%] h-[20%] top-[20%] left-[25%] rounded-full bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.2)]" />
          <div className="absolute w-[12%] h-[12%] top-[55%] left-[55%] rounded-full bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.2)]" />
          <div className="absolute w-[16%] h-[16%] top-[30%] left-[60%] rounded-full bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.2)]" />
          <div className="absolute w-[8%] h-[8%] top-[65%] left-[25%] rounded-full bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.2)]" />
          <div className="absolute w-[10%] h-[10%] top-[45%] left-[35%] rounded-full bg-[rgba(255,255,255,0.15)] border border-[rgba(255,255,255,0.2)]" />
          {/* Crispy edge */}
          <div className="absolute inset-[-2px] rounded-full border-2 border-[rgba(200,120,20,0.6)]" />
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 font-mono text-[0.7rem] text-[#f59e0b] whitespace-nowrap opacity-70">
          SPECIMEN #π
        </div>
      </div>

      {/* Measurement lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute h-px top-1/2 left-[5%] right-[5%] bg-[rgba(245,158,11,0.3)]" />
        <div className="absolute w-px left-1/2 top-[5%] bottom-[5%] bg-[rgba(245,158,11,0.3)]" />
        <div className="absolute w-3 h-3 top-[12%] left-[12%] border-t-2 border-l-2 border-[#f59e0b] opacity-50" />
        <div className="absolute w-3 h-3 top-[12%] right-[12%] border-t-2 border-r-2 border-[#f59e0b] opacity-50" />
        <div className="absolute w-3 h-3 bottom-[12%] left-[12%] border-b-2 border-l-2 border-[#f59e0b] opacity-50" />
        <div className="absolute w-3 h-3 bottom-[12%] right-[12%] border-b-2 border-r-2 border-[#f59e0b] opacity-50" />
      </div>
    </div>
  );
}
