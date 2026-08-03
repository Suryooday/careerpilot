export type PipelineStage =
  | 'Companies'
  | 'Mail Drafted'
  | 'Mail Sent'
  | 'Response Recieved'
  | 'Interview'
  | 'Accepted'
  | 'Closed Selection';

export type Priority = 'High' | 'Medium' | 'Low';
export type WorkType = 'Remote' | 'Hybrid' | 'On-site';
export type JobType = 'Full-time' | 'Contract' | 'Internship' | 'Part-time';

export interface MasterProfile {
  skills: string[];
  projects: { id: string; title: string; description: string; techStack: string }[];
  internships: { id: string; company: string; role: string; period: string; highlights: string }[];
  certifications: string[];
  education: string;
  summary?: string;
}

export interface Application {
  id: string;
  companyName: string;
  companyLogo?: string;
  companyId?: string;
  roleTitle: string;
  location: string;
  salaryRange?: string;
  workType: WorkType;
  jobType: JobType;
  stage: PipelineStage;
  isRejected?: boolean;
  priority: Priority;
  appliedDate: string;
  lastActivityDate: string;
  jobDescription: string;
  url?: string;
  atsScore: number; // 0 - 100
  missingKeywords: string[];
  matchedKeywords: string[];
  resumeVersionId?: string;
  coverLetterId?: string;
  recruiterName?: string;
  recruiterEmail?: string;
  recruiterPhone?: string;
  notes: Note[];
  timeline: TimelineEvent[];
  tags: string[];
}

export interface Note {
  id: string;
  createdAt: string;
  content: string;
  author: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'stage_change' | 'email' | 'interview' | 'task' | 'note';
}

export interface Company {
  id: string;
  name: string;
  logo: string;
  website: string;
  industry: string;
  tier: 'FAANG/Big Tech' | 'Unicorn' | 'Growth Startup' | 'Early Stage' | 'Enterprise';
  size: string;
  location: string;
  techStack: string[];
  rating: number; // 1-5
  savedNotes: string;
  openApplicationsCount: number;
}

export interface EmailAttachment {
  id: string;
  name: string;
  type: 'Resume' | 'Cover Letter' | 'Document';
  size?: string;
}

export interface EmailMessage {
  id: string;
  applicationId?: string;
  companyName: string;
  recruiterName: string;
  recruiterEmail: string;
  subject: string;
  snippet: string;
  body: string;
  date: string;
  isRead: boolean;
  type: 'inbox' | 'sent' | 'draft';
  classification?: 'Interview Invite' | 'Assessment Test' | 'Rejection' | 'Update' | 'General Outreach';
  aiSuggestedAction?: string;
  attachments?: EmailAttachment[];
}

export interface ResumeVersion {
  id: string;
  title: string;
  updatedAt: string;
  fileSize: string;
  targetRole: string;
  skills: string[];
  contentSummary: string;
  isPrimary: boolean;
}

export interface CoverLetter {
  id: string;
  title: string;
  targetCompany: string;
  targetRole: string;
  tone: 'Professional' | 'Energetic' | 'Concise' | 'Creative';
  content: string;
  updatedAt: string;
}

export interface UserDocument {
  id: string;
  name: string;
  category: 'Portfolio' | 'Transcript' | 'Certification' | 'Reference Letter' | 'Code Sample' | 'Other';
  fileType: string;
  fileSize: string;
  uploadDate: string;
  url?: string;
  notes?: string;
}

export interface CRMTask {
  id: string;
  applicationId?: string;
  companyName?: string;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  category: 'Follow-up' | 'Preparation' | 'Assessment' | 'Networking' | 'Other';
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  actionButtons?: { label: string; action: string }[];
}

export interface UserProfile {
  name: string;
  email: string;
  targetTitle: string;
  targetLocation: string;
  desiredSalaryMin: number;
  desiredSalaryMax: number;
  gmailApiKey?: string;
  gmailClientId?: string;
  gmailClientSecret?: string;
  openAiApiKey?: string;
  claudeApiKey?: string;
  groqApiKey?: string;
  geminiApiKey?: string;
  emailSyncEnabled: boolean;
  isOnboarded?: boolean;
}
