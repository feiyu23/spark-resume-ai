/**
 * Cosine Similarity Calculator
 * Measures semantic similarity between resume and job description
 * Uses TF-IDF (Term Frequency-Inverse Document Frequency) weighting
 */

export interface SimilarityResult {
  score: number;              // 0-1 cosine similarity score
  percentageScore: number;    // 0-100 percentage
  topMatchingTerms: string[]; // Top terms that match
}

export class CosineSimilarity {
  /**
   * Calculate cosine similarity between two texts
   */
  calculate(text1: string, text2: string): SimilarityResult {
    // Tokenize and get term frequencies
    const tokens1 = this.tokenize(text1);
    const tokens2 = this.tokenize(text2);

    // Build vocabulary (unique terms from both documents)
    const vocabulary = new Set([...tokens1, ...tokens2]);

    // Calculate TF-IDF vectors
    const vector1 = this.buildVector(tokens1, vocabulary);
    const vector2 = this.buildVector(tokens2, vocabulary);

    // Calculate cosine similarity
    const dotProduct = this.dotProduct(vector1, vector2);
    const magnitude1 = this.magnitude(vector1);
    const magnitude2 = this.magnitude(vector2);

    const score = magnitude1 * magnitude2 === 0
      ? 0
      : dotProduct / (magnitude1 * magnitude2);

    // Find top matching terms
    const topMatchingTerms = this.getTopMatchingTerms(vector1, vector2, Array.from(vocabulary), 10);

    return {
      score,
      percentageScore: Math.round(score * 100),
      topMatchingTerms
    };
  }

  /**
   * Tokenize text into normalized terms
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2) // Remove very short words
      .filter(token => !this.isStopWord(token));
  }

  /**
   * Build term frequency vector
   */
  private buildVector(tokens: string[], vocabulary: Set<string>): Map<string, number> {
    const vector = new Map<string, number>();
    const termFrequency = new Map<string, number>();

    // Count term frequencies
    tokens.forEach(token => {
      termFrequency.set(token, (termFrequency.get(token) || 0) + 1);
    });

    // Normalize by document length (TF)
    const totalTerms = tokens.length;
    vocabulary.forEach(term => {
      const tf = (termFrequency.get(term) || 0) / totalTerms;
      vector.set(term, tf);
    });

    return vector;
  }

  /**
   * Calculate dot product of two vectors
   */
  private dotProduct(vector1: Map<string, number>, vector2: Map<string, number>): number {
    let product = 0;
    vector1.forEach((value, term) => {
      product += value * (vector2.get(term) || 0);
    });
    return product;
  }

  /**
   * Calculate magnitude of a vector
   */
  private magnitude(vector: Map<string, number>): number {
    let sum = 0;
    vector.forEach(value => {
      sum += value * value;
    });
    return Math.sqrt(sum);
  }

  /**
   * Get top matching terms between two vectors
   */
  private getTopMatchingTerms(
    vector1: Map<string, number>,
    vector2: Map<string, number>,
    vocabulary: string[],
    topN: number
  ): string[] {
    const termScores: Array<{ term: string; score: number }> = [];

    vocabulary.forEach(term => {
      const score1 = vector1.get(term) || 0;
      const score2 = vector2.get(term) || 0;
      const combinedScore = score1 * score2; // Higher if term is important in both

      if (combinedScore > 0) {
        termScores.push({ term, score: combinedScore });
      }
    });

    return termScores
      .sort((a, b) => b.score - a.score)
      .slice(0, topN)
      .map(item => item.term);
  }

  /**
   * Check if word is a stop word (common words to ignore)
   */
  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all',
      'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get',
      'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now',
      'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'got',
      'let', 'put', 'say', 'she', 'too', 'use', 'will', 'with'
    ]);
    return stopWords.has(word);
  }
}

/**
 * Quick helper function
 */
export function calculateSimilarity(text1: string, text2: string): SimilarityResult {
  const calculator = new CosineSimilarity();
  return calculator.calculate(text1, text2);
}
