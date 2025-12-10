/**
 * Resume AI Toolkit
 * Open-source AI-powered resume analysis for Australian job market
 *
 * @packageDocumentation
 */

// Export parsers
export {
  PDFParser,
  WordParser,
  TextParser,
  parseResume,
  parsePDF,
  parseWord,
  parseText,
  AutoParseResult,
  PDFParseResult,
  WordParseResult,
  TextParseResult
} from './parsers';

// Export scoring
export {
  ATSScorer,
  scoreResume,
  quickScore,
  ATSScore,
  ScoreBreakdown,
  ATSIssue,
  KeywordMatcher,
  matchKeywords,
  KeywordMatchResult,
  CosineSimilarity,
  calculateSimilarity,
  SimilarityResult
} from './scoring';

// Export data
export {
  SAMPLE_KEYWORDS,
  getAllKeywords,
  getKeywordsByCategory,
  getCategories,
  KeywordCategory
} from './data/sample-keywords';

// Package version
export const VERSION = '0.1.0';
