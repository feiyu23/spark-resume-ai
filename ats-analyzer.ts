/**
 * ATS (Applicant Tracking System) Analyzer
 * Core logic for analyzing resumes for ATS compatibility
 * Now with dynamic industry detection - no more hardcoded education keywords!
 */

import { IndustryDetector } from './industry-detector'
import { getKeywordsForIndustries } from './industry-keywords-database'
import { atsEngine } from './ats-engine' // 集成新的TF-IDF引擎

export interface ATSAnalysis {
  score: number // 0-100
  issues: ATSIssue[]
  suggestions: string[]
  keywords: KeywordAnalysis
  formatting: FormattingAnalysis
}

export interface ATSIssue {
  severity: 'critical' | 'warning' | 'info'
  category: string
  message: string
  fix?: string
}

export interface KeywordAnalysis {
  found: string[]
  missing: string[]
  density: number
  relevance: number
}

export interface FormattingAnalysis {
  hasHeaders: boolean
  hasBulletPoints: boolean
  hasCleanLayout: boolean
  hasParsableContact: boolean
  issues: string[]
}

// Core Australian keywords that apply to all industries
const UNIVERSAL_AU_KEYWORDS = [
  'Australian Standards', 'Fair Work Act', 'WHS', 'OH&S', 
  'GST', 'ABN', 'superannuation', 'local experience',
  'permanent resident', 'working rights', 'Australian market'
]

// Universal soft skills important for ATS
const UNIVERSAL_SOFT_SKILLS = [
  'communication', 'teamwork', 'problem solving', 'time management',
  'attention to detail', 'adaptability', 'leadership', 'critical thinking'
]

// ATS systems commonly used in Australia
const AU_ATS_SYSTEMS = {
  seek: {
    name: 'SEEK',
    requirements: ['clean formatting', 'keyword optimization', 'standard sections']
  },
  indeed: {
    name: 'Indeed Australia',
    requirements: ['PDF format', 'no tables', 'simple layout']
  },
  taleo: {
    name: 'Oracle Taleo',
    requirements: ['chronological order', 'no graphics', 'standard fonts']
  },
  workday: {
    name: 'Workday',
    requirements: ['structured data', 'clear headings', 'no columns']
  }
}

export class ATSAnalyzer {
  /**
   * Analyze resume content for ATS compatibility
   * Enhanced with TF-IDF analysis from new engine
   */
  static analyze(resumeContent: string, jobDescription?: string): ATSAnalysis {
    const issues: ATSIssue[] = []
    let suggestions: string[] = []
    
    // Use new TF-IDF engine for comprehensive analysis if job description provided
    if (jobDescription) {
      const engineAnalysis = atsEngine.scoreResume(resumeContent, jobDescription)
      
      // Merge suggestions from both analyzers
      suggestions = [...engineAnalysis.suggestions]
      
      // Add warnings as issues
      engineAnalysis.warnings.forEach(warning => {
        issues.push({
          severity: 'warning',
          category: 'formatting',
          message: warning
        })
      })
    }
    
    // Analyze keywords with existing method
    const keywords = this.analyzeKeywords(resumeContent, jobDescription)
    
    // Analyze formatting
    const formatting = this.analyzeFormatting(resumeContent)
    
    // Calculate overall score - now considering TF-IDF if available
    let score: number
    if (jobDescription) {
      const engineScore = atsEngine.scoreResume(resumeContent, jobDescription).overallScore
      const localScore = this.calculateScore(keywords, formatting, issues)
      // Weighted average: 60% new engine, 40% existing analyzer
      score = Math.round(engineScore * 0.6 + localScore * 0.4)
    } else {
      score = this.calculateScore(keywords, formatting, issues)
    }
    
    // Generate additional suggestions
    if (keywords.missing.length > 0 && !suggestions.some(s => s.includes('keywords'))) {
      suggestions.push(`Add these important keywords: ${keywords.missing.slice(0, 5).join(', ')}`)
    }
    
    if (!formatting.hasHeaders) {
      suggestions.push('Use clear section headers like "Experience", "Education", "Skills"')
    }
    
    if (!formatting.hasBulletPoints) {
      suggestions.push('Use bullet points to list your achievements and responsibilities')
    }
    
    return {
      score,
      issues,
      suggestions,
      keywords,
      formatting
    }
  }
  
