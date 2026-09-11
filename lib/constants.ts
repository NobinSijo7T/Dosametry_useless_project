// Constants for Dosa Circularity Analyzer

import { DosaSample, Verdict } from '@/types';

// Deterministic specimen SVG representations for calibration references
export const SAMPLE_1_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#141720"/>
  <circle cx="200" cy="200" r="160" fill="#222733" stroke="#2e3547" stroke-width="4"/>
  <circle cx="200" cy="200" r="130" fill="#ca7a17" stroke="#78350f" stroke-width="5"/>
  <circle cx="200" cy="200" r="110" fill="#e69d2d" opacity="0.9"/>
  <circle cx="200" cy="200" r="75" fill="#f59e0b" opacity="0.8"/>
  <circle cx="170" cy="180" r="15" fill="#a0500a" opacity="0.6"/>
  <circle cx="220" cy="210" r="18" fill="#a0500a" opacity="0.6"/>
  <circle cx="190" cy="230" r="12" fill="#78350f" opacity="0.5"/>
</svg>
`)}`;

export const SAMPLE_2_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#141720"/>
  <circle cx="200" cy="200" r="160" fill="#222733" stroke="#2e3547" stroke-width="4"/>
  <!-- Oblong / Rectangular Dosa -->
  <rect x="90" y="140" width="220" height="110" rx="20" fill="#ca7a17" stroke="#78350f" stroke-width="5"/>
  <rect x="110" y="155" width="180" height="80" rx="15" fill="#e69d2d" opacity="0.9"/>
  <circle cx="150" cy="190" r="14" fill="#a0500a" opacity="0.6"/>
  <circle cx="230" cy="185" r="16" fill="#a0500a" opacity="0.6"/>
</svg>
`)}`;

export const SAMPLE_3_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="400" height="400" fill="#141720"/>
  <circle cx="200" cy="200" r="160" fill="#222733" stroke="#2e3547" stroke-width="4"/>
  <!-- Elliptical / Oval Dosa -->
  <ellipse cx="200" cy="200" rx="145" ry="95" fill="#ca7a17" stroke="#78350f" stroke-width="5"/>
  <ellipse cx="200" cy="200" rx="120" ry="75" fill="#e69d2d" opacity="0.9"/>
  <circle cx="180" cy="195" r="16" fill="#a0500a" opacity="0.6"/>
  <circle cx="230" cy="205" r="14" fill="#a0500a" opacity="0.6"/>
</svg>
`)}`;

export const SAMPLES: Record<number, DosaSample> = {
  1: {
    name: 'Master Tawa Gold',
    score: 97.3,
    description: 'Flawlessly concentric master-grade roast with crisp golden margins and uniform ladle radial symmetry.',
    imageUrl: SAMPLE_1_IMAGE,
  },
  2: {
    name: 'Hostel Midnight Disaster',
    score: 23.7,
    description: 'An asymmetrical geometric catastrophe hastily flipped on a warped skillet during 2 AM exam panic.',
    imageUrl: SAMPLE_2_IMAGE,
  },
  3: {
    name: 'Sunday Rush Griddle',
    score: 61.2,
    description: 'A stretched semi-elliptical specimen poured under heavy peak-hour restaurant rush pressure.',
    imageUrl: SAMPLE_3_IMAGE,
  },
};

export const ANALYSIS_STEPS = [
  '> Positioning specimen on Stage 01...',
  '> Initializing ONNX Runtime Web execution session...',
  '> Preprocessing image into 320x320 NCHW tensor...',
  '> Executing U-2-Net salient foreground inference...',
  '> Extracting composite probability mask (layer 1959)...',
  '> Applying morphological connected component labeling...',
  '> Isolating primary culinary specimen from background...',
  '> Tracing Moore-Neighbor outer boundary contour...',
  '> Calculating Shoelace area and arc-length perimeter...',
  '> Computing Isoperimetric Roundness Index (4πA/P²)...',
  '> Evaluating radial deviation jitter (σ)...',
  '> Modeling Sambar dipping capillary surface tension...',
  '> Querying Amma heuristic approval matrix...',
  '> Generating official Class 0 Metrology Certificate...',
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
