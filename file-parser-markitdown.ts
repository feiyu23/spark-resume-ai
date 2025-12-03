/**
 * Enhanced Resume File Parser with Microsoft MarkItDown Integration
 * Provides superior PDF and document parsing for Resume AI Suite
 */

export interface ParseResult {
  success: boolean
  text: string
  error?: string
  metadata?: {
    parser: string
    originalLength?: number
    cleanedLength?: number
    fileName: string
    fileSize: number
    processingTime?: number
  }
}

/**
 * Parse resume file using Microsoft MarkItDown (server-side)
 */
async function parseWithMarkItDown(file: File): Promise<ParseResult> {
  const startTime = Date.now()

  try {
    console.log(`🚀 Using Microsoft MarkItDown for: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`)

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/parse-resume-markitdown', {
      method: 'POST',
      body: formData
    })

    const result = await response.json()
    const processingTime = Date.now() - startTime

    if (response.ok && result.success) {
      console.log(`✅ MarkItDown parsed successfully in ${processingTime}ms`)
      console.log(`📊 Extracted ${result.metadata?.cleanedLength || result.text.length} characters`)

      return {
        success: true,
        text: result.text,
        metadata: {
          ...result.metadata,
          processingTime
        }
      }
    } else {
      console.error('❌ MarkItDown API failed:', result.error)

      return {
        success: false,
        text: '',
        error: result.error || 'MarkItDown parsing failed',
        metadata: {
          parser: 'MarkItDown (failed)',
          fileName: file.name,
          fileSize: file.size,
          processingTime
        }
      }
    }

  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error('❌ MarkItDown request failed:', error)

    return {
      success: false,
      text: '',
      error: error instanceof Error ? error.message : 'Network error calling MarkItDown API',
      metadata: {
        parser: 'MarkItDown (error)',
        fileName: file.name,
        fileSize: file.size,
        processingTime
      }
    }
  }
}

/**
 * Legacy fallback parser for unsupported formats or MarkItDown failures
 */
async function parseLegacyFallback(file: File): Promise<ParseResult> {
  const fileName = file.name.toLowerCase()
  const startTime = Date.now()

  try {
    // Import legacy parser
    const { parseResumeFile } = await import('./file-parser-enhanced')
    const result = await parseResumeFile(file)

    const processingTime = Date.now() - startTime

    return {
      success: result.success,
      text: result.text,
      error: result.error,
      metadata: {
        parser: 'Legacy Parser',
        fileName: file.name,
        fileSize: file.size,
        processingTime
      }
    }

  } catch (error) {
    const processingTime = Date.now() - startTime

    return {
      success: false,
      text: '',
      error: 'Legacy parser failed',
      metadata: {
        parser: 'Legacy Parser (failed)',
        fileName: file.name,
        fileSize: file.size,
        processingTime
      }
    }
  }
}

/**
 * Smart text file parser (direct handling for .txt files)
 */
async function parseTextFile(file: File): Promise<ParseResult> {
  const startTime = Date.now()

  try {
    const text = await file.text()
    const cleanText = text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim()

    const processingTime = Date.now() - startTime

    if (cleanText) {
      return {
        success: true,
        text: cleanText,
        metadata: {
          parser: 'Direct Text Parser',
          fileName: file.name,
          fileSize: file.size,
          processingTime
        }
      }
    }

    return {
      success: false,
      text: '',
      error: 'Text file is empty',
      metadata: {
        parser: 'Direct Text Parser (empty)',
        fileName: file.name,
        fileSize: file.size,
        processingTime
      }
    }

  } catch (error) {
    const processingTime = Date.now() - startTime

    return {
      success: false,
      text: '',
      error: 'Failed to read text file',
      metadata: {
        parser: 'Direct Text Parser (failed)',
        fileName: file.name,
        fileSize: file.size,
        processingTime
      }
    }
  }
}

/**
 * Main enhanced file parser with MarkItDown integration
 * Automatically chooses the best parsing strategy based on file type
 */
