/**
 * Sample Keywords Database (Open Source Version)
 * Contains 100 common keywords across tech, business, and healthcare
 *
 * For 10,000+ industry-specific Australian keywords, see:
 * https://store.ozsparkhub.com.au/tools/resume-optimizer
 */

export interface KeywordCategory {
  name: string;
  keywords: string[];
}

export const SAMPLE_KEYWORDS: Record<string, KeywordCategory> = {
  // Technology & IT (30 keywords)
  technology: {
    name: 'Technology & IT',
    keywords: [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++',
      'React', 'Node.js', 'Angular', 'Vue.js', 'Next.js',
      'AWS', 'Azure', 'Docker', 'Kubernetes', 'CI/CD',
      'SQL', 'MongoDB', 'PostgreSQL', 'API', 'REST',
      'Git', 'Agile', 'Scrum', 'DevOps', 'Cloud',
      'Machine Learning', 'AI', 'Data Science', 'Testing', 'Security'
    ]
  },

  // Business & Management (25 keywords)
  business: {
    name: 'Business & Management',
    keywords: [
      'Project Management', 'Stakeholder Management', 'Budget Planning',
      'Strategy', 'Business Analysis', 'Process Improvement',
      'Change Management', 'Risk Management', 'Leadership',
      'Team Management', 'Communication', 'Presentation',
      'Negotiation', 'Client Relations', 'Sales',
      'Marketing', 'Analytics', 'Reporting', 'KPI',
      'ROI', 'P&L', 'Forecasting', 'Planning', 'Execution', 'Delivery'
    ]
  },

  // Healthcare (20 keywords)
  healthcare: {
    name: 'Healthcare',
    keywords: [
      'Patient Care', 'Clinical', 'Nursing', 'Medical',
      'Healthcare', 'AHPRA', 'First Aid', 'CPR',
      'Electronic Health Records', 'EHR', 'Medication',
      'Diagnosis', 'Treatment', 'Patient Safety',
      'Infection Control', 'Compliance', 'Quality Assurance',
      'Allied Health', 'Mental Health', 'Rehabilitation'
    ]
  },

  // Australian Workplace (15 keywords)
  australian: {
    name: 'Australian Workplace',
    keywords: [
      'Australian Standards', 'Fair Work Act', 'WHS', 'OH&S',
      'Workplace Health and Safety', 'ABN', 'Superannuation',
      'Australian Market', 'Local Experience', 'Working Rights',
      'Permanent Resident', 'Visa', 'Australian Citizenship',
      'NDIS', 'Australian Government'
    ]
  },

  // Soft Skills (10 keywords)
  softSkills: {
    name: 'Soft Skills',
    keywords: [
      'Communication', 'Teamwork', 'Problem Solving',
      'Time Management', 'Attention to Detail', 'Adaptability',
      'Leadership', 'Critical Thinking', 'Collaboration', 'Initiative'
    ]
  }
};

/**
 * Get all keywords as a flat array
 */
export function getAllKeywords(): string[] {
  const allKeywords: string[] = [];
  Object.values(SAMPLE_KEYWORDS).forEach(category => {
    allKeywords.push(...category.keywords);
  });
  return allKeywords;
}

/**
 * Get keywords by category name
 */
export function getKeywordsByCategory(categoryName: string): string[] {
  const category = SAMPLE_KEYWORDS[categoryName];
  return category ? category.keywords : [];
}

/**
 * Get all categories
 */
export function getCategories(): string[] {
  return Object.keys(SAMPLE_KEYWORDS);
}
