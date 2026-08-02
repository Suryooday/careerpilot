import React, { useState } from 'react';
import {
  FileText, Sparkles, Copy, Check, Plus, Trash2, Save,
  Briefcase, FolderGit2, Layers, Cpu
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { analyzeATS } from '../../utils/atsScorer';
import { generateGroqResumeAdvice } from '../../utils/aiEngine';

export const ResumeModule: React.FC = () => {
  const { masterProfile, updateMasterProfile, applications, profile, addNotification } = useCRM();

  const [activeTab, setActiveTab] = useState<'advisor' | 'master'>('advisor');

  // Master Details State
  const [skillsText, setSkillsText] = useState(masterProfile.skills.join(', '));
  const [projects, setProjects] = useState(masterProfile.projects);
  const [internships, setInternships] = useState(masterProfile.internships);
  const [certificationsText, setCertificationsText] = useState(masterProfile.certifications.join('\n'));
  const [education, setEducation] = useState(masterProfile.education);

  // Advisor State (JD Input)
  const [targetCompany, setTargetCompany] = useState('Stripe');
  const [targetRole, setTargetRole] = useState('Senior Full Stack Engineer');
  const [jdText, setJdText] = useState(applications[0]?.jobDescription || '');
  const [isGroqAnalyzing, setIsGroqAnalyzing] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Live Groq Response State
  const [groqResults, setGroqResults] = useState<{
    matchedSkills: string[];
    missingSkills: string[];
    rankedProjects: { title: string; techStack: string; description: string }[];
    overleafBullets: string;
  } | null>(null);

  // New Project Input State
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjTech, setNewProjTech] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');

  // New Internship Input State
  const [newInternCompany, setNewInternCompany] = useState('');
  const [newInternRole, setNewInternRole] = useState('');
  const [newInternPeriod, setNewInternPeriod] = useState('');
  const [newInternHighlights, setNewInternHighlights] = useState('');

  // Save Master Profile
  const handleSaveMasterProfile = () => {
    const skillsArray = skillsText.split(',').map(s => s.trim()).filter(Boolean);
    const certsArray = certificationsText.split('\n').map(c => c.trim()).filter(Boolean);

    updateMasterProfile({
      skills: skillsArray,
      projects,
      internships,
      certifications: certsArray,
      education
    });
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle.trim()) return;
    const updated = [
      ...projects,
      { id: 'proj-' + Date.now(), title: newProjTitle, techStack: newProjTech, description: newProjDesc }
    ];
    setProjects(updated);
    updateMasterProfile({ projects: updated });
    setNewProjTitle(''); setNewProjTech(''); setNewProjDesc('');
  };

  const handleAddInternship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInternCompany.trim()) return;
    const updated = [
      ...internships,
      { id: 'exp-' + Date.now(), company: newInternCompany, role: newInternRole, period: newInternPeriod, highlights: newInternHighlights }
    ];
    setInternships(updated);
    updateMasterProfile({ internships: updated });
    setNewInternCompany(''); setNewInternRole(''); setNewInternPeriod(''); setNewInternHighlights('');
  };

  const handleRemoveProject = (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    updateMasterProfile({ projects: updated });
  };

  const handleRemoveInternship = (id: string) => {
    const updated = internships.filter(i => i.id !== id);
    setInternships(updated);
    updateMasterProfile({ internships: updated });
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addNotification('success', 'Copied!', 'Content copied for Overleaf LaTeX.');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Run Groq AI API Ranking
  const handleRunGroqAdvice = async () => {
    if (!jdText.trim()) return;
    setIsGroqAnalyzing(true);
    const result = await generateGroqResumeAdvice(
      jdText,
      masterProfile,
      profile.groqApiKey || import.meta.env.VITE_GROQ_API_KEY || ''
    );
    setGroqResults(result);
    setIsGroqAnalyzing(false);
    addNotification('success', 'Groq AI Ranking Complete', 'Resume content ranked & LaTeX bullets generated via Groq API!');
  };

  // Fallback / default calculations
  const atsResult = analyzeATS(jdText, masterProfile.skills.join(' '), masterProfile.skills);
  const displayMatched = groqResults?.matchedSkills || atsResult.matchedKeywords;
  const displayMissing = groqResults?.missingSkills || atsResult.missingKeywords;
  const displayProjects = groqResults?.rankedProjects || masterProfile.projects;
  const overleafBullets = groqResults?.overleafBullets || masterProfile.internships.map(i => `\\item \\textbf{${i.company}} (${i.role}): ${i.highlights}`).join('\n');
  const overleafSkillsContent = `\\textbf{Technical Skills:} ${displayMatched.join(', ')}`;
  const overleafProjectsContent = displayProjects.map(p => `\\item \\textbf{${p.title}} [${p.techStack}]: ${p.description}`).join('\n');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-stone-200 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-50 text-red-600">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Groq AI Overleaf Resume Advisor</h2>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                Groq API Active
              </span>
            </div>
            <p className="text-[11px] text-stone-500">Powered by Groq API (`gsk_37X...`) for instant project ranking & LaTeX bullet generation</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200">
          <button
            onClick={() => setActiveTab('advisor')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              activeTab === 'advisor' ? 'bg-white text-red-600 shadow-sm' : 'text-stone-600'
            }`}
          >
            Groq JD Advisor (Overleaf)
          </button>
          <button
            onClick={() => setActiveTab('master')}
            className={`px-3 py-1 rounded text-xs font-bold transition-all ${
              activeTab === 'master' ? 'bg-white text-red-600 shadow-sm' : 'text-stone-600'
            }`}
          >
            Master Details ({masterProfile.projects.length} Projects, {masterProfile.internships.length} Internships)
          </button>
        </div>
      </div>

      {activeTab === 'advisor' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Job Description Input Box */}
          <div className="lg:col-span-5 bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-xs font-bold text-stone-900 uppercase">Paste Target Job Description (JD)</h3>
              <select
                onChange={(e) => {
                  const app = applications.find(a => a.id === e.target.value);
                  if (app) {
                    setTargetCompany(app.companyName);
                    setTargetRole(app.roleTitle);
                    setJdText(app.jobDescription);
                  }
                }}
                className="bg-stone-50 text-[11px] font-bold text-stone-700 border border-stone-200 rounded px-2 py-1 focus:outline-none"
              >
                <option value="">Load from Applications...</option>
                {applications.map(a => <option key={a.id} value={a.id}>{a.companyName} - {a.roleTitle}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Target Company</label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-900 font-bold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Role Title</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1 text-xs text-stone-900 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Paste Job Description Text</label>
              <textarea
                rows={11}
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste JD requirements, skills, duties..."
                className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-800 leading-relaxed focus:border-red-600 focus:outline-none"
              />
            </div>

            {/* Run Groq AI Button */}
            <button
              onClick={handleRunGroqAdvice}
              disabled={isGroqAnalyzing}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGroqAnalyzing ? 'Ranking with Groq AI API...' : 'Rank Content & Generate Overleaf Bullets with Groq AI'}</span>
            </button>
          </div>

          {/* Right: Overleaf Content Recommendations */}
          <div className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-bold text-stone-900 uppercase">Groq AI Overleaf LaTeX Content Output</h3>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                {atsResult.score}% ATS Score
              </span>
            </div>

            {/* 1. Recommended Skills for LaTeX */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-900 uppercase">1. Skills to Highlight in Overleaf</h4>
                <button
                  onClick={() => copyToClipboard(overleafSkillsContent, 'skills')}
                  className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'skills' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy LaTeX Line</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {displayMatched.map(kw => (
                  <span key={kw} className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-stone-800 border border-stone-200">
                    ✓ {kw}
                  </span>
                ))}
              </div>

              {displayMissing.length > 0 && (
                <div className="pt-2">
                  <p className="text-[10px] font-bold text-red-700 uppercase mb-1">Missing Keywords (Add to Overleaf LaTeX)</p>
                  <div className="flex flex-wrap gap-1">
                    {displayMissing.map(kw => (
                      <span key={kw} className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Groq Ranked Projects for Overleaf */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-900 uppercase">2. Ranked Projects for Overleaf ({displayProjects.length})</h4>
                <button
                  onClick={() => copyToClipboard(overleafProjectsContent, 'projects')}
                  className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'projects' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Projects LaTeX</span>
                </button>
              </div>

              <div className="space-y-2">
                {displayProjects.map((proj, idx) => (
                  <div key={idx} className="p-2.5 bg-white border border-stone-200 rounded-lg space-y-1 text-xs">
                    <p className="font-bold text-stone-900">{proj.title} <span className="text-[10px] font-normal text-stone-500">[{proj.techStack}]</span></p>
                    <p className="text-stone-700">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Recommended Internship Bullet Points */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-900 uppercase">3. Internship & Work Experience Bullet Points</h4>
                <button
                  onClick={() => copyToClipboard(overleafBullets, 'bullets')}
                  className="text-[10px] font-bold text-red-600 hover:underline flex items-center gap-1"
                >
                  {copiedKey === 'bullets' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Experience LaTeX</span>
                </button>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded-lg font-mono text-[11px] text-stone-800 leading-relaxed whitespace-pre-line">
                {overleafBullets}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Master Details View */
        <div className="space-y-6">
          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-900 uppercase flex items-center gap-2">
                <Layers className="w-4 h-4 text-red-600" />
                <span>Master Skills Repository (Comma Separated)</span>
              </h3>
              <button onClick={handleSaveMasterProfile} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded flex items-center gap-1">
                <Save className="w-3.5 h-3.5" />
                <span>Save Master Profile</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-900 font-semibold focus:border-red-600 focus:outline-none"
            />
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-stone-900 uppercase flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-red-600" />
              <span>Projects Repository ({projects.length})</span>
            </h3>

            <form onSubmit={handleAddProject} className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <p className="text-[10px] font-bold text-stone-600 uppercase">Add Project to Master Repository</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text" placeholder="Project Title"
                  value={newProjTitle} onChange={e => setNewProjTitle(e.target.value)}
                  className="bg-white border border-stone-200 rounded px-2.5 py-1 text-xs text-stone-900"
                />
                <input
                  type="text" placeholder="Tech Stack"
                  value={newProjTech} onChange={e => setNewProjTech(e.target.value)}
                  className="bg-white border border-stone-200 rounded px-2.5 py-1 text-xs text-stone-900"
                />
              </div>
              <textarea
                rows={2} placeholder="Impact description..."
                value={newProjDesc} onChange={e => setNewProjDesc(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded p-2 text-xs text-stone-900"
              />
              <button type="submit" className="px-3 py-1 bg-stone-800 text-white text-xs font-bold rounded flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {projects.map(proj => (
                <div key={proj.id} className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1 relative group">
                  <button onClick={() => handleRemoveProject(proj.id)} className="absolute top-3 right-3 text-stone-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <h4 className="text-xs font-bold text-stone-900">{proj.title}</h4>
                  <p className="text-[10px] font-bold text-red-600">{proj.techStack}</p>
                  <p className="text-xs text-stone-700 pt-1 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-stone-900 uppercase flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-red-600" />
              <span>Internships & Experience ({internships.length})</span>
            </h3>

            <form onSubmit={handleAddInternship} className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
              <p className="text-[10px] font-bold text-stone-600 uppercase">Add Internship / Experience</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text" placeholder="Company"
                  value={newInternCompany} onChange={e => setNewInternCompany(e.target.value)}
                  className="bg-white border border-stone-200 rounded px-2.5 py-1 text-xs text-stone-900"
                />
                <input
                  type="text" placeholder="Role"
                  value={newInternRole} onChange={e => setNewInternRole(e.target.value)}
                  className="bg-white border border-stone-200 rounded px-2.5 py-1 text-xs text-stone-900"
                />
                <input
                  type="text" placeholder="Period"
                  value={newInternPeriod} onChange={e => setNewInternPeriod(e.target.value)}
                  className="bg-white border border-stone-200 rounded px-2.5 py-1 text-xs text-stone-900"
                />
              </div>
              <textarea
                rows={2} placeholder="Bullet points..."
                value={newInternHighlights} onChange={e => setNewInternHighlights(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded p-2 text-xs text-stone-900"
              />
              <button type="submit" className="px-3 py-1 bg-stone-800 text-white text-xs font-bold rounded flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Internship</span>
              </button>
            </form>

            <div className="space-y-3">
              {internships.map(exp => (
                <div key={exp.id} className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-1 relative">
                  <button onClick={() => handleRemoveInternship(exp.id)} className="absolute top-3 right-3 text-stone-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-stone-900">{exp.company}</h4>
                    <span className="text-xs text-stone-500">• {exp.role} ({exp.period})</span>
                  </div>
                  <p className="text-xs text-stone-700 pt-1 leading-relaxed">{exp.highlights}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
