/**
 * Advanced ATS Scoring Engine
 * Inspired by Resume-Matcher's algorithm with Australian market optimizations
 * Uses TF-IDF, keyword matching, and format analysis
 */

import { z } from 'zod'

// Types
export interface ATSScore {
  overallScore: number // 0-100
  breakdown: {
    keywordMatch: number // 0-30
    formatting: number // 0-25
    readability: number // 0-20
    sections: number // 0-15
    australian: number // 0-10
  }
  suggestions: string[]
  missingKeywords: string[]
  foundKeywords: string[]
  warnings: string[]
}

export interface JobDescription {
  text: string
  industry?: string
  location?: string
  experienceLevel?: string
}

// Australian-specific keywords and phrases
const AUSTRALIAN_KEYWORDS = {
  visa: ['PR', 'permanent resident', 'citizen', 'work rights', 'visa status', 'eligible to work'],
  locations: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra', 'Darwin', 'Hobart'],
  qualifications: ['TAFE', 'VET', 'university', 'bachelor', 'master', 'diploma', 'certificate'],
  industries: {
    mining: ['FIFO', 'DIDO', 'mine site', 'resources', 'iron ore', 'coal', 'LNG'],
    healthcare: ['AHPRA', 'registration', 'Medicare', 'PBS', 'aged care', 'NDIS'],
    construction: ['white card', 'blue card', 'working at heights', 'confined spaces'],
    finance: ['CPA', 'CA', 'ASIC', 'ATO', 'superannuation', 'SMSF'],
    tech: ['NBN', 'cloud', 'agile', 'scrum', 'DevOps', 'cybersecurity']
  }
}

// TF-IDF Implementation
class TFIDFAnalyzer {
  private documents: Map<string, Map<string, number>> = new Map()
  private idf: Map<string, number> = new Map()
  private totalDocs: number = 0

  /**
   * Calculate Term Frequency
   */
  private calculateTF(text: string): Map<string, number> {
    const words = this.tokenize(text)
    const tf = new Map<string, number>()
    const totalWords = words.length

    words.forEach(word => {
      tf.set(word, (tf.get(word) || 0) + 1)
    })

    // Normalize
    tf.forEach((count, word) => {
      tf.set(word, count / totalWords)
    })

    return tf
  }

  /**
   * Tokenize and clean text
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.isStopWord(word))
  }

  /**
   * Check if word is a stop word
   */
  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'and', 'for', 'are', 'but', 'has', 'had', 'was', 'were', 'been']
    return stopWords.includes(word)
  }

  /**
   * Calculate TF-IDF scores
   */
  public analyze(resume: string, jobDescription: string): { score: number; keywords: Map<string, number> } {
    const resumeTF = this.calculateTF(resume)
    const jobTF = this.calculateTF(jobDescription)
    
    const keywords = new Map<string, number>()
    let matchScore = 0
    let totalKeywords = 0

    // Calculate overlap
    jobTF.forEach((tfScore, word) => {
      if (resumeTF.has(word)) {
        const score = tfScore * (resumeTF.get(word) || 0)
        keywords.set(word, score)
        matchScore += score
        totalKeywords++
      }
    })

    // Normalize to 0-100
    const normalizedScore = Math.min(100, (matchScore / Math.max(jobTF.size, 1)) * 500)

    return { score: normalizedScore, keywords }
  }
}

