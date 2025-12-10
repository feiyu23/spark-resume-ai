/**
 * Text Parser - Parse plain text resumes
 */

import * as fs from 'fs';

export interface ParseResult {
  success: boolean;
  text: string;
  error?: string;
}

export class TextParser {
  /**
   * Parse text file from file path
   */
  parseFile(filePath: string): ParseResult {
    try {
      const text = fs.readFileSync(filePath, 'utf-8');
      return this.parse(text);
    } catch (error) {
      return {
        success: false,
        text: '',
        error: `Failed to read text file: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Parse text string
   */
  parse(text: string): ParseResult {
    try {
      if (!text || text.trim().length === 0) {
        return {
          success: false,
          text: '',
          error: 'Text is empty'
        };
      }

      // Clean up the text
      const cleanText = this.cleanText(text);

      return {
        success: true,
        text: cleanText
      };
    } catch (error) {
      return {
        success: false,
        text: '',
        error: `Failed to parse text: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Clean and normalize text
   */
  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n') // Windows line endings to Unix
      .replace(/\r/g, '\n') // Mac line endings to Unix
      .replace(/[ \t]+/g, ' ') // Multiple spaces/tabs to single
      .replace(/\n{3,}/g, '\n\n') // Multiple newlines to double
      .trim();
  }
}

/**
 * Quick helper function for simple use cases
 */
export function parseText(text: string): string {
  const parser = new TextParser();
  const result = parser.parse(text);

  if (!result.success) {
    throw new Error(result.error || 'Failed to parse text');
  }

  return result.text;
}
