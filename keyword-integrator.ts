/**
 * Smart Keyword Integration System
 * Intelligently adds keywords to resume as natural sentences, not just lists
 * Based on sparkresumebuilder approach
 */

import { IndustryDetector } from './industry-detector'
import { INDUSTRY_DATABASE } from './industry-keywords-database'
import { SimpleKeywordIntegrator } from './simple-keyword-integrator' // 整合简单整合器功能

export interface KeywordIntegrationResult {
  updatedResume: string
  addedKeywords: string[]
  integrationMethod: string
  suggestedSentences: string[]
}

export interface IntegrationContext {
  keyword: string
  industry: string
  existingSkills?: string[]
  jobTitle?: string
}

export class KeywordIntegrator {
  /**
   * Unified keyword integration method
   * Intelligently chooses between smart and simple integration
   */
  static integrateKeywords(
    resumeContent: string,
    keywords: string[],
    jobDescription?: string,
    useSmartIntegration: boolean = true
  ): KeywordIntegrationResult {
    // If simple mode requested or content is problematic, use simple integrator
    if (!useSmartIntegration || !resumeContent || resumeContent.length < 100) {
      const simpleResult = SimpleKeywordIntegrator.integrateKeywords(resumeContent, keywords)
      return {
        updatedResume: simpleResult.updatedResume,
        addedKeywords: simpleResult.addedKeywords,
        integrationMethod: 'simple',
        suggestedSentences: []
      }
    }

    // Otherwise, use smart integration for each keyword
    let updatedResume = resumeContent
    const addedKeywords: string[] = []
    const suggestedSentences: string[] = []

    for (const keyword of keywords) {
      const result = this.integrateKeyword(updatedResume, keyword, jobDescription)
      if (result.addedKeywords.length > 0) {
        updatedResume = result.updatedResume
        addedKeywords.push(...result.addedKeywords)
        suggestedSentences.push(...result.suggestedSentences)
      }
    }

    return {
      updatedResume,
      addedKeywords,
      integrationMethod: 'smart',
      suggestedSentences
    }
  }

  /**
   * Smart integration of keyword into resume content
   * Adds keywords as natural sentences in appropriate sections
   */
  static integrateKeyword(
    resumeContent: string, 
    keyword: string,
    jobDescription?: string
  ): KeywordIntegrationResult {
    // 🔧 FIX: Protect original content and ensure proper validation
    if (!resumeContent || typeof resumeContent !== 'string') {
      console.warn('KeywordIntegrator: Invalid resume content provided', { 
        contentType: typeof resumeContent,
        contentLength: resumeContent?.length || 0 
      })
      return {
        updatedResume: resumeContent || '', // Return original content, not empty string
        addedKeywords: [],
        integrationMethod: 'invalid_content',
        suggestedSentences: []
      }
    }

    // Trim and normalize content while preserving original formatting
    const normalizedContent = resumeContent.trim()
    if (normalizedContent.length === 0) {
      console.warn('KeywordIntegrator: Empty resume content after normalization')
      return {
        updatedResume: resumeContent, // Return original, even if empty
        addedKeywords: [],
        integrationMethod: 'empty_content', 
        suggestedSentences: []
      }
    }

    // Check if keyword already exists
    if (resumeContent.toLowerCase().includes(keyword.toLowerCase())) {
      return {
        updatedResume: resumeContent,
        addedKeywords: [],
        integrationMethod: 'already_exists',
        suggestedSentences: []
      }
    }

    // Detect industry for context-appropriate integration
    const detection = IndustryDetector.detect(resumeContent, jobDescription)
    const primaryIndustry = detection.primary.industry
    
    // Try different integration strategies
    let result = this.trySkillsSection(resumeContent, keyword, primaryIndustry)
    
    if (!result.success) {
      result = this.trySummarySection(resumeContent, keyword, primaryIndustry)
    }
    
    if (!result.success) {
      result = this.tryExperienceSection(resumeContent, keyword, primaryIndustry)
    }
    
    if (!result.success) {
      result = this.createNewSkillsSection(resumeContent, keyword, primaryIndustry)
    }
    
    // Ensure the result is valid UTF-8
    const updatedContent = result.updatedContent || resumeContent
    
    return {
      updatedResume: updatedContent,
      addedKeywords: result.success ? [keyword] : [],
      integrationMethod: result.method || 'none',
      suggestedSentences: this.generateNaturalSentences(keyword, primaryIndustry)
    }
  }
  
