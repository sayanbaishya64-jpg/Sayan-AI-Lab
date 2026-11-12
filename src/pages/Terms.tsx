import React from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="space-y-3 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 tracking-wider uppercase">
          <FileText className="w-4 h-4" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-sm text-slate-400 font-mono">
          Last Updated: November 2026 · Platform Version 1.0
        </p>
      </div>

      <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing and utilizing SAYAN AI LAB (the "Platform"), you agree to abide by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, you should not access the platform.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">2. Permitted Use & Ownership</h2>
          <p>
            You retain 100% full ownership, copyright, and intellectual property rights over all images, photographs, artwork, and documents that you process using the tools provided on SAYAN AI LAB. The platform does not claim any license or intellectual property rights over your content.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">3. Acceptable Use Policy</h2>
          <p>
            You agree not to utilize SAYAN AI LAB to process material that infringes upon the intellectual property rights of third parties or violates applicable local, national, or international regulations.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">4. Disclaimer of Warranties</h2>
          <p>
            SAYAN AI LAB is provided on an "as is" and "as available" basis without warranties of any kind. While we strive to maintain uninterrupted service and high precision in background removal, compression, and format conversion, we do not warrant that results will be entirely error-free in every computational environment.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white">5. Modifications to Service</h2>
          <p>
            We reserve the right to introduce new tools, update existing algorithms, or adjust platform functionality at any time to improve speed, usability, and visual quality.
          </p>
        </section>

      </div>

    </div>
  );
};
