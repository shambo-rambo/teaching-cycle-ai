// Class Model - School Intelligence System
// Represents a class/course with students and teacher assignments

class Class {
  constructor(data) {
    this.classId = data.classId || `class_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = data.name;
    this.subject = data.subject;
    this.yearLevel = data.yearLevel;
    this.section = data.section || 'A';
    this.academicYear = data.academicYear || new Date().getFullYear();
    this.term = data.term || 'Semester 1';
    
    // Teacher assignments
    this.teachers = {
      primary: data.primaryTeacher || null,
      support: data.supportTeachers || [],
      substitute: data.substituteTeachers || []
    };

    // Student enrollment
    this.students = data.students || []; // Array of student IDs
    this.maxCapacity = data.maxCapacity || 25;
    
    // Schedule
    this.schedule = {
      periods: data.periods || [], // Array of {day, period, time, room}
      room: data.room || '',
      duration: data.duration || 50 // minutes
    };

    // Academic settings
    this.curriculum = {
      programme: data.programme || 'IB DP',
      subjectCode: data.subjectCode || '',
      level: data.level || 'Standard Level',
      units: data.units || [],
      assessments: data.assessments || []
    };

    // Class-specific frameworks and requirements
    this.frameworks = {
      teaching: data.teachingFrameworks || [], // From Head of Teaching & Learning
      support: data.supportFrameworks || []   // From Head of Learning Support
    };

    // Learning objectives and outcomes
    this.learningObjectives = data.learningObjectives || [];
    this.successCriteria = data.successCriteria || [];

    // Class statistics and tracking
    this.statistics = {
      enrollmentCount: this.students.length,
      attendanceRate: data.attendanceRate || 0,
      averageGrade: data.averageGrade || 0,
      completionRate: data.completionRate || 0
    };

    // Status and metadata
    this.status = data.status || 'active'; // active, inactive, archived
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.createdBy = data.createdBy;
    this.lastModifiedBy = data.lastModifiedBy;
  }

  // Get display name for the class
  getDisplayName() {
    return `${this.subject} ${this.yearLevel}${this.section} (${this.academicYear})`;
  }

  // Get full class description
  getDescription() {
    return `${this.name} - ${this.subject} for ${this.yearLevel} students`;
  }

  // Add student to class
  addStudent(studentId) {
    if (!this.students.includes(studentId)) {
      if (this.students.length >= this.maxCapacity) {
        throw new Error(`Class is at maximum capacity (${this.maxCapacity})`);
      }
      this.students.push(studentId);
      this.statistics.enrollmentCount = this.students.length;
      this.updatedAt = new Date().toISOString();
      return true;
    }
    return false; // Student already enrolled
  }

  // Remove student from class
  removeStudent(studentId) {
    const index = this.students.indexOf(studentId);
    if (index > -1) {
      this.students.splice(index, 1);
      this.statistics.enrollmentCount = this.students.length;
      this.updatedAt = new Date().toISOString();
      return true;
    }
    return false; // Student not found
  }

  // Check if student is enrolled
  hasStudent(studentId) {
    return this.students.includes(studentId);
  }

  // Add teacher
  addTeacher(teacherId, role = 'support') {
    if (role === 'primary') {
      this.teachers.primary = teacherId;
    } else if (role === 'support') {
      if (!this.teachers.support.includes(teacherId)) {
        this.teachers.support.push(teacherId);
      }
    } else if (role === 'substitute') {
      if (!this.teachers.substitute.includes(teacherId)) {
        this.teachers.substitute.push(teacherId);
      }
    }
    this.updatedAt = new Date().toISOString();
  }

  // Remove teacher
  removeTeacher(teacherId, role = null) {
    if (role === 'primary' || this.teachers.primary === teacherId) {
      this.teachers.primary = null;
    }
    
    if (role === 'support' || role === null) {
      this.teachers.support = this.teachers.support.filter(id => id !== teacherId);
    }
    
    if (role === 'substitute' || role === null) {
      this.teachers.substitute = this.teachers.substitute.filter(id => id !== teacherId);
    }
    
    this.updatedAt = new Date().toISOString();
  }

  // Add framework requirement
  addFramework(frameworkId, type = 'teaching') {
    if (type === 'teaching') {
      if (!this.frameworks.teaching.includes(frameworkId)) {
        this.frameworks.teaching.push(frameworkId);
      }
    } else if (type === 'support') {
      if (!this.frameworks.support.includes(frameworkId)) {
        this.frameworks.support.push(frameworkId);
      }
    }
    this.updatedAt = new Date().toISOString();
  }

  // Remove framework requirement
  removeFramework(frameworkId, type = null) {
    if (type === 'teaching' || type === null) {
      this.frameworks.teaching = this.frameworks.teaching.filter(id => id !== frameworkId);
    }
    if (type === 'support' || type === null) {
      this.frameworks.support = this.frameworks.support.filter(id => id !== frameworkId);
    }
    this.updatedAt = new Date().toISOString();
  }

  // Get all applicable frameworks
  getAllFrameworks() {
    return [...this.frameworks.teaching, ...this.frameworks.support];
  }

  // Add schedule period
  addSchedulePeriod(day, period, time, room = null) {
    this.schedule.periods.push({
      day: day,
      period: period,
      time: time,
      room: room || this.schedule.room
    });
    this.updatedAt = new Date().toISOString();
  }

  // Get capacity info
  getCapacityInfo() {
    return {
      current: this.students.length,
      maximum: this.maxCapacity,
      available: this.maxCapacity - this.students.length,
      percentFull: Math.round((this.students.length / this.maxCapacity) * 100)
    };
  }

  // Update statistics
  updateStatistics(stats) {
    this.statistics = { ...this.statistics, ...stats };
    this.updatedAt = new Date().toISOString();
  }

  // Validate class data
  validate() {
    const errors = [];
    
    if (!this.name || this.name.trim() === '') {
      errors.push('Class name is required');
    }
    
    if (!this.subject || this.subject.trim() === '') {
      errors.push('Subject is required');
    }
    
    if (!this.yearLevel || this.yearLevel.trim() === '') {
      errors.push('Year level is required');
    }

    if (this.maxCapacity < 1) {
      errors.push('Maximum capacity must be at least 1');
    }

    if (this.students.length > this.maxCapacity) {
      errors.push('Current enrollment exceeds maximum capacity');
    }

    return errors;
  }

  // Convert to plain object for JSON serialization
  toJSON() {
    return {
      classId: this.classId,
      name: this.name,
      subject: this.subject,
      yearLevel: this.yearLevel,
      section: this.section,
      academicYear: this.academicYear,
      term: this.term,
      teachers: this.teachers,
      students: this.students,
      maxCapacity: this.maxCapacity,
      schedule: this.schedule,
      curriculum: this.curriculum,
      frameworks: this.frameworks,
      learningObjectives: this.learningObjectives,
      successCriteria: this.successCriteria,
      statistics: this.statistics,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
      lastModifiedBy: this.lastModifiedBy
    };
  }
}

export default Class;