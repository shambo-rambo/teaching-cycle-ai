// Department Service - School Intelligence System
// Handles department creation, management, and subject assignment

import { createDepartment, IBDepartmentTemplates, addStaffToDepartment } from '../models/Department.js';

// In-memory storage for MVP (replace with database later)
let departments = [];

export class DepartmentService {
  constructor() {
    this.departments = departments;
  }

  // Create a new department
  createDepartment(departmentData, templateName = null) {
    try {
      // Validate required fields
      if (!departmentData.departmentName) {
        return {
          success: false,
          error: 'Department name is required'
        };
      }

      if (!departmentData.schoolId) {
        departmentData.schoolId = 'school_default';
      }

      // Check if department name already exists
      const existingDepartment = this.departments.find(
        dept => dept.departmentName.toLowerCase() === departmentData.departmentName.toLowerCase() &&
                dept.schoolId === departmentData.schoolId
      );

      if (existingDepartment) {
        return {
          success: false,
          error: 'Department with this name already exists'
        };
      }

      // Create department using model
      const newDepartment = createDepartment(departmentData, templateName);

      // Store department
      this.departments.push(newDepartment);

      console.log(`✅ Department created: ${newDepartment.departmentName} (${newDepartment.subjects.length} subjects)`);

      return {
        success: true,
        department: newDepartment
      };
    } catch (error) {
      console.error('Error creating department:', error);
      return {
        success: false,
        error: 'Failed to create department'
      };
    }
  }

  // Get all departments
  getAllDepartments(schoolId = 'school_default') {
    try {
      const schoolDepartments = this.departments.filter(dept => 
        dept.schoolId === schoolId && dept.status === 'active'
      );

      return {
        success: true,
        departments: schoolDepartments
      };
    } catch (error) {
      console.error('Error retrieving departments:', error);
      return {
        success: false,
        error: 'Failed to retrieve departments'
      };
    }
  }

  // Get department by ID
  getDepartmentById(departmentId) {
    try {
      const department = this.departments.find(dept => dept.departmentId === departmentId);

      if (!department) {
        return {
          success: false,
          error: 'Department not found'
        };
      }

      return {
        success: true,
        department: department
      };
    } catch (error) {
      console.error('Error retrieving department:', error);
      return {
        success: false,
        error: 'Failed to retrieve department'
      };
    }
  }

  // Assign department head
  assignDepartmentHead(departmentId, userId) {
    try {
      const departmentIndex = this.departments.findIndex(dept => dept.departmentId === departmentId);

      if (departmentIndex === -1) {
        return {
          success: false,
          error: 'Department not found'
        };
      }

      // Update department head
      this.departments[departmentIndex].headOfDepartmentId = userId;
      this.departments[departmentIndex].updatedAt = new Date().toISOString();

      // Add to staff if not already present
      const department = this.departments[departmentIndex];
      const isStaffMember = department.staff.some(staff => staff.userId === userId);
      
      if (!isStaffMember) {
        addStaffToDepartment(department, userId, 'Head', []);
      } else {
        // Update existing staff member role to Head
        const staffMember = department.staff.find(staff => staff.userId === userId);
        if (staffMember) {
          staffMember.role = 'Head';
        }
      }

      console.log(`✅ Department head assigned: ${departmentId} -> ${userId}`);

      return {
        success: true,
        department: this.departments[departmentIndex]
      };
    } catch (error) {
      console.error('Error assigning department head:', error);
      return {
        success: false,
        error: 'Failed to assign department head'
      };
    }
  }

