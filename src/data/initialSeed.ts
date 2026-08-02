import { Application, Company, EmailMessage, ResumeVersion, CoverLetter, UserDocument, CRMTask, UserProfile } from '../types/crm';

export const initialProfile: UserProfile = {
  name: 'Alex Rivera',
  email: 'alex.rivera@example.com',
  targetTitle: 'Senior Full Stack Engineer / AI Product Engineer',
  targetLocation: 'San Francisco, CA (Hybrid / Remote)',
  desiredSalaryMin: 160000,
  desiredSalaryMax: 210000,
  gmailApiKey: import.meta.env.VITE_GMAIL_API_KEY || '',
  gmailClientId: import.meta.env.VITE_GMAIL_CLIENT_ID || '219885217250-k2s6hq6dgurqppjlk6vp2lp6p0j3adf0.apps.googleusercontent.com',
  gmailClientSecret: import.meta.env.VITE_GMAIL_CLIENT_SECRET || '',
  groqApiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  emailSyncEnabled: true,
};

export const initialCompanies: Company[] = [
  {
    id: 'comp-1',
    name: 'Stripe',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    website: 'https://stripe.com',
    industry: 'Financial Technology',
    tier: 'Unicorn',
    size: '7,000+ employees',
    location: 'San Francisco, CA',
    techStack: ['React', 'TypeScript', 'Ruby', 'Go', 'AWS'],
    rating: 4.8,
    savedNotes: 'High engineering bar. Known for legendary documentation and developer experience.',
    openApplicationsCount: 1,
  },
  {
    id: 'comp-2',
    name: 'OpenAI',
    logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=80',
    website: 'https://openai.com',
    industry: 'Artificial Intelligence',
    tier: 'Unicorn',
    size: '1,500+ employees',
    location: 'San Francisco, CA',
    techStack: ['Python', 'PyTorch', 'React', 'TypeScript', 'Kubernetes'],
    rating: 4.9,
    savedNotes: 'Leading research lab creating state-of-the-art AI foundation models.',
    openApplicationsCount: 1,
  },
  {
    id: 'comp-3',
    name: 'Google',
    logo: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&auto=format&fit=crop&q=80',
    website: 'https://careers.google.com',
    industry: 'Technology / Cloud',
    tier: 'FAANG/Big Tech',
    size: '180,000+ employees',
    location: 'Mountain View, CA',
    techStack: ['C++', 'Python', 'Go', 'TypeScript', 'Borg'],
    rating: 4.7,
    savedNotes: 'Applied for L5 Senior Software Engineer in Google Cloud AI platform team.',
    openApplicationsCount: 1,
  },
  {
    id: 'comp-4',
    name: 'Datadog',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
    website: 'https://datadoghq.com',
    industry: 'Cloud Infrastructure / Monitoring',
    tier: 'Enterprise',
    size: '5,000+ employees',
    location: 'New York, NY',
    techStack: ['Go', 'Python', 'React', 'Kafka', 'PostgreSQL'],
    rating: 4.6,
    savedNotes: 'Fast growing observability engine. Great compensation package.',
    openApplicationsCount: 1,
  },
  {
    id: 'comp-5',
    name: 'Vercel',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    website: 'https://vercel.com',
    industry: 'Developer Tools / Web Infrastructure',
    tier: 'Growth Startup',
    size: '800+ employees',
    location: 'Remote',
    techStack: ['Next.js', 'React', 'Rust', 'TypeScript', 'Edge Runtime'],
    rating: 4.9,
    savedNotes: 'Creators of Next.js. Remote-first culture with exceptional design standards.',
    openApplicationsCount: 1,
  },
];