export async function parseResumeFileEnhanced(file: File): Promise<ParseResult> {
  const fileName = file.name.toLowerCase()

  // Validate file size (20MB limit)
  if (file.size > 20 * 1024 * 1024) {
    return {
      success: false,
      text: '',
      error: 'File size exceeds 20MB limit',
      metadata: {
        parser: 'Size Validator',
        fileName: file.name,
        fileSize: file.size
      }
    }
  }

  // Log parsing attempt
  console.log(`📄 Parsing resume: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`)

  // Handle text files directly (fast path)
  if (fileName.endsWith('.txt')) {
    console.log('🔄 Using direct text parser for .txt file')
    return await parseTextFile(file)
  }

  // For all other formats, try MarkItDown first
  const markitdownFormats = ['.pdf', '.docx', '.doc', '.html', '.md']
  const isMarkItDownSupported = markitdownFormats.some(ext => fileName.endsWith(ext))

  if (isMarkItDownSupported) {
    console.log('🔄 Attempting MarkItDown parsing...')
    const markitdownResult = await parseWithMarkItDown(file)

    if (markitdownResult.success) {
      console.log('✅ MarkItDown parsing successful!')
      return markitdownResult
    }

    console.warn('⚠️ MarkItDown failed, trying fallback:', markitdownResult.error)

    // For PDF files, don't fallback to legacy parser since it's disabled
    if (fileName.endsWith('.pdf')) {
      return {
        success: false,
        text: '',
        error: `MarkItDown PDF parsing failed: ${markitdownResult.error}. The PDF might be image-based, password-protected, or corrupted. Please try: 1) Opening the PDF and copying text manually, or 2) Converting to Word format first.`,
        metadata: markitdownResult.metadata
      }
    }

    // For other formats, try legacy fallback
    console.log('🔄 Trying legacy fallback parser...')
    const fallbackResult = await parseLegacyFallback(file)

    if (fallbackResult.success) {
      console.log('✅ Legacy fallback successful!')
      return {
        ...fallbackResult,
        metadata: {
          ...fallbackResult.metadata,
          parser: `${fallbackResult.metadata?.parser} (MarkItDown fallback)`
        }
      }
    }

    // Both MarkItDown and fallback failed
    return {
      success: false,
      text: '',
      error: `Both MarkItDown and legacy parsing failed. MarkItDown error: ${markitdownResult.error}. Legacy error: ${fallbackResult.error}.`,
      metadata: fallbackResult.metadata
    }
  }

  // Unsupported format
  return {
    success: false,
    text: '',
    error: `Unsupported file format: ${fileName.split('.').pop()}. Supported formats: PDF, Word (.docx, .doc), Text (.txt), HTML (.html), Markdown (.md).`,
    metadata: {
      parser: 'Format Validator',
      fileName: file.name,
      fileSize: file.size
    }
  }
}

/**
 * Parse multiple files with MarkItDown support
 */
export async function parseMultipleFiles(files: File[]): Promise<ParseResult[]> {
  console.log(`📚 Parsing ${files.length} files with MarkItDown support`)

  const results = await Promise.all(
    files.map(async (file, index) => {
      console.log(`📄 Processing file ${index + 1}/${files.length}: ${file.name}`)
      return await parseResumeFileEnhanced(file)
    })
  )

  const successCount = results.filter(r => r.success).length
  console.log(`✅ Successfully parsed ${successCount}/${files.length} files`)

  return results
}

/**
 * Get parsing capabilities and recommendations
 */
export function getParsingCapabilities() {
  return {
    preferredFormats: [
      { format: 'PDF', parser: 'Microsoft MarkItDown', quality: 'Excellent', note: 'Best format for structured documents' },
      { format: 'Word (.docx)', parser: 'Microsoft MarkItDown + Legacy', quality: 'Excellent', note: 'Full formatting support' },
      { format: 'Text (.txt)', parser: 'Direct Parser', quality: 'Perfect', note: 'Fastest parsing' },
      { format: 'HTML', parser: 'Microsoft MarkItDown', quality: 'Very Good', note: 'Preserves structure' },
      { format: 'Markdown (.md)', parser: 'Microsoft MarkItDown', quality: 'Perfect', note: 'Native format' }
    ],
    limitations: [
      'Image-based PDFs require OCR (not yet supported)',
      'Password-protected files must be unlocked first',
      'Maximum file size: 20MB',
      'Parsing timeout: 30 seconds'
    ],
    recommendations: [
      'Use PDF or Word format for best results',
      'Ensure documents are text-based, not scanned images',
      'Convert complex layouts to simpler formats if parsing fails',
      'Keep file sizes under 10MB for optimal performance'
    ]
  }
}