export type JobSourceCategory = 'Careers Portal' | 'Recruitment Website';

export interface SourceInfo {
  category: JobSourceCategory;
  platformName: string;
}

export function detectJobSource(url?: string): SourceInfo {
  if (!url || typeof url !== 'string' || !url.includes('.')) {
    return { category: 'Careers Portal', platformName: 'Company Careers' };
  }

  const cleanUrl = url.toLowerCase();

  // Recruitment Websites / Aggregators
  if (cleanUrl.includes('linkedin.com')) return { category: 'Recruitment Website', platformName: 'LinkedIn' };
  if (cleanUrl.includes('indeed.com')) return { category: 'Recruitment Website', platformName: 'Indeed' };
  if (cleanUrl.includes('glassdoor.com')) return { category: 'Recruitment Website', platformName: 'Glassdoor' };
  if (cleanUrl.includes('naukri.com')) return { category: 'Recruitment Website', platformName: 'Naukri' };
  if (cleanUrl.includes('wellfound.com') || cleanUrl.includes('angel.co')) return { category: 'Recruitment Website', platformName: 'Wellfound' };
  if (cleanUrl.includes('ziprecruiter.com')) return { category: 'Recruitment Website', platformName: 'ZipRecruiter' };
  if (cleanUrl.includes('monster.com')) return { category: 'Recruitment Website', platformName: 'Monster' };
  if (cleanUrl.includes('dice.com')) return { category: 'Recruitment Website', platformName: 'Dice' };

  // Dedicated ATS & Careers Portals
  if (cleanUrl.includes('workday.com') || cleanUrl.includes('myworkdayjobs.com')) return { category: 'Careers Portal', platformName: 'Workday' };
  if (cleanUrl.includes('lever.co')) return { category: 'Careers Portal', platformName: 'Lever' };
  if (cleanUrl.includes('greenhouse.io')) return { category: 'Careers Portal', platformName: 'Greenhouse' };
  if (cleanUrl.includes('ashbyhq.com')) return { category: 'Careers Portal', platformName: 'Ashby' };
  if (cleanUrl.includes('taleo.net')) return { category: 'Careers Portal', platformName: 'Taleo' };
  if (cleanUrl.includes('bamboohr.com')) return { category: 'Careers Portal', platformName: 'BambooHR' };

  return { category: 'Careers Portal', platformName: 'Company Portal' };
}
