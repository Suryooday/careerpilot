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
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Total Tracked</span>
          <p className="text-2xl font-extrabold text-stone-900 font-outfit">{totalApps}</p>
          <p className="text-[11px] text-stone-600"><span className="text-red-600 font-bold">{activePipeline} active</span> in pipeline</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Interview Stage</span>
          <p className="text-2xl font-extrabold text-red-600 font-outfit">{interviewCount}</p>
          <p className="text-[11px] text-stone-500">Active applications</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Response Rate</span>
          <p className="text-2xl font-extrabold text-stone-900 font-outfit">{responseRate}%</p>
          <p className="text-[11px] text-stone-500">{responseCount} replies</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Avg ATS Match</span>
          <p className="text-2xl font-extrabold text-stone-900 font-outfit">{avgAtsScore}%</p>
          <p className="text-[11px] text-stone-500">Keyword fit score</p>
        </div>

        <div className="p-4 rounded-xl bg-red-50 border border-red-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Accepted</span>
          <p className="text-2xl font-extrabold text-red-700 font-outfit">{offerCount}</p>
          <p className="text-[11px] text-red-800/80 font-medium">Offers Accepted</p>
        </div>
      </div>

      {/* Streamlined 7 Stage Distribution */}
      <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">7-Stage Pipeline Distribution</h3>
            <p className="text-[11px] text-stone-500">Companies → Mail Drafted → Mail Sent → Response Recieved (AI SCORE) → Interview → Accepted → Closed Selection</p>
          </div>
          <button onClick={() => setActiveTab('applications')} className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1">
            <span>View Board</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {pipelineStages.map(stage => {
            const count = applications.filter(a => a.stage === stage).length;
            const isHigh = count > 0;
            return (
              <div
                key={stage}
                onClick={() => setActiveTab('applications')}
                className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                  isHigh ? 'bg-red-50/50 border-red-200 text-stone-900 font-bold' : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}
              >
                <p className="text-[10px] font-bold truncate">
                  {stage === 'Response Recieved' ? 'Response Recieved (AI Score)' : stage}
                </p>
                <p className={`text-lg font-extrabold font-outfit mt-0.5 ${isHigh ? 'text-red-600' : 'text-stone-400'}`}>{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Recent Applications</h3>
              <button onClick={() => setActiveTab('applications')} className="text-xs font-bold text-red-600 hover:underline">
                View All ({applications.length})
              </button>
            </div>

            <div className="space-y-2">
              {applications.slice(0, 4).map(app => (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className="p-3 rounded-lg bg-stone-50 border border-stone-200 hover:border-red-500 cursor-pointer transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={app.companyLogo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                      alt={app.companyName}
                      className="w-8 h-8 rounded object-cover border border-stone-200"
                    />
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
          </div>
        </div>

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
              <p className="text-xs text-stone-500 py-2 text-center">No pending tasks.</p>
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
