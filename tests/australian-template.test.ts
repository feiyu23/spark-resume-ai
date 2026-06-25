import { AustralianTemplate, ResumeData } from '../src/templates/australian-template';

describe('AustralianTemplate', () => {
  let template: AustralianTemplate;

  beforeEach(() => {
    template = new AustralianTemplate();
  });

  describe('format', () => {
    it('should generate a standard Australian Markdown resume', () => {
      const data: ResumeData = {
        personalDetails: {
          name: 'Jane Smith',
          email: 'jane.smith@example.com.au',
          phone: '0412 345 678',
          location: 'Melbourne, VIC',
          linkedIn: 'linkedin.com/in/janesmith',
          gitHub: 'github.com/janesmith',
          workingRights: 'Permanent Resident'
        },
        summary: 'A highly motivated software engineer with experience building web applications.',
        skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'WHS'],
        workExperience: [
          {
            company: 'Tech Solutions Pty Ltd',
            role: 'Software Engineer',
            startDate: 'Mar 2021',
            endDate: 'Present',
            location: 'Melbourne',
            highlights: [
              'Developed core React features for main product.',
              'Collaborated on cloud architecture transition.'
            ]
          }
        ],
        education: [
          {
            institution: 'Monash University',
            degree: 'Bachelor of Software Engineering',
            graduationYear: '2020',
            location: 'Clayton'
          }
        ],
        certifications: [
          {
            name: 'AWS Certified Cloud Practitioner',
            issuer: 'Amazon Web Services',
            year: '2022'
          }
        ]
      };

      const result = template.format(data);

      // Section titles check
      expect(result).toContain('# JANE SMITH');
      expect(result).toContain('jane.smith@example.com.au  |  0412 345 678  |  Melbourne, VIC  |  Work Status: Permanent Resident');
      expect(result).toContain('LinkedIn: linkedin.com/in/janesmith  |  GitHub: github.com/janesmith');
      expect(result).toContain('## PROFESSIONAL SUMMARY');
      expect(result).toContain('A highly motivated software engineer with experience building web applications.');
      expect(result).toContain('## KEY SKILLS');
      expect(result).toContain('* JavaScript');
      expect(result).toContain('* WHS');
      expect(result).toContain('## PROFESSIONAL EXPERIENCE');
      expect(result).toContain('### Software Engineer | Tech Solutions Pty Ltd');
      expect(result).toContain('*Mar 2021 – Present | Melbourne*');
      expect(result).toContain('* Developed core React features for main product.');
      expect(result).toContain('## EDUCATION');
      expect(result).toContain('### Bachelor of Software Engineering');
      expect(result).toContain('*Monash University (2020) | Clayton*');
      expect(result).toContain('## CERTIFICATIONS');
      expect(result).toContain('* **AWS Certified Cloud Practitioner** – Amazon Web Services (2022)');
    });

    it('should generate resume without optional parameters', () => {
      const data: ResumeData = {
        personalDetails: {
          name: 'Bob Builder',
          email: 'bob@builder.com',
          phone: '0400 000 000',
          location: 'Brisbane, QLD'
        },
        summary: 'Contractor with 10 years experience.',
        skills: ['Building', 'Plumbing'],
        workExperience: [
          {
            company: 'Builders R Us',
            role: 'Lead Contractor',
            startDate: '2015',
            endDate: '2020',
            highlights: ['Built houses.']
          }
        ],
        education: [
          {
            institution: 'TAFE QLD',
            degree: 'Certificate IV in Building',
            graduationYear: '2014'
          }
        ]
      };

      const result = template.format(data);

      expect(result).toContain('# BOB BUILDER');
      expect(result).toContain('bob@builder.com  |  0400 000 000  |  Brisbane, QLD');
      expect(result).not.toContain('Work Status');
      expect(result).not.toContain('LinkedIn');
      expect(result).not.toContain('## CERTIFICATIONS');
    });
  });
});
