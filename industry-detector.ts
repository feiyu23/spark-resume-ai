/**
 * Smart Industry Detection System
 * Detects industry from resume content using multiple signals
 * Based on open-source approaches from AI-Resume-Analyzer
 */

import { INDUSTRY_DATABASE, IndustryKeywords, getIndustryByName } from './industry-keywords-database'

export interface IndustryDetectionResult {
  primary: {
    industry: string
    confidence: number
    reasons: string[]
  }
  secondary: {
    industry: string
    confidence: number
    reasons: string[]
  }[]
  allDetected: string[]
}

export class IndustryDetector {
  /**
   * Detect industries from resume content using multiple signals
   */
  static detect(resumeContent: string, jobDescription?: string): IndustryDetectionResult {
    const content = resumeContent.toLowerCase()
    const jobDesc = jobDescription?.toLowerCase() || ''
    const combinedContent = content + ' ' + jobDesc
    
    // Track scores for each industry
    const industryScores: Map<string, { score: number; reasons: string[] }> = new Map()
    
    // Initialize all industries with 0 score
    Object.keys(INDUSTRY_DATABASE).forEach(industry => {
      industryScores.set(industry, { score: 0, reasons: [] })
    })
    
    // 1. Detect based on job titles
    this.detectByJobTitles(content, industryScores)
    
    // 2. Detect based on technical skills and tools
    this.detectBySkillsAndTools(content, industryScores)
    
    // 3. Detect based on certifications
    this.detectByCertifications(content, industryScores)
    
    // 4. Detect based on industry-specific keywords
    this.detectByKeywords(combinedContent, industryScores)
    
    // 5. Detect based on company names (if mentioned)
    this.detectByCompanies(content, industryScores)
    
    // 6. Boost based on keyword density
    this.boostByKeywordDensity(content, industryScores)
    
    // Sort industries by score
    const sortedIndustries = Array.from(industryScores.entries())
      .sort((a, b) => b[1].score - a[1].score)
      .filter(([_, data]) => data.score > 0)
    
    // Prepare results
    const primary = sortedIndustries[0] || ['general', { score: 1, reasons: ['No specific industry detected'] }]
    const secondary = sortedIndustries.slice(1, 4) // Top 3 secondary matches
    
    return {
      primary: {
        industry: primary[0],
        confidence: Math.min(primary[1].score / 10, 1), // Normalize to 0-1
        reasons: primary[1].reasons
      },
      secondary: secondary.map(([industry, data]) => ({
        industry,
        confidence: Math.min(data.score / 10, 1),
        reasons: data.reasons
      })),
      allDetected: sortedIndustries.map(([industry]) => industry)
    }
  }
  
  /**
   * Detect industry based on job titles mentioned in resume
   */
  private static detectByJobTitles(
    content: string, 
    scores: Map<string, { score: number; reasons: string[] }>
  ) {
    // Common patterns for job titles
    const titlePatterns = [
      /\b(?:current|previous|position|role|title)[\s:]+([^\n,]+)/gi,
      /\b(?:working as|worked as|employed as)\s+(?:a|an)?\s*([^\n,]+)/gi,
      /^([A-Z][^•\n]+)$/gm, // Lines that start with capital letter (often job titles)
    ]
    
    // Extract potential job titles
    const foundTitles: string[] = []
    titlePatterns.forEach(pattern => {
      let match
      while ((match = pattern.exec(content)) !== null) {
        if (match[1] && match[1].length < 50) { // Reasonable title length
          foundTitles.push(match[1].toLowerCase())
        }
      }
    })
    
    // Match against database
    for (const [industryKey, industry] of Object.entries(INDUSTRY_DATABASE)) {
      for (const jobTitle of industry.jobTitles) {
        const titleLower = jobTitle.toLowerCase()
        for (const foundTitle of foundTitles) {
          if (foundTitle.includes(titleLower) || titleLower.includes(foundTitle)) {
            const data = scores.get(industryKey)!
            data.score += 5 // High weight for job title match
            data.reasons.push(`Job title: "${jobTitle}"`)
            break
          }
        }
      }
    }
  }
  
