/**
 * Enhanced PDF Parser based on OpenResume and Reactive-Resume methods
 * Fixes blank download and encoding issues
 */

/**
 * Clean and normalize extracted text from PDF
 * Handles encoding issues and formatting problems
 */
export function cleanExtractedText(text: string): string {
  if (!text || typeof text !== 'string') {
    console.warn('PDF Parser: Invalid text input', { text })
    return ''
  }

  // 1. Handle encoding issues first
  let cleaned = text
    // Fix common PDF encoding problems
    .replace(/â€™/g, "'") // Apostrophe
    .replace(/â€œ|â€\u009d/g, '"') // Quotes
    .replace(/â€"/g, '—') // Em dash
    .replace(/â€¢/g, '•') // Bullet
    .replace(/Ã©/g, 'é') // Accented e
    .replace(/Ã¨/g, 'è')
    .replace(/Ã /g, 'à')
    .replace(/Ã§/g, 'ç')
    
  // 2. Normalize whitespace and line breaks
  cleaned = cleaned
    .replace(/\r\n|\r/g, '\n') // Normalize line breaks
    .replace(/\t/g, ' ') // Replace tabs with spaces
    .replace(/\f/g, '\n\n') // Page breaks to double line breaks
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '') // Remove control characters
    
  // 3. Fix spacing issues common in PDF extraction
  cleaned = cleaned
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
    .replace(/(\w)([,:;])/g, '$1$2 ') // Add space after punctuation
    .replace(/([,:;])(\w)/g, '$1 $2') // Add space before words after punctuation
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    
  // 4. Fix line breaks and paragraph structure
  const lines = cleaned.split('\n')
  const processedLines: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    if (line.length === 0) {
      // Keep empty lines for paragraph breaks
      if (i > 0 && processedLines[processedLines.length - 1] !== '') {
        processedLines.push('')
      }
      continue
    }
    
    // Check if this line is a section header (all caps or specific patterns)
    const isHeader = 
      line.length < 50 && 
      (line === line.toUpperCase() || 
       /^(EXPERIENCE|EDUCATION|SKILLS|SUMMARY|OBJECTIVE|CONTACT|REFERENCES)/i.test(line))
    
    if (isHeader && processedLines.length > 0 && processedLines[processedLines.length - 1] !== '') {
      // Add blank line before headers
      processedLines.push('')
    }
    
    processedLines.push(line)
    
    if (isHeader) {
      // Add blank line after headers
      processedLines.push('')
    }
  }
  
  // 5. Final cleanup
  cleaned = processedLines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n') // Maximum 2 consecutive line breaks
    .trim()
  
  console.log('PDF Parser: Text cleaned', {
    originalLength: text.length,
    cleanedLength: cleaned.length,
    linesOriginal: text.split('\n').length,
    linesCleaned: cleaned.split('\n').length
  })
  
  return cleaned
}

/**
 * Validate extracted text has meaningful content
 */
export function validateExtractedText(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false
  }
  
  const cleaned = text.trim()
  
  // Check minimum length
  if (cleaned.length < 100) {
    console.warn('PDF Parser: Text too short', { length: cleaned.length })
    return false
  }
  
  // Check for actual words (not just special characters or numbers)
  const wordCount = cleaned.split(/\s+/).filter(word => 
    word.length > 2 && /[a-zA-Z]/.test(word)
  ).length
  
  if (wordCount < 20) {
    console.warn('PDF Parser: Not enough meaningful words', { wordCount })
    return false
  }
  
  // Check for common resume keywords
  const resumeKeywords = [
    'experience', 'education', 'skills', 'work', 'university', 
    'degree', 'position', 'role', 'responsibilities', 'company'
  ]
  
  const hasResumeContent = resumeKeywords.some(keyword => 
    cleaned.toLowerCase().includes(keyword)
  )
  
  if (!hasResumeContent) {
    console.warn('PDF Parser: No resume-related content found')
    return false
  }
  
  return true
}

/**
 * Extract structured sections from resume text
 */
