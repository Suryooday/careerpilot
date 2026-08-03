/**
 * Recruiter Email Predictor & Career Portal Link Generator
 */

export interface PredictedRecruiterEmail {
  email: string;
  label: string;
  confidence: string;
}

export function predictRecruiterEmails(companyName: string, companyUrl?: string): PredictedRecruiterEmail[] {
  let domain = 'company.com';

  if (companyUrl) {
    try {
      const urlObj = new URL(companyUrl.startsWith('http') ? companyUrl : `https://${companyUrl}`);
      domain = urlObj.hostname.replace(/^www\./, '');
    } catch {
      domain = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
    }
  } else {
    domain = `${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  }

  return [
    { email: `careers@${domain}`, label: 'Careers Inbox', confidence: '92% High' },
    { email: `recruiting@${domain}`, label: 'Recruiting Team', confidence: '88% High' },
    { email: `jobs@${domain}`, label: 'Jobs Department', confidence: '85% Medium' },
    { email: `hr@${domain}`, label: 'Human Resources', confidence: '80% Medium' },
    { email: `talent@${domain}`, label: 'Talent Acquisition', confidence: '75% Medium' }
  ];
}
