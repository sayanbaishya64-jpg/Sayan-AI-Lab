import React, { useState } from 'react';
import { PageId } from '../types';
import { TOOLS_DATA } from '../data/tools';
import { 
  Search, 
  ArrowRight, 
  Scissors, 
  Minimize2, 
  Maximize2, 
  ArrowRightLeft, 
  FileText, 
  FileImage, 
  Sparkles,
  Check
} from 'lucide-react';

interface ToolsListProps {
  onNavigate: (page: PageId) => void;
}

export const ToolsList: React.FC<ToolsListProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'AI Vision', 'Image Utilities', 'PDF Operations'];

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

  const filteredTools = TOOLS_DATA.filter((tool) => {
    const matchesCat = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesQuery =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="space-y-4 max-w-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase">
          <span>Complete Catalog</span>
          <span aria-hidden="true">·</span>
          <span>6 Available Utilities</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Explore All AI & Digital Tools
        </h1>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Select a tool below to begin. Every operation executes with zero cloud uploads and instant client-side performance.
        </p>
      </div>

      {/* Filter Bar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-2 bg-[#0D1428] border border-slate-800 rounded-2xl">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tools by keyword..."
            className="w-full pl-9 pr-4 py-2 bg-[#111C35] border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="rounded-2xl bg-[#0D1428] border border-slate-800 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-blue-900/20 group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#111C35] border border-slate-700/70 flex items-center justify-center group-hover:border-cyan-500/50 group-hover:bg-blue-950/40 transition-colors">
                  {getToolIcon(tool.iconName)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    Free
                  </span>
                  {tool.badge && (
                    <span className="text-xs font-semibold text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-0.5 rounded-full">
                      {tool.badge}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {tool.name}
                </h3>
                <span className="text-xs text-slate-400 font-medium">
                  {tool.category}
                </span>
                <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                  {tool.description}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="pt-3 border-t border-slate-800/80 space-y-2">
                {tool.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex items-center gap-2 text-xs text-slate-400">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button
                onClick={() => onNavigate(tool.id)}
                className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
              >
                <span>Launch {tool.name}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="py-16 text-center text-slate-400 text-sm bg-[#0D1428] rounded-2xl border border-slate-800">
          No tools found matching "{searchQuery}" under {selectedCategory}.
        </div>
      )}

    </div>
  );
};
