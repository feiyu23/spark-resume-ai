/**
 * Enhanced PDF Generator
 * Converts optimized resume text content directly to PDF
 * Fixes the issue where template PDF is downloaded instead of actual content
 */

import jsPDF from 'jspdf'

/**
 * Format text for PDF generation (prevent blank PDFs)
 * Inlined from pdf-parser-enhanced to avoid dependency issues
 */
function formatForPDFGeneration(text: string): string {
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
    formatted = formatted.replace(regex, '\n\n$2\n' + '-'.repeat(30) + '\n')
  })
  
  // 3. Ensure minimum content
  if (formatted.trim().length < 100) {
    formatted += '\n\n[Resume content appears to be incomplete. Please check the original file.]'
  }
  
  return formatted
}

export interface EnhancedResumeData {
  content: string // The actual optimized resume text
  metadata?: {
    name?: string
    email?: string
    phone?: string
    filename?: string
  }
}

/**
 * Generate PDF from plain text resume content
 * This ensures the actual optimized content is in the PDF, not a template
 */
export const generateEnhancedPDF = (data: EnhancedResumeData): Blob => {
  // Input validation
  if (!data || !data.content || typeof data.content !== 'string' || data.content.trim().length === 0) {
    console.error('PDF Generator: Invalid or empty content provided', { data })
    // Generate error PDF instead of throwing
    const errorDoc = new jsPDF()
    errorDoc.setFontSize(12)
    errorDoc.text('Error: No resume content available', 20, 20)
    errorDoc.text('Please upload a valid resume file and try again.', 20, 30)
    return errorDoc.output('blob')
  }

  // Format content for PDF generation to prevent blank PDFs
  const formattedContent = formatForPDFGeneration(data.content)
  console.log('PDF Generator: Starting generation with formatted content length:', formattedContent.length)

  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Set font and size
  doc.setFont('helvetica')
  doc.setFontSize(11)

  // Page dimensions
  const pageHeight = doc.internal.pageSize.height
  const pageWidth = doc.internal.pageSize.width
  const margins = {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20
  }
  
  // Available text width
  const maxWidth = pageWidth - margins.left - margins.right

  // Split content into lines that fit the page width - with error handling
  let lines: string[]
  try {
    lines = doc.splitTextToSize(formattedContent, maxWidth)
    console.log('PDF Generator: Split into', lines.length, 'lines')
    if (lines.length === 0) {
      console.warn('PDF Generator: splitTextToSize returned empty array')
      // Fallback: split by line breaks manually
      lines = formattedContent.split(/\r?\n/)
    }
  } catch (error) {
    console.error('PDF Generator: Error splitting text:', error)
    // Fallback: split by line breaks manually
    lines = data.content.split(/\r?\n/)
  }
  
  // Track current Y position
  let y = margins.top
  const lineHeight = 5 // Line spacing in mm
  
  // Add each line to the PDF
  for (let i = 0; i < lines.length; i++) {
    // Check if we need a new page
    if (y + lineHeight > pageHeight - margins.bottom) {
      doc.addPage()
      y = margins.top
    }
    
    // Smart header detection - only treat as headers if they're common resume section titles
    const line = lines[i]
    const commonHeaders = [
      'PROFESSIONAL SUMMARY', 'SUMMARY', 'PROFILE',
      'PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE', 'EXPERIENCE', 'EMPLOYMENT',
      'EDUCATION', 'QUALIFICATIONS', 'ACADEMIC BACKGROUND',
      'SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES', 'KEY SKILLS',
      'ACHIEVEMENTS', 'KEY ACHIEVEMENTS', 'ACCOMPLISHMENTS',
      'CERTIFICATIONS', 'CERTIFICATES', 'PROFESSIONAL CERTIFICATIONS',
      'PROJECTS', 'KEY PROJECTS', 'NOTABLE PROJECTS',
      'REFERENCES', 'PROFESSIONAL REFERENCES'
    ]
    
    // Check if this line is actually a section header
    const isActualHeader = line && commonHeaders.some(header => 
      line.toUpperCase().trim() === header || 
      line.toUpperCase().trim().includes(header)
    )
    
    if (isActualHeader) {
      // True section header formatting
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(line, margins.left, y)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      y += lineHeight * 1.5 // Extra space after headers
    } else if (line.startsWith('•')) {
      // Bullet point formatting
      doc.text(line, margins.left + 5, y) // Indent bullets
      y += lineHeight
    } else {
      // Regular text - preserve original case
      // Don't force any case conversion, just render as-is
      doc.text(line, margins.left, y)
      y += lineHeight
    }
  }

  // Add footer with OzSparkHub branding
  const footerY = pageHeight - 10
  doc.setFontSize(8)
  doc.setTextColor(128, 128, 128)
  doc.text('Generated by OzSparkHub Resume AI • store.ozsparkhub.com.au', pageWidth / 2, footerY, { align: 'center' })
  
  // Return as blob
  return doc.output('blob')
}

/**
 * Download enhanced PDF with actual content
 */
