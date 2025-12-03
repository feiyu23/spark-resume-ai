/**
 * Improved PDF formatter for better resume layout
 * Handles proper text formatting and section detection
 */

import jsPDF from 'jspdf'

interface ResumeSection {
  title: string
  content: string[]
}

/**
 * Parse resume into structured sections
 */
export function parseResumeIntoSections(text: string): ResumeSection[] {
  const sections: ResumeSection[] = []
  
  // Common section headers
  const sectionHeaders = [
    'PROFESSIONAL SUMMARY',
    'PROFESSIONAL EXPERIENCE',
    'EXPERIENCE',
    'EDUCATION',
    'TECHNICAL SKILLS',
    'SKILLS',
    'KEY ACHIEVEMENTS',
    'CORE RESPONSIBILITIES',
    'CERTIFICATIONS',
    'PROJECTS',
    'REFERENCES'
  ]
  
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0)
  
  let currentSection: ResumeSection | null = null
  let nameSection: ResumeSection = { title: 'HEADER', content: [] }
  let inHeader = true
  
  for (const line of lines) {
    // Check if this is a section header
    const isHeader = sectionHeaders.some(header => 
      line.toUpperCase().includes(header) || 
      line === header
    )
    
    if (isHeader) {
      // Save previous section if exists
      if (currentSection && currentSection.content.length > 0) {
        sections.push(currentSection)
      }
      
      // Start new section
      currentSection = {
        title: line, // Keep original case, don't force uppercase
        content: []
      }
      inHeader = false
    } else if (currentSection) {
      // Add to current section
      currentSection.content.push(line)
    } else if (inHeader) {
      // This is part of the header (name, contact info)
      nameSection.content.push(line)
    }
  }
  
  // Add the last section
  if (currentSection && currentSection.content.length > 0) {
    sections.push(currentSection)
  }
  
  // Add header section at the beginning
  if (nameSection.content.length > 0) {
    sections.unshift(nameSection)
  }
  
  return sections
}

/**
 * Generate improved PDF with proper formatting
 */
