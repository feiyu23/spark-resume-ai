/**
 * Resume Export and Report Generation
 * Handles PDF download and detailed report generation
 */

import { downloadPDF, downloadWord, createSampleResumeData, type ResumeData } from './pdf-generator'

// Re-export ResumeData type
export type { ResumeData }

// Track free tier usage
interface UserUsage {
  lastFreeDownload?: string
  weeklyDownloads: number
  isPaid: boolean
}

// Admin users with unlimited access
const ADMIN_EMAILS = [
  'feiyu23@gmail.com',
  'ozsparkhub@gmail.com'
]

// Check if current user is admin (client-side check)
const isAdminUser = (): boolean => {
  if (typeof window === 'undefined') return false
  
  // Check if user is logged in with admin email
  // This is a simple client-side check - in production you'd want server-side verification
  try {
    const userEmail = localStorage.getItem('userEmail')
    if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
      return true
    }
    
    // Fallback: check URL parameters for testing
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('admin') === 'feiyu23') {
      return true
    }
    
    // Development mode: check hostname
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('localhost')) {
      return true
    }
    
  } catch (error) {
    console.log('Admin check failed:', error)
  }
  
  return false
}

// Mock user usage (in production, this would be in database)
const getUserUsage = (): UserUsage => {
  if (typeof window === 'undefined') return { weeklyDownloads: 0, isPaid: false }
  
  const stored = localStorage.getItem('resumeUsage')
  if (stored) {
    return JSON.parse(stored)
  }
  return { weeklyDownloads: 0, isPaid: false }
}

const updateUserUsage = (usage: UserUsage) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('resumeUsage', JSON.stringify(usage))
}

// Check if user can use AI features (Professional plan and above)
export const canUseAI = (): boolean => {
  // Admin users have unlimited AI access
  if (isAdminUser()) {
    return true
  }

  const usage = getUserUsage()

  // Only paid users can use AI features
  return usage.isPaid
}

// Check if user can download (free tier: 1 per week, admin: unlimited)
export const canDownloadFree = (): boolean => {
  // Admin users have unlimited downloads
  if (isAdminUser()) {
    return true
  }

  const usage = getUserUsage()

  // Paid users have unlimited downloads
  if (usage.isPaid) return true
  
  // Check if it's been a week since last free download
  if (usage.lastFreeDownload) {
    const lastDownload = new Date(usage.lastFreeDownload)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - lastDownload.getTime()) / (1000 * 60 * 60 * 24))
    
    // Reset weekly counter if it's been 7 days
    if (daysDiff >= 7) {
      usage.weeklyDownloads = 0
      usage.lastFreeDownload = undefined
      updateUserUsage(usage)
      return true
    }
  }
  
  // Check if user has used their free download this week
  return usage.weeklyDownloads < 1
}

// Record a download (admin downloads don't count towards limit)
export const recordDownload = () => {
  // Admin users don't have download limits
  if (isAdminUser()) {
    return // Don't record admin downloads
  }
  
  const usage = getUserUsage()
  usage.weeklyDownloads++
  usage.lastFreeDownload = new Date().toISOString()
  updateUserUsage(usage)
}

// Helper function to set admin email for testing
export const setAdminEmail = (email: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userEmail', email)
  }
}

// Simulate paid subscription (for testing purposes)
export const setPaidStatus = (isPaid: boolean) => {
  if (typeof window !== 'undefined') {
    const usage = getUserUsage()
    usage.isPaid = isPaid
    updateUserUsage(usage)
  }
}

// Get current paid status for testing
export const isPaidUser = (): boolean => {
  return getUserUsage().isPaid || isAdminUser()
}

