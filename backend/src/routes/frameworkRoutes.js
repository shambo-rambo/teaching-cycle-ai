// Framework Management Routes - School Intelligence System
// API endpoints for framework creation and distribution

import express from 'express';
import { frameworkService } from '../services/frameworkService.js';
import { 
  authenticateToken, 
  requireExecutive,
  requireAdmin,
  logRequests 
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply logging to all routes
router.use(logRequests);

// Framework CRUD Operations

// Get all frameworks with filtering
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Filter based on user role
    let result;
    if (req.query.forRole === 'true') {
      result = frameworkService.getFrameworksForRole(req.user.role, req.user.userId);
    } else {
      const filters = {
        type: req.query.type,
        status: req.query.status,
        priority: req.query.priority,
        mandatory: req.query.mandatory === 'true',
        createdBy: req.query.createdBy,
        search: req.query.search
      };
      result = frameworkService.getAllFrameworks(filters);
    }

    res.json(result);
  } catch (error) {
    console.error('Get frameworks error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve frameworks'
    });
  }
});

// Get framework by ID
router.get('/frameworks/:frameworkId', authenticateToken, async (req, res) => {
  try {
    const { frameworkId } = req.params;
    const result = frameworkService.getFrameworkById(frameworkId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Get framework error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve framework'
    });
  }
});

// Create new framework (Executive and Admin only)
router.post('/frameworks', authenticateToken, requireExecutive, async (req, res) => {
  try {
    // Validate user can create this type of framework
    const { type } = req.body;
    
    if (type === 'teaching' && req.user.role !== 'HeadOfTeachingLearning' && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        error: 'Only Head of Teaching & Learning can create teaching frameworks'
      });
    }
    
    if (type === 'support' && req.user.role !== 'HeadOfLearningSupport' && req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        error: 'Only Head of Learning Support can create support frameworks'
      });
    }

    const result = frameworkService.createFramework(req.body, req.user.userId);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Create framework error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create framework'
    });
  }
});

// Update framework
router.put('/frameworks/:frameworkId', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { frameworkId } = req.params;
    
    // Check if user can modify this framework
    const frameworkResult = frameworkService.getFrameworkById(frameworkId);
    if (!frameworkResult.success) {
      return res.status(404).json(frameworkResult);
    }
    
    const framework = frameworkResult.framework;
    
    // Only creator, admin, or appropriate role can modify
    if (req.user.role !== 'Admin' && 
        framework.createdBy !== req.user.userId &&
        (framework.type === 'teaching' && req.user.role !== 'HeadOfTeachingLearning') &&
        (framework.type === 'support' && req.user.role !== 'HeadOfLearningSupport')) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions to modify this framework'
      });
    }

    const result = frameworkService.updateFramework(frameworkId, req.body, req.user.userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Update framework error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update framework'
    });
  }
});

// Delete framework (Admin only, or creator if still draft)
router.delete('/frameworks/:frameworkId', authenticateToken, async (req, res) => {
  try {
    const { frameworkId } = req.params;
    
    // Check if user can delete this framework
    const frameworkResult = frameworkService.getFrameworkById(frameworkId);
    if (!frameworkResult.success) {
      return res.status(404).json(frameworkResult);
    }
    
    const framework = frameworkResult.framework;
    
    // Only admin can delete active frameworks, creators can delete drafts
    if (req.user.role !== 'Admin' && 
        (framework.status !== 'draft' || framework.createdBy !== req.user.userId)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions to delete this framework'
      });
    }

    const result = frameworkService.deleteFramework(frameworkId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Delete framework error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete framework'
    });
  }
});

// Framework Status Operations

// Activate framework
router.post('/frameworks/:frameworkId/activate', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { frameworkId } = req.params;
    const result = frameworkService.activateFramework(frameworkId, req.user.userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Activate framework error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to activate framework'
    });
  }
});

// Archive framework
router.post('/frameworks/:frameworkId/archive', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { frameworkId } = req.params;
    const result = frameworkService.archiveFramework(frameworkId, req.user.userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Archive framework error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to archive framework'
    });
  }
});

// Framework Requirements

// Add requirement to framework
router.post('/frameworks/:frameworkId/requirements', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { frameworkId } = req.params;
    const result = frameworkService.addRequirement(frameworkId, req.body, req.user.userId);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Add requirement error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add requirement'
    });
  }
});

// Framework Application

// Get frameworks applicable to specific context
router.post('/frameworks/applicable', authenticateToken, async (req, res) => {
  try {
    const context = req.body; // { departmentId, subject, yearLevel, classId }
    const result = frameworkService.getApplicableFrameworks(context);
    res.json(result);
  } catch (error) {
    console.error('Get applicable frameworks error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve applicable frameworks'
    });
  }
});

// Compliance and Tracking

// Update framework compliance
router.post('/frameworks/:frameworkId/compliance', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { frameworkId } = req.params;
    const result = frameworkService.updateFrameworkCompliance(frameworkId, req.body, req.user.userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Update compliance error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update framework compliance'
    });
  }
});

// Templates and Helpers

// Get framework templates
router.get('/frameworks/templates/:type', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['teaching', 'support'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Type must be either "teaching" or "support"'
      });
    }

    const result = frameworkService.getFrameworkTemplates(type);
    res.json(result);
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve framework templates'
    });
  }
});

// Statistics and Reporting

// Get framework statistics
router.get('/frameworks/statistics', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const result = frameworkService.getStatistics();
    res.json(result);
  } catch (error) {
    console.error('Get framework statistics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve framework statistics'
    });
  }
});

// Error handling for this router
router.use((error, req, res, next) => {
  console.error('Framework route error:', error);
  res.status(500).json({
    success: false,
    error: 'Framework management service error'
  });
});

export default router;