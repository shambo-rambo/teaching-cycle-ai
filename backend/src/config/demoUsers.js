// Demo Users Configuration - School Intelligence System
// Automatically creates demo accounts on server startup for testing

export const demoUsers = [
  {
    userId: 'admin_default',
    email: 'admin@school.edu',
    name: 'System Administrator',
    password: 'admin123', // Will be hashed automatically
    role: 'Admin',
    schoolId: 'school_default',
    profile: {
      subjectsTeaching: [],
      specializations: ['System Administration']
    },
    description: 'Full system administrator with all permissions'
  },
  {
    userId: 'head_teaching_demo',
    email: 'head.teaching@school.edu',
    name: 'Head of Teaching and Learning',
    password: 'password123',
    role: 'HeadOfTeachingLearning',
    schoolId: 'school_default',
    profile: {
      subjectsTeaching: [],
      specializations: ['Curriculum Development', 'Teacher Professional Development']
    },
    description: 'Executive role for teaching frameworks and curriculum oversight'
  },
  {
    userId: 'head_support_demo',
    email: 'head.support@school.edu',
    name: 'Head of Learning Support',
    password: 'password123',
    role: 'HeadOfLearningSupport',
    schoolId: 'school_default',
    profile: {
      subjectsTeaching: [],
      specializations: ['Learning Differences', 'Student Accommodations', 'ESL Support']
    },
    description: 'Executive role for learning support frameworks and student accommodations'
  },
  {
    userId: 'teacher_history_demo',
    email: 'teacher.history@school.edu',
    name: 'History Teacher',
    password: 'password123',
    role: 'Teacher',
    schoolId: 'school_default',
    profile: {
      subjectsTeaching: ['IB History HL', 'IB History SL'],
      specializations: ['IB Diploma Programme', '20th Century History', 'Historical Thinking Skills']
    },
    description: 'Standard teacher role with lesson creation and class management'
  }
];

// Role-based permissions mapping
export const rolePermissions = {
  'Admin': ['*'], // All permissions
  'HeadOfTeachingLearning': [
    'create_teaching_frameworks',
    'view_all_classes',
    'view_reports',
    'manage_curriculum',
    'view_student_profiles',
    'use_frameworks',
    'create_lessons'
  ],
  'HeadOfLearningSupport': [
    'create_support_frameworks',
    'view_student_support_data',
    'manage_accommodations',
    'view_reports',
    'view_student_profiles',
    'use_frameworks',
    'create_lessons'
  ],
  'Teacher': [
    'create_lessons',
    'view_own_classes',
    'use_frameworks',
    'view_student_profiles'
  ]
};

// Additional demo users for different subjects (optional)
export const additionalDemoUsers = [
  {
    userId: 'teacher_math_demo',
    email: 'teacher.math@school.edu',
    name: 'Mathematics Teacher',
    password: 'password123',
    role: 'Teacher',
    schoolId: 'school_default',
    profile: {
      subjectsTeaching: ['IB Mathematics: Analysis and Approaches HL', 'IB Mathematics: Analysis and Approaches SL'],
      specializations: ['IB Diploma Programme', 'Mathematical Analysis', 'Statistics']
    }
  },
  {
    userId: 'teacher_science_demo',
    email: 'teacher.science@school.edu',
    name: 'Science Teacher',
    password: 'password123',
    role: 'Teacher',
    schoolId: 'school_default',
    profile: {
      subjectsTeaching: ['IB Biology HL', 'IB Chemistry SL'],
      specializations: ['IB Diploma Programme', 'Laboratory Skills', 'Environmental Science']
    }
  },
  {
    userId: 'teacher_languages_demo',
    email: 'teacher.english@school.edu',
    name: 'English Teacher',
    password: 'password123',
    role: 'Teacher',
    schoolId: 'school_default',
    profile: {
      subjectsTeaching: ['IB English A: Literature HL', 'IB English A: Language and Literature SL'],
      specializations: ['IB Diploma Programme', 'Literary Analysis', 'Academic Writing']
    }
  }
];

// Function to get demo user by email
export function getDemoUserByEmail(email) {
  return demoUsers.find(user => user.email === email) || 
         additionalDemoUsers.find(user => user.email === email);
}

// Function to get all demo users (core + additional)
export function getAllDemoUsers(includeAdditional = false) {
  return includeAdditional ? [...demoUsers, ...additionalDemoUsers] : demoUsers;
}

// Function to validate demo user credentials
export function validateDemoCredentials(email, password) {
  const user = getDemoUserByEmail(email);
  return user && user.password === password;
}

export default {
  demoUsers,
  additionalDemoUsers,
  rolePermissions,
  getDemoUserByEmail,
  getAllDemoUsers,
  validateDemoCredentials
};