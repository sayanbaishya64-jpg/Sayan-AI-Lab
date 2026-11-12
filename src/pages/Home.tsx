import React, { useState } from 'react';
import { PageId } from '../types';
import { TOOLS_DATA } from '../data/tools';
import { 
  Sparkles, 
  ArrowRight, 
  Scissors, 
  Minimize2, 
  Maximize2, 
  ArrowRightLeft, 
  FileText, 
  FileImage, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  ChevronDown 
} from 'lucide-react';

interface HomeProps {
  onNavigate: (page: PageId) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const getToolIcon = (name: string) => {
    switch (name) {
      case 'Scissors': return <Scissors className="w-6 h-6 text-cyan-400" />;
      case 'Minimize2': return <Minimize2 className="w-6 h-6 text-blue-400" />;
      case 'Maximize2': return <Maximize2 className="w-6 h-6 text-sky-400" />;
      case 'ArrowRightLeft': return <ArrowRightLeft className="w-6 h-6 text-teal-400" />;
      case 'FileText': return <FileText className="w-6 h-6 text-indigo-400" />;
      case 'FileImage': return <FileImage className="w-6 h-6 text-cyan-300" />;
      default: return <Sparkles className="w-6 h-6 text-cyan-400" />;
    }
  };

  const faqs = [
    {
      q: 'Does SAYAN AI LAB upload my photos or documents to any external server?',
      a: 'No. All our core tools operate directly inside your web browser via advanced WebAssembly and HTML5 Canvas engines. Your images and documents never leave your device, ensuring total data privacy.'
    },
    {
      q: 'Is SAYAN AI LAB free to use?',
      a: 'Yes. All tools on the platform are 100% free with no watermarks, no mandatory account registration, and no daily usage quotas.'
    },
    {
      q: 'What file formats are supported?',
      a: 'Our tools support all standard image formats including JPG, JPEG, PNG, and WebP, as well as multi-page PDF documents for document conversion.'
    },
    {
      q: 'Can I use SAYAN AI LAB on mobile smartphones and tablets?',
      a: 'Absolutely. The platform is engineered with responsive layouts optimized for desktop, laptops, iPads, Android smartphones, and iPhones.'
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 md:pt-20 overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Refined clean unboxed kicker */}
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Next-Generation Productivity Suite</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400 font-normal">v1.0 Online</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
                Your Creative World,{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                  Powered by AI.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl">
                Discover powerful AI tools that simplify your digital workflow. Create, edit and transform without complicated software.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('tools')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <span>Explore AI Tools</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('bg-remover')}
                  className="px-6 py-3.5 text-sm font-semibold text-slate-200 bg-[#0D1428] hover:bg-[#111C35] hover:text-white border border-slate-700/80 hover:border-cyan-500/50 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <Scissors className="w-4 h-4 text-cyan-400" />
                  <span>Try Background Remover</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Free Forever</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Zero-Cloud Retention</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Instant Browser Processing</span>
                </div>
              </div>
            </div>

            {/* Right Abstract AI Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow ring */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-1000" />
                
                {/* Main Card Frame */}
                <div className="relative rounded-2xl bg-[#0D1428] border border-slate-700/80 overflow-hidden shadow-2xl">
                  {/* Visual Header */}
                  <div className="px-4 py-3 bg-[#111C35] border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    </div>
                    <span className="text-xs font-mono text-cyan-300">SAYAN_NEURAL_CORE</span>
                  </div>

                  {/* Generated Abstract AI Visual */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#070B18]">
                    <img
                      src="/src/assets/images/hero_abstract_ai_core_1794413698616.jpg"
                      alt="SAYAN AI LAB neural network core"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1428] via-transparent to-transparent opacity-80" />
                    
                    {/* Live interactive badge */}
                    <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#070B18]/85 border border-cyan-500/30 backdrop-blur-md flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center">
                          <Cpu className="w-4 h-4 text-cyan-400" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-white">Browser Accelerated Engine</div>
                          <div className="text-[11px] text-slate-400">Zero latency · Private sandboxed</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-cyan-400 font-semibold">60 FPS</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TOOLS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
            Productivity Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            High-Performance Digital Tools
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Professional image processing and document conversion right inside your browser. No installs or cloud uploads needed.
          </p>
        </div>

        {/* 6 Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS_DATA.map((tool) => (
            <div
              key={tool.id}
              className="group relative rounded-2xl bg-[#0D1428] border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20"
            >
              <div className="space-y-4">
                {/* Header row: Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-[#111C35] border border-slate-700/60 flex items-center justify-center group-hover:border-cyan-500/50 group-hover:bg-blue-950/40 transition-colors">
                    {getToolIcon(tool.iconName)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                      Free
                    </span>
                    {tool.badge && (
                      <span className="text-xs font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Tool Title & Description */}
                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">
                    {tool.category}
                  </p>
                  <p className="text-sm text-slate-300 mt-2.5 leading-relaxed line-clamp-2">
                    {tool.shortDesc}
                  </p>
                </div>

                {/* Feature checklist */}
                <div className="pt-2 space-y-1.5 border-t border-slate-800/80">
                  {tool.features.slice(0, 2).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <button
                  onClick={() => onNavigate(tool.id)}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-[#111C35] hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 border border-slate-700/80 hover:border-transparent rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-md cursor-pointer"
                >
                  <span>Open Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. WHY CHOOSE SAYAN AI LAB? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-b from-[#0D1428] to-[#070B18] border border-slate-800 p-8 sm:p-12 lg:p-16">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
              Core Principles
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
              Why Choose SAYAN AI LAB?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3 leading-relaxed">
              We reimagined digital utilities from first principles. Everything is built for speed, complete privacy, and uncompromising visual fidelity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">100% Client-Side Privacy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Images and PDFs execute inside your browser’s sandboxed runtime. No files are uploaded or stored on servers.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Instant Response</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Skip upload delays and queue throttling. Our client canvas processing delivers immediate, real-time results.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Studio-Grade Quality</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Precise edge feathering, clean transparency alpha matting, and loss-free compression with live inspect.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Zero Friction</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No login walls, no watermarks, no forced premium tiers. Open the tool, get your work done, and download.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
            Simplified Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-sm text-slate-400">
            Three simple steps to transform your files without installing heavyweight software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Step 1 */}
          <div className="rounded-2xl bg-[#0D1428] border border-slate-800 p-8 space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-lg font-bold text-white">Select or Drop Your File</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your JPG, PNG, WebP image or PDF file directly, or click one of our curated sample test images to explore immediately.
            </p>
          </div>

          {/* Step 2 */}
          <div className="rounded-2xl bg-[#0D1428] border border-slate-800 p-8 space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-lg font-bold text-white">Fine-Tune in Real Time</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Adjust background colors, slide the before/after inspector, customize compression quality, or reorder PDF pages with live preview.
            </p>
          </div>

          {/* Step 3 */}
          <div className="rounded-2xl bg-[#0D1428] border border-slate-800 p-8 space-y-4 relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-lg font-bold text-white">Export & Download</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Download crystal-clear transparent PNGs, optimized WebP images, or merged PDF documents directly to your device with 1 click.
            </p>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
            Clear Answers
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-[#0D1428] border border-slate-800 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between text-sm sm:text-base font-semibold text-white hover:text-cyan-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-4 ${
                    openFaq === idx ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-900/60 via-[#0D1428] to-cyan-950/40 border border-cyan-500/30 p-8 sm:p-12 text-center space-y-6 overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to Upgrade Your Digital Workflow?
            </h2>
            <p className="text-sm text-slate-300">
              Join thousands of creators using SAYAN AI LAB for fast, private, and precise digital transformations.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('bg-remover')}
              className="px-6 py-3 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] cursor-pointer"
            >
              Launch Background Remover
            </button>
            <button
              onClick={() => onNavigate('tools')}
              className="px-6 py-3 text-xs sm:text-sm font-semibold text-slate-200 bg-[#070B18] hover:bg-slate-800 border border-slate-700 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
            >
              Browse All Tools
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
