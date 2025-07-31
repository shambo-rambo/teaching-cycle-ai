// Privacy Management Routes - School Intelligence System
// API endpoints for student privacy compliance and audit functionality

import express from 'express';
import { studentPrivacyService } from '../services/studentPrivacyService.js';
import { AIAnalysisService } from '../services/aiAnalysisService.js';
import { studentService } from '../services/studentService.js';
import { 
  authenticateToken, 
  requireExecutive,
  requireAdmin,
  logRequests 
} from '../middleware/authMiddleware.js';

const router = express.Router();
const aiAnalysisService = new AIAnalysisService();

// Apply logging to all routes
router.use(logRequests);

// Privacy-compliant lesson analysis with student differentiation
router.post('/analyze-lesson-with-students', authenticateToken, async (req, res) => {
  try {
    const { lessonData, classId, sessionId } = req.body;

    if (!lessonData || !classId) {
      return res.status(400).json({
        success: false,
        error: 'Lesson data and class ID are required'
      });
    }

    // Get class and student data
    const classResult = studentService.getAllClasses({ classId });
    if (!classResult.success || classResult.classes.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Class not found'
      });
    }

    const classData = classResult.classes[0];
    
    // Get students in the class
    const studentIds = classData.students || [];
    const students = [];
    
    for (const studentId of studentIds) {
      const studentResult = studentService.getStudentById(studentId);
      if (studentResult.success) {
        students.push(studentResult.student);
      }
    }

    if (students.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No students found in class'
      });
    }

    // Perform privacy-compliant analysis
    const analysis = await aiAnalysisService.analyzeLessonWithStudentContext(
      lessonData,
      classData,
      students,
      sessionId
    );

    res.json({
      success: true,
      ...analysis,
      privacyProtected: true,
      studentCount: students.length
    });

  } catch (error) {
    console.error('Privacy-compliant lesson analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze lesson with student context',
      details: error.message
    });
  }
});

// Generate personalized recommendations while maintaining privacy
router.post('/personalized-recommendations', authenticateToken, async (req, res) => {
  try {
    const { lessonContent, studentIds, frameworkRequirements, sessionId } = req.body;

    if (!lessonContent || !studentIds || !Array.isArray(studentIds)) {
      return res.status(400).json({
        success: false,
        error: 'Lesson content and student IDs array are required'
      });
    }

    // Get student data
    const students = [];
    for (const studentId of studentIds) {
      const studentResult = studentService.getStudentById(studentId);
      if (studentResult.success) {
        students.push(studentResult.student);
      }
    }

    if (students.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid students found'
      });
    }

    // Generate privacy-compliant recommendations
    const recommendations = await aiAnalysisService.generatePersonalizedRecommendations(
      lessonContent,
      students,
      frameworkRequirements || [],
      sessionId
    );

    res.json({
      success: true,
      ...recommendations,
      privacyProtected: true,
      studentCount: students.length
    });

  } catch (error) {
    console.error('Personalized recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate personalized recommendations',
      details: error.message
    });
  }
});

// Privacy compliance reporting (Admin and Executive only)
router.get('/compliance-report', authenticateToken, requireExecutive, (req, res) => {
  try {
    const report = studentPrivacyService.getPrivacyComplianceReport();
    
    res.json({
      success: true,
      complianceReport: report,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Privacy compliance report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate privacy compliance report'
    });
  }
});

// Privacy audit log (Admin only)
router.get('/audit-log', authenticateToken, requireAdmin, (req, res) => {
  try {
    const { startDate, endDate, limit = 100 } = req.query;
    
    let auditLog = studentPrivacyService.getAuditLog(startDate, endDate);
    
    // Limit results for performance
    if (limit && !isNaN(limit)) {
      auditLog = auditLog.slice(-parseInt(limit));
    }

    res.json({
      success: true,
      auditLog: auditLog,
      totalEntries: auditLog.length,
      filters: {
        startDate: startDate || null,
        endDate: endDate || null,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Privacy audit log error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve privacy audit log'
    });
  }
});

// Validate data for AI safety (Development/testing endpoint)
router.post('/validate-ai-data', authenticateToken, async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        error: 'Data to validate is required'
      });
    }

    const validation = studentPrivacyService.validateAISafeData(data);

    res.json({
      success: true,
      validation: validation,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI data validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate AI data safety'
    });
  }
});

// Clear session cache for privacy (session cleanup)
router.delete('/session/:sessionId', authenticateToken, (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      });
    }

    studentPrivacyService.clearSessionCache(sessionId);

    res.json({
      success: true,
      message: 'Session cache cleared for privacy protection',
      sessionId: sessionId
    });
  } catch (error) {
    console.error('Session cache clear error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear session cache'
    });
  }
});

// Test privacy protection (Development endpoint)
if (process.env.NODE_ENV === 'development') {
  router.post('/test-privacy-protection', authenticateToken, requireAdmin, async (req, res) => {
    try {
      const { testStudents } = req.body;

      if (!testStudents || !Array.isArray(testStudents)) {
        return res.status(400).json({
          success: false,
          error: 'Test students array is required'
        });
      }

      const sessionId = 'test_session_' + Date.now();
      
      // Test anonymization
      const aiSafeData = studentPrivacyService.prepareStudentDataForAI(testStudents, sessionId);
      
      // Test validation
      const validation = studentPrivacyService.validateAISafeData(aiSafeData);
      
      // Test mapping back (simulate AI response)
      const mockAIResponse = {};
      aiSafeData.forEach(student => {
        mockAIResponse[student.studentRef] = {
          recommendation: `Test recommendation for ${student.studentRef}`,
          accommodations: student.learningSupport.accommodations
        };
      });
      
      const mappedResponse = studentPrivacyService.mapAIResponseToStudents(mockAIResponse, sessionId);

      res.json({
        success: true,
        test: {
          originalStudents: testStudents.length,
          aiSafeData: aiSafeData,
          validation: validation,
          mockAIResponse: mockAIResponse,
          mappedResponse: mappedResponse,
          sessionId: sessionId
        },
        privacyProtectionWorking: validation.isValid && Object.keys(mappedResponse).length > 0
      });

    } catch (error) {
      console.error('Privacy protection test error:', error);
      res.status(500).json({
        success: false,
        error: 'Privacy protection test failed',
        details: error.message
      });
    }
  });
}

// Error handling for this router
router.use((error, req, res, next) => {
  console.error('Privacy route error:', error);
  res.status(500).json({
    success: false,
    error: 'Privacy service error'
  });
});

export default router;