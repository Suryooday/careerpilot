import React, { useState } from 'react';
import { Settings, Save, Mail, Cpu, Sparkles, Key, ExternalLink, CheckCircle2, Database, User, Briefcase, FileText } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { requestGoogleOneClickAuth } from '../../services/gmailService';

export const SettingsModule: React.FC = () => {
  const { profile, updateProfile, masterProfile, updateMasterProfile, addNotification } = useCRM();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [targetTitle, setTargetTitle] = useState(profile.targetTitle);
  const [desiredSalaryMin, setDesiredSalaryMin] = useState(profile.desiredSalaryMin);
  const [desiredSalaryMax, setDesiredSalaryMax] = useState(profile.desiredSalaryMax);
  const [gmailApiKey, setGmailApiKey] = useState(profile.gmailApiKey || '');
  const [gmailClientId, setGmailClientId] = useState(profile.gmailClientId || '219885217250-k2s6hq6dgurqppjlk6vp2lp6p0j3adf0.apps.googleusercontent.com');
  const [groqApiKey, setGroqApiKey] = useState(profile.groqApiKey || '');
  const [geminiApiKey, setGeminiApiKey] = useState(profile.geminiApiKey || '');

  // Master profile fields
  const [skillsText, setSkillsText] = useState(masterProfile.skills.join(', '));
  const [bioSummary, setBioSummary] = useState(masterProfile.summary || '');

  const [isConnectingGoogle, setIsConnectingGoogle] = useState(false);

  const handleOneClickGoogleAuth = () => {
    setIsConnectingGoogle(true);
    requestGoogleOneClickAuth(
      gmailClientId,
      (accessToken) => {
        setGmailApiKey(accessToken);
        updateProfile({ gmailApiKey: accessToken });
        setIsConnectingGoogle(false);
        addNotification('success', 'Gmail Connected!', '1-Click Google Sign-In successful. Gmail API ready!');
      },
      (err) => {
        setIsConnectingGoogle(false);
        addNotification('warning', 'Google OAuth Notice', 'Select Google Account or check OAuth origin URL.');
      }
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Update profile state
    updateProfile({
      name,
      email,
      targetTitle,
      desiredSalaryMin,
      desiredSalaryMax,
      gmailApiKey,
      gmailClientId,
      groqApiKey,
      geminiApiKey
    });

    // Update master profile skills
    const parsedSkills = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    updateMasterProfile({
      skills: parsedSkills,
      summary: bioSummary
    });

    addNotification('success', 'Settings Saved!', 'Profile and Supabase configurations updated successfully.');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-white border border-stone-200 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-50 text-red-600">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Candidate Profile & Integration Settings</h2>
            <p className="text-[11px] text-stone-500">Manage your identity, target roles, Supabase database, and AI credentials</p>
          </div>
        </div>

        {/* Supabase Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-lg">
          <Database className="w-3.5 h-3.5" />
          <span>Supabase Cloud Connected</span>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Candidate Identity & Target Salary */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <User className="w-4 h-4 text-red-600" />
            <h3 className="text-xs font-bold text-stone-900 uppercase">Personal Identity & Career Goals</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-bold focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-600 uppercase">Target Job Title *</label>
            <input
              type="text"
              required
              value={targetTitle}
              onChange={e => setTargetTitle(e.target.value)}
              className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-red-700 font-bold focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Target Minimum Salary ($ USD)</label>
              <input
                type="number"
                value={desiredSalaryMin}
                onChange={e => setDesiredSalaryMin(Number(e.target.value))}
                className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-bold focus:outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Target Maximum Salary ($ USD)</label>
              <input
                type="number"
                value={desiredSalaryMax}
                onChange={e => setDesiredSalaryMax(Number(e.target.value))}
                className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-bold focus:outline-none focus:border-red-600"
              />
            </div>
          </div>
        </div>

        {/* Master Skills & Professional Bio */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <FileText className="w-4 h-4 text-red-600" />
            <h3 className="text-xs font-bold text-stone-900 uppercase">Master Skills & AI Bio (For Outreach & Resume Ranking)</h3>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-600 uppercase">Core Skills (Comma separated)</label>
            <textarea
              rows={2}
              value={skillsText}
              onChange={e => setSkillsText(e.target.value)}
              placeholder="React, TypeScript, Node.js, Python, PostgreSQL, AWS, GraphQL, Docker"
              className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-900 focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-600 uppercase">Professional Summary / AI Executive Bio</label>
            <textarea
              rows={3}
              value={bioSummary}
              onChange={e => setBioSummary(e.target.value)}
              placeholder="Senior Software Engineer with 5+ years of experience scaling distributed web platforms, high-throughput microservices, and leading frontend architecture..."
              className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-900 focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        {/* 1-CLICK GMAIL OAUTH CONNECTION */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-bold text-stone-900 uppercase">Gmail Integration (1-Click Google OAuth)</h3>
            </div>
            {gmailApiKey && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Gmail Connected</span>
              </span>
            )}
          </div>

          <p className="text-xs text-stone-500 leading-relaxed">
            Connect your Google Account to enable automatic recruiter response parsing and instant outreach email sending directly from CareerPilot!
          </p>

          <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-stone-900">Sign in with Google Account</p>
              <p className="text-[11px] text-stone-500">Authorize CareerPilot to send emails & auto-detect recruiter replies</p>
            </div>

            <button
              type="button"
              onClick={handleOneClickGoogleAuth}
              disabled={isConnectingGoogle}
              className="px-4 py-2 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-bold text-xs rounded-lg shadow-sm flex items-center gap-2 transition-all active:scale-[0.99]"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
              <span>{isConnectingGoogle ? 'Opening Google Sign-In...' : 'Connect Gmail (1-Click)'}</span>
            </button>
          </div>
        </div>

        {/* API Credentials */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
            <Key className="w-4 h-4 text-red-600" />
            <h3 className="text-xs font-bold text-stone-900 uppercase">AI Service Credentials (Groq & Gemini)</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-600 uppercase flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-red-600" />
                  <span>Groq API Key</span>
                </span>
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-0.5"
                >
                  <span>Get Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                placeholder="gsk_..."
                value={groqApiKey}
                onChange={e => setGroqApiKey(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-mono focus:outline-none focus:border-red-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-stone-600 uppercase flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-red-600" />
                  <span>Gemini API Key</span>
                </span>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-0.5"
                >
                  <span>Get Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <input
                type="password"
                placeholder="AIza..."
                value={geminiApiKey}
                onChange={e => setGeminiApiKey(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-mono focus:outline-none focus:border-red-600"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>Save All Profile & System Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
