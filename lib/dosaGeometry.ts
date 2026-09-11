// Geometric and polar metrology analysis for segmented dosa contours

import type { ContourPoint, BoundingBox, GeometryResult } from '@/types/u2net';
import type { Metrics, Verdict } from '@/types/index';
import { VERDICTS } from '@/lib/constants';

/**
 * Perform connected component analysis and boundary tracing on a 2D binary mask.
 * Extracts the primary (largest) foreground object and its outer perimeter.
 */
export function analyzeDosaGeometry(
  binaryMask: Uint8Array,
  width: number,
  height: number
): GeometryResult {
  // 1. Connected Component Labeling to isolate the primary foreground object
  const labels = new Int32Array(width * height);
  let currentLabel = 0;
  const componentSizes = new Map<number, number>();

  // Helper for 2D index
  const idx = (x: number, y: number) => y * width + x;

  // Simple two-pass or flood-fill for largest component
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = idx(x, y);
      if (binaryMask[i] === 255 && labels[i] === 0) {
        currentLabel++;
        let size = 0;
        const queue: [number, number][] = [[x, y]];
        labels[i] = currentLabel;

        while (queue.length > 0) {
          const [cx, cy] = queue.pop()!;
          size++;

          // 4-neighborhood
          const neighbors = [
            [cx + 1, cy],
            [cx - 1, cy],
            [cx, cy + 1],
            [cx, cy - 1],
          ];

          for (const [nx, ny] of neighbors) {
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const ni = idx(nx, ny);
              if (binaryMask[ni] === 255 && labels[ni] === 0) {
                labels[ni] = currentLabel;
                queue.push([nx, ny]);
              }
            }
          }
        }

        componentSizes.set(currentLabel, size);
      }
    }
  }

  // Find the largest component
  let maxLabel = 0;
  let maxArea = 0;
  for (const [label, size] of componentSizes.entries()) {
    if (size > maxArea) {
      maxArea = size;
      maxLabel = label;
    }
  }

  // Minimum size threshold (at least 200 pixels and at least 0.5% of the total frame)
  const minRequiredPixels = Math.max(200, Math.floor(width * height * 0.005));
  if (maxLabel === 0 || maxArea < minRequiredPixels) {
    return {
      area: 0,
      perimeter: 0,
      roundnessIndex: 0,
      circularityPercentage: 0,
      equivalentDiameter: 0,
      center: { x: width / 2, y: height / 2 },
      meanRadius: 0,
      jitterSigma: 0,
      contour: [],
      aspectRatio: 1,
      isIsolated: false,
    };
  }

  // Create isolated mask buffer containing only the primary component
  const isolated = new Uint8Array(width * height);
  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = idx(x, y);
      if (labels[i] === maxLabel) {
        isolated[i] = 255;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  // 2. Extract boundary contour using Moore-Neighbor tracing
  const contour = traceContour(isolated, width, height, minX, minY, maxX, maxY);

  if (contour.length < 5) {
    return {
      area: maxArea,
      perimeter: 0,
      roundnessIndex: 0,
      circularityPercentage: 0,
      equivalentDiameter: 2 * Math.sqrt(maxArea / Math.PI),
      center: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 },
      meanRadius: 0,
      jitterSigma: 0,
      contour,
      aspectRatio: (maxX - minX + 1) / Math.max(1, maxY - minY + 1),
      isIsolated: false,
    };
  }

  // 3. Smooth contour slightly to remove discrete 1px Manhattan grid staircase bias
  const smoothedContour = smoothContour(contour);

  // 4. Calculate polygonal Shoelace Area & Arc-Length Perimeter
  const polyArea = calculateShoelaceArea(smoothedContour);
  // Average the pixel count area and polygon area for robustness
  const effectiveArea = polyArea > 0 ? (maxArea + polyArea) / 2 : maxArea;

  const perimeter = calculatePerimeter(smoothedContour);

  // 5. Calculate Roundness Index = 4 * PI * Area / Perimeter^2
  let roundnessIndex = 0;
  if (perimeter > 0) {
    roundnessIndex = (4 * Math.PI * effectiveArea) / (perimeter * perimeter);
  }
  // Clamp strictly between 0.000 and 1.000
  roundnessIndex = Math.max(0, Math.min(1, roundnessIndex));
  const circularityPercentage = Math.round(roundnessIndex * 1000) / 10;

  // 6. Calculate Centroid (center of mass)
  let sumX = 0;
  let sumY = 0;
  for (const pt of smoothedContour) {
    sumX += pt.x;
    sumY += pt.y;
  }
  const centerX = sumX / smoothedContour.length;
  const centerY = sumY / smoothedContour.length;

  // 7. Calculate Radial Deviations and Edge Jitter (standard deviation of radii)
  const radii: number[] = [];
  let sumRadius = 0;
  for (const pt of smoothedContour) {
    const dx = pt.x - centerX;
    const dy = pt.y - centerY;
    const r = Math.sqrt(dx * dx + dy * dy);
    radii.push(r);
    sumRadius += r;
  }
  const meanRadius = sumRadius / radii.length;

  let sumVariance = 0;
  for (const r of radii) {
    const diff = r - meanRadius;
    sumVariance += diff * diff;
  }
  const jitterSigma = Math.sqrt(sumVariance / radii.length);

  // 8. Equivalent circular diameter
  const equivalentDiameter = 2 * Math.sqrt(effectiveArea / Math.PI);

  const boundingWidth = maxX - minX + 1;
  const boundingHeight = maxY - minY + 1;
  const aspectRatio = boundingWidth / Math.max(1, boundingHeight);

  return {
    area: Math.round(effectiveArea),
    perimeter: Math.round(perimeter * 10) / 10,
    roundnessIndex: Math.round(roundnessIndex * 1000) / 1000,
    circularityPercentage,
    equivalentDiameter: Math.round(equivalentDiameter * 10) / 10,
    center: { x: Math.round(centerX * 10) / 10, y: Math.round(centerY * 10) / 10 },
    meanRadius: Math.round(meanRadius * 10) / 10,
    jitterSigma: Math.round(jitterSigma * 10) / 10,
    contour: smoothedContour,
    aspectRatio: Math.round(aspectRatio * 100) / 100,
    isIsolated: true,
  };
}

