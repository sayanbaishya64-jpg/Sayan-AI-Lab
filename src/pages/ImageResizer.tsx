import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Download, 
  RotateCcw, 
  Maximize2, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Sparkles,
  Check
} from 'lucide-react';
import { resizeImageClient, formatBytes, downloadFile } from '../utils/imageProcessing';
import { createSampleImage } from '../utils/samples';
import confetti from 'canvas-confetti';

export const ImageResizer: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('image.png');
  const [origDimensions, setOrigDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockRatio, setLockRatio] = useState<boolean>(true);
  
  // Results
  const [resizedDataUrl, setResizedDataUrl] = useState<string | null>(null);
  const [resizedBlob, setResizedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const applyResize = useCallback(async (src: string, w: number, h: number, maintainAspect: boolean) => {
    if (w <= 0 || h <= 0) return;
    setIsProcessing(true);
    try {
      const res = await resizeImageClient(src, {
        width: w,
        height: h,
        maintainAspectRatio: maintainAspect,
        format: 'image/png',
      });
      setResizedDataUrl(res.dataUrl);
      setResizedBlob(res.blob);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  }, []);

  const handleFile = (file: File) => {
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        setOrigDimensions({ width: w, height: h });
        setTargetWidth(w);
        setTargetHeight(h);
        setImageSrc(src);
        applyResize(src, w, h, true);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSample = () => {
    const src = createSampleImage('sneaker');
    const img = new Image();
    img.onload = () => {
      setOrigDimensions({ width: 800, height: 800 });
      setTargetWidth(800);
      setTargetHeight(800);
      setImageSrc(src);
      setFileName('sample-sneaker.png');
      applyResize(src, 800, 800, true);
    };
    img.src = src;
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    let newH = targetHeight;
    if (lockRatio && origDimensions.width > 0) {
      newH = Math.round((val * origDimensions.height) / origDimensions.width);
      setTargetHeight(newH);
    }
    if (imageSrc) applyResize(imageSrc, val, newH, false);
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    let newW = targetWidth;
    if (lockRatio && origDimensions.height > 0) {
      newW = Math.round((val * origDimensions.width) / origDimensions.height);
      setTargetWidth(newW);
    }
    if (imageSrc) applyResize(imageSrc, newW, val, false);
  };

  const applyPreset = (w: number, h: number) => {
    setTargetWidth(w);
    setTargetHeight(h);
    if (imageSrc) applyResize(imageSrc, w, h, false);
  };

  const applyPercentage = (pct: number) => {
    const newW = Math.round((origDimensions.width * pct) / 100);
    const newH = Math.round((origDimensions.height * pct) / 100);
    setTargetWidth(newW);
    setTargetHeight(newH);
    if (imageSrc) applyResize(imageSrc, newW, newH, false);
  };

  const handleDownload = () => {
    if (!resizedBlob) return;
    const clean = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    downloadFile(resizedBlob, `${clean}-${targetWidth}x${targetHeight}.png`);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#2563EB', '#38BDF8', '#FFFFFF']
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Dimensions & Scaling</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">High-Fidelity Interpolation</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Image Resizer
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Scale images to exact pixel dimensions, aspect ratio presets, or percentage scales without blurriness.
          </p>
        </div>

        {imageSrc && (
          <button
            onClick={() => {
              setImageSrc(null);
              setResizedDataUrl(null);
              setResizedBlob(null);
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#0D1428] hover:bg-[#111C35] border border-slate-700/80 rounded-xl transition-colors cursor-pointer w-fit"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Resize Another Image</span>
          </button>
        )}
      </div>

      {!imageSrc ? (
        <div className="space-y-8">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-cyan-400/80 rounded-3xl bg-[#0D1428]/60 hover:bg-[#0D1428] p-12 lg:p-16 text-center transition-all cursor-pointer group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
              className="hidden"
            />
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#111C35] border border-slate-700 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:border-cyan-500/50 transition-all shadow-lg">
                <Maximize2 className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Drop image to resize, or browse files
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG, and WebP (maintain sharp vectors & photos)
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
              >
                Choose Image File
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1428] border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Want to test right now with a sample image?</span>
            <button
              onClick={handleLoadSample}
              className="px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 rounded-lg transition-colors cursor-pointer"
            >
              Load Test Image
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Visual Canvas Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl bg-[#0D1428] border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Resized Preview</span>
                <span className="font-mono text-cyan-400 font-bold">
                  {targetWidth} × {targetHeight} px
                </span>
              </div>
              
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#070B18] flex items-center justify-center p-3 relative checkerboard-bg">
                {resizedDataUrl && (
                  <img
                    src={resizedDataUrl}
                    alt="Resized Result"
                    className="max-w-full max-h-full object-contain shadow-xl"
                  />
                )}
                {isProcessing && (
                  <div className="absolute inset-0 bg-[#070B18]/70 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
                <span>Original: {origDimensions.width} × {origDimensions.height} px</span>
                {resizedBlob && <span>File Size: {formatBytes(resizedBlob.size)}</span>}
              </div>
            </div>
          </div>

          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Custom Dimensions Form */}
            <div className="p-6 rounded-2xl bg-[#0D1428] border border-slate-800 space-y-5">
              <h3 className="text-sm font-bold text-white">Custom Dimensions</h3>
              
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Width (px)</label>
                  <input
                    type="number"
                    min="1"
                    max="8000"
                    value={targetWidth || ''}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#111C35] border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400">Height (px)</label>
                  <input
                    type="number"
                    min="1"
                    max="8000"
                    value={targetHeight || ''}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#111C35] border border-slate-700 rounded-xl text-sm font-mono text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Lock Aspect Ratio Toggle */}
              <button
                type="button"
                onClick={() => setLockRatio(!lockRatio)}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  lockRatio 
                    ? 'bg-blue-600/20 text-cyan-300 border-blue-500/50' 
                    : 'bg-[#111C35] text-slate-400 border-slate-700'
                }`}
              >
                {lockRatio ? <Lock className="w-3.5 h-3.5 text-cyan-400" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{lockRatio ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}</span>
              </button>

              {/* Quick Percentage Scaling */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs text-slate-400 block">Scale by Percentage</label>
                <div className="grid grid-cols-5 gap-1.5">
                  {[25, 50, 75, 150, 200].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => applyPercentage(pct)}
                      className="py-1.5 text-xs font-mono font-medium rounded-lg bg-[#111C35] hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Media & Standard Presets */}
            <div className="p-6 rounded-2xl bg-[#0D1428] border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Preset Canvas Sizes</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => applyPreset(1920, 1080)}
                  className="p-2.5 rounded-xl bg-[#111C35] hover:bg-slate-800 border border-slate-800 text-left cursor-pointer group"
                >
                  <div className="font-semibold text-white group-hover:text-cyan-400">Full HD 1080p</div>
                  <div className="text-[11px] text-slate-400 font-mono">1920 × 1080</div>
                </button>

                <button
                  onClick={() => applyPreset(1280, 720)}
                  className="p-2.5 rounded-xl bg-[#111C35] hover:bg-slate-800 border border-slate-800 text-left cursor-pointer group"
                >
                  <div className="font-semibold text-white group-hover:text-cyan-400">YouTube Thumb</div>
                  <div className="text-[11px] text-slate-400 font-mono">1280 × 720</div>
                </button>

                <button
                  onClick={() => applyPreset(1080, 1080)}
                  className="p-2.5 rounded-xl bg-[#111C35] hover:bg-slate-800 border border-slate-800 text-left cursor-pointer group"
                >
                  <div className="font-semibold text-white group-hover:text-cyan-400">Instagram Square</div>
                  <div className="text-[11px] text-slate-400 font-mono">1080 × 1080</div>
                </button>

                <button
                  onClick={() => applyPreset(1080, 1920)}
                  className="p-2.5 rounded-xl bg-[#111C35] hover:bg-slate-800 border border-slate-800 text-left cursor-pointer group"
                >
                  <div className="font-semibold text-white group-hover:text-cyan-400">Instagram Story</div>
                  <div className="text-[11px] text-slate-400 font-mono">1080 × 1920</div>
                </button>

                <button
                  onClick={() => applyPreset(1200, 675)}
                  className="p-2.5 rounded-xl bg-[#111C35] hover:bg-slate-800 border border-slate-800 text-left cursor-pointer group col-span-2"
                >
                  <div className="font-semibold text-white group-hover:text-cyan-400">Twitter / X Post</div>
                  <div className="text-[11px] text-slate-400 font-mono">1200 × 675 (16:9)</div>
                </button>
              </div>
            </div>

            {/* Download CTA Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111C35] to-[#0D1428] border border-cyan-500/30 space-y-4">
              <button
                onClick={handleDownload}
                disabled={!resizedBlob || isProcessing}
                className="w-full py-3.5 px-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Download Resized Image</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Lossless Quality · Instant Export</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
