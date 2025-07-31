// Student Management Service - School Intelligence System
// Handles student data operations including CSV import

import Student from '../models/Student.js';
import Class from '../models/Class.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StudentService {
  constructor() {
    this.students = []; // In-memory storage for MVP
    this.classes = [];
  }

  // Student CRUD Operations

  // Create new student
  createStudent(studentData, createdBy) {
    const student = new Student({
      ...studentData,
      lastModifiedBy: createdBy
    });

    const validationErrors = student.validate();
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: 'Validation failed',
        details: validationErrors
      };
    }

    // Check for duplicate student number
    const existingStudent = this.students.find(s => s.studentNumber === student.studentNumber);
    if (existingStudent) {
      return {
        success: false,
        error: 'Student number already exists'
      };
    }

    this.students.push(student);
    
    return {
      success: true,
      message: 'Student created successfully',
      student: student.toJSON()
    };
  }

  // Get all students with optional filtering
  getAllStudents(filters = {}) {
    let filteredStudents = [...this.students];

    // Apply filters
    if (filters.yearLevel) {
      filteredStudents = filteredStudents.filter(s => s.yearLevel === filters.yearLevel);
    }

    if (filters.programme) {
      filteredStudents = filteredStudents.filter(s => s.academicProfile.programme === filters.programme);
    }

    if (filters.hasAccommodations !== undefined) {
      filteredStudents = filteredStudents.filter(s => s.learningSupport.hasAccommodations === filters.hasAccommodations);
    }

    if (filters.status) {
      filteredStudents = filteredStudents.filter(s => s.status === filters.status);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredStudents = filteredStudents.filter(s => 
        s.firstName.toLowerCase().includes(searchTerm) ||
        s.lastName.toLowerCase().includes(searchTerm) ||
        s.studentNumber.toLowerCase().includes(searchTerm) ||
        s.email.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by last name, first name
    filteredStudents.sort((a, b) => {
      const lastNameCompare = a.lastName.localeCompare(b.lastName);
      if (lastNameCompare !== 0) return lastNameCompare;
      return a.firstName.localeCompare(b.firstName);
    });

    return {
      success: true,
      students: filteredStudents.map(s => s.toJSON()),
      total: filteredStudents.length
    };
  }

  // Get student by ID
  getStudentById(studentId) {
    const student = this.students.find(s => s.studentId === studentId);
    
    if (!student) {
      return {
        success: false,
        error: 'Student not found'
      };
    }

    return {
      success: true,
      student: student.toJSON()
    };
  }

  // Update student
  updateStudent(studentId, updates, updatedBy) {
    const student = this.students.find(s => s.studentId === studentId);
    
    if (!student) {
      return {
        success: false,
        error: 'Student not found'
      };
    }

    // Apply updates
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        student[key] = updates[key];
      }
    });

    student.updatedAt = new Date().toISOString();
    student.lastModifiedBy = updatedBy;

    const validationErrors = student.validate();
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: 'Validation failed',
        details: validationErrors
      };
    }

    return {
      success: true,
      message: 'Student updated successfully',
      student: student.toJSON()
    };
  }

  // Delete student
  deleteStudent(studentId) {
    const index = this.students.findIndex(s => s.studentId === studentId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Student not found'
      };
    }

    // Remove from all classes first
    this.classes.forEach(classObj => {
      classObj.removeStudent(studentId);
    });

    this.students.splice(index, 1);

    return {
      success: true,
      message: 'Student deleted successfully'
    };
  }

  // CSV Import Functionality

  // Parse CSV content
  parseCSV(csvContent) {
    const lines = csvContent.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length < 2) {
      return {
        success: false,
        error: 'CSV must contain at least a header row and one data row'
      };
    }

    const headers = lines[0].split(',').map(header => header.trim());
    const dataRows = lines.slice(1).map(line => {
      // Simple CSV parsing - for production use a proper CSV parser
      return line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
    });

    return {
      success: true,
      headers,
      dataRows
    };
  }

  // Import students from CSV
  importStudentsFromCSV(csvContent, importedBy) {
    const parseResult = this.parseCSV(csvContent);
    
    if (!parseResult.success) {
      return parseResult;
    }

    const { headers, dataRows } = parseResult;
    const results = {
      success: true,
      imported: 0,
      skipped: 0,
      errors: [],
      details: []
    };

    dataRows.forEach((row, index) => {
      const rowNumber = index + 2; // +2 because we skip header and arrays are 0-indexed
      
      try {
        const student = Student.fromCSV(row, headers);
        student.lastModifiedBy = importedBy;

        const validationErrors = student.validate();
        if (validationErrors.length > 0) {
          results.errors.push({
            row: rowNumber,
            error: 'Validation failed',
            details: validationErrors
          });
          results.skipped++;
          return;
        }

        // Check for duplicate student number
        const existingStudent = this.students.find(s => s.studentNumber === student.studentNumber);
        if (existingStudent) {
          results.errors.push({
            row: rowNumber,
            error: `Student number ${student.studentNumber} already exists`
          });
          results.skipped++;
          return;
        }

        this.students.push(student);
        results.imported++;
        results.details.push({
          row: rowNumber,
          studentNumber: student.studentNumber,
          name: student.getFullName(),
          status: 'imported'
        });

      } catch (error) {
        results.errors.push({
          row: rowNumber,
          error: error.message
        });
        results.skipped++;
      }
    });

    return results;
  }

  // Generate sample CSV template
  generateCSVTemplate() {
    const headers = [
      'first_name',
      'last_name',
      'email',
      'student_number',
      'year_level',
      'homeroom',
      'date_of_birth',
      'programme',
      'first_language',
      'esl',
      'has_accommodations',
      'learning_differences',
      'support_level',
      'nationality'
    ];

    const sampleData = [
      'John,Doe,john.doe@school.edu,2024001,DP1,Room 101,2008-05-15,IB DP,English,false,false,,none,American',
      'Jane,Smith,jane.smith@school.edu,2024002,DP2,Room 102,2007-08-22,IB DP,Spanish,true,true,"ADHD Dyslexia",medium,Spanish',
      'Ahmed,Al-Rashid,ahmed.rashid@school.edu,2024003,DP1,Room 101,2008-12-03,IB DP,Arabic,true,false,,low,Emirati'
    ];

    return headers.join(',') + '\n' + sampleData.join('\n');
  }

  // Class Management

  // Create new class
  createClass(classData, createdBy) {
    const classObj = new Class({
      ...classData,
      createdBy,
      lastModifiedBy: createdBy
    });

    const validationErrors = classObj.validate();
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: 'Validation failed',
        details: validationErrors
      };
    }

    this.classes.push(classObj);
    
    return {
      success: true,
      message: 'Class created successfully',
      class: classObj.toJSON()
    };
  }

  // Get all classes
  getAllClasses(filters = {}) {
    let filteredClasses = [...this.classes];

    if (filters.teacherId) {
      filteredClasses = filteredClasses.filter(c => 
        c.teachers.primary === filters.teacherId ||
        c.teachers.support.includes(filters.teacherId)
      );
    }

    if (filters.yearLevel) {
      filteredClasses = filteredClasses.filter(c => c.yearLevel === filters.yearLevel);
    }

    if (filters.subject) {
      filteredClasses = filteredClasses.filter(c => c.subject === filters.subject);
    }

    return {
      success: true,
      classes: filteredClasses.map(c => c.toJSON()),
      total: filteredClasses.length
    };
  }

  // Enroll student in class
  enrollStudentInClass(studentId, classId) {
    const student = this.students.find(s => s.studentId === studentId);
    const classObj = this.classes.find(c => c.classId === classId);

    if (!student) {
      return {
        success: false,
        error: 'Student not found'
      };
    }

    if (!classObj) {
      return {
        success: false,
        error: 'Class not found'
      };
    }

    try {
      const added = classObj.addStudent(studentId);
      if (added) {
        return {
          success: true,
          message: `${student.getFullName()} enrolled in ${classObj.getDisplayName()}`
        };
      } else {
        return {
          success: false,
          error: 'Student is already enrolled in this class'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get students with learning support needs
  getStudentsWithSupport() {
    const supportStudents = this.students.filter(s => s.needsLearningSupport());
    
    return {
      success: true,
      students: supportStudents.map(s => ({
        ...s.toJSON(),
        supportSummary: {
          hasAccommodations: s.learningSupport.hasAccommodations,
          accommodationsCount: s.learningSupport.accommodations.length,
          supportLevel: s.learningSupport.supportLevel,
          learningDifferences: s.learningSupport.learningDifferences
        }
      })),
      total: supportStudents.length
    };
  }

  // Get statistics
  getStatistics() {
    const stats = {
      totalStudents: this.students.length,
      totalClasses: this.classes.length,
      byYearLevel: {},
      byProgramme: {},
      supportStats: {
        withAccommodations: 0,
        withLearningDifferences: 0,
        byLevel: { none: 0, low: 0, medium: 0, high: 0 }
      }
    };

    this.students.forEach(student => {
      // Year level distribution
      stats.byYearLevel[student.yearLevel] = (stats.byYearLevel[student.yearLevel] || 0) + 1;
      
      // Programme distribution
      const programme = student.academicProfile.programme;
      stats.byProgramme[programme] = (stats.byProgramme[programme] || 0) + 1;
      
      // Support statistics
      if (student.learningSupport.hasAccommodations) {
        stats.supportStats.withAccommodations++;
      }
      if (student.learningSupport.learningDifferences.length > 0) {
        stats.supportStats.withLearningDifferences++;
      }
      stats.supportStats.byLevel[student.learningSupport.supportLevel]++;
    });

    return {
      success: true,
      statistics: stats
    };
  }
}

// Export singleton instance
export const studentService = new StudentService();
export default studentService;