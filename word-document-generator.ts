/**
 * Enhanced DOCX Document Generator
 * Creates proper Microsoft Word documents instead of HTML disguised as Word
 */

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx'

export interface WordResumeData {
  personalInfo: {
    name: string
    title?: string
    email: string
    phone: string
    location: string
    linkedin?: string
    website?: string
    summary?: string
  }
  experience: Array<{
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    achievements: string[]
  }>
  education: Array<{
    degree: string
    school: string
    location: string
    graduationDate: string
    gpa?: string
    honors?: string
  }>
  skills: {
    technical?: string[]
    professional?: string[]
    languages?: string[]
  }
  certifications?: Array<{
    name: string
    issuer: string
    date: string
  }>
  achievements?: string[]
}

/**
 * Convert text resume to structured data for DOCX generation
 */
export function parseTextToWordData(text: string): WordResumeData {
  const lines = text.split('\n').filter(line => line.trim())
  
  const resumeData: WordResumeData = {
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: ''
    },
    experience: [],
    education: [],
    skills: {}
  }
  
  // Extract personal info from first few lines
  let lineIndex = 0
  
  // Extract name (first non-empty line)
  if (lines[0]) {
    resumeData.personalInfo.name = lines[0].trim()
    lineIndex = 1
  }
  
  // Extract contact info
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
  if (emailMatch) {
    resumeData.personalInfo.email = emailMatch[0]
  }
  
  const phoneMatch = text.match(/\b(?:\+61|0)?\d{9,10}\b/) || text.match(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/)
  if (phoneMatch) {
    resumeData.personalInfo.phone = phoneMatch[0]
  }
  
  // Extract location (common Australian cities)
  const locationMatch = text.match(/(Sydney|Melbourne|Brisbane|Perth|Adelaide|Canberra|Darwin|Hobart)[\s,]*(?:NSW|VIC|QLD|WA|SA|ACT|NT|TAS)?/i)
  if (locationMatch) {
    resumeData.personalInfo.location = locationMatch[0]
  }
  
  // Extract Professional Summary
  const summaryMatch = text.match(/PROFESSIONAL SUMMARY[\s\S]*?(?=\n[A-Z\s]{3,}\n|EXPERIENCE|EDUCATION|SKILLS|$)/i)
  if (summaryMatch) {
    resumeData.personalInfo.summary = summaryMatch[0].replace(/PROFESSIONAL SUMMARY/i, '').trim()
  }
  
  // Extract Experience
  const experienceMatch = text.match(/EXPERIENCE[\s\S]*?(?=EDUCATION|SKILLS|$)/i)
  if (experienceMatch) {
    const experienceText = experienceMatch[0]
    const jobEntries = experienceText.split(/(?=\n[A-Za-z].*(?:\d{4}|\w+\s+\d{4}))/g)
    
    jobEntries.forEach((entry, index) => {
      if (index === 0 || !entry.trim()) return // Skip header
      
      const lines = entry.trim().split('\n')
      if (lines.length < 2) return
      
      const titleLine = lines[0].trim()
      const companyLine = lines[1] ? lines[1].trim() : ''
      const achievements = entry.match(/•\s*([^\n]+)/g)?.map(a => a.replace(/•\s*/, '')) || []
      
      resumeData.experience.push({
        title: titleLine.split(' –')[0] || titleLine,
        company: companyLine.split(' –')[0] || 'Company',
        location: 'Australia',
        startDate: '2020-01',
        endDate: '',
        current: true,
        achievements: achievements.length > 0 ? achievements : [
          'Delivered key business outcomes',
          'Collaborated with stakeholders',
          'Achieved performance targets'
        ]
      })
    })
  }
  
  // Extract Education
  const educationMatch = text.match(/EDUCATION[\s\S]*?(?=SKILLS|$)/i)
  if (educationMatch) {
    const educationText = educationMatch[0]
    const degreeMatches = educationText.match(/([^•\n]+(?:Bachelor|Master|Diploma|Certificate|Degree)[^•\n]*)/gi)
    
    if (degreeMatches) {
      degreeMatches.forEach(degreeText => {
        resumeData.education.push({
          degree: degreeText.trim(),
          school: 'University',
          location: 'Australia',
          graduationDate: '2020'
        })
      })
    }
  }
  
  // Extract Skills
  const skillsMatch = text.match(/(?:TECHNICAL\s+)?SKILLS[\s\S]*?$/i)
  if (skillsMatch) {
    const skillsText = skillsMatch[0]
    
    // Look for technical skills
    const techMatch = skillsText.match(/(?:Technical|BI Tools|Data Platforms|Languages\/Tools)[:\s]+([^\n]+)/gi)
    if (techMatch) {
      resumeData.skills.technical = techMatch.flatMap(match => 
        match.replace(/^[^:]+:/, '').split(/[,;]/).map(s => s.trim()).filter(s => s)
      )
    }
    
    // Look for professional skills
    const profMatch = skillsText.match(/(?:Professional|Frameworks)[:\s]+([^\n]+)/gi)
    if (profMatch) {
      resumeData.skills.professional = profMatch.flatMap(match => 
        match.replace(/^[^:]+:/, '').split(/[,;]/).map(s => s.trim()).filter(s => s)
      )
    }
  }
  
  return resumeData
}

