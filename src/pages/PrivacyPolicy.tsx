import React from 'react';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase">
          <ShieldCheck className="w-4 h-4" />
          <span>Security & Data Governance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 font-mono">
          Last Updated: November 2026 · Zero Cloud Retention Guarantee
        </p>
      </div>

      <div className="rounded-2xl bg-[#0D1428] border border-cyan-500/30 p-6 space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          <span>Our Privacy Commitment in One Sentence</span>
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          SAYAN AI LAB never stores, views, or uploads your images, graphics, or PDF documents to remote cloud storage. All processing is executed client-side within your browser sandbox.
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Information We Do Not Collect</h2>
          <p>
            When utilizing our AI Background Remover, Image Compressor, Image Resizer, Format Converters, or PDF tools:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>We do NOT collect or store your original images or converted files.</li>
            <li>We do NOT retain metadata, EXIF data, or geolocation tags embedded in your photos.</li>
            <li>We do NOT train generative AI models on user-submitted files.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Browser-Side Execution Model</h2>
          <p>
            All file handling, color analysis, alpha matting, pixel resizing, and PDF rendering operations are executed directly inside the user's web browser using standard WebAssembly and HTML5 Canvas APIs. Once you close your browser tab or click "Reset", all in-memory temporary image references are wiped immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Third-Party Analytics & Cookies</h2>
          <p>
            We maintain an anti-slop, clean infrastructure. We do not sell user data to advertising brokers. We do not employ intrusive tracking cookies across external websites.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. GDPR & CCPA Compliance</h2>
          <p>
            Because we do not store personal data or user files, our service inherently meets the highest standards of the European Union General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Contact Information</h2>
          <p>
            For questions regarding our privacy architecture, you can contact us at{' '}
            <span className="text-cyan-400 font-mono">privacy@sayandigital.com</span>.
          </p>
        </section>

      </div>

    </div>
  );
};
