// Deterministic Malayalam Amma Verdict Engine
// Generates maternal culinary quality assessment without external API

import type { AmmaLanguage, AmmaVerdict } from '@/types';

interface VerdictLibrary {
  [key: string]: {
    [key: string]: string[];
  };
}

// Malayalam Amma Verdict Library
const VERDICT_LIBRARY: VerdictLibrary = {
  malayalam: {
    perfect: [
      'ഇത് കണ്ടിട്ട് ഒന്നും പറയാനില്ല. ശരിക്കും വട്ടമാണ്. സംശയകരമായി നല്ലത്.',
      'ഇത്രയും വട്ടം എങ്ങനെ ഉണ്ടാക്കി? ഇന്ന് എന്തോ ശരിയായി ചെയ്തിട്ടുണ്ട്.',
      'ഇത് dosa ആണെന്ന് സമ്മതിക്കുന്നു. നല്ല ജോലി.',
      'പെർഫെക്ട് സർക്കിൾ എന്ന് പറയാൻ തോന്നുന്നു. അമ്മ അംഗീകരിക്കുന്നു.',
    ],
    excellent: [
      'വട്ടം കൊള്ളാം. പക്ഷേ കുറച്ച് കൂടി ശ്രദ്ധിച്ചിരുന്നെങ്കിൽ നന്നായിരുന്നു.',
      'നല്ല dosa ആണ്. പക്ഷേ അമ്മ ഉണ്ടാക്കുന്നതുമായി താരതമ്യം ചെയ്യണ്ട.',
      'ശരാശരിയേക്കാൾ നല്ലത്. ഇനി overconfidence വേണ്ട.',
      'ദോശ എന്ന് തിരിച്ചറിയാൻ പറ്റുന്നു. വട്ടം നന്നായിട്ടുണ്ട്.',
    ],
    acceptable: [
      'ദോശ തന്നെയാണ്. പക്ഷേ വട്ടം കുറച്ച് പ്രശ്നമുണ്ട്.',
      'ഇത് spread ചെയ്തതാണോ, batter രക്ഷപ്പെട്ടതാണോ?',
      'കഴിക്കാൻ പറ്റും. കാണാൻ അത്ര വലിയ കാര്യമില്ല.',
      'അമ്മയുടെ standard-ൽ എത്തിയിട്ടില്ല. പക്ഷേ try ചെയ്തിട്ടുണ്ട്.',
    ],
    questionable: [
      'ഇത് കണ്ടിട്ട് ആദ്യം dosa ആണെന്ന് തിരിച്ചറിയണം.',
      'വട്ടം എവിടെ പോയി?',
      'നീ batter ഇട്ടതാണോ, എറിഞ്ഞതാണോ?',
      'ഇത്തിരി കൂടി practice ചെയ്യണം മോനെ.',
    ],
    disaster: [
      'ഇത് എന്ത് കോലമാണ് മോനെ?',
      'ഇത് dosa അല്ല. ഒരു geometric emergency ആണ്.',
      'ഇതിനെ plate-ൽ വെക്കുന്നതിന് മുമ്പ് വീണ്ടും ആലോചിക്കണം.',
      'ഇത്രയും വളഞ്ഞത് കണ്ടിട്ട് compass പോലും resign ചെയ്യും.',
      'അമ്മ ഇത് കണ്ടാൽ സംസാരിക്കാൻ ഇല്ലാതാവും.',
    ],
  },
  manglish: {
    perfect: [
      'Ithu kandittu onnum parayan illa. Sherikkum vattam aanu. Samsayakaramayi nallathu.',
      'Ithra nalla dosa engane undakki? Inn entho correct aayi cheythittundu.',
      'Ithu dosa aanennu amma sammathikkunnu. Nalla joli.',
      'Perfect circle ennu parayaan thonnunnu. Amma angeekkarikkunnu.',
    ],
    excellent: [
      'Vattam kollam. Pakshe kurachu koodi shradhichirunnenkil nannayene.',
      'Nalla dosa aanu. Pakshe amma undakkunnathumayi compare cheyyanda.',
      'Average-nekkal nallathaanu. Ini overconfidence venda.',
      'Dosa ennu thirichariyan pattunn. Vattam nannayittundu.',
    ],
    acceptable: [
      'Dosa thanne aanu. Pakshe vattam kurachu problem undu.',
      'Ithu spread cheythathaano, batter rakshappettathaano?',
      'Kazikkan pattum. Kanan athra valiya karyam illa.',
      'Amma-ude standard-il ethiyittilla. Pakshe try cheythittundu.',
    ],
    questionable: [
      'Ithu kandittu aadyam dosa aanennu thirichariyanam.',
      'Vattam evide poyi?',
      'Nee batter ittathaano, erinjathaano?',
      'Itthiri koodi practice cheyanam mone.',
    ],
    disaster: [
      'Ithu enthu kolamaanu mone?',
      'Ithu dosa alla. Oru geometric emergency aanu.',
      'Plate-il vekkunathinu munpu onnu koodi aalochikkam.',
      'Ithra valanjath kandu compass polum resign cheyyum.',
      'Amma ithu kandaal samsarikkan illathaavum.',
    ],
  },
  english: {
    perfect: [
      'Nothing to complain about. Suspiciously circular.',
      'This is dangerously close to Master Tawa Gold territory.',
      'Fine. You actually made a dosa.',
      'Amma approves. This rarely happens.',
    ],
    excellent: [
      'Good dosa. But don\'t compare this with Amma\'s.',
      'Very respectable. Don\'t get overconfident.',
      'The geometry is acceptable. Amma remains unconvinced.',
      'Recognizable as a dosa. Circle is decent.',
    ],
    acceptable: [
      'It is technically a dosa. The circle needs work.',
      'Was this spread with a ladle or launched with confidence?',
      'Edible. Geometrically questionable.',
      'Not up to Amma\'s standard. But you tried.',
    ],
    questionable: [
      'We need to discuss what happened to the circle.',
      'The dosa appears to have escaped geometric discipline.',
      'Please stop calling this a perfect circle.',
      'A little more practice needed.',
    ],
    disaster: [
      'What happened here?',
      'This is not a dosa. This is a geometric emergency.',
      'Even the compass would resign.',
      'Please do not show Amma this specimen.',
      'Amma refuses to comment on this.',
    ],
  },
};