/**
 * Moore-Neighbor contour tracing algorithm
 */
function traceContour(
  mask: Uint8Array,
  width: number,
  height: number,
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
): ContourPoint[] {
  const points: ContourPoint[] = [];

  // Find the top-leftmost starting pixel
  let startX = -1;
  let startY = -1;

  for (let y = minY; y <= maxY && startY === -1; y++) {
    for (let x = minX; x <= maxX; x++) {
      if (mask[y * width + x] === 255) {
        startX = x;
        startY = y;
        break;
      }
    }
  }

  if (startX === -1) return points;

  // 8-directions clockwise: [dx, dy]
  const dirs = [
    [0, -1],  // 0: N
    [1, -1],  // 1: NE
    [1, 0],   // 2: E
    [1, 1],   // 3: SE
    [0, 1],   // 4: S
    [-1, 1],  // 5: SW
    [-1, 0],  // 6: W
    [-1, -1], // 7: NW
  ];

  let currentX = startX;
  let currentY = startY;
  let backDir = 6; // entered from West

  points.push({ x: currentX, y: currentY });

  const maxSteps = width * height;
  let step = 0;

  while (step++ < maxSteps) {
    let foundNext = false;
    const startScan = (backDir + 2) % 8; // start scanning clockwise from backDir

    for (let d = 0; d < 8; d++) {
      const dirIndex = (startScan + d) % 8;
      const nx = currentX + dirs[dirIndex][0];
      const ny = currentY + dirs[dirIndex][1];

      if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
        if (mask[ny * width + nx] === 255) {
          currentX = nx;
          currentY = ny;
          // backDir is opposite of the step taken
          backDir = (dirIndex + 4) % 8;
          points.push({ x: currentX, y: currentY });
          foundNext = true;
          break;
        }
      }
    }

    if (!foundNext) break;

    // Terminate when loop returns to start
    if (currentX === startX && currentY === startY && points.length > 4) {
      break;
    }
  }

  return points;
}

