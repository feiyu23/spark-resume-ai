/**
 * Australian Industry-Specific Resume Templates
 * Tailored for local market requirements and visa considerations
 */

export interface ResumeTemplate {
  id: string
  name: string
  industry: string
  description: string
  sections: TemplateSection[]
  keywords: string[]
  visaOptimized: boolean
  atsScore: number
}

export interface TemplateSection {
  title: string
  order: number
  required: boolean
  content?: string
  placeholder?: string
  tips?: string[]
}

// Australian Resume Templates
export const AUSTRALIAN_TEMPLATES: ResumeTemplate[] = [
  {
    id: 'tech-sydney',
    name: 'Tech Professional - Sydney/Melbourne',
    industry: 'Technology',
    description: 'Optimized for Australian tech companies and startups',
    visaOptimized: true,
    atsScore: 95,
    sections: [
      {
        title: 'PROFESSIONAL SUMMARY',
        order: 1,
        required: true,
        placeholder: 'Results-driven Software Engineer with [X] years of experience in [technologies]. Australian Permanent Resident with full work rights.',
        tips: [
          'Mention visa status upfront if favorable',
          'Include years of Australian experience',
          'Highlight tech stack relevant to AU market (AWS, .NET, React)'
        ]
      },
      {
        title: 'CORE TECHNICAL SKILLS',
        order: 2,
        required: true,
        content: `Programming: Python, JavaScript, TypeScript, Java
Frameworks: React, Node.js, Django, Spring Boot
Cloud: AWS (Sydney region), Azure, Google Cloud
Databases: PostgreSQL, MongoDB, DynamoDB
DevOps: Docker, Kubernetes, CI/CD, Jenkins
Agile: Scrum, Kanban, JIRA, Confluence`,
        tips: [
          'List AWS Sydney region experience',
          'Include Australian compliance knowledge (Privacy Act, CDR)',
          'Mention NBN or Australian infrastructure experience'
        ]
      },
      {
        title: 'PROFESSIONAL EXPERIENCE',
        order: 3,
        required: true,
        placeholder: `Senior Software Engineer | Company Name | Sydney, NSW
Month Year - Present

• Led development of microservices architecture serving 100K+ Australian users
• Reduced infrastructure costs by 40% using AWS Sydney region optimization
• Mentored team of 5 engineers in Agile best practices
• Integrated with Australian payment gateways (Afterpay, BPAY)`,
        tips: [
          'Use Australian date format (DD/MM/YYYY)',
          'Include city and state abbreviation',
          'Highlight Australian client projects',
          'Mention work with Australian regulations'
        ]
      },
      {
        title: 'EDUCATION',
        order: 4,
        required: true,
        placeholder: `Bachelor of Computer Science
University of Sydney | Sydney, NSW
Graduated: 2020

• Relevant Coursework: Data Structures, Algorithms, Cloud Computing
• GPA: 6.5/7.0 (Distinction Average)`,
        tips: [
          'Use Australian GPA scale (HD/D/C/P)',
          'Include Australian university if applicable',
          'Mention any Australian certifications'
        ]
      },
      {
        title: 'AUSTRALIAN WORK AUTHORIZATION',
        order: 5,
        required: false,
        content: '✓ Australian Permanent Resident - Full work rights, no sponsorship required',
        tips: [
          'Clear statement about visa status',
          'Reduces employer concerns about sponsorship'
        ]
      }
    ],
    keywords: ['Sydney', 'Melbourne', 'AWS', 'React', 'Python', 'Agile', 'PR', 'work rights', 'Australian experience']
  },

  {
    id: 'mining-fifo',
    name: 'Mining Engineer - FIFO',
    industry: 'Mining & Resources',
    description: 'Designed for FIFO/DIDO roles in Australian mining sector',
    visaOptimized: true,
    atsScore: 92,
    sections: [
      {
        title: 'PROFESSIONAL SUMMARY',
        order: 1,
        required: true,
        placeholder: 'Experienced Mining Engineer with [X] years in Australian open-pit and underground operations. Current FIFO availability with medical clearance and site-ready certifications.',
        tips: [
          'Mention FIFO/DIDO availability upfront',
          'Include years of Australian mining experience',
          'Highlight specific commodities (iron ore, coal, gold)'
        ]
      },
      {
        title: 'LICENSES & CERTIFICATIONS',
        order: 2,
        required: true,
        content: `• Queensland Mining Safety Induction (S11)
• Western Australia Mining Induction (MARCSTA)
• Working at Heights (RIIWHS204D)
• Confined Spaces (RIIWHS202D)
• First Aid & CPR (HLTAID011)
• HR License
• Coal Board Medical - Current`,
        tips: [
          'List state-specific mining tickets',
          'Include expiry dates if current',
          'Highlight site-specific inductions'
        ]
      },
      {
        title: 'TECHNICAL COMPETENCIES',
        order: 3,
        required: true,
        content: `Mine Planning: Surpac, Vulcan, MineSight, Deswik
Scheduling: Primavera P6, MS Project
Geotechnical: Rocscience Suite, FLAC3D
Equipment: CAT, Komatsu, Liebherr fleet management
Safety: ICAM investigations, Risk assessments, JSAs`,
        tips: [
          'Include software specific to Australian mines',
          'Mention equipment brands common in Australia',
          'Highlight safety management systems'
        ]
      },
      {
        title: 'PROFESSIONAL EXPERIENCE',
        order: 4,
        required: true,
        placeholder: `Senior Mining Engineer | BHP Iron Ore | Port Hedland, WA
FIFO Roster: 2/1 | January 2020 - Present

• Managed short-term mine planning for 35Mtpa operation
• Reduced drilling costs by 25% through blast optimization
• Led team of 8 engineers and 20 operators
• Achieved zero LTIs over 18-month period`,
        tips: [
          'Include roster pattern (2/1, 8/6, etc.)',
          'Specify mine location and commodity',
          'Highlight safety achievements (LTIs, TRIFRs)',
          'Use Australian mining terminology'
        ]
      }
    ],
    keywords: ['FIFO', 'DIDO', 'mining', 'BHP', 'Rio Tinto', 'Port Hedland', 'Pilbara', 'safety', 'open pit', 'underground']
  },

  {
    id: 'healthcare-nurse',
    name: 'Registered Nurse - Healthcare',
    industry: 'Healthcare',
    description: 'For nurses seeking roles in Australian hospitals and aged care',
    visaOptimized: true,
    atsScore: 93,
    sections: [
      {
        title: 'PROFESSIONAL SUMMARY',
        order: 1,
        required: true,
        placeholder: 'Compassionate Registered Nurse with [X] years in Australian healthcare settings. Current AHPRA registration with experience in public hospitals and aged care facilities.',
        tips: [
          'Lead with AHPRA registration status',
          'Mention specific Australian healthcare experience',
          'Include specializations (ED, ICU, aged care)'
        ]
      },
      {
        title: 'REGISTRATION & CREDENTIALS',
        order: 2,
        required: true,
        content: `• AHPRA Registration: RN0000000 (Current until 05/2025)
• Working with Children Check: NSW00000000
• Police Check: Current (2024)
• Immunization: Up to date including COVID-19
• CPR Certification: Current`,
        tips: [
          'Include AHPRA number',
          'List state-specific requirements',
          'Mention NDIS worker screening if applicable'
        ]
      },
      {
        title: 'CLINICAL COMPETENCIES',
        order: 3,
        required: true,
        content: `Clinical Skills: IV cannulation, medication administration, wound care
Specialties: Emergency, Medical/Surgical, Aged Care, Palliative
Systems: Cerner, EPIC, Best Practice, MedChart
Standards: NSQHS, Aged Care Quality Standards
Languages: English (Native), Mandarin (Professional)`,
        tips: [
          'Include Australian healthcare systems',
          'Mention NSQHS standards knowledge',
          'List additional languages (valuable in multicultural Australia)'
        ]
      }
    ],
    keywords: ['AHPRA', 'registered nurse', 'RN', 'healthcare', 'hospital', 'aged care', 'NDIS', 'Sydney', 'Melbourne']
  },

  {
    id: 'finance-accounting',
    name: 'Accountant - Finance Professional',
    industry: 'Finance & Accounting',
    description: 'For CPA/CA qualified professionals in Australian finance sector',
    visaOptimized: true,
    atsScore: 91,
    sections: [
      {
        title: 'PROFESSIONAL SUMMARY',
        order: 1,
        required: true,
        placeholder: 'CPA-qualified Accountant with [X] years in Australian taxation and compliance. Expertise in GST, FBT, and superannuation legislation.',
        tips: [
          'Mention CPA/CA qualification status',
          'Highlight Australian tax knowledge',
          'Include Big 4 experience if applicable'
        ]
      },
      {
        title: 'QUALIFICATIONS & MEMBERSHIPS',
        order: 2,
        required: true,
        content: `• CPA Australia - Full Member (2020)
• Bachelor of Commerce (Accounting) - University of Melbourne
• Registered Tax Agent - TPB No: 00000000
• ASIC Agent - Current`,
        tips: [
          'Include professional body membership numbers',
          'List Tax Agent registration',
          'Mention SMSF qualifications if applicable'
        ]
      },
      {
        title: 'TECHNICAL EXPERTISE',
        order: 3,
        required: true,
        content: `Software: Xero, MYOB, QuickBooks, SAP
Taxation: GST, FBT, Income Tax, International Tax
Compliance: ATO reporting, ASIC lodgements, STP
Financial: Financial statements, Budgeting, Cashflow
Audit: Internal controls, Risk assessment, SOX`,
        tips: [
          'List Australian accounting software',
          'Include ATO and ASIC experience',
          'Mention Single Touch Payroll (STP)'
        ]
      }
    ],
    keywords: ['CPA', 'CA', 'accountant', 'GST', 'tax', 'ATO', 'ASIC', 'superannuation', 'SMSF', 'Xero', 'MYOB']
  },

  {
    id: 'construction-trades',
    name: 'Construction - Trades Professional',
    industry: 'Construction',
    description: 'For tradies and construction workers in Australian building industry',
    visaOptimized: false,
    atsScore: 88,
    sections: [
      {
        title: 'PROFESSIONAL SUMMARY',
        order: 1,
        required: true,
        placeholder: 'Licensed Carpenter with [X] years on Australian commercial and residential projects. White Card holder with extensive high-rise experience.',
        tips: [
          'Mention specific trade license',
          'Include White Card status',
          'Highlight project types (commercial, residential, infrastructure)'
        ]
      },
      {
        title: 'LICENSES & TICKETS',
        order: 2,
        required: true,
        content: `• White Card - NSW000000
• Carpenter License - NSW Building License 000000
• Working at Heights - Current
• Elevated Work Platform (EWP) - Current
• Forklift License (LF) - Current
• Asbestos Awareness - Current`,
        tips: [
          'List all construction tickets',
          'Include license numbers',
          'Mention state-specific requirements'
        ]
      }
    ],
    keywords: ['White Card', 'construction', 'builder', 'carpenter', 'electrician', 'plumber', 'Sydney', 'Melbourne', 'Brisbane']
  },

  {
    id: 'education-teacher',
    name: 'Teacher - Education Professional',
    industry: 'Education',
    description: 'For teachers in Australian schools (primary/secondary)',
    visaOptimized: true,
    atsScore: 90,
    sections: [
      {
        title: 'PROFESSIONAL SUMMARY',
        order: 1,
        required: true,
        placeholder: 'Passionate Secondary Mathematics Teacher with [X] years in NSW public schools. Full registration with NESA and proven HSC results.',
        tips: [
          'Mention state registration (NESA, VIT, QCT)',
          'Include subject areas and year levels',
          'Highlight NAPLAN/HSC/VCE experience'
        ]
      },
      {
        title: 'REGISTRATION & ACCREDITATION',
        order: 2,
        required: true,
        content: `• NESA Registration: Full Registration (000000)
• Working with Children Check: NSW00000000
• First Aid & CPR: Current
• Anaphylaxis Training: Current
• Child Protection Training: Completed 2024`,
        tips: [
          'Include teacher registration number',
          'List mandatory training',
          'Mention additional accreditations'
        ]
      }
    ],
    keywords: ['teacher', 'NESA', 'VIT', 'education', 'school', 'HSC', 'VCE', 'NAPLAN', 'curriculum', 'classroom']
  }
]

