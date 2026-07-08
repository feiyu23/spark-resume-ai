/**
 * Resume Scoring - Export all scoring modules
 */

export {
  ATSScorer,
  scoreResume,
  quickScore,
  ATSScore,
  ScoreBreakdown,
  ATSIssue
} from './ats-basic';

export {
  KeywordMatcher,
  matchKeywords,
  KeywordMatchResult
} from './keyword-matcher';

export {
  CosineSimilarity,
  calculateSimilarity,
  SimilarityResult
} from './cosine-similarity';

export {
  ResumeTailor,
  TailoredBullet,
  TailorOptions
} from './resume-tailor';

export {
  GapAnalyzer,
  SkillGap,
  GapAnalysisReport
} from './gap-analyzer';