/**
 * Calculate Amma Approval Score deterministically from analysis metrics
 * Higher circularity and roundness increase approval
 * Higher jitter and irregularity decrease approval
 */
export function calculateAmmaApproval(
  circularity: number,
  roundness: number | string,
  jitter: number | string,
  diameter: number
): number {
  // Base approval from circularity (0-100 scale)
  let approval = circularity;

  // Roundness factor (parse from string if needed)
  const roundnessValue = typeof roundness === 'string' 
    ? parseFloat(roundness) 
    : roundness;
  
  if (!isNaN(roundnessValue)) {
    // Good roundness (>0.9) adds bonus, poor roundness (<0.7) penalizes
    if (roundnessValue > 0.9) {
      approval += (roundnessValue - 0.9) * 50; // Up to +5 for perfect roundness
    } else if (roundnessValue < 0.7) {
      approval -= (0.7 - roundnessValue) * 30; // Penalty for poor roundness
    }
  }

  // Jitter penalty (parse from string if needed)
  const jitterValue = typeof jitter === 'string'
    ? parseFloat(jitter.replace('px', ''))
    : jitter;
  
  if (!isNaN(jitterValue)) {
    // More jitter = less approval
    const jitterPenalty = Math.min(jitterValue / 2, 20); // Max -20 for high jitter
    approval -= jitterPenalty;
  }

  // Size bonus: reasonable-sized dosas get a small bonus
  if (diameter > 100 && diameter < 500) {
    approval += 2;
  }

  // Clamp to 0-100
  approval = Math.max(0, Math.min(100, approval));

  return Math.round(approval * 10) / 10; // Round to 1 decimal
}

/**
 * Get verdict category based on approval score
 */
function getVerdictCategory(approval: number): AmmaVerdict['category'] {
  if (approval >= 95) return 'perfect';
  if (approval >= 85) return 'excellent';
  if (approval >= 70) return 'acceptable';
  if (approval >= 50) return 'questionable';
  return 'disaster';
}

/**
 * Select a deterministic verdict from the library
 * Uses the approval score as a seed for consistency
 */
function selectVerdict(
  category: AmmaVerdict['category'],
  language: AmmaLanguage,
  approvalScore: number
): string {
  const verdicts = VERDICT_LIBRARY[language][category];
  if (!verdicts || verdicts.length === 0) {
    return 'Amma has no comment.';
  }

  // Use approval score to deterministically select a verdict
  const index = Math.floor(approvalScore * 10) % verdicts.length;
  return verdicts[index];
}

/**
 * Generate complete Amma verdict from analysis results
 */
export function generateAmmaVerdict(
  circularity: number,
  roundness: string | number,
  jitter: string | number,
  diameter: number,
  language: AmmaLanguage = 'malayalam'
): AmmaVerdict {
  const approvalScore = calculateAmmaApproval(
    circularity,
    typeof roundness === 'string' ? parseFloat(roundness) : roundness,
    typeof jitter === 'string' ? parseFloat(jitter.replace('px', '')) : jitter,
    diameter
  );

  const category = getVerdictCategory(approvalScore);
  const verdict = selectVerdict(category, language, approvalScore);

  return {
    approvalScore,
    verdict,
    category,
  };
}

/**
 * Get all available languages
 */
export function getAvailableLanguages(): { id: AmmaLanguage; label: string }[] {
  return [
    { id: 'malayalam', label: 'മലയാളം' },
    { id: 'manglish', label: 'Manglish' },
    { id: 'english', label: 'English' },
  ];
}
