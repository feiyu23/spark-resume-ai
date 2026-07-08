import { KeywordMatchResult } from './keyword-matcher';
import { SAMPLE_KEYWORDS } from '../data/sample-keywords';

export interface SkillGap {
  categoryName: string;
  missingSkills: string[];
  recommendation: string;
}

export interface GapAnalysisReport {
  gaps: SkillGap[];
  overallRecommendation: string;
}

/**
 * Skill Gap & Upskill Planning
 * 
 * Takes the missing keywords from the ATS scoring step, groups them by technical category,
 * and generates a structured gap report with actionable upskill recommendations.
 */
export class GapAnalyzer {
  /**
   * Analyzes missing keywords and groups them by category with actionable recommendations
   */
  public analyze(matchResult: KeywordMatchResult): GapAnalysisReport {
    const missing = matchResult.missing;
    if (!missing || missing.length === 0) {
      return {
        gaps: [],
        overallRecommendation: 'Your resume is highly optimized and covers all key requirements!'
      };
    }

    const gapsByCategory: Record<string, string[]> = {};
    const unmapped: string[] = [];

    // Map missing skills to categories
    for (const skill of missing) {
      let found = false;
      for (const category of Object.values(SAMPLE_KEYWORDS)) {
        if (category.keywords.some(k => k.toLowerCase() === skill.toLowerCase())) {
          if (!gapsByCategory[category.name]) {
            gapsByCategory[category.name] = [];
          }
          gapsByCategory[category.name].push(skill);
          found = true;
          break;
        }
      }
      if (!found) {
        unmapped.push(skill);
      }
    }

    const gaps: SkillGap[] = [];

    for (const [categoryName, missingSkills] of Object.entries(gapsByCategory)) {
      gaps.push({
        categoryName,
        missingSkills,
        recommendation: this.getRecommendationForCategory(categoryName, missingSkills)
      });
    }

    if (unmapped.length > 0) {
      gaps.push({
        categoryName: 'Domain Specific / Other',
        missingSkills: unmapped,
        recommendation: 'These appear to be specialized requirements. Consider finding online courses or adding related projects to your portfolio.'
      });
    }

    // Generate overall recommendation based on dominant gaps
    let overallRecommendation = 'Focus on integrating the missing keywords into your past experience bullet points where applicable.';
    if (gaps.length > 2) {
      overallRecommendation = `You have gaps across multiple areas (${gaps.slice(0, 3).map(g => g.categoryName).join(', ')}). Prioritize the technical or domain-specific skills most critical to the role.`;
    }

    return {
      gaps,
      overallRecommendation
    };
  }

  private getRecommendationForCategory(categoryName: string, skills: string[]): string {
    switch (categoryName) {
      case 'Technology & IT':
        return `Consider taking technical certifications or building a portfolio project demonstrating your use of ${skills.slice(0, 3).join(', ')}.`;
      case 'Business & Management':
        return `Highlight cross-functional collaboration and leadership experiences. Use STAR (Situation, Task, Action, Result) method to emphasize ${skills.slice(0, 3).join(', ')}.`;
      case 'Australian Workplace':
        return `It is critical for the AU market to show compliance and local knowledge. Ensure your working rights and familiarity with ${skills.slice(0, 3).join(', ')} are clearly stated.`;
      case 'Soft Skills':
        return `Soft skills are best shown, not just listed. Reframe your experience bullets to demonstrate ${skills.slice(0, 3).join(', ')} in action.`;
      default:
        return `Look for targeted training or highlight overlapping transferrable skills for: ${skills.slice(0, 3).join(', ')}.`;
    }
  }
}
