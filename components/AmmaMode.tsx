'use client';

import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import type { AmmaLanguage, AmmaVerdict } from '@/types';
import { getAvailableLanguages, generateAmmaVerdict } from '@/lib/ammaVerdict';

interface AmmaModeProps {
  circularity: number;
  roundness: string | number;
  jitter: string | number;
  diameter: number;
  onVerdictChange?: (verdict: AmmaVerdict, language: AmmaLanguage) => void;
}

export default function AmmaMode({
  circularity,
  roundness,
  jitter,
  diameter,
  onVerdictChange,
}: AmmaModeProps) {
  const [language, setLanguage] = useState<AmmaLanguage>('malayalam');
  const [verdict, setVerdict] = useState<AmmaVerdict | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const onVerdictChangeRef = useRef(onVerdictChange);
  onVerdictChangeRef.current = onVerdictChange;

  const languages = getAvailableLanguages();

  const handlePlayVerdict = async () => {
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      return;
    }
    if (!verdict?.verdict) return;

    setAudioLoading(true);
    try {
      const res = await fetch('/api/sarvam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'tts', text: verdict.verdict }),
      });
      const data = await res.json();
      if (data.audio) {
        const audioUrl = `data:audio/wav;base64,${data.audio}`;
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        } else {
          audioRef.current = new Audio(audioUrl);
        }

        audioRef.current.onended = () => setIsPlayingAudio(false);
        audioRef.current.onerror = () => setIsPlayingAudio(false);

        await audioRef.current.play();
        setIsPlayingAudio(true);
      }
    } catch (err) {
      console.error('Sarvam TTS error:', err);
    } finally {
      setAudioLoading(false);
    }
  };

  // Generate verdict when component mounts or language changes
  useEffect(() => {
    const newVerdict = generateAmmaVerdict(
      circularity,
      roundness,
      jitter,
      diameter,
      language
    );
    setVerdict(newVerdict);
    
    onVerdictChangeRef.current?.(newVerdict, language);

    // Restart animation
    setIsAnimating(true);
    setAnimatedScore(0);

    // Animate score
    const target = newVerdict.approvalScore;
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + 2, target);
      setAnimatedScore(current);
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(interval);
        setTimeout(() => setIsAnimating(false), 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [language, circularity, roundness, jitter, diameter]);

  if (!verdict) return null;

  const getCategoryColor = (category: AmmaVerdict['category']) => {
    switch (category) {
      case 'perfect':
        return 'from-[#10b981] to-[#059669]';
      case 'excellent':
        return 'from-[#f59e0b] to-[#d97706]';
      case 'acceptable':
        return 'from-[#3b82f6] to-[#2563eb]';
      case 'questionable':
        return 'from-[#f97316] to-[#ea580c]';
      case 'disaster':
        return 'from-[#ef4444] to-[#dc2626]';
      default:
        return 'from-[#64748b] to-[#475569]';
    }
  };

  const getCategoryEmoji = (category: AmmaVerdict['category']) => {
    switch (category) {
      case 'perfect':
        return '😭';
      case 'excellent':
        return '😌';
      case 'acceptable':
        return '🤷';
      case 'questionable':
        return '😤';
      case 'disaster':
        return '📵';
      default:
        return '🤔';
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#181c25] to-[#12151c] border border-[rgba(245,158,11,0.2)] rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#f59e0b] opacity-30 rounded-tl-2xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-[#f59e0b] opacity-30 rounded-tr-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-[#f59e0b] opacity-30 rounded-bl-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#f59e0b] opacity-30 rounded-br-2xl pointer-events-none" />

      {/* Header */}
      <div className="text-center mb-6 relative z-10">
        <div className="inline-block mb-2">
          <span className="font-mono text-[0.65rem] tracking-[0.2em] text-[#f59e0b] uppercase">
            Amma Inspection
          </span>
        </div>
        <h3 className="font-marcellus text-2xl text-[#fdfbf7] mb-1">
          Maternal Culinary Quality Assessment
        </h3>
        <p className="text-xs text-[#94a3b8] font-mono">
          Unofficial maternal assessment • Maximum maternal authority
        </p>
      </div>

      {/* Language Selector */}
      <div className="flex justify-center gap-2 mb-6 relative z-10">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => setLanguage(lang.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              language === lang.id
                ? 'bg-[#f59e0b] text-[#0c0e12] shadow-lg'
                : 'bg-[#0e1015] text-[#94a3b8] border border-[rgba(253,251,247,0.1)] hover:border-[#f59e0b] hover:text-[#fdfbf7]'
            } ${lang.id === 'malayalam' ? 'font-gayathri font-semibold text-base' : ''}`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Approval Score Meter */}
      <div className="mb-6 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs text-[#94a3b8] uppercase tracking-wider">
            Amma Approval
          </span>
          <span className={`font-mono text-2xl font-bold bg-gradient-to-r ${getCategoryColor(verdict.category)} bg-clip-text text-transparent`}>
            {animatedScore.toFixed(1)}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="relative h-3 bg-[#0e1015] rounded-full overflow-hidden border border-[rgba(253,251,247,0.1)]">
          <div
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getCategoryColor(verdict.category)} transition-all duration-1000 ease-out rounded-full`}
            style={{ width: `${animatedScore}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Verdict Card */}
      <div
        className={`relative bg-gradient-to-br ${getCategoryColor(verdict.category)} p-[1px] rounded-xl overflow-hidden transition-all duration-500 ${
          isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}
      >
        <div className="bg-[#0e1015] rounded-xl p-5 relative z-10">
          <div className="flex items-start gap-4">
            <div className="text-5xl flex-shrink-0 animate-pulse-slow">
              {getCategoryEmoji(verdict.category)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="font-mono text-xs text-[#f59e0b] uppercase tracking-wider">
                  Amma Verdict
                </div>
                {language === 'malayalam' && (
                  <button
                    type="button"
                    onClick={handlePlayVerdict}
                    disabled={audioLoading}
                    className="flex items-center gap-1.5 text-xs font-gayathri font-bold px-2.5 py-1 rounded-md bg-[#161a24] hover:bg-[#202736] border border-[#f59e0b]/30 text-[#f59e0b] transition-all cursor-pointer shadow-xs"
                    title="അമ്മയുടെ ശബ്ദത്തിൽ കേൾക്കാം"
                  >
                    {audioLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : isPlayingAudio ? (
                      <VolumeX className="w-3.5 h-3.5 text-[#ef4444]" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                    <span>{isPlayingAudio ? 'നിർത്തൂ' : 'ശബ്ദം കേൾക്കാം 🔊'}</span>
                  </button>
                )}
              </div>
              <p
                className={`text-[#fdfbf7] leading-relaxed ${
                  language === 'malayalam'
                    ? 'font-gayathri text-base sm:text-lg font-normal tracking-wide'
                    : 'text-sm'
                }`}
                style={{ 
                  fontFamily: language === 'malayalam' ? "'Gayathri', sans-serif" : 'inherit',
                  lineHeight: language === 'malayalam' ? '1.8' : '1.6'
                }}
              >
                {verdict.verdict}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Official Notice */}
      <div className="mt-4 text-center relative z-10">
        <p className="text-[0.7rem] text-[#64748b] italic">
          Zero scientific validity • Maximum maternal authority
        </p>
      </div>
    </div>
  );
}