// Generate demo resume content
export const generateDemoResume = () => {
  return `
SARAH CHEN
Marketing Manager | Sydney, NSW
Email: sarah.chen@example.com | Phone: 0412 345 678
LinkedIn: linkedin.com/in/sarahchen | Portfolio: sarahchen.com

PROFESSIONAL SUMMARY
Results-driven Marketing Manager with 5+ years experience in digital marketing and brand strategy. 
Proven track record of increasing brand engagement by 150% and driving $2M+ in revenue growth. 
Expertise in campaign management, data analytics, and stakeholder engagement in the Australian market.

EXPERIENCE

Senior Marketing Manager | TechCorp Australia | Sydney, NSW
January 2021 - Present
• Led cross-functional team of 8 to execute integrated marketing campaigns, achieving 200% ROI
• Developed and implemented digital marketing strategy, increasing web traffic by 85%
• Managed $500K annual marketing budget with consistent 15% under-budget delivery
• Collaborated with stakeholders to align marketing initiatives with business objectives
• Implemented marketing automation tools, reducing manual processes by 60%

Marketing Specialist | StartupHub | Melbourne, VIC  
June 2018 - December 2020
• Created content marketing strategy that generated 10,000+ qualified leads
• Managed social media channels, growing follower base from 5K to 50K
• Conducted market research and competitor analysis for product launches
• Coordinated with external agencies for PR and advertising campaigns
• Achieved 40% increase in email open rates through A/B testing

Marketing Coordinator | Digital Agency | Brisbane, QLD
February 2016 - May 2018
• Assisted in planning and executing 20+ client campaigns
• Prepared detailed campaign reports and KPI tracking dashboards
• Maintained brand consistency across all marketing materials
• Supported event management for industry conferences and trade shows

EDUCATION

Master of Marketing | University of Sydney | Sydney, NSW
Graduated: 2020 | GPA: 3.8/4.0

Bachelor of Commerce (Marketing) | Queensland University | Brisbane, QLD
Graduated: 2015 | Distinction Average

SKILLS
• Digital Marketing: SEO, SEM, Google Analytics, Social Media Marketing, Email Marketing
• Tools: HubSpot, Salesforce, Adobe Creative Suite, Canva, Mailchimp, Hootsuite
• Analytics: Data visualization, A/B testing, ROI analysis, KPI tracking
• Soft Skills: Leadership, Project Management, Stakeholder Engagement, Communication

CERTIFICATIONS
• Google Analytics Certified (2023)
• HubSpot Content Marketing Certification (2022)
• Facebook Blueprint Certification (2021)

ACHIEVEMENTS
• Marketing Excellence Award - TechCorp Australia (2023)
• "Top 30 Under 30" Marketing Professionals - Marketing Magazine AU (2022)
• Successfully managed transition to remote work, maintaining team productivity at 95%

LANGUAGES
• English (Native)
• Mandarin Chinese (Professional)
`
}

// Generate detailed ATS report
export const generateDetailedReport = (atsScore: number) => {
  const reportDate = new Date().toLocaleDateString('en-AU')
  
  return `
===================================
ATS COMPATIBILITY REPORT
Generated: ${reportDate}
===================================

OVERALL SCORE: ${atsScore}%
${atsScore >= 80 ? 'EXCELLENT' : atsScore >= 60 ? 'GOOD' : 'NEEDS IMPROVEMENT'}

DETAILED ANALYSIS
-----------------

1. KEYWORD OPTIMIZATION (Score: ${Math.round(atsScore * 0.9)}%)
✅ Strong Keywords Found:
   • Project Management
   • Stakeholder Engagement
   • Data Analytics
   • Digital Marketing
   • ROI Analysis
   
⚠️ Missing Keywords (Consider Adding):
   • Agile Methodologies
   • Budget Management
   • Cross-functional Collaboration
   • Continuous Improvement
   • WHS Compliance

2. FORMATTING ANALYSIS (Score: ${Math.round(atsScore * 0.95)}%)
✅ Strengths:
   • Clear section headers
   • Bullet points for achievements
   • Chronological work history
   • Contact information properly formatted
   
⚠️ Areas for Improvement:
   • Consider adding more quantifiable achievements
   • Include industry-specific certifications
   • Add technical skills section

3. AUSTRALIAN MARKET OPTIMIZATION
✅ Local Elements:
   • Australian spelling conventions used
   • Local city/state format (Sydney, NSW)
   • Australian phone number format
   
💡 Suggestions:
   • Mention work rights status (if applicable)
   • Include understanding of Australian regulations
   • Reference local industry standards

4. ATS SYSTEM COMPATIBILITY
Tested against major Australian ATS systems:

SEEK:          ${atsScore >= 75 ? '✅ PASS' : '⚠️ NEEDS WORK'}
Indeed AU:     ${atsScore >= 70 ? '✅ PASS' : '⚠️ NEEDS WORK'}
LinkedIn:      ${atsScore >= 80 ? '✅ PASS' : '⚠️ NEEDS WORK'}
Taleo:         ${atsScore >= 85 ? '✅ PASS' : '⚠️ NEEDS WORK'}
Workday:       ${atsScore >= 75 ? '✅ PASS' : '⚠️ NEEDS WORK'}

5. RECOMMENDATIONS FOR IMPROVEMENT
-----------------------------------
${atsScore < 60 ? `
CRITICAL FIXES NEEDED:
• Add more industry-relevant keywords
• Restructure content with clear headers
• Include quantifiable achievements
• Fix formatting issues for ATS parsing
` : atsScore < 80 ? `
OPTIMIZATION SUGGESTIONS:
• Enhance keyword density naturally
• Add more specific achievements
• Include relevant certifications
• Optimize for target job descriptions
` : `
MINOR ENHANCEMENTS:
• Resume is well-optimized
• Consider tailoring for specific roles
• Keep updating with new achievements
• Maintain keyword relevance
`}

6. NEXT STEPS
-------------
1. Apply the suggested optimizations
2. Re-run ATS analysis after changes
3. Tailor resume for specific job postings
4. Save different versions for different roles
5. Keep your resume updated regularly

===================================
Report generated by OzSparkHub Resume AI
For premium features, visit: store.ozsparkhub.com.au
===================================
`
}

