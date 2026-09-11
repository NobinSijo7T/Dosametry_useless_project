export default function Ticker() {
  const messages = [
    '🔬 BREAKING: Local man\'s dosa achieves 73.2% circularity — family in shock',
    '⚠️ WARNING: Elliptical dosas have been linked to bad vibes and soggy chutneys',
    '📊 STUDY: 99.7% of dosa-related trauma stems from non-circular specimens',
    '🏅 Amma wins 47th consecutive DCA Gold Medal with her legendary 99.1% circle score',
    '🤖 Our AI model trained on 3 million dosas, 2 million sambar disasters',
    '💡 FUN FACT: The universe itself is not perfectly circular. Neither is your dosa.',
  ];

  return (
    <div className="relative z-[2] bg-gradient-to-r from-[#f59e0b] to-[#ea580c] py-2.5 overflow-hidden">
      <div className="flex gap-16 whitespace-nowrap animate-ticker text-sm font-medium text-black font-mono">
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="flex-shrink-0">{msg}</span>
        ))}
      </div>
    </div>
  );
}
