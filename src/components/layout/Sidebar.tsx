import React from 'react';
import {
  LayoutDashboard, Briefcase, Building2, Mail, FileText,
  PenTool, FolderArchive, CheckSquare, BarChart3, Bot, Settings, Plus
} from 'lucide-react';
import { useCRM, ActiveTab } from '../../context/CRMContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, applications, setIsAddAppModalOpen, setIsCopilotDrawerOpen, tasks } = useCRM();

  const activeAppsCount = applications.filter(a => a.stage !== 'Closed Selection').length;
  const pendingTasksCount = tasks.filter(t => !t.completed).length;

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }>; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Briefcase, badge: activeAppsCount },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'email', label: 'Email Center', icon: Mail },
    { id: 'resume', label: 'Resume & ATS', icon: FileText },
    { id: 'cover-letter', label: 'Cover Letters', icon: PenTool },
    { id: 'documents', label: 'Documents', icon: FolderArchive },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'copilot', label: 'AI Copilot', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-60 bg-[#f7f4ee] border-r border-stone-200 flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-stone-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            C
          </div>
          <div>
            <h1 className="font-extrabold text-base text-stone-900 tracking-tight font-outfit">
              Career<span className="text-red-600">Pilot</span>
            </h1>
            <p className="text-[10px] font-medium text-stone-500 uppercase tracking-wider">Job Application CRM</p>
          </div>
        </div>
      </div>

      {/* Quick Action */}
      <div className="p-3">
        <button
          onClick={() => setIsAddAppModalOpen(true)}
          className="w-full py-2 px-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'copilot') {
                  setIsCopilotDrawerOpen(true);
                } else {
                  setActiveTab(item.id);
                }
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-white text-red-700 shadow-sm border border-stone-200/80 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer AI Trigger */}
      <div className="p-3 border-t border-stone-200/80 bg-[#faf6f0]">
        <button
          onClick={() => setIsCopilotDrawerOpen(true)}
          className="w-full p-2.5 rounded-lg bg-white border border-stone-200 hover:border-red-500 flex items-center gap-2.5 text-left transition-all shadow-sm group"
        >
          <div className="w-6 h-6 rounded bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-800 group-hover:text-red-600 transition-colors">AI Assistant</p>
            <p className="text-[10px] text-stone-500">Quick actions & answers</p>
          </div>
        </button>
      </div>
    </aside>
  );
};
