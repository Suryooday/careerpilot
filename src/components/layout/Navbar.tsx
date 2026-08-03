import React, { useState } from 'react';
import { Search, Bell, Sparkles, User, RefreshCw, X, Bot, LogIn, LogOut, Menu } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';

interface Props {
  onOpenAuth?: () => void;
  onSignOut?: () => void;
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<Props> = ({ onOpenAuth, onSignOut, onToggleSidebar }) => {
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
    <header className="h-14 bg-[#fdfbf7] border-b border-stone-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left Title & Mobile Hamburger Button */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-700 md:hidden transition-all shadow-xs"
          title="Open Navigation Menu"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-sm sm:text-base font-extrabold text-stone-900 font-outfit tracking-tight">CareerPilot AI</h1>
            <span className="text-[10px] text-stone-400 font-bold">•</span>
            <h2 className="text-xs font-bold text-stone-600 font-outfit truncate max-w-[120px] sm:max-w-none">{activeTitle}</h2>
          </div>
          <p className="text-[10px] sm:text-[11px] text-stone-500 truncate max-w-[180px] sm:max-w-none">
            {profile.name ? `${profile.name} • ${profile.targetTitle}` : 'Job CRM'}
          </p>
        </div>
      </div>

      {/* Universal Search & Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Bar */}
        <div className="relative w-36 sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white text-xs text-stone-800 placeholder-stone-400 pl-7 sm:pl-8 pr-2 sm:pr-3 py-1.5 rounded-lg border border-stone-200 focus:border-red-600 focus:outline-none shadow-sm transition-all"
          />

          {/* Search Results Dropdown */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute right-0 sm:left-0 top-9 w-64 bg-white border border-stone-200 rounded-xl shadow-xl p-2 z-50 max-h-72 overflow-y-auto">
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

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-stone-900 transition-all relative shadow-sm"
          >
            <Bell className="w-3.5 h-3.5" />
            {notifications.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-600 absolute top-1 right-1" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-9 w-72 bg-white border border-stone-200 rounded-xl shadow-xl p-3 z-50 space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-stone-200">
                <span className="text-xs font-bold text-stone-900 uppercase">Notifications</span>
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

        {/* User Profile Avatar & Sign Out */}
        <div className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2 border-l border-stone-200">
          <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
          </div>

          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign Out of Account"
              className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 border border-stone-300 text-stone-600 hover:text-red-600 transition-all shadow-xs flex items-center gap-1 text-[11px] font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
