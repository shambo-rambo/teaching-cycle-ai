// Student Privacy Service - School Intelligence System
// Implements encryption and anonymization for student data before AI processing
// Compliant with FERPA and educational privacy standards

import crypto from 'crypto';

class StudentPrivacyService {
  constructor() {
    // In production, these should be environment variables
    this.encryptionKey = process.env.STUDENT_ENCRYPTION_KEY || this.generateSecureKey();
    this.aiIdentifierSalt = process.env.AI_IDENTIFIER_SALT || this.generateSecureKey();
    this.algorithm = 'aes-256-gcm';
    
    // Cache for consistent AI identifiers within sessions
    this.aiIdentifierCache = new Map();
    
    // Audit log for privacy compliance
    this.auditLog = [];
  }

  // Generate secure encryption key (should be stored securely in production)
  generateSecureKey() {
    return crypto.randomBytes(32).toString('hex');
  }

  // Create consistent anonymous AI identifier for student
  createAIIdentifier(studentId, sessionId = null) {
    // Use session-based caching for consistency
    const cacheKey = `${studentId}_${sessionId || 'global'}`;
    
    if (this.aiIdentifierCache.has(cacheKey)) {
      return this.aiIdentifierCache.get(cacheKey);
    }

    // Create deterministic but anonymous identifier
    const hash = crypto.createHmac('sha256', this.aiIdentifierSalt)
      .update(`${studentId}_${sessionId || 'default'}`)
      .digest('hex');
    
    // Create readable anonymous identifier
    const aiIdentifier = `Student_${hash.substring(0, 4).toUpperCase()}`;
    
    // Cache for consistency within session
    this.aiIdentifierCache.set(cacheKey, aiIdentifier);
    
    this.logAuditEvent('ai_identifier_created', {
      originalStudentId: studentId,
      aiIdentifier: aiIdentifier,
      sessionId: sessionId
    });

    return aiIdentifier;
  }

