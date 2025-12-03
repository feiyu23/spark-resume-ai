/**
 * Simple and reliable keyword integration
 * Focuses on clarity and avoiding encoding issues
 */

export interface SimpleIntegrationResult {
  updatedResume: string
  addedKeywords: string[]
  message: string
}

export class SimpleKeywordIntegrator {
  /**
   * Safely integrate keywords into resume
   * Adds keywords in a dedicated section to avoid corruption
   */
  static integrateKeywords(
    resumeContent: string,
    keywords: string[]
  ): SimpleIntegrationResult {
    // Validate input
    if (!resumeContent || typeof resumeContent !== 'string') {
      return {
        updatedResume: '',
        addedKeywords: [],
        message: 'Invalid resume content'
      }
    }

    // Filter out keywords that already exist
    const newKeywords = keywords.filter(keyword => 
      !resumeContent.toLowerCase().includes(keyword.toLowerCase())
    )

    if (newKeywords.length === 0) {
      return {
        updatedResume: resumeContent,
        addedKeywords: [],
        message: 'All keywords already present in resume'
      }
    }

    // Find or create SKILLS section - check for CORE COMPETENCIES first to avoid duplicates
    const skillsSectionRegex = /(SKILLS?|TECHNICAL SKILLS?|CORE COMPETENCIES|KEY SKILLS?)[\s:]*\n/gi
    const match = resumeContent.match(skillsSectionRegex)
    
    // Special check for existing CORE COMPETENCIES to prevent duplicates
    const hasCoreCompetencies = /CORE COMPETENCIES/gi.test(resumeContent)
    
    let updatedResume = resumeContent

    if (match) {
      // Add keywords to existing skills section
      const skillsSection = match[0]
      const insertPosition = resumeContent.indexOf(skillsSection) + skillsSection.length
      
      // Create keyword additions as bullet points
      const keywordBullets = newKeywords.map(keyword => `• ${keyword}`).join('\n')
      
      // Insert keywords
      updatedResume = 
        resumeContent.slice(0, insertPosition) + 
        keywordBullets + '\n' +
        resumeContent.slice(insertPosition)
    } else if (!hasCoreCompetencies) {
      // Create new CORE COMPETENCIES section only if it doesn't exist
      const skillsSection = `

CORE COMPETENCIES
${newKeywords.map(keyword => `• ${keyword}`).join('\n')}
`
      
      // Try to insert after SUMMARY section, or at the beginning
      const summaryRegex = /(PROFESSIONAL SUMMARY|SUMMARY|PROFILE)[\s:]*\n[\s\S]*?(?=\n[A-Z]{3,}|\n\n|$)/gi
      const summaryMatch = resumeContent.match(summaryRegex)
      
      if (summaryMatch) {
        const insertPosition = resumeContent.indexOf(summaryMatch[0]) + summaryMatch[0].length
        updatedResume = 
          resumeContent.slice(0, insertPosition) + 
          skillsSection +
          resumeContent.slice(insertPosition)
      } else {
        // Insert after contact info (usually first 5 lines)
        const lines = resumeContent.split('\n')
        const insertLine = Math.min(5, lines.length)
        lines.splice(insertLine, 0, ...skillsSection.split('\n'))
        updatedResume = lines.join('\n')
      }
    } else {
      // CORE COMPETENCIES already exists but didn't match regex pattern
      // Find it manually and add keywords
      const coreCompIndex = resumeContent.toUpperCase().indexOf('CORE COMPETENCIES')
      if (coreCompIndex !== -1) {
        // Find the end of the CORE COMPETENCIES section
        const afterHeader = resumeContent.indexOf('\n', coreCompIndex) + 1
        let insertPosition = afterHeader
        
        // Find where the section ends (next section header or double newline)
        const lines = resumeContent.slice(afterHeader).split('\n')
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].match(/^[A-Z]{3,}/)) { // Next section header
            insertPosition = afterHeader + lines.slice(0, i).join('\n').length
            break
          }
          if (lines[i].trim() === '' && i > 0) { // Empty line after content
            insertPosition = afterHeader + lines.slice(0, i + 1).join('\n').length
            break
          }
        }
        
        const keywordBullets = newKeywords.map(keyword => `• ${keyword}`).join('\n') + '\n'
        updatedResume = 
          resumeContent.slice(0, insertPosition) + 
          keywordBullets +
          resumeContent.slice(insertPosition)
      } else {
        // Fallback: append at the end
        updatedResume = resumeContent + `\n\nCORE COMPETENCIES\n${newKeywords.map(keyword => `• ${keyword}`).join('\n')}`
      }
    }

    return {
      updatedResume,
      addedKeywords: newKeywords,
      message: `Successfully added ${newKeywords.length} keywords`
    }
  }

  /**
   * Add keywords as a formatted list at the end
   * Safest method - just appends to the end
   */
  static appendKeywords(
    resumeContent: string,
    keywords: string[]
  ): SimpleIntegrationResult {
    if (!resumeContent || !keywords.length) {
      return {
        updatedResume: resumeContent || '',
        addedKeywords: [],
        message: 'No keywords to add'
      }
    }

    const keywordSection = `

ADDITIONAL SKILLS AND KEYWORDS
${keywords.map(keyword => `• ${keyword}`).join('\n')}
`

    return {
      updatedResume: resumeContent + keywordSection,
      addedKeywords: keywords,
      message: `Added ${keywords.length} keywords to the end of resume`
    }
  }

  /**
   * Simple text replacement - most reliable
   */
  static simpleReplace(
    resumeContent: string,
    keywords: string[]
  ): string {
    let updated = resumeContent
    
    // Find skills section
    const skillsMatch = updated.match(/SKILLS[\s\S]*?(?=\n[A-Z]{3,}|$)/i)
    
    if (skillsMatch) {
      // Append keywords to existing skills
      const skillsText = skillsMatch[0]
      const newSkills = skillsText + '\n' + keywords.join(', ')
      updated = updated.replace(skillsText, newSkills)
    } else {
      // Add new skills section
      updated = updated + '\n\nKEY SKILLS\n' + keywords.join(', ')
    }
    
    return updated
  }
}