import { CosineSimilarity } from './cosine-similarity';

export interface TailoredBullet {
  originalText: string;
  cleanText: string;
  score: number;
}

export interface TailorOptions {
  /** Maximum number of bullets to retain */
  maxBullets?: number;
  /** Minimum cosine similarity score (0 to 1) to be considered relevant */
  minScoreThreshold?: number;
}

/**
 * Relevance-weighted CV Tailoring
 * 
 * Takes a "Master Resume" and filters its content down to the most relevant
 * bullet points for a given Job Description.
 */
export class ResumeTailor {
  private similarityCalculator: CosineSimilarity;

  constructor() {
    this.similarityCalculator = new CosineSimilarity();
  }

  /**
   * Parses the master resume into bullet points and scores each against the job description.
   * Returns a sorted list of the most relevant bullet points.
   */
  public tailor(masterResumeText: string, jobDescription: string, options: TailorOptions = {}): TailoredBullet[] {
    const { maxBullets = 15, minScoreThreshold = 0.05 } = options;

    // Split text into lines/bullets
    const rawLines = masterResumeText.split(/\n/);
    
    const candidates: { originalText: string; cleanText: string }[] = [];
    
    for (const line of rawLines) {
      if (!line.trim()) continue;

      // Clean up common bullet point characters for scoring, but keep original for display
      let cleaned = line.trim();
      cleaned = cleaned.replace(/^[•·\-\*]\s*/, '').trim();
      
      // Only consider lines with substantial text (e.g., > 3 words) as tailor-able bullets
      // Very short lines are likely headers (e.g. "Work Experience") which shouldn't be scored this way
      if (cleaned.split(/\s+/).length > 3) {
        candidates.push({
          originalText: line,
          cleanText: cleaned
        });
      }
    }

    const scoredBullets: TailoredBullet[] = candidates.map(candidate => {
      const result = this.similarityCalculator.calculate(candidate.cleanText, jobDescription);
      return {
        originalText: candidate.originalText,
        cleanText: candidate.cleanText,
        score: result.score
      };
    });

    // Sort by descending score
    scoredBullets.sort((a, b) => b.score - a.score);

    // Filter by threshold and limit
    return scoredBullets
      .filter(b => b.score >= minScoreThreshold)
      .slice(0, maxBullets);
  }
}
