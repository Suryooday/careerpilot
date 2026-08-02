import React, { useState } from 'react';
import {
  Sparkles, Mail, CheckCircle2, ArrowRight, ShieldCheck, FileText,
  Briefcase, Cpu, Zap, Lock, ChevronRight, HelpCircle
} from 'lucide-react';

interface Props {
  onLaunchDashboard: () => void;
}

export const LandingPage: React.FC<Props> = ({ onLaunchDashboard }) => {
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

          {/* Launch CTA */}
          <button
            onClick={onLaunchDashboard}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all active:scale-[0.99]"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
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

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onLaunchDashboard}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-[0.99]"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveModal('privacy')}
            className="px-5 py-3 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            <span>View Privacy & Security Policy</span>
          </button>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="px-6 py-16 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest px-2 py-0.5 rounded bg-red-50">
              Core Capabilities
            </span>
            <h2 className="text-2xl font-extrabold text-stone-900 font-outfit">Built for Serious Job Seekers</h2>
            <p className="text-stone-500 text-xs max-w-lg mx-auto">Everything you need to automate outreach, optimize LaTeX resumes, and organize candidate pipeline stages.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#fdfbf7] border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Kanban Application CRM</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Organize job applications across stages: <i>Companies, Mail Drafted, Mail Sent, Response Recieved, Interview, Accepted, Closed Selection</i>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdfbf7] border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">RAG Email Draft Engine</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Retrieves Job Description context and Master Resume details to generate tailored, humanized cold outreach emails.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdfbf7] border border-stone-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">Gmail API Auto-Sync</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Dispatches emails via Gmail REST API and automatically classifies incoming recruiter replies to update pipeline stages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-[#fdfbf7] border-t border-stone-200 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-stone-900">CareerPilot AI</span> • Intelligent Candidate CRM & Gmail Assistant
            <p className="text-[11px] text-stone-400 mt-0.5">© 2026 CareerPilot AI. All rights reserved.</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <button onClick={() => setActiveModal('about')} className="hover:text-stone-900">About</button>
            <button onClick={() => setActiveModal('privacy')} className="hover:text-stone-900">Privacy Policy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-stone-900">Terms of Service</button>
            <button onClick={() => setActiveModal('contact')} className="hover:text-stone-900">Contact</button>
          </div>
        </div>
      </footer>

      {/* Modals for About, Privacy, Terms, Contact */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="p-4 bg-[#fdfbf7] border-b border-stone-200 flex items-center justify-between">
              <h2 className="text-xs font-bold text-stone-900 font-outfit uppercase tracking-wider">
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'terms' && 'Terms of Service'}
                {activeModal === 'about' && 'About CareerPilot AI'}
                {activeModal === 'contact' && 'Contact Us'}
              </h2>
              <button onClick={() => setActiveModal(null)} className="text-stone-400 hover:text-stone-700 text-xs font-bold">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-stone-700 overflow-y-auto leading-relaxed">
              {activeModal === 'privacy' && (
                <>
                  <h3 className="text-sm font-bold text-stone-900">CareerPilot AI Privacy Policy</h3>
                  <p><strong>App Name:</strong> CareerPilot AI</p>
                  <p><strong>Purpose:</strong> CareerPilot AI is a candidate CRM that allows job seekers to organize job applications, draft personalized outreach emails, and connect their Gmail account to send authorized emails and monitor recruiter replies.</p>
                  <h4 className="font-bold text-stone-900 uppercase pt-2">Google API Data Access & Storage</h4>
                  <p>
                    CareerPilot AI requests Gmail OAuth scopes (<code>gmail.send</code> and <code>gmail.readonly</code>) solely to execute email actions requested directly by the user. User data is processed locally in the browser (`localStorage`) and is never sold or shared with external parties.
                  </p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <h3 className="text-sm font-bold text-stone-900">Terms of Service</h3>
                  <p>CareerPilot AI is provided for personal candidate application tracking. Users maintain 100% ownership of all uploaded content and generated email drafts.</p>
                </>
              )}

              {activeModal === 'about' && (
                <>
                  <h3 className="text-sm font-bold text-stone-900">About CareerPilot AI</h3>
                  <p>
                    CareerPilot AI is designed to help software engineers, product managers, and job seekers streamline their entire job hunt. From tracking company pipelines to AI resume ATS scoring and live Gmail outreach, CareerPilot AI accelerates your career trajectory.
                  </p>
                </>
              )}

              {activeModal === 'contact' && (
                <>
                  <h3 className="text-sm font-bold text-stone-900">Contact Support</h3>
                  <p>For questions regarding CareerPilot AI, Google OAuth integration, or privacy inquiries, contact:</p>
                  <p className="font-bold text-red-600 mt-1">Email: suryoooday@gmail.com</p>
                  <p className="text-stone-500">Website: https://careerpilot-weld.vercel.app</p>
                </>
              )}
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
              <button onClick={() => setActiveModal(null)} className="px-4 py-1.5 bg-stone-900 text-white font-bold text-xs rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
