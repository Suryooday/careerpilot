import React, { useState } from 'react';
import { X, Plus, User, Mail } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PipelineStage, Priority, WorkType, JobType } from '../../types/crm';
import { analyzeATS } from '../../utils/atsScorer';

interface Props {
  onClose: () => void;
}

export const AddApplicationModal: React.FC<Props> = ({ onClose }) => {
  const { addApplication, resumes } = useCRM();

  const [companyName, setCompanyName] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [recruiterName, setRecruiterName] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [location, setLocation] = useState('San Francisco, CA');
  const [salaryRange, setSalaryRange] = useState('$170,000 - $210,000');
  const [workType, setWorkType] = useState<WorkType>('Hybrid');
  const [jobType, setJobType] = useState<JobType>('Full-time');
  const [stage, setStage] = useState<PipelineStage>('Companies');
  const [priority, setPriority] = useState<Priority>('High');
  const [jobDescription, setJobDescription] = useState('');
  const [url, setUrl] = useState('');
  const [tagsInput, setTagsInput] = useState('Fullstack, React');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !roleTitle.trim()) return;

    const primaryResume = resumes.find(r => r.isPrimary) || resumes[0];
    const atsResult = analyzeATS(jobDescription, primaryResume?.contentSummary || '', primaryResume?.skills || []);
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    addApplication({
      companyName,
      roleTitle,
      recruiterName: recruiterName.trim() || 'Hiring Manager',
      recruiterEmail: recruiterEmail.trim() || 'recruiter@company.com',
      location,
      salaryRange,
      workType,
      jobType,
      stage,
      priority,
      jobDescription: jobDescription || `${roleTitle} position at ${companyName}.`,
      url,
      atsScore: atsResult.score,
      matchedKeywords: atsResult.matchedKeywords,
      missingKeywords: atsResult.missingKeywords,
      tags
    });

    onClose();
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
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xl space-y-4">
        <div className="p-4 border-b border-stone-200 bg-[#fdfbf7] flex items-center justify-between">
          <h3 className="text-xs font-bold text-stone-900 font-outfit uppercase tracking-wider">New Job Application</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Company & Role */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Company Name *</label>
              <input
                type="text" required placeholder="e.g. Stripe"
                value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Role Title *</label>
              <input
                type="text" required placeholder="e.g. Senior Full Stack Engineer"
                value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)}
                className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Recruiter Details */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 border border-stone-200 rounded-xl">
            <div>
              <label className="text-[10px] font-bold text-stone-700 uppercase flex items-center gap-1">
                <User className="w-3 h-3 text-red-600" />
                <span>Recruiter / Contact Name</span>
              </label>
              <input
                type="text" placeholder="e.g. Sarah Jenkins"
                value={recruiterName} onChange={(e) => setRecruiterName(e.target.value)}
                className="w-full mt-1 bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-700 uppercase flex items-center gap-1">
                <Mail className="w-3 h-3 text-red-600" />
                <span>Recruiter Email</span>
              </label>
              <input
                type="email" placeholder="e.g. sjenkins@stripe.com"
                value={recruiterEmail} onChange={(e) => setRecruiterEmail(e.target.value)}
                className="w-full mt-1 bg-white border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          {/* Stage, Priority & Work Type */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Pipeline Stage</label>
              <select value={stage} onChange={(e) => setStage(e.target.value as PipelineStage)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-stone-900">
                {stages.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-stone-900">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-stone-600 uppercase">Work Type</label>
              <select value={workType} onChange={(e) => setWorkType(e.target.value as WorkType)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-stone-900">
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          {/* Job Description */}
          <div>
            <label className="text-[10px] font-bold text-stone-600 uppercase">Job Description Text (For ATS Scoring & RAG)</label>
            <textarea
              rows={4} placeholder="Paste requirements..."
              value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
              className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900 focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-lg">
              Cancel
            </button>
            <button type="submit" className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" />
              <span>Create Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