  /**
   * Detect industry based on technical skills and tools
   */
  private static detectBySkillsAndTools(
    content: string,
    scores: Map<string, { score: number; reasons: string[] }>
  ) {
    for (const [industryKey, industry] of Object.entries(INDUSTRY_DATABASE)) {
      let skillMatches = 0
      let toolMatches = 0
      const matchedSkills: string[] = []
      const matchedTools: string[] = []
      
      // Check technical skills
      for (const skill of industry.keywords.technical) {
        if (content.includes(skill.toLowerCase())) {
          skillMatches++
          if (matchedSkills.length < 3) matchedSkills.push(skill)
        }
      }
      
      // Check tools
      for (const tool of industry.keywords.tools) {
        // Use word boundary for tools to avoid false positives
        const toolPattern = new RegExp(`\\b${tool.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
        if (toolPattern.test(content)) {
          toolMatches++
          if (matchedTools.length < 3) matchedTools.push(tool)
        }
      }
      
      if (skillMatches > 0 || toolMatches > 0) {
        const data = scores.get(industryKey)!
        data.score += skillMatches * 2 + toolMatches * 3 // Tools are strong indicators
        if (matchedSkills.length > 0) {
          data.reasons.push(`Skills: ${matchedSkills.join(', ')}`)
        }
        if (matchedTools.length > 0) {
          data.reasons.push(`Tools: ${matchedTools.join(', ')}`)
        }
      }
    }
  }
  
  /**
   * Detect industry based on certifications
   */
  private static detectByCertifications(
    content: string,
    scores: Map<string, { score: number; reasons: string[] }>
  ) {
    for (const [industryKey, industry] of Object.entries(INDUSTRY_DATABASE)) {
      const matchedCerts: string[] = []
      
      for (const cert of industry.keywords.certifications) {
        if (content.includes(cert.toLowerCase())) {
          matchedCerts.push(cert)
        }
      }
      
      if (matchedCerts.length > 0) {
        const data = scores.get(industryKey)!
        data.score += matchedCerts.length * 4 // Certifications are strong indicators
        data.reasons.push(`Certifications: ${matchedCerts.join(', ')}`)
      }
    }
  }
  
  /**
   * Detect based on general industry keywords
   */
  private static detectByKeywords(
    content: string,
    scores: Map<string, { score: number; reasons: string[] }>
  ) {
    // Industry-specific strong indicators
    const strongIndicators: Record<string, string[]> = {
      'technology': ['software engineer', 'developer', 'programmer', 'coding', 'tech stack'],
      'data_science': ['data scientist', 'machine learning', 'ai model', 'data analysis'],
      'finance': ['financial analyst', 'investment', 'portfolio', 'trading', 'banking'],
      'healthcare': ['patient care', 'clinical', 'medical', 'hospital', 'healthcare'],
      'marketing': ['marketing campaign', 'seo', 'social media', 'brand', 'advertising'],
      'sales': ['sales target', 'revenue', 'client acquisition', 'business development'],
      'hr': ['recruitment', 'talent acquisition', 'employee relations', 'hr'],
      'education': ['teaching', 'curriculum', 'students', 'classroom', 'education'],
      'construction': ['construction site', 'building', 'contractor', 'safety compliance'],
      'retail': ['retail', 'store management', 'customer service', 'merchandising'],
      'manufacturing': ['production', 'manufacturing', 'quality control', 'assembly'],
      'hospitality': ['hotel', 'restaurant', 'guest service', 'hospitality'],
      'legal': ['legal', 'compliance', 'contracts', 'litigation', 'law firm'],
      'government': ['government', 'public service', 'policy', 'department'],
      'logistics': ['supply chain', 'logistics', 'warehouse', 'freight', 'distribution'],
      'real_estate': ['real estate', 'property', 'leasing', 'tenant', 'realtor'],
      'media': ['journalism', 'media', 'content creation', 'broadcasting', 'publishing'],
      'creative': ['design', 'creative', 'ui/ux', 'graphic', 'visual'],
      'engineering': ['engineer', 'cad', 'technical design', 'mechanical', 'electrical'],
      'agriculture_mining': ['mining', 'agriculture', 'farming', 'resources', 'extraction'],
      'nonprofit': ['nonprofit', 'charity', 'fundraising', 'volunteer', 'ngo']
    }
    
    for (const [industryKey, indicators] of Object.entries(strongIndicators)) {
      const matchedIndicators: string[] = []
      for (const indicator of indicators) {
        if (content.includes(indicator)) {
          matchedIndicators.push(indicator)
        }
      }
      
      if (matchedIndicators.length > 0) {
        const data = scores.get(industryKey)!
        data.score += matchedIndicators.length * 3
        if (matchedIndicators.length > 0) {
          data.reasons.push(`Keywords: ${matchedIndicators.slice(0, 3).join(', ')}`)
        }
      }
    }
  }
  
  /**
   * Detect based on company names mentioned
   */
  private static detectByCompanies(
    content: string,
    scores: Map<string, { score: number; reasons: string[] }>
  ) {
    for (const [industryKey, industry] of Object.entries(INDUSTRY_DATABASE)) {
      if (industry.companies) {
        for (const company of industry.companies) {
          if (content.includes(company.toLowerCase())) {
            const data = scores.get(industryKey)!
            data.score += 4 // Company match is a strong signal
            data.reasons.push(`Company: ${company}`)
            break // Only count once per industry
          }
        }
      }
    }
  }
  
  /**
   * Boost scores based on keyword density
   */
  private static boostByKeywordDensity(
    content: string,
    scores: Map<string, { score: number; reasons: string[] }>
  ) {
    const wordCount = content.split(/\s+/).length
    
    for (const [industryKey, industry] of Object.entries(INDUSTRY_DATABASE)) {
      let keywordCount = 0
      
      // Count all keyword occurrences
      const allKeywords = [
        ...industry.keywords.technical,
        ...industry.keywords.tools,
        ...(industry.keywords.australian || [])
      ]
      
      for (const keyword of allKeywords) {
        const regex = new RegExp(keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        const matches = content.match(regex)
        if (matches) {
          keywordCount += matches.length
        }
      }
      
      // Calculate density
      const density = (keywordCount / wordCount) * 100
      
      // Boost score if density is significant
      if (density > 1) { // More than 1% of words are industry keywords
        const data = scores.get(industryKey)!
        const boost = Math.min(density * 2, 10) // Cap at 10 points
        data.score += boost
        if (boost > 2) {
          data.reasons.push(`High keyword density (${density.toFixed(1)}%)`)
        }
      }
    }
  }
  
  /**
   * Get relevant keywords for detected industries
   */
  static getRelevantKeywords(industries: string[]): string[] {
    const keywords = new Set<string>()
    
    for (const industryName of industries) {
      const industry = INDUSTRY_DATABASE[industryName]
      if (industry) {
        // Add technical keywords
        industry.keywords.technical.forEach(k => keywords.add(k))
        // Add some tools
        industry.keywords.tools.slice(0, 5).forEach(k => keywords.add(k))
        // Add Australian keywords if present
        if (industry.keywords.australian) {
          industry.keywords.australian.slice(0, 3).forEach(k => keywords.add(k))
        }
      }
    }
    
    // Always add some general soft skills
    INDUSTRY_DATABASE.general.keywords.soft.slice(0, 5).forEach(k => keywords.add(k))
    
    return Array.from(keywords)
  }
}