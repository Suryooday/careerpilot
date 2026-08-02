export interface ATSAnalysisResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  skillCategoryBreakdown: {
    category: string;
    score: number;
    found: string[];
    missing: string[];
  }[];
  suggestions: string[];
}

const COMMON_TECH_KEYWORDS = [
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Go', 'C++', 'Java', 'Ruby',
  'Next.js', 'FastAPI', 'Express', 'GraphQL', 'REST APIs', 'PostgreSQL', 'MySQL', 'MongoDB',
  'Redis', 'Kafka', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'CI/CD', 'Git',
  'Microservices', 'Distributed Systems', 'System Design', 'TailwindCSS', 'Redux',
  'Zustand', 'PyTorch', 'TensorFlow', 'LLM APIs', 'OpenAI API', 'Vector DB', 'RAG',
  'WebSockets', 'Agile', 'Unit Testing', 'Performance Optimization', 'Security', 'Auth'
];

export function analyzeATS(jobDescription: string, resumeContent: string, resumeSkills: string[] = []): ATSAnalysisResult {
  if (!jobDescription || !jobDescription.trim()) {
    return {
      score: 75,
      matchedKeywords: ['React', 'TypeScript', 'REST APIs'],
      missingKeywords: ['CI/CD', 'AWS'],
      skillCategoryBreakdown: [],
      suggestions: ['Add specific metrics and quantitative achievements to your bullet points.']
    };
  }

  const jdLower = jobDescription.toLowerCase();
  const resumeCombined = (resumeContent + ' ' + resumeSkills.join(' ')).toLowerCase();

  // Find matches
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  COMMON_TECH_KEYWORDS.forEach(keyword => {
    const kwLower = keyword.toLowerCase();
    if (jdLower.includes(kwLower)) {
      if (resumeCombined.includes(kwLower)) {
        matchedKeywords.push(keyword);
      } else {
        missingKeywords.push(keyword);
      }
    }
  });

  // Calculate score base
  const totalKeywords = matchedKeywords.length + missingKeywords.length;
  let score = 70; // baseline

  if (totalKeywords > 0) {
    const ratio = matchedKeywords.length / totalKeywords;
    score = Math.round(50 + (ratio * 48));
  } else {
    // Word overlap calculation fallback
    const jdWords = new Set(jdLower.match(/\b[a-z]{4,}\b/g) || []);
    const resumeWords = new Set(resumeCombined.match(/\b[a-z]{4,}\b/g) || []);
    let overlaps = 0;
    jdWords.forEach(word => {
      if (resumeWords.has(word)) overlaps++;
    });
    if (jdWords.size > 0) {
      score = Math.min(95, Math.max(55, Math.round((overlaps / jdWords.size) * 120)));
    }
  }

  // Ensure score within 45 - 99
  score = Math.min(99, Math.max(45, score));

  // Category breakdown
  const categories = [
    { name: 'Core Frontend & UI', keywords: ['React', 'TypeScript', 'Next.js', 'TailwindCSS', 'JavaScript'] },
    { name: 'Backend & APIs', keywords: ['Node.js', 'Python', 'Go', 'FastAPI', 'REST APIs', 'GraphQL', 'Microservices'] },
    { name: 'Database & Cloud', keywords: ['PostgreSQL', 'Redis', 'AWS', 'Docker', 'Kubernetes', 'Kafka'] },
    { name: 'AI & Data Engineering', keywords: ['PyTorch', 'LLM APIs', 'OpenAI API', 'Vector DB', 'RAG', 'Python'] }
  ];

  const skillCategoryBreakdown = categories.map(cat => {
    const found: string[] = [];
    const missing: string[] = [];
    cat.keywords.forEach(kw => {
      if (matchedKeywords.includes(kw)) found.push(kw);
      else if (missingKeywords.includes(kw)) missing.push(kw);
    });
    const catScore = (found.length + missing.length) > 0 ? Math.round((found.length / (found.length + missing.length)) * 100) : 80;
    return {
      category: cat.name,
      score: catScore,
      found,
      missing
    };
  });

  const suggestions: string[] = [];
  if (missingKeywords.length > 0) {
    suggestions.push(`Integrate key missing technical skills: ${missingKeywords.slice(0, 4).join(', ')} into your experience bullet points.`);
  }
  if (score < 80) {
    suggestions.push('Mirror the exact phrasing used in the job description requirements for key frameworks and concepts.');
  }
  suggestions.push('Quantify impact (e.g. "Improved API response speed by 35%" or "Architected service scaling to 2M DAU").');

  return {
    score,
    matchedKeywords,
    missingKeywords,
    skillCategoryBreakdown,
    suggestions
  };
}