export function extractResumeSections(text: string): Record<string, string[]> {
  const sections: Record<string, string[]> = {}
  
  // Common section headers
  const sectionPatterns = {
    contact: /^(CONTACT|PERSONAL|INFORMATION)/i,
    summary: /^(SUMMARY|OBJECTIVE|PROFILE|ABOUT)/i,
    experience: /^(EXPERIENCE|EMPLOYMENT|WORK|CAREER|PROFESSIONAL)/i,
    education: /^(EDUCATION|ACADEMIC|QUALIFICATION|STUDY)/i,
    skills: /^(SKILLS|TECHNICAL|COMPETENC|EXPERTISE)/i,
    projects: /^(PROJECT|PORTFOLIO)/i,
    certifications: /^(CERTIFICATION|LICENSE|CREDENTIAL)/i,
    references: /^(REFERENCE|REFEREE)/i
  }
  
  const lines = text.split('\n')
  let currentSection = 'unknown'
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    // Check if this is a section header
    for (const [sectionName, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(trimmedLine)) {
        currentSection = sectionName
        sections[currentSection] = []
        break
      }
    }
    
    // Add content to current section
    if (trimmedLine && !Object.values(sectionPatterns).some(p => p.test(trimmedLine))) {
      if (!sections[currentSection]) {
        sections[currentSection] = []
      }
      sections[currentSection].push(trimmedLine)
    }
  }
  
  return sections
}

/**
 * Extract key information from resume text
 */
export function extractKeyInformation(text: string) {
  const sections = extractResumeSections(text)
  const allText = text.toLowerCase()
  
  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  const emails = text.match(emailRegex)
  
  // Extract phone
  const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g
  const phones = text.match(phoneRegex)
  
  // Extract LinkedIn
  const linkedinRegex = /linkedin\.com\/in\/[\w-]+/gi
  const linkedin = text.match(linkedinRegex)
  
  // Extract skills from skills section
  const skillsSection = sections.skills || []
  const skills = skillsSection
    .join(' ')
    .split(/[,;•·▪▫◦‣⁃\n]/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.length < 50)
  
  return {
    email: emails?.[0] || null,
    phone: phones?.[0] || null,
    linkedin: linkedin?.[0] || null,
    skills: skills.slice(0, 20), // Top 20 skills
    sections: Object.keys(sections).filter(k => k !== 'unknown'),
    hasExperience: sections.experience && sections.experience.length > 0,
    hasEducation: sections.education && sections.education.length > 0
  }
}

/**
 * Main function to process PDF text
 */
export function processPDFText(rawText: string): {
  cleanedText: string
  isValid: boolean
  extractedInfo: any
  sections: Record<string, string[]>
} {
  // Step 1: Clean the text
  const cleanedText = cleanExtractedText(rawText)
  
  // Step 2: Validate
  const isValid = validateExtractedText(cleanedText)
  
  // Step 3: Extract sections
  const sections = extractResumeSections(cleanedText)
  
  // Step 4: Extract key info
  const extractedInfo = extractKeyInformation(cleanedText)
  
  return {
    cleanedText,
    isValid,
    extractedInfo,
    sections
  }
}

/**
 * Format text for PDF generation (prevent blank PDFs)
 */
export function formatForPDFGeneration(text: string): string {
  if (!text || text.trim().length === 0) {
    console.error('PDF Generator: Empty text provided')
    // Return a placeholder to prevent blank PDF
    return 'Error: No content available for PDF generation.\n\nPlease upload a valid resume file and try again.'
  }
  
  // Ensure text is properly formatted for PDF
  let formatted = text
  
  // 1. Ensure proper line breaks
  formatted = formatted
    .replace(/\n{3,}/g, '\n\n') // Max 2 line breaks
    .replace(/([.!?])\s*\n/g, '$1\n\n') // Double line break after sentences ending paragraphs
  
  // 2. Format section headers
  const sectionHeaders = [
    'CONTACT', 'SUMMARY', 'OBJECTIVE', 'EXPERIENCE', 'EDUCATION', 
    'SKILLS', 'PROJECTS', 'CERTIFICATIONS', 'REFERENCES'
  ]
  
  sectionHeaders.forEach(header => {
    const regex = new RegExp(`(^|\n)(${header}[A-Z\s]*)(\n|$)`, 'gi')
    formatted = formatted.replace(regex, '\n\n$2\n-'.repeat(30) + '\n')
  })
  
  // 3. Ensure minimum content
  if (formatted.trim().length < 100) {
    formatted += '\n\n[Resume content appears to be incomplete. Please check the original file.]'
  }
  
  return formatted
}