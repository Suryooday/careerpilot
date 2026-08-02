import React, { useState } from 'react';
import { Settings, Save, Mail, Cpu, Sparkles, Key, ExternalLink, CheckCircle2 } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { requestGoogleOneClickAuth } from '../../services/gmailService';

export const SettingsModule: React.FC = () => {
  const { profile, updateProfile, addNotification } = useCRM();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [targetTitle, setTargetTitle] = useState(profile.targetTitle);
  const [desiredSalaryMin, setDesiredSalaryMin] = useState(profile.desiredSalaryMin);
  const [desiredSalaryMax, setDesiredSalaryMax] = useState(profile.desiredSalaryMax);
  const [gmailApiKey, setGmailApiKey] = useState(profile.gmailApiKey || '');
  const [gmailClientId, setGmailClientId] = useState(profile.gmailClientId || '219885217250-k2s6hq6dgurqppjlk6vp2lp6p0j3adf0.apps.googleusercontent.com');
  const [groqApiKey, setGroqApiKey] = useState(profile.groqApiKey || '');
  const [geminiApiKey, setGeminiApiKey] = useState(profile.geminiApiKey || '');

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
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 bg-white border border-stone-200 p-4 rounded-xl shadow-sm">
        <div className="p-2 rounded-lg bg-red-50 text-red-600">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Settings & 1-Click API Connections</h2>
          <p className="text-[11px] text-stone-500">Normal users can simply click "Connect Gmail" to sign in with 1 click!</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-sm">
          <h3 className="text-xs font-bold text-stone-900 uppercase">Profile Settings</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Full Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-bold" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-600 uppercase">Target Job Title</label>
            <input type="text" value={targetTitle} onChange={e => setTargetTitle(e.target.value)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-red-700 font-bold" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Salary Target Min ($ USD)</label>
              <input type="number" value={desiredSalaryMin} onChange={e => setDesiredSalaryMin(Number(e.target.value))} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-bold" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Salary Target Max ($ USD)</label>
              <input type="number" value={desiredSalaryMax} onChange={e => setDesiredSalaryMax(Number(e.target.value))} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-bold" />
            </div>
          </div>
        </div>

        {/* 1-CLICK GMAIL OAUTH CONNECTION (FOR NORMAL USERS) */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-bold text-stone-900 uppercase">Gmail Integration (1-Click Connect for Normal Users)</h3>
            </div>
            {gmailApiKey && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Gmail Connected</span>
              </span>
            )}
          </div>

          <p className="text-xs text-stone-500 leading-relaxed">
            Normal users don't need developer tools or technical setups! Simply click the Google sign-in button below to authorize Gmail sending & response auto-sync with 1 click.
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

        {/* Groq API Configuration */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-bold text-stone-900 uppercase">Groq API Key (Resume Content Ranking & Overleaf LaTeX)</h3>
            </div>
            <a
              href="https://console.groq.com/keys"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              <span>Get Free Groq Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone-600 uppercase">Your Personal Groq API Key</label>
            <input
              type="password"
              placeholder="gsk_..."
              value={groqApiKey}
              onChange={e => setGroqApiKey(e.target.value)}
              className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-mono"
            />
          </div>
        </div>

        {/* Gemini API Configuration */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              <h3 className="text-xs font-bold text-stone-900 uppercase">Gemini API Key (Email Drafting & Copilot)</h3>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1"
            >
              <span>Get Free Gemini Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone-600 uppercase">Your Personal Gemini API Key</label>
            <input
              type="password"
              placeholder="AIza..."
              value={geminiApiKey}
              onChange={e => setGeminiApiKey(e.target.value)}
              className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm">
            <Save className="w-3.5 h-3.5" />
            <span>Save All Personal Credentials</span>
          </button>
        </div>
      </form>
    </div>
  );
};
