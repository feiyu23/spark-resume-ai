import { WordParser, parseWord } from '../src/parsers/word-parser';
import mammoth from 'mammoth';
import * as fs from 'fs';

jest.mock('mammoth');
jest.mock('fs');

describe('WordParser', () => {
  let parser: WordParser;

  beforeEach(() => {
    parser = new WordParser();
    jest.clearAllMocks();
  });

  describe('parseBuffer', () => {
    it('should successfully parse docx data and clean the text', async () => {
      const mockResult = {
        value: 'Word Document Content\r\nSecondary line',
        messages: []
      };
      (mammoth.extractRawText as jest.Mock).mockResolvedValue(mockResult);

      const buffer = Buffer.from('mock docx');
      const result = await parser.parseBuffer(buffer);

      expect(mammoth.extractRawText).toHaveBeenCalledWith({ buffer });
      expect(result.success).toBe(true);
      expect(result.text).toBe('Word Document Content\nSecondary line');
    });

    it('should return error for empty word documents', async () => {
      (mammoth.extractRawText as jest.Mock).mockResolvedValue({
        value: '   ',
        messages: []
      });

      const result = await parser.parseBuffer(Buffer.from(''));
      expect(result.success).toBe(false);
      expect(result.text).toBe('');
      expect(result.error).toBe('Word document appears to be empty');
    });

    it('should handle exceptions during parsing gracefully', async () => {
      (mammoth.extractRawText as jest.Mock).mockRejectedValue(new Error('Corrupt zip'));

      const result = await parser.parseBuffer(Buffer.from('corrupt'));
      expect(result.success).toBe(false);
      expect(result.text).toBe('');
      expect(result.error).toContain('Failed to parse Word document: Corrupt zip');
    });
  });

  describe('parseFile', () => {
    it('should successfully read file and parse it', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('docx data'));
      (mammoth.extractRawText as jest.Mock).mockResolvedValue({
        value: 'Word content',
        messages: []
      });

      const result = await parser.parseFile('/path/to/resume.docx');
      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/resume.docx');
      expect(result.success).toBe(true);
      expect(result.text).toBe('Word content');
    });

    it('should return error if reading file fails', async () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Read error');
      });

      const result = await parser.parseFile('/path/to/resume.docx');
      expect(result.success).toBe(false);
      expect(result.text).toBe('');
      expect(result.error).toContain('Failed to read Word file: Read error');
    });
  });

  describe('parseWord helper', () => {
    it('should parse and return text directly', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('docx'));
      (mammoth.extractRawText as jest.Mock).mockResolvedValue({
        value: 'Done',
        messages: []
      });

      const text = await parseWord('/path.docx');
      expect(text).toBe('Done');
    });

    it('should throw error if parsing fails', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('docx'));
      (mammoth.extractRawText as jest.Mock).mockRejectedValue(new Error('Failed'));

      await expect(parseWord('/path.docx')).rejects.toThrow('Failed');
    });
  });
});
