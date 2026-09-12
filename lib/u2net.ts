// Browser-side U-2-Net ONNX Inference Engine
// Runs 100% locally in the browser with WebGPU / WASM execution providers

import type { SegmentationMask, BoundingBox } from '@/types/u2net';

// Cached inference session and ORT module
let ortModulePromise: Promise<typeof import('onnxruntime-web')> | null = null;
let inferenceSessionPromise: Promise<any> | null = null;

/**
 * Dynamically import onnxruntime-web in browser only and configure local WASM assets
 */
async function getOrt() {
  if (typeof window === 'undefined') {
    throw new Error('U-2-Net inference can only run client-side in the browser.');
  }

  if (!ortModulePromise) {
    ortModulePromise = import('onnxruntime-web').then((ort) => {
      // Direct WASM binaries to our local /onnx/ directory for 100% offline self-containment
      ort.env.wasm.wasmPaths = '/onnx/';
      ort.env.wasm.numThreads = Math.min(navigator.hardwareConcurrency || 4, 4);
      return ort;
    });
  }

  return ortModulePromise;
}

/**
 * Get or initialize the cached ONNX inference session
 */
export async function getU2NetSession(
  onProgress?: (step: string, pct: number) => void
): Promise<any> {
  if (inferenceSessionPromise) {
    return inferenceSessionPromise;
  }

  inferenceSessionPromise = (async () => {
    onProgress?.('Loading ONNX Runtime Web...', 15);
    const ort = await getOrt();

    // Check for environment variable (CDN URL)
    const modelCDN = process.env.NEXT_PUBLIC_MODEL_URL || 
      typeof window !== 'undefined' && (window as any).MODEL_URL;

    // Priority paths for model: CDN first, then local fallbacks
    const modelPaths = modelCDN 
      ? [
          modelCDN,
          '/U-2-Net/onnx/model.onnx',
          '/models/u2net/onnx/model.onnx',
          '/models/u2net/model.onnx',
        ]
      : [
          '/U-2-Net/onnx/model.onnx',
          '/models/u2net/onnx/model.onnx',
          '/models/u2net/model.onnx',
        ];

    let session: any = null;
    let lastError: Error | null = null;

    for (const modelPath of modelPaths) {
      try {
        onProgress?.(`Initializing model session from ${modelPath.includes('http') ? 'CDN' : 'local'}...`, 25);

        // 1. Try WASM with SIMD acceleration first (more stable for MaxPool operations)
        session = await ort.InferenceSession.create(modelPath, {
          executionProviders: ['wasm'],
          graphOptimizationLevel: 'all',
        });
        console.log(`[U-2-Net] Successfully initialized via WASM from ${modelPath}`);
        return session;
      } catch (wasmErr) {
        console.warn('[U-2-Net] WASM initialization failed, trying WebGPU:', wasmErr);
        
        // 2. Fallback to WebGPU if WASM fails and GPU is available
        if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
          try {
            session = await ort.InferenceSession.create(modelPath, {
              executionProviders: ['webgpu'],
              graphOptimizationLevel: 'all',
            });
            console.log(`[U-2-Net] Successfully initialized via WebGPU from ${modelPath}`);
            return session;
          } catch (gpuErr) {
            console.warn('[U-2-Net] WebGPU also failed:', gpuErr);
            lastError = gpuErr as Error;
          }
        } else {
          lastError = wasmErr as Error;
        }
      }
    }

    // Reset promise on total failure so user can retry
    inferenceSessionPromise = null;
    
    const errorMsg = modelCDN 
      ? `Failed to load U-2-Net model from CDN or local paths. Please check MODEL_URL configuration.`
      : `Failed to load U-2-Net model from local paths. Model file may be missing. Please download it from the repository.`;
    
    throw new Error(`${errorMsg} Last error: ${lastError?.message || 'File not found'}`);
  })();

  return inferenceSessionPromise;
}

export interface PreprocessedData {
  tensor: any;
  origWidth: number;
  origHeight: number;
  scaledWidth: number;
  scaledHeight: number;
  padX: number;
  padY: number;
  originalCanvas: HTMLCanvasElement;
}

/**
 * Preprocess image according to U-2-Net specification:
 * Target: 320x320, preserve aspect ratio, black padding.
 * Normalization: ImageNet mean [0.485, 0.456, 0.406], std [0.229, 0.224, 0.225].
 */
