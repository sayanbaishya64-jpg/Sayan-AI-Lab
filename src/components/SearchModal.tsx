import React, { useState, useEffect, useRef } from 'react';
import { PageId } from '../types';
import { TOOLS_DATA } from '../data/tools';
import { Search, X, ArrowRight, Sparkles, Scissors, Minimize2, Maximize2, ArrowRightLeft, FileText, FileImage } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPage: (page: PageId) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose, onSelectPage }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTools = TOOLS_DATA.filter(
    (tool) =>
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.shortDesc.toLowerCase().includes(query.toLowerCase()) ||
      tool.category.toLowerCase().includes(query.toLowerCase()) ||
      tool.features.some((f) => f.toLowerCase().includes(query.toLowerCase()))
  );

  const getToolIcon = (name: string) => {
    switch (name) {
      case 'Scissors': return <Scissors className="w-5 h-5 text-cyan-400" />;
      case 'Minimize2': return <Minimize2 className="w-5 h-5 text-blue-400" />;
      case 'Maximize2': return <Maximize2 className="w-5 h-5 text-sky-400" />;
      case 'ArrowRightLeft': return <ArrowRightLeft className="w-5 h-5 text-teal-400" />;
      case 'FileText': return <FileText className="w-5 h-5 text-indigo-400" />;
      case 'FileImage': return <FileImage className="w-5 h-5 text-cyan-300" />;
      default: return <Sparkles className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleSelect = (pageId: PageId) => {
    onSelectPage(pageId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-xl bg-[#0D1428] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#111C35]/50">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI tools (e.g., background remover, compress, pdf)..."
            className="w-full bg-transparent border-0 px-3 text-sm text-white placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-2 py-0.5 text-xs text-slate-400 bg-slate-800 hover:bg-slate-700 rounded"
          >
            Esc
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => handleSelect(tool.id)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#111C35] text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#070B18] border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-cyan-500/40 transition-colors">
                    {getToolIcon(tool.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {tool.name}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {tool.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {tool.shortDesc}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
              </button>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              No tools matching "{query}". Try searching "image", "pdf", or "background".
            </div>
          )}
        </div>

        {/* Quick Nav Footer */}
        <div className="px-4 py-2.5 bg-[#070B18] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Navigation:</span>
            <button onClick={() => handleSelect('about')} className="hover:text-slate-300">About Us</button>
            <span>·</span>
            <button onClick={() => handleSelect('contact')} className="hover:text-slate-300">Contact</button>
            <span>·</span>
            <button onClick={() => handleSelect('privacy')} className="hover:text-slate-300">Privacy</button>
          </div>
          <span>SAYAN AI LAB</span>
        </div>
      </div>
    </div>
  );
};
