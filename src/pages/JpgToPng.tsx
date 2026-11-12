import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  RotateCcw, 
  ArrowRightLeft, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Layers,
  FileCheck2
} from 'lucide-react';
import { convertJpgToPngClient, formatBytes, downloadFile } from '../utils/imageProcessing';
import { createSampleImage } from '../utils/samples';
import confetti from 'canvas-confetti';

export const JpgToPng: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('photo.jpg');
  const [fileSize, setFileSize] = useState<number>(0);
  const [removeWhiteMatte, setRemoveWhiteMatte] = useState<boolean>(false);
  
  // Converted result
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [pngBlob, setPngBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const runConversion = async (src: string, matte = removeWhiteMatte) => {
    setIsProcessing(true);
    try {
      const res = await convertJpgToPngClient(src, matte);
      setPngDataUrl(res.dataUrl);
      setPngBlob(res.blob);
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const handleFile = (file: File) => {
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      runConversion(src, removeWhiteMatte);
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSample = () => {
    const src = createSampleImage('gadget');
    setImageSrc(src);
    setFileName('sample-gadget.jpg');
    setFileSize(240000);
    runConversion(src, removeWhiteMatte);
  };

  const handleToggleMatte = (val: boolean) => {
    setRemoveWhiteMatte(val);
    if (imageSrc) runConversion(imageSrc, val);
  };

  const handleDownload = () => {
    if (!pngBlob) return;
    const clean = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
    downloadFile(pngBlob, `${clean}-converted.png`);
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
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Format Conversion</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Lossless 32-bit PNG</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            JPG to PNG Converter
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Convert lossy JPG/JPEG images into pristine 32-bit PNG format with optional transparency and full color depth.
          </p>
        </div>

        {imageSrc && (
          <button
            onClick={() => {
              setImageSrc(null);
              setPngDataUrl(null);
              setPngBlob(null);
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#0D1428] hover:bg-[#111C35] border border-slate-700/80 rounded-xl transition-colors cursor-pointer w-fit"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Convert Another File</span>
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
              accept="image/jpeg,image/jpg"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
              className="hidden"
            />
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#111C35] border border-slate-700 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:border-cyan-500/50 transition-all shadow-lg">
                <ArrowRightLeft className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Drop JPG or JPEG file here, or browse
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports .jpg, .jpeg standard and progressive image files
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
              >
                Select JPG File
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1428] border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Want to test format conversion with sample data?</span>
            <button
              onClick={handleLoadSample}
              className="px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 rounded-lg transition-colors cursor-pointer"
            >
              Load Test JPG
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Visual Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl bg-[#0D1428] border border-slate-800 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Converted 32-Bit PNG</span>
                <span className="font-mono text-cyan-400 font-bold">MIME: image/png</span>
              </div>
              
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#070B18] flex items-center justify-center p-3 relative checkerboard-bg">
                {pngDataUrl && (
                  <img
                    src={pngDataUrl}
                    alt="Converted PNG Result"
                    className="max-w-full max-h-full object-contain shadow-2xl"
                  />
                )}
                {isProcessing && (
                  <div className="absolute inset-0 bg-[#070B18]/70 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 font-mono">
                <span>Input: {fileName} ({formatBytes(fileSize)})</span>
                {pngBlob && <span>PNG Output: {formatBytes(pngBlob.size)}</span>}
              </div>
            </div>
          </div>

          {/* Options & Action (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 rounded-2xl bg-[#0D1428] border border-slate-800 space-y-5">
              <h3 className="text-sm font-bold text-white">PNG Export Options</h3>
              
              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-[#111C35] border border-slate-700/80 cursor-pointer hover:border-cyan-500/40 transition-colors">
                <input
                  type="checkbox"
                  checked={removeWhiteMatte}
                  onChange={(e) => handleToggleMatte(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 accent-cyan-400 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Transparent White Matte Removal
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Automatically convert pure white pixels in the image into transparent alpha channels.
                  </span>
                </div>
              </label>

              <div className="space-y-2 border-t border-slate-800 pt-4 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Converts 24-bit RGB JPEG to 32-bit RGBA PNG</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Preserves original pixel dimensions exactly</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111C35] to-[#0D1428] border border-cyan-500/30 space-y-4">
              <button
                onClick={handleDownload}
                disabled={!pngBlob || isProcessing}
                className="w-full py-3.5 px-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Download Converted PNG</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Lossless PNG · Zero Compression Artifacts</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
