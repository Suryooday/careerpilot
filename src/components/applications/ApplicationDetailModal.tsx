import React, { useState } from 'react';
import { X, ExternalLink, Send, Trash2, Mail, Sparkles, User, Briefcase, MapPin, DollarSign, Tag, Clock, Globe, Copy, CheckCircle2 } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PipelineStage } from '../../types/crm';
import { analyzeATS } from '../../utils/atsScorer';
import { predictRecruiterEmails } from '../../utils/recruiterFinder';

interface Props {
  appId: string;
  onClose: () => void;
}

export const ApplicationDetailModal: React.FC<Props> = ({ appId, onClose }) => {
  const {
    applications, updateApplicationStage, updateApplication, addNoteToApplication, deleteApplication,
    resumes, createDraftEmailFromApp, setActiveTab, addNotification, profile
  } = useCRM();

  const [activeTab, setActiveTabState] = useState<'info' | 'jd' | 'notes' | 'recruiter'>('info');
  const [newNoteText, setNewNoteText] = useState('');
  const [isGeneratingRAG, setIsGeneratingRAG] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);

  const app = applications.find(a => a.id === appId);
  if (!app) return null;

  const resume = resumes.find(r => r.id === app.resumeVersionId);
  const atsResult = analyzeATS(app.jobDescription, resume?.contentSummary || '', resume?.skills || []);
  const predictedEmails = predictRecruiterEmails(app.companyName, app.url);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addNoteToApplication(app.id, newNoteText);
    setNewNoteText('');
  };

  const handleGenerateDraftEmail = async () => {
    setIsGeneratingRAG(true);
    await createDraftEmailFromApp(app.id, 'Follow-up');
    setIsGeneratingRAG(false);
    onClose();
    setActiveTab('email');
  };

  const handleAssignPredictedEmail = (selectedEmail: string) => {
    updateApplication(app.id, { recruiterEmail: selectedEmail });
    addNotification('success', 'Recruiter Email Assigned', `Set contact email to ${selectedEmail}`);
  };

  const handleCopyPortalNote = () => {
    const noteText = `Hi ${app.companyName} Hiring Team,\n\nI am writing to apply for the ${app.roleTitle} position. With strong experience in ${resume?.skills.slice(0, 5).join(', ') || 'software engineering'}, I am eager to contribute to ${app.companyName}.\n\nBest regards,\n${profile.name}\n${profile.email}`;
    navigator.clipboard.writeText(noteText);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
    addNotification('success', 'Copied to Clipboard', 'Quick cover note copied for Careers Portal form submission!');
  };

  const stages: PipelineStage[] = [
    'Companies',
    'Mail Drafted',
    'Mail Sent',
    'Response Recieved',
    'Interview',
    'Accepted',
    'Closed Selection'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-xl bg-white border-l border-stone-200 h-full overflow-y-auto flex flex-col shadow-2xl animate-in slide-in-from-right duration-150">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-[#fdfbf7] sticky top-0 z-10 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded bg-stone-100 border border-stone-200 flex items-center justify-center font-extrabold text-base text-stone-700">
              {app.companyName.charAt(0)}
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900 font-outfit leading-tight">{app.roleTitle}</h2>
              <p className="text-xs text-stone-500 flex items-center gap-2 mt-0.5">
                <span className="font-bold text-stone-800">{app.companyName}</span>
                <span>•</span>
                <span>{app.location}</span>
                {app.url && (
                  <a href={app.url} target="_blank" rel="noreferrer" className="text-red-600 font-bold hover:underline flex items-center gap-0.5">
                    <span>Portal Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 bg-stone-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stage Strip & Actions */}
        <div className="p-3 bg-stone-50 border-b border-stone-200 grid grid-cols-3 gap-3 text-center text-xs">
          <div className="p-2 bg-white border border-stone-200 rounded-lg">
            <p className="text-[10px] text-stone-400 uppercase font-bold">Stage</p>
            <select
              value={app.stage}
              onChange={(e) => updateApplicationStage(app.id, e.target.value as PipelineStage)}
              className="bg-transparent text-xs font-bold text-stone-900 focus:outline-none cursor-pointer mt-0.5"
            >
              {stages.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="p-2 bg-white border border-stone-200 rounded-lg">
            <p className="text-[10px] text-stone-400 uppercase font-bold">ATS Score</p>
            <p className="text-xs font-extrabold text-stone-900 mt-0.5">{atsResult.score}% Match</p>
          </div>

          <div className="p-2 bg-white border border-stone-200 rounded-lg flex items-center justify-center">
            <button
              onClick={handleGenerateDraftEmail}
              disabled={isGeneratingRAG}
              className="w-full h-full py-1 px-2 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded flex items-center justify-center gap-1 shadow-xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>{isGeneratingRAG ? 'Generating...' : 'Draft RAG Email'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-200 px-6 bg-[#fdfbf7] overflow-x-auto">
          <button
            onClick={() => setActiveTabState('info')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'info' ? 'border-red-600 text-red-600' : 'border-transparent text-stone-500'
            }`}
          >
            Imported Application Details
          </button>
          <button
            onClick={() => setActiveTabState('jd')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'jd' ? 'border-red-600 text-red-600' : 'border-transparent text-stone-500'
            }`}
          >
            Job Description & ATS
          </button>
          <button
            onClick={() => setActiveTabState('notes')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'notes' ? 'border-red-600 text-red-600' : 'border-transparent text-stone-500'
            }`}
          >
            Notes ({app.notes.length})
          </button>
          <button
            onClick={() => setActiveTabState('recruiter')}
            className={`py-3 px-3 text-xs font-bold border-b-2 transition-all shrink-0 ${
              activeTab === 'recruiter' ? 'border-red-600 text-red-600' : 'border-transparent text-stone-500'
            }`}
          >
            Recruiter Details & AI Finder
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 space-y-6 flex-1">
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* CAREERS PORTAL LINK & ACTION BANNER */}
              {app.url ? (
                <div className="p-4 bg-red-50/60 border border-red-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-red-900 font-bold text-xs">
                      <Globe className="w-4 h-4 text-red-600" />
                      <span>Careers Web Portal Application</span>
                    </div>
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>Open Careers Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <p className="text-[11px] text-stone-600">
                    Applying via company website? Click below to copy a quick tailored cover note for the form textarea!
                  </p>

                  <button
                    onClick={handleCopyPortalNote}
                    className="w-full py-2 bg-white hover:bg-stone-100 border border-red-200 text-red-700 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    {copiedNote ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedNote ? 'Copied Cover Note!' : 'Copy Portal Quick Cover Note'}</span>
                  </button>
                </div>
              ) : null}

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-stone-900 uppercase">Key Candidate Application Information</h4>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1">
                      <Briefcase className="w-3 h-3 text-red-600" />
                      <span>Company Name</span>
                    </span>
                    <p className="font-bold text-stone-900">{app.companyName}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1">
                      <User className="w-3 h-3 text-red-600" />
                      <span>Role Title</span>
                    </span>
                    <p className="font-bold text-stone-900">{app.roleTitle}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-600" />
                      <span>Location & Work Type</span>
                    </span>
                    <p className="font-bold text-stone-900">{app.location} ({app.workType})</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-red-600" />
                      <span>Salary Range</span>
                    </span>
                    <p className="font-bold text-stone-900">{app.salaryRange || 'N/A'}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1">
                      <User className="w-3 h-3 text-red-600" />
                      <span>Recruiter Contact</span>
                    </span>
                    <p className="font-bold text-stone-900">{app.recruiterName || 'Hiring Manager'}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1">
                      <Mail className="w-3 h-3 text-red-600" />
                      <span>Recruiter Email</span>
                    </span>
                    <p className="font-bold text-stone-900">{app.recruiterEmail || 'Not set (Use AI Finder below)'}</p>
                  </div>
                </div>
              </div>

              {app.tags && app.tags.length > 0 && (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-500 uppercase flex items-center gap-1">
                    <Tag className="w-3 h-3 text-red-600" />
                    <span>Imported Tags</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {app.tags.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-stone-800 border border-stone-200">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'jd' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase">ATS Keyword Match Analysis</h4>
                <div>
                  <p className="text-[11px] font-bold text-stone-700 mb-1">Matched Keywords ({atsResult.matchedKeywords.length})</p>
                  <div className="flex flex-wrap gap-1">
                    {atsResult.matchedKeywords.map(kw => (
                      <span key={kw} className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-stone-800 border border-stone-200">
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                {atsResult.missingKeywords.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-red-700 mb-1">Missing Key Skills ({atsResult.missingKeywords.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {atsResult.missingKeywords.map(kw => (
                        <span key={kw} className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-stone-900 uppercase mb-2">Job Description Text</h4>
                <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 leading-relaxed whitespace-pre-line">
                  {app.jobDescription}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              <p className="text-[11px] text-stone-500">
                Notes saved here are automatically retrieved by the RAG engine to personalize generated outreach emails!
              </p>

              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  placeholder="e.g. 'Met engineering manager at React meetup', 'Discussed microservices experience'..."
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  rows={3}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-red-600"
                />
                <button type="submit" className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5">
                  <Send className="w-3.5 h-3.5" />
                  <span>Save RAG Note</span>
                </button>
              </form>

              <div className="space-y-2">
                {app.notes.map(note => (
                  <div key={note.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-500">
                      <span className="font-bold text-red-600">{note.author}</span>
                      <span>{note.createdAt}</span>
                    </div>
                    <p className="text-xs text-stone-800">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'recruiter' && (
            <div className="space-y-4">
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase">Assigned Recruiter Contact</h4>
                <div className="space-y-1 text-xs text-stone-800">
                  <p><strong>Name:</strong> {app.recruiterName || 'Hiring Manager'}</p>
                  <p><strong>Email:</strong> {app.recruiterEmail || 'Not assigned yet'}</p>
                </div>
              </div>

              {/* SMART AI HR EMAIL FINDER / PREDICTOR */}
              <div className="p-4 bg-white border border-stone-200 rounded-xl space-y-3 shadow-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-red-600" />
                  <h4 className="text-xs font-bold text-stone-900 uppercase">Smart AI HR Email Finder (Domain Predictor)</h4>
                </div>
                <p className="text-[11px] text-stone-500">
                  No HR email address found? Select one of the predicted recruiter email addresses for <strong>{app.companyName}</strong> below to assign it with 1 click:
                </p>

                <div className="space-y-2">
                  {predictedEmails.map(item => (
                    <div key={item.email} className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between gap-3 text-xs">
                      <div>
                        <p className="font-bold text-stone-900 font-mono">{item.email}</p>
                        <p className="text-[10px] text-stone-500">{item.label} • {item.confidence}</p>
                      </div>

                      <button
                        onClick={() => handleAssignPredictedEmail(item.email)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                          app.recruiterEmail === item.email
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300'
                        }`}
                      >
                        {app.recruiterEmail === item.email ? '✓ Assigned' : 'Use Email'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-[#fdfbf7] flex items-center justify-between">
          <button
            onClick={() => { if (confirm('Delete application?')) { deleteApplication(app.id); onClose(); } }}
            className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 text-xs font-bold rounded-lg border border-red-200 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete</span>
          </button>
          <button onClick={onClose} className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
