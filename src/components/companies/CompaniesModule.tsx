import React, { useState } from 'react';
import { Building2, Plus, ExternalLink, Search, Globe, Copy, CheckCircle2, Mail, Sparkles, ArrowRight, FolderDown, Send } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { predictRecruiterEmails } from '../../utils/recruiterFinder';

export const CompaniesModule: React.FC = () => {
  const { companies, addCompany, applications, updateApplication, setActiveTab, addNotification, profile, resumes } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Drag and drop state for Companies Kanban
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  // New Company form
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [notes, setNotes] = useState('');

  // Portal Applications (applications that are web portal submissions / no HR email assigned yet)
  const portalApplications = applications.filter(app => {
    const isPortalOnly = !app.recruiterEmail || app.recruiterEmail.trim() === '' || app.recruiterEmail.includes('company.com') || app.recruiterEmail.includes('N/A');
    const matchesSearch = app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && isPortalOnly;
  });

  const importedApps = portalApplications.filter(a => a.portalStatus !== 'Applied');
  const appliedApps = portalApplications.filter(a => a.portalStatus === 'Applied');

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.techStack.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCompany({
      name,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      website: website || 'https://example.com',
      industry: 'Technology',
      tier: 'Unicorn',
      size: '500+ employees',
      location: 'San Francisco, CA',
      techStack: ['React', 'TypeScript', 'Node.js'],
      rating: 4.8,
      savedNotes: notes || 'Target careers portal added.'
    });
    setName('');
    setWebsite('');
    setNotes('');
    setIsAddModalOpen(false);
    addNotification('success', 'Target Company Added', `Added ${name} to Careers Portal section.`);
  };

  const handleCopyCoverNote = (compName: string, roleTitle: string, appId: string) => {
    const primaryResume = resumes[0];
    const coverNote = `Dear ${compName} Hiring Team,\n\nI am submitting my application for the ${roleTitle} position. With experience in ${primaryResume?.skills.slice(0, 4).join(', ') || 'software engineering'}, I am eager to contribute to ${compName}.\n\nSincerely,\n${profile.name}\n${profile.email}`;
    navigator.clipboard.writeText(coverNote);
    setCopiedId(appId);
    setTimeout(() => setCopiedId(null), 2000);
    addNotification('success', 'Cover Note Copied!', 'Copied tailored 3-line note for web portal textareas.');
  };

  const handlePromoteToEmail = (appId: string, compName: string) => {
    const predicted = predictRecruiterEmails(compName)[0].email;
    updateApplication(appId, { recruiterEmail: predicted });
    addNotification('success', 'Promoted to Active Email Pipeline!', `Assigned ${predicted} and moved to Applications section.`);
    setActiveTab('applications');
  };

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    setDraggedAppId(appId);
    e.dataTransfer.setData('text/plain', appId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: 'Imported' | 'Applied') => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('text/plain') || draggedAppId;
    if (appId) {
      updateApplication(appId, { portalStatus: targetStatus });
      addNotification('info', 'Portal Stage Updated', `Moved to ${targetStatus === 'Applied' ? 'Applied on Careers Portal' : 'Imported Careers Portals'}.`);
      setDraggedAppId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Explanation Banner */}
      <div className="bg-red-50/70 border border-red-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-red-900 font-extrabold text-xs">
            <Globe className="w-4 h-4 text-red-600" />
            <span>Target Companies & Careers Web Portals Kanban Board</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Drag and drop target jobs between <strong>Imported Careers Portals</strong> and <strong>Applied on Careers Portal</strong>! Once you discover an HR email or phone number, click <strong>"Promote to Email Application"</strong> to move it into your active outreach pipeline!
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Target Portal</span>
          </button>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-stone-200 p-4 rounded-xl shadow-sm">
        <div>
          <h3 className="text-xs font-bold text-stone-900 uppercase">Careers Web Portal Jobs ({portalApplications.length})</h3>
          <p className="text-[11px] text-stone-500">Auto-routed jobs without active HR email contact</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search portal jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 text-xs text-stone-800 placeholder-stone-400 pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-red-600"
          />
        </div>
      </div>

      {/* 2-COLUMN KANBAN BOARD: Imported vs Applied */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* COLUMN 1: Imported Careers Portals */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'Imported')}
          className="bg-stone-100/70 border border-stone-200 rounded-xl p-4 space-y-3 min-h-[400px]"
        >
          <div className="flex items-center justify-between pb-2 border-b border-stone-200">
            <div className="flex items-center gap-2">
              <FolderDown className="w-4 h-4 text-stone-600" />
              <h3 className="text-xs font-extrabold text-stone-900 font-outfit uppercase tracking-wider">
                1. Imported Careers Portals
              </h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
              {importedApps.length}
            </span>
          </div>

          {importedApps.length === 0 ? (
            <div className="p-8 text-center bg-white border border-dashed border-stone-300 rounded-xl text-stone-400 text-xs">
              No pending imported portals. Drag cards here!
            </div>
          ) : (
            importedApps.map(app => (
              <div
                key={app.id}
                draggable
                onDragStart={(e) => handleDragStart(e, app.id)}
                className="p-4 rounded-xl bg-white border border-stone-200 hover:border-red-500 transition-all shadow-sm space-y-3 cursor-grab active:cursor-grabbing group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 group-hover:text-red-600 transition-colors">
                      {app.roleTitle}
                    </h4>
                    <p className="text-[11px] text-stone-500">{app.companyName} • {app.location}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    To Apply
                  </span>
                </div>

                <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs flex items-center justify-between">
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Target Salary</span>
                  <span className="font-bold text-stone-900">{app.salaryRange || '$170k - $210k'}</span>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href={app.url || `https://${app.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/careers`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg flex items-center justify-center gap-1 text-[11px]"
                    >
                      <Globe className="w-3.5 h-3.5 text-red-600" />
                      <span>Launch Portal</span>
                    </a>
                    <button
                      onClick={() => handleCopyCoverNote(app.companyName, app.roleTitle, app.id)}
                      className="px-2.5 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold rounded-lg flex items-center justify-center gap-1 text-[11px]"
                    >
                      {copiedId === app.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-red-600" />}
                      <span>{copiedId === app.id ? 'Copied!' : 'Copy Note'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateApplication(app.id, { portalStatus: 'Applied' })}
                      className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>Mark Applied</span>
                    </button>
                    <button
                      onClick={() => handlePromoteToEmail(app.id, app.companyName)}
                      className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] rounded-lg flex items-center justify-center gap-1 shadow-xs"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Promote to Email</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* COLUMN 2: Applied on Careers Portal */}
        <div
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'Applied')}
          className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 space-y-3 min-h-[400px]"
        >
          <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-600" />
              <h3 className="text-xs font-extrabold text-emerald-900 font-outfit uppercase tracking-wider">
                2. Applied on Careers Portal
              </h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
              {appliedApps.length}
            </span>
          </div>

          {appliedApps.length === 0 ? (
            <div className="p-8 text-center bg-white border border-dashed border-emerald-300 rounded-xl text-emerald-600/70 text-xs">
              No completed portal applications yet. Drag cards here when submitted!
            </div>
          ) : (
            appliedApps.map(app => (
              <div
                key={app.id}
                draggable
                onDragStart={(e) => handleDragStart(e, app.id)}
                className="p-4 rounded-xl bg-white border border-emerald-200 hover:border-emerald-500 transition-all shadow-sm space-y-3 cursor-grab active:cursor-grabbing group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">
                      {app.roleTitle}
                    </h4>
                    <p className="text-[11px] text-stone-500">{app.companyName} • {app.location}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Applied ✓
                  </span>
                </div>

                <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-xs flex items-center justify-between">
                  <span className="text-[10px] font-bold text-stone-500 uppercase">Target Salary</span>
                  <span className="font-bold text-stone-900">{app.salaryRange || '$170k - $210k'}</span>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <a
                      href={app.url || `https://${app.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/careers`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg flex items-center justify-center gap-1 text-[11px]"
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      <span>View Portal</span>
                    </a>
                    <button
                      onClick={() => handleCopyCoverNote(app.companyName, app.roleTitle, app.id)}
                      className="px-2.5 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold rounded-lg flex items-center justify-center gap-1 text-[11px]"
                    >
                      {copiedId === app.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
                      <span>{copiedId === app.id ? 'Copied!' : 'Copy Note'}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handlePromoteToEmail(app.id, app.companyName)}
                    className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] rounded-lg flex items-center justify-center gap-1 shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Promote to Active Email Application</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Target Companies Directory */}
      <div className="pt-6 space-y-4">
        <h3 className="text-xs font-bold text-stone-900 uppercase">Target Companies Directory ({filteredCompanies.length})</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCompanies.map(comp => (
            <div key={comp.id} className="p-4 bg-white border border-stone-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  {comp.name}
                  <a href={comp.website} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-red-600">
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </h4>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-700">{comp.tier}</span>
              </div>
              <p className="text-[11px] text-stone-500">{comp.industry} • {comp.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add Company Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-xl p-5 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-stone-900 uppercase">Add Target Careers Portal Company</h3>
            <form onSubmit={handleCreateCompany} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Company Name *</label>
                <input type="text" required placeholder="e.g. Stripe" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900 font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Careers Portal URL</label>
                <input type="url" placeholder="https://stripe.com/jobs" value={website} onChange={e => setWebsite(e.target.value)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Notes / Application Details</label>
                <textarea rows={2} placeholder="Apply via Workday form..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3.5 py-1.5 bg-stone-100 text-xs font-bold rounded-lg text-stone-700">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-red-600 text-xs font-bold rounded-lg text-white shadow-xs">Save Portal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
