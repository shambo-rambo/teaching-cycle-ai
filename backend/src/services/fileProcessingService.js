import multer from 'multer';
import mammoth from 'mammoth';
import fs from 'fs';
import path from 'path';

// Import pdf-parse using require (CommonJS) since it doesn't support ES modules properly
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let pdfParse = null;
const initPdfParse = () => {
  if (!pdfParse) {
    try {
      pdfParse = require('pdf-parse');
    } catch (error) {
      console.error('pdf-parse import failed:', error.message);
      throw new Error('PDF processing is currently unavailable');
    }
  }
  return pdfParse;
};

// Configure multer for file uploads
const storage = multer.memoryStorage();
export const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word documents, and text files are allowed.'));
    }
  }
});

export class FileProcessingService {
  static async processUploadedFile(file) {
    if (!file || !file.buffer) {
      throw new Error('No file provided');
    }

    const { originalname, mimetype, buffer } = file;
    
    try {
      switch (mimetype) {
        case 'application/pdf':
          return await this.processPDF(buffer, originalname);
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return await this.processWord(buffer, originalname);
        case 'text/plain':
          return await this.processText(buffer, originalname);
        default:
          throw new Error(`Unsupported file type: ${mimetype}`);
      }
    } catch (error) {
      console.error(`Error processing file ${originalname}:`, error);
      throw new Error(`Failed to process ${originalname}: ${error.message}`);
    }
  }

  static async processPDF(buffer, filename) {
    try {
      const pdfParseLib = initPdfParse();
      const data = await pdfParseLib(buffer);
      
      if (!data.text || data.text.trim().length === 0) {
        throw new Error('No readable text found in PDF. The PDF might be image-based or corrupted.');
      }

      // Clean up the extracted text
      const cleanText = data.text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      return {
        content: cleanText,
        metadata: {
          filename,
          type: 'pdf',
          pages: data.numpages,
          extractedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      throw new Error(`PDF processing failed: ${error.message}`);
    }
  }

  static async processWord(buffer, filename) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      
      if (!result.value || result.value.trim().length === 0) {
        throw new Error('No readable text found in Word document.');
      }

      // Clean up the extracted text
      const cleanText = result.value
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n{3,}/g, '\n\n') // Limit consecutive line breaks
        .trim();

      return {
        content: cleanText,
        metadata: {
          filename,
          type: 'word',
          extractedAt: new Date().toISOString(),
          messages: result.messages // Any conversion messages from mammoth
        }
      };
    } catch (error) {
      throw new Error(`Word document processing failed: ${error.message}`);
    }
  }

  static async processText(buffer, filename) {
    try {
      const content = buffer.toString('utf8');
      
      if (!content || content.trim().length === 0) {
        throw new Error('Text file is empty.');
      }

      return {
        content: content.trim(),
        metadata: {
          filename,
          type: 'text',
          extractedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      throw new Error(`Text file processing failed: ${error.message}`);
    }
  }

  static validateFileContent(content) {
    if (!content || typeof content !== 'string') {
      throw new Error('Invalid file content');
    }

    if (content.trim().length < 10) {
      throw new Error('File content is too short. Please provide a more detailed lesson plan.');
    }

    if (content.length > 100000) { // 100KB text limit
      throw new Error('File content is too long. Please provide a shorter lesson plan.');
    }

    return true;
  }
}