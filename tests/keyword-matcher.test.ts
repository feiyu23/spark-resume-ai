import { KeywordMatcher, matchKeywords } from '../src/scoring/keyword-matcher';

describe('KeywordMatcher', () => {
  let matcher: KeywordMatcher;

  beforeEach(() => {
    matcher = new KeywordMatcher();
  });

  describe('match', () => {
    it('should successfully match plain text keywords', () => {
      const resume = 'Experienced Software Engineer skilled in React, Node.js, and SQL.';
      const keywords = ['React', 'Node.js', 'SQL', 'Python'];

      const result = matcher.match(resume, keywords);
      expect(result.found).toEqual(['React', 'Node.js', 'SQL']);
      expect(result.missing).toEqual(['Python']);
      expect(result.matchScore).toBe(75);
      expect(result.totalKeywords).toBe(4);
      expect(result.foundCount).toBe(3);
      expect(result.missingCount).toBe(1);
    });

    it('should prevent false-positive substring matches (Java vs JavaScript, Go vs Google)', () => {
      const resume = 'We build JavaScript applications for Google in Java.';
      const keywords = ['Java', 'JavaScript', 'Go', 'Google'];

      const result = matcher.match(resume, keywords);
      
      // 'Go' should not match 'Google'
      expect(result.found).toContain('Java');
      expect(result.found).toContain('JavaScript');
      expect(result.found).toContain('Google');
      expect(result.found).not.toContain('Go');
      expect(result.missing).toContain('Go');
    });

    it('should match special character keywords (C++, C#, .NET)', () => {
      const resume = 'Skills include C++, C#, .NET and Web development';
      const keywords = ['C', 'C++', 'C#', '.NET', 'Java'];

      const result = matcher.match(resume, keywords);

      // 'C' should not match because 'C++' is in the resume, not standalone 'C'
      expect(result.found).toContain('C++');
      expect(result.found).toContain('C#');
      expect(result.found).toContain('.NET');
      expect(result.found).not.toContain('C');
      expect(result.found).not.toContain('Java');
    });

    it('should handle empty keywords list', () => {
      const result = matcher.match('Some text', []);
      expect(result.found).toEqual([]);
      expect(result.missing).toEqual([]);
      expect(result.matchScore).toBe(0);
    });
  });

  describe('extractKeywords', () => {
    it('should extract tech words, acronyms, and capitalized words', () => {
      const jd = 'Looking for a Senior Developer with experience in React, AWS, Node.js, and TypeScript. Experience designing databases is a plus.';
      const extracted = matcher.extractKeywords(jd);

      expect(extracted).toContain('React');
      expect(extracted).toContain('AWS');
      expect(extracted).toContain('Node.js');
      expect(extracted).toContain('TypeScript');
      expect(extracted).toContain('Developer');
      
      // Stop words / common words should be filtered
      expect(extracted).not.toContain('Looking');
      expect(extracted).not.toContain('with');
    });
  });

  describe('compareToJob', () => {
    it('should extract and match keywords against job description', () => {
      const resume = 'Experienced React developer with AWS skills.';
      const jd = 'Looking for a developer with React and AWS experience.';

      const result = matcher.compareToJob(resume, jd);
      expect(result.found).toContain('React');
      expect(result.found).toContain('AWS');
      expect(result.matchScore).toBe(100);
    });
  });

  describe('matchKeywords helper', () => {
    it('should match successfully', () => {
      const result = matchKeywords('Senior Go Developer', ['Go', 'Java']);
      expect(result.found).toEqual(['Go']);
      expect(result.missing).toEqual(['Java']);
    });
  });
});
