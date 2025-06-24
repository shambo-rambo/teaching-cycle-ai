import { LessonAnalysisService } from '../services/lessonAnalysisService.js';
import Joi from 'joi';

const lessonAnalysisService = new LessonAnalysisService();

const analyzeSchema = Joi.object({
  content: Joi.string().required().min(10),
  framework: Joi.string().valid('bloom', 'solo', 'constructivism', 'general').default('general')
});

const improvementSchema = Joi.object({
  content: Joi.string().required().min(10),
  currentAnalysis: Joi.object().required()
});

export const analyzeLesson = async (req, res) => {
  try {
    const { error, value } = analyzeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.details[0].message
      });
    }

    const { content, framework } = value;
    const analysis = await lessonAnalysisService.analyzeLesson(content, framework);
    
    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error in analyzeLesson:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze lesson'
    });
  }
};

export const suggestImprovements = async (req, res) => {
  try {
    const { error, value } = improvementSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.details[0].message
      });
    }

    const { content, currentAnalysis } = value;
    const suggestions = await lessonAnalysisService.suggestImprovements(content, currentAnalysis);
    
    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Error in suggestImprovements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate suggestions'
    });
  }
};

export const getFrameworks = (req, res) => {
  const frameworks = [
    {
      id: 'general',
      name: 'General Pedagogy',
      description: 'Comprehensive educational best practices'
    },
    {
      id: 'bloom',
      name: 'Bloom\'s Taxonomy',
      description: 'Focus on cognitive learning levels'
    },
    {
      id: 'solo',
      name: 'SOLO Taxonomy',
      description: 'Structure of Observed Learning Outcomes'
    },
    {
      id: 'constructivism',
      name: 'Constructivist Learning',
      description: 'Knowledge construction and scaffolding'
    }
  ];

  res.json({
    success: true,
    data: frameworks
  });
};