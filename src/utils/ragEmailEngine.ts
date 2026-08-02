import { Application, MasterProfile, EmailMessage } from '../types/crm';
import { callGeminiAPI, callGroqAPI } from './aiEngine';

export interface RAGContextPayload {
  companyName: string;
  roleTitle: string;
  recruiterName: string;
  jdHighlights: string[];
  matchedProjects: { title: string; description: string; techStack: string }[];
  matchedExperience: { company: string; role: string; highlights: string }[];
  userNotes: string[];
}

/**
 * RETRIEVAL STAGE: Retrieves relevant context chunks from JD, Master Resume Profile, and Application Notes
 */
export function retrieveRAGContext(
  application: Application,
  masterProfile: MasterProfile,
  recruiterName: string
): RAGContextPayload {
  const jdText = application.jobDescription.toLowerCase();

  // 1. Retrieve relevant projects from Master Profile matching JD keywords
  const matchedProjects = masterProfile.projects.filter(proj => {
    const projText = (proj.title + ' ' + proj.techStack + ' ' + proj.description).toLowerCase();
    return application.matchedKeywords.some(kw => projText.includes(kw.toLowerCase()));
  });

  // 2. Retrieve relevant work experiences / internships
  const matchedExperience = masterProfile.internships.filter(exp => {
    const expText = (exp.company + ' ' + exp.role + ' ' + exp.highlights).toLowerCase();
    return application.matchedKeywords.some(kw => expText.includes(kw.toLowerCase()));
  });

  // 3. Retrieve user-entered notes on this application
  const userNotes = application.notes.map(n => n.content);

  // 4. Extract key requirement phrases from JD
  const jdLines = application.jobDescription.split('\n').filter(l => l.trim().length > 10);
  const jdHighlights = jdLines.slice(0, 4);

  return {
    companyName: application.companyName,
    roleTitle: application.roleTitle,
    recruiterName: recruiterName || application.recruiterName || 'Hiring Manager',
    jdHighlights,
    matchedProjects: matchedProjects.length > 0 ? matchedProjects : masterProfile.projects.slice(0, 2),
    matchedExperience: matchedExperience.length > 0 ? matchedExperience : masterProfile.internships.slice(0, 2),
    userNotes
  };
}

/**
 * AUGMENTATION & GENERATION STAGE: Calls Gemini/Groq API with RAG Augmented Context
 */
export async function generateRAGEmailDraft(
  application: Application,
  masterProfile: MasterProfile,
  emailType: 'Cold Outreach' | 'Follow-up' | 'Thank You' | 'Referral Request',
  userProfileName: string,
  geminiApiKey?: string
): Promise<{ subject: string; body: string }> {
  // 1. Retrieve RAG Context
  const rag = retrieveRAGContext(application, masterProfile, application.recruiterName || '');

  // 2. Build RAG Augmented Prompt
  const ragPrompt = `You are a world-class human copywriter and career coach.
Write a humanized, warm, and highly persuasive ${emailType} email.

[RETRIEVED RAG CONTEXT]
- Recruiter / Contact: ${rag.recruiterName}
- Target Company: ${rag.companyName}
- Target Role: ${rag.roleTitle}
- Candidate Name: ${userProfileName}

- Key Job Requirements (from JD):
${rag.jdHighlights.map(h => '  * ' + h).join('\n')}

- Candidate Matching Projects (from Master Resume):
${rag.matchedProjects.map(p => `  * ${p.title} (${p.techStack}): ${p.description}`).join('\n')}

- Candidate Matching Experience (from Master Resume):
${rag.matchedExperience.map(e => `  * ${e.company} - ${e.role}: ${e.highlights}`).join('\n')}

- Candidate Saved Notes / Interaction History:
${rag.userNotes.length > 0 ? rag.userNotes.map(n => '  * ' + n).join('\n') : '  * (First contact / no prior notes)'}

[HUMANIZATION & TONE DIRECTIVES]
1. Avoid robotic AI buzzwords like "I am writing to express my enthusiasm", "thrilled to apply", "synergy", or "driven professional".
2. Sound like an authentic, articulate software engineer having a natural conversation.
3. Mention specific details from the retrieved projects/experience and candidate notes if available.
4. Keep paragraphs short (2-3 sentences max).

Return your response strictly in JSON format:
{
  "subject": "Email subject line",
  "body": "Email body content"
}`;

  // 3. Generate via Gemini / Groq API with RAG payload
  const aiOutput = await callGeminiAPI(ragPrompt, geminiApiKey);

  if (aiOutput) {
    try {
      const jsonMatch = aiOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.subject && parsed.body) {
          return { subject: parsed.subject, body: parsed.body };
        }
      }
    } catch (e) {
      console.warn('RAG JSON parse fallback:', e);
    }
  }

  // Fallback humanized draft grounded in RAG context
  const primaryProj = rag.matchedProjects[0] || masterProfile.projects[0];
  const notesRef = rag.userNotes.length > 0 ? ` As noted in our previous chat, ${rag.userNotes[0].toLowerCase()}` : '';

  return {
    subject: `${rag.roleTitle} role - ${userProfileName}`,
    body: `Hi ${rag.recruiterName},

I hope your week is off to a great start.

I've been keeping an eye on ${rag.companyName}'s work in ${rag.roleTitle.toLowerCase()} systems and wanted to reach out directly.${notesRef}

Recently, I built ${primaryProj?.title || 'high-throughput architectures'} using ${primaryProj?.techStack || 'React and TypeScript'}, where I focused on reliability and user experience. Seeing ${rag.companyName}'s emphasis on scalable engineering in the job description, I thought my background would be a great fit.

I'd love to drop by for a quick 10-minute conversation if you're open to it. 

Best,
${userProfileName}`
  };
}
