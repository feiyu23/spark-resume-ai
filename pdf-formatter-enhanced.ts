/**
 * Enhanced PDF Formatter with proper bold headers and modern layout
 * Matches the quality of Word document output
 */

import jsPDF from 'jspdf'

/**
 * Clean and normalize text for PDF generation
 */
function cleanTextForPDF(text: string): string {
  if (!text) return ''
  
  return text
    .replace(/â€™/g, "'")
    .replace(/â€œ|â€\u009d/g, '"')
    .replace(/â€"/g, '—')
    .replace(/â€¢/g, '•')
    .replace(/â€¦/g, '...')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, '    ')
    .trim()
}

/**
 * Enhanced PDF generation with modern formatting
 */
export function generateEnhancedPDF(content: string): Blob {
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('Cannot generate PDF: Content is empty or invalid')
  }

  const cleanedContent = cleanTextForPDF(content)
  console.log('Enhanced PDF Generator: Processing', cleanedContent.length, 'characters')

  // Create PDF with better defaults
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })
  
  // Layout settings
  const pageHeight = doc.internal.pageSize.height
  const pageWidth = doc.internal.pageSize.width
  const margins = { top: 20, bottom: 20, left: 20, right: 20 }
  const maxWidth = pageWidth - margins.left - margins.right
  
  // Typography - matched to Word formatting
  const fonts = {
    name: { size: 16, style: 'bold' as 'bold' },
    title: { size: 11, style: 'italic' as 'italic' },
    header: { size: 12, style: 'bold' as 'bold' },
    subheader: { size: 11, style: 'bold' as 'bold' },
    normal: { size: 10, style: 'normal' as 'normal' },
    small: { size: 9, style: 'italic' as 'italic' }
  }
  
  const spacing = {
    line: 5,
    paragraph: 3,
    section: 8,
    subsection: 5,
    bullet: 2
  }
  
  // Known section headers - comprehensive list
  const sectionHeaders = new Set([
    'PROFESSIONAL SUMMARY', 'SUMMARY', 'OBJECTIVE', 'CAREER OBJECTIVE',
    'PROFESSIONAL EXPERIENCE', 'EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT', 'WORK HISTORY',
    'EDUCATION', 'ACADEMIC BACKGROUND', 'QUALIFICATIONS',
    'TECHNICAL SKILLS', 'SKILLS', 'CORE COMPETENCIES', 'KEY SKILLS',
    'KEY ACHIEVEMENTS', 'ACHIEVEMENTS', 'ACCOMPLISHMENTS',
    'CERTIFICATIONS', 'LICENSES', 'CERTIFICATES',
    'PROJECTS', 'KEY PROJECTS', 
    'REFERENCES', 'PROFESSIONAL REFERENCES',
    'CORE RESPONSIBILITIES', 'RESPONSIBILITIES'
  ])
  
  // Split content into lines
  const lines = cleanedContent.split('\n')
  let currentY = margins.top
  let isFirstLine = true
  let lastWasEmpty = false
  let inContactSection = false
  
  // Helper: Check if new page needed
  const checkNewPage = (requiredSpace: number = 15): void => {
    if (currentY + requiredSpace > pageHeight - margins.bottom) {
      doc.addPage()
      currentY = margins.top
    }
  }
  
  // Helper: Draw section underline
  const drawSectionLine = (): void => {
    doc.setLineWidth(0.5)
    doc.setDrawColor(0, 0, 0)
    doc.line(margins.left, currentY, pageWidth - margins.right, currentY)
    currentY += 2
  }
  
  // Helper: Add wrapped text with proper formatting
  const addText = (
    text: string,
    font: { size: number; style: 'normal' | 'bold' | 'italic' },
    align: 'left' | 'center' | 'right' | 'justify' = 'left',
    indent: number = 0
  ): void => {
    if (!text.trim()) {
      currentY += spacing.paragraph
      return
    }
    
    doc.setFontSize(font.size)
    doc.setFont('helvetica', font.style)
    
    const lines = doc.splitTextToSize(text, maxWidth - indent)
    
    lines.forEach((line: string) => {
      checkNewPage()
      
      if (align === 'center') {
        const textWidth = doc.getTextWidth(line)
        const x = (pageWidth - textWidth) / 2
        doc.text(line, x, currentY)
      } else if (align === 'right') {
        doc.text(line, pageWidth - margins.right, currentY, { align: 'right' })
      } else {
        doc.text(line, margins.left + indent, currentY)
      }
      
      currentY += spacing.line
    })
  }
  
  // Process each line
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trim()
    const upperLine = trimmedLine.toUpperCase()
    const nextLine = lines[i + 1]?.trim() || ''
    
    // Handle empty lines
    if (!trimmedLine) {
      if (!lastWasEmpty) {
        currentY += spacing.paragraph
      }
      lastWasEmpty = true
      continue
    }
    lastWasEmpty = false
    
    // Detect and format name (first non-empty line that's not a header)
    if (isFirstLine && !sectionHeaders.has(upperLine)) {
      addText(trimmedLine, fonts.name, 'center')
      currentY += spacing.paragraph
      isFirstLine = false
      inContactSection = true
      continue
    }
    
    // Detect contact information (email, phone, location, LinkedIn)
    if (inContactSection) {
      if (trimmedLine.includes('@') || 
          trimmedLine.includes('|') ||
          trimmedLine.match(/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/) ||
          trimmedLine.match(/\+61\s?\d/) ||
          trimmedLine.toLowerCase().includes('linkedin') ||
          trimmedLine.match(/\b(NSW|VIC|QLD|WA|SA|TAS|NT|ACT)\b/)) {
        addText(trimmedLine, fonts.small, 'center')
        continue
      } else {
        inContactSection = false
        currentY += spacing.section
      }
    }
    
    // Detect section headers
    if (sectionHeaders.has(upperLine)) {
      currentY += spacing.section
      checkNewPage(20)
      addText(upperLine, fonts.header)
      drawSectionLine()
      currentY += spacing.paragraph
      continue
    }
    
    // Detect job titles/positions (contains dates or "Present")
    if (trimmedLine.match(/\d{4}/) || 
        trimmedLine.includes('Present') || 
        trimmedLine.includes('Current') ||
        trimmedLine.includes(' – ') ||
        trimmedLine.includes(' - ')) {
      
      // Check if this looks like a job title line
      if (trimmedLine.includes('–') || trimmedLine.includes('-')) {
        // Split into title and date
        const parts = trimmedLine.split(/\s*[–-]\s*/)
        if (parts.length >= 2) {
          // Job title line
          currentY += spacing.subsection
          addText(trimmedLine, fonts.subheader)
          continue
        }
      }
      
      // Company/location line
      if (nextLine && (nextLine.startsWith('•') || nextLine.startsWith('-'))) {
        addText(trimmedLine, fonts.small)
        continue
      }
    }
    
    // Detect bullet points
    if (trimmedLine.startsWith('•') || 
        trimmedLine.startsWith('-') || 
        trimmedLine.startsWith('*') ||
        trimmedLine.startsWith('·')) {
      addText(trimmedLine, fonts.normal, 'left', 5)
      currentY += spacing.bullet
      continue
    }
    
    // Detect "Key Achievements" or similar subsections
    if (upperLine.startsWith('KEY ') || 
        upperLine.startsWith('CORE ') ||
        upperLine === 'ACHIEVEMENTS' ||
        upperLine === 'RESPONSIBILITIES') {
      currentY += spacing.subsection
      addText(trimmedLine, fonts.subheader)
      currentY += spacing.paragraph
      continue
    }
    
    // Detect education entries (contains Bachelor, Master, Diploma, etc.)
    if (trimmedLine.match(/\b(Bachelor|Master|Diploma|Certificate|Degree|MBA|PhD|BSc|MSc|BA|MA)\b/i)) {
      currentY += spacing.subsection
      addText(trimmedLine, fonts.subheader)
      continue
    }
    
    // Detect skills lists (contains colon)
    if (trimmedLine.includes(':') && trimmedLine.length < 200) {
      const [label, value] = trimmedLine.split(':')
      if (label && value) {
        doc.setFontSize(fonts.normal.size)
        doc.setFont('helvetica', 'bold')
        doc.text(label + ':', margins.left, currentY)
        doc.setFont('helvetica', 'normal')
        const labelWidth = doc.getTextWidth(label + ': ')
        const wrappedValue = doc.splitTextToSize(value.trim(), maxWidth - labelWidth - 2)
        wrappedValue.forEach((line: string, index: number) => {
          if (index === 0) {
            doc.text(line, margins.left + labelWidth, currentY)
          } else {
            currentY += spacing.line
            checkNewPage()
            doc.text(line, margins.left + labelWidth, currentY)
          }
        })
        currentY += spacing.line
        continue
      }
    }
    
    // Regular paragraph text
    addText(trimmedLine, fonts.normal, 'justify')
    currentY += spacing.paragraph
  }
  
  // Add footer
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.setFont('helvetica', 'normal')
  const footerY = pageHeight - 10
  doc.text(
    'Generated by OzSparkHub Resume AI • store.ozsparkhub.com.au',
    pageWidth / 2,
    footerY,
    { align: 'center' }
  )
  
  return doc.output('blob')
}

/**
 * Download enhanced PDF
 */
export function downloadEnhancedPDF(content: string, filename: string = 'resume.pdf'): boolean {
  try {
    if (!content || content.trim().length < 50) {
      throw new Error('Content is too short or empty')
    }
    
    const blob = generateEnhancedPDF(content)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    console.log('✅ Enhanced PDF downloaded successfully:', filename)
    return true
  } catch (error) {
    console.error('❌ PDF download failed:', error)
    throw error
  }
}