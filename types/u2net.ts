// Type definitions for U-2-Net inference, segmentation, and geometric circularity

import type { Verdict, Metrics } from './index';

export interface ContourPoint {
  x: number;
  y: number;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
}

export interface SegmentationMask {
  data: Uint8Array; // 0-255 values, length width * height
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  maskDataUrl: string;
  bounds: BoundingBox;
}

export interface GeometryResult {
  area: number;
  perimeter: number;
  roundnessIndex: number; // 4 * PI * Area / Perimeter^2, clamped to [0.000, 1.000]
  circularityPercentage: number;
  equivalentDiameter: number;
  center: ContourPoint;
  meanRadius: number;
  jitterSigma: number; // Standard deviation of radius
  contour: ContourPoint[];
  aspectRatio: number;
  isIsolated: boolean;
}

export interface DetailedAnalysisResult {
  score: number;
  verdict: Verdict;
  metrics: Metrics;
  geometry: GeometryResult;
  maskDataUrl: string;
  originalImageUrl: string;
  specimenName?: string;
  timestamp: string;
}

export type DetailedAnalyzerState =
  | 'idle'
  | 'loading_model'
  | 'preprocessing'
  | 'scanning'
  | 'extracting_boundary'
  | 'calculating_metrics'
  | 'done'
  | 'error';

export interface AnalysisError {
  title: string;
  message: string;
  technicalDetails?: string;
}