// Template selector function
export function getTemplateByIndustry(industry: string): ResumeTemplate | undefined {
  return AUSTRALIAN_TEMPLATES.find(t => 
    t.industry.toLowerCase() === industry.toLowerCase()
  )
}

// Get all unique industries
export function getAvailableIndustries(): string[] {
  return [...new Set(AUSTRALIAN_TEMPLATES.map(t => t.industry))]
}

// Generate resume from template
export function generateFromTemplate(template: ResumeTemplate, userData?: any): string {
  let resume = ''
  
  // Add user name and contact if provided
  if (userData?.name) {
    resume += `${userData.name}\n`
    if (userData.email) resume += `${userData.email} | `
    if (userData.phone) resume += `${userData.phone} | `
    if (userData.location) resume += `${userData.location}`
    resume += '\n\n'
  }

  // Add sections in order
  const sortedSections = [...template.sections].sort((a, b) => a.order - b.order)
  
  for (const section of sortedSections) {
    resume += `${section.title}\n`
    resume += '='.repeat(section.title.length) + '\n\n'
    
    if (section.content) {
      resume += section.content + '\n\n'
    } else if (section.placeholder) {
      resume += section.placeholder + '\n\n'
    }
  }

  return resume
}

// Export template as JSON for customization
export function exportTemplate(template: ResumeTemplate): string {
  return JSON.stringify(template, null, 2)
}