/**
 * Generate professional DOCX document
 */
export function generateWordDocument(resumeData: WordResumeData): Document {
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1440, // 1 inch
            right: 1440,
            bottom: 1440,
            left: 1440
          }
        }
      },
      children: [
        // Header with name
        new Paragraph({
          children: [
            new TextRun({
              text: resumeData.personalInfo.name,
              bold: true,
              size: 32, // 16pt
              font: 'Arial'
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 240 // 12pt spacing after
          }
        }),
        
        // Title if available
        ...(resumeData.personalInfo.title ? [
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.personalInfo.title,
                italics: true,
                size: 24, // 12pt
                font: 'Arial'
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 240
            }
          })
        ] : []),
        
        // Contact Information
        new Paragraph({
          children: [
            new TextRun({
              text: [
                resumeData.personalInfo.email,
                resumeData.personalInfo.phone,
                resumeData.personalInfo.location,
                resumeData.personalInfo.linkedin,
                resumeData.personalInfo.website
              ].filter(Boolean).join(' | '),
              size: 20, // 10pt
              font: 'Arial'
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            after: 480 // 24pt spacing after
          }
        }),
        
        // Professional Summary
        ...(resumeData.personalInfo.summary ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL SUMMARY',
                bold: true,
                size: 22, // 11pt
                font: 'Arial'
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 240,
              after: 120
            },
            border: {
              bottom: {
                color: 'auto',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6
              }
            }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.personalInfo.summary,
                size: 20, // 10pt
                font: 'Arial'
              })
            ],
            spacing: {
              after: 240
            },
            alignment: AlignmentType.JUSTIFIED
          })
        ] : []),
        
        // Professional Experience
        ...(resumeData.experience.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'PROFESSIONAL EXPERIENCE',
                bold: true,
                size: 22, // 11pt
                font: 'Arial'
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 240,
              after: 120
            },
            border: {
              bottom: {
                color: 'auto',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6
              }
            }
          }),
          ...resumeData.experience.flatMap(job => [
            new Paragraph({
              children: [
                new TextRun({
                  text: job.title,
                  bold: true,
                  size: 20, // 10pt
                  font: 'Arial'
                })
              ],
              spacing: {
                before: 120,
                after: 60
              }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${job.company} | ${job.location} | ${job.startDate} - ${job.current ? 'Present' : job.endDate}`,
                  italics: true,
                  size: 18, // 9pt
                  font: 'Arial'
                })
              ],
              spacing: {
                after: 60
              }
            }),
            ...job.achievements.map(achievement => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${achievement}`,
                    size: 20, // 10pt
                    font: 'Arial'
                  })
                ],
                spacing: {
                  after: 60
                },
                indent: {
                  left: 360 // 0.25 inch indent
                }
              })
            )
          ])
        ] : []),
        
        // Education
        ...(resumeData.education.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'EDUCATION',
                bold: true,
                size: 22, // 11pt
                font: 'Arial'
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 240,
              after: 120
            },
            border: {
              bottom: {
                color: 'auto',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6
              }
            }
          }),
          ...resumeData.education.flatMap(edu => [
            new Paragraph({
              children: [
                new TextRun({
                  text: edu.degree,
                  bold: true,
                  size: 20, // 10pt
                  font: 'Arial'
                })
              ],
              spacing: {
                before: 120,
                after: 60
              }
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.school} | ${edu.location} | ${edu.graduationDate}`,
                  italics: true,
                  size: 18, // 9pt
                  font: 'Arial'
                })
              ],
              spacing: {
                after: 120
              }
            })
          ])
        ] : []),
        
        // Skills
        ...Object.keys(resumeData.skills).length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'TECHNICAL SKILLS',
                bold: true,
                size: 22, // 11pt
                font: 'Arial'
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 240,
              after: 120
            },
            border: {
              bottom: {
                color: 'auto',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6
              }
            }
          }),
          ...(resumeData.skills.technical ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Technical Skills: ${resumeData.skills.technical.join(', ')}`,
                  size: 20, // 10pt
                  font: 'Arial'
                })
              ],
              spacing: {
                after: 120
              }
            })
          ] : []),
          ...(resumeData.skills.professional ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Professional Skills: ${resumeData.skills.professional.join(', ')}`,
                  size: 20, // 10pt
                  font: 'Arial'
                })
              ],
              spacing: {
                after: 120
              }
            })
          ] : []),
          ...(resumeData.skills.languages ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: `Languages: ${resumeData.skills.languages.join(', ')}`,
                  size: 20, // 10pt
                  font: 'Arial'
                })
              ],
              spacing: {
                after: 120
              }
            })
          ] : [])
        ] : [],
        
        // Certifications
        ...(resumeData.certifications && resumeData.certifications.length > 0 ? [
          new Paragraph({
            children: [
              new TextRun({
                text: 'CERTIFICATIONS',
                bold: true,
                size: 22, // 11pt
                font: 'Arial'
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: {
              before: 240,
              after: 120
            },
            border: {
              bottom: {
                color: 'auto',
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6
              }
            }
          }),
          ...resumeData.certifications.map(cert => 
            new Paragraph({
              children: [
                new TextRun({
                  text: `${cert.name} | ${cert.issuer} | ${cert.date}`,
                  size: 20, // 10pt
                  font: 'Arial'
                })
              ],
              spacing: {
                after: 120
              }
            })
          )
        ] : []),
        
        // Footer
        new Paragraph({
          children: [
            new TextRun({
              text: 'Generated by OzSparkHub Resume AI • store.ozsparkhub.com.au',
              size: 16, // 8pt
              color: '808080', // Gray
              font: 'Arial'
            })
          ],
          alignment: AlignmentType.CENTER,
          spacing: {
            before: 480 // 24pt space before footer
          }
        })
      ]
    }]
  })
  
  return doc
}

/**
 * Download DOCX file
 */
export async function downloadWordDocument(content: string, filename: string = 'resume.docx'): Promise<boolean> {
  try {
    // Parse text content to structured data
    const resumeData = parseTextToWordData(content)
    
    // Generate Word document
    const doc = generateWordDocument(resumeData)
    
    // Generate blob directly (browser-compatible)
    const blob = await Packer.toBlob(doc)
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename.endsWith('.docx') ? filename : `${filename}.docx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('✅ DOCX document downloaded successfully:', filename)
    return true
  } catch (error) {
    console.error('❌ DOCX generation failed:', error)
    throw error
  }
}

