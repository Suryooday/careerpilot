import React, { useState } from 'react';
import { Building2, Plus, ExternalLink, Search } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const CompaniesModule: React.FC = () => {
  const { companies, addCompany } = useCRM();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [website, setWebsite] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [tier, setTier] = useState<'FAANG/Big Tech' | 'Unicorn' | 'Growth Startup' | 'Early Stage' | 'Enterprise'>('Unicorn');
  const [techStackInput, setTechStackInput] = useState('React, TypeScript, Python');
  const [notes, setNotes] = useState('');

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
      savedNotes: notes || 'Target company added.'
    });
    setName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Search & Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-stone-200 p-4 rounded-xl shadow-sm">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-stone-50 text-xs text-stone-800 placeholder-stone-400 pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 focus:outline-none"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Target Company</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map(comp => (
          <div key={comp.id} className="p-5 rounded-xl bg-white border border-stone-200 hover:border-red-500 transition-all shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={comp.logo} alt={comp.name} className="w-10 h-10 rounded object-cover border border-stone-200" />
                  <div>
                    <h3 className="text-xs font-bold text-stone-900 font-outfit flex items-center gap-1.5">
                      {comp.name}
                      <a href={comp.website} target="_blank" rel="noreferrer" className="text-stone-400 hover:text-red-600">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </h3>
                    <p className="text-[11px] text-stone-500">{comp.industry} • {comp.location}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                  {comp.tier}
                </span>
              </div>

              <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-lg border border-stone-200 line-clamp-2">
                "{comp.savedNotes}"
              </p>

              <div className="space-y-1">
                <div className="flex flex-wrap gap-1">
                  {comp.techStack.map(tech => (
                    <span key={tech} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2.5 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
              <span>Rating: <strong className="text-stone-900">{comp.rating}</strong></span>
              <span className="font-bold text-red-600">{comp.openApplicationsCount} Active Role</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-xl p-5 space-y-3 shadow-xl">
            <h3 className="text-xs font-bold text-stone-900 uppercase">Add Target Company</h3>
            <form onSubmit={handleCreateCompany} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Company Name</label>
                <input type="text" required placeholder="e.g. Anthropic" value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Website</label>
                <input type="url" placeholder="https://..." value={website} onChange={e => setWebsite(e.target.value)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-xs text-stone-900" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Notes</label>
                <textarea rows={2} placeholder="Strategy notes..." value={notes} onChange={e => setNotes(e.target.value)} className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-xs text-stone-900" />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3.5 py-1.5 bg-stone-100 text-xs font-bold rounded-lg text-stone-700">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-red-600 text-xs font-bold rounded-lg text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
