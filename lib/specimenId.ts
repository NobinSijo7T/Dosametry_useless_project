// Deterministic Specimen ID Generator
// Generates DOSA-XXXX-XXXX format based on analysis metrics

export function generateSpecimenId(
  circularity: number,
  roundness: number,
  diameter: number,
  timestamp: number
): string {
  // Create a deterministic hash from the metrics
  const data = `${circularity.toFixed(2)}-${roundness}-${diameter.toFixed(1)}-${Math.floor(timestamp / 1000)}`;
  
  // Simple deterministic hash function
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to positive and create hex segments
  const positiveHash = Math.abs(hash);
  const hex = positiveHash.toString(16).toUpperCase().padStart(8, '0');
  
  // Format as DOSA-XXXX-XXXX
  const part1 = hex.substring(0, 4);
  const part2 = hex.substring(4, 8);
  
  return `DOSA-${part1}-${part2}`;
}

export function generateShortId(circularity: number): string {
  // Generate a shorter ID for display purposes
  const hash = Math.floor(circularity * 10000) % 10000;
  return hash.toString(16).toUpperCase().padStart(4, '0');
}