  /**
   * Try to add keyword to existing Skills section
   */
  private static trySkillsSection(
    content: string, 
    keyword: string, 
    industry: string
  ): { success: boolean; updatedContent?: string; method?: string } {
    // Look for skills section with various patterns
    const skillsRegex = /(SKILLS?|TECHNICAL SKILLS?|COMPETENCIES|CORE COMPETENCIES|KEY SKILLS?)[\s:]*\n([\s\S]*?)(?=\n[A-Z]{3,}|\n\n|\Z)/gi
    const match = content.match(skillsRegex)
    
    if (match) {
      const skillsSection = match[0]
      
      // Check if it's a bullet list or comma-separated
      if (skillsSection.includes('•') || skillsSection.includes('-')) {
        // Add as a new bullet point with context
        const enhancedBullet = this.createEnhancedBullet(keyword, industry)
        const newSection = skillsSection.trimEnd() + '\n• ' + enhancedBullet
        const updatedContent = content.replace(skillsSection, newSection)
        
        return {
          success: true,
          updatedContent,
          method: 'skills_bullet'
        }
      } else {
        // Add to comma-separated list with grouping
        const lines = skillsSection.split('\n')
        const headerLine = lines[0]
        const skillLines = lines.slice(1).join('\n')
        
        // Group related skills together
        const relatedSkills = this.getRelatedSkills(keyword, industry)
        const skillGroup = relatedSkills.length > 0 
          ? `${keyword} (including ${relatedSkills.slice(0, 2).join(', ')})`
          : keyword
        
        const newSection = headerLine + '\n' + skillLines.trimEnd() + ', ' + skillGroup
        const updatedContent = content.replace(skillsSection, newSection)
        
        return {
          success: true,
          updatedContent,
          method: 'skills_list'
        }
      }
    }
    
    return { success: false }
  }
  
  /**
   * Try to add keyword to Professional Summary
   */
  private static trySummarySection(
    content: string, 
    keyword: string, 
    industry: string
  ): { success: boolean; updatedContent?: string; method?: string } {
    const summaryRegex = /(PROFESSIONAL SUMMARY|SUMMARY|PROFILE|OBJECTIVE)[\s:]*\n([\s\S]*?)(?=\n[A-Z]{3,}|\n\n|\Z)/gi
    const match = content.match(summaryRegex)
    
    if (match) {
      const summarySection = match[0]
      const summaryContent = summarySection.split('\n').slice(1).join('\n')
      
      // Create a natural sentence that fits the summary
      const sentence = this.createSummarySentence(keyword, industry)
      
      // Add to the end of summary
      const newSummary = summarySection.trimEnd() + ' ' + sentence
      const updatedContent = content.replace(summarySection, newSummary)
      
      return {
        success: true,
        updatedContent,
        method: 'summary_addition'
      }
    }
    
    return { success: false }
  }
  
  /**
   * Try to add keyword to Experience section as an achievement
   */
  private static tryExperienceSection(
    content: string, 
    keyword: string, 
    industry: string
  ): { success: boolean; updatedContent?: string; method?: string } {
    const experienceRegex = /(EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT HISTORY)[\s:]*\n([\s\S]*?)(?=\n[A-Z]{3,}|\n\n|\Z)/gi
    const match = content.match(experienceRegex)
    
    if (match) {
      const experienceSection = match[0]
      
      // Find the first job entry
      const jobPattern = /^([A-Z][^\n]+)\n/gm
      const jobMatch = experienceSection.match(jobPattern)
      
      if (jobMatch) {
        // Create an achievement bullet that incorporates the keyword
        const achievement = this.createAchievementBullet(keyword, industry)
        
        // Add after the first job title
        const insertPosition = experienceSection.indexOf(jobMatch[0]) + jobMatch[0].length
        const before = experienceSection.slice(0, insertPosition)
        const after = experienceSection.slice(insertPosition)
        
        const newSection = before + '• ' + achievement + '\n' + after
        const updatedContent = content.replace(experienceSection, newSection)
        
        return {
          success: true,
          updatedContent,
          method: 'experience_achievement'
        }
      }
    }
    
    return { success: false }
  }
  
