import { ATSScorer, scoreResume, quickScore } from '../src/scoring/ats-basic';

describe('ATSScorer', () => {
  let scorer: ATSScorer;

  beforeEach(() => {
    scorer = new ATSScorer();
  });

  describe('score', () => {
    it('should return a full score object with valid inputs', () => {
      const resume = `
        JOHN DOE
        Email: john.doe@email.com | Phone: 0412345678 | Location: Sydney, NSW
        
        PROFESSIONAL SUMMARY
        Experienced JavaScript Developer with extensive experience in React, Node.js, and AWS cloud solutions. Proven track record of designing, building, and implementing scalable software applications in agile environments. Strongly motivated to achieve business goals and collaborate with cross-functional teams to deliver premium user experiences and robust backend architectures.
        
        KEY SKILLS
        * JavaScript
        * React
        * Node.js
        * AWS
        * TypeScript
        * Git
        * Scrum
        * CI/CD
        
        PROFESSIONAL EXPERIENCE
        Senior Developer | Tech Corp (Jan 2020 - Present) | Sydney, NSW
        * Led development of React web application which increased customer acquisition by 45 percent over a six-month period.
        * Managed deployment on AWS cloud infrastructure utilizing ECS, Lambda, and S3 to achieve 99.99 percent uptime.
        * Created REST APIs using Node.js and Express to handle large throughput, serving over 10,000 active users per hour.
        * Developed automated CI/CD pipelines using GitHub Actions to reduce deployment times by 50 percent.
        * Collaborated with product designers to implement responsive, pixel-perfect user interfaces with modern CSS.
        * Mentored junior developers, conducting code reviews and fostering a culture of continuous learning.
        * Managed budgets and stakeholder relationships to align tech stack decisions with long-term strategy.
        * Improved processes through automation and change management.
        
        Software Engineer | Innovation Labs (Jun 2018 - Dec 2019) | Sydney, NSW
        * Created new features for customer portal using Angular and PostgreSQL database.
        * Improved system performance by optimizing database queries and caching strategies.
        * Participated in daily standups and sprint planning as part of an Agile Scrum team.
        * Designed user-friendly dashboards for analytics reporting.
        * Worked closely with QA engineers to write comprehensive unit and integration tests.
        
        EDUCATION
        Bachelor of Computer Science | University of Sydney (2015 - 2018)
        * Graduated with First Class Honours.
        * Major in Software Engineering.
      `;

      const jd = `
        We are seeking a Senior JavaScript Developer with extensive experience in React, Node.js, and AWS cloud environments. 
        The ideal candidate will have strong skills in TypeScript, Git, Scrum methodologies, and building CI/CD pipelines. 
        You will lead web application development, design REST APIs, optimize databases, and work closely with QA teams.
      `;

      const result = scorer.score(resume, jd);

      expect(result.overall).toBeGreaterThan(50);
      expect(result.breakdown.keywordMatch).toBeGreaterThan(50);
      expect(result.breakdown.formatScore).toBe(100); // Has all sections, contact details, bullets, action verbs
      expect(result.breakdown.semanticSimilarity).toBeGreaterThan(30);
      
      // Ensure there are no critical format or keyword issues
      const criticalOrFormatIssues = result.issues.filter(i => i.severity === 'critical' || i.category === 'format');
      expect(criticalOrFormatIssues).toHaveLength(0);
    });

    it('should flag format issues (short length, missing sections, no bullets)', () => {
      const resumeText = 'Just some short text here with nothing useful and no contact details.';
      const jd = 'Looking for a developer';

      const result = scorer.score(resumeText, jd);

      expect(result.breakdown.formatScore).toBeLessThan(50);
      
      const messages = result.issues.map(i => i.message);
      expect(messages).toContain('Resume is too short (less than 300 words)');
      expect(messages).toContain('No contact information found');
      expect(messages).toContain('No work experience section found');
      expect(messages).toContain('No education section found');
      expect(messages).toContain('No skills section found');
    });

    it('should flag sensitive personal details (bias risk)', () => {
      const resume = `
        JOHN DOE
        Email: john@doe.com | Phone: 0412345678
        Date of Birth: 15/08/1990
        Gender: Male
        Marital Status: Single
        Work Experience: Developer from 2020 to 2023.
        Education: Monash University.
        Skills: Coding.
      `;
      const result = scorer.score(resume, 'React developer');
      const messages = result.issues.map(i => i.message);
      
      expect(messages).toContain('Resume contains sensitive personal information (date of birth/age)');
      expect(messages).toContain('Resume contains sensitive personal information (marital status)');
      expect(messages).toContain('Resume contains sensitive personal information (gender/sex)');
    });

    it('should flag placeholder template markers', () => {
      const resume = `
        [Your Name]
        Email: your-email@example.com | Phone: 0400 000 000
        Work Experience: Developer at [Company Name] from 2020 to 2023.
        Education: [Insert University].
        Skills: Coding.
      `;
      const result = scorer.score(resume, 'React developer');
      const messages = result.issues.map(i => i.message);
      
      expect(messages).toContain('Resume contains placeholder text (placeholder email)');
      expect(messages).toContain('Resume contains placeholder text (placeholder phone)');
      expect(messages).toContain('Resume contains placeholder text (bracketed placeholder)');
    });

    it('should flag chronological order issues', () => {
      const resume = `
        JOHN DOE
        Email: john@doe.com | Phone: 0412345678
        
        PROFESSIONAL EXPERIENCE
        Junior Developer | Tech Corp (Jan 2015 - Dec 2018)
        * Coding.
        
        Senior Developer | Tech Corp (Jan 2020 - Present)
        * Leadership.
        
        EDUCATION
        Bachelor of CS (2014)
        Skills: JS.
      `;
      const result = scorer.score(resume, 'React developer');
      const messages = result.issues.map(i => i.message);
      
      expect(messages).toContain('Work experience is not in reverse chronological order');
    });
  });

  describe('quickScore', () => {
    it('should score without a job description using sample keywords', () => {
      const resume = `
        Jane Doe
        Email: jane@doe.com | Phone: 0412345678
        Work Experience: React, JavaScript, Agile, Scrum, DevOps, Git.
        Education: Bachelor of IT.
        Skills: Teamwork, Problem Solving, Communication.
      `;
      const result = scorer.quickScore(resume);
      expect(result.overall).toBeGreaterThan(0);
      expect(result.keywords.found.length).toBeGreaterThan(0);
    });
  });

  describe('helpers', () => {
    it('should score via scoreResume helper', () => {
      const result = scoreResume('React Developer, Email: r@r.com, Work Experience', 'React Developer');
      expect(result.overall).toBeDefined();
    });

    it('should score via quickScore helper', () => {
      const result = quickScore('React Developer, Email: r@r.com, Work Experience');
      expect(result.overall).toBeDefined();
    });
  });
});
