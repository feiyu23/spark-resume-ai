/**
 * Resume Parsers - Export all parsers
 */

export { PDFParser, parsePDF, ParseResult as PDFParseResult } from './pdf-parser';
export { WordParser, parseWord, ParseResult as WordParseResult } from './word-parser';
export { TextParser, parseText, ParseResult as TextParseResult } from './text-parser';

import { PDFParser } from './pdf-parser';
import { WordParser } from './word-parser';
import { TextParser } from './text-parser';
import * as fs from 'fs';

export interface AutoParseResult {
  success: boolean;
  text: string;
  fileType: 'pdf' | 'word' | 'text' | 'unknown';
  error?: string;
}

/**
 * Automatically detect file type and parse resume
 */
export async function parseResume(filePath: string): Promise<AutoParseResult> {
  // Check file size (limit to 10MB)
  try {
    const stats = fs.statSync(filePath);
    if (stats.size > 10 * 1024 * 1024) {
      return {
        success: false,
        text: '',
        fileType: 'unknown',
        error: 'File size exceeds 10MB limit'
      };
    }
  } catch (error) {
    return {
      success: false,
      text: '',
      fileType: 'unknown',
      error: `Failed to read file: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }

  const fileName = filePath.toLowerCase();

  // Detect file type and parse accordingly
  if (fileName.endsWith('.pdf')) {
    const parser = new PDFParser();
    const result = await parser.parseFile(filePath);
    return { ...result, fileType: 'pdf' };
  } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
    const parser = new WordParser();
    const result = await parser.parseFile(filePath);
    return { ...result, fileType: 'word' };
  } else if (fileName.endsWith('.txt')) {
    const parser = new TextParser();
    const result = parser.parseFile(filePath);
    return { ...result, fileType: 'text' };
  } else {
    // Try to parse as text file
    const parser = new TextParser();
    const result = parser.parseFile(filePath);
    if (result.success) {
      return { ...result, fileType: 'text' };
    }

    return {
      success: false,
      text: '',
      fileType: 'unknown',
      error: 'Unsupported file format. Please use PDF, Word (.doc/.docx), or text (.txt) files.'
    };
  }
}
