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

export interface LoadingDialogue {
  dialogue: string;
  speaker: string;
}

export const MALAYALAM_LOADING_DIALOGUES: LoadingDialogue[] = [
  {
    speaker: "അമ്മ (Amma)",
    dialogue: "തവ നല്ലോണം ചൂടാകട്ടെടാ... അപ്പോഴേക്കും തിടുക്കം കൂട്ടല്ലേ! 🔥",
  },
  {
    speaker: "അടുക്കള നിരീക്ഷകൻ",
    dialogue: "മാവ് ഒഴിച്ച് വട്ടത്തിൽ ചുറ്റിക്കുന്നു... കൈ വിറയ്ക്കല്ലേ മോനേ! 🌀",
  },
  {
    speaker: "അമ്മ (Amma)",
    dialogue: "ഇത് ദോശയോ അതോ ഓസ്ട്രേലിയയുടെ മാപ്പോ എന്ന് ഞാൻ നോക്കട്ടെ... 🧐",
  },
  {
    speaker: "ചട്ടുകം കൺട്രോൾ റൂം",
    dialogue: "നെയ്യ് ഇത്തിരി കൂടുതൽ ഒഴിച്ചോ? അമ്മയുടെ കണ്ണ് ഇതിലുണ്ട്! 👀",
  },
  {
    speaker: "സയന്റിഫിക് ഇൻസ്പെക്ടർ",
    dialogue: "ഒരു സൈഡ് കരിഞ്ഞുപോയോ എന്ന് ചെക്ക് ചെയ്യുന്നു... ഭാഗ്യം, രക്ഷപ്പെട്ടു! 😅",
  },
  {
    speaker: "സാമ്പാർ കൗൺസിൽ",
    dialogue: "സാമ്പാറിലേക്ക് നീന്തി വീഴാൻ ഇതിന് യോഗ്യതയുണ്ടോ എന്ന് അളക്കുന്നു... 🥣",
  },
  {
    speaker: "അമ്മയുടെ അലർച്ച",
    dialogue: "തീ കൂട്ടി വെക്കല്ലേടാ കരിഞ്ഞുപോകും! സിമ്മിലിട്! 🔊",
  },
  {
    speaker: "ക്രിസ്പി ലാബ്",
    dialogue: "ക്രിസ്പിയാണോ അതോ റബ്ബർ ഷീറ്റാണോ എന്ന് ലബോറട്ടറിയിൽ പരിശോധിക്കുന്നു... 🔬",
  },
  {
    speaker: "ചമ്മന്തി ഡിവിഷൻ",
    dialogue: "തേങ്ങാ ചമ്മന്തി റെഡിയായി... ദോശ ദാ ചൂടോടെ ഇപ്പൊ വരും! 🥥",
  },
  {
    speaker: "അമ്മ (Amma)",
    dialogue: "എന്റെ മോൻ/മോൾ ഉണ്ടാക്കിയതല്ലേ... ഒടുക്കത്തെ ടെൻഷനുണ്ട്! 📋",
  },
  {
    speaker: "ഫൈനൽ സർട്ടിഫിക്കേഷൻ",
    dialogue: "അവസാന വട്ട പരിശോധന... അമ്മ പ്ലേറ്റുമായി കാത്തുനിൽക്കുന്നു! ✨",
  },
];

export const ANALYSIS_STEPS = [
  '> സ്പെസിമെൻ തവയിലേക്ക് കയറ്റി വെക്കുന്നു (Positioning specimen)...',
  '> ഒപ്റ്റിക്കൽ സെൻസറുകൾ ഓൺ ചെയ്യുന്നു (Initializing neural engine)...',
  '> മാവിന്റെ വലിപ്പവും കനവും കണക്കാക്കുന്നു (Tensor preprocessing)...',
  '> ദോശയുടെ ബോർഡറുകൾ തപ്പിയെടുക്കുന്നു (Foreground inference)...',
  '> ഇത് പ്ലേറ്റാണോ ദോശയാണോ എന്ന് വേർതിരിക്കുന്നു (Contour isolation)...',
  '> വട്ടത്തിന്റെ കൃത്യത അളന്നു തിട്ടപ്പെടുത്തുന്നു (Shoelace area & roundness)...',
  '> ചരിവും വളവും അമ്മയുടെ ഫോർമുല വെച്ച് നോക്കുന്നു (Radial deviation jitter)...',
  '> സാമ്പാറിൽ മുക്കാൻ കൊള്ളാമോ എന്ന് പരിശോധിക്കുന്നു (Sambar compatibility)...',
  '> അമ്മയുടെ കട്ട അപ്രൂവൽ മാട്രിക്സ് പരിശോധിക്കുന്നു (Querying Amma heuristics)...',
  '> ഔദ്യോഗിക ദോശ സർട്ടിഫിക്കറ്റ് തയ്യാറാക്കുന്നു (Generating Class 0 Certificate)...',
  '> പരിശോധന പൂർത്തിയായി! (Analysis complete.)',
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