/**
 * Smooth raw pixel coordinates using a 3-point rolling kernel to reduce 1px staircase quantization
 */
function smoothContour(contour: ContourPoint[]): ContourPoint[] {
  if (contour.length < 6) return contour;

  // Step sampling: take every 2nd or 3rd point if contour is dense
  const step = contour.length > 400 ? 3 : contour.length > 150 ? 2 : 1;
  const sampled: ContourPoint[] = [];

  for (let i = 0; i < contour.length; i += step) {
    sampled.push(contour[i]);
  }

  const smoothed: ContourPoint[] = [];
  const N = sampled.length;

  for (let i = 0; i < N; i++) {
    const prev = sampled[(i - 1 + N) % N];
    const curr = sampled[i];
    const next = sampled[(i + 1) % N];

    // Gaussian-like 0.25 - 0.5 - 0.25 weights
    smoothed.push({
      x: prev.x * 0.25 + curr.x * 0.5 + next.x * 0.25,
      y: prev.y * 0.25 + curr.y * 0.5 + next.y * 0.25,
    });
  }

  return smoothed;
}

/**
 * Shoelace formula for polygon area
 */
function calculateShoelaceArea(contour: ContourPoint[]): number {
  let area = 0;
  const N = contour.length;
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    area += contour[i].x * contour[j].y;
    area -= contour[j].x * contour[i].y;
  }
  return Math.abs(area) / 2;
}

/**
 * Polygon arc-length perimeter
 */
function calculatePerimeter(contour: ContourPoint[]): number {
  let perimeter = 0;
  const N = contour.length;
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const dx = contour[j].x - contour[i].x;
    const dy = contour[j].y - contour[i].y;
    perimeter += Math.sqrt(dx * dx + dy * dy);
  }
  return perimeter;
}

/**
 * Derive deterministic satirical metrology metrics from real geometry
 */
export function deriveMetricsFromGeometry(geom: GeometryResult): { metrics: Metrics; verdict: Verdict } {
  const roundness = geom.roundnessIndex.toFixed(3);
  const jitter = geom.jitterSigma.toFixed(1) + 'px';

  // Sambar eligibility: requires circularity > 55% and jitter < 22px
  const sambarEligible = geom.roundnessIndex >= 0.55 && geom.jitterSigma < 22.0;
  const sambarEligibility = sambarEligible ? '✅ APPROVED' : '❌ DEFECTIVE';

  // Amma Approval: mapped from real roundness tiers
  let amma = '📵 Not Answering Phone';
  if (geom.roundnessIndex >= 0.95) {
    amma = '😭 Joy Tears (99.4%)';
  } else if (geom.roundnessIndex >= 0.85) {
    amma = '😊 Reluctant Nod (88.1%)';
  } else if (geom.roundnessIndex >= 0.70) {
    amma = '🤷 Acceptable (71.5%)';
  } else if (geom.roundnessIndex >= 0.50) {
    amma = '😤 Disappointed (46.2%)';
  }

  // Crispiness Factor: derived deterministically from edge irregularity and ratio
  const crispVal = Math.max(45, Math.min(99, 70 + (1 - geom.jitterSigma / Math.max(1, geom.meanRadius)) * 28));
  const crispy = crispVal.toFixed(1) + '%';

  // Existential Shame: inversely proportional to circularity
  const shamePct = (1 - geom.roundnessIndex) * 100;
  let shame = 'INFINITE ☠️';
  if (shamePct < 5) shame = '0.00% (None)';
  else if (shamePct < 18) shame = 'Low (11.2%)';
  else if (shamePct < 38) shame = 'Moderate (29.4%)';
  else if (shamePct < 60) shame = 'Severe (52.1%)';
  else shame = 'Catastrophic (98.9%)';

  const metrics: Metrics = {
    roundness,
    jitter,
    sambarEligibility,
    amma,
    crispy,
    shame,
  };

  const score = geom.circularityPercentage;
  const verdict = VERDICTS.find(v => score >= v.min && score <= v.max) || VERDICTS[VERDICTS.length - 1];

  return { metrics, verdict };
}
