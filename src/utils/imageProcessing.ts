/**
 * SAYAN AI LAB - Client-Side Image Processing Engine
 * High-performance, zero-latency canvas operations with privacy-first execution.
 */

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image: ' + e));
    img.src = src;
  });
}

export interface AiRemoveBackgroundOptions {
  model?: 'isnet_quint8' | 'isnet_fp16' | 'isnet';
  onProgress?: (stage: string, percent: number) => void;
  publicPath?: string;
}

/**
 * Real Deep Learning AI Background Removal using IS-Net / U2Net architecture.
 * Executes on-device inside WebAssembly / WebGL with ONNX Runtime.
 */
export async function removeBackgroundAi(
  imageSource: string | Blob | File | HTMLImageElement,
  options: AiRemoveBackgroundOptions = {}
): Promise<{ dataUrl: string; width: number; height: number; blob: Blob; timeMs: number }> {
  const startTime = performance.now();

  options.onProgress?.('Loading ONNX neural runtime...', 5);
  
  // Lazy-load @imgly/background-removal to keep initial bundle ultra-fast
  const { removeBackground } = await import('@imgly/background-removal');

  let sourceToProcess: Blob | string = imageSource as any;

  // If HTMLImageElement, convert to high-res Blob
  if (typeof imageSource === 'object' && imageSource !== null && 'naturalWidth' in imageSource) {
    const canvas = document.createElement('canvas');
    canvas.width = (imageSource as HTMLImageElement).naturalWidth || (imageSource as HTMLImageElement).width;
    canvas.height = (imageSource as HTMLImageElement).naturalHeight || (imageSource as HTMLImageElement).height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');
    ctx.drawImage(imageSource as HTMLImageElement, 0, 0);
    sourceToProcess = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/png'));
  } else if (typeof imageSource === 'string' && imageSource.startsWith('data:')) {
    // Convert data URI to Blob
    const res = await fetch(imageSource);
    sourceToProcess = await res.blob();
  }

  const modelChoice = options.model || 'isnet_quint8';
  let lastPercent = 10;

  const handleProgress = (key: string, current: number, total: number) => {
    if (!options.onProgress) return;

    let stageDesc = 'Analyzing visual features...';
    let percent = lastPercent;

    if (key.startsWith('fetch:')) {
      if (total > 0) {
        const fetchPct = Math.round((current / total) * 100);
        percent = Math.min(50, Math.round(10 + fetchPct * 0.4));
        stageDesc = `Downloading AI segmentation weights (${fetchPct}% of ${formatBytes(total)})...`;
      } else {
        stageDesc = 'Downloading neural model weights...';
      }
    } else if (key === 'compute:decode') {
      stageDesc = 'Decoding & preparing high-resolution input tensor...';
      percent = 55;
    } else if (key === 'compute:inference') {
      stageDesc = 'Executing neural network inference on foreground subjects...';
      percent = 75;
    } else if (key === 'compute:mask') {
      stageDesc = 'Extracting subject mask and preserving fine edge contours...';
      percent = 88;
    } else if (key === 'compute:encode') {
      stageDesc = 'Generating 32-bit transparent PNG with alpha channel...';
      percent = 95;
    }

    lastPercent = percent;
    options.onProgress(stageDesc, percent);
  };

  const config = {
    model: modelChoice,
    publicPath: options.publicPath || 'https://staticimgly.com/@imgly/background-removal-data/1.7.0/dist/',
    progress: handleProgress,
    rescale: true,
    debug: false,
    output: {
      format: 'image/png' as const,
      quality: 1.0,
    },
  };

  try {
    options.onProgress?.('Initializing neural segmentation pipeline...', 10);
    const resultBlob = await removeBackground(sourceToProcess, config);

    // Create object URL and probe dimensions
    const dataUrl = URL.createObjectURL(resultBlob);
    const probeImg = await loadImage(dataUrl);
    const width = probeImg.naturalWidth || probeImg.width;
    const height = probeImg.naturalHeight || probeImg.height;
    const timeMs = Math.round(performance.now() - startTime);

    options.onProgress?.('Background removal completed successfully!', 100);

    return {
      dataUrl,
      blob: resultBlob,
      width,
      height,
      timeMs,
    };
  } catch (err: any) {
    console.error('AI background removal error:', err);
    throw new Error(
      err?.message || 'Neural network failed to process image. Please check network connection or try another image.'
    );
  }
}

