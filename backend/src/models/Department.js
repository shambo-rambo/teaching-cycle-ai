// Department model schema for school organization
export const DepartmentSchema = {
  departmentId: {
    type: 'string',
    required: true,
    unique: true,
    description: 'Unique identifier for the department'
  },
  departmentName: {
    type: 'string',
    required: true,
    description: 'Name of the department (e.g., Languages, Sciences)'
  },
  headOfDepartmentId: {
    type: 'string',
    required: false,
    foreignKey: 'User.userId',
    description: 'User ID of the department head'
  },
  schoolId: {
    type: 'string',
    required: true,
    foreignKey: 'School.schoolId',
    description: 'Associated school ID'
  },
  
  // Subject organization
  subjects: {
    type: 'array',
    default: [],
    description: 'List of subjects taught in this department',
    items: {
      type: 'object',
      properties: {
        subjectId: { type: 'string', required: true },
        subjectName: { type: 'string', required: true },
        curriculum: { type: 'string', required: true }, // IB_DP, IB_MYP, etc.
        yearLevels: { type: 'array', items: { type: 'string' } },
        description: { type: 'string', required: false }
      }
    }
  },
  
  // Department metadata
  description: {
    type: 'string',
    required: false,
    description: 'Department description and focus areas'
  },
  budget: {
    type: 'object',
    properties: {
      annual: { type: 'number', required: false },
      currency: { type: 'string', default: 'USD' }
    }
  },
  
  // Staff information
  staff: {
    type: 'array',
    default: [],
    description: 'Teachers assigned to this department',
    items: {
      type: 'object',
      properties: {
        userId: { type: 'string', required: true },
        role: { type: 'string', enum: ['Head', 'Teacher', 'Assistant'], default: 'Teacher' },
        subjects: { type: 'array', items: { type: 'string' } },
        assignedDate: { type: 'timestamp', default: 'now' }
      }
    }
  },
  
  // Tracking
  createdAt: {
    type: 'timestamp',
    required: true,
    default: 'now'
  },
  updatedAt: {
    type: 'timestamp',
    required: true,
    default: 'now'
  },
  status: {
    type: 'string',
    enum: ['active', 'inactive'],
    default: 'active'
  }
};

// Pre-configured IB department templates
export const IBDepartmentTemplates = {
  Languages: {
    departmentName: 'Languages',
    description: 'Language A and Language B subjects',
    subjects: [
      {
        subjectId: 'lang_a_lit_hl',
        subjectName: 'Language A: Literature HL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'lang_a_lit_sl',
        subjectName: 'Language A: Literature SL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'lang_b_hl',
        subjectName: 'Language B HL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'lang_b_sl',
        subjectName: 'Language B SL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      }
    ]
  },
  
  IndividualsAndSocieties: {
    departmentName: 'Individuals and Societies',
    description: 'Group 3: History, Economics, Psychology, Geography',
    subjects: [
      {
        subjectId: 'history_hl',
        subjectName: 'IB History HL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'history_sl',
        subjectName: 'IB History SL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'economics_hl',
        subjectName: 'IB Economics HL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'economics_sl',
        subjectName: 'IB Economics SL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'psychology_hl',
        subjectName: 'IB Psychology HL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'psychology_sl',
        subjectName: 'IB Psychology SL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      }
    ]
  },
  
  Sciences: {
    departmentName: 'Sciences',
    description: 'Group 4: Biology, Chemistry, Physics',
    subjects: [
      {
        subjectId: 'biology_hl',
        subjectName: 'IB Biology HL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'biology_sl',
        subjectName: 'IB Biology SL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'chemistry_hl',
        subjectName: 'IB Chemistry HL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'chemistry_sl',
        subjectName: 'IB Chemistry SL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'physics_hl',
        subjectName: 'IB Physics HL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'physics_sl',
        subjectName: 'IB Physics SL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      }
    ]
  },
  
  Mathematics: {
    departmentName: 'Mathematics',
    description: 'Group 5: Mathematics subjects',
    subjects: [
      {
        subjectId: 'math_aa_hl',
        subjectName: 'IB Mathematics: Analysis and Approaches HL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'math_aa_sl',
        subjectName: 'IB Mathematics: Analysis and Approaches SL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'math_ai_hl',
        subjectName: 'IB Mathematics: Applications and Interpretation HL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'math_ai_sl',
        subjectName: 'IB Mathematics: Applications and Interpretation SL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      }
    ]
  },
  
  Arts: {
    departmentName: 'The Arts',
    description: 'Group 6: Visual Arts, Music, Theatre Arts',
    subjects: [
      {
        subjectId: 'visual_arts_hl',
        subjectName: 'IB Visual Arts HL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'visual_arts_sl',
        subjectName: 'IB Visual Arts SL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'music_hl',
        subjectName: 'IB Music HL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      },
      {
        subjectId: 'music_sl',
        subjectName: 'IB Music SL',
        curriculum: 'IB_DP',
        yearLevels: ['DP1', 'DP2']
      }
    ]
  }
};

// Department creation helper
export const createDepartment = (departmentData, templateName = null) => {
  const template = templateName ? IBDepartmentTemplates[templateName] : {};
  
  return {
    departmentId: generateDepartmentId(),
    departmentName: departmentData.departmentName || template.departmentName,
    headOfDepartmentId: departmentData.headOfDepartmentId || null,
    schoolId: departmentData.schoolId,
    subjects: departmentData.subjects || template.subjects || [],
    description: departmentData.description || template.description || '',
    staff: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active'
  };
};

// Helper functions
export const addStaffToDepartment = (department, userId, role = 'Teacher', subjects = []) => {
  const staffMember = {
    userId,
    role,
    subjects,
    assignedDate: new Date().toISOString()
  };
  
  // Remove if already exists
  department.staff = department.staff.filter(staff => staff.userId !== userId);
  
  // Add new assignment
  department.staff.push(staffMember);
  department.updatedAt = new Date().toISOString();
  
  return department;
};

export const getSubjectsByDepartment = (departmentId, departments) => {
  const department = departments.find(d => d.departmentId === departmentId);
  return department ? department.subjects : [];
};

function generateDepartmentId() {
  return 'dept_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}