import { CosineSimilarity, calculateSimilarity } from '../src/scoring/cosine-similarity';

describe('CosineSimilarity', () => {
  let similarity: CosineSimilarity;

  beforeEach(() => {
    similarity = new CosineSimilarity();
  });

  describe('calculate', () => {
    it('should calculate correct cosine similarity between identical texts', () => {
      const text = 'Senior TypeScript developer with AWS experience';
      const result = similarity.calculate(text, text);

      expect(result.score).toBeCloseTo(1.0, 5);
      expect(result.percentageScore).toBe(100);
      expect(result.topMatchingTerms).toContain('typescript');
      expect(result.topMatchingTerms).toContain('developer');
      expect(result.topMatchingTerms).toContain('aws');
    });

    it('should calculate similarity between partially matching texts', () => {
      const text1 = 'React developer with Node.js and SQL skills';
      const text2 = 'Looking for a React developer with SQL and AWS experience';
      const result = similarity.calculate(text1, text2);

      expect(result.score).toBeGreaterThan(0);
      expect(result.score).toBeLessThan(1);
      expect(result.topMatchingTerms).toContain('react');
      expect(result.topMatchingTerms).toContain('developer');
      expect(result.topMatchingTerms).toContain('sql');
      expect(result.topMatchingTerms).not.toContain('aws');
      expect(result.topMatchingTerms).not.toContain('node.js');
    });

    it('should return 0 similarity for completely disjoint texts', () => {
      const text1 = 'apple banana orange';
      const text2 = 'elephant giraffe zebra';
      const result = similarity.calculate(text1, text2);

      expect(result.score).toBe(0);
      expect(result.percentageScore).toBe(0);
      expect(result.topMatchingTerms).toHaveLength(0);
    });

    it('should handle empty or whitespace-only inputs gracefully without causing NaN (division-by-zero)', () => {
      const result1 = similarity.calculate('', 'react developer');
      expect(result1.score).toBe(0);
      expect(result1.percentageScore).toBe(0);

      const result2 = similarity.calculate('  ', '   ');
      expect(result2.score).toBe(0);
      expect(result2.percentageScore).toBe(0);

      const result3 = similarity.calculate('the of and was', 'for a in but'); // only stop words
      expect(result3.score).toBe(0);
      expect(result3.percentageScore).toBe(0);
    });

    it('should correctly preserve and tokenize specific short tech words (Go, C, C++, C#, .NET)', () => {
      const text = 'Experienced in Go, C, C++, C#, .NET, Java, and python';
      const result = similarity.calculate(text, text);

      expect(result.topMatchingTerms).toContain('go');
      expect(result.topMatchingTerms).toContain('c');
      expect(result.topMatchingTerms).toContain('c++');
      expect(result.topMatchingTerms).toContain('c#');
      expect(result.topMatchingTerms).toContain('.net');
      expect(result.topMatchingTerms).toContain('java');
      expect(result.topMatchingTerms).toContain('python');
    });

    it('should strip trailing/leading punctuation except for special tech words', () => {
      const text1 = 'experience in node.js.';
      const text2 = 'experience in node.js';
      const result = similarity.calculate(text1, text2);

      expect(result.score).toBeCloseTo(1.0, 5);
      expect(result.topMatchingTerms).toContain('node.js');
    });
  });

  describe('calculateSimilarity helper', () => {
    it('should calculate similarity successfully', () => {
      const result = calculateSimilarity('React Developer', 'React Developer');
      expect(result.percentageScore).toBe(100);
    });
  });
});
