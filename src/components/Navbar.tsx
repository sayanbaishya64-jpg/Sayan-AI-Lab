import React, { useState } from 'react';
import { PageId } from '../types';
import { Search, Menu, X, Sparkles, Layers } from 'lucide-react';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; page: PageId }[] = [
    { label: 'Home', page: 'home' },
    { label: 'AI Tools', page: 'tools' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleLinkClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070B18]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
            <div className="w-full h-full bg-[#070B18] rounded-[7px] flex items-center justify-center">
              <Layers className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-wider text-white flex items-center gap-1.5">
              SAYAN <span className="text-cyan-400">AI LAB</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Single-line, clean) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentPage === link.page || (link.page === 'tools' && ['bg-remover', 'compressor', 'resizer', 'jpg-to-png', 'image-to-pdf', 'pdf-to-image'].includes(currentPage));
            return (
              <button
                key={link.page}
                onClick={() => handleLinkClick(link.page)}
                className={`relative py-1 whitespace-nowrap transition-colors hover:text-white ${
                  isActive ? 'text-white font-semibold' : 'text-slate-300'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Search + Primary Action */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-[#0D1428] hover:bg-[#111C35] hover:text-slate-200 border border-slate-800 rounded-lg transition-colors"
            title="Search tools (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Search tools...</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-slate-900 border border-slate-700/60 rounded text-slate-400">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={() => handleLinkClick('bg-remover')}
            className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-cyan-500 rounded-lg shadow-md shadow-blue-600/25 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
          >
            Get Started
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex sm:hidden items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-800 bg-[#0D1428] px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleLinkClick(link.page)}
              className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-200 hover:bg-slate-800/50 hover:text-cyan-400"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2">
            <button
              onClick={() => handleLinkClick('bg-remover')}
              className="w-full py-2.5 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
            >
              Launch Background Remover
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