export async function preprocessImage(
  source: File | Blob | HTMLImageElement | HTMLCanvasElement | string,
  onProgress?: (step: string, pct: number) => void
): Promise<PreprocessedData> {
  onProgress?.('Preparing image canvas...', 35);

  let imgElement: HTMLImageElement;

  if (typeof source === 'string') {
    imgElement = await loadImageFromUrl(source);
  } else if (source instanceof HTMLImageElement) {
    imgElement = source;
  } else if (source instanceof HTMLCanvasElement) {
    const dataUrl = source.toDataURL();
    imgElement = await loadImageFromUrl(dataUrl);
  } else {
    // File or Blob
    const objectUrl = URL.createObjectURL(source);
    imgElement = await loadImageFromUrl(objectUrl);
  }

  const origWidth = imgElement.naturalWidth || imgElement.width;
  const origHeight = imgElement.naturalHeight || imgElement.height;

  if (!origWidth || !origHeight) {
    throw new Error('Invalid image dimensions detected.');
  }

  // Preserve full resolution copy on offscreen canvas
  const originalCanvas = document.createElement('canvas');
  originalCanvas.width = origWidth;
  originalCanvas.height = origHeight;
  const origCtx = originalCanvas.getContext('2d')!;
  origCtx.drawImage(imgElement, 0, 0);

  // Resize while maintaining aspect ratio inside 320x320
  const maxDim = Math.max(origWidth, origHeight);
  const scale = 320 / maxDim;
  const scaledWidth = Math.max(1, Math.round(origWidth * scale));
  const scaledHeight = Math.max(1, Math.round(origHeight * scale));
  const padX = Math.floor((320 - scaledWidth) / 2);
  const padY = Math.floor((320 - scaledHeight) / 2);

  // Draw scaled and padded image onto 320x320 canvas
  const canvas320 = document.createElement('canvas');
  canvas320.width = 320;
  canvas320.height = 320;
  const ctx320 = canvas320.getContext('2d')!;

  // Fill black background for letterbox
  ctx320.fillStyle = '#000000';
  ctx320.fillRect(0, 0, 320, 320);
  ctx320.drawImage(imgElement, 0, 0, origWidth, origHeight, padX, padY, scaledWidth, scaledHeight);

  const imageData = ctx320.getImageData(0, 0, 320, 320);
  const rgba = imageData.data;

  // Format as NCHW Float32 tensor [1, 3, 320, 320] with ImageNet normalization
  const floatData = new Float32Array(1 * 3 * 320 * 320);
  const planeSize = 320 * 320;

  const meanR = 0.485, meanG = 0.456, meanB = 0.406;
  const stdR = 0.229, stdG = 0.224, stdB = 0.225;

  for (let i = 0; i < planeSize; i++) {
    const r = rgba[i * 4] / 255.0;
    const g = rgba[i * 4 + 1] / 255.0;
    const b = rgba[i * 4 + 2] / 255.0;

    floatData[i] = (r - meanR) / stdR;
    floatData[planeSize + i] = (g - meanG) / stdG;
    floatData[2 * planeSize + i] = (b - meanB) / stdB;
  }

  const ort = await getOrt();
  const tensor = new ort.Tensor('float32', floatData, [1, 3, 320, 320]);

  return {
    tensor,
    origWidth,
    origHeight,
    scaledWidth,
    scaledHeight,
    padX,
    padY,
    originalCanvas,
  };
}

/**
 * Run U-2-Net segmentation on the preprocessed image and generate a binary mask
 */