export interface RemoveBackgroundOptions {
  tolerance: number; // 1 to 100
  featherRadius: number; // 0 to 10
  colorFilter?: string; // hex or 'auto'
}

/**
 * Fast client-side color-chroma heuristic (used as secondary fallback or quick preview).
 */
export async function removeBackgroundClient(
  imageSource: string | HTMLImageElement,
  options: RemoveBackgroundOptions = { tolerance: 35, featherRadius: 2 }
): Promise<{ dataUrl: string; width: number; height: number; blob: Blob }> {
  const img = typeof imageSource === 'string' ? await loadImage(imageSource) : imageSource;
  
  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  // Maximum dimension for performant web canvas processing
  const maxDim = 2048;
  let targetWidth = width;
  let targetHeight = height;
  if (width > maxDim || height > maxDim) {
    const ratio = Math.min(maxDim / width, maxDim / height);
    targetWidth = Math.round(width * ratio);
    targetHeight = Math.round(height * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D context not available');

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
  const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
  const data = imgData.data;

  // Sample perimeter colors (corners and borders) to accurately detect background chroma
  const bgSamples: [number, number, number][] = [];
  const samplePoints: [number, number][] = [
    [0, 0],
    [targetWidth - 1, 0],
    [0, targetHeight - 1],
    [targetWidth - 1, targetHeight - 1],
    [Math.floor(targetWidth / 2), 0],
    [Math.floor(targetWidth / 2), targetHeight - 1],
    [0, Math.floor(targetHeight / 2)],
    [targetWidth - 1, Math.floor(targetHeight / 2)],
  ];

  for (const [x, y] of samplePoints) {
    const idx = (y * targetWidth + x) * 4;
    bgSamples.push([data[idx], data[idx + 1], data[idx + 2]]);
  }

  // Calculate median / primary background color from samples
  let sumR = 0, sumG = 0, sumB = 0;
  for (const [r, g, b] of bgSamples) {
    sumR += r;
    sumG += g;
    sumB += b;
  }
  const avgR = sumR / bgSamples.length;
  const avgG = sumG / bgSamples.length;
  const avgB = sumB / bgSamples.length;

  const tol = options.tolerance * 2.55; // scale 0-255

  // Saliency map & alpha assignment
  for (let y = 0; y < targetHeight; y++) {
    for (let x = 0; x < targetWidth; x++) {
      const idx = (y * targetWidth + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Measure minimum distance to any perimeter sample or average
      let minDist = Math.sqrt(
        Math.pow(r - avgR, 2) + Math.pow(g - avgG, 2) + Math.pow(b - avgB, 2)
      );

      for (const [sr, sg, sb] of bgSamples) {
        const d = Math.sqrt(
          Math.pow(r - sr, 2) + Math.pow(g - sg, 2) + Math.pow(b - sb, 2)
        );
        if (d < minDist) minDist = d;
      }

      // Proximity to border increases likelihood of background
      const normDistFromCenter = Math.sqrt(
        Math.pow((x - targetWidth / 2) / (targetWidth / 2), 2) +
        Math.pow((y - targetHeight / 2) / (targetHeight / 2), 2)
      );

      const effectiveTol = tol * (0.85 + 0.3 * Math.min(normDistFromCenter, 1.2));

      if (minDist < effectiveTol) {
        const factor = minDist / effectiveTol;
        if (factor < 0.6) {
          data[idx + 3] = 0; // fully transparent
        } else {
          // soft smooth edge transition
          data[idx + 3] = Math.round(((factor - 0.6) / 0.4) * 255);
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const dataUrl = canvas.toDataURL('image/png');
  const blob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), 'image/png'));

  return {
    dataUrl,
    width: targetWidth,
    height: targetHeight,
    blob,
  };
}

export interface CompressOptions {
  quality: number; // 0.1 to 1.0
  format: 'image/jpeg' | 'image/webp' | 'image/png';
  maxWidth?: number;
  maxHeight?: number;
}

export async function compressImageClient(
  file: File | Blob | string,
  options: CompressOptions
): Promise<{ blob: Blob; dataUrl: string; width: number; height: number; size: number }> {
  let img: HTMLImageElement;
  if (typeof file === 'string') {
    img = await loadImage(file);
  } else {
    const objectUrl = URL.createObjectURL(file);
    img = await loadImage(objectUrl);
    URL.revokeObjectURL(objectUrl);
  }

  let width = img.naturalWidth || img.width;
  let height = img.naturalHeight || img.height;

  if (options.maxWidth && width > options.maxWidth) {
    height = Math.round((height * options.maxWidth) / width);
    width = options.maxWidth;
  }
  if (options.maxHeight && height > options.maxHeight) {
    width = Math.round((width * options.maxHeight) / height);
    height = options.maxHeight;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context failure');

  // Fill white if converting to JPEG to prevent black transparency background
  if (options.format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }

  ctx.drawImage(img, 0, 0, width, height);

  const dataUrl = canvas.toDataURL(options.format, options.quality);
  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), options.format, options.quality)
  );

  return {
    blob,
    dataUrl,
    width,
    height,
    size: blob.size,
  };
}

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  format?: 'image/png' | 'image/jpeg' | 'image/webp';
  quality?: number;
}

export async function resizeImageClient(
  file: File | Blob | string,
  options: ResizeOptions
): Promise<{ blob: Blob; dataUrl: string; width: number; height: number; size: number }> {
  let img: HTMLImageElement;
  if (typeof file === 'string') {
    img = await loadImage(file);
  } else {
    const objectUrl = URL.createObjectURL(file);
    img = await loadImage(objectUrl);
    URL.revokeObjectURL(objectUrl);
  }

  const origWidth = img.naturalWidth || img.width;
  const origHeight = img.naturalHeight || img.height;

  let targetWidth = options.width;
  let targetHeight = options.height;

  if (options.maintainAspectRatio) {
    const ratio = origWidth / origHeight;
    if (targetWidth / targetHeight > ratio) {
      targetWidth = Math.round(targetHeight * ratio);
    } else {
      targetHeight = Math.round(targetWidth / ratio);
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context failure');

  // High quality interpolation
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const format = options.format || 'image/png';
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  const quality = options.quality ?? 0.92;
  const dataUrl = canvas.toDataURL(format, quality);
  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b!), format, quality)
  );

  return {
    blob,
    dataUrl,
    width: targetWidth,
    height: targetHeight,
    size: blob.size,
  };
}

export async function convertJpgToPngClient(
  file: File | Blob | string,
  transparentMatte: boolean = false
): Promise<{ blob: Blob; dataUrl: string; size: number }> {
  let img: HTMLImageElement;
  if (typeof file === 'string') {
    img = await loadImage(file);
  } else {
    const objectUrl = URL.createObjectURL(file);
    img = await loadImage(objectUrl);
    URL.revokeObjectURL(objectUrl);
  }

  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas context failure');

  ctx.drawImage(img, 0, 0, width, height);

  if (transparentMatte) {
    // If user requests transparent white matte removal
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 245 && data[i + 1] > 245 && data[i + 2] > 245) {
        data[i + 3] = 0;
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  const dataUrl = canvas.toDataURL('image/png');
  const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), 'image/png'));

  return {
    blob,
    dataUrl,
    size: blob.size,
  };
}

export function downloadFile(blobOrUrl: Blob | string, filename: string) {
  const url = typeof blobOrUrl === 'string' ? blobOrUrl : URL.createObjectURL(blobOrUrl);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  if (typeof blobOrUrl !== 'string') {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
