/**
 * Word Document Parser - Extract text from .docx files
 * Uses mammoth for server-side Word processing
 */

import mammoth from 'mammoth';
import * as fs from 'fs';

export interface ParseResult {
  success: boolean;
  text: string;
  error?: string;
}

export class WordParser {
  /**
   * Parse Word document from file path
   */
  async parseFile(filePath: string): Promise<ParseResult> {
    try {
      const buffer = fs.readFileSync(filePath);
      return await this.parseBuffer(buffer);
    } catch (error) {
      return {
        success: false,
        text: '',
        error: `Failed to read Word file: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Parse Word document from buffer
   */
  async parseBuffer(buffer: Buffer): Promise<ParseResult> {
    try {
      const result = await mammoth.extractRawText({ buffer });

      if (!result.value || result.value.trim().length === 0) {
        return {
          success: false,
          text: '',
          error: 'Word document appears to be empty'
        };
      }

      // Clean up extracted text
      const cleanText = this.cleanText(result.value);

      return {
        success: true,
        text: cleanText
      };
    } catch (error) {
      return {
        success: false,
        text: '',
        error: `Failed to parse Word document: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Clean and normalize extracted text
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
export async function parseWord(filePath: string): Promise<string> {
  const parser = new WordParser();
  const result = await parser.parseFile(filePath);

  if (!result.success) {
    throw new Error(result.error || 'Failed to parse Word document');
  }

  return result.text;
}
