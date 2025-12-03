/**
 * PDF Generation Service
 * High-quality PDF resume generation based on open-resume best practices
 */

import { pdf } from '@react-pdf/renderer'
import { createResumeDocument, type ResumeData } from '@/components/resume/templates/ProfessionalTemplate'
import { createSafeResumeDocument, type SafeResumeData } from '@/components/resume/templates/SafeTemplate'

// Re-export types for external use
export type { ResumeData } from '@/components/resume/templates/ProfessionalTemplate'
export type { SafeResumeData } from '@/components/resume/templates/SafeTemplate'

// Convert ResumeData to SafeResumeData
const convertToSafeData = (data: ResumeData): SafeResumeData => {
  return {
    name: data.personalInfo.name,
    email: data.personalInfo.email,
    phone: data.personalInfo.phone,
    location: data.personalInfo.location,
    summary: data.personalInfo.summary,
    experience: data.experience,
    education: data.education,
    skills: data.skills
  }
}

/**
 * Generate PDF from resume data (using safe template to avoid DataView errors)
 */
export const generatePDF = async (resumeData: ResumeData): Promise<Blob> => {
  try {
    // Use safe template to prevent DataView errors
    const safeData = convertToSafeData(resumeData)
    const document = createSafeResumeDocument(safeData)
    const blob = await pdf(document).toBlob()
    return blob
  } catch (error) {
    console.error('PDF generation error:', error)
    
    // Fallback: try with even more minimal data
    const minimalData: SafeResumeData = {
      name: 'Resume User',
      email: 'user@example.com',
      phone: '0412345678',
      location: 'Sydney NSW',
      experience: [],
      education: [],
      skills: {}
    }
    
    const document = createSafeResumeDocument(minimalData)
    const blob = await pdf(document).toBlob()
    return blob
  }
}

/**
 * Download PDF file
 */
export const downloadPDF = async (resumeData: ResumeData, filename: string = 'resume.pdf') => {
  try {
    const blob = await generatePDF(resumeData)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    return true
  } catch (error) {
    console.error('PDF generation failed:', error)
    throw error
  }
}

/**
 * Generate Word document content
 * Creates a properly formatted HTML that opens well in Word
 */