// Format Analyzer
class FormatAnalyzer {
  /**
   * Check resume formatting for ATS compatibility
   */
  public analyze(resumeText: string): {
    score: number
    issues: string[]
  } {
    const issues: string[] = []
    let score = 100

    // Check for problematic elements
    if (resumeText.includes('|') || resumeText.includes('│')) {
      issues.push('Avoid tables and complex formatting')
      score -= 15
    }

    if (!/[A-Z]{2,}/.test(resumeText)) {
      issues.push('Add clear section headers in CAPS')
      score -= 10
    }

    if (!resumeText.includes('•') && !resumeText.includes('-')) {
      issues.push('Use bullet points for better readability')
      score -= 10
    }

    // Check for required sections
    const requiredSections = ['experience', 'education', 'skills']
    requiredSections.forEach(section => {
      if (!resumeText.toLowerCase().includes(section)) {
        issues.push(`Missing ${section} section`)
        score -= 15
      }
    })

    // Check contact info
    const hasEmail = /\S+@\S+\.\S+/.test(resumeText)
    const hasPhone = /\d{10}|\d{4}\s\d{3}\s\d{3}/.test(resumeText)
    
    if (!hasEmail) {
      issues.push('Add email address')
      score -= 10
    }
    
    if (!hasPhone) {
      issues.push('Add phone number')
      score -= 10
    }

    return { score: Math.max(0, score), issues }
  }
}

// Readability Analyzer
class ReadabilityAnalyzer {
  /**
   * Analyze text readability
   */
  public analyze(text: string): {
    score: number
    suggestions: string[]
  } {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const words = text.split(/\s+/).filter(w => w.length > 0)
    
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1)
    const suggestions: string[] = []
    let score = 100

    // Check sentence length
    if (avgWordsPerSentence > 20) {
      suggestions.push('Use shorter sentences (aim for 15-20 words)')
      score -= 15
    }

    // Check for action verbs
    const actionVerbs = ['managed', 'led', 'developed', 'created', 'improved', 'achieved', 'delivered']
    const hasActionVerbs = actionVerbs.some(verb => text.toLowerCase().includes(verb))
    
    if (!hasActionVerbs) {
      suggestions.push('Start bullet points with action verbs')
      score -= 10
    }

    // Check for metrics
    const hasNumbers = /\d+/.test(text)
    if (!hasNumbers) {
      suggestions.push('Add quantifiable achievements (numbers, percentages)')
      score -= 15
    }

    return { score: Math.max(0, score), suggestions }
  }
}

// Main ATS Engine
export class ATSEngine {
  private tfidfAnalyzer: TFIDFAnalyzer
  private formatAnalyzer: FormatAnalyzer
  private readabilityAnalyzer: ReadabilityAnalyzer

  constructor() {
    this.tfidfAnalyzer = new TFIDFAnalyzer()
    this.formatAnalyzer = new FormatAnalyzer()
    this.readabilityAnalyzer = new ReadabilityAnalyzer()
  }

