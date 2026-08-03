import React, { useState, useEffect } from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardModule } from './components/dashboard/DashboardModule';
import { ApplicationsModule } from './components/applications/ApplicationsModule';
import { CompaniesModule } from './components/companies/CompaniesModule';
import { EmailModule } from './components/email/EmailModule';
import { ResumeModule } from './components/resume/ResumeModule';
import { CoverLetterModule } from './components/cover-letter/CoverLetterModule';
import { DocumentsModule } from './components/documents/DocumentsModule';
import { TasksModule } from './components/tasks/TasksModule';
import { AnalyticsModule } from './components/analytics/AnalyticsModule';
import { SettingsModule } from './components/settings/SettingsModule';
import { AICopilotDrawer } from './components/copilot/AICopilotDrawer';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { LegalModals } from './components/privacy/LegalModals';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { ShieldAlert, LogIn } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab } = useCRM();

  return (
    <main className="flex-1 overflow-y-auto pb-12">
      {activeTab === 'dashboard' && <DashboardModule />}
      {activeTab === 'applications' && <ApplicationsModule />}
      {activeTab === 'companies' && <CompaniesModule />}
      {activeTab === 'email' && <EmailModule />}
      {activeTab === 'resume' && <ResumeModule />}
      {activeTab === 'cover-letter' && <CoverLetterModule />}
      {activeTab === 'documents' && <DocumentsModule />}
      {activeTab === 'tasks' && <TasksModule />}
      {activeTab === 'analytics' && <AnalyticsModule />}
      {activeTab === 'settings' && <SettingsModule />}
    </main>
  );
};

export function AppContainer() {
  const { profile, addNotification } = useCRM();
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  
  // Track strict authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('cp_is_logged_in') === 'true';
  });

  const handleLaunchRequest = () => {
    if (isLoggedIn) {
      setViewMode('app');
    } else {
      // Require Sign In first!
      addNotification('warning', 'Sign In Required', 'Please sign in or create an account to access candidate dashboard.');
      setIsAuthOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('cp_is_logged_in', 'true');
    setViewMode('app');
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('cp_is_logged_in');
    setViewMode('landing');
    addNotification('info', 'Signed Out', 'You have been signed out successfully.');
  };

  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage
          onLaunchDashboard={handleLaunchRequest}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // STRICT AUTH GUARD: If user is not logged in, show Auth Guard Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shadow-xs">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-extrabold text-stone-900 font-outfit">Authentication Required</h2>
        <p className="text-xs text-stone-600 max-w-sm">
          You must sign in or create a Supabase account before accessing candidate application pipelines and dashboard.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setIsAuthOpen(true)}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In Now</span>
          </button>
          <button
            onClick={() => setViewMode('landing')}
            className="px-4 py-2.5 bg-white border border-stone-200 text-stone-700 font-bold text-xs rounded-xl"
          >
            Back to Home
          </button>
        </div>

        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#fdfbf7] text-stone-900 font-sans antialiased overflow-hidden">
      <Sidebar onGoToHome={() => setViewMode('landing')} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar onOpenAuth={() => setIsAuthOpen(true)} onSignOut={handleSignOut} />
        <MainContent />
        <footer className="py-2 px-6 bg-[#fdfbf7] border-t border-stone-200 text-[10px] text-stone-400 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('landing')} className="font-bold hover:text-red-600 transition-colors">
              ← Return to Landing Page
            </button>
            <span>•</span>
            <span>CareerPilot AI © 2026</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setLegalModal('privacy')} className="hover:text-stone-700 hover:underline">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => setLegalModal('terms')} className="hover:text-stone-700 hover:underline">
              Terms of Service
            </button>
          </div>
        </footer>
      </div>
      <AICopilotDrawer />
      <OnboardingModal />
      <LegalModals type={legalModal} onClose={() => setLegalModal(null)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onSuccess={handleAuthSuccess} />
    </div>
  );
}

export function App() {
  return (
    <CRMProvider>
      <AppContainer />
    </CRMProvider>
  );
}

export default App;
