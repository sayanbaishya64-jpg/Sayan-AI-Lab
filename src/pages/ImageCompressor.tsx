import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Download, 
  RotateCcw, 
  Minimize2, 
  Sliders, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Columns,
  Eye,
  FileImage
} from 'lucide-react';
import { compressImageClient, formatBytes, downloadFile } from '../utils/imageProcessing';
import { createSampleImage } from '../utils/samples';
import confetti from 'canvas-confetti';

export const ImageCompressor: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string>('image.jpg');
  const [originalSize, setOriginalSize] = useState<number>(0);
  
  // Settings
  const [quality, setQuality] = useState<number>(75); // 10 to 95%
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/webp');
  
  // Results
  const [compressedDataUrl, setCompressedDataUrl] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const runCompress = useCallback(async (src: string, q = quality, fmt = outputFormat) => {
    setIsProcessing(true);
    try {
      const res = await compressImageClient(src, {
        quality: q / 100,
        format: fmt,
      });
      setCompressedDataUrl(res.dataUrl);
      setCompressedBlob(res.blob);
      setCompressedSize(res.size);
      setDimensions({ width: res.width, height: res.height });
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  }, [quality, outputFormat]);

  const handleFile = (file: File) => {
    setOriginalName(file.name);
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      runCompress(src, quality, outputFormat);
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSample = () => {
    const src = createSampleImage('sneaker');
    setImageSrc(src);
    setOriginalName('sample-product.jpg');
    setOriginalSize(485200);
    runCompress(src, quality, outputFormat);
  };

  const handleQualityChange = (newQ: number) => {
    setQuality(newQ);
    if (imageSrc) {
      runCompress(imageSrc, newQ, outputFormat);
    }
  };

  const handleFormatChange = (newFmt: 'image/jpeg' | 'image/webp' | 'image/png') => {
    setOutputFormat(newFmt);
    if (imageSrc) {
      runCompress(imageSrc, quality, newFmt);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob) return;
    const ext = outputFormat === 'image/webp' ? 'webp' : (outputFormat === 'image/png' ? 'png' : 'jpg');
    const cleanName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
    downloadFile(compressedBlob, `${cleanName}-compressed.${ext}`);
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#2563EB', '#38BDF8', '#FFFFFF']
    });
  };

  const savedPercentage = originalSize > 0 && compressedSize > 0 
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
            <Minimize2 className="w-3.5 h-3.5" />
            <span>Image Optimization</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Lossless & Perceptual Compression</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Image Compressor
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Shrink image file size dramatically for faster web loading and email attachments, without noticeable loss in image quality.
          </p>
        </div>

        {imageSrc && (
          <button
            onClick={() => {
              setImageSrc(null);
              setCompressedDataUrl(null);
              setCompressedBlob(null);
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#0D1428] hover:bg-[#111C35] border border-slate-700/80 rounded-xl transition-colors cursor-pointer w-fit"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Compress Another Image</span>
          </button>
        )}
      </div>

      {!imageSrc ? (
        <div className="space-y-8">
          {/* Upload Drop Zone */}
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
                <Minimize2 className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Drop image to compress, or browse files
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG, and WebP (up to 50MB)
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

          {/* Quick Demo */}
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
          
          {/* Visual Preview Side-by-Side (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Stats Header Bar */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#0D1428] border border-slate-800 rounded-2xl text-center">
              <div>
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Original</span>
                <span className="text-base font-bold text-white font-mono">{formatBytes(originalSize)}</span>
              </div>
              <div className="border-x border-slate-800">
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Compressed</span>
                <span className="text-base font-bold text-cyan-400 font-mono">
                  {isProcessing ? 'Calculating...' : formatBytes(compressedSize)}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider">Saved</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {savedPercentage > 0 ? `-${savedPercentage}%` : '0%'}
                </span>
              </div>
            </div>

            {/* Preview Viewport */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Card */}
              <div className="rounded-2xl bg-[#0D1428] border border-slate-800 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-semibold text-white">Original Image</span>
                  <span className="font-mono">{formatBytes(originalSize)}</span>
                </div>
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#070B18] flex items-center justify-center p-2">
                  <img
                    src={imageSrc}
                    alt="Original Preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>

              {/* Compressed Card */}
              <div className="rounded-2xl bg-[#0D1428] border border-cyan-500/30 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="font-semibold text-cyan-400">Compressed Output</span>
                  <span className="font-mono text-cyan-300 font-semibold">{formatBytes(compressedSize)}</span>
                </div>
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#070B18] flex items-center justify-center p-2 relative">
                  {compressedDataUrl && (
                    <img
                      src={compressedDataUrl}
                      alt="Compressed Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  )}
                  {isProcessing && (
                    <div className="absolute inset-0 bg-[#070B18]/70 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {dimensions && (
              <div className="text-xs text-slate-400 text-center font-mono">
                Dimensions: {dimensions.width} × {dimensions.height} pixels
              </div>
            )}
          </div>

          {/* Controls Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Compression Settings Card */}
            <div className="p-6 rounded-2xl bg-[#0D1428] border border-slate-800 space-y-6">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Compression Settings</h3>
              </div>

              {/* Quality Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">Target Quality</span>
                  <span className="font-mono text-cyan-400 font-bold">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  step="5"
                  value={quality}
                  onChange={(e) => handleQualityChange(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Maximum Compression (10%)</span>
                  <span>Highest Quality (95%)</span>
                </div>
              </div>

              {/* Output Format Tabs */}
              <div className="space-y-2">
                <label className="text-xs text-slate-300 block">Output Format</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleFormatChange('image/webp')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                      outputFormat === 'image/webp'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'border-slate-800 bg-[#111C35] text-slate-300 hover:text-white'
                    }`}
                  >
                    WebP (Best)
                  </button>
                  <button
                    onClick={() => handleFormatChange('image/jpeg')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                      outputFormat === 'image/jpeg'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'border-slate-800 bg-[#111C35] text-slate-300 hover:text-white'
                    }`}
                  >
                    JPEG
                  </button>
                  <button
                    onClick={() => handleFormatChange('image/png')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                      outputFormat === 'image/png'
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'border-slate-800 bg-[#111C35] text-slate-300 hover:text-white'
                    }`}
                  >
                    PNG
                  </button>
                </div>
              </div>
            </div>

            {/* Download CTA Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111C35] to-[#0D1428] border border-cyan-500/30 space-y-4">
              <button
                onClick={handleDownload}
                disabled={!compressedBlob || isProcessing}
                className="w-full py-3.5 px-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed ({formatBytes(compressedSize)})</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero Cloud Storage · 100% Free</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