export async function runU2NetSegmentation(
  preprocessed: PreprocessedData,
  threshold = 0.45,
  onProgress?: (step: string, pct: number) => void
): Promise<SegmentationMask> {
  const session = await getU2NetSession(onProgress);

  onProgress?.('Running U-2-Net salient object inference...', 60);

  // Identify input name ('input.1' or first inputName)
  const inputName = session.inputNames[0] || 'input.1';
  const feeds: Record<string, any> = { [inputName]: preprocessed.tensor };

  const results = await session.run(feeds);

  onProgress?.('Postprocessing salient probability mask...', 80);

  // Output '1959' is the fused composite salient mask
  const outputTensor = results['1959'] || results[session.outputNames[0]];
  if (!outputTensor) {
    throw new Error('U-2-Net produced empty inference outputs.');
  }

  const rawMaskData = outputTensor.data as Float32Array;

  // Min-max normalization for output logits to [0.0, 1.0]
  let minVal = Infinity;
  let maxVal = -Infinity;
  for (let i = 0; i < rawMaskData.length; i++) {
    const v = rawMaskData[i];
    if (v < minVal) minVal = v;
    if (v > maxVal) maxVal = v;
  }

  const range = maxVal - minVal > 1e-6 ? maxVal - minVal : 1;

  // Unpad: extract the valid scaledWidth x scaledHeight patch from 320x320
  const unpaddedCanvas = document.createElement('canvas');
  unpaddedCanvas.width = preprocessed.scaledWidth;
  unpaddedCanvas.height = preprocessed.scaledHeight;
  const unpaddedCtx = unpaddedCanvas.getContext('2d')!;
  const unpaddedImgData = unpaddedCtx.createImageData(preprocessed.scaledWidth, preprocessed.scaledHeight);

  for (let y = 0; y < preprocessed.scaledHeight; y++) {
    for (let x = 0; x < preprocessed.scaledWidth; x++) {
      const srcIdx = (preprocessed.padY + y) * 320 + (preprocessed.padX + x);
      const normVal = (rawMaskData[srcIdx] - minVal) / range;
      const byteVal = Math.round(normVal * 255);

      const dstIdx = (y * preprocessed.scaledWidth + x) * 4;
      unpaddedImgData.data[dstIdx] = byteVal;     // R
      unpaddedImgData.data[dstIdx + 1] = byteVal; // G
      unpaddedImgData.data[dstIdx + 2] = byteVal; // B
      unpaddedImgData.data[dstIdx + 3] = 255;      // A
    }
  }
  unpaddedCtx.putImageData(unpaddedImgData, 0, 0);

  // Resize mask to original image dimensions
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = preprocessed.origWidth;
  finalCanvas.height = preprocessed.origHeight;
  const finalCtx = finalCanvas.getContext('2d')!;

  finalCtx.imageSmoothingEnabled = true;
  finalCtx.imageSmoothingQuality = 'high';
  finalCtx.drawImage(
    unpaddedCanvas,
    0, 0, preprocessed.scaledWidth, preprocessed.scaledHeight,
    0, 0, preprocessed.origWidth, preprocessed.origHeight
  );

  const scaledMaskData = finalCtx.getImageData(0, 0, preprocessed.origWidth, preprocessed.origHeight);
  const finalPixels = scaledMaskData.data;

  // Create binary mask buffer (0 or 255)
  const totalPixels = preprocessed.origWidth * preprocessed.origHeight;
  const binaryMask = new Uint8Array(totalPixels);
  const thresholdByte = Math.round(threshold * 255);

  let minX = preprocessed.origWidth;
  let maxX = 0;
  let minY = preprocessed.origHeight;
  let maxY = 0;
  let foregroundCount = 0;

  for (let i = 0; i < totalPixels; i++) {
    const val = finalPixels[i * 4];
    if (val >= thresholdByte) {
      binaryMask[i] = 255;
      finalPixels[i * 4] = 255;
      finalPixels[i * 4 + 1] = 255;
      finalPixels[i * 4 + 2] = 255;
      finalPixels[i * 4 + 3] = 255;

      const x = i % preprocessed.origWidth;
      const y = Math.floor(i / preprocessed.origWidth);
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      foregroundCount++;
    } else {
      binaryMask[i] = 0;
      finalPixels[i * 4] = 0;
      finalPixels[i * 4 + 1] = 0;
      finalPixels[i * 4 + 2] = 0;
      finalPixels[i * 4 + 3] = 255;
    }
  }

  // Update canvas with binary mask for export
  finalCtx.putImageData(scaledMaskData, 0, 0);
  const maskDataUrl = finalCanvas.toDataURL('image/png');

  const bounds: BoundingBox = {
    minX: foregroundCount > 0 ? minX : 0,
    minY: foregroundCount > 0 ? minY : 0,
    maxX: foregroundCount > 0 ? maxX : preprocessed.origWidth,
    maxY: foregroundCount > 0 ? maxY : preprocessed.origHeight,
    width: foregroundCount > 0 ? maxX - minX + 1 : 0,
    height: foregroundCount > 0 ? maxY - minY + 1 : 0,
  };

  return {
    data: binaryMask,
    width: preprocessed.origWidth,
    height: preprocessed.origHeight,
    originalWidth: preprocessed.origWidth,
    originalHeight: preprocessed.origHeight,
    maskDataUrl,
    bounds,
  };
}

function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load specimen image: ${err}`));
    img.src = url;
  });
}
