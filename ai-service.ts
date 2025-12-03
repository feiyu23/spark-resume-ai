/**
 * AI Service for Resume Optimization
 * Integrates with OpenAI/Gemini for intelligent resume enhancement
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize AI (using Gemini as it's free)
const genAI = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
  : null

export interface AIResponse {
  success: boolean
  content?: string
  error?: string
}

export interface ResumeData {
  personalInfo: {
    name: string
    email: string
    phone: string
    location: string
    linkedin?: string
    summary?: string
  }
  experience: Array<{
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    degree: string
    school: string
    location: string
    graduationDate: string
    gpa?: string
  }>
  skills: string[]
  certifications?: string[]
  languages?: string[]
}

/**
 * AI-powered resume services
 */
export class ResumeAIService {
  /**
   * Generate professional summary using AI
   */
  static async generateSummary(resumeData: ResumeData): Promise<AIResponse> {
    if (!genAI) {
      return {
        success: false,
        error: 'AI service not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to environment variables.'
      }
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      
      const prompt = `
        Generate a professional summary for this resume:
        
        Name: ${resumeData.personalInfo.name}
        Current/Recent Role: ${resumeData.experience[0]?.title || 'Entry Level'}
        Company: ${resumeData.experience[0]?.company || 'N/A'}
        Skills: ${resumeData.skills.join(', ')}
        
        Requirements:
        - 2-3 sentences maximum
        - Focus on achievements and value proposition
        - Use Australian English spelling
        - Include relevant keywords for ATS
        - Professional tone suitable for Australian job market
      `
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      return { success: true, content: text }
    } catch (error) {
      console.error('AI generation error:', error)
      return { 
        success: false, 
        error: 'Failed to generate summary. Please try again.' 
      }
    }
  }
  
  /**
   * Enhance job descriptions with action verbs and metrics
   */
  static async enhanceJobDescription(description: string, role: string): Promise<AIResponse> {
    if (!genAI) {
      return { 
        success: false, 
        error: 'AI service not configured' 
      }
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      
      const prompt = `
        Enhance this job description for a ${role} position:
        
        Original: ${description}
        
        Requirements:
        - Start each point with a strong action verb
        - Include quantifiable metrics where possible
        - Use Australian English
        - Optimize for ATS keywords
        - Maximum 5 bullet points
        - Each point should be 1-2 lines
        
        Format as bullet points starting with "• "
      `
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      return { success: true, content: text }
    } catch (error) {
      console.error('AI enhancement error:', error)
      return { 
        success: false, 
        error: 'Failed to enhance description' 
      }
    }
  }
  
  /**
   * Generate interview questions based on resume
   */
  static async generateInterviewQuestions(resumeData: ResumeData, jobTitle?: string): Promise<AIResponse> {
    if (!genAI) {
      return { 
        success: false, 
        error: 'AI service not configured' 
      }
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      
      const prompt = `
        Generate 5 likely interview questions for this candidate:
        
        Target Role: ${jobTitle || resumeData.experience[0]?.title || 'Professional'}
        Experience: ${resumeData.experience.length} positions
        Key Skills: ${resumeData.skills.slice(0, 5).join(', ')}
        
        Include:
        - 2 behavioral questions (STAR method)
        - 2 technical/skill questions
        - 1 Australian workplace culture question
        
        Format each question with a number and brief answer tip.
      `
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      return { success: true, content: text }
    } catch (error) {
      console.error('AI question generation error:', error)
      return { 
        success: false, 
        error: 'Failed to generate questions' 
      }
    }
  }
  
  /**
   * Suggest missing skills based on job market
   */
  static async suggestSkills(currentSkills: string[], targetRole: string): Promise<AIResponse> {
    if (!genAI) {
      // Fallback to static suggestions
      const staticSuggestions = [
        'Project Management',
        'Data Analysis',
        'Stakeholder Engagement',
        'Agile Methodologies',
        'Microsoft Office Suite'
      ].filter(skill => !currentSkills.includes(skill))
      
      return { 
        success: true, 
        content: staticSuggestions.join(', ') 
      }
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      
      const prompt = `
        Suggest 5 important skills for a ${targetRole} in Australia that are missing from this list:
        
        Current skills: ${currentSkills.join(', ')}
        
        Focus on:
        - In-demand skills in Australian job market
        - Both technical and soft skills
        - Skills that improve ATS matching
        
        Return as comma-separated list only.
      `
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      return { success: true, content: text }
    } catch (error) {
      console.error('AI skill suggestion error:', error)
      // Fallback to static suggestions
      return { 
        success: true, 
        content: 'Communication, Team Leadership, Problem Solving, Time Management, Adaptability' 
      }
    }
  }
  
  /**
   * Optimize resume for specific job posting
   */
  static async optimizeForJob(resumeContent: string, jobDescription: string): Promise<AIResponse> {
    if (!genAI) {
      return { 
        success: false, 
        error: 'AI service not configured' 
      }
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
      
      const prompt = `
        Optimize this resume for the following job posting:
        
        JOB DESCRIPTION:
        ${jobDescription}
        
        CURRENT RESUME:
        ${resumeContent}
        
        Provide 5 specific optimization suggestions:
        1. Keywords to add
        2. Skills to emphasize
        3. Experience points to highlight
        4. Sections to reorder
        5. Australian market considerations
        
        Keep suggestions practical and actionable.
      `
      
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      return { success: true, content: text }
    } catch (error) {
      console.error('AI optimization error:', error)
      return { 
        success: false, 
        error: 'Failed to optimize resume' 
      }
    }
  }

