import React, { useState } from 'react';
import { Building2, Plus, ExternalLink, Search, Globe, Copy, CheckCircle2, Mail, Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { predictRecruiterEmails } from '../../utils/recruiterFinder';

export const CompaniesModule: React.FC = () => {
  const { companies, addCompany, applications, updateApplication, setActiveTab, addNotification, profile, resumes } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Company form
  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [tier, setTier] = useState<'FAANG/Big Tech' | 'Unicorn' | 'Growth Startup' | 'Early Stage' | 'Enterprise'>('Unicorn');
  const [techStackInput, setTechStackInput] = useState('React, TypeScript, Python');
  const [notes, setNotes] = useState('');

  // Portal Applications (applications that are web portal submissions / no HR email assigned yet)
  const portalApplications = applications.filter(app => {
    const isPortalOnly = !app.recruiterEmail || app.recruiterEmail.includes('company.com') || app.recruiterEmail.includes('N/A');
    const matchesSearch = app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.roleTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && isPortalOnly;
  });

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
      industry,
      tier,
      size: '500+ employees',
      location: 'San Francisco, CA',
      techStack: techStackInput.split(',').map(t => t.trim()),
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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Explanation Banner */}
      <div className="bg-red-50/70 border border-red-200 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-red-900 font-extrabold text-xs">
            <Globe className="w-4 h-4 text-red-600" />
            <span>Target Companies & Careers Web Portals Section</span>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            Apply via Workday, Lever, Greenhouse, or Ashby portals here! Once you find a valid HR email or phone number, click <strong>"Promote to Email Application"</strong> to move it into your active outreach pipeline!
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
          <h3 className="text-xs font-bold text-stone-900 uppercase">Careers Web Portal Applications ({portalApplications.length})</h3>
          <p className="text-[11px] text-stone-500">Applications submitted via company websites without direct HR email</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search portal companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 text-xs text-stone-800 placeholder-stone-400 pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 focus:outline-none focus:border-red-600"
          />
        </div>
      </div>

      {/* Portal Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {portalApplications.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white border border-dashed border-stone-300 rounded-xl space-y-2">
            <Globe className="w-8 h-8 text-stone-300 mx-auto" />
            <p className="text-xs font-bold text-stone-700">No Web Portal Applications Pending</p>
            <p className="text-[11px] text-stone-500">All applications with valid HR emails are active in your Applications outreach pipeline!</p>
          </div>
        ) : (
          portalApplications.map(app => (
            <div key={app.id} className="p-5 rounded-xl bg-white border border-stone-200 hover:border-red-500 transition-all shadow-sm space-y-3 flex flex-col justify-between group">
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-stone-100 border border-stone-200 flex items-center justify-center font-extrabold text-sm text-stone-700">
                      {app.companyName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 group-hover:text-red-600 transition-colors">
                        {app.roleTitle}
                      </h4>
                      <p className="text-[11px] text-stone-500">{app.companyName} • {app.location}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                    Careers Portal
                  </span>
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-xs space-y-1">
                  <p className="text-[10px] font-bold text-stone-500 uppercase">Target Salary & Work Type</p>
                  <p className="font-bold text-stone-900">{app.salaryRange || '$170k - $210k'} ({app.workType})</p>
                </div>
              </div>

              {/* Action Buttons: Launch Portal, Copy Cover Note, Promote to Email */}
              <div className="pt-3 border-t border-stone-200 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {app.url ? (
                    <a
                      href={app.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-red-600" />
                      <span>Launch Portal</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => alert(`Company URL: https://${app.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com/careers`)}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold rounded-lg flex items-center justify-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5 text-red-600" />
                      <span>Find Careers</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleCopyCoverNote(app.companyName, app.roleTitle, app.id)}
                    className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    {copiedId === app.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-red-600" />}
                    <span>{copiedId === app.id ? 'Copied!' : 'Copy Note'}</span>
                  </button>
                </div>

                <button
                  onClick={() => handlePromoteToEmail(app.id, app.companyName)}
                  className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.98]"
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