export const initialApplications: Application[] = [
  {
    id: 'app-1',
    companyName: 'Stripe',
    companyId: 'comp-1',
    roleTitle: 'Senior Full Stack Engineer - Billing Infrastructure',
    location: 'San Francisco, CA (Hybrid)',
    salaryRange: '$180,000 - $220,000 + Equity',
    workType: 'Hybrid',
    jobType: 'Full-time',
    stage: 'Interview',
    priority: 'High',
    appliedDate: '2026-07-15',
    lastActivityDate: '2026-08-01',
    jobDescription: `Stripe is looking for a Senior Full Stack Engineer to build next-generation billing infrastructure.
Requirements:
- 5+ years of software development experience with React, TypeScript, and Node.js or Go.
- Deep expertise in REST APIs, GraphQL, microservices, and high-concurrency systems.`,
    url: 'https://stripe.com/jobs/senior-fullstack-billing',
    atsScore: 92,
    matchedKeywords: ['React', 'TypeScript', 'REST APIs', 'PostgreSQL', 'Redis'],
    missingKeywords: ['Ruby', 'Go'],
    resumeVersionId: 'res-1',
    recruiterName: 'Sarah Jenkins',
    recruiterEmail: 'sjenkins@stripe.com',
    tags: ['Fintech', 'Fullstack'],
    notes: [
      { id: 'n-1', createdAt: '2026-07-28', content: 'Recruiter phone call went great.', author: 'Alex' }
    ],
    timeline: [
      { id: 't-1', date: '2026-07-15', title: 'Mail Sent', description: 'Outreach email sent to Sarah Jenkins', type: 'stage_change' }
    ]
  },
  {
    id: 'app-2',
    companyName: 'OpenAI',
    companyId: 'comp-2',
    roleTitle: 'Full Stack AI Product Engineer',
    location: 'San Francisco, CA',
    salaryRange: '$200,000 - $260,000 + Equity',
    workType: 'On-site',
    jobType: 'Full-time',
    stage: 'Mail Drafted',
    priority: 'High',
    appliedDate: '2026-07-20',
    lastActivityDate: '2026-07-29',
    jobDescription: `Join OpenAI to build intuitive interfaces and backend services for next-generation generative AI tools.`,
    url: 'https://openai.com/careers/fullstack-product-engineer',
    atsScore: 88,
    matchedKeywords: ['React', 'Next.js', 'Python', 'FastAPI', 'LLM APIs'],
    missingKeywords: ['PyTorch'],
    resumeVersionId: 'res-2',
    recruiterName: 'David Chen',
    recruiterEmail: 'dchen@openai.com',
    tags: ['AI/ML', 'Product'],
    notes: [],
    timeline: []
  },
  {
    id: 'app-3',
    companyName: 'Google',
    companyId: 'comp-3',
    roleTitle: 'Senior Software Engineer - Cloud AI',
    location: 'Mountain View, CA',
    salaryRange: '$190,000 - $235,000 + Stock',
    workType: 'Hybrid',
    jobType: 'Full-time',
    stage: 'Mail Sent',
    priority: 'Medium',
    appliedDate: '2026-07-22',
    lastActivityDate: '2026-07-26',
    jobDescription: `Google Cloud AI is seeking Senior Software Engineers to build distributed training pipelines.`,
    url: 'https://careers.google.com/jobs/results/1234567',
    atsScore: 82,
    matchedKeywords: ['Python', 'Distributed Systems'],
    missingKeywords: ['C++', 'Java'],
    resumeVersionId: 'res-1',
    recruiterName: 'Elena Rostova',
    recruiterEmail: 'erostova@google.com',
    tags: ['Big Tech'],
    notes: [],
    timeline: []
  },
  {
    id: 'app-4',
    companyName: 'Datadog',
    companyId: 'comp-4',
    roleTitle: 'Senior Frontend Engineer - Dashboards',
    location: 'New York, NY (Remote)',
    salaryRange: '$175,000 - $210,000',
    workType: 'Remote',
    jobType: 'Full-time',
    stage: 'Response Recieved',
    priority: 'Medium',
    appliedDate: '2026-07-10',
    lastActivityDate: '2026-08-02',
    jobDescription: `Datadog is looking for a Senior Frontend Engineer to champion real-time visualization widgets.`,
    url: 'https://datadoghq.com/careers/senior-frontend',
    atsScore: 95,
    matchedKeywords: ['TypeScript', 'React', 'State Management'],
    missingKeywords: ['D3.js'],
    resumeVersionId: 'res-1',
    recruiterName: 'Lisa Thorne',
    recruiterEmail: 'lisa.thorne@datadog.com',
    tags: ['Observability'],
    notes: [],
    timeline: []
  },
  {
    id: 'app-5',
    companyName: 'Vercel',
    companyId: 'comp-5',
    roleTitle: 'Senior Full Stack Engineer - AI Tools',
    location: 'Remote',
    salaryRange: '$185,000 - $225,000 + Stock Options',
    workType: 'Remote',
    jobType: 'Full-time',
    stage: 'Accepted',
    priority: 'High',
    appliedDate: '2026-07-01',
    lastActivityDate: '2026-08-02',
    jobDescription: `Vercel is looking for a Full Stack Engineer to lead AI SDK features.`,
    url: 'https://vercel.com/careers/senior-full-stack-ai',
    atsScore: 98,
    matchedKeywords: ['Next.js', 'React Server Components', 'TypeScript'],
    missingKeywords: [],
    resumeVersionId: 'res-2',
    recruiterName: 'Rachel Adams',
    recruiterEmail: 'rachel@vercel.com',
    tags: ['DevTools', 'Dream Offer'],
    notes: [
      { id: 'n-6', createdAt: '2026-08-02', content: 'Offer accepted!', author: 'Alex' }
    ],
    timeline: []
  }
];

