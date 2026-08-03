import React, { useState } from 'react';
import {
  Kanban, Table, Plus, Search, Upload, Database, X, Trash2, Eye, CheckCircle2, RefreshCw
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

interface ParsedCSVRow {
  companyName: string;
  roleTitle: string;
  location: string;
  salaryRange: string;
  workType: string;
  stage: string;
  priority: string;
  recruiterName: string;
  recruiterEmail: string;
}

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
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);

  // Drag and Drop state
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStage = selectedStageFilter === 'All' || app.stage === selectedStageFilter;
    return matchesSearch && matchesStage;
  });

  // Helper to parse CSV text into row objects for preview
  const parseCSVRows = (text: string): ParsedCSVRow[] => {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return [];

    const rows: ParsedCSVRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length >= 2) {
        rows.push({
          companyName: cols[0] || 'Target Company',
          roleTitle: cols[1] || 'Software Engineer',
          location: cols[2] || 'Remote',
          salaryRange: cols[3] || '$160k - $200k',
          workType: cols[4] || 'Hybrid',
          stage: cols[5] || 'Companies',
          priority: cols[6] || 'High',
          recruiterName: cols[8] || 'Hiring Manager',
          recruiterEmail: cols[9] || 'recruiter@company.com'
        });
      }
    }
    return rows;
  };

  const previewRows = parseCSVRows(csvInput);

  const handleCsvImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvInput.trim()) return;

    setIsProcessingCsv(true);

    setTimeout(() => {
      importCSVApplications(csvInput);
      setCsvInput('');
      setIsProcessingCsv(false);
      setIsCsvModalOpen(false);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      if (content) setCsvInput(content);
    };
    reader.readAsText(file);
  };

  const handleDragStart = (e: React.DragEvent, appId: string) => {
    setDraggedAppId(appId);
    e.dataTransfer.setData('text/plain', appId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStage: PipelineStage) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('text/plain') || draggedAppId;
    if (appId) {
      updateApplicationStage(appId, targetStage);
      setDraggedAppId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white border border-stone-200 p-4 rounded-xl shadow-sm">
        <div>
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Candidate Applications Board</h2>
          <p className="text-[11px] text-stone-500">
            {applications.length} applications tracked • Drag & drop between pipeline stages
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search companies, roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-red-600"
            />
          </div>

          {/* CSV Import Button */}
          <button
            onClick={() => setIsCsvModalOpen(true)}
            className="px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-red-600" />
            <span>Import CSV</span>
          </button>

          {/* Add App Button */}
          <button
            onClick={() => setIsAddAppModalOpen(true)}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex bg-stone-100 border border-stone-200 p-0.5 rounded-lg">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'kanban' ? 'bg-white text-red-600 shadow-xs' : 'text-stone-500'
              }`}
            >
              <Kanban className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md text-xs font-bold transition-all ${
                viewMode === 'table' ? 'bg-white text-red-600 shadow-xs' : 'text-stone-500'
              }`}
            >
              <Table className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Kanban Board */}
      {viewMode === 'kanban' ? (
        <div className="flex gap-4 overflow-x-auto pb-4 items-start">
          {STREAMLINED_STAGES.map(stage => {
            const stageApps = filteredApps.filter(a => a.stage === stage);
            return (
              <div
                key={stage}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
                className="w-72 shrink-0 bg-stone-100/70 border border-stone-200 rounded-xl overflow-hidden flex flex-col"
              >
                {/* Column Header */}
                <div className="p-3 bg-white border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-600" />
                    <h3 className="text-xs font-extrabold text-stone-900 font-outfit uppercase tracking-wider">{stage}</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {stageApps.length}
                  </span>
                </div>

                {/* SCROLLABLE Application Cards Container (max-h-[70vh] overflow-y-auto) */}
                <div className="p-2 space-y-2.5 max-h-[70vh] overflow-y-auto pr-1 scrollbar-thin">
                  {stageApps.length === 0 ? (
                    <div className="p-6 text-center text-[11px] text-stone-400 border border-dashed border-stone-300 rounded-lg">
                      Drop applications here
                    </div>
                  ) : (
                    stageApps.map(app => (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        onClick={() => setSelectedAppId(app.id)}
                        className="p-3.5 rounded-lg bg-white border border-stone-200 hover:border-red-500 cursor-grab active:cursor-grabbing transition-all shadow-sm space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-xs text-stone-700">
                              {app.companyName.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-stone-900 group-hover:text-red-600 transition-colors leading-tight">
                                {app.roleTitle}
                              </h4>
                              <p className="text-[11px] text-stone-500">{app.companyName}</p>
                            </div>
                          </div>
                        </div>

                        {app.recruiterName && (
                          <p className="text-[10px] text-stone-500 truncate">
                            Contact: <strong className="text-stone-800">{app.recruiterName}</strong> ({app.recruiterEmail})
                          </p>
                        )}

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
                <th className="p-3.5">Recruiter Contact</th>
                <th className="p-3.5">Stage</th>
                <th className="p-3.5">ATS Match</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-xs">
              {filteredApps.map(app => (
                <tr key={app.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-xs text-stone-700">
                        {app.companyName.charAt(0)}
                      </div>
                      <div>
                        <p onClick={() => setSelectedAppId(app.id)} className="font-bold text-stone-900 hover:text-red-600 cursor-pointer">
                          {app.roleTitle}
                        </p>
                        <p className="text-[11px] text-stone-500">{app.companyName} • {app.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-stone-800">{app.recruiterName || 'Hiring Manager'}</p>
                    <p className="text-[10px] text-stone-500">{app.recruiterEmail || 'N/A'}</p>
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
                  <td className="p-3.5 text-right">
                    <button onClick={() => setSelectedAppId(app.id)} className="px-2.5 py-1 rounded bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold">
                      View All Info
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CSV Import Modal with 5-Row Live Preview & Progress Loading State */}
      {isCsvModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xl space-y-4 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-xs font-bold text-stone-900 uppercase">Import Candidate Applications CSV</h3>
              <button onClick={() => setIsCsvModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCsvImport} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Upload CSV File or Paste Data</label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 cursor-pointer mt-1"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-600 uppercase">Raw CSV Data</label>
                <textarea
                  rows={4}
                  placeholder={`Company, Role, Location, Salary, WorkType, Stage, Priority, Description, RecruiterName, RecruiterEmail\nStripe, Senior Full Stack Engineer, San Francisco CA, $190k, Hybrid, Companies, High, Build billing features, Sarah Jenkins, sjenkins@stripe.com`}
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-lg p-3 text-xs font-mono text-stone-800 focus:outline-none focus:border-red-600"
                />
              </div>

              {/* 5-ROW LIVE PREVIEW */}
              {previewRows.length > 0 && (
                <div className="space-y-2 border-t border-stone-200 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-stone-900 uppercase flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-red-600" />
                      <span>CSV Import Live Preview (First 5 Rows)</span>
                    </span>
                    <span className="text-[10px] text-stone-500">Total detected: <strong>{previewRows.length} applications</strong></span>
                  </div>

                  <div className="border border-stone-200 rounded-lg overflow-x-auto max-h-48">
                    <table className="w-full text-left text-[11px] border-collapse">
                      <thead>
                        <tr className="bg-stone-100 border-b border-stone-200 font-bold text-stone-700">
                          <th className="p-2">Company</th>
                          <th className="p-2">Role</th>
                          <th className="p-2">Stage</th>
                          <th className="p-2">Recruiter</th>
                          <th className="p-2">Email</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {previewRows.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="hover:bg-stone-50">
                            <td className="p-2 font-bold text-stone-900">{row.companyName}</td>
                            <td className="p-2 text-stone-800">{row.roleTitle}</td>
                            <td className="p-2"><span className="px-1.5 py-0.5 rounded bg-red-50 text-red-700 font-bold">{row.stage}</span></td>
                            <td className="p-2 text-stone-800">{row.recruiterName}</td>
                            <td className="p-2 text-stone-600">{row.recruiterEmail}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Action & Loading State */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsCsvModalOpen(false)} className="px-3.5 py-1.5 bg-stone-100 text-stone-700 font-bold text-xs rounded-lg">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingCsv || !csvInput.trim()}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  {isProcessingCsv ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Processing & Scoring ATS...</span>
                    </>
                  ) : (
                    <span>Import All ({previewRows.length}) Applications</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedAppId && (
        <ApplicationDetailModal
          appId={selectedAppId}
          onClose={() => setSelectedAppId(null)}
        />
      )}

      {/* Add App Modal */}
      {isAddAppModalOpen && (
        <AddApplicationModal onClose={() => setIsAddAppModalOpen(false)} />
      )}
    </div>
  );
};
