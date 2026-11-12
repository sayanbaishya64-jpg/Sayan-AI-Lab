import React, { useState, useEffect } from 'react';
import { PageId } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';

// Pages
import { Home } from './pages/Home';
import { ToolsList } from './pages/ToolsList';
import { BackgroundRemover } from './pages/BackgroundRemover';
import { ImageCompressor } from './pages/ImageCompressor';
import { ImageResizer } from './pages/ImageResizer';
import { JpgToPng } from './pages/JpgToPng';
import { ImageToPdf } from './pages/ImageToPdf';
import { PdfToImage } from './pages/PdfToImage';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Synchronize with URL hash on mount & change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      const validPages: PageId[] = [
        'home',
        'tools',
        'bg-remover',
        'compressor',
        'resizer',
        'jpg-to-png',
        'image-to-pdf',
        'pdf-to-image',
        'about',
        'contact',
        'privacy',
        'terms',
      ];
      if (hash && validPages.includes(hash as PageId)) {
        setCurrentPage(hash as PageId);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global Ctrl+K / Cmd+K listener for quick search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTo = (page: PageId) => {
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `#/${page}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={navigateTo} />;
      case 'tools':
        return <ToolsList onNavigate={navigateTo} />;
      case 'bg-remover':
        return <BackgroundRemover />;
      case 'compressor':
        return <ImageCompressor />;
      case 'resizer':
        return <ImageResizer />;
      case 'jpg-to-png':
        return <JpgToPng />;
      case 'image-to-pdf':
        return <ImageToPdf />;
      case 'pdf-to-image':
        return <PdfToImage />;
      case 'about':
        return <About onNavigate={navigateTo} />;
      case 'contact':
        return <Contact />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <Terms />;
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070B18] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Bar adhering to Top Bar Contract */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigateTo} />

      {/* Quick Search & Command Palette Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPage={navigateTo}
      />
    </div>
  );
}
