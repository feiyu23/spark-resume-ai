/**
 * Enhanced Word Document Parser
 * Client-side Word parsing is disabled to prevent sharp dependency issues
 * This module now only provides type definitions and server-side parsing helpers
 */

// import mammoth from 'mammoth' // Disabled: causes sharp bundle issues in client-side

export interface WordParseResult {
  success: boolean
  text: string
  html?: string
  error?: string
}

/**
 * Parse Word document with HTML conversion for better structure preservation
 * DISABLED: Client-side parsing causes sharp dependency issues
 */
export async function parseWordWithHTML(file: File): Promise<WordParseResult> {
  return {
    success: false,
    text: '',
    error: 'Client-side Word parsing is disabled. Please use server-side API endpoint instead.'
  }
}

/**
 * Parse Word document with better raw text handling
 * DISABLED: Client-side parsing causes sharp dependency issues
 */
export async function parseWordRaw(file: File): Promise<WordParseResult> {
  return {
    success: false,
    text: '',
    error: 'Client-side Word parsing is disabled. Please use server-side API endpoint instead.'
  }
}

/**
 * Clean Word text while preserving paragraph structure
 */
function cleanWordText(text: string): string {
  if (!text) return ''
  
  // First, normalize line endings
  let cleaned = text
    .replace(/\r\n/g, '\n')  // Windows line endings
    .replace(/\r/g, '\n')     // Old Mac line endings
  
  // Split into lines to process each line
  const lines = cleaned.split('\n')
  const processedLines: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    
    // Trim each line
    const trimmedLine = line.trim()
    
    // Skip completely empty lines but preserve paragraph breaks
    if (trimmedLine === '') {
      // Check if this is a paragraph break (empty line between content)
      if (i > 0 && i < lines.length - 1) {
        const prevLine = lines[i - 1].trim()
        const nextLine = lines[i + 1].trim()
        if (prevLine !== '' || nextLine !== '') {
          // This is a paragraph break, keep one empty line
          if (processedLines.length > 0 && processedLines[processedLines.length - 1] !== '') {
            processedLines.push('')
          }
        }
      }
    } else {
      // Process non-empty lines
      // Replace tabs with spaces
      const processedLine = trimmedLine
        .replace(/\t+/g, ' ')
        .replace(/\s+/g, ' ')  // Multiple spaces to single space
      
      processedLines.push(processedLine)
    }
  }
  
  // Join lines and clean up multiple empty lines
  cleaned = processedLines
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')  // Maximum 2 newlines (one empty line)
    .trim()
  
  // Fix common Word formatting issues
  cleaned = cleaned
    // Fix quotes
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    // Fix dashes
    .replace(/[–—]/g, '-')
    // Fix ellipsis
    .replace(/…/g, '...')
    // Fix bullet points
    .replace(/[•·∙▪▫◦‣⁃]/g, '•')
  
  return cleaned
}

/**
 * Convert HTML to structured text
 */
function htmlToText(html: string): string {
  if (!html) return ''
  
  // Remove style tags and their content
  let text = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  
  // Replace headings with uppercase text and newlines
  text = text.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n\n$1\n\n')
  
  // Replace paragraphs with double newlines
  text = text.replace(/<p[^>]*>/gi, '\n\n')
  text = text.replace(/<\/p>/gi, '')
  
  // Replace line breaks
  text = text.replace(/<br\s*\/?>/gi, '\n')
  
  // Replace list items with bullet points
  text = text.replace(/<li[^>]*>/gi, '\n• ')
  text = text.replace(/<\/li>/gi, '')
  
  // Remove list tags
  text = text.replace(/<\/?[uo]l[^>]*>/gi, '\n')
  
  // Handle bold/strong
  text = text.replace(/<(strong|b)[^>]*>(.*?)<\/(strong|b)>/gi, '$2')
  
  // Handle italic/emphasis
  text = text.replace(/<(em|i)[^>]*>(.*?)<\/(em|i)>/gi, '$2')
  
  // Remove all other HTML tags
  text = text.replace(/<[^>]+>/g, '')
  
  // Decode HTML entities
  text = decodeHTMLEntities(text)
  
  // Clean up whitespace
  text = text
    .replace(/\n\s*\n\s*\n/g, '\n\n')  // Multiple blank lines to double
    .replace(/^\s+|\s+$/g, '')          // Trim start and end
    .replace(/[ \t]+/g, ' ')             // Multiple spaces/tabs to single space
  
  return text
}

/**
 * Decode common HTML entities
 */
function decodeHTMLEntities(text: string): string {
  const entities: { [key: string]: string } = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&ndash;': '-',
    '&mdash;': '-',
    '&bull;': '•',
    '&hellip;': '...',
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&lsquo;': "'",
    '&rsquo;': "'"
  }
  
  let result = text
  for (const [entity, char] of Object.entries(entities)) {
    result = result.replace(new RegExp(entity, 'gi'), char)
  }
  
  // Decode numeric entities
  result = result.replace(/&#(\d+);/g, (match, num) => String.fromCharCode(parseInt(num)))
  result = result.replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
  
  return result
}

/**
 * Main parser with fallback strategies
 * DISABLED: Client-side parsing causes sharp dependency issues
 */
export async function parseWordDocument(file: File): Promise<WordParseResult> {
  return {
    success: false,
    text: '',
    error: 'Client-side Word parsing is disabled. Please use the server-side API endpoint /api/parse-resume instead.'
  }
}