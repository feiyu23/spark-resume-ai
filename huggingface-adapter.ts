/**
 * Hugging Face Spaces Adapter for MarkItDown Document Parsing
 * Connects OzSparkHub Resume AI Suite to Hugging Face hosted MarkItDown service
 */

export interface HuggingFaceParseResult {
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
    huggingFaceSpace?: string
  }
}

/**
 * Hugging Face Spaces configuration
 */
const HUGGINGFACE_CONFIG = {
  // Update this URL when the Space is deployed
  spaceUrl: process.env.NEXT_PUBLIC_HUGGINGFACE_MARKITDOWN_URL || 'https://ozsparkhub-ozsparkhub-markitdown.hf.space',
  timeout: 60000, // 60 seconds for document processing
  maxFileSize: 50 * 1024 * 1024, // 50MB
  retryAttempts: 2
}

/**
 * Check if Hugging Face Spaces service is available
 */
async function isHuggingFaceAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${HUGGINGFACE_CONFIG.spaceUrl}/`, {
      method: 'GET',
      headers: {
        'User-Agent': 'OzSparkHub-Resume-AI-Suite/1.0'
      }
    })
    return response.ok
  } catch (error) {
    console.warn('Hugging Face Spaces unavailable:', error)
    return false
  }
}

/**
 * Parse document using Hugging Face Spaces MarkItDown service
 */
async function parseWithHuggingFace(file: File, attempt: number = 1): Promise<HuggingFaceParseResult> {
  const startTime = Date.now()

  try {
    console.log(`🤗 Attempting Hugging Face parsing (attempt ${attempt}): ${file.name}`)

    // Create FormData for file upload
    const formData = new FormData()
    formData.append('data', JSON.stringify([file, true])) // Gradio format
    formData.append('fn_index', '0') // Function index for Gradio

    // Alternative: Use Gradio Client API format
    const response = await fetch(`${HUGGINGFACE_CONFIG.spaceUrl}/api/predict`, {
      method: 'POST',
      body: formData,
      headers: {
        'User-Agent': 'OzSparkHub-Resume-AI-Suite/1.0'
      },
      signal: AbortSignal.timeout(HUGGINGFACE_CONFIG.timeout)
    })

    const processingTime = Date.now() - startTime

    if (!response.ok) {
      throw new Error(`Hugging Face API returned ${response.status}: ${response.statusText}`)
    }

    const result = await response.json()

    // Parse Gradio response format
    if (result.data && result.data.length >= 2) {
      const [extractedText, jsonResponse] = result.data

      let parsedJson
      try {
        parsedJson = JSON.parse(jsonResponse)
      } catch {
        parsedJson = { success: true, text: extractedText }
      }

      if (parsedJson.success && extractedText && extractedText.trim()) {
        console.log(`✅ Hugging Face success in ${processingTime}ms: ${extractedText.length} characters`)

        return {
          success: true,
          text: extractedText.trim(),
          metadata: {
            parser: 'Microsoft MarkItDown (Hugging Face)',
            originalLength: parsedJson.original_length,
            cleanedLength: parsedJson.cleaned_length || extractedText.length,
            fileName: file.name,
            fileSize: file.size,
            processingTime,
            huggingFaceSpace: HUGGINGFACE_CONFIG.spaceUrl
          }
        }
      } else {
        const errorMsg = parsedJson.error || 'Hugging Face returned empty content'
        console.warn(`❌ Hugging Face parsing failed: ${errorMsg}`)

        return {
          success: false,
          text: '',
          error: errorMsg,
          metadata: {
            parser: 'Hugging Face MarkItDown (failed)',
            fileName: file.name,
            fileSize: file.size,
            processingTime,
            huggingFaceSpace: HUGGINGFACE_CONFIG.spaceUrl
          }
        }
      }
    } else {
      throw new Error('Invalid response format from Hugging Face Spaces')
    }

  } catch (error) {
    const processingTime = Date.now() - startTime

    if (error instanceof Error && error.name === 'TimeoutError') {
      console.warn(`⏱️ Hugging Face timeout (attempt ${attempt})`)

      // Retry on timeout
      if (attempt < HUGGINGFACE_CONFIG.retryAttempts) {
        console.log(`🔄 Retrying Hugging Face request (${attempt + 1}/${HUGGINGFACE_CONFIG.retryAttempts})`)
        return parseWithHuggingFace(file, attempt + 1)
      }

      return {
        success: false,
        text: '',
        error: 'Hugging Face parsing timed out after multiple attempts',
        metadata: {
          parser: 'Hugging Face MarkItDown (timeout)',
          fileName: file.name,
          fileSize: file.size,
          processingTime,
          huggingFaceSpace: HUGGINGFACE_CONFIG.spaceUrl
        }
      }
    }

    console.error(`❌ Hugging Face error (attempt ${attempt}):`, error)

    // Retry on network errors
    if (attempt < HUGGINGFACE_CONFIG.retryAttempts) {
      console.log(`🔄 Retrying after error (${attempt + 1}/${HUGGINGFACE_CONFIG.retryAttempts})`)
      await new Promise(resolve => setTimeout(resolve, 2000 * attempt)) // Exponential backoff
      return parseWithHuggingFace(file, attempt + 1)
    }

    return {
      success: false,
      text: '',
      error: error instanceof Error ? error.message : 'Hugging Face service error',
      metadata: {
        parser: 'Hugging Face MarkItDown (error)',
        fileName: file.name,
        fileSize: file.size,
        processingTime,
        huggingFaceSpace: HUGGINGFACE_CONFIG.spaceUrl
      }
    }
  }
}

/**
 * Main function to parse resume file using Hugging Face Spaces
 */
export async function parseResumeWithHuggingFace(file: File): Promise<HuggingFaceParseResult> {
  // Validate file size
  if (file.size > HUGGINGFACE_CONFIG.maxFileSize) {
    return {
      success: false,
      text: '',
      error: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds Hugging Face limit (${HUGGINGFACE_CONFIG.maxFileSize / 1024 / 1024}MB)`,
      metadata: {
        parser: 'Hugging Face Size Validator',
        fileName: file.name,
        fileSize: file.size
      }
    }
  }

  // Check if service is available
  const isAvailable = await isHuggingFaceAvailable()
  if (!isAvailable) {
    return {
      success: false,
      text: '',
      error: 'Hugging Face Spaces service is temporarily unavailable',
      metadata: {
        parser: 'Hugging Face Availability Check',
        fileName: file.name,
        fileSize: file.size,
        huggingFaceSpace: HUGGINGFACE_CONFIG.spaceUrl
      }
    }
  }

  // Perform parsing
  return parseWithHuggingFace(file)
}

/**
 * Get Hugging Face service status and capabilities
 */
export async function getHuggingFaceStatus() {
  const isAvailable = await isHuggingFaceAvailable()

  return {
    available: isAvailable,
    spaceUrl: HUGGINGFACE_CONFIG.spaceUrl,
    maxFileSize: `${HUGGINGFACE_CONFIG.maxFileSize / 1024 / 1024}MB`,
    timeout: `${HUGGINGFACE_CONFIG.timeout / 1000}s`,
    supportedFormats: [
      'PDF (.pdf)',
      'Microsoft Word (.docx, .doc)',
      'PowerPoint (.pptx, .ppt)',
      'Excel (.xlsx, .xls)',
      'HTML (.html)',
      'Markdown (.md)',
      'Text (.txt)'
    ],
    features: [
      'Microsoft MarkItDown parsing',
      'Resume-optimized text cleaning',
      'Free hosting on Hugging Face',
      'Automatic retries',
      'High availability'
    ]
  }
}