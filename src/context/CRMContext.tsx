import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Application, Company, EmailMessage, EmailAttachment, ResumeVersion,
  CoverLetter, UserDocument, CRMTask, UserProfile,
  PipelineStage, MasterProfile
} from '../types/crm';
import {
  initialProfile, initialCompanies, initialApplications,
  initialEmails, initialResumes, initialCoverLetters, initialDocuments,
  initialTasks
} from '../data/initialSeed';
import { analyzeATS } from '../utils/atsScorer';
import { generateRAGEmailDraft } from '../utils/ragEmailEngine';
import { sendViaGmailAPI, syncGmailInbox } from '../services/gmailService';

export type ActiveTab =
  | 'dashboard'
  | 'applications'
  | 'companies'
  | 'email'
  | 'resume'
  | 'cover-letter'
  | 'documents'
  | 'tasks'
  | 'analytics'
  | 'copilot'
  | 'settings';

interface NotificationToast {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  message: string;
}

export const defaultMasterProfile: MasterProfile = {
  skills: [
    'React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'FastAPI',
    'PostgreSQL', 'Redis', 'Docker', 'AWS', 'REST APIs', 'GraphQL', 'TailwindCSS'
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'High-Throughput Payment Engine',
      description: 'Architected distributed payment settlement microservices handling $5M+ monthly transaction volume with Redis idempotency locks.',
      techStack: 'TypeScript, Node.js, PostgreSQL, Redis, Docker'
    },
    {
      id: 'proj-2',
      title: 'AI Canvas & Real-time LLM Streaming Interface',
      description: 'Built generative AI workspace with OpenAI function calling, vector search RAG retrieval, and WebSockets streaming.',
      techStack: 'React, Next.js, Python, FastAPI, TailwindCSS, Vector DB'
    },
    {
      id: 'proj-3',
      title: 'Cloud Observability Dashboard',
      description: 'Designed real-time metric visualization dashboard processing 100k events/sec with Canvas rendering.',
      techStack: 'React, TypeScript, WebGL, Go, Kafka'
    }
  ],
  internships: [
    {
      id: 'exp-1',
      company: 'Stripe',
      role: 'Full Stack Engineering Intern',
      period: 'Summer 2025 (3 months)',
      highlights: 'Built idempotency retry handlers, reduced API response latency by 35%, authored public API documentation.'
    },
    {
      id: 'exp-2',
      company: 'Vercel',
      role: 'Frontend Engineering Intern',
      period: 'Winter 2024 (4 months)',
      highlights: 'Engineered Next.js edge route features, optimized layout shifts for 2M daily visitors.'
    }
  ],
  certifications: [
    'AWS Certified Solutions Architect - Professional',
    'Google Cloud Certified Associate Engineer',
    'UC Berkeley Hackathon - 1st Place Winner'
  ],
  education: 'B.S. in Computer Science - UC Berkeley (GPA: 3.9/4.0)'
};

