import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Upload, 
  Download, 
  RotateCcw, 
  Scissors, 
  Sliders, 
  Check, 
  Eye, 
  Columns, 
  Layers, 
  ShieldCheck, 
  Palette, 
  Brush, 
  Eraser, 
  Sparkles,
  AlertCircle,
  Cpu,
  RefreshCw,
  Clock,
  Zap
} from 'lucide-react';
import { removeBackgroundAi, formatBytes, downloadFile } from '../utils/imageProcessing';
import { REAL_SAMPLE_IMAGES } from '../utils/samples';
import confetti from 'canvas-confetti';

export const BackgroundRemover: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<{ name: string; size: number } | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  
  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [processingTimeMs, setProcessingTimeMs] = useState<number | null>(null);
  const [outputDimensions, setOutputDimensions] = useState<{ width: number; height: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // AI Model Selection
  const [modelType, setModelType] = useState<'isnet_quint8' | 'isnet_fp16'>('isnet_quint8');

  // Background options
  const [bgColor, setBgColor] = useState<string>('transparent');
  const [customColor, setCustomColor] = useState<string>('#FFFFFF');
  
  // View mode
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side' | 'result-only'>('split');
  const [splitPos, setSplitPos] = useState<number>(50); // percentage 0-100
  const isDraggingSplit = useRef(false);

  // Manual brush refinement
  const [isBrushMode, setIsBrushMode] = useState(false);
  const [brushTool, setBrushTool] = useState<'erase' | 'restore'>('erase');
  const [brushSize, setBrushSize] = useState<number>(30);
  const brushCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isPainting = useRef(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Execute actual AI background removal
  const runAiRemoval = useCallback(async (source: string | Blob | File, model = modelType) => {
    setIsProcessing(true);
    setError(null);
    setProgressPercent(5);
    setProgressStatus('Initializing AI neural runtime & ONNX environment...');
    
    try {
      const result = await removeBackgroundAi(source, {
        model,
        onProgress: (stage, percent) => {
          setProgressStatus(stage);
          setProgressPercent(percent);
        },
      });

      setProcessedImage(result.dataUrl);
      setProcessedBlob(result.blob);
      setOutputDimensions({ width: result.width, height: result.height });
      setProcessingTimeMs(result.timeMs);
      setIsProcessing(false);
      setProgressStatus('');

      // Confetti celebratory feedback
      confetti({
        particleCount: 40,
        spread: 65,
        origin: { y: 0.8 },
        colors: ['#2563EB', '#38BDF8', '#FFFFFF']
      });
    } catch (err: any) {
      console.error('Background removal failure:', err);
      let errorMsg = err?.message || 'Failed to remove background.';
      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('network') || errorMsg.includes('publicPath')) {
        errorMsg = 'Network connectivity issue downloading AI model weights. Please check your internet connection and try again.';
      } else if (errorMsg.includes('memory') || errorMsg.includes('out of memory')) {
        errorMsg = 'Browser WebAssembly memory limit reached. Try using a slightly smaller image resolution.';
      }
      setError(errorMsg);
      setIsProcessing(false);
      setProgressStatus('');
    }
  }, [modelType]);

  // Handle user file upload
  const handleFile = (file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)/)) {
      setError('Please upload a valid JPG, PNG, or WebP photograph.');
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setError('File size exceeds the 30MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setOriginalImage(src);
      setOriginalFile({ name: file.name, size: file.size });
      runAiRemoval(file);
    };
    reader.readAsDataURL(file);
  };

  // Load real photographic sample image
  const handleLoadSample = async (sampleKey: keyof typeof REAL_SAMPLE_IMAGES) => {
    const sample = REAL_SAMPLE_IMAGES[sampleKey];
    setOriginalImage(sample.url);
    setOriginalFile({ name: `${sample.id}-sample.jpg`, size: 340000 });
    
    try {
      // Fetch the sample image asset as a Blob
      const res = await fetch(sample.url);
      const blob = await res.blob();
      runAiRemoval(blob);
    } catch (e) {
      // Fallback passing URL directly
      runAiRemoval(sample.url);
    }
  };

  const handleReset = () => {
    setOriginalImage(null);
    setOriginalFile(null);
    setProcessedImage(null);
    setProcessedBlob(null);
    setOutputDimensions(null);
    setProcessingTimeMs(null);
    setError(null);
    setIsBrushMode(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Split-slider drag handlers
  const handleSplitMouseMove = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!isDraggingSplit.current) return;
    const container = document.getElementById('split-container');
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setSplitPos(Math.round((x / rect.width) * 100));
  };

  useEffect(() => {
    const handleUp = () => {
      isDraggingSplit.current = false;
      isPainting.current = false;
    };
    window.addEventListener('mouseup', handleUp);
    return () => window.removeEventListener('mouseup', handleUp);
  }, []);

  // Download final result
  const handleDownload = () => {
    if (!processedImage) return;

    const baseName = originalFile?.name ? originalFile.name.substring(0, originalFile.name.lastIndexOf('.')) : 'sayan-ai-lab';

    if (bgColor === 'transparent') {
      downloadFile(processedBlob || processedImage, `${baseName}-transparent-bg.png`);
    } else {
      // Composite onto chosen background color
      const canvas = document.createElement('canvas');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = bgColor === 'custom' ? customColor : bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          downloadFile(canvas.toDataURL('image/png'), `${baseName}-${bgColor.replace('#', '')}.png`);
        }
      };
      img.src = processedImage;
    }
  };

  // Manual brush refinement handlers
  const handleBrushDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isBrushMode || !isPainting.current || !brushCanvasRef.current) return;
    const canvas = brushCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    ctx.save();
    if (brushTool === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize * scaleX * 0.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Restore mode: copy pixels from original image
      ctx.globalCompositeOperation = 'source-over';
      const orig = new Image();
      orig.src = originalImage!;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, brushSize * scaleX * 0.5, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(orig, 0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    ctx.restore();
  };

  const handleFinishBrush = () => {
    if (brushCanvasRef.current) {
      const updatedDataUrl = brushCanvasRef.current.toDataURL('image/png');
      setProcessedImage(updatedDataUrl);
      brushCanvasRef.current.toBlob((b) => setProcessedBlob(b), 'image/png');
    }
    setIsBrushMode(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Real Deep Learning Vision Model</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">IS-Net / RMBG Architecture</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            AI Background Remover
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Detects main subjects, preserves fine hair strands, and removes backgrounds with genuine neural network segmentation. 100% processed in your browser.
          </p>
        </div>

        {originalImage && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#0D1428] hover:bg-[#111C35] border border-slate-700/80 rounded-xl transition-colors cursor-pointer w-fit"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Upload New Photo</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start justify-between gap-3 text-red-200 text-sm">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-300">Processing Error</p>
              <p className="text-xs text-red-200/90 mt-0.5">{error}</p>
            </div>
          </div>
          {originalImage && (
            <button
              onClick={() => runAiRemoval(originalImage, modelType)}
              className="px-3 py-1.5 text-xs font-semibold bg-red-800 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          )}
        </div>
      )}

      {/* STATE 1: UPLOAD & REAL PHOTO SAMPLES */}
      {!originalImage ? (
        <div className="space-y-8">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="group relative border-2 border-dashed border-slate-700/80 hover:border-cyan-400/80 rounded-3xl bg-[#0D1428]/60 hover:bg-[#0D1428] p-12 lg:p-16 text-center transition-all duration-300 cursor-pointer"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
              className="hidden"
            />
            
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#111C35] border border-slate-700 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:border-cyan-500/50 transition-all shadow-lg shadow-blue-900/10">
                <Upload className="w-8 h-8 text-cyan-400" />
              </div>
              
              <div>
                <p className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Drag and drop photograph here, or browse
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, JPEG, PNG, and WebP (up to 30MB)
                </p>
              </div>

              <div className="pt-2">
                <span className="inline-block px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/30">
                  Select Photograph from Device
                </span>
              </div>
            </div>
          </div>

          {/* Genuine Real Photographic Samples for 1-Click Testing */}
          <div className="p-6 rounded-2xl bg-[#0D1428] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Test with Real Photographic Samples</h3>
                <p className="text-xs text-slate-400">Click any photograph below to test genuine AI hair, edge, and subject segmentation:</p>
              </div>
              <span className="text-[11px] text-cyan-400 font-mono">GENUINE PHOTO FIXTURES</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Sample 1: Portrait */}
              <button
                onClick={() => handleLoadSample('portrait')}
                className="flex items-center gap-3.5 p-3 rounded-xl bg-[#111C35] hover:bg-[#162444] border border-slate-700/80 hover:border-cyan-500/50 text-left transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
                  <img
                    src={REAL_SAMPLE_IMAGES.portrait.url}
                    alt="Sample Portrait"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white group-hover:text-cyan-400 truncate">
                      {REAL_SAMPLE_IMAGES.portrait.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-cyan-300 font-medium mt-0.5">
                    {REAL_SAMPLE_IMAGES.portrait.badge}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {REAL_SAMPLE_IMAGES.portrait.desc}
                  </div>
                </div>
              </button>

              {/* Sample 2: Sneaker Product */}
              <button
                onClick={() => handleLoadSample('sneaker')}
                className="flex items-center gap-3.5 p-3 rounded-xl bg-[#111C35] hover:bg-[#162444] border border-slate-700/80 hover:border-cyan-500/50 text-left transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
                  <img
                    src={REAL_SAMPLE_IMAGES.sneaker.url}
                    alt="Sample Sneaker"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white group-hover:text-cyan-400 truncate">
                      {REAL_SAMPLE_IMAGES.sneaker.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-blue-300 font-medium mt-0.5">
                    {REAL_SAMPLE_IMAGES.sneaker.badge}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {REAL_SAMPLE_IMAGES.sneaker.desc}
                  </div>
                </div>
              </button>

              {/* Sample 3: Fluffy Cat */}
              <button
                onClick={() => handleLoadSample('cat')}
                className="flex items-center gap-3.5 p-3 rounded-xl bg-[#111C35] hover:bg-[#162444] border border-slate-700/80 hover:border-cyan-500/50 text-left transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-900 shrink-0 border border-slate-700">
                  <img
                    src={REAL_SAMPLE_IMAGES.cat.url}
                    alt="Sample Cat"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white group-hover:text-cyan-400 truncate">
                      {REAL_SAMPLE_IMAGES.cat.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-teal-300 font-medium mt-0.5">
                    {REAL_SAMPLE_IMAGES.cat.badge}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {REAL_SAMPLE_IMAGES.cat.desc}
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* STATE 2: ACTIVE EDITOR */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Visual Workspace (8 columns) */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Viewport Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-2 bg-[#0D1428] border border-slate-800 rounded-xl">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setViewMode('split')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'split' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Split Slider</span>
                </button>
                <button
                  onClick={() => setViewMode('side-by-side')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'side-by-side' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Side-by-Side</span>
                </button>
                <button
                  onClick={() => setViewMode('result-only')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                    viewMode === 'result-only' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Result Only</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsBrushMode(!isBrushMode);
                    if (!isBrushMode && processedImage) {
                      setTimeout(() => {
                        if (brushCanvasRef.current) {
                          const img = new Image();
                          img.onload = () => {
                            const c = brushCanvasRef.current!;
                            c.width = img.width;
                            c.height = img.height;
                            const ctx = c.getContext('2d');
                            ctx?.drawImage(img, 0, 0);
                          };
                          img.src = processedImage;
                        }
                      }, 50);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    isBrushMode 
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' 
                      : 'border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Brush className="w-3.5 h-3.5" />
                  <span>{isBrushMode ? 'Exit Brush' : 'Refine Brush'}</span>
                </button>
              </div>
            </div>

            {/* Canvas Viewport */}
            <div 
              id="split-container"
              onMouseMove={handleSplitMouseMove}
              className="relative w-full aspect-[4/3] max-h-[580px] rounded-2xl border border-slate-800 overflow-hidden select-none bg-[#070B18]"
            >
              {/* REAL AI PROCESSING OVERLAY WITH LIVE PROGRESS BAR */}
              {isProcessing && (
                <div className="absolute inset-0 z-30 bg-[#070B18]/90 backdrop-blur-md flex flex-col items-center justify-center p-8 space-y-5">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-800 border-t-cyan-400 animate-spin" />
                    <Cpu className="w-7 h-7 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  
                  <div className="text-center space-y-2 max-w-md w-full">
                    <p className="text-base font-bold text-white flex items-center justify-center gap-2">
                      <span>Neural Subject Segmentation</span>
                      <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                        {progressPercent}%
                      </span>
                    </p>
                    <p className="text-xs text-slate-300 font-mono leading-relaxed">
                      {progressStatus || 'Running IS-Net neural network...'}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                      <div
                        className="bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-400 h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    
                    <p className="text-[11px] text-slate-500 pt-1">
                      Model runs directly on your device GPU/WASM with zero server uploads
                    </p>
                  </div>
                </div>
              )}

              {/* BRUSH MODE ACTIVE */}
              {isBrushMode ? (
                <div className="relative w-full h-full checkerboard-bg flex items-center justify-center p-4">
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-2 p-1.5 bg-[#0D1428]/95 border border-slate-700 rounded-xl shadow-xl">
                    <button
                      onClick={() => setBrushTool('erase')}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                        brushTool === 'erase' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Eraser className="w-3.5 h-3.5" />
                      <span>Erase</span>
                    </button>
                    <button
                      onClick={() => setBrushTool('restore')}
                      className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                        brushTool === 'restore' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Brush className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>
                    <div className="flex items-center gap-2 px-2 text-xs text-slate-300">
                      <span>Size: {brushSize}px</span>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        value={brushSize}
                        onChange={(e) => setBrushSize(Number(e.target.value))}
                        className="w-20 accent-cyan-400"
                      />
                    </div>
                    <button
                      onClick={handleFinishBrush}
                      className="px-2.5 py-1 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                    >
                      Apply Edits
                    </button>
                  </div>
                  <canvas
                    ref={brushCanvasRef}
                    onMouseDown={(e) => {
                      isPainting.current = true;
                      handleBrushDraw(e);
                    }}
                    onMouseMove={handleBrushDraw}
                    className="max-w-full max-h-full object-contain cursor-crosshair shadow-2xl"
                  />
                </div>
              ) : (
                /* REGULAR VIEW MODES */
                <>
                  {viewMode === 'split' && (
                    <div className="relative w-full h-full">
                      {/* Processed image layer (Underneath, showing custom or transparent BG) */}
                      <div 
                        className="absolute inset-0 w-full h-full flex items-center justify-center"
                        style={{
                          backgroundColor: bgColor === 'transparent' ? undefined : (bgColor === 'custom' ? customColor : bgColor)
                        }}
                      >
                        {bgColor === 'transparent' && <div className="absolute inset-0 checkerboard-bg" />}
                        {processedImage && (
                          <img
                            src={processedImage}
                            alt="Processed Result"
                            className="relative w-full h-full object-contain pointer-events-none"
                          />
                        )}
                        <span className="absolute bottom-3 right-3 text-[11px] font-mono uppercase px-2 py-0.5 bg-black/75 text-cyan-400 rounded backdrop-blur-sm z-10 border border-cyan-500/30">
                          AI Result
                        </span>
                      </div>

                      {/* Original image layer (Clipped by splitPos) */}
                      <div
                        className="absolute inset-0 overflow-hidden"
                        style={{ width: `${splitPos}%` }}
                      >
                        <div className="relative w-full h-full" style={{ width: '100%' }}>
                          <img
                            src={originalImage}
                            alt="Original"
                            className="w-full h-full object-contain pointer-events-none"
                            style={{ minWidth: '100%', minHeight: '100%' }}
                          />
                          <span className="absolute bottom-3 left-3 text-[11px] font-mono uppercase px-2 py-0.5 bg-black/75 text-slate-300 rounded backdrop-blur-sm border border-slate-700">
                            Original Photo
                          </span>
                        </div>
                      </div>

                      {/* Split Divider Handle */}
                      <div
                        className="absolute top-0 bottom-0 z-20 w-0.5 bg-cyan-400 cursor-ew-resize flex items-center justify-center shadow-[0_0_10px_rgba(56,189,248,0.8)]"
                        style={{ left: `${splitPos}%` }}
                        onMouseDown={() => (isDraggingSplit.current = true)}
                      >
                        <div className="w-7 h-7 -ml-3.5 rounded-full bg-cyan-400 text-[#070B18] shadow-lg flex items-center justify-center font-bold text-xs select-none pointer-events-none">
                          ↔
                        </div>
                      </div>
                    </div>
                  )}

                  {viewMode === 'side-by-side' && (
                    <div className="grid grid-cols-2 w-full h-full divide-x divide-slate-800">
                      {/* Left: Original */}
                      <div className="relative w-full h-full p-2 flex items-center justify-center bg-[#0D1428]">
                        <img
                          src={originalImage}
                          alt="Original"
                          className="max-w-full max-h-full object-contain"
                        />
                        <span className="absolute bottom-3 left-3 text-[11px] font-mono uppercase px-2 py-0.5 bg-black/75 text-slate-300 rounded">
                          Original Photo
                        </span>
                      </div>
                      {/* Right: Processed */}
                      <div 
                        className="relative w-full h-full p-2 flex items-center justify-center"
                        style={{
                          backgroundColor: bgColor === 'transparent' ? undefined : (bgColor === 'custom' ? customColor : bgColor)
                        }}
                      >
                        {bgColor === 'transparent' && <div className="absolute inset-0 checkerboard-bg" />}
                        {processedImage && (
                          <img
                            src={processedImage}
                            alt="Background Removed"
                            className="relative max-w-full max-h-full object-contain"
                          />
                        )}
                        <span className="absolute bottom-3 right-3 text-[11px] font-mono uppercase px-2 py-0.5 bg-black/75 text-cyan-400 rounded">
                          Transparent AI Output
                        </span>
                      </div>
                    </div>
                  )}

                  {viewMode === 'result-only' && (
                    <div 
                      className="relative w-full h-full flex items-center justify-center"
                      style={{
                        backgroundColor: bgColor === 'transparent' ? undefined : (bgColor === 'custom' ? customColor : bgColor)
                      }}
                    >
                      {bgColor === 'transparent' && <div className="absolute inset-0 checkerboard-bg" />}
                      {processedImage && (
                        <img
                          src={processedImage}
                          alt="Final result"
                          className="relative max-w-full max-h-full object-contain"
                        />
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Resolution & Diagnostic Metrics */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 px-2 gap-2">
              <span className="truncate max-w-xs">{originalFile?.name}</span>
              <div className="flex items-center gap-3 font-mono">
                {outputDimensions && (
                  <span>Res: {outputDimensions.width} × {outputDimensions.height} px</span>
                )}
                {processingTimeMs && (
                  <span className="flex items-center gap-1 text-cyan-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{(processingTimeMs / 1000).toFixed(1)}s</span>
                  </span>
                )}
                {processedBlob && (
                  <span>Output: {formatBytes(processedBlob.size)} (32-bit PNG)</span>
                )}
              </div>
            </div>
          </div>

          {/* Controls & Options Panel (4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* AI Model Selection */}
            <div className="p-5 rounded-2xl bg-[#0D1428] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white">AI Segmentation Model</h3>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setModelType('isnet_quint8');
                    if (originalImage && !isProcessing) runAiRemoval(originalImage, 'isnet_quint8');
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    modelType === 'isnet_quint8'
                      ? 'bg-blue-600/20 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/30'
                      : 'border-slate-800 bg-[#111C35] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">IS-Net Balanced (Quantized)</span>
                    <span className="text-[10px] text-cyan-400 font-mono">~40MB · Fast</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Optimized memory usage, excellent accuracy on portraits, pets and products.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setModelType('isnet_fp16');
                    if (originalImage && !isProcessing) runAiRemoval(originalImage, 'isnet_fp16');
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    modelType === 'isnet_fp16'
                      ? 'bg-blue-600/20 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/30'
                      : 'border-slate-800 bg-[#111C35] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">IS-Net Full Precision (FP16)</span>
                    <span className="text-[10px] text-cyan-400 font-mono">~88MB · Ultra</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Maximum floating-point precision for flyaway hair, transparent glass, and micro-edges.
                  </p>
                </button>
              </div>

              {originalImage && (
                <button
                  onClick={() => runAiRemoval(originalImage, modelType)}
                  disabled={isProcessing}
                  className="w-full py-2 text-xs font-semibold text-cyan-300 hover:text-white bg-[#111C35] hover:bg-slate-800 rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>Re-run AI Segmentation</span>
                </button>
              )}
            </div>

            {/* Background Color Selector */}
            <div className="p-5 rounded-2xl bg-[#0D1428] border border-slate-800 space-y-4">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Background Finish</h3>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {/* Transparent */}
                <button
                  onClick={() => setBgColor('transparent')}
                  className={`h-11 rounded-xl border relative overflow-hidden transition-all flex items-center justify-center cursor-pointer ${
                    bgColor === 'transparent' ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-slate-700 hover:border-slate-500'
                  }`}
                  title="Transparent PNG"
                >
                  <div className="absolute inset-0 checkerboard-bg" />
                  <span className="relative z-10 text-[10px] font-bold text-white bg-black/60 px-1 py-0.5 rounded">PNG</span>
                </button>

                {/* Pure White */}
                <button
                  onClick={() => setBgColor('#FFFFFF')}
                  className={`h-11 rounded-xl border bg-white relative transition-all cursor-pointer ${
                    bgColor === '#FFFFFF' ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-slate-700 hover:border-slate-500'
                  }`}
                  title="Studio White"
                />

                {/* Studio Gray */}
                <button
                  onClick={() => setBgColor('#F1F5F9')}
                  className={`h-11 rounded-xl border bg-slate-200 relative transition-all cursor-pointer ${
                    bgColor === '#F1F5F9' ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-slate-700 hover:border-slate-500'
                  }`}
                  title="Studio Light Gray"
                />

                {/* Electric Blue */}
                <button
                  onClick={() => setBgColor('#2563EB')}
                  className={`h-11 rounded-xl border bg-blue-600 relative transition-all cursor-pointer ${
                    bgColor === '#2563EB' ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-slate-700 hover:border-slate-500'
                  }`}
                  title="Electric Blue"
                />

                {/* Bright Cyan */}
                <button
                  onClick={() => setBgColor('#38BDF8')}
                  className={`h-11 rounded-xl border bg-sky-400 relative transition-all cursor-pointer ${
                    bgColor === '#38BDF8' ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-slate-700 hover:border-slate-500'
                  }`}
                  title="Bright Cyan"
                />

                {/* Dark Carbon */}
                <button
                  onClick={() => setBgColor('#070B18')}
                  className={`h-11 rounded-xl border bg-[#070B18] relative transition-all cursor-pointer ${
                    bgColor === '#070B18' ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-slate-700 hover:border-slate-500'
                  }`}
                  title="Dark Carbon"
                />

                {/* Custom Color */}
                <label
                  className={`col-span-2 h-11 rounded-xl border relative overflow-hidden transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    bgColor === 'custom' ? 'border-cyan-400 ring-2 ring-cyan-400/30' : 'border-slate-700 hover:border-slate-500'
                  }`}
                  style={{ backgroundColor: customColor }}
                >
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setBgColor('custom');
                    }}
                    className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-[11px] font-bold text-black bg-white/90 px-2 py-0.5 rounded shadow">
                    Custom Color
                  </span>
                </label>
              </div>
            </div>

            {/* Download Actions */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#111C35] to-[#0D1428] border border-cyan-500/30 space-y-3">
              <button
                onClick={handleDownload}
                disabled={!processedImage || isProcessing}
                className="w-full py-3.5 px-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>
                  Download {bgColor === 'transparent' ? 'Transparent PNG' : 'Image'}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Lossless 32-bit Alpha Channel · 100% Free</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
