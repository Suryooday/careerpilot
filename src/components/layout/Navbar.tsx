import React, { useState } from 'react';
import { Search, Bell, Sparkles, User, RefreshCw, X, Bot } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

export const Navbar: React.FC = () => {
  const {
    activeTab, profile, setIsAddAppModalOpen, setIsCopilotDrawerOpen,
    notifications, dismissNotification, resetToDefaultSeed, applications
  } = useCRM();

  const [searchQuery, setSearchQuery] = useState('');
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const activeTitle = activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace('-', ' ');

  const filteredApps = searchQuery.trim()
    ? applications.filter(a =>
        a.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <header className="h-14 bg-[#fdfbf7] border-b border-stone-200 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title / Breadcrumb */}
      <div>
        <h2 className="text-base font-bold text-stone-900 font-outfit">{activeTitle}</h2>
        <p className="text-[11px] text-stone-500">{profile.name} • {profile.targetTitle}</p>
      </div>

      {/* Universal Search & Actions */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applications, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-xs text-stone-800 placeholder-stone-400 pl-8 pr-3 py-1.5 rounded-lg border border-stone-200 focus:border-red-600 focus:outline-none shadow-sm transition-all"
          />

          {/* Search Results Dropdown */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-9 bg-white border border-stone-200 rounded-xl shadow-xl p-2 z-50 max-h-72 overflow-y-auto">
              <p className="text-[10px] font-bold text-stone-400 uppercase px-2 py-1">Applications ({filteredApps.length})</p>
              {filteredApps.length === 0 ? (
                <p className="text-xs text-stone-500 p-2">No matching applications found.</p>
              ) : (
                filteredApps.map(app => (
                  <div
                    key={app.id}
                    className="p-2 hover:bg-stone-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => setSearchQuery('')}
                  >
                    <p className="text-xs font-bold text-stone-900">{app.roleTitle}</p>
                    <p className="text-[11px] text-stone-500">{app.companyName} • <span className="text-red-600 font-semibold">{app.stage}</span></p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* AI Copilot Button */}
        <button
          onClick={() => setIsCopilotDrawerOpen(true)}
          className="p-1.5 px-3 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-all flex items-center gap-1.5 text-xs font-bold"
        >
          <Bot className="w-3.5 h-3.5 text-red-600" />
          <span>Copilot</span>
        </button>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-all relative shadow-sm"
          >
            <Bell className="w-3.5 h-3.5" />
            {notifications.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-600 absolute top-1.5 right-1.5" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-10 w-72 bg-white border border-stone-200 rounded-xl shadow-xl p-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200 mb-2">
                <h4 className="text-[11px] font-bold text-stone-900 uppercase">Notifications ({notifications.length})</h4>
                <button onClick={() => setIsNotifOpen(false)} className="text-stone-400 hover:text-stone-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {notifications.length === 0 ? (
                <p className="text-xs text-stone-500 py-3 text-center">No notifications.</p>
              ) : (
                <div className="space-y-1.5 max-h-56 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-2 bg-stone-50 border border-stone-200 rounded-lg flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-stone-900">{n.title}</p>
                        <p className="text-[11px] text-stone-600">{n.message}</p>
                      </div>
                      <button onClick={() => dismissNotification(n.id)} className="text-stone-400 hover:text-stone-700">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Reset Data Button */}
        <button
          onClick={() => {
            if (confirm('Reset CRM data back to initial seed dataset?')) resetToDefaultSeed();
          }}
          title="Reset Seed Data"
          className="p-2 rounded-lg bg-white border border-stone-200 text-stone-500 hover:text-red-600 transition-all shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* User Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {profile.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
