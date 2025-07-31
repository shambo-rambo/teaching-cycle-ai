// User model schema for the School Intelligence system
export const UserSchema = {
  // Core user fields
  userId: {
    type: 'string',
    required: true,
    unique: true,
    description: 'Unique identifier for the user'
  },
  email: {
    type: 'string',
    required: true,
    unique: true,
    validation: 'email',
    description: 'User email address'
  },
  name: {
    type: 'string',
    required: true,
    description: 'Full name of the user'
  },
  passwordHash: {
    type: 'string',
    required: true,
    description: 'Hashed password for authentication'
  },
  
  // Role and permissions
  role: {
    type: 'string',
    required: true,
    enum: ['Teacher', 'HeadOfTeachingLearning', 'HeadOfLearningSupport', 'Admin'],
    default: 'Teacher',
    description: 'User role determining access level'
  },
  permissions: {
    type: 'array',
    default: [],
    description: 'Additional permissions for fine-grained access control'
  },
  
  // School association
  schoolId: {
    type: 'string',
    required: false,
    description: 'Associated school ID (for multi-school support)'
  },
  departmentId: {
    type: 'string',
    required: false,
    description: 'Associated department ID for teachers'
  },
  
  // Profile information
  profile: {
    type: 'object',
    properties: {
      subjectsTeaching: {
        type: 'array',
        default: [],
        description: 'List of subjects the teacher teaches'
      },
      yearsExperience: {
        type: 'number',
        required: false,
        description: 'Years of teaching experience'
      },
      specializations: {
        type: 'array',
        default: [],
        description: 'Teaching specializations or certifications'
      }
    }
  },
  
  // Activity tracking
  lastLogin: {
    type: 'timestamp',
    required: false,
    description: 'Last login timestamp'
  },
  createdAt: {
    type: 'timestamp',
    required: true,
    default: 'now',
    description: 'User creation timestamp'
  },
  updatedAt: {
    type: 'timestamp',
    required: true,
    default: 'now',
    description: 'Last update timestamp'
  },
  
  // Status and preferences
  status: {
    type: 'string',
    enum: ['active', 'inactive', 'pending'],
    default: 'active',
    description: 'User account status'
  },
  preferences: {
    type: 'object',
    properties: {
      theme: {
        type: 'string',
        enum: ['light', 'dark'],
        default: 'light'
      },
      notifications: {
        type: 'object',
        properties: {
          email: { type: 'boolean', default: true },
          push: { type: 'boolean', default: true },
          frameworkUpdates: { type: 'boolean', default: true }
        }
      }
    }
  }
};

// Role hierarchy and permissions
export const RoleHierarchy = {
  Admin: {
    level: 4,
    permissions: ['*'], // All permissions
    description: 'Full system access'
  },
  HeadOfTeachingLearning: {
    level: 3,
    permissions: [
      'create_teaching_frameworks',
      'view_all_classes',
      'view_reports',
      'manage_curriculum'
    ],
    description: 'Teaching and learning framework management'
  },
  HeadOfLearningSupport: {
    level: 3,
    permissions: [
      'create_support_frameworks',
      'view_student_support_data',
      'manage_accommodations',
      'view_reports'
    ],
    description: 'Learning support framework management'
  },
  Teacher: {
    level: 2,
    permissions: [
      'create_lessons',
      'view_own_classes',
      'use_frameworks',
      'view_student_profiles'
    ],
    description: 'Lesson creation and class management'
  }
};

// Default user creation function
export const createDefaultUser = (userData) => {
  return {
    userId: generateUniqueId(),
    email: userData.email,
    name: userData.name,
    passwordHash: userData.passwordHash,
    role: 'Teacher', // Default role
    permissions: RoleHierarchy.Teacher.permissions,
    schoolId: userData.schoolId || null,
    profile: {
      subjectsTeaching: [],
      specializations: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        push: true,
        frameworkUpdates: true
      }
    }
  };
};

// Helper function to check permissions
export const hasPermission = (user, permission) => {
  if (user.role === 'Admin') return true;
  return user.permissions.includes(permission);
};

// Role promotion validation
export const canPromoteToRole = (currentUserRole, targetRole) => {
  const currentLevel = RoleHierarchy[currentUserRole]?.level || 0;
  const targetLevel = RoleHierarchy[targetRole]?.level || 0;
  
  // Only admins can promote to admin level
  if (targetRole === 'Admin') {
    return currentUserRole === 'Admin';
  }
  
  // Can only promote to roles at same or lower level
  return currentLevel >= targetLevel;
};

function generateUniqueId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}