import React from 'react';
import { BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, AreaChart, Area
} from 'recharts';
import { useCRM } from '../../context/CRMContext';
import { PipelineStage } from '../../types/crm';

export const AnalyticsModule: React.FC = () => {
  const { applications } = useCRM();

  const weeklyData = [
    { week: 'W1', applications: 3, interviews: 1 },
    { week: 'W2', applications: 5, interviews: 2 },
    { week: 'W3', applications: 4, interviews: 2 },
    { week: 'W4', applications: 6, interviews: 3 },
    { week: 'W5', applications: 2, interviews: 2 },
  ];

  const stages: PipelineStage[] = [
    'Companies', 'Mail Drafted', 'Mail Sent', 'Response Recieved', 'Interview', 'Accepted', 'Closed Selection'
  ];

  const stageCounts = stages.map((stage, idx) => ({
    stage,
    count: applications.filter(a => a.stage === stage).length,
    color: ['#78716c', '#d97706', '#ea580c', '#0284c7', '#dc2626', '#16a34a', '#57534e'][idx]
  }));

  const avgAts = Math.round(applications.reduce((acc, a) => acc + a.atsScore, 0) / (applications.length || 1));
  const offerCount = applications.filter(a => a.stage === 'Accepted').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-stone-200 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-50 text-red-600">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Analytics & Conversion</h2>
            <p className="text-[11px] text-stone-500">7-stage pipeline conversion and ATS analytics</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-stone-500 uppercase">Velocity</p>
          <p className="text-2xl font-extrabold text-stone-900 font-outfit">4.0 / wk</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-stone-500 uppercase">Interview Rate</p>
          <p className="text-2xl font-extrabold text-red-600 font-outfit">40.0%</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-stone-200 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-stone-500 uppercase">Avg ATS Score</p>
          <p className="text-2xl font-extrabold text-stone-900 font-outfit">{avgAts}%</p>
        </div>
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 shadow-sm space-y-1">
          <p className="text-[10px] font-bold text-red-700 uppercase">Accepted</p>
          <p className="text-2xl font-extrabold text-red-700 font-outfit">{offerCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-stone-900 uppercase">Weekly Applications & Interviews</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <XAxis dataKey="week" stroke="#a8a29e" fontSize={10} />
                <YAxis stroke="#a8a29e" fontSize={10} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '8px', fontSize: '11px' }} />
                <Area type="monotone" dataKey="applications" stroke="#dc2626" fill="#fef2f2" name="Applied" />
                <Area type="monotone" dataKey="interviews" stroke="#18181b" fill="#e7e5e4" name="Interviews" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-stone-900 uppercase">7-Stage Pipeline Conversion</h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageCounts} layout="vertical">
                <XAxis type="number" stroke="#a8a29e" fontSize={10} />
                <YAxis dataKey="stage" type="category" stroke="#a8a29e" fontSize={10} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #e7e5e4', borderRadius: '8px', fontSize: '11px' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {stageCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
