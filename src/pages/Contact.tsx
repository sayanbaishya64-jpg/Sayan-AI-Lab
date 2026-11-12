import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Feature Request',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2563EB', '#38BDF8', '#FFFFFF']
      });
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-semibold text-cyan-400 tracking-wider uppercase">
          Connect With Us
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Get in Touch with SAYAN AI LAB
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Have an idea for a new AI tool? Found a bug? Or looking to collaborate? We would love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Info Column (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-2xl bg-[#0D1428] border border-slate-800 p-6 space-y-6">
            <h3 className="text-base font-bold text-white">Direct Communication</h3>
            
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block">General Support & Inquiries</span>
                  <span className="text-sm font-semibold text-white">contact@sayandigital.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-400 block">Turnaround Time</span>
                  <span className="text-sm font-semibold text-white">Under 24 Business Hours</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 leading-relaxed">
              We actively review user feature requests to shape our future tool roadmap.
            </div>
          </div>
        </div>

        {/* Form Column (7 cols) */}
        <div className="md:col-span-7">
          <div className="rounded-2xl bg-[#0D1428] border border-slate-800 p-6 sm:p-8">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Dispatched!</h3>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">
                  Thank you for reaching out to SAYAN AI LAB. Our team will review your message and reply promptly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', topic: 'Feature Request', message: '' });
                  }}
                  className="px-4 py-2 text-xs font-semibold text-cyan-400 hover:text-white bg-[#111C35] rounded-xl border border-slate-700 hover:border-cyan-500/50 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full px-3.5 py-2.5 bg-[#111C35] border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Your Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@domain.com"
                    className="w-full px-3.5 py-2.5 bg-[#111C35] border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Topic</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#111C35] border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="Feature Request">New AI Tool Request</option>
                    <option value="Bug Report">Technical Issue / Bug Report</option>
                    <option value="Feedback">Platform Experience Feedback</option>
                    <option value="Partnership">Partnership & Inquiries</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you'd like to see or how we can help..."
                    className="w-full px-3.5 py-2.5 bg-[#111C35] border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-cyan-500 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Submit Message'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
