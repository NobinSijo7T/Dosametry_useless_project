'use client';

import { useState, useRef } from 'react';
import { Volume2, VolumeX, Send, Sparkles, Loader2 } from 'lucide-react';

const QUICK_QUESTIONS = [
  'കല്ലിൽ ഒട്ടിപ്പിടിച്ചാൽ എന്തു ചെയ്യണം?',
  'നല്ല ക്രിസ്പിയാക്കാൻ എന്താണ് രഹസ്യം?',
  'പെർഫെക്ട് വട്ടമാക്കാൻ ഒരു ടിപ്പ് പറയൂ?',
];

export default function AskAmmaWidget() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(
    'ദോശക്കല്ല് നന്നായി ചൂടായ ശേഷം കുറച്ചു വെള്ളം തളിച്ചു തുടയ്ക്കണം. എന്നിട്ട് മാവ് ഒഴിച്ച് നടുവിൽ നിന്ന് കറക്കി പരത്തുക!'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleAsk = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim() || isLoading) return;

    setIsLoading(true);
    // Stop any existing audio
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    try {
      const res = await fetch('/api/sarvam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'chat', message: q }),
      });
      const data = await res.json();
      if (data.reply) {
        setAnswer(data.reply.trim());
      }
    } catch (e) {
      console.error(e);
      setAnswer('കല്ല് കൂടുതൽ ചൂടായിക്കാണും! വീണ്ടും ശ്രമിക്കൂ.');
    } finally {
      setIsLoading(false);
      setQuestion('');
    }
  };

  const handlePlayVoice = async () => {
    if (isPlayingAudio && audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
      return;
    }

    if (!answer) return;

    setAudioLoading(true);
    try {
      const res = await fetch('/api/sarvam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'tts', text: answer }),
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
      console.error('Audio playback error:', err);
    } finally {
      setAudioLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[560px] rounded-2xl border border-[rgba(253,251,247,0.12)] bg-gradient-to-b from-[#141822]/90 to-[#0e1118]/90 p-4 sm:p-5 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.36)] relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#f59e0b]/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[rgba(253,251,247,0.08)]">
        <div className="flex items-center gap-2">
          <span className="text-[#f59e0b] text-base">🍳</span>
          <h3 className="font-gayathri font-bold text-base sm:text-lg text-[#fdfbf7] tracking-wide">
            അമ്മയോട് ചോദിക്കാം
          </h3>
          <span className="text-[0.65rem] font-mono px-2 py-0.5 rounded-full bg-[#f59e0b]/15 text-[#f59e0b] border border-[#f59e0b]/30">
            SARVAM AI
          </span>
        </div>

        {/* Voice Playback Button */}
        <button
          type="button"
          onClick={handlePlayVoice}
          disabled={audioLoading || !answer}
          className={`flex items-center gap-1.5 text-xs font-gayathri font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
            isPlayingAudio
              ? 'bg-[#ef4444]/20 border-[#ef4444] text-[#ef4444] animate-pulse'
              : 'bg-[#181d28] hover:bg-[#202736] border-[rgba(253,251,247,0.1)] text-[#f59e0b]'
          }`}
          title="അമ്മയുടെ ശബ്ദത്തിൽ കേൾക്കൂ"
        >
          {audioLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#f59e0b]" />
          ) : isPlayingAudio ? (
            <VolumeX className="w-3.5 h-3.5" />
          ) : (
            <Volume2 className="w-3.5 h-3.5" />
          )}
          <span>{isPlayingAudio ? 'നിർത്തൂ' : 'കേൾക്കാം'}</span>
        </button>
      </div>

      {/* Quick Question Chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => {
              setQuestion(q);
              handleAsk(q);
            }}
            disabled={isLoading}
            className="text-[0.72rem] font-gayathri font-semibold text-[#94a3b8] hover:text-[#fdfbf7] bg-[#161a24] hover:bg-[#1f2433] px-2.5 py-1 rounded-full border border-[rgba(253,251,247,0.06)] hover:border-[#f59e0b]/40 transition-all cursor-pointer truncate max-w-full"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Amma's Answer Box */}
      <div className="bg-[#0b0d13] border border-[rgba(253,251,247,0.07)] rounded-xl p-3 sm:p-3.5 mb-3 relative min-h-[64px] flex items-center">
        {isLoading ? (
          <div className="flex items-center gap-2 text-xs font-mono text-[#f59e0b] py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="font-gayathri text-sm">അമ്മ ആലോചിക്കുകയാണ്...</span>
          </div>
        ) : (
          <p className="font-gayathri text-sm sm:text-base leading-[1.7] text-[#fdfbf7] font-normal">
            &ldquo;{answer}&rdquo;
          </p>
        )}
      </div>

      {/* Question Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAsk();
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="ദോശയെക്കുറിച്ച് അമ്മയോട് ചോദിക്കൂ..."
            className="w-full bg-[#0d0f15] border border-[rgba(253,251,247,0.1)] rounded-xl px-3.5 py-2 text-xs sm:text-sm font-gayathri text-[#fdfbf7] placeholder-[#64748b] focus:outline-none focus:border-[#f59e0b]"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="bg-gradient-to-r from-[#f59e0b] to-[#ea580c] hover:from-[#d97706] hover:to-[#c2410c] disabled:opacity-40 disabled:cursor-not-allowed text-[#0c0e12] font-bold p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center cursor-pointer"
          aria-label="ചോദിക്കൂ"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#0c0e12]" />
          ) : (
            <Send className="w-4 h-4 text-[#0c0e12]" />
          )}
        </button>
      </form>
    </div>
  );
}
