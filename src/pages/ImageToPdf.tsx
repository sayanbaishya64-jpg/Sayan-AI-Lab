import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  FileText, 
  Plus, 
  ShieldCheck, 
  Sparkles,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { formatBytes } from '../utils/imageProcessing';
import { createSampleImage } from '../utils/samples';
import confetti from 'canvas-confetti';

interface ImageItem {
  id: string;
  name: string;
  size: number;
  dataUrl: string;
  width: number;
  height: number;
}

export const ImageToPdf: React.FC = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'fit'>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape' | 'auto'>('portrait');
  const [margin, setMargin] = useState<number>(10); // in mm (0, 10, 20)
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setImages((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(7),
              name: file.name,
              size: file.size,
              dataUrl,
              width: img.naturalWidth || img.width,
              height: img.naturalHeight || img.height,
            },
          ]);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddSample = () => {
    const types: ('sneaker' | 'portrait' | 'gadget')[] = ['sneaker', 'portrait', 'gadget'];
    const type = types[images.length % types.length];
    const dataUrl = createSampleImage(type);
    setImages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        name: `sample-${type}-${prev.length + 1}.jpg`,
        size: 195000,
        dataUrl,
        width: 800,
        height: 800,
      },
    ]);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= images.length) return;
    setImages((prev) => {
      const clone = [...prev];
      const temp = clone[index];
      clone[index] = clone[newIdx];
      clone[newIdx] = temp;
      return clone;
    });
  };

  const removeItem = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      // First page orientation
      let firstOrient: 'portrait' | 'landscape' = orientation === 'landscape' ? 'landscape' : 'portrait';
      if (orientation === 'auto') {
        firstOrient = images[0].width > images[0].height ? 'landscape' : 'portrait';
      }

      const doc = new jsPDF({
        orientation: firstOrient,
        unit: 'mm',
        format: pageSize === 'fit' ? [images[0].width * 0.264583, images[0].height * 0.264583] : pageSize,
      });

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        let pageOrient: 'portrait' | 'landscape' = orientation === 'landscape' ? 'landscape' : 'portrait';
        if (orientation === 'auto') {
          pageOrient = item.width > item.height ? 'landscape' : 'portrait';
        }

        if (i > 0) {
          doc.addPage(
            pageSize === 'fit' ? [item.width * 0.264583, item.height * 0.264583] : pageSize,
            pageOrient
          );
        }

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        const usableW = pageWidth - margin * 2;
        const usableH = pageHeight - margin * 2;

        const imgRatio = item.width / item.height;
        const pageRatio = usableW / usableH;

        let renderW = usableW;
        let renderH = usableH;

        if (imgRatio > pageRatio) {
          renderH = usableW / imgRatio;
        } else {
          renderW = usableH * imgRatio;
        }

        const x = margin + (usableW - renderW) / 2;
        const y = margin + (usableH - renderH) / 2;

        doc.addImage(item.dataUrl, 'JPEG', x, y, renderW, renderH, undefined, 'FAST');
      }

      doc.save(`sayan-ai-lab-document-${Date.now()}.pdf`);
      setIsGenerating(false);

      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2563EB', '#38BDF8', '#FFFFFF']
      });
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Document Operations</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">PDF Compilation</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Image to PDF Converter
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Combine multiple JPG and PNG images into a clean, formatted multi-page PDF document. Arrange order, margins, and page orientation.
          </p>
        </div>

        {images.length > 0 && (
          <button
            onClick={() => setImages([])}
            className="text-xs text-slate-400 hover:text-red-400 transition-colors cursor-pointer w-fit"
          >
            Clear All Images
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Images List & Upload (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Drop & Add Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-cyan-400 rounded-2xl bg-[#0D1428]/60 hover:bg-[#0D1428] p-8 text-center transition-all cursor-pointer group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) handleFiles(e.target.files);
              }}
              className="hidden"
            />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#111C35] border border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm font-bold text-white group-hover:text-cyan-400">
                  Click or drag to add more images
                </p>
                <p className="text-xs text-slate-400">
                  PNG, JPG, JPEG, WebP · Add as many pages as you need
                </p>
              </div>
            </div>
          </div>

          {images.length === 0 && (
            <div className="p-4 rounded-xl bg-[#0D1428] border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Want to test without uploading your own images?</span>
              <button
                onClick={handleAddSample}
                className="px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 rounded-lg transition-colors cursor-pointer"
              >
                + Add Sample Page
              </button>
            </div>
          )}

          {/* Ordered Pages List */}
          {images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>Page Order ({images.length} {images.length === 1 ? 'page' : 'pages'})</span>
                <button
                  onClick={handleAddSample}
                  className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  + Add Sample Image
                </button>
              </div>

              <div className="space-y-2">
                {images.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0D1428] border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center text-xs font-mono font-bold text-cyan-400">
                        #{idx + 1}
                      </span>
                      <div className="w-12 h-12 rounded-lg bg-[#070B18] overflow-hidden flex items-center justify-center shrink-0 border border-slate-800">
                        <img
                          src={item.dataUrl}
                          alt={`Page ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="max-w-[160px] sm:max-w-xs truncate">
                        <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {item.width} × {item.height} · {formatBytes(item.size)}
                        </p>
                      </div>
                    </div>

                    {/* Order buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveItem(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                        title="Move Page Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveItem(idx, 'down')}
                        disabled={idx === images.length - 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 cursor-pointer"
                        title="Move Page Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 cursor-pointer ml-1"
                        title="Remove Page"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Page & Document Settings (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-2xl bg-[#0D1428] border border-slate-800 space-y-5">
            <h3 className="text-sm font-bold text-white">Document Settings</h3>

            {/* Page Size */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 block">Page Size</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPageSize('a4')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    pageSize === 'a4'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'border-slate-800 bg-[#111C35] text-slate-300 hover:text-white'
                  }`}
                >
                  A4 Standard
                </button>
                <button
                  type="button"
                  onClick={() => setPageSize('letter')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    pageSize === 'letter'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'border-slate-800 bg-[#111C35] text-slate-300 hover:text-white'
                  }`}
                >
                  US Letter
                </button>
                <button
                  type="button"
                  onClick={() => setPageSize('fit')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    pageSize === 'fit'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'border-slate-800 bg-[#111C35] text-slate-300 hover:text-white'
                  }`}
                >
                  Fit to Image
                </button>
              </div>
            </div>

            {/* Orientation */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 block">Orientation</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setOrientation('portrait')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    orientation === 'portrait'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'border-slate-800 bg-[#111C35] text-slate-300 hover:text-white'
                  }`}
                >
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation('landscape')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    orientation === 'landscape'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'border-slate-800 bg-[#111C35] text-slate-300 hover:text-white'
                  }`}
                >
                  Landscape
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation('auto')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    orientation === 'auto'
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'border-slate-800 bg-[#111C35] text-slate-300 hover:text-white'
                  }`}
                >
                  Auto Detect
                </button>
              </div>
            </div>

            {/* Margins */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 block">Margins</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMargin(0)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    margin === 0
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'border-slate-800 bg-[#111C35] text-slate-300 hover:text-white'
                  }`}
                >
                  No Margin
                </button>
                <button
                  type="button"
                  onClick={() => setMargin(10)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    margin === 10
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'border-slate-800 bg-[#111C35] text-slate-300 hover:text-white'
                  }`}
                >
                  Small (10mm)
                </button>
                <button
                  type="button"
                  onClick={() => setMargin(20)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
                    margin === 20
                      ? 'bg-blue-600 text-white border-blue-500'
                      : 'border-slate-800 bg-[#111C35] text-slate-300 hover:text-white'
                  }`}
                >
                  Wide (20mm)
                </button>
              </div>
            </div>

          </div>

          {/* Generate Action Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-[#111C35] to-[#0D1428] border border-cyan-500/30 space-y-4">
            <button
              onClick={generatePdf}
              disabled={images.length === 0 || isGenerating}
              className="w-full py-3.5 px-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>
                {isGenerating ? 'Compiling PDF...' : `Generate & Download PDF (${images.length} pages)`}
              </span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Direct Browser Generation · No Document Uploads</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
