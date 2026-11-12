import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  FileImage, 
  RotateCcw, 
  Eye, 
  ShieldCheck, 
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';
import { formatBytes, downloadFile } from '../utils/imageProcessing';
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

// Configure pdf.js worker to reliable CDN matching current installed version
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface RenderedPage {
  pageNumber: number;
  dataUrl: string;
  blob: Blob;
  width: number;
  height: number;
}

export const PdfToImage: React.FC = () => {
  const [fileName, setFileName] = useState<string>('');
  const [fileSize, setFileSize] = useState<number>(0);
  const [pages, setPages] = useState<RenderedPage[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Options
  const [renderScale, setRenderScale] = useState<number>(1.5); // 1.0, 1.5, 2.0
  const [format, setFormat] = useState<'image/png' | 'image/jpeg'>('image/png');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processPdfData = async (data: ArrayBuffer | Uint8Array, name: string, size: number) => {
    setIsProcessing(true);
    setError(null);
    setProgressMsg('Parsing PDF document structure...');
    setFileName(name);
    setFileSize(size);

    try {
      const loadingTask = pdfjsLib.getDocument({ data });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      const rendered: RenderedPage[] = [];

      for (let i = 1; i <= numPages; i++) {
        setProgressMsg(`Rendering page ${i} of ${numPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: renderScale });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        // Fill white background for JPEG rendering
        if (format === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
          canvas: canvas,
        };

        await page.render(renderContext).promise;

        const dataUrl = canvas.toDataURL(format, 0.95);
        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), format, 0.95)
        );

        rendered.push({
          pageNumber: i,
          dataUrl,
          blob,
          width: Math.round(viewport.width),
          height: Math.round(viewport.height),
        });
      }

      setPages(rendered);
      setIsProcessing(false);
      setProgressMsg('');

      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#2563EB', '#38BDF8', '#FFFFFF']
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to render PDF pages. Make sure the file is not password-protected.');
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const handleFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setError('Please upload a valid .pdf file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      processPdfData(buffer, file.name, file.size);
    };
    reader.readAsArrayBuffer(file);
  };

  // Generate a live demo PDF in memory for 1-click test
  const handleLoadSamplePdf = () => {
    const doc = new jsPDF();
    
    // Page 1
    doc.setFillColor(7, 11, 24);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(56, 189, 248);
    doc.setFontSize(24);
    doc.text('SAYAN AI LAB', 20, 30);
    doc.setFontSize(14);
    doc.setTextColor(248, 250, 252);
    doc.text('Sample Test Document - Page 1', 20, 45);
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184);
    doc.text('Explore. Create. Transform. High-Performance Client AI Suite.', 20, 60);
    
    // Page 2
    doc.addPage();
    doc.setFillColor(13, 20, 40);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setTextColor(37, 99, 235);
    doc.setFontSize(24);
    doc.text('Next-Generation Vector Graphics', 20, 30);
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text('Page 2: Ultra High Definition Canvas Rendering', 20, 45);

    const pdfBuffer = doc.output('arraybuffer');
    processPdfData(pdfBuffer, 'sayan-sample-doc.pdf', pdfBuffer.byteLength);
  };

  const downloadSinglePage = (page: RenderedPage) => {
    const ext = format === 'image/png' ? 'png' : 'jpg';
    const clean = fileName.replace(/\.pdf$/i, '') || 'document';
    downloadFile(page.blob, `${clean}-page-${page.pageNumber}.${ext}`);
  };

  const downloadAllPages = () => {
    pages.forEach((p, idx) => {
      setTimeout(() => downloadSinglePage(p), idx * 250);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase mb-1">
            <FileImage className="w-3.5 h-3.5" />
            <span>Document Operations</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">High-DPI Canvas Rasterization</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            PDF to Image Converter
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Extract every page of a PDF file into high-resolution PNG or JPEG images right inside your browser.
          </p>
        </div>

        {pages.length > 0 && (
          <button
            onClick={() => {
              setPages([]);
              setFileName('');
              setError(null);
            }}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#0D1428] hover:bg-[#111C35] border border-slate-700/80 rounded-xl transition-colors cursor-pointer w-fit"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Upload Another PDF</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-center gap-3 text-red-200 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {pages.length === 0 ? (
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
              accept=".pdf,application/pdf"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0]);
              }}
              className="hidden"
            />
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#111C35] border border-slate-700 flex items-center justify-center mx-auto group-hover:scale-110 group-hover:border-cyan-500/50 transition-all shadow-lg">
                <FileImage className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  Drag and drop PDF document here, or browse
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports standard multi-page PDF documents
                </p>
              </div>
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md"
              >
                Select PDF File
              </button>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D1428] border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">No PDF on hand? Try our sample multi-page test document:</span>
            <button
              onClick={handleLoadSamplePdf}
              className="px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/30 rounded-lg transition-colors cursor-pointer"
            >
              Test with Sample PDF
            </button>
          </div>

          {isProcessing && (
            <div className="p-8 rounded-2xl bg-[#0D1428] border border-slate-800 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-full border-3 border-blue-600 border-t-cyan-400 animate-spin" />
              <p className="text-sm font-bold text-white">Converting PDF Pages...</p>
              <p className="text-xs text-cyan-400 font-mono">{progressMsg}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Bar with Bulk Action */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#0D1428] border border-slate-800 rounded-2xl">
            <div className="space-y-1">
              <div className="text-sm font-bold text-white">{fileName}</div>
              <div className="text-xs text-slate-400 font-mono">
                {pages.length} Pages Extracted · {formatBytes(fileSize)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={downloadAllPages}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download All Pages ({pages.length})</span>
              </button>
            </div>
          </div>

          {/* Rendered Pages Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pages.map((p) => (
              <div
                key={p.pageNumber}
                className="rounded-2xl bg-[#0D1428] border border-slate-800 hover:border-cyan-500/40 p-4 space-y-3 transition-colors"
              >
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-white">Page {p.pageNumber}</span>
                  <span className="font-mono text-[11px]">{p.width} × {p.height} px</span>
                </div>

                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white/5 border border-slate-800 flex items-center justify-center p-2">
                  <img
                    src={p.dataUrl}
                    alt={`Page ${p.pageNumber}`}
                    className="max-w-full max-h-full object-contain shadow-md"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => downloadSinglePage(p)}
                    className="w-full py-2 px-3 text-xs font-semibold text-slate-200 bg-[#111C35] hover:bg-blue-600 hover:text-white rounded-xl border border-slate-700/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Page {p.pageNumber}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