  /**
   * Create a new Skills section if none exists
   */
  private static createNewSkillsSection(
    content: string, 
    keyword: string, 
    industry: string
  ): { success: boolean; updatedContent?: string; method?: string } {
    // Find a good place to insert (after summary or before experience)
    const summaryRegex = /(PROFESSIONAL SUMMARY|SUMMARY|PROFILE|OBJECTIVE)[\s:]*\n([\s\S]*?)(?=\n[A-Z]{3,}|\n\n|\Z)/gi
    const summaryMatch = content.match(summaryRegex)
    
    let insertPosition = 0
    if (summaryMatch) {
      insertPosition = content.indexOf(summaryMatch[0]) + summaryMatch[0].length
    } else {
      // Insert after contact info (usually first few lines)
      const lines = content.split('\n')
      insertPosition = lines.slice(0, 5).join('\n').length
    }
    
    // Create professional skills section
    const relatedSkills = this.getRelatedSkills(keyword, industry)
    const skillsSection = `

CORE COMPETENCIES
${this.createProfessionalSkillsContent(keyword, relatedSkills, industry)}
`
    
    const before = content.slice(0, insertPosition)
    const after = content.slice(insertPosition)
    const updatedContent = before + skillsSection + after
    
    return {
      success: true,
      updatedContent,
      method: 'new_skills_section'
    }
  }
  
  /**
   * Create an enhanced bullet point for skills section
   */
  private static createEnhancedBullet(keyword: string, industry: string): string {
    const templates = {
      'technology': [
        `${keyword} development and implementation`,
        `Proficient in ${keyword} with production experience`,
        `${keyword} (3+ years professional experience)`
      ],
      'finance': [
        `${keyword} analysis and reporting`,
        `Advanced ${keyword} capabilities`,
        `${keyword} compliance and best practices`
      ],
      'healthcare': [
        `${keyword} protocols and procedures`,
        `Certified in ${keyword} methodologies`,
        `${keyword} patient care standards`
      ],
      'marketing': [
        `${keyword} strategy and execution`,
        `${keyword} campaign management`,
        `Data-driven ${keyword} optimization`
      ],
      'default': [
        `${keyword} implementation and optimization`,
        `Strong ${keyword} capabilities`,
        `${keyword} best practices`
      ]
    }
    
    const industryTemplates = templates[industry as keyof typeof templates] || templates.default
    return industryTemplates[Math.floor(Math.random() * industryTemplates.length)]
  }
  
  /**
   * Create a natural sentence for summary section
   */
  private static createSummarySentence(keyword: string, industry: string): string {
    const templates = [
      `Demonstrated expertise in ${keyword} with proven track record of success.`,
      `Strong background in ${keyword} and related technologies.`,
      `Experienced professional with comprehensive ${keyword} skills.`,
      `Proven ability to leverage ${keyword} for business impact.`
    ]
    
    return templates[Math.floor(Math.random() * templates.length)]
  }
  
