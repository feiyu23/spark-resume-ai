/**
 * Basic ATS Scorer (3-Dimension Scoring)
 * Open source version with fundamental ATS analysis
 *
 * For AI-enhanced 6-dimension scoring with Australian market analysis, see:
 * https://store.ozsparkhub.com.au/tools/resume-optimizer
 */

import { KeywordMatcher, KeywordMatchResult } from './keyword-matcher';
import { CosineSimilarity, SimilarityResult } from './cosine-similarity';
import { getAllKeywords } from '../data/sample-keywords';

export interface ATSScore {
  overall: number;                    // 0-100 overall ATS score
  breakdown: ScoreBreakdown;
  keywords: KeywordMatchResult;
  similarity: SimilarityResult;
  issues: ATSIssue[];
  suggestions: string[];
}

export interface ScoreBreakdown {
  keywordMatch: number;       // 30% weight
  formatScore: number;         // 35% weight
  semanticSimilarity: number;  // 35% weight
}

export interface ATSIssue {
  severity: 'critical' | 'warning' | 'info';
  category: 'keywords' | 'format' | 'content' | 'length';
  message: string;
  fix?: string;
}

export class ATSScorer {
  private keywordMatcher: KeywordMatcher;
  private similarityCalculator: CosineSimilarity;

  constructor() {
    this.keywordMatcher = new KeywordMatcher();
    this.similarityCalculator = new CosineSimilarity();
  }

  /**
   * Score resume against job description
   */
  score(resumeText: string, jobDescription: string, customKeywords?: string[]): ATSScore {
    const issues: ATSIssue[] = [];
    const suggestions: string[] = [];

    // 1. Keyword Matching (30% weight)
    const keywords = customKeywords || this.keywordMatcher.extractKeywords(jobDescription);
    const keywordResult = this.keywordMatcher.match(resumeText, keywords);

    if (keywordResult.matchScore < 50) {
      issues.push({
        severity: 'critical',
        category: 'keywords',
        message: `Only ${keywordResult.matchScore}% keyword match. Need at least 50% for ATS.`,
        fix: `Add these missing keywords: ${keywordResult.missing.slice(0, 5).join(', ')}`
      });
    }

    // 2. Format Analysis (35% weight)
    const formatScore = this.analyzeFormat(resumeText, issues, suggestions);

    // 3. Semantic Similarity (35% weight)
    const similarity = this.similarityCalculator.calculate(resumeText, jobDescription);

    if (similarity.percentageScore < 40) {
      issues.push({
        severity: 'warning',
        category: 'content',
        message: 'Resume content doesn\'t closely match job description',
        fix: 'Tailor resume to emphasize relevant experience and skills'
      });
    }

    // Calculate overall score (weighted average)
    const overall = Math.round(
      keywordResult.matchScore * 0.30 +
      formatScore * 0.35 +
      similarity.percentageScore * 0.35
    );

    // Add general suggestions
    if (overall < 70) {
      suggestions.push('Consider using our full platform for AI-enhanced optimization');
      suggestions.push('Add more industry-specific keywords from the job description');
      suggestions.push('Ensure resume format is ATS-friendly (no tables, simple layout)');
    }

    return {
      overall,
      breakdown: {
        keywordMatch: keywordResult.matchScore,
        formatScore,
        semanticSimilarity: similarity.percentageScore
      },
      keywords: keywordResult,
      similarity,
      issues,
      suggestions
    };
  }

  /**
   * Quick score using sample keywords (no job description required)
   */
  quickScore(resumeText: string): ATSScore {
    const sampleKeywords = getAllKeywords();
    const dummyJobDesc = sampleKeywords.join(' '); // Create dummy job description
    return this.score(resumeText, dummyJobDesc, sampleKeywords);
  }

  /**
   * Analyze resume format for ATS compatibility
   */
  private analyzeFormat(resumeText: string, issues: ATSIssue[], suggestions: string[]): number {
    let score = 100;

    // Check length (1-3 pages ideal for AU market)
    const wordCount = resumeText.split(/\s+/).length;
    if (wordCount < 300) {
      score -= 20;
      issues.push({
        severity: 'critical',
        category: 'length',
        message: 'Resume is too short (less than 300 words)',
        fix: 'Add more detail about your experience and achievements'
      });
    } else if (wordCount > 2000) {
      score -= 10;
      issues.push({
        severity: 'warning',
        category: 'length',
        message: 'Resume might be too long for ATS (over 2000 words)',
        fix: 'Consider condensing to 2 pages maximum for Australian market'
      });
    }

    // Check for essential sections
    const hasContactInfo = /email|phone|mobile/i.test(resumeText);
    const hasExperience = /experience|work history|employment/i.test(resumeText);
    const hasEducation = /education|qualification|degree/i.test(resumeText);
    const hasSkills = /skills|competencies|expertise/i.test(resumeText);

    if (!hasContactInfo) {
      score -= 15;
      issues.push({
        severity: 'critical',
        category: 'format',
        message: 'No contact information found',
        fix: 'Add email and phone number at the top'
      });
    }

    if (!hasExperience) {
      score -= 15;
      issues.push({
        severity: 'critical',
        category: 'format',
        message: 'No work experience section found',
        fix: 'Add a clear "Work Experience" or "Employment History" section'
      });
    }

    if (!hasEducation) {
      score -= 10;
      issues.push({
        severity: 'warning',
        category: 'format',
        message: 'No education section found',
        fix: 'Add an "Education" section with your qualifications'
      });
    }

    if (!hasSkills) {
      score -= 10;
      issues.push({
        severity: 'warning',
        category: 'format',
        message: 'No skills section found',
        fix: 'Add a "Skills" or "Key Competencies" section'
      });
    }

    // Check for bullet points (good ATS practice)
    const hasBullets = /[•·\-\*]/.test(resumeText);
    if (!hasBullets) {
      score -= 5;
      suggestions.push('Use bullet points to list achievements and responsibilities');
    }

    // Check for action verbs
    const actionVerbs = ['managed', 'developed', 'led', 'created', 'implemented', 'designed', 'improved'];
    const hasActionVerbs = actionVerbs.some(verb => new RegExp(`\\b${verb}`, 'i').test(resumeText));
    if (!hasActionVerbs) {
      score -= 5;
      suggestions.push('Start bullet points with strong action verbs (managed, developed, led, etc.)');
    }

    return Math.max(0, score);
  }
}

/**
 * Quick helper function to score resume
 */
export function scoreResume(resumeText: string, jobDescription: string): ATSScore {
  const scorer = new ATSScorer();
  return scorer.score(resumeText, jobDescription);
}

/**
 * Quick score without job description
 */
export function quickScore(resumeText: string): ATSScore {
  const scorer = new ATSScorer();
  return scorer.quickScore(resumeText);
}
