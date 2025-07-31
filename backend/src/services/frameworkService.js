// Framework Management Service - School Intelligence System
// Handles framework creation and distribution for both Teaching & Learning and Learning Support

import Framework from '../models/Framework.js';

class FrameworkService {
  constructor() {
    this.frameworks = []; // In-memory storage for MVP
    this.initializeSampleFrameworks();
  }

  // Initialize with sample frameworks for demo
  initializeSampleFrameworks() {
    // Sample Teaching & Learning Framework
    const teachingFramework = new Framework({
      title: 'Learning Intentions & Success Criteria',
      description: 'All lessons must include clear learning intentions and success criteria to help students understand what they are learning and how they will know when they have succeeded.',
      type: 'teaching',
      scope: {
        schoolWide: true,
        departments: [],
        subjects: [],
        yearLevels: [],
        classes: []
      },
      requirements: [
        {
          id: 'req_li_sc_1',
          title: 'Display Learning Intentions',
          description: 'Each lesson must start with clearly displayed learning intentions',
          type: 'activity',
          mandatory: true,
          checklistItems: [
            'Learning intentions are visible to all students',
            'Learning intentions are written in student-friendly language',
            'Learning intentions connect to the unit goals'
          ],
          createdAt: new Date().toISOString()
        },
        {
          id: 'req_li_sc_2',
          title: 'Co-create Success Criteria',
          description: 'Success criteria should be developed with student input when possible',
          type: 'activity',
          mandatory: true,
          checklistItems: [
            'Success criteria are co-created with students',
            'Success criteria are specific and measurable',
            'Students can self-assess against success criteria'
          ],
          createdAt: new Date().toISOString()
        }
      ],
      priority: 'high',
      mandatory: true,
      successCriteria: [
        'All lessons include visible learning intentions',
        'Success criteria are co-created with students',
        '90% teacher compliance in classroom observations'
      ],
      status: 'active',
      createdBy: 'system',
      version: '1.0'
    });

    // Sample Learning Support Framework
    const supportFramework = new Framework({
      title: 'Differentiation for ADHD Students',
      description: 'Strategies and accommodations to support students with ADHD in the classroom, including movement breaks, visual organizers, and modified assessments.',
      type: 'support',
      scope: {
        schoolWide: true,
        departments: [],
        subjects: [],
        yearLevels: [],
        classes: []
      },
      requirements: [
        {
          id: 'req_adhd_1',
          title: 'Movement Breaks',
          description: 'Provide regular movement opportunities for students with ADHD',
          type: 'activity',
          mandatory: true,
          checklistItems: [
            'Schedule movement breaks every 15-20 minutes',
            'Allow fidget tools when appropriate',
            'Provide standing desk options'
          ],
          createdAt: new Date().toISOString()
        },
        {
          id: 'req_adhd_2',
          title: 'Visual Organization',
          description: 'Use visual organizers and clear structure to support executive function',
          type: 'documentation',
          mandatory: true,
          checklistItems: [
            'Provide graphic organizers for note-taking',
            'Use color-coding for different subjects/topics',
            'Display clear daily schedules and routines'
          ],
          createdAt: new Date().toISOString()
        }
      ],
      priority: 'medium',
      mandatory: false,
      successCriteria: [
        'Students with ADHD show improved engagement',
        'Reduced behavioral incidents',
        'Teachers report increased confidence in support strategies'
      ],
      status: 'active',
      createdBy: 'system',
      version: '1.0'
    });

    this.frameworks.push(teachingFramework, supportFramework);
  }

  // Framework CRUD Operations

