import express from 'express';
import { analyzeLesson, suggestImprovements, getFrameworks } from '../controllers/lessonController.js';

const router = express.Router();

router.post('/analyze', analyzeLesson);
router.post('/suggestions', suggestImprovements);
router.get('/frameworks', getFrameworks);

export default router;