/**
 * Generate sample resume data for testing
 */
export function createSampleWordResumeData(): WordResumeData {
  return {
    personalInfo: {
      name: 'Sarah Chen',
      title: 'Senior Marketing Manager',
      email: 'sarah.chen@example.com',
      phone: '0412 345 678',
      location: 'Sydney, NSW',
      linkedin: 'linkedin.com/in/sarahchen',
      website: 'sarahchen.com',
      summary: 'Results-driven Marketing Manager with 5+ years experience in digital marketing and brand strategy. Proven track record of increasing brand engagement by 150% and driving $2M+ in revenue growth. Expertise in campaign management, data analytics, and stakeholder engagement in the Australian market.'
    },
    experience: [
      {
        title: 'Senior Marketing Manager',
        company: 'TechCorp Australia',
        location: 'Sydney, NSW',
        startDate: 'Jan 2021',
        endDate: '',
        current: true,
        achievements: [
          'Led cross-functional team of 8 to execute integrated marketing campaigns, achieving 200% ROI',
          'Developed and implemented digital marketing strategy, increasing web traffic by 85%',
          'Managed $500K annual marketing budget with consistent 15% under-budget delivery',
          'Collaborated with stakeholders to align marketing initiatives with business objectives'
        ]
      },
      {
        title: 'Marketing Specialist',
        company: 'StartupHub',
        location: 'Melbourne, VIC',
        startDate: 'Jun 2018',
        endDate: 'Dec 2020',
        current: false,
        achievements: [
          'Created content marketing strategy that generated 10,000+ qualified leads',
          'Managed social media channels, growing follower base from 5K to 50K',
          'Conducted market research and competitor analysis for product launches',
          'Achieved 40% increase in email open rates through A/B testing'
        ]
      }
    ],
    education: [
      {
        degree: 'Master of Marketing',
        school: 'University of Sydney',
        location: 'Sydney, NSW',
        graduationDate: '2020',
        gpa: '3.8/4.0'
      },
      {
        degree: 'Bachelor of Commerce (Marketing)',
        school: 'Queensland University',
        location: 'Brisbane, QLD',
        graduationDate: '2015',
        honors: 'Distinction Average'
      }
    ],
    skills: {
      technical: ['Google Analytics', 'SEO/SEM', 'HubSpot', 'Adobe Creative Suite', 'SQL', 'Python'],
      professional: ['Project Management', 'Team Leadership', 'Strategic Planning', 'Stakeholder Engagement'],
      languages: ['English (Native)', 'Mandarin Chinese (Professional)', 'Spanish (Basic)']
    },
    certifications: [
      {
        name: 'Google Analytics Certified',
        issuer: 'Google',
        date: '2023'
      },
      {
        name: 'HubSpot Content Marketing',
        issuer: 'HubSpot Academy',
        date: '2022'
      }
    ]
  }
}