import { Application, Company, EmailMessage, ResumeVersion, CoverLetter, UserDocument, CRMTask, UserProfile } from '../types/crm';

export const initialProfile: UserProfile = {
  name: '',
  email: '',
  targetTitle: '',
  targetLocation: '',
  desiredSalaryMin: 120000,
  desiredSalaryMax: 180000,
  gmailApiKey: import.meta.env.VITE_GMAIL_API_KEY || '',
  gmailClientId: import.meta.env.VITE_GMAIL_CLIENT_ID || '219885217250-k2s6hq6dgurqppjlk6vp2lp6p0j3adf0.apps.googleusercontent.com',
  gmailClientSecret: import.meta.env.VITE_GMAIL_CLIENT_SECRET || '',
  groqApiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  emailSyncEnabled: true,
  isOnboarded: false
};

export const initialCompanies: Company[] = [];
export const initialApplications: Application[] = [];
export const initialEmails: EmailMessage[] = [];
export const initialResumes: ResumeVersion[] = [];
export const initialCoverLetters: CoverLetter[] = [];
export const initialDocuments: UserDocument[] = [];
export const initialTasks: CRMTask[] = [];
