import React from 'react';
import { PageId } from '../types';
import { Layers, ShieldCheck, Cpu, Sparkles, Zap, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutProps {
  onNavigate: (page: PageId) => void;
}

export const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase">
          <span>The Vision Behind SAYAN AI LAB</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Explore. Create.{' '}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            Transform.
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          SAYAN AI LAB is an autonomous digital productivity laboratory engineered to provide world-class image editing, background removal, and file conversion utilities right in your browser.
        </p>
      </div>

      {/* Origin & Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-2xl bg-[#0D1428] border border-slate-800 p-8 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Client-Side Architecture</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Most online tools upload your photos and private documents to third-party cloud servers. At SAYAN AI LAB, we believe privacy is a fundamental human right. All image processing algorithms run locally in your web browser.
          </p>
        </div>

        <div className="rounded-2xl bg-[#0D1428] border border-slate-800 p-8 space-y-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Zap className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">Zero Subscriptions or Barriers</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            No credit card prompts, no countdown timers, no artificial watermarks, and no sign-up gates. High-grade creative tooling should be universally accessible to independent designers, students, creators, and entrepreneurs.
          </p>
        </div>
      </div>

      {/* Pillars of Innovation */}
      <div className="rounded-3xl bg-[#0D1428] border border-slate-800 p-8 sm:p-12 space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">Our Pillars</span>
          <h3 className="text-2xl font-bold text-white">Engineering Values</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Speed & Precision</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every algorithm is optimized for 60fps interaction and clean pixel preservation.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Intuitive Ergonomics</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clean visual design with zero unnecessary clutter, advertisements, or distractions.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>Modern Standards</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Native WebAssembly, HTML5 Canvas, modern ECMAScript, and responsive touch layouts.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('tools')}
          className="px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-cyan-500 rounded-xl shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
        >
          <span>Explore Platform Tools</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
