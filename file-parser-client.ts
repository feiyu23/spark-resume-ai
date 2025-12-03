/**
 * Client-side file parser
 * Uses API endpoint for Word documents, client-side for text files
 */

export interface ParseResult {
  success: boolean
  text: string
  error?: string
}

/**
 * Parse resume file using appropriate method
 */
export async function parseResumeFile(file: File): Promise<ParseResult> {
  const fileName = file.name.toLowerCase()
  
  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    return {
      success: false,
      text: '',
      error: 'File size exceeds 10MB limit'
    }
  }
  
  try {
    // For text files, parse client-side
    if (fileName.endsWith('.txt')) {
      const text = await file.text()
      const cleanText = text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
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
    }
    
    // For Word and PDF files, use server API
    if (fileName.endsWith('.doc') || fileName.endsWith('.docx') || fileName.endsWith('.pdf')) {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData
      })
      
      const result = await response.json()
      
      if (result.success) {
        return {
          success: true,
          text: result.text
        }
      } else {
        return {
          success: false,
          text: '',
          error: result.error || 'Failed to parse document'
        }
      }
    }
    
    // Unsupported format
    return {
      success: false,
      text: '',
      error: 'Unsupported file format. Please upload PDF, Word (.doc/.docx), or text (.txt) files.'
    }
    
  } catch (error) {
    console.error('File parsing error:', error)
    return {
      success: false,
      text: '',
      error: `Failed to parse file: ${error instanceof Error ? error.message : 'Network error'}`
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
  
  return {
    name,
    email: emailMatch?.[0] || null,
    phone: phoneMatch?.[0] || null,
    fullText: text
  }
}// Fix Word parsing
