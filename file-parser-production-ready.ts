/**
 * Production-Ready Resume File Parser
 * Handles MarkItDown integration gracefully for different deployment environments
 * Includes Hugging Face Spaces integration for free MarkItDown hosting
 */

import { parseResumeWithHuggingFace, getHuggingFaceStatus } from './huggingface-adapter'

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
    suggestion?: string
  }
}

/**
 * Check if MarkItDown API is available in production
 */
async function isMarkItDownAvailable(): Promise<boolean> {
  try {
    const response = await fetch('/api/parse-resume-markitdown', {
      method: 'GET',
    })
    return response.ok
  } catch (error) {
    console.warn('MarkItDown API not available:', error)
    return false
  }
}

/**
 * Parse with MarkItDown (if available)
 */
async function parseWithMarkItDown(file: File): Promise<ParseResult> {
  const startTime = Date.now()

  try {
    console.log(`🚀 Attempting MarkItDown for: ${file.name}`)

    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/parse-resume-markitdown', {
      method: 'POST',
      body: formData,
      // Add timeout for production environment
      signal: AbortSignal.timeout(45000) // 45 seconds
    })

    const result = await response.json()
    const processingTime = Date.now() - startTime

    if (response.ok && result.success) {
      console.log(`✅ MarkItDown success in ${processingTime}ms`)

      return {
        success: true,
        text: result.text,
        metadata: {
          ...result.metadata,
          processingTime,
          parser: 'Microsoft MarkItDown (Production)'
        }
      }
    } else {
      console.warn('❌ MarkItDown API failed:', result.error)

      return {
        success: false,
        text: '',
        error: result.error || 'MarkItDown parsing failed',
        metadata: {
          parser: 'MarkItDown (production failure)',
          fileName: file.name,
          fileSize: file.size,
          processingTime
        }
      }
    }

  } catch (error) {
    const processingTime = Date.now() - startTime

    // Handle timeout or network errors gracefully
    if (error instanceof Error && error.name === 'TimeoutError') {
      console.warn('⏱️ MarkItDown timeout in production')
      return {
        success: false,
        text: '',
        error: 'MarkItDown parsing timed out (production environment)',
        metadata: {
          parser: 'MarkItDown (timeout)',
          fileName: file.name,
          fileSize: file.size,
          processingTime
        }
      }
    }

    console.warn('❌ MarkItDown network error:', error)

    return {
      success: false,
      text: '',
      error: 'MarkItDown service unavailable in production environment',
      metadata: {
        parser: 'MarkItDown (network error)',
        fileName: file.name,
        fileSize: file.size,
        processingTime
      }
    }
  }
}

/**
 * Enhanced legacy parser with better error messages
 */
async function parseLegacyEnhanced(file: File): Promise<ParseResult> {
  const fileName = file.name.toLowerCase()
  const startTime = Date.now()

  try {
    // Import the original enhanced parser
    const { parseResumeFile } = await import('./file-parser-enhanced')
    const result = await parseResumeFile(file)

    const processingTime = Date.now() - startTime

    if (result.success) {
      return {
        success: true,
        text: result.text,
        metadata: {
          parser: 'Legacy Enhanced Parser',
          fileName: file.name,
          fileSize: file.size,
          processingTime
        }
      }
    } else {
      // Provide more helpful error messages based on file type
      let enhancedError = result.error

      if (fileName.endsWith('.pdf')) {
        enhancedError = `PDF parsing unavailable in current environment. ${result.error} Please try: 1) Converting to Word format first, 2) Copying text manually, or 3) Contact support for assistance.`
      } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
        enhancedError = `Word document parsing issue: ${result.error} Please try saving as a newer format or copying the text manually.`
      }

      return {
        success: false,
        text: '',
        error: enhancedError,
        metadata: {
          parser: 'Legacy Enhanced Parser (failed)',
          fileName: file.name,
          fileSize: file.size,
          processingTime
        }
      }
    }

  } catch (error) {
    const processingTime = Date.now() - startTime

    return {
      success: false,
      text: '',
      error: 'File parsing service temporarily unavailable. Please try again or contact support.',
      metadata: {
        parser: 'Legacy Enhanced Parser (error)',
        fileName: file.name,
        fileSize: file.size,
        processingTime
      }
    }
  }
}

