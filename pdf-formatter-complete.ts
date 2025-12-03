/**
 * Complete PDF formatter for perfect resume rendering
 * Handles all text properly and preserves formatting
 */

import jsPDF from 'jspdf'

/**
 * Clean and normalize text for PDF generation
 */
function cleanTextForPDF(text: string): string {
  if (!text) return ''
  
  // Fix common encoding issues
  return text
    .replace(/â€™/g, "'")           // Fix apostrophe
    .replace(/â€œ|â€\u009d/g, '"')  // Fix quotes
    .replace(/â€"/g, '—')           // Fix em dash
    .replace(/â€¢/g, '•')           // Fix bullet
    .replace(/â€¦/g, '...')         // Fix ellipsis
    .replace(/\r\n/g, '\n')         // Normalize line breaks
    .replace(/\r/g, '\n')
    .replace(/\t/g, '    ')         // Convert tabs to spaces
    .trim()
}

/**
 * Generate complete PDF with all content preserved
 */
export function generateCompletePDF(content: string): Blob {
  // Input validation
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('Cannot generate PDF: Content is empty or invalid')
  }

  // Clean the content
  const cleanedContent = cleanTextForPDF(content)
  console.log('PDF Generator (Complete): Processing', cleanedContent.length, 'characters')

  // Create PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  
  // PDF dimensions and margins
  const pageHeight = doc.internal.pageSize.height
  const pageWidth = doc.internal.pageSize.width
  const margins = { top: 15, bottom: 15, left: 15, right: 15 }
  const maxWidth = pageWidth - margins.left - margins.right
  
  // Split content into lines
  const lines = cleanedContent.split('\n')
  
  // Typography settings
  let currentY = margins.top
  const normalFontSize = 10
  const headerFontSize = 11
  const titleFontSize = 14
  const lineHeight = 4.5
  const paragraphSpacing = 2
  const sectionSpacing = 6
  
  // Section headers to detect
  const sectionHeaders = [
    'PROFESSIONAL SUMMARY', 'PROFESSIONAL EXPERIENCE', 'EXPERIENCE',
    'EDUCATION', 'TECHNICAL SKILLS', 'SKILLS', 'KEY ACHIEVEMENTS',
    'CORE RESPONSIBILITIES', 'CORE COMPETENCIES', 'CERTIFICATIONS',
    'PROJECTS', 'REFERENCES', 'WORK HISTORY', 'EMPLOYMENT',
    'QUALIFICATIONS', 'OBJECTIVE', 'CAREER OBJECTIVE'
  ]
  
  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number = 10): void => {
    if (currentY + requiredSpace > pageHeight - margins.bottom) {
      doc.addPage()
      currentY = margins.top
    }
  }
  
  // Helper function to add text with proper wrapping
  const addWrappedText = (
    text: string, 
    fontSize: number = normalFontSize, 
    fontStyle: 'normal' | 'bold' | 'italic' = 'normal',
    indent: number = 0
  ): void => {
    if (!text.trim()) {
      currentY += paragraphSpacing
      return
    }
    
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', fontStyle)
    
    // Split text to fit within max width
    const wrappedLines = doc.splitTextToSize(text, maxWidth - indent)
    
    wrappedLines.forEach((line: string, index: number) => {
      checkNewPage()
      doc.text(line, margins.left + indent, currentY)
      currentY += lineHeight
    })
  }
  
  // Process first line as name (if it looks like a name)
  let lineIndex = 0
  const firstLine = lines[0]?.trim()
  
  // Check if first line is likely a name (not a section header)
  if (firstLine && !sectionHeaders.some(h => firstLine.toUpperCase().includes(h))) {
    // Render name in larger font
    addWrappedText(firstLine, titleFontSize, 'bold')
    currentY += paragraphSpacing
    lineIndex = 1
    
    // Check next few lines for contact info
    while (lineIndex < Math.min(5, lines.length)) {
      const line = lines[lineIndex]?.trim()
      if (!line) {
        lineIndex++
        continue
      }
      
      // Check if this looks like contact info (email, phone, address)
      if (line.includes('@') || line.includes('|') || 
          line.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) ||
          line.toLowerCase().includes('linkedin')) {
        addWrappedText(line, normalFontSize, 'normal')
        lineIndex++
      } else {
        // Not contact info, stop checking
        break
      }
    }
    
    currentY += sectionSpacing
  }
  
  // Process remaining lines
  for (let i = lineIndex; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()
    
    // Skip empty lines but add spacing
    if (!trimmedLine) {
      currentY += paragraphSpacing
      continue
    }
    
    // Check if this is a section header
    const isHeader = sectionHeaders.some(header => 
      trimmedLine.toUpperCase() === header ||
      trimmedLine.toUpperCase().includes(header)
    )
    
    if (isHeader) {
      // Section header
      currentY += sectionSpacing
      checkNewPage(15)
      addWrappedText(trimmedLine.toUpperCase(), headerFontSize, 'bold')
      currentY += paragraphSpacing
    } else if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
      // Bullet point
      addWrappedText(trimmedLine, normalFontSize, 'normal', 5)
    } else if (trimmedLine.includes(' | ') && trimmedLine.split(' | ').length === 2) {
      // Job title or position line (e.g., "Software Engineer | 2020-2023")
      addWrappedText(trimmedLine, normalFontSize, 'bold')
    } else if (trimmedLine.match(/^\d{4}\s*[-–]\s*(\d{4}|Present)/i)) {
      // Date range line
      addWrappedText(trimmedLine, normalFontSize, 'italic')
    } else if (trimmedLine.match(/^[A-Z][A-Z\s]{2,}$/)) {
      // All caps line (potential sub-header)
      if (trimmedLine.length < 50) {
        addWrappedText(trimmedLine, normalFontSize, 'bold')
      } else {
        // Long all-caps text, treat as normal
        addWrappedText(trimmedLine, normalFontSize, 'normal')
      }
    } else {
      // Regular text
      addWrappedText(trimmedLine, normalFontSize, 'normal')
    }
  }
  
  // Add footer on last page
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.setFont('helvetica', 'normal')
  const footerY = pageHeight - 8
  doc.text(
    'Generated by OzSparkHub Resume AI • store.ozsparkhub.com.au',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  )
  
  return doc.output('blob')
}

