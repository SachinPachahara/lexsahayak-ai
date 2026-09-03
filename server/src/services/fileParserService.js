import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { ApiError } from '../utils/ApiError.js';
import { extractImageText, extractScannedPdfText } from './ocrService.js';

export async function extractText(file, extension) {
  try {
    if (extension === '.txt') return file.buffer.toString('utf8');
    if (extension === '.docx') return (await mammoth.extractRawText({ buffer: file.buffer })).value;
    if (extension === '.pdf') {
      const text = (await pdfParse(file.buffer)).text.trim();
      return text.length >= 20 ? text : extractScannedPdfText(file.buffer);
    }
    if (['.jpg','.jpeg','.png'].includes(extension)) return extractImageText(file.buffer);
  } catch {
    throw new ApiError(422, 'The document could not be parsed. It may be encrypted, damaged, or unreadable by OCR.', 'DOCUMENT_PARSE_FAILED');
  }
  throw new ApiError(415, 'Unsupported document type', 'UNSUPPORTED_FILE_TYPE');
}