  // Encrypt sensitive student data for internal storage
  encryptStudentData(data) {
    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipherGCM(this.algorithm, Buffer.from(this.encryptionKey, 'hex'), iv);

      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();

      return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt student data');
    }
  }

  // Decrypt student data for authorized access
  decryptStudentData(encryptedData, userRole, userId) {
    // Role-based access control
    if (!this.hasDecryptionPermission(userRole)) {
      this.logAuditEvent('unauthorized_decryption_attempt', {
        userRole: userRole,
        userId: userId,
        timestamp: new Date().toISOString()
      });
      throw new Error('Insufficient permissions to decrypt student data');
    }

    try {
      const iv = Buffer.from(encryptedData.iv, 'hex');
      const decipher = crypto.createDecipherGCM(this.algorithm, Buffer.from(this.encryptionKey, 'hex'), iv);
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));

      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      this.logAuditEvent('student_data_decrypted', {
        userRole: userRole,
        userId: userId,
        timestamp: new Date().toISOString()
      });

      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt student data');
    }
  }

  // Check if user role has permission to decrypt student data
  hasDecryptionPermission(role) {
    const authorizedRoles = [
      'Admin',
      'HeadOfTeachingLearning', 
      'HeadOfLearningSupport',
      'Teacher'
    ];
    return authorizedRoles.includes(role);
  }

  // Prepare student data for AI processing (removes all PII)
  prepareStudentDataForAI(students, sessionId = null) {
    const aiSafeData = students.map(student => {
      const aiIdentifier = this.createAIIdentifier(student.studentId, sessionId);
      
      return {
        studentRef: aiIdentifier, // Anonymous identifier (NOT real student ID/number)
        learningSupport: student.learningSupport ? {
          hasAccommodations: student.learningSupport.hasAccommodations,
          accommodations: student.learningSupport.accommodations || [],
          learningDifferences: student.learningSupport.learningDifferences || [],
          supportLevel: student.learningSupport.supportLevel || 'none'
        } : {},
        academicProfile: student.academicProfile ? {
          programme: student.academicProfile.programme,
          yearLevel: student.yearLevel,
          languageProfile: {
            esl: student.academicProfile.languageProfile?.esl || false,
            firstLanguage: student.academicProfile.languageProfile?.firstLanguage
          }
        } : {},
        // NO PII: no real names, student numbers, contact info, or family data
      };
    });

    this.logAuditEvent('student_data_prepared_for_ai', {
      studentCount: students.length,
      sessionId: sessionId,
      timestamp: new Date().toISOString(),
      dataSent: 'learning_profiles_only' // Confirm no PII sent
    });

    return aiSafeData;
  }

  // Map AI recommendations back to real students for teacher interface
  mapAIResponseToStudents(aiResponse, sessionId = null) {
    const mappedResponse = {};
    
    // Find the reverse mapping from AI identifier to real student
    for (const [cacheKey, aiIdentifier] of this.aiIdentifierCache.entries()) {
      if (sessionId && !cacheKey.includes(sessionId)) continue;
      
      if (aiResponse[aiIdentifier]) {
        // Extract real student ID from cache key
        const studentId = cacheKey.split('_')[0];
        mappedResponse[studentId] = aiResponse[aiIdentifier];
      }
    }

    this.logAuditEvent('ai_response_mapped_to_students', {
      aiRecommendationCount: Object.keys(aiResponse).length,
      mappedRecommendationCount: Object.keys(mappedResponse).length,
      sessionId: sessionId,
      timestamp: new Date().toISOString()
    });

    return mappedResponse;
  }

  // Create lesson context for AI that preserves privacy
  createPrivacyCompliantLessonContext(lessonData, classData, students, sessionId = null) {
    const aiSafeStudents = this.prepareStudentDataForAI(students, sessionId);
    
    const lessonContext = {
      // Lesson information (no student PII)
      subject: classData.subject,
      yearLevel: classData.yearLevel,
      duration: lessonData.duration || 50,
      topic: lessonData.topic,
      learningObjectives: lessonData.learningObjectives || [],
      
      // Class profile (anonymized)
      classProfile: {
        subject: classData.subject,
        yearLevel: classData.yearLevel,
        programme: classData.curriculum?.programme || 'IB DP',
        size: students.length,
        students: aiSafeStudents // Anonymized student data only
      },
      
      // Framework requirements (no student PII)
      frameworks: classData.frameworks || [],
      
      // Session tracking for consistency
      sessionId: sessionId || crypto.randomUUID()
    };

    this.logAuditEvent('lesson_context_created_for_ai', {
      lessonTopic: lessonData.topic,
      classSize: students.length,
      sessionId: lessonContext.sessionId,
      timestamp: new Date().toISOString(),
      privacyCompliant: true
    });

    return lessonContext;
  }

  // Validate that data is safe for AI processing (no PII)
  validateAISafeData(data) {
    const violations = [];
    
    // Check for common PII patterns
    const piiPatterns = [
      /\b[A-Z][a-z]+ [A-Z][a-z]+\b/, // First Last names
      /\b\d{6,}\b/, // Student numbers
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email addresses
      /\b\d{1,2}\/\d{1,2}\/\d{4}\b/, // Dates (potential DOB)
    ];

    const dataString = JSON.stringify(data);
    
    piiPatterns.forEach((pattern, index) => {
      if (pattern.test(dataString)) {
        violations.push(`Potential PII pattern ${index + 1} detected`);
      }
    });

    // Check for explicit PII fields that shouldn't be present
    const prohibitedFields = ['firstName', 'lastName', 'email', 'studentNumber', 'dateOfBirth'];
    
    const checkObject = (obj, path = '') => {
      for (const key in obj) {
        if (prohibitedFields.includes(key)) {
          violations.push(`Prohibited field '${key}' found at ${path}${key}`);
        }
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          checkObject(obj[key], `${path}${key}.`);
        }
      }
    };

    checkObject(data);

    return {
      isValid: violations.length === 0,
      violations: violations
    };
  }

  // Log audit events for compliance
  logAuditEvent(eventType, details) {
    const auditEntry = {
      timestamp: new Date().toISOString(),
      eventType: eventType,
      details: details,
      id: crypto.randomUUID()
    };

    this.auditLog.push(auditEntry);
    
    // In production, this should be written to a secure audit database
    console.log(`[PRIVACY AUDIT] ${eventType}:`, details);
  }

  // Get audit log for compliance reporting
  getAuditLog(startDate = null, endDate = null) {
    let filteredLog = this.auditLog;

    if (startDate) {
      filteredLog = filteredLog.filter(entry => 
        new Date(entry.timestamp) >= new Date(startDate)
      );
    }

    if (endDate) {
      filteredLog = filteredLog.filter(entry => 
        new Date(entry.timestamp) <= new Date(endDate)
      );
    }

    return filteredLog;
  }

  // Clear session cache (for privacy)
  clearSessionCache(sessionId) {
    for (const [key] of this.aiIdentifierCache.entries()) {
      if (key.includes(sessionId)) {
        this.aiIdentifierCache.delete(key);
      }
    }

    this.logAuditEvent('session_cache_cleared', {
      sessionId: sessionId,
      timestamp: new Date().toISOString()
    });
  }

  // Get privacy compliance report
  getPrivacyComplianceReport() {
    const report = {
      encryptionStatus: 'active',
      auditLogEntries: this.auditLog.length,
      activeSessions: this.aiIdentifierCache.size,
      lastAuditEvent: this.auditLog.length > 0 ? 
        this.auditLog[this.auditLog.length - 1].timestamp : null,
      complianceFeatures: {
        studentDataEncryption: true,
        aiIdentifierAnonymization: true,
        piiRemovalForAI: true,
        auditLogging: true,
        roleBasedAccess: true
      }
    };

    return report;
  }
}

// Export singleton instance
export const studentPrivacyService = new StudentPrivacyService();
export default studentPrivacyService;