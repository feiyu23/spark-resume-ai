/**
 * Semantic Similarity Matcher for Resume-Job Description Matching
 * Uses Sentence Transformers for semantic understanding
 * Inspired by Resume-Matcher's approach with 95.5% accuracy
 */

import { pipeline, cos_sim } from '@xenova/transformers'

/**
 * Semantic matching result interface
 */
export interface SemanticMatchResult {
  similarityScore: number // 0-1 similarity score
  confidence: number // Confidence level of the match
  topMatchedConcepts: string[] // Key concepts that matched well
  missingConcepts: string[] // Important concepts missing from resume
  suggestions: string[] // Improvement suggestions based on semantic gaps
}

/**
 * Configuration for semantic matching
 */
export interface MatcherConfig {
  modelName?: string // Default: 'Xenova/all-MiniLM-L6-v2'
  threshold?: number // Minimum similarity threshold (0-1)
  useCache?: boolean // Cache embeddings for performance
}

/**
 * Semantic Matcher Class
 * Implements advanced NLP-based resume matching using transformer models
 */
export class SemanticMatcher {
  private embedder: any = null
  private modelName: string
  private threshold: number
  private useCache: boolean
  private embeddingCache: Map<string, Float32Array>
  private initialized: boolean = false

  constructor(config: MatcherConfig = {}) {
    this.modelName = config.modelName || 'Xenova/all-MiniLM-L6-v2'
    this.threshold = config.threshold || 0.6
    this.useCache = config.useCache !== false
    this.embeddingCache = new Map()
  }

  /**
   * Initialize the model (lazy loading)
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return
    
    console.log('🧠 Initializing Semantic Matcher with model:', this.modelName)
    
    try {
      // Create feature extraction pipeline
      this.embedder = await pipeline('feature-extraction', this.modelName)
      this.initialized = true
      console.log('✅ Semantic Matcher initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Semantic Matcher:', error)
      throw new Error('Failed to load semantic model. Falling back to keyword matching.')
    }
  }

  /**
   * Generate embeddings for text
   */
  private async generateEmbedding(text: string): Promise<Float32Array> {
    // Check cache first
    if (this.useCache && this.embeddingCache.has(text)) {
      return this.embeddingCache.get(text)!
    }

    // Clean and prepare text
    const cleanedText = this.preprocessText(text)
    
    // Generate embedding
    const output = await this.embedder(cleanedText, {
      pooling: 'mean',
      normalize: true
    })
    
    // Convert to Float32Array
    const embedding = new Float32Array(output.data)
    
    // Cache the result
    if (this.useCache) {
      this.embeddingCache.set(text, embedding)
    }
    
    return embedding
  }

  /**
   * Preprocess text for better embedding quality
   */
  private preprocessText(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove special characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .slice(0, 512) // Limit length for model input
  }

