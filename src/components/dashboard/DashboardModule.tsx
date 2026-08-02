import React from 'react';
import {
  Briefcase, CheckCircle2, ChevronRight, Plus
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { PipelineStage } from '../../types/crm';

export const DashboardModule: React.FC = () => {
  const { applications, tasks, setActiveTab, setIsAddAppModalOpen, setSelectedAppId, setIsCopilotDrawerOpen } = useCRM();

  const totalApps = applications.length;
  const activePipeline = applications.filter(a => a.stage !== 'Closed Selection').length;
  const interviewCount = applications.filter(a => a.stage === 'Interview').length;
  const offerCount = applications.filter(a => a.stage === 'Accepted').length;

  const responseCount = applications.filter(a => ['Response Recieved', 'Interview', 'Accepted', 'Closed Selection'].includes(a.stage)).length;
  const responseRate = totalApps > 0 ? Math.round((responseCount / totalApps) * 100) : 0;
  const avgAtsScore = totalApps > 0 ? Math.round(applications.reduce((acc, a) => acc + a.atsScore, 0) / totalApps) : 0;

  const pipelineStages: PipelineStage[] = [
    'Companies', 'Mail Drafted', 'Mail Sent', 'Response Recieved', 'Interview', 'Accepted', 'Closed Selection'
  ];

  const pendingTasks = tasks.filter(t => !t.completed).slice(0, 4);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-600 px-2 py-0.5 rounded bg-red-50 border border-red-100">
            Pipeline Executive Overview
          </span>
          <h1 className="text-xl md:text-2xl font-extrabold text-stone-900 font-outfit mt-2 tracking-tight">
            Job Application CRM
          </h1>
          <p className="text-stone-600 text-xs mt-1">
            Tracking <strong className="text-stone-900">{totalApps} applications</strong> across <strong className="text-stone-900">{activePipeline} active pipeline stages</strong> with <strong className="text-red-600">{offerCount} accepted role(s)</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddAppModalOpen(true)}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Application</span>
          </button>
          <button
            onClick={() => setIsCopilotDrawerOpen(true)}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-800 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all"
          >
            <span>AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase">Total Applications</span>
          <p className="text-xl font-extrabold text-stone-900 font-outfit">{totalApps}</p>
          <p className="text-[10px] text-stone-500">Tracked in CRM</p>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase">Active Pipeline</span>
          <p className="text-xl font-extrabold text-stone-900 font-outfit">{activePipeline}</p>
          <p className="text-[10px] text-emerald-600 font-bold">In progress</p>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase">Interviews</span>
          <p className="text-xl font-extrabold text-red-600 font-outfit">{interviewCount}</p>
          <p className="text-[10px] text-stone-500">Active rounds</p>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase">Response Rate</span>
          <p className="text-xl font-extrabold text-stone-900 font-outfit">{responseRate}%</p>
          <p className="text-[10px] text-stone-500">Recruiter response</p>
        </div>

        <div className="p-4 bg-white border border-stone-200 rounded-xl shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase">Average ATS Score</span>
          <p className="text-xl font-extrabold text-stone-900 font-outfit">{avgAtsScore}%</p>
          <p className="text-[10px] text-stone-500">Resume match rate</p>
        </div>
      </div>

      {/* Main Pipeline Distribution & Recent Apps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Pipeline Kanban Stage Counts */}
          <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Application Pipeline Breakdown</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {pipelineStages.map(stg => {
                const count = applications.filter(a => a.stage === stg).length;
                return (
                  <div key={stg} className="p-3 bg-stone-50 border border-stone-200 rounded-lg space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 uppercase">{stg}</span>
                    <p className="text-lg font-bold text-stone-900 font-outfit">{count}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Applications Table */}
          <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Recent Applications</h3>
              <button
                onClick={() => setActiveTab('applications')}
                className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-1"
              >
                <span>View All Kanban</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {applications.length === 0 ? (
              <div className="p-8 text-center bg-stone-50/70 rounded-xl border border-stone-200 space-y-3">
                <Briefcase className="w-8 h-8 text-stone-400 mx-auto" />
                <p className="text-xs text-stone-700 font-bold">No applications in your workspace yet.</p>
                <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                  Add your target job applications manually or drag-and-drop a CSV file in Applications to start tracking!
                </p>
                <button
                  onClick={() => setIsAddAppModalOpen(true)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs inline-flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Your First Application</span>
                </button>
              </div>
            ) : (
              <div className="divide-y divide-stone-200">
                {applications.slice(0, 5).map(app => (
                  <div
                    key={app.id}
                    onClick={() => {
                      setSelectedAppId(app.id);
                      setActiveTab('applications');
                    }}
                    className="py-3 flex items-center justify-between hover:bg-stone-50 px-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center text-xs font-bold text-stone-700">
                        {app.companyName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-stone-900 hover:text-red-600 transition-colors">{app.roleTitle}</h4>
                        <p className="text-[11px] text-stone-500">{app.companyName} • {app.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-red-50 border border-red-200 text-red-700">
                        {app.stage}
                      </span>
                      <div className="text-right">
                        <p className="text-[11px] font-extrabold text-stone-900">{app.atsScore}% ATS</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending Tasks Panel */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                <span>Pending Tasks</span>
              </h3>
              <button onClick={() => setActiveTab('tasks')} className="text-[11px] font-bold text-red-600 hover:underline">
                View All
              </button>
            </div>

            {pendingTasks.length === 0 ? (
              <p className="text-xs text-stone-500 py-4 text-center">No pending tasks.</p>
            ) : (
              <div className="space-y-2">
                {pendingTasks.map(t => (
                  <div key={t.id} className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg space-y-0.5">
                    <span className="text-xs font-bold text-stone-900">{t.title}</span>
                    <p className="text-[10px] text-stone-500">Due: {t.dueDate}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
