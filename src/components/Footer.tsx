import React from 'react';
import { PageId } from '../types';
import { Layers, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070B18] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-[#070B18] rounded-[6px] flex items-center justify-center">
                  <Layers className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-wider text-white">
                SAYAN <span className="text-cyan-400">AI LAB</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Explore. Create. Transform. Premium AI-powered online utilities built for designers, developers, creators, and teams worldwide.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400/90 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero-Storage Guarantee: All processing executes in your browser.</span>
            </div>
          </div>

          {/* Quick Tools Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase">
              AI Tools
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('bg-remover')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Background Remover
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('compressor')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Image Compressor
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resizer')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Image Resizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('jpg-to-png')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  JPG to PNG Converter
                </button>
              </li>
            </ul>
          </div>

          {/* PDF & Document Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase">
              PDF Utilities
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('image-to-pdf')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Image to PDF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pdf-to-image')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  PDF to Image
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('tools')}
                  className="hover:text-cyan-400 transition-colors text-left flex items-center gap-1 text-cyan-400"
                >
                  <span>View All 6 Tools</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Company & Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="hover:text-cyan-400 transition-colors text-left"
                >
                  Terms and Conditions
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 SAYAN AI LAB. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Crafted with precision for creators</span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <button
              onClick={() => onNavigate('privacy')}
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              Zero-Cloud Retention
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
