// Constants for Dosa Circularity Analyzer

import { DosaSample, Verdict } from '@/types';

export const SAMPLES: Record<number, DosaSample> = {
  1: {
    name: 'The Grandma Special',
    score: 97.3,
    description: 'A near-perfect specimen. The edges are crisp, the surface uniform, and the spirit of three generations of South Indian culinary mastery is palpable.'
  },
  2: {
    name: 'The Tragic Rectangle',
    score: 23.7,
    description: 'We are not sure what happened here. This dosa appears to have given up midway through its journey. A forensic investigation is ongoing.'
  },
  3: {
    name: 'The Philosophical Oval',
    score: 61.2,
    description: 'The dosa seems to be asking existential questions. It is not a circle, but it is also not not a circle. Schrödinger\'s dosa.'
  }
};

export const ANALYSIS_STEPS = [
  '> Loading tawa sensor array...',
  '> Initializing Hough Circle Transform...',
  '> Calibrating fermentation detection module...',
  '> Applying neural dosa network (layer 1/847)...',
  '> Running isoperimetric inequality check...',
  '> Querying grandmother database...',
  '> Computing Fourier decomposition of edges...',
  '> Measuring sambar eligibility coefficient...',
  '> Consulting the ancient scrolls of circularity...',
  '> Calculating existential regret index...',
  '> Performing quantum crispiness collapse...',
  '> Generating shame report...',
  '> Analysis complete.',
];

export const VERDICTS: Verdict[] = [
  { 
    min: 95, 
    max: 100, 
    emoji: '🏅', 
    title: 'Platonic Ideal', 
    desc: 'This dosa has transcended the physical plane. It exists simultaneously in all circular dimensions. Amma is weeping tears of pure joy.', 
    grade: 'S+' 
  },
  { 
    min: 80, 
    max: 94.99, 
    emoji: '⭐', 
    title: 'Darshini Grade', 
    desc: 'Excellent circularity. This dosa would be served at any respectable South Indian establishment. You should feel good. But not too good.', 
    grade: 'A' 
  },
  { 
    min: 60, 
    max: 79.99, 
    emoji: '👌', 
    title: 'Acceptable Oval', 
    desc: 'Technically still a dosa. Sambar eligibility: Approved. Family approval: Conditional. Please practice more.', 
    grade: 'B' 
  },
  { 
    min: 40, 
    max: 59.99, 
    emoji: '😬', 
    title: 'The Struggle Blob', 
    desc: 'The dosa tried. It really did. You did not. The gap between expectation and reality is measurable in tears. Call your mother.', 
    grade: 'C' 
  },
  { 
    min: 20, 
    max: 39.99, 
    emoji: '💀', 
    title: 'Abstract Art', 
    desc: 'This is no longer a food item. It is an artistic statement about the futility of geometry. Frame it. Sell it. Do not eat it.', 
    grade: 'D' 
  },
  { 
    min: 0, 
    max: 19.99, 
    emoji: '☠️', 
    title: 'Geometrical Crime', 
    desc: 'You have committed an offense against mathematics, cooking, and the entire South Indian culinary tradition. Authorities have been notified. Amma has fainted.', 
    grade: 'F' 
  },
];