  /**
   * Calculate cosine similarity between two embeddings
   */
  private calculateCosineSimilarity(a: Float32Array, b: Float32Array): number {
    if (a.length !== b.length) {
      throw new Error('Embeddings must have the same dimension')
    }
    
    let dotProduct = 0
    let normA = 0
    let normB = 0
    
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  /**
   * Extract key concepts from text using chunking
   */
  private extractConcepts(text: string): string[] {
    const sections = text.split(/\n\n+/)
    const concepts: string[] = []
    
    // Extract section-level concepts
    sections.forEach(section => {
      if (section.length > 50) { // Meaningful sections only
        // Take first 100 chars as concept representation
        concepts.push(section.slice(0, 100))
      }
    })
    
    // Extract skill-like patterns
    const skillPattern = /(?:experience with|knowledge of|proficient in|skilled in|expertise in)\s+([^,.]+)/gi
    let match
    while ((match = skillPattern.exec(text)) !== null) {
      concepts.push(match[1].trim())
    }
    
    return concepts
  }

  /**
   * Main method: Calculate semantic similarity between resume and job description
   */
  async calculateSimilarity(resume: string, jobDescription: string): Promise<SemanticMatchResult> {
    // Initialize model if needed
    await this.initialize()
    
    try {
      // Generate embeddings for full documents
      const [resumeEmbedding, jobEmbedding] = await Promise.all([
        this.generateEmbedding(resume),
        this.generateEmbedding(jobDescription)
      ])
      
      // Calculate overall similarity
      const overallSimilarity = this.calculateCosineSimilarity(resumeEmbedding, jobEmbedding)
      
      // Extract and compare concepts
      const resumeConcepts = this.extractConcepts(resume)
      const jobConcepts = this.extractConcepts(jobDescription)
      
      // Find matching and missing concepts using embeddings
      const topMatchedConcepts: string[] = []
      const missingConcepts: string[] = []
      
      // Compare each job concept with resume
      for (const jobConcept of jobConcepts.slice(0, 10)) { // Top 10 concepts
        const jobConceptEmbedding = await this.generateEmbedding(jobConcept)
        
        let bestMatch = 0
        let bestMatchConcept = ''
        
        // Find best matching resume concept
        for (const resumeConcept of resumeConcepts) {
          const resumeConceptEmbedding = await this.generateEmbedding(resumeConcept)
          const similarity = this.calculateCosineSimilarity(jobConceptEmbedding, resumeConceptEmbedding)
          
          if (similarity > bestMatch) {
            bestMatch = similarity
            bestMatchConcept = resumeConcept
          }
        }
        
        if (bestMatch > 0.7) {
          topMatchedConcepts.push(jobConcept)
        } else if (bestMatch < 0.5) {
          missingConcepts.push(jobConcept)
        }
      }
      
      // Generate suggestions based on analysis
      const suggestions = this.generateSuggestions(
        overallSimilarity,
        topMatchedConcepts,
        missingConcepts
      )
      
      // Calculate confidence based on model performance
      const confidence = this.calculateConfidence(overallSimilarity, topMatchedConcepts.length)
      
      return {
        similarityScore: overallSimilarity,
        confidence,
        topMatchedConcepts: topMatchedConcepts.slice(0, 5),
        missingConcepts: missingConcepts.slice(0, 5),
        suggestions
      }
    } catch (error) {
      console.error('Error in semantic matching:', error)
      throw error
    }
  }

  /**
   * Generate improvement suggestions based on semantic analysis
   */
  private generateSuggestions(
    similarity: number,
    matched: string[],
    missing: string[]
  ): string[] {
    const suggestions: string[] = []
    
    if (similarity < 0.5) {
      suggestions.push('Your resume has low semantic alignment with the job description. Consider restructuring to better match the role.')
    } else if (similarity < 0.7) {
      suggestions.push('Good alignment, but there\'s room for improvement. Focus on incorporating missing concepts.')
    } else {
      suggestions.push('Excellent semantic match! Your resume aligns well with the job requirements.')
    }
    
    if (missing.length > 0) {
      suggestions.push(`Add these missing concepts: ${missing.slice(0, 3).join(', ')}`)
    }
    
    if (matched.length < 3) {
      suggestions.push('Strengthen the connection between your experience and the job requirements.')
    }
    
    return suggestions
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(similarity: number, matchedCount: number): number {
    // Base confidence on similarity score
    let confidence = similarity
    
    // Adjust based on matched concepts
    if (matchedCount >= 5) {
      confidence = Math.min(confidence + 0.1, 1)
    } else if (matchedCount <= 2) {
      confidence = Math.max(confidence - 0.1, 0)
    }
    
    return Math.round(confidence * 100) / 100
  }

  /**
   * Clear embedding cache to free memory
   */
  clearCache(): void {
    this.embeddingCache.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; entries: number } {
    return {
      size: this.embeddingCache.size,
      entries: Array.from(this.embeddingCache.keys()).length
    }
  }
}

/**
 * Singleton instance for easy import
 */
let matcherInstance: SemanticMatcher | null = null

export function getSemanticMatcher(): SemanticMatcher {
  if (!matcherInstance) {
    matcherInstance = new SemanticMatcher()
  }
  return matcherInstance
}

/**
 * Quick similarity check function
 */
export async function checkSemanticSimilarity(
  resume: string,
  jobDescription: string
): Promise<number> {
  const matcher = getSemanticMatcher()
  const result = await matcher.calculateSimilarity(resume, jobDescription)
  return result.similarityScore
}