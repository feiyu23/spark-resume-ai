/**
 * Enhanced file parser with better Word document support
 * Uses both client and server methods for reliability
 */

export interface ParseResult {
  success: boolean
  text: string
  error?: string
}

/**
 * Parse Word document using mammoth (client-side with better error handling)
 */
async function parseWordClient(file: File): Promise<ParseResult> {
  try {
    console.log(`📄 Parsing Word document: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`)
    
    // Try enhanced parser first for better formatting
    try {
      const { parseWordDocument } = await import('./enhanced-word-parser')
      const result = await parseWordDocument(file)
      
      if (result.success && result.text) {
        console.log(`✅ Enhanced parser extracted ${result.text.length} characters with proper formatting`)
        return {
          success: true,
          text: result.text
        }
      }
      
      if (!result.success && result.error) {
        console.warn('Enhanced parser failed:', result.error)
      }
    } catch (enhancedError) {
      console.warn('Enhanced Word parser not available, falling back to basic parser:', enhancedError)
    }
    
    // Fallback to basic mammoth parsing
    let mammoth: any
    try {
      mammoth = await import('mammoth')
    } catch (importError) {
      console.error('Failed to import mammoth library:', importError)
      return {
        success: false,
        text: '',
        error: 'Word parsing library not available. Please try the server-side option or paste your text.'
      }
    }
    
    const arrayBuffer = await file.arrayBuffer()
    
    // Try to extract raw text first
    const result = await mammoth.extractRawText({ arrayBuffer })
    
    if (result.value && result.value.trim()) {
      // Better text cleaning that preserves paragraphs
      const lines = result.value
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .split('\n')
      
      const cleanedLines: string[] = []
      for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed) {
          // Only clean spaces within lines, not between them
          cleanedLines.push(trimmed.replace(/\t+/g, ' ').replace(/\s+/g, ' '))
        } else if (cleanedLines.length > 0 && cleanedLines[cleanedLines.length - 1] !== '') {
          // Preserve paragraph breaks
          cleanedLines.push('')
        }
      }
      
      const cleanText = cleanedLines
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
      
      console.log(`✅ Successfully extracted ${cleanText.length} characters from ${file.name}`)
      
      // Check if the text looks like valid resume content
      if (cleanText.length < 100) {
        console.warn(`⚠️ Extracted text seems too short (${cleanText.length} chars)`)
      }
      
      return {
        success: true,
        text: cleanText
      }
    }
    
    // If no text found, return error
    console.warn(`❌ No text content found in ${file.name}`)
    return {
      success: false,
      text: '',
      error: 'No text content found in Word document. The file might be corrupted or use an unsupported format.'
    }
  } catch (error) {
    console.error('Client-side Word parsing failed:', error)
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('ArrayBuffer')) {
        return {
          success: false,
          text: '',
          error: 'Failed to read the Word document. Please ensure the file is not corrupted.'
        }
      }
    }
    
    return {
      success: false,
      text: '',
      error: 'Failed to parse Word document. Please try the server-side option or paste your text.'
    }
  }
}

/**
 * Parse Word document using server API
 */
async function parseWordServer(file: File): Promise<ParseResult> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/parse-resume', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`)
    }
    
    const result = await response.json()
    
    if (result.success && result.text) {
      return {
        success: true,
        text: result.text
      }
    }
    
    return {
      success: false,
      text: '',
      error: result.error || 'Server parsing failed'
    }
  } catch (error) {
    console.error('Server-side Word parsing failed:', error)
    return {
      success: false,
      text: '',
      error: 'Failed to parse Word document on server'
    }
  }
}

/**
 * Parse PDF using PDF.js (client-side)
 */
async function parsePDFClient(file: File): Promise<ParseResult> {
  return {
    success: false,
    text: '',
    error: 'Client-side PDF parsing is disabled due to sharp dependency issues. Please use server-side API endpoint /api/parse-resume instead.'
  }
  
  /* DISABLED CODE - causes sharp bundle issues
  try {
    console.log(`📄 Parsing PDF document: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`)
    
    // Try improved parser first for better formatting
    try {
      const { parseImprovedPDF } = await import('./pdf-parser-improved')
      const text = await parseImprovedPDF(file)
      
      if (text && text.trim()) {
        console.log(`✅ Improved parser extracted ${text.length} characters with proper formatting`)
        return {
          success: true,
          text
        }
      }
    } catch (improvedError) {
      console.warn('Improved PDF parser failed, falling back to standard parser:', improvedError)
    }
    
    // Fallback to standard PDF parsing
    const pdfjsLib = await import('pdfjs-dist')
    
    // Set worker - use specific version to ensure compatibility
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.54/pdf.worker.min.js`
    
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    let fullText = ''
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      
      // Group text items by position for better formatting
      const items = textContent.items as any[]
      if (items && items.length > 0) {
        // Sort by Y position then X position
        items.sort((a, b) => {
          const yDiff = (b.transform?.[5] || 0) - (a.transform?.[5] || 0)
          if (Math.abs(yDiff) > 1) return yDiff
          return (a.transform?.[4] || 0) - (b.transform?.[4] || 0)
        })
        
        let lastY = null
        let lineText = ''
        
        for (const item of items) {
          if (!item.str) continue
          
          const y = item.transform?.[5] || 0
          
          // Detect line breaks
          if (lastY !== null && Math.abs(lastY - y) > 5) {
            fullText += lineText + '\n'
            lineText = item.str
          } else {
            lineText += (lineText ? ' ' : '') + item.str
          }
          
          lastY = y
        }
        
        if (lineText) {
          fullText += lineText + '\n'
        }
      }
    }
    
    // Clean up text - preserve line breaks!
    fullText = fullText
      .replace(/[ \t]+/g, ' ')  // Only replace spaces and tabs, NOT newlines
      .replace(/\n\s*\n/g, '\n\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim()
    
    if (fullText) {
      console.log(`✅ Standard parser extracted ${fullText.length} characters from ${file.name}`)
      return {
        success: true,
        text: fullText
      }
    }
    
    return {
      success: false,
      text: '',
      error: 'No text found in PDF. The file might be image-based or corrupted.'
    }
  } catch (error) {
    console.error('PDF parsing failed:', error)
    
    if (error instanceof Error && error.message.includes('Invalid PDF')) {
      return {
        success: false,
        text: '',
        error: 'Invalid PDF file. Please ensure the file is not corrupted.'
      }
    }
    
    return {
      success: false,
      text: '',
      error: 'Failed to parse PDF. Please try copying and pasting the text instead.'
    }
  }
  */
}