  /**
   * Australian Hiring Expert Analysis
   * Uses Reddit-optimized prompt for Australian market
   */
  static async australianHiringExpertAnalysis(
    resumeText: string,
    industry: string,
    role: string,
    jobDescription?: string
  ): Promise<AIResponse> {
    if (!genAI) {
      return {
        success: false,
        error: 'AI service not configured'
      }
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      const prompt = `
        Act as a senior hiring manager with over 15 years of experience in the Australian job market, specializing in ${industry}. You have deep expertise in ${role} recruitment and understand the unique requirements of Australian employers, including cultural fit, visa considerations, and local compliance standards.

        Your task is to analyze this resume against Australian hiring standards and provide ATS-optimized recommendations that will help this candidate stand out in the competitive Australian job market.

        **Resume Text:**
        ${resumeText}

        ${jobDescription ? `**Target Role Requirements:**\n${jobDescription}\n` : ''}

        **Australian-Specific Considerations:**
        - ATS systems used by major Australian recruiters (SEEK, LinkedIn, Indeed)
        - Australian resume formatting preferences (2-page limit, no photo requirement)
        - Local terminology and industry standards
        - Visa status implications for hiring decisions
        - Cultural fit indicators valued by Australian employers
        - Industry-specific certifications recognized in Australia

        **Analysis Framework:**
        1. **ATS Compatibility Score** (0-100%): How well will this resume perform in Australian ATS systems?
        2. **Skills Alignment**: Match against Australian industry standards for ${role}
        3. **Experience Relevance**: Evaluate local vs international experience value
        4. **Keywords Optimization**: Identify missing Australian job market keywords
        5. **Format & Structure**: Assess against Australian employer preferences

        **Output Requirements:**
        - Specific keyword recommendations for the Australian market
        - ATS optimization suggestions
        - Cultural adaptation advice for international candidates
        - Industry-specific improvements for Australian employers
        - Competitive positioning against local talent pool

        Focus on actionable improvements that will increase interview chances with Australian employers within 30 days.

        Please provide a comprehensive analysis with specific, actionable recommendations.
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return { success: true, content: text }
    } catch (error) {
      console.error('Australian hiring expert analysis error:', error)
      return {
        success: false,
        error: 'Failed to complete Australian hiring analysis'
      }
    }
  }

  /**
   * Australian Job Fit Analysis
   * Brutally honest assessment of job fit for Australian market
   */
  static async australianJobFitAnalysis(
    resumeText: string,
    jobDescription: string,
    industry: string
  ): Promise<AIResponse> {
    if (!genAI) {
      return {
        success: false,
        error: 'AI service not configured'
      }
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

      const prompt = `
        You are an Australian Job Market Reality Check Specialist - a brutally honest career analyst with deep expertise in Australian recruitment practices, visa requirements, and industry hiring standards. You specialize in providing no-nonsense assessments of job fit specifically for the Australian employment landscape.

        **Australian Context:**
        - The Australian job market prioritizes local experience and cultural fit
        - Visa status significantly impacts hiring decisions for international candidates
        - Australian employers value direct communication and practical skills over theoretical knowledge
        - Industry certifications and local qualifications carry significant weight
        - Cultural fit and "team player" mentality are highly valued
        - Salary expectations must align with Australian market rates

        **Job Description:**
        ${jobDescription}

        **Candidate Resume:**
        ${resumeText}

        **Analysis Framework:**
        1. **Visa Status Impact Assessment**: How visa requirements affect candidacy
        2. **Australian Experience Premium**: Value of local vs international experience
        3. **Cultural Fit Indicators**: Communication style, teamwork, adaptability markers
        4. **Industry Standards Alignment**: Against Australian employer expectations for ${industry}
        5. **Competitive Market Position**: Against local Australian talent pool

        **Output Format:**
        # AUSTRALIAN JOB FIT ANALYSIS

        ## Overall Fit Score: [X]%

        ## Strengths Alignment:
        [List strengths that match Australian job requirements]

        ## Critical Gaps:
        [List major mismatches or missing requirements]

        ## Australian Market Reality Check:
        [Honest assessment of interview chances and competitive position against local candidates]

        ## Visa Considerations:
        [Impact of visa status on hiring probability]

        ## Recommendation: [Apply Now / Upskill First / Consider Alternative Roles]

        ## Action Plan:
        ### Immediate (0-30 days):
        [Specific steps for quick wins]

        ### Medium-term (1-6 months):
        [Skill development and experience building]

        ### Long-term (6+ months):
        [Strategic career positioning]

        ## Australian Market Insights:
        [Industry-specific advice for the Australian context]

        **Reality Check Standards:**
        - Minimum 70% fit required for Australian market application
        - Visa complications reduce effective fit by 10-20%
        - International candidates need 80%+ fit to compete with locals
        - Consider cost-of-living and salary expectation alignment

        Provide a comprehensive, brutally honest analysis that will genuinely help this candidate understand their position in the Australian job market.
      `

      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return { success: true, content: text }
    } catch (error) {
      console.error('Australian job fit analysis error:', error)
      return {
        success: false,
        error: 'Failed to complete Australian job fit analysis'
      }
    }
  }
}