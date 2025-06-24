import express from 'express';
import { 
  analyzeLesson, 
  respondToQuestion, 
  generateSuggestions, 
  getFrameworkInfo,
  rateSuggestion 
} from '../controllers/analysisController.js';

const router = express.Router();

// Core analysis routes
router.post('/analyze', analyzeLesson);
router.post('/questions/respond', respondToQuestion);
router.post('/suggestions/generate', generateSuggestions);
router.post('/suggestions/rate', rateSuggestion);

// Framework information
router.get('/frameworks', getFrameworkInfo);

export default router;