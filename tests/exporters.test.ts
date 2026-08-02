import { LaTeXExporter, TypstExporter, USTechTemplate, ResumeData } from '../src';

describe('LaTeX & Typst Exporters', () => {
  const sampleResume: ResumeData = {
    personalDetails: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1 555-0199',
      location: 'San Francisco, CA',
      linkedIn: 'https://linkedin.com/in/janedoe',
      gitHub: 'https://github.com/janedoe'
    },
    summary: 'Experienced Software Engineer specializing in distributed systems and AI.',
    skills: ['TypeScript', 'Node.js', 'React', 'Python', 'WebRTC'],
    workExperience: [
      {
        role: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'San Francisco, CA',
        startDate: '2022',
        endDate: 'Present',
        highlights: [
          'Architected high-throughput data processing pipeline handling 10M+ events/day.',
          'Led team of 5 engineers to launch AI-assisted code optimization engine.'
        ]
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        institution: 'Stanford University',
        graduationYear: '2020'
      }
    ]
  };

  test('should generate valid LaTeX resume string', () => {
    const latex = LaTeXExporter.exportToLaTeX(sampleResume);
    expect(latex).toContain('\\documentclass');
    expect(latex).toContain('Jane Doe');
    expect(latex).toContain('Tech Corp');
    expect(latex).toContain('\\end{document}');
  });

  test('should generate valid Typst resume string', () => {
    const typst = TypstExporter.exportToTypst(sampleResume);
    expect(typst).toContain('#set page(');
    expect(typst).toContain('Jane Doe');
    expect(typst).toContain('Senior Software Engineer');
  });

  test('should render US Tech Template markdown', () => {
    const md = USTechTemplate.renderMarkdown(sampleResume);
    expect(md).toContain('# Jane Doe');
    expect(md).toContain('## TECHNICAL SKILLS');
    expect(md).toContain('## PROFESSIONAL EXPERIENCE');
  });
});
