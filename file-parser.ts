/**
 * File Parser for Resume Documents
 * DISABLED: Client-side parsing causes sharp dependency issues
 * Use server-side API endpoint /api/parse-resume instead
 */

// import mammoth from 'mammoth' // Disabled: causes sharp bundle issues
// import * as pdfjsLib from 'pdfjs-dist' // Disabled: causes sharp bundle issues
// import { cleanExtractedText, validateExtractedText, processPDFText } from './pdf-parser-enhanced'

// // Configure PDF.js worker
// if (typeof window !== 'undefined') {
//   pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
// }

export interface ParseResult {
  success: boolean
  text: string
  error?: string
}

/**
 * Parse PDF file to text
 * DISABLED: Client-side PDF parsing causes sharp dependency issues
 */
export async function parsePDF(file: File): Promise<ParseResult> {
  return {
    success: false,
    text: '',
    error: 'Client-side PDF parsing is disabled. Please use server-side API endpoint /api/parse-resume instead.'
  }
}

/**
 * Parse Word document to text
 * DISABLED: Client-side Word parsing causes sharp dependency issues
 */
export async function parseWord(file: File): Promise<ParseResult> {
  return {
    success: false,
    text: '',
    error: 'Client-side Word parsing is disabled. Please use server-side API endpoint /api/parse-resume instead.'
  }
}

/**
 * Parse text file
 */
export async function parseText(file: File): Promise<ParseResult> {
  try {
    const text = await file.text()
    
    // Clean up the text - preserve line breaks!
    const cleanText = text
      .replace(/\r\n/g, '\n') // Windows line endings to Unix
      .replace(/\r/g, '\n') // Mac line endings to Unix
      .replace(/[ \t]+/g, ' ') // Multiple spaces/tabs to single (NOT newlines!)
      .replace(/\n{3,}/g, '\n\n') // Multiple newlines to double
      .trim()
    
    if (!cleanText) {
      return {
        success: false,
        text: '',
        error: 'File is empty'
      }
    }
    
    return {
      success: true,
      text: cleanText
    }
  } catch (error) {
    console.error('Text parsing error:', error)
    return {
      success: false,
      text: '',
      error: `Failed to parse text file: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Main file parser - automatically detects file type
 */
export async function parseResumeFile(file: File): Promise<ParseResult> {
  const fileName = file.name.toLowerCase()
  
  // Check file size (limit to 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return {
      success: false,
      text: '',
      error: 'File size exceeds 10MB limit'
    }
  }
  
  // Detect file type and parse accordingly
  if (fileName.endsWith('.pdf')) {
    return await parsePDF(file)
  } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    return await parseWord(file)
  } else if (fileName.endsWith('.txt')) {
    return await parseText(file)
  } else {
    // Try to parse as text file
    const result = await parseText(file)
    if (result.success) {
      return result
    }
    
    return {
      success: false,
      text: '',
      error: 'Unsupported file format. Please upload PDF, Word (.doc/.docx), or text (.txt) files.'
    }
  }
}

/**
 * Extract structured information from resume text
 */
export function extractResumeInfo(text: string) {
  // Extract email
  const emailMatch = text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/)
  
  // Extract phone (various formats)
  const phoneMatch = text.match(/\b(?:\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}\b/)
  
  // Extract name (usually first non-empty line)
  const lines = text.split('\n').filter(line => line.trim())
  const possibleName = lines[0]?.trim()
  const name = possibleName && possibleName.length < 50 && !possibleName.includes('@') 
    ? possibleName 
    : 'Resume User'
  
  // Extract sections
  const sections: Record<string, string> = {}
  
  // Common section headers
  const sectionHeaders = [
    'SUMMARY', 'PROFESSIONAL SUMMARY', 'OBJECTIVE',
    'EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT',
    'EDUCATION', 'QUALIFICATIONS',
    'SKILLS', 'TECHNICAL SKILLS', 'COMPETENCIES',
    'CERTIFICATIONS', 'CERTIFICATES',
    'ACHIEVEMENTS', 'ACCOMPLISHMENTS'
  ]
  
  // Try to identify sections
  const textUpper = text.toUpperCase()
  sectionHeaders.forEach(header => {
    const regex = new RegExp(`${header}[\\s\\S]*?(?=\\n[A-Z]{3,}|$)`, 'i')
    const match = text.match(regex)
    if (match) {
      sections[header] = match[0].replace(new RegExp(header, 'i'), '').trim()
    }
  })
  
  return {
    name,
    email: emailMatch?.[0] || null,
    phone: phoneMatch?.[0] || null,
    sections,
    fullText: text
  }
}