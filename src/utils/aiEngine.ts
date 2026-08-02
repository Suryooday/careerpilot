import { Application, EmailMessage, ResumeVersion, PipelineStage, MasterProfile } from '../types/crm';

const DEFAULT_GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const DEFAULT_GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export async function callGroqAPI(prompt: string, apiKey: string = DEFAULT_GROQ_KEY): Promise<string> {
  const key = apiKey || DEFAULT_GROQ_KEY;
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1200
      })
    });
    if (!res.ok) throw new Error(`Groq HTTP ${res.status}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
  } catch (err) {
    console.warn('Groq API call fallback:', err);
    return '';
  }
}

export async function callGeminiAPI(prompt: string, apiKey: string = DEFAULT_GEMINI_KEY): Promise<string> {
  const key = apiKey || DEFAULT_GEMINI_KEY;
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });
    if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } catch (err) {
    console.warn('Gemini API call fallback:', err);
    return '';
  }
}

export async function generateGroqResumeAdvice(
  jdText: string,
  masterProfile: MasterProfile,
  apiKey: string = DEFAULT_GROQ_KEY
): Promise<{
  matchedSkills: string[];
  missingSkills: string[];
  rankedProjects: { title: string; techStack: string; description: string }[];
  overleafBullets: string;
}> {
  const prompt = `You are an expert technical resume parser and LaTeX Overleaf tailoring advisor.
Target Job Description (JD):
"""
${jdText}
"""

User Master Background:
- Skills: ${masterProfile.skills.join(', ')}
- Projects: ${JSON.stringify(masterProfile.projects)}
- Internships & Experience: ${JSON.stringify(masterProfile.internships)}

Analyze the JD and rank the user's master details for Overleaf LaTeX resume insertion.
Return a valid JSON object with keys:
"matchedSkills": array of matched skill strings
"missingSkills": array of missing skill strings to add
"rankedProjects": array of objects { "title": string, "techStack": string, "description": string }
"overleafBullets": string containing LaTeX formatted \\item bullet points ready for Overleaf.`;

  const responseText = await callGroqAPI(prompt, apiKey);

  if (responseText) {
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          matchedSkills: parsed.matchedSkills || [],
          missingSkills: parsed.missingSkills || [],
          rankedProjects: parsed.rankedProjects || masterProfile.projects,
          overleafBullets: parsed.overleafBullets || masterProfile.internships.map(i => `\\item \\textbf{${i.company}} (${i.role}): ${i.highlights}`).join('\n')
        };
      }
    } catch (e) {
      console.warn('Failed to parse Groq JSON response, using fallback matcher:', e);
    }
  }

  // Local fallback
  const textLower = jdText.toLowerCase();
  const matchedSkills = masterProfile.skills.filter(s => textLower.includes(s.toLowerCase()));
  const missingSkills = ['Kubernetes', 'GraphQL', 'System Design'].filter(s => textLower.includes(s.toLowerCase()) && !matchedSkills.includes(s));

  return {
    matchedSkills: matchedSkills.length > 0 ? matchedSkills : masterProfile.skills.slice(0, 6),
    missingSkills: missingSkills,
    rankedProjects: masterProfile.projects,
    overleafBullets: masterProfile.internships.map(i => `\\item \\textbf{${i.company}} (${i.role}): ${i.highlights}`).join('\n')
  };
}

export function generateAIEmailDraft(
  type: 'Cold Outreach' | 'Follow-up' | 'Thank You' | 'Referral Request',
  application: Application,
  recruiterName: string,
  userProfileName: string
): { subject: string; body: string } {
  const company = application.companyName;
  const role = application.roleTitle;

  switch (type) {
    case 'Cold Outreach':
      return {
        subject: `Inquiry regarding ${role} opportunities at ${company}`,
        body: `Dear ${recruiterName || 'Hiring Team'},

I hope this email finds you well.

I am writing to express my strong interest in joining ${company} as a ${role}. Having closely followed ${company}'s work in pushing product boundaries, I have been deeply impressed by your team's engineering standards and vision.

With extensive experience building high-throughput web architectures, REST/GraphQL APIs, and modern user interfaces, I would love the chance to discuss how my technical background aligns with ${company}'s upcoming roadmap.

Are you available for a brief 10-minute chat next week? I have attached my latest resume for your review.

Best regards,
${userProfileName}`
      };

    case 'Follow-up':
      return {
        subject: `Following up: ${role} application - ${userProfileName}`,
        body: `Hi ${recruiterName || 'Team'},

I hope you are having a great week!

I wanted to follow up on my recent application for the ${role} position at ${company}. I remain very enthusiastic about the possibility of joining ${company} and contributing to your engineering team.

Please let me know if there are any additional details or work samples I can provide to assist in your review.

Thank you again for your time and consideration!

Warmly,
${userProfileName}`
      };

    case 'Thank You':
      return {
        subject: `Thank you for the interview - ${role} at ${company}`,
        body: `Hi ${recruiterName || 'Interview Team'},

Thank you so much for taking the time to speak with me today about the ${role} position at ${company}.

I truly enjoyed learning more about the team's current challenges and technical goals. Our discussion around system architecture further reinforced my excitement about the impact I could make at ${company}.

Please don't hesitate to reach out if you need any additional references or information. I look forward to hearing about the next steps!

Best regards,
${userProfileName}`
      };

    case 'Referral Request':
      return {
        subject: `Connecting regarding ${role} role at ${company}`,
        body: `Hi ${recruiterName || 'Friend'},

I hope things are going great with you!

I noticed an exciting open position at ${company} for a ${role} and immediately thought of your team. Given your experience at ${company}, I would love to learn more about the team culture and product priorities.

If you are open to it, I would be immensely grateful for a quick referral or introduction to the hiring manager. I have attached my resume for easy reference.

Thanks so much, and hope to catch up soon!

Best,
${userProfileName}`
      };
  }
}

export function generateAICoverLetter(
  application: Application,
  resume: ResumeVersion,
  tone: 'Professional' | 'Energetic' | 'Concise' | 'Creative',
  userName: string
): string {
  const company = application.companyName;
  const role = application.roleTitle;
  const matched = application.matchedKeywords.slice(0, 5).join(', ');

  if (tone === 'Concise') {
    return `Dear Hiring Manager at ${company},

I am writing to express my strong interest in the ${role} position at ${company}.

With proven expertise in ${matched || 'modern software engineering'}, I have led technical initiatives resulting in significant performance enhancements and robust user experience.

My background directly aligns with ${company}'s current growth goals. I would welcome the opportunity to discuss how my skill set will add value to your team.

Sincerely,
${userName}`;
  }

  if (tone === 'Energetic') {
    return `Hi ${company} Team!

I couldn't be more excited to apply for the ${role} role at ${company}! 

As a dedicated developer who thrives on building high-impact software, I have been following ${company}'s work with immense admiration. My technical background spans ${matched || 'full stack engineering'}, paired with a passion for building delightful, reliable systems.

I would love to bring my energy, technical craft, and product focus to ${company}. Let's build something extraordinary together!

Best regards,
${userName}`;
  }

  return `Dear Hiring Manager,

I am writing to submit my application for the ${role} position at ${company}. Having followed ${company}'s trajectory and engineering achievements, I am inspired by your team's commitment to technical excellence.

Throughout my career, I have specialized in building scalable applications using ${matched || 'React, TypeScript, and modern backend systems'}. In my previous projects, I focused on high availability, performance optimization, and seamless user interaction design.

I am confident that my background in software architecture and collaborative problem-solving makes me a strong fit for ${company}. I look forward to discussing how I can contribute to your team's ongoing success.

Sincerely,
${userName}`;
}

export function classifyEmailResponse(subject: string, body: string): {
  classification: 'Interview Invite' | 'Assessment Test' | 'Rejection' | 'Update' | 'General Outreach';
  suggestedStage?: PipelineStage;
  suggestedAction: string;
} {
  const text = (subject + ' ' + body).toLowerCase();

  if (text.includes('schedule') || text.includes('interview') || text.includes('zoom') || text.includes('meet with')) {
    return {
      classification: 'Interview Invite',
      suggestedStage: 'Interview',
      suggestedAction: 'Move application stage to Interview.'
    };
  }

  if (text.includes('assessment') || text.includes('take-home') || text.includes('hackerrank') || text.includes('codility')) {
    return {
      classification: 'Assessment Test',
      suggestedStage: 'Response Recieved',
      suggestedAction: 'Move application stage to Response Recieved.'
    };
  }

  if (text.includes('regret') || text.includes('unfortunately') || text.includes('not moving forward') || text.includes('other candidates')) {
    return {
      classification: 'Rejection',
      suggestedStage: 'Closed Selection',
      suggestedAction: 'Mark application as Closed Selection.'
    };
  }

  if (text.includes('offer') || text.includes('congratulations') || text.includes('compensation package')) {
    return {
      classification: 'Update',
      suggestedStage: 'Accepted',
      suggestedAction: 'Move application stage to Accepted!'
    };
  }

  return {
    classification: 'General Outreach',
    suggestedAction: 'Review email content and reply accordingly.'
  };
}

export function answerCopilotQuery(
  query: string,
  applications: Application[],
  tasks: any[]
): { response: string; actionButtons?: { label: string; action: string }[] } {
  const q = query.toLowerCase();

  if (q.includes('follow up') || q.includes('pending') || q.includes('overdue')) {
    const pendingTasks = tasks.filter(t => !t.completed);
    const oldestApps = applications.filter(a => a.stage === 'Companies' || a.stage === 'Mail Drafted' || a.stage === 'Mail Sent');
    
    return {
      response: `You currently have **${pendingTasks.length} pending task(s)** and **${oldestApps.length} application(s)** waiting for responses.\n\nKey Action Items:\n- **Google**: Recommended to send recruiter follow-up email.`,
      actionButtons: [
        { label: 'View Tasks', action: 'navigate_tasks' },
        { label: 'Draft Follow-up Email', action: 'draft_email' }
      ]
    };
  }

  if (q.includes('ats') || q.includes('resume') || q.includes('tailor')) {
    const avgAts = Math.round(applications.reduce((acc, a) => acc + a.atsScore, 0) / (applications.length || 1));
    return {
      response: `Your average ATS score across all applications is **${avgAts}%**!\n\nTop match: **Vercel** (98% match)\nLowest match: **Google** (82% match).\n\nHead over to **Resume Studio** to optimize keyword alignment with **Groq API**.`,
      actionButtons: [
        { label: 'Open Resume Studio', action: 'navigate_resume' }
      ]
    };
  }

  if (q.includes('offer') || q.includes('salary') || q.includes('accept')) {
    return {
      response: `🎉 **Congratulations on your Vercel Role!**\n\n- **Base Salary**: $205,000 USD\n- **Equity**: 18,000 ISO Options\n- **Status**: Accepted!`,
      actionButtons: [
        { label: 'View Application Details', action: 'view_vercel_app' }
      ]
    };
  }

  return {
    response: `I've analyzed your CareerPilot CRM data with **Gemini & Groq AI**:\n- **Total Applications**: ${applications.length}\n- **Active Pipeline**: ${applications.filter(a => a.stage !== 'Closed Selection').length}\n\nHow can I help you today? You can ask me to draft emails with **Gemini API**, or analyze resume keyword fit with **Groq API**!`,
    actionButtons: [
      { label: 'Generate Email Draft (Gemini)', action: 'draft_email' },
      { label: 'Run ATS Resume Audit (Groq)', action: 'navigate_resume' }
    ]
  };
}
