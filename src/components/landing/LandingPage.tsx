import React, { useState } from 'react';
import {
  Sparkles, Mail, CheckCircle2, ArrowRight, ShieldCheck, FileText,
  Briefcase, Cpu, Zap, Lock, ChevronRight, HelpCircle, LogIn
} from 'lucide-react';

interface Props {
  onLaunchDashboard: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<Props> = ({ onLaunchDashboard, onOpenAuth }) => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'about' | 'contact' | null>(null);

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-stone-900 font-sans selection:bg-red-500 selection:text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-[#fdfbf7]/90 backdrop-blur-md border-b border-stone-200/80 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-extrabold text-sm shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-base font-extrabold text-stone-900 font-outfit tracking-tight">
              CareerPilot AI
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-stone-600">
            <a href="#features" className="hover:text-stone-900 transition-colors">Features</a>
            <button onClick={() => setActiveModal('about')} className="hover:text-stone-900 transition-colors">About</button>
            <button onClick={() => setActiveModal('privacy')} className="hover:text-stone-900 transition-colors">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-stone-900 transition-colors">Terms of Service</button>
            <button onClick={() => setActiveModal('contact')} className="hover:text-stone-900 transition-colors">Contact</button>
          </nav>

          {/* Launch & Auth CTAs */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5 text-red-600" />
              <span>Sign In / Register</span>
            </button>

            <button
              onClick={onLaunchDashboard}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-[0.99]"
            >
              <span>Launch & Setup Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 pt-16 pb-20 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-[11px] font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Job Search Engine & Gmail Assistant</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-outfit tracking-tight leading-tight max-w-4xl mx-auto">
          Track Applications, Draft RAG Emails & Auto-Sync Recruiter Replies with <span className="text-red-600 underline decoration-red-200">CareerPilot AI</span>
        </h1>

        <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          CareerPilot AI is an all-in-one job application CRM that optimizes ATS resume scores, generates humanized cold outreach emails, and automatically updates candidate pipeline stages via live <strong>Gmail API integration</strong>.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={onOpenAuth}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>Sign In / Create Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onLaunchDashboard}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>Launch Setup Wizard</span>
          </button>
        </div>
      </section>

      {/* Product Features Grid */}
      <section id="features" className="px-6 py-16 bg-stone-100/60 border-y border-stone-200/80">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xs font-bold text-red-600 uppercase tracking-widest">Built for Serious Job Seekers</h2>
            <p className="text-2xl font-extrabold text-stone-900 font-outfit">Everything you need to land high-paying tech roles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 font-outfit">Drag & Drop Kanban CRM</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Organize candidate pipelines from target companies to offer acceptances with 7 custom stages and 0ms latency.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 font-outfit">Live Gmail API Auto-Sync</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Auto-detect recruiter interview requests or rejection emails and update pipeline stages in real time.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 font-outfit">RAG Email & ATS Resume Generator</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Generate humanized cold outreach emails and Overleaf LaTeX resume bullet points powered by Gemini and Groq AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Verification Links */}
      <footer className="bg-white border-t border-stone-200 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-red-600 text-white font-bold text-[10px] flex items-center justify-center">C</div>
            <span className="font-bold text-stone-800">CareerPilot AI © 2026</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-semibold">
            <button onClick={() => setActiveModal('about')} className="hover:text-stone-900 hover:underline">About Application</button>
            <button onClick={() => setActiveModal('privacy')} className="hover:text-stone-900 hover:underline">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-stone-900 hover:underline">Terms of Service</button>
            <button onClick={() => setActiveModal('contact')} className="hover:text-stone-900 hover:underline">Contact Support</button>
          </div>
        </div>
      </footer>

      {/* Informational Modals for Google Verification */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-stone-200 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-sm font-bold text-stone-900 uppercase font-outfit">
                {activeModal === 'about' && 'About CareerPilot AI'}
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'terms' && 'Terms of Service'}
                {activeModal === 'contact' && 'Contact Support'}
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-700">
                ✕
              </button>
            </div>

            <div className="text-xs text-stone-700 space-y-3 leading-relaxed max-h-80 overflow-y-auto">
              {activeModal === 'about' && (
                <p>
                  CareerPilot AI is an intelligent job search platform that combines application tracking, ATS keyword alignment, personalized cold outreach email generation, and live Gmail response monitoring.
                </p>
              )}

              {activeModal === 'privacy' && (
                <p>
                  CareerPilot AI respects user privacy. All candidate data, application statuses, and email drafts remain under user control. Google OAuth tokens are requested strictly for sending user-authorized emails and retrieving recruiter replies.
                </p>
              )}

              {activeModal === 'terms' && (
                <p>
                  By using CareerPilot AI, you agree to comply with standard acceptable use policies. Users are responsible for configuring their own API keys and reviewing generated email drafts prior to sending.
                </p>
              )}

              {activeModal === 'contact' && (
                <p>
                  For developer support or inquiries, please contact: <br />
                  <strong className="text-stone-900">suryoooday@gmail.com</strong>
                </p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