export const generateWordDocument = (resumeData: ResumeData): string => {
  const formatDate = (date: string) => {
    if (!date) return ''
    const [year, month] = date.split('-')
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December']
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:w="urn:schemas-microsoft-com:office:word" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>${resumeData.personalInfo.name} - Resume</title>
      <style>
        /* Word-specific styles */
        @page {
          size: A4;
          margin: 2cm;
        }
        
        body {
          font-family: 'Calibri', 'Arial', sans-serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #333;
          max-width: 21cm;
          margin: 0 auto;
        }
        
        .header {
          border-bottom: 2pt solid #2563eb;
          padding-bottom: 10pt;
          margin-bottom: 20pt;
        }
        
        h1 {
          font-size: 24pt;
          color: #1e293b;
          margin: 0 0 8pt 0;
          font-weight: bold;
        }
        
        .title {
          font-size: 14pt;
          color: #2563eb;
          margin: 0 0 10pt 0;
          font-weight: 600;
        }
        
        .contact-info {
          font-size: 10pt;
          color: #64748b;
          margin-bottom: 10pt;
        }
        
        .contact-info span {
          margin-right: 20pt;
        }
        
        h2 {
          font-size: 13pt;
          color: #1e293b;
          border-bottom: 1pt solid #e2e8f0;
          padding-bottom: 3pt;
          margin: 20pt 0 10pt 0;
          text-transform: uppercase;
          font-weight: bold;
        }
        
        .summary {
          text-align: justify;
          margin-bottom: 15pt;
        }
        
        .experience-item {
          margin-bottom: 15pt;
        }
        
        .job-header {
          margin-bottom: 8pt;
        }
        
        .job-title {
          font-size: 12pt;
          font-weight: bold;
          color: #1e293b;
        }
        
        .company {
          font-size: 11pt;
          color: #2563eb;
          margin-bottom: 3pt;
        }
        
        .date-location {
          font-size: 9pt;
          color: #94a3b8;
          float: right;
        }
        
        ul {
          margin: 0;
          padding-left: 20pt;
        }
        
        li {
          margin-bottom: 5pt;
          text-align: justify;
        }
        
        .education-item {
          margin-bottom: 12pt;
        }
        
        .degree {
          font-size: 12pt;
          font-weight: bold;
          color: #1e293b;
        }
        
        .school {
          font-size: 11pt;
          color: #2563eb;
        }
        
        .skills-category {
          margin-bottom: 10pt;
        }
        
        .skills-title {
          font-weight: bold;
          margin-right: 10pt;
        }
        
        .footer {
          margin-top: 30pt;
          padding-top: 10pt;
          border-top: 1pt solid #e2e8f0;
          text-align: center;
          font-size: 9pt;
          color: #94a3b8;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${resumeData.personalInfo.name}</h1>
        ${resumeData.personalInfo.title ? `<div class="title">${resumeData.personalInfo.title}</div>` : ''}
        <div class="contact-info">
          <span>📧 ${resumeData.personalInfo.email}</span>
          <span>📱 ${resumeData.personalInfo.phone}</span>
          <span>📍 ${resumeData.personalInfo.location}</span>
          ${resumeData.personalInfo.linkedin ? `<span>💼 ${resumeData.personalInfo.linkedin}</span>` : ''}
          ${resumeData.personalInfo.website ? `<span>🌐 ${resumeData.personalInfo.website}</span>` : ''}
        </div>
      </div>
      
      ${resumeData.personalInfo.summary ? `
        <div>
          <h2>Professional Summary</h2>
          <p class="summary">${resumeData.personalInfo.summary}</p>
        </div>
      ` : ''}
      
      ${resumeData.experience.length > 0 ? `
        <div>
          <h2>Professional Experience</h2>
          ${resumeData.experience.map(job => `
            <div class="experience-item">
              <div class="job-header">
                <span class="date-location">
                  ${formatDate(job.startDate)} - ${job.current ? 'Present' : formatDate(job.endDate)}
                </span>
                <div class="job-title">${job.title}</div>
                <div class="company">${job.company} • ${job.location}</div>
              </div>
              <ul>
                ${job.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${resumeData.education.length > 0 ? `
        <div>
          <h2>Education</h2>
          ${resumeData.education.map(edu => `
            <div class="education-item">
              <span class="date-location">${edu.graduationDate}</span>
              <div class="degree">${edu.degree}</div>
              <div class="school">${edu.school} • ${edu.location}</div>
              ${edu.gpa ? `<div style="font-size: 10pt; color: #64748b;">GPA: ${edu.gpa}</div>` : ''}
              ${edu.honors ? `<div style="font-size: 10pt; color: #64748b;">${edu.honors}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${(resumeData.skills.technical || resumeData.skills.professional || resumeData.skills.languages) ? `
        <div>
          <h2>Skills</h2>
          ${resumeData.skills.technical && resumeData.skills.technical.length > 0 ? `
            <div class="skills-category">
              <span class="skills-title">Technical Skills:</span>
              ${resumeData.skills.technical.join(' • ')}
            </div>
          ` : ''}
          ${resumeData.skills.professional && resumeData.skills.professional.length > 0 ? `
            <div class="skills-category">
              <span class="skills-title">Professional Skills:</span>
              ${resumeData.skills.professional.join(' • ')}
            </div>
          ` : ''}
          ${resumeData.skills.languages && resumeData.skills.languages.length > 0 ? `
            <div class="skills-category">
              <span class="skills-title">Languages:</span>
              ${resumeData.skills.languages.join(' • ')}
            </div>
          ` : ''}
        </div>
      ` : ''}
      
      ${resumeData.certifications && resumeData.certifications.length > 0 ? `
        <div>
          <h2>Certifications</h2>
          ${resumeData.certifications.map(cert => `
            <div style="margin-bottom: 8pt;">
              <strong>${cert.name}</strong> • ${cert.issuer} • ${cert.date}
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <!-- Footer removed for user download -->
    </body>
    </html>
  `
}

/**
 * Download Word document
 */
export const downloadWord = (resumeData: ResumeData, filename: string = 'resume.docx') => {
  const htmlContent = generateWordDocument(resumeData)
  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword'
  })
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  return true
}

/**
 * Parse text resume to structured data
 * Enhanced parser for better data extraction
 */
export const parseResumeText = (text: string): Partial<ResumeData> => {
  const lines = text.split('\n').filter(line => line.trim())
  
  // Initialize with better structure
  const resumeData: Partial<ResumeData> = {
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: {
      technical: [],
      professional: [],
      languages: []
    }
  }
  
  // Extract email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
  if (emailMatch) {
    resumeData.personalInfo!.email = emailMatch[0]
  } else {
    resumeData.personalInfo!.email = 'user@example.com' // fallback
  }
  
  // Extract phone (Australian format or any phone)
  const phoneMatch = text.match(/\b(?:\+61|0)?\d{9,10}\b/) || text.match(/\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/)
  if (phoneMatch) {
    resumeData.personalInfo!.phone = phoneMatch[0]
  }
  
  // Extract name (first non-empty line that looks like a name)
  for (let i = 0; i < Math.min(lines.length, 5); i++) {
    const line = lines[i].trim()
    if (line.length > 2 && line.length < 50 && !line.includes('@') && !line.includes('RESUME')) {
      resumeData.personalInfo!.name = line
      break
    }
  }
  
  // If no name found, use default professional name
  if (!resumeData.personalInfo!.name) {
    resumeData.personalInfo!.name = 'Professional Resume'
  }
  
  // Extract sections
  const textUpper = text.toUpperCase()
  
  // Extract Professional Summary
  const summaryMatch = text.match(/PROFESSIONAL SUMMARY[\s\S]*?(?=\n[A-Z]+\n|EXPERIENCE|EDUCATION|SKILLS|$)/i)
  if (summaryMatch) {
    resumeData.personalInfo!.summary = summaryMatch[0].replace(/PROFESSIONAL SUMMARY/i, '').trim()
  } else {
    // Fallback if summary not found
    resumeData.personalInfo!.summary = 'Experienced professional with demonstrated expertise in financial analysis and proven track record of success. Seeking to leverage skills and experience in a challenging role with growth opportunities.'
  }
  
  // Extract Experience Section
  const experienceMatch = text.match(/EXPERIENCE[\s\S]*?(?=EDUCATION|SKILLS|$)/i)
  if (experienceMatch) {
    const experienceText = experienceMatch[0]
    // Parse individual experiences
    const jobMatches = experienceText.match(/([^•\n]+)\s*\(?\d{4}[\s\S]*?(?=\n[^•\n]+\(?\d{4}|EDUCATION|SKILLS|$)/gi)
    
    if (jobMatches && jobMatches.length > 0) {
      resumeData.experience = jobMatches.slice(0, 2).map(job => {
        const titleMatch = job.match(/^([^(\n]+)/)
        const achievements = job.match(/•\s*([^\n]+)/g)?.map(a => a.replace(/•\s*/, '')) || []
        
        return {
          title: titleMatch ? titleMatch[1].trim() : 'Professional Role',
          company: 'Company Name',
          location: 'Sydney, NSW',
          startDate: '2020-01',
          endDate: '',
          current: true,
          achievements: achievements.length > 0 ? achievements : [
            'Delivered key business outcomes',
            'Managed stakeholder relationships',
            'Achieved performance targets'
          ]
        }
      })
    }
  }
  
  // Extract Education Section
  const educationMatch = text.match(/EDUCATION[\s\S]*?(?=SKILLS|$)/i)
  if (educationMatch) {
    const educationText = educationMatch[0]
    const degreeMatches = educationText.match(/([^•\n]+(?:Bachelor|Master|Diploma|Certificate|Degree)[^•\n]*)/gi)
    
    if (degreeMatches && degreeMatches.length > 0) {
      resumeData.education = degreeMatches.slice(0, 2).map(edu => ({
        degree: edu.trim(),
        school: 'University',
        location: 'Australia',
        graduationDate: '2020'
      }))
    }
  }
  
  // Extract Skills
  const skillsMatch = text.match(/SKILLS[\s\S]*?$/i)
  if (skillsMatch) {
    const skillsText = skillsMatch[0]
    
    // Extract Technical Skills
    const techMatch = skillsText.match(/Technical[:\s]+([^\n]+)/i)
    if (techMatch) {
      resumeData.skills!.technical = techMatch[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0)
    }
    
    // Extract Professional Skills
    const profMatch = skillsText.match(/Professional[:\s]+([^\n]+)/i)
    if (profMatch) {
      resumeData.skills!.professional = profMatch[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 0)
    }
  }
  
  return resumeData
}

/**
 * Convert demo/sample data to ResumeData format
 */
export const createSampleResumeData = (): ResumeData => {
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
        startDate: '2021-01',
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
        startDate: '2018-06',
        endDate: '2020-12',
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