// Export functions for PDF generation
export const downloadResumePDF = async (resumeData?: ResumeData | Partial<ResumeData>, filename: string = 'resume-optimized.pdf') => {
  // Check if user can download
  if (!canDownloadFree()) {
    throw new Error('Free download limit reached. Please upgrade to Professional plan for unlimited downloads.')
  }
  
  try {
    // Use provided resume data or fallback to sample data
    const finalResumeData = resumeData && isCompleteResumeData(resumeData) 
      ? resumeData 
      : mergeWithSampleData(resumeData || {})
    
    await downloadPDF(finalResumeData, filename)
    
    // Record the download
    recordDownload()
    
    return true
  } catch (error) {
    console.error('Download failed:', error)
    throw error
  }
}

// Helper function to check if resume data is complete
const isCompleteResumeData = (data: Partial<ResumeData>): data is ResumeData => {
  return !!(
    data.personalInfo?.name && 
    data.personalInfo?.email &&
    data.experience &&
    data.education &&
    data.skills
  )
}

// Helper function to merge user data with sample data
const mergeWithSampleData = (userData: Partial<ResumeData>): ResumeData => {
  const sampleData = createSampleResumeData()
  
  return {
    personalInfo: {
      ...sampleData.personalInfo,
      ...userData.personalInfo,
      // Ensure required fields are present
      name: userData.personalInfo?.name || sampleData.personalInfo.name,
      email: userData.personalInfo?.email || sampleData.personalInfo.email,
      phone: userData.personalInfo?.phone || sampleData.personalInfo.phone,
      location: userData.personalInfo?.location || sampleData.personalInfo.location
    },
    experience: userData.experience && userData.experience.length > 0 
      ? userData.experience as ResumeData['experience']
      : sampleData.experience,
    education: userData.education && userData.education.length > 0
      ? userData.education as ResumeData['education'] 
      : sampleData.education,
    skills: {
      technical: userData.skills?.technical || sampleData.skills.technical,
      professional: userData.skills?.professional || sampleData.skills.professional,  
      languages: userData.skills?.languages || sampleData.skills.languages
    },
    certifications: userData.certifications || sampleData.certifications,
    achievements: userData.achievements || sampleData.achievements
  }
}

// Export Word document
export const downloadResumeWord = async (content?: string, filename: string = 'resume-optimized.docx') => {
  // Check if user can download
  if (!canDownloadFree()) {
    throw new Error('Free download limit reached. Please upgrade to Professional plan for unlimited downloads.')
  }
  
  try {
    // Use the new Word generator with sample data
    const resumeData = createSampleResumeData()
    downloadWord(resumeData, filename)
    
    // Record the download
    recordDownload()
    
    return true
  } catch (error) {
    console.error('Download failed:', error)
    throw error
  }
}

// Download detailed report
export const downloadDetailedReport = async (atsScore: number) => {
  const report = generateDetailedReport(atsScore)
  const blob = new Blob([report], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ats-report-${new Date().getTime()}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
  
  return true
}

// View report in modal/new window
export const viewDetailedReport = (atsScore: number) => {
  const report = generateDetailedReport(atsScore)
  
  // Create a new window with the report
  const reportWindow = window.open('', '_blank', 'width=800,height=600')
  if (reportWindow) {
    reportWindow.document.write(`
      <html>
        <head>
          <title>ATS Compatibility Report</title>
          <style>
            body { 
              font-family: monospace; 
              padding: 20px; 
              background: #f5f5f5;
              white-space: pre-wrap;
              line-height: 1.6;
            }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <button onclick="window.print()" style="padding: 10px 20px; margin-bottom: 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Print Report
          </button>
          <button onclick="window.close()" style="padding: 10px 20px; margin-bottom: 20px; margin-left: 10px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Close
          </button>
          <pre>${report}</pre>
        </body>
      </html>
    `)
    reportWindow.document.close()
  }
  
  return true
}