  /**
   * Create an achievement bullet incorporating the keyword
   */
  private static createAchievementBullet(keyword: string, industry: string): string {
    const templates = {
      'technology': [
        `Implemented ${keyword} solutions resulting in 30% efficiency improvement`,
        `Led ${keyword} initiatives across cross-functional teams`,
        `Optimized processes using ${keyword} methodologies`
      ],
      'finance': [
        `Applied ${keyword} to improve financial reporting accuracy by 25%`,
        `Utilized ${keyword} for risk assessment and mitigation`,
        `Streamlined ${keyword} processes reducing cycle time by 40%`
      ],
      'healthcare': [
        `Implemented ${keyword} protocols improving patient satisfaction scores`,
        `Trained team members on ${keyword} best practices`,
        `Enhanced quality measures through ${keyword} implementation`
      ],
      'default': [
        `Successfully utilized ${keyword} to achieve project objectives`,
        `Applied ${keyword} skills to improve operational efficiency`,
        `Demonstrated proficiency in ${keyword} through successful project delivery`
      ]
    }
    
    const industryTemplates = templates[industry as keyof typeof templates] || templates.default
    return industryTemplates[Math.floor(Math.random() * industryTemplates.length)]
  }
  
  /**
   * Get related skills for better grouping
   */
  private static getRelatedSkills(keyword: string, industry: string): string[] {
    const industryData = INDUSTRY_DATABASE[industry]
    if (!industryData) return []
    
    // Find related skills from the same category
    const allSkills = [
      ...industryData.keywords.technical,
      ...industryData.keywords.tools
    ]
    
    // Simple relevance: skills that often appear together
    const keywordLower = keyword.toLowerCase()
    const related = allSkills.filter(skill => {
      const skillLower = skill.toLowerCase()
      // Don't include the keyword itself
      if (skillLower === keywordLower) return false
      // Check for partial matches or related terms
      return skillLower.includes(keywordLower.split(' ')[0]) || 
             keywordLower.includes(skillLower.split(' ')[0])
    })
    
    return related.slice(0, 3)
  }
  
  /**
   * Create professional skills content for new section
   */
  private static createProfessionalSkillsContent(
    keyword: string, 
    relatedSkills: string[], 
    industry: string
  ): string {
    const industryData = INDUSTRY_DATABASE[industry]
    const coreSkills = industryData?.keywords.soft.slice(0, 3) || [
      'Communication', 'Problem Solving', 'Team Collaboration'
    ]
    
    let content = `• Technical Expertise: ${keyword}`
    if (relatedSkills.length > 0) {
      content += `, ${relatedSkills.join(', ')}`
    }
    content += `\n• Professional Skills: ${coreSkills.join(', ')}`
    content += `\n• Industry Knowledge: ${industry.charAt(0).toUpperCase() + industry.slice(1).replace(/_/g, ' ')} best practices`
    
    return content
  }
  
  /**
   * Generate multiple natural sentence suggestions for a keyword
   */
  static generateNaturalSentences(keyword: string, industry: string): string[] {
    const sentences = []
    
    // Context-aware sentences based on industry
    sentences.push(this.createSummarySentence(keyword, industry))
    sentences.push(this.createAchievementBullet(keyword, industry))
    sentences.push(this.createEnhancedBullet(keyword, industry))
    
    // Additional generic options
    sentences.push(
      `Extensive experience with ${keyword} in professional settings`,
      `Certified and proficient in ${keyword} methodologies`,
      `Track record of successful ${keyword} implementation`
    )
    
    return sentences
  }
  
  /**
   * Batch integrate multiple keywords intelligently
   */
  static integrateMultipleKeywords(
    resumeContent: string,
    keywords: string[],
    jobDescription?: string
  ): KeywordIntegrationResult {
    let updatedResume = resumeContent
    const addedKeywords: string[] = []
    const allSuggestions: string[] = []
    
    // Group keywords by type for better organization
    const detection = IndustryDetector.detect(resumeContent, jobDescription)
    const industry = detection.primary.industry
    
    for (const keyword of keywords) {
      const result = this.integrateKeyword(updatedResume, keyword, jobDescription)
      if (result.addedKeywords.length > 0) {
        updatedResume = result.updatedResume
        addedKeywords.push(...result.addedKeywords)
        allSuggestions.push(...result.suggestedSentences)
      }
    }
    
    return {
      updatedResume,
      addedKeywords,
      integrationMethod: 'batch_integration',
      suggestedSentences: allSuggestions
    }
  }
}