  /**
   * Analyze keywords in resume - now with dynamic industry detection!
   */
  private static analyzeKeywords(content: string, jobDescription?: string): KeywordAnalysis {
    const contentLower = content.toLowerCase()
    const found: string[] = []
    const missing: string[] = []
    
    // Detect the actual industries from the resume
    const detection = IndustryDetector.detect(content, jobDescription)
    const detectedIndustries = [
      detection.primary.industry,
      ...detection.secondary.slice(0, 2).map(s => s.industry)
    ]
    
    // Get keywords specific to detected industries
    const industryKeywords = getKeywordsForIndustries(detectedIndustries)
    
    // Combine with universal keywords
    const allKeywords = [
      ...industryKeywords,
      ...UNIVERSAL_AU_KEYWORDS,
      ...UNIVERSAL_SOFT_SKILLS
    ]
    
    // Remove duplicates
    const uniqueKeywords = Array.from(new Set(allKeywords))
    
    uniqueKeywords.forEach(keyword => {
      if (contentLower.includes(keyword.toLowerCase())) {
        found.push(keyword)
      } else {
        missing.push(keyword)
      }
    })
    
    // If job description provided, extract and check job-specific keywords
    if (jobDescription) {
      const jobKeywords = this.extractJobKeywords(jobDescription)
      jobKeywords.forEach(keyword => {
        if (!contentLower.includes(keyword.toLowerCase()) && !found.includes(keyword)) {
          missing.push(keyword)
        }
      })
    }
    
    // Calculate density and relevance
    const wordCount = content.split(/\s+/).length
    const keywordCount = found.length
    const density = (keywordCount / wordCount) * 100
    const relevance = (found.length / (found.length + missing.length)) * 100
    
    return {
      found,
      missing: missing.slice(0, 20), // Limit missing keywords
      density: Math.round(density * 10) / 10,
      relevance: Math.round(relevance)
    }
  }
  
  /**
   * Analyze formatting for ATS compatibility
   */
  private static analyzeFormatting(content: string): FormattingAnalysis {
    const issues: string[] = []
    
    // Check for section headers
    const hasHeaders = /\b(experience|education|skills|summary|objective)\b/i.test(content)
    if (!hasHeaders) {
      issues.push('Missing standard section headers')
    }
    
    // Check for bullet points
    const hasBulletPoints = /[•·▪▫◦‣⁃]|^\s*[-*]\s+/m.test(content)
    if (!hasBulletPoints) {
      issues.push('No bullet points detected')
    }
    
    // Check for clean layout (no tables, graphics, etc.)
    const hasCleanLayout = !/<table|<img|<graph/i.test(content)
    if (!hasCleanLayout) {
      issues.push('Contains complex formatting that ATS cannot parse')
    }
    
    // Check for parsable contact info
    const hasEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(content)
    const hasPhone = /\b(?:\+61|0)[0-9\s-]{8,}\b/.test(content)
    const hasParsableContact = hasEmail && hasPhone
    if (!hasParsableContact) {
      issues.push('Contact information may not be properly formatted')
    }
    
    return {
      hasHeaders,
      hasBulletPoints,
      hasCleanLayout,
      hasParsableContact,
      issues
    }
  }
  