  // Create new framework
  createFramework(frameworkData, createdBy) {
    const framework = new Framework({
      ...frameworkData,
      createdBy,
      lastModifiedBy: createdBy
    });

    const validationErrors = framework.validate();
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: 'Validation failed',
        details: validationErrors
      };
    }

    this.frameworks.push(framework);
    
    return {
      success: true,
      message: 'Framework created successfully',
      framework: framework.toJSON()
    };
  }

  // Get all frameworks with filtering
  getAllFrameworks(filters = {}) {
    let filteredFrameworks = [...this.frameworks];

    // Filter by type
    if (filters.type) {
      filteredFrameworks = filteredFrameworks.filter(f => f.type === filters.type);
    }

    // Filter by status
    if (filters.status) {
      filteredFrameworks = filteredFrameworks.filter(f => f.status === filters.status);
    }

    // Filter by priority
    if (filters.priority) {
      filteredFrameworks = filteredFrameworks.filter(f => f.priority === filters.priority);
    }

    // Filter by mandatory
    if (filters.mandatory !== undefined) {
      filteredFrameworks = filteredFrameworks.filter(f => f.mandatory === filters.mandatory);
    }

    // Filter by creator
    if (filters.createdBy) {
      filteredFrameworks = filteredFrameworks.filter(f => f.createdBy === filters.createdBy);
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredFrameworks = filteredFrameworks.filter(f => 
        f.title.toLowerCase().includes(searchTerm) ||
        f.description.toLowerCase().includes(searchTerm)
      );
    }

    // Sort by priority (high first) then by creation date
    filteredFrameworks.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return {
      success: true,
      frameworks: filteredFrameworks.map(f => f.toJSON()),
      total: filteredFrameworks.length
    };
  }

  // Get framework by ID
  getFrameworkById(frameworkId) {
    const framework = this.frameworks.find(f => f.frameworkId === frameworkId);
    
    if (!framework) {
      return {
        success: false,
        error: 'Framework not found'
      };
    }

    return {
      success: true,
      framework: framework.toJSON()
    };
  }

  // Update framework
  updateFramework(frameworkId, updates, updatedBy) {
    const framework = this.frameworks.find(f => f.frameworkId === frameworkId);
    
    if (!framework) {
      return {
        success: false,
        error: 'Framework not found'
      };
    }

    // Apply updates
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined && key !== 'frameworkId' && key !== 'createdAt') {
        framework[key] = updates[key];
      }
    });

    framework.updatedAt = new Date().toISOString();
    framework.lastModifiedBy = updatedBy;

    const validationErrors = framework.validate();
    if (validationErrors.length > 0) {
      return {
        success: false,
        error: 'Validation failed',
        details: validationErrors
      };
    }

    return {
      success: true,
      message: 'Framework updated successfully',
      framework: framework.toJSON()
    };
  }

  // Delete framework
  deleteFramework(frameworkId) {
    const index = this.frameworks.findIndex(f => f.frameworkId === frameworkId);
    
    if (index === -1) {
      return {
        success: false,
        error: 'Framework not found'
      };
    }

    this.frameworks.splice(index, 1);

    return {
      success: true,
      message: 'Framework deleted successfully'
    };
  }

  // Framework-specific operations

  // Activate framework
  activateFramework(frameworkId, activatedBy) {
    const framework = this.frameworks.find(f => f.frameworkId === frameworkId);
    
    if (!framework) {
      return {
        success: false,
        error: 'Framework not found'
      };
    }

    framework.activate();
    framework.lastModifiedBy = activatedBy;

    return {
      success: true,
      message: 'Framework activated successfully',
      framework: framework.toJSON()
    };
  }

  // Archive framework
  archiveFramework(frameworkId, archivedBy) {
    const framework = this.frameworks.find(f => f.frameworkId === frameworkId);
    
    if (!framework) {
      return {
        success: false,
        error: 'Framework not found'
      };
    }

    framework.archive();
    framework.lastModifiedBy = archivedBy;

    return {
      success: true,
      message: 'Framework archived successfully',
      framework: framework.toJSON()
    };
  }

  // Add requirement to framework
  addRequirement(frameworkId, requirement, addedBy) {
    const framework = this.frameworks.find(f => f.frameworkId === frameworkId);
    
    if (!framework) {
      return {
        success: false,
        error: 'Framework not found'
      };
    }

    const requirementId = framework.addRequirement(requirement);
    framework.lastModifiedBy = addedBy;

    return {
      success: true,
      message: 'Requirement added successfully',
      requirementId,
      framework: framework.toJSON()
    };
  }

  // Get frameworks applicable to a specific context
  getApplicableFrameworks(context) {
    const applicableFrameworks = this.frameworks.filter(f => 
      f.status === 'active' && f.appliesTo(context)
    );

    return {
      success: true,
      frameworks: applicableFrameworks.map(f => f.toJSON()),
      total: applicableFrameworks.length
    };
  }

  // Get frameworks by type for specific user role
  getFrameworksForRole(userRole, userId) {
    let frameworks = [];

    if (userRole === 'HeadOfTeachingLearning') {
      frameworks = this.frameworks.filter(f => f.type === 'teaching');
    } else if (userRole === 'HeadOfLearningSupport') {
      frameworks = this.frameworks.filter(f => f.type === 'support');
    } else if (userRole === 'Admin') {
      frameworks = [...this.frameworks]; // Admin can see all
    } else {
      // Teachers see frameworks applicable to their context
      frameworks = this.frameworks.filter(f => f.status === 'active');
    }

    return {
      success: true,
      frameworks: frameworks.map(f => f.toJSON()),
      total: frameworks.length
    };
  }

  // Update compliance for framework
  updateFrameworkCompliance(frameworkId, complianceData, updatedBy) {
    const framework = this.frameworks.find(f => f.frameworkId === frameworkId);
    
    if (!framework) {
      return {
        success: false,
        error: 'Framework not found'
      };
    }

    framework.updateCompliance(complianceData.rate, complianceData.assessmentData);
    framework.lastModifiedBy = updatedBy;

    return {
      success: true,
      message: 'Framework compliance updated successfully',
      framework: framework.toJSON()
    };
  }

  // Get framework templates for quick creation
  getFrameworkTemplates(type) {
    const templates = {
      teaching: [
        {
          title: 'Learning Intentions & Success Criteria',
          description: 'Framework for clear learning objectives in every lesson',
          requirements: [
            {
              title: 'Display Learning Intentions',
              description: 'Each lesson must start with clearly displayed learning intentions',
              type: 'activity',
              mandatory: true
            },
            {
              title: 'Co-create Success Criteria',
              description: 'Success criteria should be developed with student input',
              type: 'activity',
              mandatory: true
            }
          ]
        },
        {
          title: 'Formative Assessment Strategies',
          description: 'Regular check-ins and feedback during lessons',
          requirements: [
            {
              title: 'Exit Tickets',
              description: 'Use exit tickets to assess understanding',
              type: 'assessment',
              mandatory: false
            },
            {
              title: 'Think-Pair-Share',
              description: 'Regular opportunities for peer discussion',
              type: 'activity',
              mandatory: false
            }
          ]
        }
      ],
      support: [
        {
          title: 'Universal Design for Learning (UDL)',
          description: 'Inclusive teaching practices for all learners',
          requirements: [
            {
              title: 'Multiple Means of Representation',
              description: 'Present information in various formats',
              type: 'activity',
              mandatory: true
            },
            {
              title: 'Multiple Means of Engagement',
              description: 'Provide options for sustaining motivation',
              type: 'activity',
              mandatory: true
            }
          ]
        },
        {
          title: 'Accommodation Implementation',
          description: 'Systematic approach to student accommodations',
          requirements: [
            {
              title: 'Review Student Profiles',
              description: 'Check accommodation needs before planning',
              type: 'documentation',
              mandatory: true
            },
            {
              title: 'Implement Accommodations',
              description: 'Apply required accommodations in lessons',
              type: 'activity',
              mandatory: true
            }
          ]
        }
      ]
    };

    return {
      success: true,
      templates: templates[type] || [],
      total: (templates[type] || []).length
    };
  }

  // Get statistics
  getStatistics() {
    const stats = {
      total: this.frameworks.length,
      byType: { teaching: 0, support: 0 },
      byStatus: { draft: 0, active: 0, archived: 0, suspended: 0 },
      byPriority: { high: 0, medium: 0, low: 0 },
      mandatory: 0,
      schoolWide: 0,
      averageCompliance: 0
    };

    let totalCompliance = 0;
    let frameworksWithCompliance = 0;

    this.frameworks.forEach(framework => {
      // Type distribution
      stats.byType[framework.type]++;
      
      // Status distribution
      stats.byStatus[framework.status]++;
      
      // Priority distribution
      stats.byPriority[framework.priority]++;
      
      // Mandatory count
      if (framework.mandatory) stats.mandatory++;
      
      // School-wide count
      if (framework.scope.schoolWide) stats.schoolWide++;
      
      // Compliance calculation
      if (framework.compliance.complianceRate > 0) {
        totalCompliance += framework.compliance.complianceRate;
        frameworksWithCompliance++;
      }
    });

    if (frameworksWithCompliance > 0) {
      stats.averageCompliance = Math.round(totalCompliance / frameworksWithCompliance);
    }

    return {
      success: true,
      statistics: stats
    };
  }
}

// Export singleton instance
export const frameworkService = new FrameworkService();
export default frameworkService;