/**
 * Production-ready file parser with intelligent fallback strategy
 */
export async function parseResumeFileProduction(file: File): Promise<ParseResult> {
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

  console.log(`📄 Production parsing: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`)

  // Handle text files directly (always works)
  if (fileName.endsWith('.txt')) {
    try {
      const text = await file.text()
      const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim()

      if (cleanText) {
        return {
          success: true,
          text: cleanText,
          metadata: {
            parser: 'Direct Text Parser (Production)',
            fileName: file.name,
            fileSize: file.size,
            processingTime: 0
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
          fileSize: file.size
        }
      }

    } catch (error) {
      return {
        success: false,
        text: '',
        error: 'Failed to read text file',
        metadata: {
          parser: 'Direct Text Parser (failed)',
          fileName: file.name,
          fileSize: file.size
        }
      }
    }
  }

  // Priority 1: Try Hugging Face Spaces (free, reliable)
  console.log('🤗 Attempting Hugging Face Spaces MarkItDown...')
  const huggingFaceResult = await parseResumeWithHuggingFace(file)

  if (huggingFaceResult.success) {
    console.log('✅ Hugging Face Spaces succeeded!')
    return huggingFaceResult
  }

  console.warn('⚠️ Hugging Face Spaces failed:', huggingFaceResult.error)

  // Priority 2: Skip local MarkItDown API in production (Vercel doesn't support Python)
  console.log('⏭️ Skipping local MarkItDown API (not available in Vercel production)')

  // For PDF files, provide smart guidance to use more reliable formats
  if (fileName.endsWith('.pdf')) {
    return {
      success: false,
      text: '',
      error: `PDF parsing is temporarily unavailable. For the best results, please upload your resume in Word (.docx) or Text (.txt) format instead. These formats provide 100% reliable parsing and faster processing. You can also try again later as our PDF service may be updating.`,
      metadata: {
        parser: 'PDF Parser (Hugging Face unavailable)',
        fileName: file.name,
        fileSize: file.size,
        suggestion: 'Upload Word or TXT format for reliable parsing'
      }
    }
  }

  // Fallback to legacy parser for supported formats
  console.log('🔄 Attempting legacy enhanced parser...')
  const legacyResult = await parseLegacyEnhanced(file)

  if (legacyResult.success) {
    console.log('✅ Legacy parser succeeded!')
    return {
      ...legacyResult,
      metadata: {
        ...legacyResult.metadata,
        parser: `${legacyResult.metadata?.parser} (MarkItDown fallback)`
      }
    }
  }

  // Both MarkItDown and legacy failed
  console.error('❌ All parsers failed in production')

  return {
    success: false,
    text: '',
    error: `File parsing temporarily unavailable. Both advanced and legacy parsers failed. Please try: 1) Converting to a simpler format, 2) Copying text manually, or 3) Contact support.`,
    metadata: legacyResult.metadata
  }
}

/**
 * Get production environment parsing status
 */
export async function getProductionParsingStatus() {
  const markItDownAvailable = await isMarkItDownAvailable()

  return {
    environment: 'production',
    markItDownAvailable,
    supportedFormats: markItDownAvailable
      ? ['PDF', 'Word (.docx, .doc)', 'Text (.txt)', 'HTML', 'Markdown']
      : ['Word (.docx, .doc)', 'Text (.txt)'],
    recommendations: markItDownAvailable
      ? ['Use PDF or Word format for best results', 'Ensure files are text-based, not scanned images']
      : ['Use Word format for best results', 'PDF support temporarily unavailable', 'Consider converting PDF to Word format'],
    status: markItDownAvailable ? 'full-service' : 'limited-service'
  }
}