export const initialEmails: EmailMessage[] = [
  {
    id: 'em-1',
    applicationId: 'app-1',
    companyName: 'Stripe',
    recruiterName: 'Sarah Jenkins',
    recruiterEmail: 'sjenkins@stripe.com',
    subject: 'Stripe Application Update: System Design Round',
    snippet: 'Hi Alex, We are excited to move forward with your candidate review...',
    body: `Hi Alex,

We are excited to move forward with your interview process for the Senior Full Stack Engineer role at Stripe!

Your next interview stage is a 60-minute System Design session scheduled for Wednesday, August 5.

Best regards,
Sarah Jenkins | Stripe Recruiter`,
    date: '2026-08-01T14:30:00Z',
    isRead: true,
    type: 'inbox',
    classification: 'Interview Invite',
    aiSuggestedAction: 'Confirm System Design interview availability.'
  }
];

export const initialResumes: ResumeVersion[] = [
  {
    id: 'res-1',
    title: 'Senior Full Stack Engineer (Core Systems)',
    updatedAt: '2026-07-28',
    fileSize: '142 KB',
    targetRole: 'Full Stack & Backend Infrastructure',
    skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis'],
    contentSummary: 'Senior Software Engineer with 6+ years experience architecting web applications.',
    isPrimary: true
  }
];

export const initialCoverLetters: CoverLetter[] = [
  {
    id: 'cl-1',
    title: 'Stripe Cover Letter',
    targetCompany: 'Stripe',
    targetRole: 'Senior Full Stack Engineer',
    tone: 'Professional',
    updatedAt: '2026-07-15',
    content: `Dear Hiring Team at Stripe,\n\nI am writing to express my strong interest in the Senior Full Stack Engineer role...`
  }
];

export const initialDocuments: UserDocument[] = [
  {
    id: 'doc-1',
    name: 'Alex_Rivera_Transcripts_BS_CS.pdf',
    category: 'Transcript',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    uploadDate: '2026-06-15'
  }
];

export const initialTasks: CRMTask[] = [
  {
    id: 'task-1',
    applicationId: 'app-1',
    companyName: 'Stripe',
    title: 'Prepare System Design Architecture Notes',
    dueDate: '2026-08-04',
    priority: 'High',
    completed: false,
    category: 'Preparation'
  }
];