  /**
   * Comprehensive ATS scoring
   */
  public scoreResume(resume: string, jobDescription?: string): ATSScore {
    const suggestions: string[] = []
    const warnings: string[] = []
    
    // Keyword matching (if job description provided)
    let keywordScore = 15 // Default if no JD
    let foundKeywords: string[] = []
    let missingKeywords: string[] = []
    
    if (jobDescription) {
      const tfidfResult = this.tfidfAnalyzer.analyze(resume, jobDescription)
      keywordScore = Math.min(30, tfidfResult.score * 0.3)
      
      // Extract top keywords
      const sortedKeywords = Array.from(tfidfResult.keywords.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
      
      foundKeywords = sortedKeywords
        .filter(([_, score]) => score > 0.01)
        .map(([word]) => word)
      
      // Find missing important keywords
      const importantWords = this.extractImportantWords(jobDescription)
      missingKeywords = importantWords.filter(word => 
        !resume.toLowerCase().includes(word.toLowerCase())
      )
      
      if (missingKeywords.length > 0) {
        suggestions.push(`Add these keywords: ${missingKeywords.slice(0, 5).join(', ')}`)
      }
    }

    // Format analysis
    const formatResult = this.formatAnalyzer.analyze(resume)
    const formatScore = (formatResult.score / 100) * 25
    warnings.push(...formatResult.issues)

    // Readability analysis
    const readabilityResult = this.readabilityAnalyzer.analyze(resume)
    const readabilityScore = (readabilityResult.score / 100) * 20
    suggestions.push(...readabilityResult.suggestions)

    // Section completeness
    const sectionScore = this.analyzeSections(resume)

    // Australian optimization
    const australianScore = this.analyzeAustralianRelevance(resume)

    // Calculate overall score
    const breakdown = {
      keywordMatch: Math.round(keywordScore),
      formatting: Math.round(formatScore),
      readability: Math.round(readabilityScore),
      sections: Math.round(sectionScore),
      australian: Math.round(australianScore)
    }

    const overallScore = Object.values(breakdown).reduce((a, b) => a + b, 0)

    // Generate final suggestions
    if (overallScore < 70) {
      suggestions.unshift('Your resume needs significant improvement for ATS systems')
    } else if (overallScore < 85) {
      suggestions.unshift('Your resume is good but can be optimized further')
    } else {
      suggestions.unshift('Excellent! Your resume is well-optimized for ATS')
    }

    return {
      overallScore: Math.round(overallScore),
      breakdown,
      suggestions,
      missingKeywords,
      foundKeywords,
      warnings
    }
  }

  /**
   * Extract important words from job description
   */
  private extractImportantWords(text: string): string[] {
    // Common skill keywords
    const skillPatterns = [
      /\b(python|java|javascript|react|node|aws|azure|docker|kubernetes)\b/gi,
      /\b(agile|scrum|kanban|waterfall)\b/gi,
      /\b(leadership|management|communication|teamwork)\b/gi,
      /\b(bachelor|master|degree|certification)\b/gi
    ]

    const importantWords = new Set<string>()
    
    skillPatterns.forEach(pattern => {
      const matches = text.match(pattern)
      if (matches) {
        matches.forEach(match => importantWords.add(match.toLowerCase()))
      }
    })

    return Array.from(importantWords)
  }

  /**
   * Analyze section completeness
   */
  private analyzeSections(resume: string): number {
    const sections = {
      contact: /email|phone|address|linkedin/i,
      summary: /summary|objective|profile/i,
      experience: /experience|employment|work history/i,
      education: /education|qualification|degree/i,
      skills: /skills|competencies|expertise/i
    }

    let score = 0
    const maxScorePerSection = 15 / Object.keys(sections).length

    Object.entries(sections).forEach(([name, pattern]) => {
      if (pattern.test(resume)) {
        score += maxScorePerSection
      }
    })

    return score
  }

  /**
   * Analyze Australian market relevance
   */
  private analyzeAustralianRelevance(resume: string): number {
    let score = 0
    const resumeLower = resume.toLowerCase()

    // Check for visa status mention
    if (AUSTRALIAN_KEYWORDS.visa.some(keyword => resumeLower.includes(keyword))) {
      score += 3
    }

    // Check for Australian locations
    if (AUSTRALIAN_KEYWORDS.locations.some(location => resumeLower.includes(location.toLowerCase()))) {
      score += 3
    }

    // Check for Australian qualifications
    if (AUSTRALIAN_KEYWORDS.qualifications.some(qual => resumeLower.includes(qual.toLowerCase()))) {
      score += 2
    }

    // Check for local experience
    if (resumeLower.includes('australia') || resumeLower.includes('australian')) {
      score += 2
    }

    return Math.min(10, score)
  }

  /**
   * Get industry-specific suggestions
   */
  public getIndustrySuggestions(resume: string, industry: string): string[] {
    const suggestions: string[] = []
    const resumeLower = resume.toLowerCase()
    
    const industryKeywords = AUSTRALIAN_KEYWORDS.industries[industry as keyof typeof AUSTRALIAN_KEYWORDS.industries]
    
    if (industryKeywords) {
      const missingKeywords = industryKeywords.filter(keyword => 
        !resumeLower.includes(keyword.toLowerCase())
      )
      
      if (missingKeywords.length > 0) {
        suggestions.push(`Consider adding ${industry} keywords: ${missingKeywords.slice(0, 3).join(', ')}`)
      }
    }

    return suggestions
  }
}

// Export singleton instance
export const atsEngine = new ATSEngine()