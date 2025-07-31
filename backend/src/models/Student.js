// Student Model - School Intelligence System
// Represents individual students with their academic and support profiles

class Student {
  constructor(data) {
    this.studentId = data.studentId || `student_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.email = data.email;
    this.studentNumber = data.studentNumber;
    
    // Privacy protection - encrypted storage fields
    this.encryptedData = data.encryptedData || null; // For storing encrypted PII
    this.aiIdentifier = data.aiIdentifier || null; // Anonymous identifier for AI processing
    this.yearLevel = data.yearLevel; // DP1, DP2, MYP1-5, etc.
    this.homeroom = data.homeroom;
    this.dateOfBirth = data.dateOfBirth;
    this.enrollmentDate = data.enrollmentDate || new Date().toISOString();
    
    // Academic Profile
    this.academicProfile = {
      programme: data.programme || 'IB DP', // IB DP, IB MYP, etc.
      subjects: data.subjects || [], // Array of subject codes
      targetGrades: data.targetGrades || {},
      currentGrades: data.currentGrades || {},
      languageProfile: {
        firstLanguage: data.firstLanguage || 'English',
        additionalLanguages: data.additionalLanguages || [],
        esl: data.esl || false
      }
    };

    // Learning Support Profile
    this.learningSupport = {
      hasAccommodations: data.hasAccommodations || false,
      accommodations: data.accommodations || [],
      learningDifferences: data.learningDifferences || [],
      supportLevel: data.supportLevel || 'none', // none, low, medium, high
      individualEducationPlan: data.individualEducationPlan || false,
      supportTeacher: data.supportTeacher || null
    };

    // Personal Information
    this.personalInfo = {
      nationality: data.nationality || '',
      parentContacts: data.parentContacts || [],
      emergencyContacts: data.emergencyContacts || [],
      medicalNotes: data.medicalNotes || '',
      dietaryRestrictions: data.dietaryRestrictions || []
    };

    // Status and Metadata
    this.status = data.status || 'active'; // active, inactive, graduated, withdrawn
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.lastModifiedBy = data.lastModifiedBy;
  }

  // Get full name
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // Get display name for lists
  getDisplayName() {
    return `${this.lastName}, ${this.firstName} (${this.studentNumber})`;
  }

  // Check if student needs learning support
  needsLearningSupport() {
    return this.learningSupport.hasAccommodations || 
           this.learningSupport.learningDifferences.length > 0 ||
           this.learningSupport.supportLevel !== 'none';
  }

  // Get year level classification
  getYearLevelCategory() {
    if (this.yearLevel.startsWith('DP')) return 'Diploma Programme';
    if (this.yearLevel.startsWith('MYP')) return 'Middle Years Programme';
    return 'Other';
  }

  // Update grades
  updateGrades(subject, grade, type = 'current') {
    if (type === 'current') {
      this.academicProfile.currentGrades[subject] = grade;
    } else if (type === 'target') {
      this.academicProfile.targetGrades[subject] = grade;
    }
    this.updatedAt = new Date().toISOString();
  }

  // Add accommodation
  addAccommodation(accommodation) {
    if (!this.learningSupport.accommodations.includes(accommodation)) {
      this.learningSupport.accommodations.push(accommodation);
      this.learningSupport.hasAccommodations = true;
      this.updatedAt = new Date().toISOString();
    }
  }

  // Remove accommodation
  removeAccommodation(accommodation) {
    this.learningSupport.accommodations = this.learningSupport.accommodations
      .filter(acc => acc !== accommodation);
    this.learningSupport.hasAccommodations = this.learningSupport.accommodations.length > 0;
    this.updatedAt = new Date().toISOString();
  }

  // Validate required fields
  validate() {
    const errors = [];
    
    if (!this.firstName || this.firstName.trim() === '') {
      errors.push('First name is required');
    }
    
    if (!this.lastName || this.lastName.trim() === '') {
      errors.push('Last name is required');
    }
    
    if (!this.studentNumber || this.studentNumber.trim() === '') {
      errors.push('Student number is required');
    }
    
    if (!this.yearLevel || this.yearLevel.trim() === '') {
      errors.push('Year level is required');
    }

    if (this.email && !this.isValidEmail(this.email)) {
      errors.push('Invalid email format');
    }

    return errors;
  }

  // Email validation helper
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Get anonymized data safe for AI processing (no PII)
  toAISafeData() {
    return {
      learningSupport: {
        hasAccommodations: this.learningSupport.hasAccommodations,
        accommodations: this.learningSupport.accommodations || [],
        learningDifferences: this.learningSupport.learningDifferences || [],
        supportLevel: this.learningSupport.supportLevel || 'none'
      },
      academicProfile: {
        programme: this.academicProfile.programme,
        yearLevel: this.yearLevel,
        languageProfile: {
          esl: this.academicProfile.languageProfile?.esl || false,
          firstLanguage: this.academicProfile.languageProfile?.firstLanguage
        }
      },
      // NO PII: no names, student numbers, contact info, or family data
    };
  }

  // Check if student has sensitive learning support needs
  hasHighSupportNeeds() {
    return this.learningSupport.supportLevel === 'high' ||
           this.learningSupport.hasAccommodations ||
           this.learningSupport.learningDifferences.length > 0;
  }

  // Get display data for authorized users only (teachers/admin)
  toAuthorizedDisplay(userRole) {
    const authorizedRoles = ['Admin', 'HeadOfTeachingLearning', 'HeadOfLearningSupport', 'Teacher'];
    
    if (!authorizedRoles.includes(userRole)) {
      // Return minimal data for unauthorized users
      return {
        studentId: this.studentId,
        yearLevel: this.yearLevel,
        programme: this.academicProfile.programme,
        hasLearningSupport: this.hasHighSupportNeeds()
      };
    }

    // Return full data for authorized users
    return this.toJSON();
  }

  // Convert to plain object for JSON serialization
  toJSON() {
    return {
      studentId: this.studentId,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      studentNumber: this.studentNumber,
      yearLevel: this.yearLevel,
      homeroom: this.homeroom,
      dateOfBirth: this.dateOfBirth,
      enrollmentDate: this.enrollmentDate,
      academicProfile: this.academicProfile,
      learningSupport: this.learningSupport,
      personalInfo: this.personalInfo,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastModifiedBy: this.lastModifiedBy,
      encryptedData: this.encryptedData,
      aiIdentifier: this.aiIdentifier
    };
  }

  // Create from CSV row data
  static fromCSV(csvRow, headers) {
    const data = {};
    
    // Map CSV headers to student properties
    const headerMap = {
      'first_name': 'firstName',
      'last_name': 'lastName',
      'email': 'email',
      'student_number': 'studentNumber',
      'year_level': 'yearLevel',
      'homeroom': 'homeroom',
      'date_of_birth': 'dateOfBirth',
      'programme': 'programme',
      'first_language': 'firstLanguage',
      'esl': 'esl',
      'has_accommodations': 'hasAccommodations',
      'learning_differences': 'learningDifferences',
      'support_level': 'supportLevel',
      'nationality': 'nationality'
    };

    // Process each header
    headers.forEach((header, index) => {
      const normalizedHeader = header.toLowerCase().replace(/\s+/g, '_');
      const propertyName = headerMap[normalizedHeader];
      
      if (propertyName && csvRow[index]) {
        let value = csvRow[index].trim();
        
        // Handle special data types
        if (propertyName === 'esl' || propertyName === 'hasAccommodations') {
          value = value.toLowerCase() === 'true' || value === '1' || value.toLowerCase() === 'yes';
        } else if (propertyName === 'learningDifferences') {
          value = value.split(',').map(item => item.trim()).filter(item => item);
        }
        
        data[propertyName] = value;
      }
    });

    return new Student(data);
  }
}

export default Student;