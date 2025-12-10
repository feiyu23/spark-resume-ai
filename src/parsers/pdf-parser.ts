/**
 * PDF Parser - Extract text from PDF resumes
 * Uses pdf-parse for server-side PDF processing
 */

import pdf from 'pdf-parse';
import * as fs from 'fs';

export interface ParseResult {
  success: boolean;
  text: string;
  pageCount?: number;
  error?: string;
}

export class PDFParser {
  /**
   * Parse PDF file from file path
   */
  async parseFile(filePath: string): Promise<ParseResult> {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      return await this.parseBuffer(dataBuffer);
    } catch (error) {
      return {
        success: false,
        text: '',
        error: `Failed to read PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Parse PDF from buffer
   */
  async parseBuffer(buffer: Buffer): Promise<ParseResult> {
    try {
      const data = await pdf(buffer);

      if (!data.text || data.text.trim().length === 0) {
        return {
          success: false,
          text: '',
          error: 'PDF appears to be empty or contains only images'
        };
      }

      // Clean up extracted text
      const cleanText = this.cleanText(data.text);

      return {
        success: true,
        text: cleanText,
        pageCount: data.numpages
      };
    } catch (error) {
      return {
        success: false,
        text: '',
        error: `Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
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
export async function parsePDF(filePath: string): Promise<string> {
  const parser = new PDFParser();
  const result = await parser.parseFile(filePath);

  if (!result.success) {
    throw new Error(result.error || 'Failed to parse PDF');
  }

  return result.text;
}
