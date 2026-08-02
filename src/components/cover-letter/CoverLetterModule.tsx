import React, { useState } from 'react';
import { PenTool, Copy, Check, Save } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { generateAICoverLetter } from '../../utils/aiEngine';

export const CoverLetterModule: React.FC = () => {
  const { coverLetters, saveCoverLetter, applications, resumes, profile } = useCRM();

  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [tone, setTone] = useState<'Professional' | 'Energetic' | 'Concise' | 'Creative'>('Professional');
  const [copied, setCopied] = useState(false);

  const targetApp = applications.find(a => a.id === selectedAppId) || applications[0];
  const primaryResume = resumes.find(r => r.isPrimary) || resumes[0];

  const [content, setContent] = useState<string>(() => {
    return generateAICoverLetter(targetApp, primaryResume, tone, profile.name);
  });

  const handleGenerate = () => {
    const generated = generateAICoverLetter(targetApp, primaryResume, tone, profile.name);
    setContent(generated);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    saveCoverLetter({
      title: `${targetApp.companyName} Cover Letter`,
      targetCompany: targetApp.companyName,
      targetRole: targetApp.roleTitle,
      tone,
      content
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-stone-200 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-50 text-red-600">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Cover Letter Studio</h2>
            <p className="text-[11px] text-stone-500">AI cover letters tailored to role & tone</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-4 bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-stone-900 uppercase pb-2 border-b border-stone-200">
            Generator Setup
          </h3>

          <div>
            <label className="text-[10px] font-bold text-stone-600 uppercase">Target Job Application</label>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-stone-900"
            >
              {applications.map(a => (
                <option key={a.id} value={a.id}>{a.companyName} - {a.roleTitle}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-stone-600 uppercase">Tone & Style</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-stone-900"
            >
              <option value="Professional">Professional & Direct</option>
              <option value="Energetic">Energetic & Enthusiastic</option>
              <option value="Concise">Concise Bulleted</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm"
          >
            <span>Generate Cover Letter</span>
          </button>
        </div>

        {/* Editor */}
        <div className="lg:col-span-8 space-y-4 bg-white border border-stone-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <h3 className="text-sm font-bold text-stone-900 font-outfit">Cover Letter Preview</h3>
                <p className="text-[11px] text-stone-500">{targetApp.roleTitle} at {targetApp.companyName}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={handleCopy} className="px-3 py-1 bg-stone-100 border border-stone-300 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-lg flex items-center gap-1">
                  {copied ? <Check className="w-3.5 h-3.5 text-red-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button onClick={handleSave} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-sm">
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            <textarea
              rows={16}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-4 text-xs text-stone-800 leading-relaxed font-sans focus:outline-none focus:border-red-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