  // Add subject to department
  addSubjectToDepartment(departmentId, subjectData) {
    try {
      const departmentIndex = this.departments.findIndex(dept => dept.departmentId === departmentId);

      if (departmentIndex === -1) {
        return {
          success: false,
          error: 'Department not found'
        };
      }

      const department = this.departments[departmentIndex];

      // Validate subject data
      if (!subjectData.subjectName) {
        return {
          success: false,
          error: 'Subject name is required'
        };
      }

      // Check if subject already exists in department
      const existingSubject = department.subjects.find(
        subject => subject.subjectName.toLowerCase() === subjectData.subjectName.toLowerCase()
      );

      if (existingSubject) {
        return {
          success: false,
          error: 'Subject already exists in this department'
        };
      }

      // Create subject object
      const newSubject = {
        subjectId: `subj_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        subjectName: subjectData.subjectName,
        curriculum: subjectData.curriculum || 'IB_DP',
        yearLevels: subjectData.yearLevels || ['DP1', 'DP2'],
        description: subjectData.description || ''
      };

      // Add subject to department
      department.subjects.push(newSubject);
      department.updatedAt = new Date().toISOString();

      console.log(`✅ Subject added to ${department.departmentName}: ${newSubject.subjectName}`);

      return {
        success: true,
        department: department,
        subject: newSubject
      };
    } catch (error) {
      console.error('Error adding subject to department:', error);
      return {
        success: false,
        error: 'Failed to add subject to department'
      };
    }
  }

  // Remove subject from department
  removeSubjectFromDepartment(departmentId, subjectId) {
    try {
      const departmentIndex = this.departments.findIndex(dept => dept.departmentId === departmentId);

      if (departmentIndex === -1) {
        return {
          success: false,
          error: 'Department not found'
        };
      }

      const department = this.departments[departmentIndex];
      const initialSubjectCount = department.subjects.length;

      // Remove subject
      department.subjects = department.subjects.filter(subject => subject.subjectId !== subjectId);
      department.updatedAt = new Date().toISOString();

      if (department.subjects.length === initialSubjectCount) {
        return {
          success: false,
          error: 'Subject not found in department'
        };
      }

      console.log(`✅ Subject removed from ${department.departmentName}: ${subjectId}`);

      return {
        success: true,
        department: department
      };
    } catch (error) {
      console.error('Error removing subject from department:', error);
      return {
        success: false,
        error: 'Failed to remove subject from department'
      };
    }
  }

  // Add staff member to department
  addStaffToDepartment(departmentId, userId, role = 'Teacher', subjects = []) {
    try {
      const departmentIndex = this.departments.findIndex(dept => dept.departmentId === departmentId);

      if (departmentIndex === -1) {
        return {
          success: false,
          error: 'Department not found'
        };
      }

      const department = this.departments[departmentIndex];
      addStaffToDepartment(department, userId, role, subjects);

      console.log(`✅ Staff added to ${department.departmentName}: ${userId} as ${role}`);

      return {
        success: true,
        department: department
      };
    } catch (error) {
      console.error('Error adding staff to department:', error);
      return {
        success: false,
        error: 'Failed to add staff to department'
      };
    }
  }

  // Get available IB department templates
  getIBDepartmentTemplates() {
    return {
      success: true,
      templates: Object.keys(IBDepartmentTemplates).map(key => ({
        templateName: key,
        ...IBDepartmentTemplates[key]
      }))
    };
  }

  // Create departments from IB templates (for quick setup)
  createIBDepartments(schoolId = 'school_default') {
    const results = [];
    
    for (const [templateName, templateData] of Object.entries(IBDepartmentTemplates)) {
      const result = this.createDepartment({
        departmentName: templateData.departmentName,
        description: templateData.description,
        schoolId: schoolId
      }, templateName);
      
      results.push({
        templateName,
        ...result
      });
    }

    return {
      success: true,
      results: results,
      created: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length
    };
  }

  // Get departments with staff information
  getDepartmentsWithStaff(schoolId = 'school_default') {
    try {
      const schoolDepartments = this.departments.filter(dept => 
        dept.schoolId === schoolId && dept.status === 'active'
      );

      return {
        success: true,
        departments: schoolDepartments.map(dept => ({
          ...dept,
          staffCount: dept.staff.length,
          subjectCount: dept.subjects.length,
          hasHead: !!dept.headOfDepartmentId
        }))
      };
    } catch (error) {
      console.error('Error retrieving departments with staff:', error);
      return {
        success: false,
        error: 'Failed to retrieve department staff information'
      };
    }
  }

  // Update department
  updateDepartment(departmentId, updateData) {
    try {
      const departmentIndex = this.departments.findIndex(dept => dept.departmentId === departmentId);

      if (departmentIndex === -1) {
        return {
          success: false,
          error: 'Department not found'
        };
      }

      // Update allowed fields
      const allowedFields = ['departmentName', 'description', 'headOfDepartmentId'];
      const department = this.departments[departmentIndex];

      for (const field of allowedFields) {
        if (updateData.hasOwnProperty(field)) {
          department[field] = updateData[field];
        }
      }

      department.updatedAt = new Date().toISOString();

      console.log(`✅ Department updated: ${department.departmentName}`);

      return {
        success: true,
        department: department
      };
    } catch (error) {
      console.error('Error updating department:', error);
      return {
        success: false,
        error: 'Failed to update department'
      };
    }
  }
}

// Export singleton instance
export const departmentService = new DepartmentService();
export default departmentService;