  /**
   * Calculate overall ATS score - More generous and realistic scoring
   */
  private static calculateScore(
    keywords: KeywordAnalysis,
    formatting: FormattingAnalysis,
    issues: ATSIssue[]
  ): number {
    // Start with a reasonable base score (most resumes are decent)
    let score = 70
    
    // Keyword scoring (up to +20 points)
    // Having 5-15 relevant keywords is already excellent
    if (keywords.found.length >= 15) {
      score += 20
    } else if (keywords.found.length >= 10) {
      score += 15
    } else if (keywords.found.length >= 5) {
      score += 10
    } else {
      score += keywords.found.length * 2
    }
    
    // Formatting bonuses (up to +15 points)
    if (formatting.hasHeaders) score += 5
    if (formatting.hasBulletPoints) score += 4
    if (formatting.hasCleanLayout) score += 3
    if (formatting.hasParsableContact) score += 3
    
    // Small penalties for issues (not too harsh)
    issues.forEach(issue => {
      if (issue.severity === 'critical') score -= 5
      if (issue.severity === 'warning') score -= 2
      if (issue.severity === 'info') score -= 1
    })
    
    // Bonus for good keyword density (1-3% is ideal)
    if (keywords.density >= 1 && keywords.density <= 3) {
      score += 5
    }
    
    // Ensure score is reasonable (rarely below 60 for any decent resume)
    return Math.max(60, Math.min(100, Math.round(score)))
  }
  
  /**
   * Extract keywords from job description
   */
  private static extractJobKeywords(jobDescription: string): string[] {
    // Simple keyword extraction (can be enhanced with NLP)
    const words = jobDescription
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3)
    
    // Filter common words
    const commonWords = ['the', 'and', 'for', 'with', 'this', 'that', 'have', 'from']
    const keywords = words.filter(word => !commonWords.includes(word))
    
    // Get unique keywords
    return [...new Set(keywords)].slice(0, 30)
  }
  
  /**
   * Generate AI optimization suggestions
   */
  static generateOptimizations(analysis: ATSAnalysis): string[] {
    const optimizations: string[] = []
    
    // Based on score ranges
    if (analysis.score < 50) {
      optimizations.push('Major improvements needed for ATS compatibility')
    } else if (analysis.score < 75) {
      optimizations.push('Good foundation, but needs optimization')
    } else {
      optimizations.push('Resume is well-optimized for ATS systems')
    }
    
    // Specific optimizations
    if (analysis.keywords.missing.length > 10) {
      optimizations.push('Add more industry-relevant keywords from the job description')
    }
    
    if (!analysis.formatting.hasHeaders) {
      optimizations.push('Structure your resume with clear section headers')
    }
    
    if (analysis.keywords.density < 2) {
      optimizations.push('Increase keyword density by incorporating relevant terms naturally')
    }
    
    // Australian-specific suggestions
    if (!analysis.keywords.found.some(k => UNIVERSAL_AU_KEYWORDS.includes(k))) {
      optimizations.push('Consider mentioning your work rights or local experience in Australia')
    }
    
    return optimizations
  }
}

/**
 * Resume optimizer using AI
 */
export class ResumeOptimizer {
  /**
   * Optimize resume content for ATS
   */
  static optimize(content: string, targetJob?: string): string {
    let optimizedContent = content
    
    // Add missing keywords naturally
    const analysis = ATSAnalyzer.analyze(content, targetJob)
    
    // Auto-fix formatting issues
    if (!analysis.formatting.hasHeaders) {
      // Add standard headers if missing
      optimizedContent = this.addStandardHeaders(optimizedContent)
    }
    
    if (!analysis.formatting.hasBulletPoints) {
      // Convert lists to bullet points
      optimizedContent = this.convertToBulletPoints(optimizedContent)
    }
    
    // Enhance with keywords
    if (analysis.keywords.missing.length > 0) {
      optimizedContent = this.enhanceWithKeywords(optimizedContent, analysis.keywords.missing)
    }
    
    return optimizedContent
  }
  
  private static addStandardHeaders(content: string): string {
    // Implementation for adding headers
    return content
  }
  
  private static convertToBulletPoints(content: string): string {
    // Convert dash lists to bullet points
    return content.replace(/^\s*-\s+/gm, '• ')
  }
  
  private static enhanceWithKeywords(content: string, keywords: string[]): string {
    // Smart keyword insertion (needs AI for natural placement)
    return content
  }
}