interface CRMContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Data
  profile: UserProfile;
  masterProfile: MasterProfile;
  applications: Application[];
  companies: Company[];
  emails: EmailMessage[];
  resumes: ResumeVersion[];
  coverLetters: CoverLetter[];
  documents: UserDocument[];
  tasks: CRMTask[];
  
  // Modals
  selectedAppId: string | null;
  setSelectedAppId: (id: string | null) => void;
  isAddAppModalOpen: boolean;
  setIsAddAppModalOpen: (open: boolean) => void;
  isCopilotDrawerOpen: boolean;
  setIsCopilotDrawerOpen: (open: boolean) => void;
  
  // Actions
  updateProfile: (profile: Partial<UserProfile>) => void;
  updateMasterProfile: (master: Partial<MasterProfile>) => void;
  addApplication: (app: Omit<Application, 'id' | 'appliedDate' | 'lastActivityDate' | 'notes' | 'timeline'>) => void;
  updateApplicationStage: (id: string, stage: PipelineStage) => void;
  deleteApplication: (id: string) => void;
  addNoteToApplication: (appId: string, noteText: string) => void;
  importCSVApplications: (csvText: string) => number;
  
  addCompany: (comp: Omit<Company, 'id' | 'openApplicationsCount'>) => void;
  
  sendEmail: (email: Omit<EmailMessage, 'id' | 'date' | 'isRead' | 'type'>) => Promise<void>;
  createDraftEmailFromApp: (appId: string, emailType: 'Cold Outreach' | 'Follow-up' | 'Thank You' | 'Referral Request') => Promise<string>;
  updateDraftEmail: (id: string, updates: Partial<EmailMessage>) => void;
  sendDraftEmail: (id: string) => Promise<void>;
  syncGmailResponsesNow: () => Promise<number>;
  classifyAndProcessEmail: (emailId: string) => void;
  
  addResume: (resume: Omit<ResumeVersion, 'id' | 'updatedAt'>) => void;
  updateResume: (id: string, updates: Partial<ResumeVersion>) => void;
  saveCoverLetter: (cl: Omit<CoverLetter, 'id' | 'updatedAt'>) => void;
  addDocument: (doc: Omit<UserDocument, 'id' | 'uploadDate'>) => void;
  
  addTask: (task: Omit<CRMTask, 'id' | 'completed'>) => void;
  toggleTaskCompleted: (id: string) => void;
  
  // Notifications
  notifications: NotificationToast[];
  addNotification: (type: 'success' | 'info' | 'warning', title: string, message: string) => void;
  dismissNotification: (id: string) => void;
  
  // Reset
  resetToDefaultSeed: () => void;
}

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState<boolean>(false);
  const [isCopilotDrawerOpen, setIsCopilotDrawerOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cp_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [masterProfile, setMasterProfile] = useState<MasterProfile>(() => {
    const saved = localStorage.getItem('cp_master_profile');
    return saved ? JSON.parse(saved) : defaultMasterProfile;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('cp_applications');
    return saved ? JSON.parse(saved) : initialApplications;
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem('cp_companies');
    return saved ? JSON.parse(saved) : initialCompanies;
  });

  const [emails, setEmails] = useState<EmailMessage[]>(() => {
    const saved = localStorage.getItem('cp_emails');
    return saved ? JSON.parse(saved) : initialEmails;
  });

  const [resumes, setResumes] = useState<ResumeVersion[]>(() => {
    const saved = localStorage.getItem('cp_resumes');
    return saved ? JSON.parse(saved) : initialResumes;
  });

  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>(() => {
    const saved = localStorage.getItem('cp_coverletters');
    return saved ? JSON.parse(saved) : initialCoverLetters;
  });

  const [documents, setDocuments] = useState<UserDocument[]>(() => {
    const saved = localStorage.getItem('cp_documents');
    return saved ? JSON.parse(saved) : initialDocuments;
  });

  const [tasks, setTasks] = useState<CRMTask[]>(() => {
    const saved = localStorage.getItem('cp_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  useEffect(() => { localStorage.setItem('cp_profile', JSON.stringify(profile)); }, [profile]);
  useEffect(() => { localStorage.setItem('cp_master_profile', JSON.stringify(masterProfile)); }, [masterProfile]);
  useEffect(() => { localStorage.setItem('cp_applications', JSON.stringify(applications)); }, [applications]);
  useEffect(() => { localStorage.setItem('cp_companies', JSON.stringify(companies)); }, [companies]);
  useEffect(() => { localStorage.setItem('cp_emails', JSON.stringify(emails)); }, [emails]);
  useEffect(() => { localStorage.setItem('cp_resumes', JSON.stringify(resumes)); }, [resumes]);
  useEffect(() => { localStorage.setItem('cp_coverletters', JSON.stringify(coverLetters)); }, [coverLetters]);
  useEffect(() => { localStorage.setItem('cp_documents', JSON.stringify(documents)); }, [documents]);
  useEffect(() => { localStorage.setItem('cp_tasks', JSON.stringify(tasks)); }, [tasks]);

  const addNotification = (type: 'success' | 'info' | 'warning', title: string, message: string) => {
    const id = 'notif-' + Date.now();
    setNotifications(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissNotification(id);
    }, 5000);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const fireCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    addNotification('success', 'Settings Saved', 'Profile updated.');
  };

  const updateMasterProfile = (updates: Partial<MasterProfile>) => {
    setMasterProfile(prev => ({ ...prev, ...updates }));
    addNotification('success', 'Master Profile Saved', 'Master skills, projects, and experience saved.');
  };

  const addApplication = (appData: Omit<Application, 'id' | 'appliedDate' | 'lastActivityDate' | 'notes' | 'timeline'>) => {
    const newId = 'app-' + Date.now();
    const today = new Date().toISOString().split('T')[0];
    const newApp: Application = {
      ...appData,
      id: newId,
      appliedDate: today,
      lastActivityDate: today,
      notes: [],
      timeline: [
        {
          id: 't-' + Date.now(),
          date: today,
          title: 'Application Created',
          description: `Created for ${appData.roleTitle} at ${appData.companyName}`,
          type: 'stage_change'
        }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    addNotification('success', 'Application Added', `${appData.roleTitle} at ${appData.companyName} added.`);
  };

  const updateApplicationStage = (id: string, newStage: PipelineStage) => {
    const today = new Date().toISOString().split('T')[0];
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        if (newStage === 'Accepted' && app.stage !== 'Accepted') {
          fireCelebration();
        }
        return {
          ...app,
          stage: newStage,
          lastActivityDate: today,
          timeline: [
            {
              id: 't-' + Date.now(),
              date: today,
              title: `Moved to ${newStage}`,
              description: `Status changed to ${newStage}`,
              type: 'stage_change'
            },
            ...app.timeline
          ]
        };
      }
      return app;
    }));

    addNotification('info', 'Stage Updated', `Moved to ${newStage}`);
  };

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(app => app.id !== id));
    if (selectedAppId === id) setSelectedAppId(null);
    addNotification('warning', 'Application Removed', 'Application deleted.');
  };

  const addNoteToApplication = (appId: string, noteText: string) => {
    const today = new Date().toISOString().split('T')[0];
    setApplications(prev => prev.map(app => {
      if (app.id === appId) {
        return {
          ...app,
          notes: [
            {
              id: 'n-' + Date.now(),
              createdAt: today,
              content: noteText,
              author: profile.name.split(' ')[0] || 'User'
            },
            ...app.notes
          ]
        };
      }
      return app;
    }));
  };

  const importCSVApplications = (csvText: string): number => {
    const lines = csvText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) return 0;

    let importedCount = 0;
    const today = new Date().toISOString().split('T')[0];
    const newApps: Application[] = [];

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
      if (cols.length >= 2) {
        const companyName = cols[0] || 'Target Company';
        const roleTitle = cols[1] || 'Software Engineer';
        const location = cols[2] || 'Remote';
        const salaryRange = cols[3] || '$160,000 - $200,000';
        const workType = (cols[4] as any) || 'Hybrid';
        const stage = (cols[5] as PipelineStage) || 'Companies';
        const priority = (cols[6] as any) || 'High';
        const jobDescription = cols[7] || `${roleTitle} role at ${companyName}`;
        const recruiterName = cols[8] || 'Hiring Manager';
        const recruiterEmail = cols[9] || 'recruiter@company.com';

        const primaryResume = resumes.find(r => r.isPrimary) || resumes[0];
        const atsResult = analyzeATS(jobDescription, primaryResume?.contentSummary || '', primaryResume?.skills || []);

        newApps.push({
          id: 'app-csv-' + Date.now() + '-' + i,
          companyName,
          roleTitle,
          location,
          salaryRange,
          workType,
          jobType: 'Full-time',
          stage,
          priority,
          appliedDate: today,
          lastActivityDate: today,
          jobDescription,
          atsScore: atsResult.score,
          matchedKeywords: atsResult.matchedKeywords,
          missingKeywords: atsResult.missingKeywords,
          recruiterName,
          recruiterEmail,
          notes: [],
          timeline: [
            { id: 't-csv-' + i, date: today, title: 'Imported via CSV', description: 'Batch import', type: 'stage_change' }
          ],
          tags: ['CSV Import']
        });
        importedCount++;
      }
    }

    if (newApps.length > 0) {
      setApplications(prev => [...newApps, ...prev]);
      addNotification('success', 'CSV Import Complete', `Imported ${importedCount} applications.`);
    }

    return importedCount;
  };

  const addCompany = (compData: Omit<Company, 'id' | 'openApplicationsCount'>) => {
    const newComp: Company = {
      ...compData,
      id: 'comp-' + Date.now(),
      openApplicationsCount: 0
    };
    setCompanies(prev => [newComp, ...prev]);
    addNotification('success', 'Company Saved', `${compData.name} saved.`);
  };

  const sendEmail = async (emailData: Omit<EmailMessage, 'id' | 'date' | 'isRead' | 'type'>) => {
    const res = await sendViaGmailAPI(
      profile.gmailApiKey || '',
      emailData.recruiterEmail,
      emailData.subject,
      emailData.body
    );

    if (res.success) {
      addNotification('success', 'Gmail Sent!', `Message sent to ${emailData.recruiterEmail} via Gmail API.`);
    } else {
      addNotification('warning', 'Gmail API Error', res.error || 'Check Settings -> Gmail OAuth Token.');
    }

    const newEmail: EmailMessage = {
      ...emailData,
      id: 'em-' + Date.now(),
      date: new Date().toISOString(),
      isRead: true,
      type: 'sent'
    };
    setEmails(prev => [newEmail, ...prev]);

    if (emailData.applicationId) {
      updateApplicationStage(emailData.applicationId, 'Mail Sent');
    }
  };

  const createDraftEmailFromApp = async (appId: string, emailType: 'Cold Outreach' | 'Follow-up' | 'Thank You' | 'Referral Request'): Promise<string> => {
    const app = applications.find(a => a.id === appId);
    if (!app) return '';

    const ragDraft = await generateRAGEmailDraft(
      app,
      masterProfile,
      emailType,
      profile.name,
      profile.geminiApiKey || import.meta.env.VITE_GEMINI_API_KEY || ''
    );

    const draftId = 'em-draft-' + Date.now();
    const newDraft: EmailMessage = {
      id: draftId,
      applicationId: app.id,
      companyName: app.companyName,
      recruiterName: app.recruiterName || 'Hiring Manager',
      recruiterEmail: app.recruiterEmail || 'recruiter@company.com',
      subject: ragDraft.subject,
      snippet: ragDraft.body.slice(0, 100) + '...',
      body: ragDraft.body,
      date: new Date().toISOString(),
      isRead: true,
      type: 'draft',
      attachments: []
    };

    setEmails(prev => [newDraft, ...prev]);
    updateApplicationStage(app.id, 'Mail Drafted');

    addNotification('success', 'RAG Draft Created', `Retrieved JD, Master Resume & Notes -> Generated Humanized Email Draft!`);
    return draftId;
  };

  const updateDraftEmail = (id: string, updates: Partial<EmailMessage>) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, ...updates, snippet: (updates.body || e.body).slice(0, 100) + '...' } : e));
    addNotification('info', 'Draft Saved', 'Draft updated.');
  };

  const sendDraftEmail = async (id: string) => {
    const draft = emails.find(e => e.id === id);
    if (draft) {
      const res = await sendViaGmailAPI(
        profile.gmailApiKey || '',
        draft.recruiterEmail,
        draft.subject,
        draft.body
      );

      if (res.success) {
        addNotification('success', 'Sent Live to Gmail!', `Message sent to ${draft.recruiterEmail} via Gmail API.`);
      } else {
        addNotification('warning', 'Gmail API Error', res.error || 'Token expired or scope missing.');
      }
    }

    setEmails(prev => prev.map(e => e.id === id ? { ...e, type: 'sent', date: new Date().toISOString() } : e));

    if (draft?.applicationId) {
      updateApplicationStage(draft.applicationId, 'Mail Sent');
    }
  };

  const syncGmailResponsesNow = async (): Promise<number> => {
    const syncRes = await syncGmailInbox(profile.gmailApiKey || '', applications);
    syncRes.stageUpdates.forEach(update => {
      updateApplicationStage(update.appId, update.newStage as PipelineStage);
    });

    addNotification('success', 'Gmail API Auto-Sync Complete', `Scanned inbox & updated ${syncRes.stageUpdates.length} application stage(s)!`);
    return syncRes.stageUpdates.length;
  };

  const classifyAndProcessEmail = (emailId: string) => {
    const targetEmail = emails.find(e => e.id === emailId);
    if (!targetEmail || !targetEmail.applicationId) return;

    if (targetEmail.classification === 'Interview Invite') {
      updateApplicationStage(targetEmail.applicationId, 'Interview');
      addNotification('success', 'Gmail Auto-Sync', `Application stage moved to Interview!`);
    } else if (targetEmail.classification === 'Assessment Test' || targetEmail.classification === 'Update') {
      updateApplicationStage(targetEmail.applicationId, 'Response Recieved');
      addNotification('info', 'Gmail Auto-Sync', `Application stage moved to Response Recieved!`);
    } else if (targetEmail.classification === 'Rejection') {
      updateApplicationStage(targetEmail.applicationId, 'Closed Selection');
      addNotification('warning', 'Gmail Auto-Sync', `Application moved to Closed Selection.`);
    }
  };

  const addResume = (resumeData: Omit<ResumeVersion, 'id' | 'updatedAt'>) => {
    const newRes: ResumeVersion = {
      ...resumeData,
      id: 'res-' + Date.now(),
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setResumes(prev => [newRes, ...prev]);
    addNotification('success', 'Resume Saved', `Version "${resumeData.title}" saved.`);
  };

  const updateResume = (id: string, updates: Partial<ResumeVersion>) => {
    setResumes(prev => prev.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString().split('T')[0] } : r));
    addNotification('info', 'Resume Saved', 'Changes saved.');
  };

  const saveCoverLetter = (clData: Omit<CoverLetter, 'id' | 'updatedAt'>) => {
    const newCL: CoverLetter = {
      ...clData,
      id: 'cl-' + Date.now(),
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setCoverLetters(prev => [newCL, ...prev]);
    addNotification('success', 'Cover Letter Saved', `Saved for ${clData.targetCompany}`);
  };

  const addDocument = (docData: Omit<UserDocument, 'id' | 'uploadDate'>) => {
    const newDoc: UserDocument = {
      ...docData,
      id: 'doc-' + Date.now(),
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setDocuments(prev => [newDoc, ...prev]);
    addNotification('success', 'Document Saved', `${docData.name} saved.`);
  };

  const addTask = (taskData: Omit<CRMTask, 'id' | 'completed'>) => {
    const newTask: CRMTask = {
      ...taskData,
      id: 'task-' + Date.now(),
      completed: false
    };
    setTasks(prev => [newTask, ...prev]);
    addNotification('success', 'Task Created', `"${taskData.title}" created.`);
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const resetToDefaultSeed = () => {
    localStorage.clear();
    setProfile(initialProfile);
    setMasterProfile(defaultMasterProfile);
    setApplications(initialApplications);
    setCompanies(initialCompanies);
    setEmails(initialEmails);
    setResumes(initialResumes);
    setCoverLetters(initialCoverLetters);
    setDocuments(initialDocuments);
    setTasks(initialTasks);
    addNotification('info', 'Seed Reset', 'CRM restored to initial seed dataset.');
  };

  return (
    <CRMContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profile,
        masterProfile,
        applications,
        companies,
        emails,
        resumes,
        coverLetters,
        documents,
        tasks,
        selectedAppId,
        setSelectedAppId,
        isAddAppModalOpen,
        setIsAddAppModalOpen,
        isCopilotDrawerOpen,
        setIsCopilotDrawerOpen,
        updateProfile,
        updateMasterProfile,
        addApplication,
        updateApplicationStage,
        deleteApplication,
        addNoteToApplication,
        importCSVApplications,
        addCompany,
        sendEmail,
        createDraftEmailFromApp,
        updateDraftEmail,
        sendDraftEmail,
        syncGmailResponsesNow,
        classifyAndProcessEmail,
        addResume,
        updateResume,
        saveCoverLetter,
        addDocument,
        addTask,
        toggleTaskCompleted,
        notifications,
        addNotification,
        dismissNotification,
        resetToDefaultSeed
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within CRMProvider');
  return context;
};
