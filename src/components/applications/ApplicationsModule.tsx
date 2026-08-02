import React, { useState } from 'react';
import {
  Kanban, Table, Plus, Search, Upload, Database, X, Trash2
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PipelineStage } from '../../types/crm';
import { ApplicationDetailModal } from './ApplicationDetailModal';
import { AddApplicationModal } from './AddApplicationModal';

const STREAMLINED_STAGES: PipelineStage[] = [
  'Companies',
  'Mail Drafted',
  'Mail Sent',
  'Response Recieved',
  'Interview',
  'Accepted',
  'Closed Selection'
];

export const ApplicationsModule: React.FC = () => {
  const {
    applications, updateApplicationStage, deleteApplication,
    selectedAppId, setSelectedAppId, isAddAppModalOpen, setIsAddAppModalOpen,
    importCSVApplications, resetToDefaultSeed
  } = useCRM();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('All');
  
  // Modals state
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isSeedModalOpen, setIsSeedModalOpen] = useState(false);
  const [csvInput, setCsvInput] = useState('');

  // Drag and Drop state
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = selectedStageFilter === 'All' || app.stage === selectedStageFilter;
    return matchesSearch && matchesStage;
  });

  const handleCsvImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvInput.trim()) return;
    importCSVApplications(csvInput);
    setCsvInput('');
    setIsCsvModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        importCSVApplications(text);
        setIsCsvModalOpen(false);
      }
    };
    reader.readAsText(file);
  };

  const sampleCsvFormat = `Company, Role, Location, Salary, WorkType, Stage, Priority, Description, RecruiterName, RecruiterEmail
Stripe, Senior Full Stack, San Francisco CA, $180k-$220k, Hybrid, Interview, High, Building billing APIs, Sarah Jenkins, sjenkins@stripe.com
OpenAI, Product Engineer, San Francisco CA, $200k-$260k, On-site, Mail Drafted, High, LLM streaming apps, David Chen, dchen@openai.com`;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Action Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-stone-200 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search company, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-50 text-xs text-stone-800 placeholder-stone-400 pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 focus:border-red-600 focus:outline-none"
            />
          </div>

          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className="bg-stone-50 text-xs font-semibold text-stone-700 border border-stone-200 px-3 py-1.5 rounded-lg focus:outline-none"
          >
            <option value="All">All 7 Stages</option>
            {STREAMLINED_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end flex-wrap">
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 text-xs font-bold rounded-lg flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => setIsSeedModalOpen(true)}
            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold rounded-lg flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Seed Data</span>
          </button>

          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1 px-2.5 rounded text-xs font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-red-600 shadow-sm' : 'text-stone-600'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1 px-2.5 rounded text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-red-600 shadow-sm' : 'text-stone-600'
              }`}
            >
              Table
            </button>
          </div>

          <button
            onClick={() => setIsAddAppModalOpen(true)}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* Streamlined 7 Column Kanban Board */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-6 min-h-[600px]">
          {STREAMLINED_STAGES.map(stage => {
            const stageApps = filteredApps.filter(a => a.stage === stage);
            return (
              <div
                key={stage}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const appId = e.dataTransfer.getData('text/plain') || draggedAppId;
                  if (appId) {
                    updateApplicationStage(appId, stage);
                    setDraggedAppId(null);
                  }
                }}
                className={`w-72 flex-shrink-0 border rounded-xl flex flex-col max-h-[750px] transition-colors ${
                  stage === 'Accepted'
                    ? 'bg-red-50/40 border-red-200'
                    : stage === 'Closed Selection'
                    ? 'bg-stone-100/40 border-stone-200 opacity-80'
                    : 'bg-stone-100/70 border-stone-200'
                }`}
              >
                {/* Header */}
                <div className="p-3 border-b border-stone-200 flex items-center justify-between bg-white rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      stage === 'Accepted' ? 'bg-emerald-600' : stage === 'Closed Selection' ? 'bg-stone-400' : 'bg-red-600'
                    }`} />
                    <h3 className="text-xs font-extrabold text-stone-900 font-outfit uppercase tracking-wider">
                      {stage === 'Response Recieved' ? 'Response Recieved (AI SCORE)' : stage}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {stageApps.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="p-3 space-y-2.5 overflow-y-auto flex-1">
                  {stageApps.length === 0 ? (
                    <div className="p-6 border border-dashed border-stone-300 rounded-lg text-center">
                      <p className="text-[11px] text-stone-400 font-medium">Drag application here</p>
                    </div>
                  ) : (
                    stageApps.map(app => (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', app.id);
                          setDraggedAppId(app.id);
                        }}
                        onClick={() => setSelectedAppId(app.id)}
                        className="p-3.5 rounded-lg bg-white border border-stone-200 hover:border-red-500 cursor-grab active:cursor-grabbing transition-all shadow-sm space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={app.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                              alt={app.companyName}
                              className="w-7 h-7 rounded object-cover border border-stone-200"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-stone-900 group-hover:text-red-600 transition-colors leading-tight">
                                {app.roleTitle}
                              </h4>
                              <p className="text-[11px] text-stone-500">{app.companyName}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap text-[10px]">
                          <span className={`px-2 py-0.5 rounded font-bold ${
                            app.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {app.priority}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-800 font-extrabold">
                            {app.atsScore}% ATS Match
                          </span>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]" onClick={e => e.stopPropagation()}>
                          <span className="text-stone-400">{app.appliedDate}</span>
                          <select
                            value={app.stage}
                            onChange={(e) => updateApplicationStage(app.id, e.target.value as PipelineStage)}
                            className="bg-stone-50 text-[10px] text-stone-800 font-bold border border-stone-200 rounded px-1.5 py-0.5 focus:outline-none cursor-pointer"
                          >
                            {STREAMLINED_STAGES.map(s => <option key={s} value={s}>Move to {s}</option>)}
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs font-bold text-stone-500 uppercase tracking-wider">
                <th className="p-3.5">Company & Role</th>
                <th className="p-3.5">Stage</th>
                <th className="p-3.5">ATS Match</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-xs">
              {filteredApps.map(app => (
                <tr key={app.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                        alt={app.companyName}
                        className="w-7 h-7 rounded object-cover border border-stone-200"
                      />
                      <div>
                        <p onClick={() => setSelectedAppId(app.id)} className="font-bold text-stone-900 hover:text-red-600 cursor-pointer">
                          {app.roleTitle}
                        </p>
                        <p className="text-[11px] text-stone-500">{app.companyName} • {app.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={app.stage}
                      onChange={(e) => updateApplicationStage(app.id, e.target.value as PipelineStage)}
                      className="bg-stone-50 text-xs font-bold text-stone-800 border border-stone-200 px-2 py-1 rounded focus:outline-none"
                    >
                      {STREAMLINED_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="p-3.5"><span className="font-extrabold text-stone-900">{app.atsScore}%</span></td>
                  <td className="p-3.5"><span className={`px-2 py-0.5 rounded font-bold ${app.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-600'}`}>{app.priority}</span></td>
                  <td className="p-3.5 text-right">
                    <button onClick={() => setSelectedAppId(app.id)} className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold">
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CSV Import Modal */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="text-xs font-bold text-stone-900 uppercase">Import Applications CSV</h3>
              <button onClick={() => setIsCsvModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Upload File</label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="w-full mt-1 bg-stone-50 border border-stone-200 rounded-lg p-2 text-xs text-stone-900"
                />
              </div>

              <div className="text-center text-[10px] text-stone-400 font-bold uppercase">— OR PASTE CSV CONTENT —</div>

              <form onSubmit={handleCsvImport} className="space-y-3">
                <textarea
                  rows={6}
                  placeholder={sampleCsvFormat}
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs text-stone-900 font-mono focus:outline-none focus:border-red-600"
                />

                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setIsCsvModalOpen(false)} className="px-3 py-1.5 bg-stone-100 text-xs font-bold rounded-lg text-stone-700">Cancel</button>
                  <button type="submit" className="px-4 py-1.5 bg-red-600 text-xs font-bold rounded-lg text-white">Import Batch</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Seed Info Modal */}
      {isSeedModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-stone-200 rounded-xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="text-xs font-bold text-stone-900 uppercase">Seed Sample Information</h3>
              <button onClick={() => setIsSeedModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-stone-700 leading-relaxed">
              <p>Populate your CRM with realistic sample applications across 7 streamlined pipeline stages (Companies, Mail Drafted, Mail Sent, Response Recieved, Interview, Accepted, Closed Selection).</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsSeedModalOpen(false)} className="px-3.5 py-1.5 bg-stone-100 text-xs font-bold rounded-lg text-stone-700">Cancel</button>
              <button
                onClick={() => {
                  resetToDefaultSeed();
                  setIsSeedModalOpen(false);
                }}
                className="px-4 py-1.5 bg-red-600 text-xs font-bold rounded-lg text-white flex items-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Seed Dataset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAppId && <ApplicationDetailModal appId={selectedAppId} onClose={() => setSelectedAppId(null)} />}
      {isAddAppModalOpen && <AddApplicationModal onClose={() => setIsAddAppModalOpen(false)} />}
    </div>
  );
};
