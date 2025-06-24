import { AIAnalysisService } from '../services/aiAnalysisService.js';
import { FrameworkDetectionService } from '../services/frameworkDetectionService.js';
import { QuestionService } from '../services/questionService.js';
import Joi from 'joi';

const aiAnalysisService = new AIAnalysisService();
const frameworkDetectionService = new FrameworkDetectionService();
const questionService = new QuestionService();

const analysisSchema = Joi.object({
  lessonContent: Joi.string().required().min(50),
  teacherId: Joi.string().optional(),
  lessonTitle: Joi.string().optional(),
  subject: Joi.string().optional(),
  yearLevel: Joi.string().optional()
});

const responseSchema = Joi.object({
  questionId: Joi.string().required(),
  response: Joi.string().required().min(1),
  lessonId: Joi.string().required()
});

export const analyzeLesson = async (req, res) => {
  try {
    const { error, value } = analysisSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.details[0].message
      });
    }

    const { lessonContent, teacherId, lessonTitle, subject, yearLevel } = value;

    // Step 1: Detect framework elements using pattern matching
    const frameworkAnalysis = frameworkDetectionService.detectFrameworkElements(lessonContent);

    // Step 2: Generate AI-powered analysis
    const aiAnalysis = await aiAnalysisService.analyzeLesson(lessonContent);

    // Step 3: Generate clarifying questions
    const questions = frameworkDetectionService.generateQuestions(frameworkAnalysis, lessonContent);

    // Step 4: Combine results
    const lessonAnalysis = {
      lessonId: `lesson_${Date.now()}`,
      teacherId: teacherId || 'anonymous',
      metadata: {
        title: lessonTitle || 'Untitled Lesson',
        subject: subject || 'General',
        yearLevel: yearLevel || 'Not specified',
        analyzedAt: new Date().toISOString()
      },
      originalContent: lessonContent,
      frameworkAnalysis: {
        ...frameworkAnalysis,
        aiEnhanced: aiAnalysis.frameworkAnalysis || {}
      },
      questions: questions,
      suggestions: aiAnalysis.suggestions || [],
      overallAssessment: aiAnalysis.overallAssessment || 'Analysis completed',
      status: 'analyzed'
    };

    res.json({
      success: true,
      data: lessonAnalysis
    });
  } catch (error) {
    console.error('Error in analyzeLesson:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze lesson'
    });
  }
};

export const respondToQuestion = async (req, res) => {
  try {
    const { error, value } = responseSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid input',
        details: error.details[0].message
      });
    }

    const { questionId, response, lessonId } = value;
    const teacherId = req.body.teacherId || 'anonymous';

    // Record the teacher response
    const responseRecord = await questionService.recordTeacherResponse(
      questionId, 
      response, 
      teacherId, 
      lessonId
    );

    // For MVP, we'll return the response record
    // In full implementation, this would update the stored lesson analysis
    res.json({
      success: true,
      data: {
        responseId: `response_${Date.now()}`,
        questionId,
        response,
        responseType: responseRecord.responseType,
        timestamp: responseRecord.timestamp,
        message: 'Thank you for your response. Your explanation helps us understand your teaching approach better.'
      }
    });
  } catch (error) {
    console.error('Error in respondToQuestion:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process response'
    });
  }
};

export const generateSuggestions = async (req, res) => {
  try {
    const { lessonId, frameworkAnalysis, teacherResponses } = req.body;

    if (!frameworkAnalysis) {
      return res.status(400).json({
        success: false,
        error: 'Framework analysis is required'
      });
    }

    const suggestions = await aiAnalysisService.generateSuggestions(
      frameworkAnalysis,
      teacherResponses || []
    );

    res.json({
      success: true,
      data: {
        lessonId,
        suggestions: suggestions.suggestions || [],
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error in generateSuggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate suggestions'
    });
  }
};

export const getFrameworkInfo = (req, res) => {
  try {
    const frameworkInfo = frameworkDetectionService.getFrameworkInfo();
    
    res.json({
      success: true,
      data: {
        frameworks: frameworkInfo,
        description: 'Three integrated pedagogical frameworks for lesson analysis'
      }
    });
  } catch (error) {
    console.error('Error in getFrameworkInfo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get framework information'
    });
  }
};

export const rateSuggestion = async (req, res) => {
  try {
    const { suggestionId, rating, feedback } = req.body;

    if (!suggestionId || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Suggestion ID and rating are required'
      });
    }

    // For MVP, just acknowledge the rating
    // In full implementation, this would be stored in the database
    const ratingRecord = {
      suggestionId,
      rating, // 'helpful' | 'unhelpful' | 'implemented'
      feedback: feedback || '',
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: ratingRecord,
      message: 'Thank you for your feedback! This helps us improve our suggestions.'
    });
  } catch (error) {
    console.error('Error in rateSuggestion:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to record suggestion rating'
    });
  }
};