export function generateImprovedPDF(content: string): Blob {
  // Input validation
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    console.error('PDF Generator (Improved): Invalid or empty content provided', { content })
    throw new Error('Cannot generate PDF: Content is empty or invalid')
  }

  console.log('PDF Generator (Improved): Starting generation with content length:', content.length)

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  
  // Parse content into sections
  const sections = parseResumeIntoSections(content)
  console.log('PDF Generator (Improved): Parsed into', sections.length, 'sections')
  
  // PDF dimensions
  const pageHeight = doc.internal.pageSize.height
  const pageWidth = doc.internal.pageSize.width
  const margins = { top: 20, bottom: 20, left: 20, right: 20 }
  const maxWidth = pageWidth - margins.left - margins.right
  
  let y = margins.top
  const lineHeight = 5
  const sectionSpacing = 8
  const bulletIndent = 5
  
  // Helper function to add text with page overflow handling and proper formatting
  const addTextWithPageBreak = (text: string, x: number, currentY: number, options?: any): number => {
    // Handle empty lines and spacing
    if (!text.trim()) {
      return currentY + lineHeight / 2
    }
    
    const lines = doc.splitTextToSize(text, maxWidth - (x - margins.left))
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Check if we need a new page
      if (currentY > pageHeight - margins.bottom) {
        doc.addPage()
        currentY = margins.top
      }
      
      doc.text(line, x, currentY, options)
      
      // Add appropriate line spacing
      if (i === lines.length - 1) {
        // Last line of this text block
        currentY += lineHeight
      } else {
        // Multi-line text, smaller spacing between wrapped lines
        currentY += lineHeight * 0.8
      }
    }
    
    return currentY
  }
  
  // Helper to detect if line is a company/organization name
  const isCompanyLine = (line: string): boolean => {
    // Look for patterns like "Company Name | Location" or "Company Name, City"
    return line.includes(' | ') || 
           (line.includes(',') && !line.startsWith('•') && !line.startsWith('-')) ||
           line.toUpperCase() === line // All caps company names
  }
  
  // Helper to detect job title/position
  const isJobTitle = (line: string): boolean => {
    // Look for date patterns or position indicators
    return line.includes(' - ') || 
           line.includes('Present') ||
           line.match(/\d{4}/) !== null ||
           line.includes('Manager') || 
           line.includes('Engineer') || 
           line.includes('Developer') ||
           line.includes('Specialist') ||
           line.includes('Coordinator')
  }
  
  // Process each section
  sections.forEach((section, index) => {
    // Section title
    if (section.title === 'HEADER') {
      // Special handling for header (name, contact)
      if (section.content.length > 0) {
        // Name (larger font)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        y = addTextWithPageBreak(section.content[0], margins.left, y)
        
        // Contact info
        if (section.content.length > 1) {
          doc.setFontSize(10)
          doc.setFont('helvetica', 'normal')
          for (let i = 1; i < section.content.length; i++) {
            y = addTextWithPageBreak(section.content[i], margins.left, y)
          }
        }
        y += sectionSpacing
      }
    } else {
      // Regular sections
      // Section header
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      y = addTextWithPageBreak(section.title, margins.left, y)
      y += 2 // Small space after header
      
      // Section content
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      section.content.forEach((line, lineIndex) => {
        const trimmedLine = line.trim()
        
        if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
          // Bullet points - indent and normal font
          doc.setFont('helvetica', 'normal')
          y = addTextWithPageBreak(trimmedLine, margins.left + bulletIndent, y)
        } else if (isJobTitle(trimmedLine)) {
          // Job titles and positions - bold
          doc.setFont('helvetica', 'bold')
          y = addTextWithPageBreak(trimmedLine, margins.left, y)
          doc.setFont('helvetica', 'normal')
        } else if (isCompanyLine(trimmedLine)) {
          // Company names - italic
          doc.setFont('helvetica', 'italic')
          y = addTextWithPageBreak(trimmedLine, margins.left, y)
          doc.setFont('helvetica', 'normal')
        } else if (trimmedLine.toUpperCase() === trimmedLine && trimmedLine.length > 5) {
          // 🔧 FIX: Better detection of section headers vs regular uppercase content
          // Check if it's a known section header pattern
          const sectionHeaders = [
            'PROFESSIONAL SUMMARY', 'PROFESSIONAL EXPERIENCE', 'EXPERIENCE',
            'EDUCATION', 'TECHNICAL SKILLS', 'SKILLS', 'KEY ACHIEVEMENTS',
            'CORE RESPONSIBILITIES', 'CERTIFICATIONS', 'PROJECTS', 'REFERENCES',
            'WORK HISTORY', 'EMPLOYMENT', 'QUALIFICATIONS', 'OBJECTIVE'
          ]
          
          const isKnownHeader = sectionHeaders.some(header => 
            trimmedLine.includes(header) || trimmedLine === header
          )
          
          // If it's a known header or looks like a header (short, no punctuation)
          if (isKnownHeader || (trimmedLine.length < 30 && !trimmedLine.includes('.') && !trimmedLine.includes(',') && !trimmedLine.includes('|'))) {
            doc.setFont('helvetica', 'bold')
            y = addTextWithPageBreak(trimmedLine, margins.left, y)
            doc.setFont('helvetica', 'normal')
          } else {
            // Normal text that just happens to be uppercase (like company names, acronyms)
            doc.setFont('helvetica', 'normal')
            y = addTextWithPageBreak(trimmedLine, margins.left, y)
          }
        } else if (trimmedLine.startsWith('*')) {
          // Sub-header with asterisk
          doc.setFont('helvetica', 'italic')
          y = addTextWithPageBreak(trimmedLine.substring(1).trim(), margins.left, y)
          doc.setFont('helvetica', 'normal')
        } else if (trimmedLine.length === 0) {
          // Empty line - add spacing
          y += lineHeight / 2
        } else {
          // Regular paragraph text - normal font
          doc.setFont('helvetica', 'normal')
          y = addTextWithPageBreak(trimmedLine, margins.left, y)
        }
      })
      
      y += sectionSpacing
    }
  })
  
  // Add footer
  const footerY = pageHeight - 10
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text('Generated by OzSparkHub Resume AI • store.ozsparkhub.com.au', pageWidth / 2, footerY, { align: 'center' })
  
  return doc.output('blob')
}

/**
 * Download improved PDF
 */
export function downloadImprovedPDF(content: string, filename: string = 'resume-optimized.pdf') {
  try {
    const blob = generateImprovedPDF(content)
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
    console.error('PDF download failed:', error)
    throw error
  }
}