export const downloadEnhancedPDF = (
  content: string, 
  filename: string = 'resume-optimized.pdf',
  metadata?: EnhancedResumeData['metadata']
) => {
  try {
    const data: EnhancedResumeData = {
      content,
      metadata
    }
    
    const blob = generateEnhancedPDF(data)
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
    console.error('Enhanced PDF download failed:', error)
    throw error
  }
}

/**
 * Generate clean text version for download
 */
export const downloadTextFile = (content: string, filename: string = 'resume-optimized.txt') => {
  const blob = new Blob([content], { type: 'text/plain' })
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
 * Format resume content for better PDF rendering
 * Ensures proper spacing and structure
 */
export const formatResumeForPDF = (content: string): string => {
  // Clean up extra whitespace
  let formatted = content.trim()
  
  // Only add line breaks for actual section headers, not all caps text
  const sectionHeaders = ['PROFESSIONAL SUMMARY', 'SUMMARY', 'PROFESSIONAL EXPERIENCE', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'ACHIEVEMENTS', 'CERTIFICATIONS', 'PROJECTS', 'REFERENCES']
  sectionHeaders.forEach(header => {
    const regex = new RegExp(`(^|\n)(${header})(\n|$)`, 'gim')
    formatted = formatted.replace(regex, '\n\n$2\n')
  })
  
  // Ensure bullets are properly formatted
  formatted = formatted.replace(/^[\*\-]\s*/gm, '• ')
  
  // Remove multiple consecutive blank lines
  formatted = formatted.replace(/\n{3,}/g, '\n\n')
  
  // Ensure proper spacing around sections
  const sections = ['EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROFESSIONAL SUMMARY', 'SUMMARY', 'ACHIEVEMENTS', 'CERTIFICATIONS']
  sections.forEach(section => {
    const regex = new RegExp(`(^|\n)(${section})(\n|$)`, 'gi')
    formatted = formatted.replace(regex, '\n\n$2\n')
  })
  
  return formatted
}

/**
 * Helper function to check if a line is a known resume section header
 */
const isKnownHeader = (line: string): boolean => {
  const commonHeaders = [
    'PROFESSIONAL SUMMARY', 'SUMMARY', 'PROFILE',
    'PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE', 'EXPERIENCE', 'EMPLOYMENT',
    'EDUCATION', 'QUALIFICATIONS', 'ACADEMIC BACKGROUND',
    'SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES', 'KEY SKILLS',
    'ACHIEVEMENTS', 'KEY ACHIEVEMENTS', 'ACCOMPLISHMENTS',
    'CERTIFICATIONS', 'CERTIFICATES', 'PROFESSIONAL CERTIFICATIONS',
    'PROJECTS', 'KEY PROJECTS', 'NOTABLE PROJECTS',
    'REFERENCES', 'PROFESSIONAL REFERENCES'
  ]
  
  return line && commonHeaders.some(header => 
    line.toUpperCase().trim() === header || 
    line.toUpperCase().trim().includes(header)
  )
}

/**
 * Enhanced HTML export for Word compatibility
 */
export const generateEnhancedWordHTML = (content: string, metadata?: EnhancedResumeData['metadata']): string => {
  // Format the content for better Word rendering
  const formatted = formatResumeForPDF(content)
  
  // Convert text to HTML with proper formatting
  const lines = formatted.split('\n')
  let html = ''
  
  for (const line of lines) {
    if (!line.trim()) {
      html += '<br/>'
    } else if (isKnownHeader(line)) {
      // Only treat as headers if they're actual resume section headers
      html += `<h2 style="color: #1e293b; font-size: 14pt; margin: 20px 0 10px 0;">${line}</h2>`
    } else if (line.startsWith('•')) {
      // Bullet points
      html += `<li style="margin-left: 20px; margin-bottom: 5px;">${line.substring(1).trim()}</li>`
    } else {
      // Regular paragraphs
      html += `<p style="margin: 10px 0;">${line}</p>`
    }
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${metadata?.name || 'Resume'}</title>
      <style>
        body {
          font-family: 'Calibri', 'Arial', sans-serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #333;
          max-width: 21cm;
          margin: 2cm auto;
          padding: 20px;
        }
        h1 { font-size: 24pt; color: #1e293b; }
        h2 { 
          font-size: 14pt; 
          color: #1e293b; 
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 3px;
        }
        li { list-style-type: disc; }
      </style>
    </head>
    <body>
      ${html}
      <hr style="margin-top: 50px; border: none; border-top: 1px solid #e2e8f0;">
      <p style="text-align: center; color: #999; font-size: 9pt;">
        Generated by OzSparkHub Resume AI • store.ozsparkhub.com.au
      </p>
    </body>
    </html>
  `
}

/**
 * Download as Word-compatible document
 */
export const downloadEnhancedWord = (
  content: string,
  filename: string = 'resume-optimized.doc',
  metadata?: EnhancedResumeData['metadata']
) => {
  const htmlContent = generateEnhancedWordHTML(content, metadata)
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