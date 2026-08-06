import { Application, Priority, WorkType } from '../types/crm';
import { normalizePipelineStage } from './stageNormalizer';
import { analyzeATS } from './atsScorer';

/**
 * Robust CSV line splitter that handles quoted values with embedded commas or quotes.
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' || char === "'") {
      if (inQuotes && line[i + 1] === char) {
        // Escaped quote inside quoted string
        current += char;
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Standardizes header strings to find matching columns regardless of case or ordering.
 */
function normalizeHeader(h: string): string {
  return h.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export interface ParsedCSVResult {
  applications: Application[];
  appSectionCount: number;
  companySectionCount: number;
}

/**
 * Intelligently parses CSV text by inspecting header names and value patterns.
 */
export function parseCSVToApplications(
  csvText: string,
  userResumes: { isPrimary?: boolean; contentSummary?: string; skills?: string[] }[] = []
): ParsedCSVResult {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    return { applications: [], appSectionCount: 0, companySectionCount: 0 };
  }

  const rawHeaderCols = parseCSVLine(lines[0]);
  const headerMap = new Map<string, number>();

  rawHeaderCols.forEach((col, idx) => {
    headerMap.set(normalizeHeader(col), idx);
  });

  // Check if header row exists
  const hasHeaderRow = Array.from(headerMap.keys()).some(k =>
    k.includes('company') || k.includes('role') || k.includes('title') || k.includes('email') || k.includes('url') || k.includes('link') || k.includes('salary') || k.includes('location')
  );

  const startIdx = hasHeaderRow ? 1 : 0;
  const today = new Date().toISOString().split('T')[0];

  const applications: Application[] = [];
  let appSectionCount = 0;
  let companySectionCount = 0;

  // Helper to extract value by matching known column aliases
  const getCol = (cols: string[], aliases: string[], fallbackIdx: number): string => {
    if (hasHeaderRow) {
      for (const alias of aliases) {
        const normAlias = normalizeHeader(alias);
        for (const [key, index] of headerMap.entries()) {
          if (key === normAlias || key.includes(normAlias)) {
            if (cols[index] !== undefined && cols[index] !== '') {
              return cols[index];
            }
          }
        }
      }
    }
    return cols[fallbackIdx] || '';
  };

  for (let i = startIdx; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 2) continue;

    // 1. Company Name
    const companyName = getCol(cols, ['company', 'companyname', 'organization', 'employer'], 0) || 'Target Company';

    // 2. Role Title
    const roleTitle = getCol(cols, ['role', 'title', 'roletitle', 'jobtitle', 'position'], 1) || 'Software Engineer';

    // 3. Location
    const location = getCol(cols, ['location', 'city', 'country', 'place'], 2) || 'Remote';

    // 4. Salary Range
    const salaryRange = getCol(cols, ['salary', 'salaryrange', 'pay', 'compensation', 'ctc'], 3) || '$160,000 - $200,000';

    // 5. Work Type
    const rawWorkType = getCol(cols, ['worktype', 'type', 'mode', 'setup'], 4);
    let workType: WorkType = 'Hybrid';
    if (rawWorkType.toLowerCase().includes('remote')) workType = 'Remote';
    else if (rawWorkType.toLowerCase().includes('site') || rawWorkType.toLowerCase().includes('office')) workType = 'On-site';

    // 6. Stage
    const rawStage = getCol(cols, ['stage', 'status', 'pipeline', 'state'], 5);

    // 7. Priority
    const rawPriority = getCol(cols, ['priority', 'level'], 6);
    let priority: Priority = 'High';
    if (rawPriority.toLowerCase().includes('low')) priority = 'Low';
    else if (rawPriority.toLowerCase().includes('med')) priority = 'Medium';

    // 8. Job Description
    const jobDescription = getCol(cols, ['jobdescription', 'description', 'jd', 'summary', 'details'], 7) || `${roleTitle} role at ${companyName}`;

    // 9. Recruiter Contact
    const rawRecruiterName = getCol(cols, ['recruiter', 'recruitername', 'hr', 'hrname', 'contact', 'contactname'], 8);
    const rawRecruiterEmail = getCol(cols, ['email', 'recruiteremail', 'hremail', 'contactemail'], 9);
    const rawPhone = getCol(cols, ['phone', 'contactphone', 'mobile', 'number'], 10);

    // 10. URL / Job Link Pattern Matching Fallback
    let rawUrl = getCol(cols, ['url', 'link', 'joburl', 'website', 'careerslink', 'applylink'], 11);
    if (!rawUrl) {
      // Smart Fallback: Find column starting with http/https or containing domain pattern
      rawUrl = cols.find(c => c.includes('.') && (c.startsWith('http') || c.startsWith('www') || c.includes('/'))) || '';
    }

    if (rawUrl && !rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
      rawUrl = `https://${rawUrl}`;
    }

    // Smart Email Pattern Matching: If recruiter email column wasn't identified by header, find any cell with '@'
    let recruiterEmailCandidate = rawRecruiterEmail;
    if (!recruiterEmailCandidate) {
      recruiterEmailCandidate = cols.find(c => c.includes('@') && !c.includes('http') && !c.includes('.com/')) || '';
    }

    // Smart HR Contact Validation
    const hasValidHREmail = Boolean(
      recruiterEmailCandidate &&
      recruiterEmailCandidate.includes('@') &&
      !recruiterEmailCandidate.toLowerCase().includes('recruiter@company.com') &&
      !recruiterEmailCandidate.toLowerCase().includes('n/a') &&
      !recruiterEmailCandidate.toLowerCase().includes('none')
    );

    const hasValidHRPhone = Boolean(rawPhone && rawPhone.length >= 7 && !rawPhone.toLowerCase().includes('n/a'));
    const hasHRContact = hasValidHREmail || hasValidHRPhone;

    // Routing Logic
    const stage = hasHRContact ? (rawStage ? normalizePipelineStage(rawStage) : 'Mail Drafted') : 'Companies';
    const recruiterName = hasHRContact ? (rawRecruiterName || 'Hiring Manager') : '';
    const recruiterEmail = hasValidHREmail ? recruiterEmailCandidate : '';
    const recruiterPhone = hasValidHRPhone ? rawPhone : '';
    const applicationMethod = hasHRContact ? 'Direct Email' : 'Careers Portal';
    const portalStatus = hasHRContact ? undefined : 'Imported';

    if (hasHRContact) {
      appSectionCount++;
    } else {
      companySectionCount++;
    }

    const primaryResume = userResumes.find(r => r.isPrimary) || userResumes[0];
    const atsResult = analyzeATS(jobDescription, primaryResume?.contentSummary || '', primaryResume?.skills || []);

    applications.push({
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
      url: rawUrl || undefined,
      atsScore: atsResult.score,
      matchedKeywords: atsResult.matchedKeywords,
      missingKeywords: atsResult.missingKeywords,
      recruiterName,
      recruiterEmail,
      recruiterPhone,
      applicationMethod,
      portalStatus,
      notes: [],
      timeline: [
        {
          id: 't-csv-' + i,
          date: today,
          title: 'Imported via File',
          description: hasHRContact ? 'Routed to Applications (HR Email)' : 'Routed to Companies (Careers Portal)',
          type: 'stage_change'
        }
      ],
      tags: ['File Import', hasHRContact ? 'HR Email' : 'Careers Portal']
    });
  }

  return { applications, appSectionCount, companySectionCount };
}
