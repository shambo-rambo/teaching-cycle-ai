// Framework Model - School Intelligence System
// Represents frameworks created by executives to guide teaching practices

class Framework {
  constructor(data) {
    this.frameworkId = data.frameworkId || `framework_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.title = data.title;
    this.description = data.description || '';
    this.type = data.type; // 'teaching' (from Head of T&L) or 'support' (from Head of Learning Support)
    
    // Framework scope and targeting
    this.scope = {
      schoolWide: data.schoolWide || false,
      departments: data.departments || [], // Array of department IDs
      subjects: data.subjects || [], // Array of subject codes
      yearLevels: data.yearLevels || [], // Array of year levels (DP1, DP2, etc.)
      classes: data.classes || [] // Array of specific class IDs
    };

    // Framework content and requirements
    this.requirements = data.requirements || []; // Array of requirement objects
    this.guidelines = data.guidelines || [];
    this.resources = data.resources || [];
    this.templates = data.templates || [];

    // Priority and implementation
    this.priority = data.priority || 'medium'; // high, medium, low
    this.mandatory = data.mandatory || false;
    this.implementationDate = data.implementationDate;
    this.deadlineDate = data.deadlineDate;
    
    // Success criteria and assessment
    this.successCriteria = data.successCriteria || [];
    this.assessmentMethods = data.assessmentMethods || [];
    this.complianceMetrics = data.complianceMetrics || [];

    // Communication and training
    this.communicationPlan = {
      announcementDate: data.announcementDate,
      trainingRequired: data.trainingRequired || false,
      trainingMaterials: data.trainingMaterials || [],
      supportContacts: data.supportContacts || []
    };

    // Tracking and compliance
    this.compliance = {
      trackingMethod: data.trackingMethod || 'self-report',
      reportingFrequency: data.reportingFrequency || 'monthly',
      complianceRate: data.complianceRate || 0,
      lastAssessment: data.lastAssessment
    };

    // Version control
    this.version = data.version || '1.0';
    this.previousVersions = data.previousVersions || [];
    this.changeLog = data.changeLog || [];

    // Status and metadata
    this.status = data.status || 'draft'; // draft, active, archived, suspended
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
    this.createdBy = data.createdBy;
    this.lastModifiedBy = data.lastModifiedBy;
    this.approvedBy = data.approvedBy;
    this.approvedAt = data.approvedAt;
  }

  // Get display name
  getDisplayName() {
    const typeLabel = this.type === 'teaching' ? 'T&L' : 'Support';
    return `[${typeLabel}] ${this.title}`;
  }

  // Get scope description
  getScopeDescription() {
    if (this.scope.schoolWide) {
      return 'School-wide';
    }
    
    const scopeParts = [];
    if (this.scope.departments.length > 0) {
      scopeParts.push(`${this.scope.departments.length} department(s)`);
    }
    if (this.scope.subjects.length > 0) {
      scopeParts.push(`${this.scope.subjects.length} subject(s)`);
    }
    if (this.scope.yearLevels.length > 0) {
      scopeParts.push(`${this.scope.yearLevels.length} year level(s)`);
    }
    if (this.scope.classes.length > 0) {
      scopeParts.push(`${this.scope.classes.length} specific class(es)`);
    }
    
    return scopeParts.length > 0 ? scopeParts.join(', ') : 'No specific scope';
  }

  // Check if framework applies to a specific context
  appliesTo(context) {
    // If school-wide, applies to everything
    if (this.scope.schoolWide) {
      return true;
    }

    // Check specific targeting
    if (context.departmentId && this.scope.departments.includes(context.departmentId)) {
      return true;
    }
    
    if (context.subject && this.scope.subjects.includes(context.subject)) {
      return true;
    }
    
    if (context.yearLevel && this.scope.yearLevels.includes(context.yearLevel)) {
      return true;
    }
    
    if (context.classId && this.scope.classes.includes(context.classId)) {
      return true;
    }

    return false;
  }

  // Add requirement
  addRequirement(requirement) {
    const req = {
      id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: requirement.title,
      description: requirement.description,
      type: requirement.type || 'general', // general, documentation, activity, assessment
      mandatory: requirement.mandatory || false,
      checklistItems: requirement.checklistItems || [],
      dueDate: requirement.dueDate,
      createdAt: new Date().toISOString()
    };
    
    this.requirements.push(req);
    this.updatedAt = new Date().toISOString();
    return req.id;
  }

  // Remove requirement
  removeRequirement(requirementId) {
    this.requirements = this.requirements.filter(req => req.id !== requirementId);
    this.updatedAt = new Date().toISOString();
  }

  // Update requirement
  updateRequirement(requirementId, updates) {
    const index = this.requirements.findIndex(req => req.id === requirementId);
    if (index > -1) {
      this.requirements[index] = { ...this.requirements[index], ...updates };
      this.updatedAt = new Date().toISOString();
      return true;
    }
    return false;
  }

  // Add to scope
  addToScope(type, value) {
    if (type === 'department' && !this.scope.departments.includes(value)) {
      this.scope.departments.push(value);
    } else if (type === 'subject' && !this.scope.subjects.includes(value)) {
      this.scope.subjects.push(value);
    } else if (type === 'yearLevel' && !this.scope.yearLevels.includes(value)) {
      this.scope.yearLevels.push(value);
    } else if (type === 'class' && !this.scope.classes.includes(value)) {
      this.scope.classes.push(value);
    }
    this.updatedAt = new Date().toISOString();
  }

  // Remove from scope
  removeFromScope(type, value) {
    if (type === 'department') {
      this.scope.departments = this.scope.departments.filter(d => d !== value);
    } else if (type === 'subject') {
      this.scope.subjects = this.scope.subjects.filter(s => s !== value);
    } else if (type === 'yearLevel') {
      this.scope.yearLevels = this.scope.yearLevels.filter(y => y !== value);
    } else if (type === 'class') {
      this.scope.classes = this.scope.classes.filter(c => c !== value);
    }
    this.updatedAt = new Date().toISOString();
  }

  // Activate framework
  activate() {
    this.status = 'active';
    this.implementationDate = this.implementationDate || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Archive framework
  archive() {
    this.status = 'archived';
    this.updatedAt = new Date().toISOString();
  }

  // Create new version
  createNewVersion(changes) {
    // Store current version in history
    this.previousVersions.push({
      version: this.version,
      data: this.toJSON(),
      archivedAt: new Date().toISOString()
    });

    // Update version number
    const [major, minor] = this.version.split('.').map(Number);
    this.version = changes.majorUpdate ? `${major + 1}.0` : `${major}.${minor + 1}`;

    // Log changes
    this.changeLog.push({
      version: this.version,
      changes: changes.description || 'Framework updated',
      changedBy: changes.changedBy,
      changedAt: new Date().toISOString()
    });

    this.updatedAt = new Date().toISOString();
  }

  // Update compliance rate
  updateCompliance(rate, assessmentData) {
    this.compliance.complianceRate = rate;
    this.compliance.lastAssessment = new Date().toISOString();
    
    if (assessmentData) {
      this.compliance.assessmentData = assessmentData;
    }
    
    this.updatedAt = new Date().toISOString();
  }

  // Get priority color/class for UI
  getPriorityClass() {
    const classes = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return classes[this.priority] || classes.medium;
  }

  // Validate framework data
  validate() {
    const errors = [];
    
    if (!this.title || this.title.trim() === '') {
      errors.push('Framework title is required');
    }
    
    if (!this.type || !['teaching', 'support'].includes(this.type)) {
      errors.push('Framework type must be either "teaching" or "support"');
    }
    
    if (!this.createdBy) {
      errors.push('Framework creator is required');
    }

    if (this.requirements.length === 0) {
      errors.push('Framework must have at least one requirement');
    }

    // Validate scope
    if (!this.scope.schoolWide && 
        this.scope.departments.length === 0 && 
        this.scope.subjects.length === 0 && 
        this.scope.yearLevels.length === 0 && 
        this.scope.classes.length === 0) {
      errors.push('Framework must have a defined scope');
    }

    return errors;
  }

  // Convert to plain object for JSON serialization
  toJSON() {
    return {
      frameworkId: this.frameworkId,
      title: this.title,
      description: this.description,
      type: this.type,
      scope: this.scope,
      requirements: this.requirements,
      guidelines: this.guidelines,
      resources: this.resources,
      templates: this.templates,
      priority: this.priority,
      mandatory: this.mandatory,
      implementationDate: this.implementationDate,
      deadlineDate: this.deadlineDate,
      successCriteria: this.successCriteria,
      assessmentMethods: this.assessmentMethods,
      complianceMetrics: this.complianceMetrics,
      communicationPlan: this.communicationPlan,
      compliance: this.compliance,
      version: this.version,
      previousVersions: this.previousVersions,
      changeLog: this.changeLog,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      createdBy: this.createdBy,
      lastModifiedBy: this.lastModifiedBy,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt
    };
  }
}

export default Framework;