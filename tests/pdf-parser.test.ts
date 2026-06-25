import { PDFParser, parsePDF } from '../src/parsers/pdf-parser';
import pdf from 'pdf-parse';
import * as fs from 'fs';

jest.mock('pdf-parse');
jest.mock('fs');

describe('PDFParser', () => {
  let parser: PDFParser;

  beforeEach(() => {
    parser = new PDFParser();
    jest.clearAllMocks();
  });

  describe('parseBuffer', () => {
    it('should successfully parse PDF data and clean the text', async () => {
      const mockParsedResult = {
        text: 'Page 1 text\r\nPage 1 line 2',
        numpages: 1
      };
      (pdf as unknown as jest.Mock).mockResolvedValue(mockParsedResult);

      const buffer = Buffer.from('mock pdf');
      const result = await parser.parseBuffer(buffer);

      expect(pdf).toHaveBeenCalledWith(buffer);
      expect(result.success).toBe(true);
      expect(result.text).toBe('Page 1 text\nPage 1 line 2');
      expect(result.pageCount).toBe(1);
    });

    it('should return error for empty or image-only PDFs', async () => {
      (pdf as unknown as jest.Mock).mockResolvedValue({
        text: '   ',
        numpages: 2
      });

      const result = await parser.parseBuffer(Buffer.from(''));
      expect(result.success).toBe(false);
      expect(result.text).toBe('');
      expect(result.error).toBe('PDF appears to be empty or contains only images');
    });

    it('should handle exceptions during parsing gracefully', async () => {
      (pdf as unknown as jest.Mock).mockRejectedValue(new Error('Corrupt file'));

      const result = await parser.parseBuffer(Buffer.from('corrupt'));
      expect(result.success).toBe(false);
      expect(result.text).toBe('');
      expect(result.error).toContain('Failed to parse PDF: Corrupt file');
    });
  });

  describe('parseFile', () => {
    it('should successfully read a file and parse it', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('pdf data'));
      (pdf as unknown as jest.Mock).mockResolvedValue({
        text: 'Resume content',
        numpages: 2
      });

      const result = await parser.parseFile('/path/to/resume.pdf');
      expect(fs.readFileSync).toHaveBeenCalledWith('/path/to/resume.pdf');
      expect(result.success).toBe(true);
      expect(result.text).toBe('Resume content');
      expect(result.pageCount).toBe(2);
    });

    it('should return error if reading file fails', async () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('Permission denied');
      });

      const result = await parser.parseFile('/path/to/resume.pdf');
      expect(result.success).toBe(false);
      expect(result.text).toBe('');
      expect(result.error).toContain('Failed to read PDF file: Permission denied');
    });
  });

  describe('parsePDF helper', () => {
    it('should parse and return text directly', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('pdf'));
      (pdf as unknown as jest.Mock).mockResolvedValue({
        text: 'Done',
        numpages: 1
      });

      const text = await parsePDF('/path.pdf');
      expect(text).toBe('Done');
    });

    it('should throw error if parsing fails', async () => {
      (fs.readFileSync as jest.Mock).mockReturnValue(Buffer.from('pdf'));
      (pdf as unknown as jest.Mock).mockRejectedValue(new Error('Failed'));

      await expect(parsePDF('/path.pdf')).rejects.toThrow('Failed');
    });
  });
});
