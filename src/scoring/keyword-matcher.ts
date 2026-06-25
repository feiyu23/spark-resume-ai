/**
 * Keyword Matcher - Match keywords between resume and job description
 * Uses case-insensitive matching and normalization
 */

export interface KeywordMatchResult {
  found: string[];           // Keywords found in resume
  missing: string[];         // Keywords missing from resume
  matchScore: number;        // 0-100 score
  totalKeywords: number;
  foundCount: number;
  missingCount: number;
}

export class KeywordMatcher {
  /**
   * Match keywords between resume text and a list of keywords
   */
  match(resumeText: string, keywords: string[]): KeywordMatchResult {
    const normalizedResume = this.normalizeText(resumeText);
    const found: string[] = [];
    const missing: string[] = [];

    keywords.forEach(keyword => {
      const normalizedKeyword = this.normalizeText(keyword);
      if (!normalizedKeyword) return;

      const escaped = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|[^a-z0-9+#])${escaped}(?![a-z0-9+#])`, 'i');

      if (regex.test(normalizedResume)) {
        found.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    const matchScore = keywords.length > 0
      ? Math.round((found.length / keywords.length) * 100)
      : 0;

    return {
      found,
      missing,
      matchScore,
      totalKeywords: keywords.length,
      foundCount: found.length,
      missingCount: missing.length
    };
  }

  /**
   * Extract keywords from job description
   * Simple implementation - looks for capitalized words and common tech terms
   */
  extractKeywords(jobDescription: string): string[] {
    const text = jobDescription;
    const keywords = new Set<string>();

    // Extract capitalized words (potential proper nouns, technologies)
    const capitalizedWords = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) || [];
    capitalizedWords.forEach(word => {
      if (word.length > 2 && !this.isCommonWord(word)) {
        keywords.add(word);
      }
    });

    // Extract common tech patterns
    const techPatterns = [
      /\b[A-Z]{2,}\b/g,                    // Acronyms: AWS, SQL, API
      /\b[A-Z][a-z]+\.[a-z]+\b/g,          // Tech names: Node.js, Vue.js
      /\b\w+Script\b/gi,                    // JavaScript, TypeScript
      /\b(?:develop|design|manage|analyze|implement)\w*\b/gi  // Action verbs
    ];

    techPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      matches.forEach(match => keywords.add(match));
    });

    return Array.from(keywords);
  }

  /**
   * Compare resume against job description
   */
  compareToJob(resumeText: string, jobDescription: string, customKeywords?: string[]): KeywordMatchResult {
    // Use custom keywords if provided, otherwise extract from job description
    const keywords = customKeywords || this.extractKeywords(jobDescription);
    return this.match(resumeText, keywords);
  }

  /**
   * Normalize text for comparison (lowercase, remove special chars)
   */
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s+#.]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Check if word is a common word that shouldn't be a keyword
   */
  private isCommonWord(word: string): boolean {
    const commonWords = new Set([
      'the', 'this', 'that', 'these', 'those',
      'and', 'but', 'or', 'for', 'nor',
      'your', 'our', 'their', 'must', 'will',
      'should', 'would', 'could', 'may', 'might',
      'have', 'has', 'had', 'do', 'does', 'did',
      'is', 'are', 'was', 'were', 'been', 'being',
      'looking', 'senior', 'junior', 'experience', 'developer',
      'engineer', 'role', 'team', 'work', 'skills', 'ability',
      'knowledge', 'with', 'from', 'about', 'join', 'company',
      'highly', 'motivated', 'seeking', 'position', 'requirements',
      'strong', 'excellent', 'successful', 'key', 'good', 'new', 'years'
    ]);
    return commonWords.has(word.toLowerCase());
  }
}

/**
 * Quick helper function
 */
export function matchKeywords(resumeText: string, keywords: string[]): KeywordMatchResult {
  const matcher = new KeywordMatcher();
  return matcher.match(resumeText, keywords);
}
