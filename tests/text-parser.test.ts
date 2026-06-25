import { TextParser, parseText } from '../src/parsers/text-parser';
import * as fs from 'fs';

jest.mock('fs');

describe('TextParser', () => {
  let parser: TextParser;

  beforeEach(() => {
    parser = new TextParser();
    jest.clearAllMocks();
  });

  describe('parse', () => {
    it('should successfully parse valid text and normalize line endings/spaces', () => {
      const input = 'Line 1\r\nLine 2\r\r\n\nLine 3   with   spaces';
      const result = parser.parse(input);

      expect(result.success).toBe(true);
      expect(result.text).toBe('Line 1\nLine 2\n\nLine 3 with spaces');
      expect(result.error).toBeUndefined();
    });

    it('should return error for empty text', () => {
      const result = parser.parse('   ');
      expect(result.success).toBe(false);
      expect(result.text).toBe('');
      expect(result.error).toBe('Text is empty');
    });

    it('should handle exceptions gracefully', () => {
      // Pass an object that throws on trim() to force a runtime exception
      const invalidText = {
        trim: () => {
          throw new Error('Trim failed');
        }
      };
      const result = parser.parse(invalidText as any);
      expect(result.success).toBe(false);
      expect(result.text).toBe('');
      expect(result.error).toContain('Failed to parse text: Trim failed');
    });
  });

  describe('parseFile', () => {
    it('should successfully read and parse a text file', () => {
      const mockContent = 'Hello World';
      (fs.readFileSync as jest.Mock).mockReturnValue(mockContent);

      const result = parser.parseFile('/path/to/resume.txt');
      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/resume.txt', 'utf-8');
      expect(result.success).toBe(true);
      expect(result.text).toBe(mockContent);
    });

    it('should return error if file reading fails', () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('File not found');
      });

      const result = parser.parseFile('/invalid/path.txt');
      expect(result.success).toBe(false);
      expect(result.text).toBe('');
      expect(result.error).toContain('Failed to read text file: File not found');
    });
  });

  describe('parseText helper', () => {
    it('should parse and return string directly', () => {
      const result = parseText('Hello');
      expect(result).toBe('Hello');
    });

    it('should throw error if parsing fails', () => {
      expect(() => parseText('')).toThrow('Text is empty');
    });
  });
});
