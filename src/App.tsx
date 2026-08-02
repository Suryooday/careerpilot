import React from 'react';
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

export function App() {
  return (
    <CRMProvider>
      <div className="flex h-screen bg-[#fdfbf7] text-stone-900 font-sans antialiased overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <Navbar />
          <MainContent />
        </div>
        <AICopilotDrawer />
        <OnboardingModal />
      </div>
    </CRMProvider>
  );
}

export default App;
