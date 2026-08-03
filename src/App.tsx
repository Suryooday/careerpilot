import React, { useState } from 'react';
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
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  if (viewMode === 'landing') {
    return (
      <>
        <LandingPage onLaunchDashboard={() => setViewMode('app')} />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-[#fdfbf7] text-stone-900 font-sans antialiased overflow-hidden">
      <Sidebar onGoToHome={() => setViewMode('landing')} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar onOpenAuth={() => setIsAuthOpen(true)} />
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
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
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