/**
 * Download complete PDF with all content
 */
export function downloadCompletePDF(content: string, filename: string = 'resume.pdf'): boolean {
  try {
    if (!content || content.trim().length < 50) {
      throw new Error('Content is too short or empty')
    }
    
    const blob = generateCompletePDF(content)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('✅ PDF downloaded successfully:', filename)
    return true
  } catch (error) {
    console.error('❌ PDF download failed:', error)
    throw error
  }
}

/**
 * Generate PDF from parsed resume data for better structure
 */
export function generateStructuredPDF(resumeData: any): Blob {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  
  const pageHeight = doc.internal.pageSize.height
  const pageWidth = doc.internal.pageSize.width
  const margins = { top: 15, bottom: 15, left: 15, right: 15 }
  const maxWidth = pageWidth - margins.left - margins.right
  
  let currentY = margins.top
  
  // Helper to add new page if needed
  const checkNewPage = (space: number = 10) => {
    if (currentY + space > pageHeight - margins.bottom) {
      doc.addPage()
      currentY = margins.top
    }
  }
  
  // Name
  if (resumeData.name) {
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text(resumeData.name, margins.left, currentY)
    currentY += 8
  }
  
  // Contact info
  if (resumeData.email || resumeData.phone || resumeData.location) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const contactParts = []
    if (resumeData.email) contactParts.push(resumeData.email)
    if (resumeData.phone) contactParts.push(resumeData.phone)
    if (resumeData.location) contactParts.push(resumeData.location)
    
    if (contactParts.length > 0) {
      doc.text(contactParts.join(' | '), margins.left, currentY)
      currentY += 6
    }
  }
  
  // Professional Summary
  if (resumeData.summary) {
    currentY += 4
    checkNewPage()
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('PROFESSIONAL SUMMARY', margins.left, currentY)
    currentY += 5
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const summaryLines = doc.splitTextToSize(resumeData.summary, maxWidth)
    summaryLines.forEach((line: string) => {
      checkNewPage()
      doc.text(line, margins.left, currentY)
      currentY += 4.5
    })
  }
  
  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    currentY += 6
    checkNewPage()
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('PROFESSIONAL EXPERIENCE', margins.left, currentY)
    currentY += 5
    
    resumeData.experience.forEach((job: any) => {
      checkNewPage(20)
      
      // Job title and company
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      if (job.title) {
        doc.text(job.title, margins.left, currentY)
        currentY += 4.5
      }
      
      if (job.company || job.dates) {
        doc.setFont('helvetica', 'italic')
        const jobLine = [job.company, job.dates].filter(Boolean).join(' | ')
        doc.text(jobLine, margins.left, currentY)
        currentY += 4.5
      }
      
      // Job description
      if (job.description) {
        doc.setFont('helvetica', 'normal')
        const descLines = doc.splitTextToSize(job.description, maxWidth - 5)
        descLines.forEach((line: string) => {
          checkNewPage()
          doc.text(line, margins.left + 5, currentY)
          currentY += 4.5
        })
      }
      
      currentY += 3
    })
  }
  
  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    currentY += 6
    checkNewPage()
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('EDUCATION', margins.left, currentY)
    currentY += 5
    
    doc.setFontSize(10)
    resumeData.education.forEach((edu: any) => {
      checkNewPage(10)
      doc.setFont('helvetica', 'bold')
      if (edu.degree) {
        doc.text(edu.degree, margins.left, currentY)
        currentY += 4.5
      }
      
      if (edu.school || edu.dates) {
        doc.setFont('helvetica', 'normal')
        const eduLine = [edu.school, edu.dates].filter(Boolean).join(' | ')
        doc.text(eduLine, margins.left, currentY)
        currentY += 4.5
      }
      
      currentY += 2
    })
  }
  
  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    currentY += 6
    checkNewPage()
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('TECHNICAL SKILLS', margins.left, currentY)
    currentY += 5
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const skillsText = resumeData.skills.join(', ')
    const skillLines = doc.splitTextToSize(skillsText, maxWidth)
    skillLines.forEach((line: string) => {
      checkNewPage()
      doc.text(line, margins.left, currentY)
      currentY += 4.5
    })
  }
  
  // Footer
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  const footerY = pageHeight - 8
  doc.text(
    'Generated by OzSparkHub Resume AI',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  )
  
  return doc.output('blob')
}