/**
 * Main file parser with fallback strategies
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
  
  // Handle text files
  if (fileName.endsWith('.txt')) {
    try {
      const text = await file.text()
      const cleanText = text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .trim()
      
      if (cleanText) {
        return {
          success: true,
          text: cleanText
        }
      }
      
      return {
        success: false,
        text: '',
        error: 'Text file is empty'
      }
    } catch (error) {
      return {
        success: false,
        text: '',
        error: 'Failed to read text file'
      }
    }
  }
  
  // Handle Word documents - try client first, then server
  if (fileName.endsWith('.doc') || fileName.endsWith('.docx')) {
    // Try client-side parsing first
    console.log('🔄 Attempting client-side Word parsing...')
    const clientResult = await parseWordClient(file)
    if (clientResult.success) {
      console.log('✅ Client-side parsing successful')
      return clientResult
    }
    
    // Fallback to server-side parsing
    console.log('⚠️ Client parsing failed:', clientResult.error)
    console.log('🔄 Attempting server-side parsing...')
    const serverResult = await parseWordServer(file)
    if (serverResult.success) {
      console.log('✅ Server-side parsing successful')
      return serverResult
    }
    
    // If both fail, provide detailed error
    console.error('❌ Both client and server parsing failed')
    return {
      success: false,
      text: '',
      error: `Unable to parse Word document. Client error: ${clientResult.error}. Server error: ${serverResult.error}. Please try copying and pasting the text instead.`
    }
  }
  
  // Handle PDF files
  if (fileName.endsWith('.pdf')) {
    // Try client-side parsing
    console.log('🔄 Attempting client-side PDF parsing...')
    const pdfResult = await parsePDFClient(file)
    if (pdfResult.success) {
      console.log('✅ Client-side PDF parsing successful')
      return pdfResult
    }
    
    // Log the failure
    console.warn('⚠️ Client PDF parsing failed:', pdfResult.error)
    
    // Server doesn't support PDF yet, so provide helpful message
    return {
      success: false,
      text: '',
      error: 'PDF parsing failed. The document might be image-based or protected. Please try: 1) Opening the PDF and copying the text manually, or 2) Converting to a Word document first.'
    }
  }
  
  // Unsupported format
  return {
    success: false,
    text: '',
    error: `Unsupported file format: ${fileName.split('.').pop()}. Please use PDF, Word, or text files.`
  }
}

/**
 * Sample resume text for testing
 */
export const sampleResumeText = `TH
PROFESSIONAL SUMMARY
Dynamic Business Intelligence leader with over 15 years of experience leading teams and driving analytics transformations in diverse sectors, consistently achieving measurable operational efficiencies and strategic outcomes. Proven track record in AI implementation, data architecture optimization, and delivering high-impact insights. Skilled communicator adept at stakeholder engagement, cross-functional collaboration, and fostering data-driven cultures.

PROFESSIONAL EXPERIENCE
National Manager – Business Intelligence
The Salvation Army – Mar 2017 to Present
Successfully led enterprise-wide Tableau and Power BI implementations, enhancing reporting efficiency by 50%.
Built organization-wide AI capabilities, achieving a 25% improvement in operational efficiency through automation.
Delivered multi-platform Azure/SQL architecture, consolidating siloed data into a unified analytics environment.

TECHNICAL SKILLS
BI Tools: Power BI, Tableau, Cognos, Qlik, DOMO
Data Platforms: SQL, MySQL, Azure, Technology One, SharePoint, AWS, Oracle
Languages/Tools: Python, R, Salesforce, CRM, JIRA
Frameworks: AI/ML adoption, data governance, predictive modelling, digital automation

EDUCATION
Master of Business Systems, Monash University, Australia – 2004–2006
Bachelor of Economics, Yang-En University, China – 1998–2002`