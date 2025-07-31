// Department Routes - School Intelligence System
// API endpoints for department management and organization

import express from 'express';
import { departmentService } from '../services/departmentService.js';
import { 
  authenticateToken, 
  requireAdmin,
  requireExecutive,
  logRequests 
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply logging to all routes
router.use(logRequests);

// Get all departments (all authenticated users can view)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { schoolId = 'school_default' } = req.query;
    const result = departmentService.getAllDepartments(schoolId);

    if (result.success) {
      res.json({
        success: true,
        departments: result.departments
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error retrieving departments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve departments'
    });
  }
});

// Get departments with staff information (admin/executive only)
router.get('/with-staff', authenticateToken, requireExecutive, async (req, res) => {
  try {
    const { schoolId = 'school_default' } = req.query;
    const result = departmentService.getDepartmentsWithStaff(schoolId);

    if (result.success) {
      res.json({
        success: true,
        departments: result.departments
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error retrieving departments with staff:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve department staff information'
    });
  }
});

// Get specific department by ID
router.get('/:departmentId', authenticateToken, async (req, res) => {
  try {
    const { departmentId } = req.params;
    const result = departmentService.getDepartmentById(departmentId);

    if (result.success) {
      res.json({
        success: true,
        department: result.department
      });
    } else {
      res.status(404).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error retrieving department:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve department'
    });
  }
});

// Create new department (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { departmentName, description, schoolId, templateName } = req.body;

    if (!departmentName) {
      return res.status(400).json({
        success: false,
        error: 'Department name is required'
      });
    }

    const departmentData = {
      departmentName,
      description,
      schoolId: schoolId || 'school_default'
    };

    const result = departmentService.createDepartment(departmentData, templateName);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Department created successfully',
        department: result.department
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create department'
    });
  }
});

// Update department (admin only)
router.put('/:departmentId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { departmentId } = req.params;
    const updateData = req.body;

    const result = departmentService.updateDepartment(departmentId, updateData);

    if (result.success) {
      res.json({
        success: true,
        message: 'Department updated successfully',
        department: result.department
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update department'
    });
  }
});

// Assign department head (admin only)
router.post('/:departmentId/assign-head', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const result = departmentService.assignDepartmentHead(departmentId, userId);

    if (result.success) {
      res.json({
        success: true,
        message: 'Department head assigned successfully',
        department: result.department
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error assigning department head:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to assign department head'
    });
  }
});

// Add subject to department (admin only)
router.post('/:departmentId/subjects', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { subjectName, curriculum, yearLevels, description } = req.body;

    if (!subjectName) {
      return res.status(400).json({
        success: false,
        error: 'Subject name is required'
      });
    }

    const subjectData = {
      subjectName,
      curriculum: curriculum || 'IB_DP',
      yearLevels: yearLevels || ['DP1', 'DP2'],
      description: description || ''
    };

    const result = departmentService.addSubjectToDepartment(departmentId, subjectData);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Subject added to department successfully',
        department: result.department,
        subject: result.subject
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error adding subject to department:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add subject to department'
    });
  }
});

// Remove subject from department (admin only)
router.delete('/:departmentId/subjects/:subjectId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { departmentId, subjectId } = req.params;

    const result = departmentService.removeSubjectFromDepartment(departmentId, subjectId);

    if (result.success) {
      res.json({
        success: true,
        message: 'Subject removed from department successfully',
        department: result.department
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error removing subject from department:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove subject from department'
    });
  }
});

// Add staff to department (admin only)
router.post('/:departmentId/staff', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { departmentId } = req.params;
    const { userId, role, subjects } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const result = departmentService.addStaffToDepartment(
      departmentId, 
      userId, 
      role || 'Teacher', 
      subjects || []
    );

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'Staff added to department successfully',
        department: result.department
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error adding staff to department:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add staff to department'
    });
  }
});

// Get IB department templates (admin only)
router.get('/templates/ib', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = departmentService.getIBDepartmentTemplates();

    if (result.success) {
      res.json({
        success: true,
        templates: result.templates
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error) {
    console.error('Error retrieving IB templates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve IB department templates'
    });
  }
});

// Create all IB departments from templates (admin only)
router.post('/create-ib-departments', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { schoolId = 'school_default' } = req.body;

    const result = departmentService.createIBDepartments(schoolId);

    if (result.success) {
      res.status(201).json({
        success: true,
        message: `Created ${result.created} IB departments, ${result.failed} failed`,
        results: result.results
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to create IB departments'
      });
    }
  } catch (error) {
    console.error('Error creating IB departments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create IB departments'
    });
  }
});

// Error handling for this router
router.use((error, req, res, next) => {
  console.error('Department route error:', error);
  res.status(500).json({
    success: false,
    error: 'Department service error'
  });
});

export default router;