import express from 'express';
import { curriculumService } from '../services/curriculumService.js';

const router = express.Router();

// Suggest syllabus points based on topic and papers
router.post('/suggest-syllabus-points', async (req, res) => {
  try {
    const { topic, papers } = req.body;

    if (!topic || !papers || papers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Topic and at least one paper are required'
      });
    }

    console.log('Searching for syllabus points:', { topic, papers });

    const result = await curriculumService.suggestSyllabusPoints(topic, papers);

    if (result.error) {
      return res.status(400).json({
        success: false,
        error: result.message
      });
    }

    res.json({
      success: true,
      syllabusPoints: result.syllabusPoints,
      confidence: result.confidence || 'medium',
      message: 'Syllabus points suggested successfully'
    });
  } catch (error) {
    console.error('Error in suggestSyllabusPoints:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to suggest syllabus points'
    });
  }
});

export default router;