import React, { useState } from 'react';
import { Sparkles, User, Briefcase, Mail, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { requestGoogleOneClickAuth } from '../../services/gmailService';

export const OnboardingModal: React.FC = () => {
  const { profile, updateProfile, updateMasterProfile, addNotification } = useCRM();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetTitle, setTargetTitle] = useState('');
  const [targetLocation, setTargetLocation] = useState('Remote / San Francisco');
  const [salaryMin, setSalaryMin] = useState(140000);
  const [salaryMax, setSalaryMax] = useState(190000);

  // Step 2 State
  const [skillsInput, setSkillsInput] = useState('React, TypeScript, Next.js, Node.js, Python, PostgreSQL, REST APIs');
  const [projectTitle, setProjectTitle] = useState('AI Powered SaaS Workspace');
  const [projectDesc, setProjectDesc] = useState('Architected high-concurrency microservices and real-time streaming interfaces.');
  const [projectTech, setProjectTech] = useState('React, TypeScript, Python, FastAPI, TailwindCSS');
  const [expCompany, setExpCompany] = useState('Stripe');
  const [expRole, setExpRole] = useState('Software Engineering Intern');
  const [expPeriod, setExpPeriod] = useState('Summer 2025');
  const [expHighlights, setExpHighlights] = useState('Engineered API integrations and reduced latency by 30%.');

  // Step 3 State
  const [gmailConnected, setGmailConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // If already onboarded, don't show
  if (profile.isOnboarded) return null;

  const handleGoogleConnect = () => {
    setIsConnecting(true);
    requestGoogleOneClickAuth(
      profile.gmailClientId || '219885217250-k2s6hq6dgurqppjlk6vp2lp6p0j3adf0.apps.googleusercontent.com',
      (accessToken) => {
        updateProfile({ gmailApiKey: accessToken });
        setGmailConnected(true);
        setIsConnecting(false);
        addNotification('success', 'Gmail Connected!', '1-Click Google OAuth connected!');
      },
      () => {
        setIsConnecting(false);
        addNotification('info', 'Gmail Notice', 'You can connect your Gmail anytime in Settings.');
      }
    );
  };

  const handleFinishOnboarding = () => {
    if (!name.trim() || !email.trim() || !targetTitle.trim()) {
      addNotification('warning', 'Details Required', 'Please complete your name, email, and target job title.');
      setStep(1);
      return;
    }

    // Save Master Profile
    const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
    updateMasterProfile({
      skills,
      projects: [
        {
          id: 'proj-1',
          title: projectTitle || 'Featured Project',
          description: projectDesc || 'Key engineering project highlight.',
          techStack: projectTech || 'React, TypeScript, Node.js'
        }
      ],
      internships: [
        {
          id: 'exp-1',
          company: expCompany || 'Previous Company',
          role: expRole || 'Software Intern',
          period: expPeriod || 'Recent',
          highlights: expHighlights || 'Key accomplishments and engineering wins.'
        }
      ]
    });

    // Save User Profile
    updateProfile({
      name,
      email,
      targetTitle,
      targetLocation,
      desiredSalaryMin: salaryMin,
      desiredSalaryMax: salaryMax,
      isOnboarded: true
    });

    addNotification('success', 'Profile Created!', `Welcome to CareerPilot AI, ${name.split(' ')[0]}! Your job search workspace is ready.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 bg-[#fdfbf7] border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-stone-900 font-outfit uppercase tracking-wider">Welcome to CareerPilot AI</h2>
              <p className="text-xs text-stone-500">Step {step} of 3: Setup your job search profile</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full transition-all ${step >= 1 ? 'bg-red-600' : 'bg-stone-200'}`} />
            <div className={`w-2.5 h-2.5 rounded-full transition-all ${step >= 2 ? 'bg-red-600' : 'bg-stone-200'}`} />
            <div className={`w-2.5 h-2.5 rounded-full transition-all ${step >= 3 ? 'bg-red-600' : 'bg-stone-200'}`} />
          </div>
        </div>

        {/* Step 1: User Identity & Target Role */}
        {step === 1 && (
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-4 h-4 text-red-600" />
                <span>Personal & Career Details</span>
              </h3>
              <p className="text-xs text-stone-500">Enter your name and target job role to customize your AI Copilot.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-[10px] font-bold text-stone-700 uppercase">Your Full Name *</label>
                <input
                  type="text" required placeholder="e.g. Alex Rivera"
                  value={name} onChange={e => setName(e.target.value)}
                  className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-600 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-700 uppercase">Your Email Address *</label>
                <input
                  type="email" required placeholder="e.g. alex@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-700 uppercase">Target Job Title *</label>
              <input
                type="text" required placeholder="e.g. Senior Full Stack Engineer / AI Product Engineer"
                value={targetTitle} onChange={e => setTargetTitle(e.target.value)}
                className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-600 font-bold text-red-700"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-bold text-stone-700 uppercase">Preferred Location</label>
                <input
                  type="text" placeholder="Remote / San Francisco"
                  value={targetLocation} onChange={e => setTargetLocation(e.target.value)}
                  className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-700 uppercase">Min Salary ($ USD)</label>
                <input
                  type="number" value={salaryMin} onChange={e => setSalaryMin(Number(e.target.value))}
                  className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-700 uppercase">Max Salary ($ USD)</label>
                <input
                  type="number" value={salaryMax} onChange={e => setSalaryMax(Number(e.target.value))}
                  className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-bold"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  if (!name.trim() || !email.trim() || !targetTitle.trim()) {
                    addNotification('warning', 'Form Incomplete', 'Please enter your name, email, and target role.');
                    return;
                  }
                  setStep(2);
                }}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <span>Continue to Step 2</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Master Resume Details */}
        {step === 2 && (
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-red-600" />
                <span>Master Resume Experience & Skills</span>
              </h3>
              <p className="text-xs text-stone-500">Used by Groq AI to generate tailored LaTeX bullets & RAG cold outreach emails.</p>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-700 uppercase">Core Skills (Comma Separated)</label>
              <input
                type="text" value={skillsInput} onChange={e => setSkillsInput(e.target.value)}
                className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-red-600 font-bold"
              />
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <p className="text-[10px] font-bold text-stone-800 uppercase">Primary Project Highlight</p>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Project Title" value={projectTitle} onChange={e => setProjectTitle(e.target.value)} className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-bold text-stone-900" />
                <input type="text" placeholder="Tech Stack (e.g. React, Python)" value={projectTech} onChange={e => setProjectTech(e.target.value)} className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-800" />
              </div>
              <textarea rows={2} placeholder="Brief Description..." value={projectDesc} onChange={e => setProjectDesc(e.target.value)} className="w-full bg-white border border-stone-200 rounded-lg p-2 text-xs text-stone-800" />
            </div>

            <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <p className="text-[10px] font-bold text-stone-800 uppercase">Recent Internship / Experience</p>
              <div className="grid grid-cols-3 gap-2">
                <input type="text" placeholder="Company Name" value={expCompany} onChange={e => setExpCompany(e.target.value)} className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs font-bold text-stone-900" />
                <input type="text" placeholder="Role Title" value={expRole} onChange={e => setExpRole(e.target.value)} className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-800" />
                <input type="text" placeholder="Period (e.g. Summer 2025)" value={expPeriod} onChange={e => setExpPeriod(e.target.value)} className="bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-800" />
              </div>
              <input type="text" placeholder="Key Highlights..." value={expHighlights} onChange={e => setExpHighlights(e.target.value)} className="w-full bg-white border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-800" />
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button" onClick={() => setStep(1)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button" onClick={() => setStep(3)}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <span>Continue to Step 3</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Connect Gmail (1-Click Google OAuth) */}
        {step === 3 && (
          <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            <div className="space-y-1">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-red-600" />
                <span>Connect Your Gmail (Optional)</span>
              </h3>
              <p className="text-xs text-stone-500">Authorize 1-click email sending and automatic recruiter response tracking.</p>
            </div>

            <div className="p-5 bg-stone-50 border border-stone-200 rounded-xl space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center mx-auto shadow-xs">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
              </div>

              <div>
                <h4 className="text-xs font-extrabold text-stone-900">Sign in with Google OAuth</h4>
                <p className="text-[11px] text-stone-500 max-w-sm mx-auto mt-0.5">
                  Allows CareerPilot AI to dispatch emails directly from your Gmail and monitor incoming responses.
                </p>
              </div>

              {gmailConnected ? (
                <div className="py-2 px-4 bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs rounded-xl inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Gmail Account Connected Successfully!</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleGoogleConnect}
                  disabled={isConnecting}
                  className="px-5 py-2.5 bg-white hover:bg-stone-100 border border-stone-300 text-stone-900 font-bold text-xs rounded-xl shadow-sm inline-flex items-center gap-2 transition-all active:scale-[0.99]"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                  <span>{isConnecting ? 'Opening Google Sign-In...' : 'Connect Gmail Account (1-Click)'}</span>
                </button>
              )}
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button" onClick={() => setStep(2)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={handleFinishOnboarding}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch My Dashboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
