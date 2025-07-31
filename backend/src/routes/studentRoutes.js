// Student Management Routes - School Intelligence System
// API endpoints for student data operations including CSV import

import express from 'express';
import multer from 'multer';
import { studentService } from '../services/studentService.js';
import { 
  authenticateToken, 
  requireExecutive,
  requireAdmin,
  logRequests 
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Apply logging to all routes
router.use(logRequests);

// Student CRUD Operations

// Get all students (Executive and Admin only)
router.get('/students', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const filters = {
      yearLevel: req.query.yearLevel,
      programme: req.query.programme,
      hasAccommodations: req.query.hasAccommodations === 'true',
      status: req.query.status,
      search: req.query.search
    };

    const result = studentService.getAllStudents(filters);
    res.json(result);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve students'
    });
  }
});

// Get student by ID
router.get('/students/:studentId', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = studentService.getStudentById(studentId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve student'
    });
  }
});

// Create new student (Executive and Admin only)
router.post('/students', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const result = studentService.createStudent(req.body, req.user.userId);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create student'
    });
  }
});

// Update student
router.put('/students/:studentId', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = studentService.updateStudent(studentId, req.body, req.user.userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update student'
    });
  }
});

// Delete student (Admin only)
router.delete('/students/:studentId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = studentService.deleteStudent(studentId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete student'
    });
  }
});

// CSV Import Operations

// Import students from CSV file
router.post('/students/import', authenticateToken, requireExecutive, upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'CSV file is required'
      });
    }

    const csvContent = req.file.buffer.toString('utf8');
    const result = studentService.importStudentsFromCSV(csvContent, req.user.userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('CSV import error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to import CSV file'
    });
  }
});

// Get CSV template
router.get('/students/csv-template', authenticateToken, requireExecutive, (req, res) => {
  try {
    const csvTemplate = studentService.generateCSVTemplate();
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="student_import_template.csv"');
    res.send(csvTemplate);
  } catch (error) {
    console.error('CSV template error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate CSV template'
    });
  }
});

// Class Management

// Get all classes
router.get('/classes', authenticateToken, async (req, res) => {
  try {
    const filters = {
      teacherId: req.query.teacherId || (req.user.role === 'Teacher' ? req.user.userId : undefined),
      yearLevel: req.query.yearLevel,
      subject: req.query.subject
    };

    const result = studentService.getAllClasses(filters);
    res.json(result);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve classes'
    });
  }
});

// Create new class (Executive and Admin only)
router.post('/classes', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const result = studentService.createClass(req.body, req.user.userId);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create class'
    });
  }
});

// Enroll student in class
router.post('/classes/:classId/students/:studentId', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { classId, studentId } = req.params;
    const result = studentService.enrollStudentInClass(studentId, classId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Enroll student error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to enroll student'
    });
  }
});

// Learning Support Operations

// Get students with learning support needs (Head of Learning Support and Admin)
router.get('/students/support', authenticateToken, async (req, res) => {
  try {
    // Check if user has permission to view support data
    if (req.user.role !== 'Admin' && 
        req.user.role !== 'HeadOfLearningSupport' && 
        !req.user.permissions.includes('view_student_support_data')) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions to view student support data'
      });
    }

    const result = studentService.getStudentsWithSupport();
    res.json(result);
  } catch (error) {
    console.error('Get support students error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve students with support needs'
    });
  }
});

// Statistics and Reporting

// Get student statistics
router.get('/students/statistics', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const result = studentService.getStatistics();
    res.json(result);
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics'
    });
  }
});

// Error handling for this router
router.use((error, req, res, next) => {
  console.error('Student route error:', error);
  res.status(500).json({
    success: false,
    error: 'Student management service error'
  });
});

export default router;