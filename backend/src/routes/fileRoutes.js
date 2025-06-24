import express from 'express';
import { upload, FileProcessingService } from '../services/fileProcessingService.js';

const router = express.Router();

// Upload and process file endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    const result = await FileProcessingService.processUploadedFile(req.file);
    
    // Validate content
    FileProcessingService.validateFileContent(result.content);

    res.json({
      success: true,
      data: {
        content: result.content,
        metadata: result.metadata
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

export default router;