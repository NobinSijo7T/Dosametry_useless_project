import { NextRequest, NextResponse } from 'next/server';

const SARVAM_API_KEY = process.env.SARVAM_API_KEY || 'sk_t82s5ndq_zNoSygVx6DeRUbOcKfJs7AyV';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, message, text } = body;

    // 1. Text-to-Speech (Bulbul:v3)
    if (action === 'tts') {
      const inputText = text || message || '';
      if (!inputText) {
        return NextResponse.json({ error: 'Text is required for TTS' }, { status: 400 });
      }

      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: [inputText.slice(0, 500)],
          target_language_code: 'ml-IN',
          speaker: 'kavitha',
          model: 'bulbul:v3',
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return NextResponse.json({ error: errData }, { status: response.status });
      }

      const data = await response.json();
      return NextResponse.json({ audio: data.audios?.[0] || null });
    }

    // 2. Chat / Ask Amma (Sarvam-105B)
    if (action === 'chat') {
      const userMessage = message || '';
      if (!userMessage) {
        return NextResponse.json({ error: 'Message is required' }, { status: 400 });
      }

      const systemPrompt = `You are a humorous, affectionate, sharp-tongued Kerala Malayali Amma inspecting and teaching how to make the perfect crispy circular dosa on a hot iron tawa. 
Always reply in natural, authentic Malayalam (മലയാളം ലിപിയിൽ). Keep responses witty, direct, and under 2-3 short sentences. You love perfect round dosas and crisp edges.`;

      const response = await fetch('https://api.sarvam.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'api-subscription-key': SARVAM_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'sarvam-105b-conversations',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        return NextResponse.json({ error: errData }, { status: response.status });
      }

      const data = await response.json();
      const reply = data.choices?.[0]?.message?.content || 'ദോശ ഉണ്ടാക്കാൻ ക്ഷമ വേണം മക്കളേ!';
      return NextResponse.json({ reply });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Sarvam API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
