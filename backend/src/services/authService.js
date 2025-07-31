import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createDefaultUser, RoleHierarchy, canPromoteToRole } from '../models/User.js';
import { demoUsers, rolePermissions } from '../config/demoUsers.js';

// In-memory storage for MVP (replace with database later)
let users = [];
let departments = [];

export class AuthService {
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
    this.SALT_ROUNDS = 10;
    
    // Initialize demo users on startup
    this.initializeDemoUsers();
  }

  // User Registration
  async registerUser(userData) {
    try {
      // Validate required fields
      if (!userData.email || !userData.name || !userData.password) {
        return {
          success: false,
          error: 'Email, name, and password are required'
        };
      }

      // Check if user already exists
      const existingUser = users.find(user => user.email === userData.email);
      if (existingUser) {
        return {
          success: false,
          error: 'User with this email already exists'
        };
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, this.SALT_ROUNDS);

      // Create user with default role
      const newUser = createDefaultUser({
        email: userData.email,
        name: userData.name,
        passwordHash,
        schoolId: userData.schoolId
      });

      // Store user
      users.push(newUser);

      // Generate JWT token
      const token = this.generateToken(newUser);

      console.log(`✅ New user registered: ${newUser.name} (${newUser.email}) as ${newUser.role}`);

      return {
        success: true,
        user: this.sanitizeUser(newUser),
        token
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'Registration failed'
      };
    }
  }

  // User Login
  async loginUser(email, password) {
    try {
      // Find user
      const user = users.find(u => u.email === email);
      if (!user) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return {
          success: false,
          error: 'Invalid email or password'
        };
      }

      // Update last login
      user.lastLogin = new Date().toISOString();

      // Generate JWT token
      const token = this.generateToken(user);

      console.log(`✅ User logged in: ${user.name} (${user.role})`);

      return {
        success: true,
        user: this.sanitizeUser(user),
        token
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Login failed'
      };
    }
  }

  // Role Promotion
  async promoteUser(adminUserId, targetUserId, newRole) {
    try {
      // Find admin user
      const adminUser = users.find(u => u.userId === adminUserId);
      if (!adminUser) {
        return {
          success: false,
          error: 'Admin user not found'
        };
      }

      // Find target user
      const targetUser = users.find(u => u.userId === targetUserId);
      if (!targetUser) {
        return {
          success: false,
          error: 'Target user not found'
        };
      }

      // Check if admin can promote to this role
      if (!canPromoteToRole(adminUser.role, newRole)) {
        return {
          success: false,
          error: 'Insufficient permissions to promote to this role'
        };
      }

      // Validate new role
      if (!RoleHierarchy[newRole]) {
        return {
          success: false,
          error: 'Invalid role specified'
        };
      }

      // Update user role and permissions
      const oldRole = targetUser.role;
      targetUser.role = newRole;
      targetUser.permissions = RoleHierarchy[newRole].permissions;
      targetUser.updatedAt = new Date().toISOString();

      console.log(`✅ User promoted: ${targetUser.name} from ${oldRole} to ${newRole}`);

      return {
        success: true,
        user: this.sanitizeUser(targetUser),
        message: `User promoted from ${oldRole} to ${newRole}`
      };
    } catch (error) {
      console.error('Role promotion error:', error);
      return {
        success: false,
        error: 'Role promotion failed'
      };
    }
  }

  // Get All Users (Admin only)
  async getAllUsers(requestingUserId) {
    try {
      const requestingUser = users.find(u => u.userId === requestingUserId);
      if (!requestingUser || requestingUser.role !== 'Admin') {
        return {
          success: false,
          error: 'Insufficient permissions'
        };
      }

      return {
        success: true,
        users: users.map(user => this.sanitizeUser(user))
      };
    } catch (error) {
      console.error('Get users error:', error);
      return {
        success: false,
        error: 'Failed to retrieve users'
      };
    }
  }

  // Get User Profile
  async getUserProfile(userId) {
    try {
      const user = users.find(u => u.userId === userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      return {
        success: true,
        user: this.sanitizeUser(user)
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return {
        success: false,
        error: 'Failed to retrieve profile'
      };
    }
  }

  // Update User Profile
  async updateUserProfile(userId, updateData) {
    try {
      const user = users.find(u => u.userId === userId);
      if (!user) {
        return {
          success: false,
          error: 'User not found'
        };
      }

      // Update allowed fields
      const allowedFields = ['name', 'profile', 'preferences'];
      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          user[field] = updateData[field];
        }
      });

      user.updatedAt = new Date().toISOString();

      return {
        success: true,
        user: this.sanitizeUser(user)
      };
    } catch (error) {
      console.error('Update profile error:', error);
      return {
        success: false,
        error: 'Failed to update profile'
      };
    }
  }

  // Token verification
  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET);
      const user = users.find(u => u.userId === decoded.userId);
      
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      return {
        success: true,
        user: this.sanitizeUser(user)
      };
    } catch (error) {
      return {
        success: false,
        error: 'Invalid token'
      };
    }
  }

  // Helper methods
  generateToken(user) {
    const payload = {
      userId: user.userId,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: this.JWT_EXPIRES_IN
    });
  }

  sanitizeUser(user) {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  // Initialize default admin user for testing
  // Initialize all demo users on startup
  async initializeDemoUsers() {
    if (users.length === 0) {
      console.log('🔧 Initializing demo users...');
      
      for (const demoUser of demoUsers) {
        try {
          // Check if user already exists
          const existingUser = users.find(user => user.email === demoUser.email);
          if (existingUser) {
            console.log(`⚠️  Demo user already exists: ${demoUser.email}`);
            continue;
          }

          // Hash password
          const passwordHash = await bcrypt.hash(demoUser.password, this.SALT_ROUNDS);

          // Create user with correct permissions
          const newUser = {
            userId: demoUser.userId,
            email: demoUser.email,
            name: demoUser.name,
            passwordHash: passwordHash,
            role: demoUser.role,
            permissions: rolePermissions[demoUser.role] || ['create_lessons'],
            schoolId: demoUser.schoolId,
            profile: demoUser.profile,
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

          users.push(newUser);
          console.log(`✅ Demo user created: ${demoUser.email} (${demoUser.role})`);
        } catch (error) {
          console.error(`❌ Failed to create demo user ${demoUser.email}:`, error);
        }
      }
      
      console.log(`🎉 Demo users initialized: ${users.length} users ready`);
    } else {
      console.log('👥 Users already exist, skipping demo user creation');
    }
  }

  // Recreate demo users (for development/testing)
  async recreateDemoUsers() {
    console.log('🔄 Recreating demo users...');
    
    // Remove existing demo users
    users = users.filter(user => !demoUsers.some(demo => demo.email === user.email));
    
    // Initialize demo users again
    await this.initializeDemoUsers();
    
    return {
      success: true,
      message: `Demo users recreated: ${demoUsers.length} users`,
      users: users.map(u => ({ email: u.email, name: u.name, role: u.role }))
    };
  }

  // Development helper methods
  async createTestUsers() {
    const testUsers = [
      {
        email: 'head.teaching@school.edu',
        name: 'Sarah Johnson',
        password: 'password123',
        role: 'HeadOfTeachingLearning'
      },
      {
        email: 'head.support@school.edu',
        name: 'Michael Chen',
        password: 'password123',
        role: 'HeadOfLearningSupport'
      },
      {
        email: 'teacher.history@school.edu',
        name: 'Emma Davis',
        password: 'password123',
        role: 'Teacher'
      }
    ];

    for (const userData of testUsers) {
      const result = await this.registerUser(userData);
      if (result.success && userData.role !== 'Teacher') {
        // Promote to executive role
        await this.promoteUser('admin_default', result.user.userId, userData.role);
      }
    }

    console.log('🧪 Test users created for development');
  }

  // Statistics
  getUserStats() {
    const stats = {
      total: users.length,
      byRole: {},
      active: users.filter(u => u.status === 'active').length,
      recentLogins: users.filter(u => {
        if (!u.lastLogin) return false;
        const loginDate = new Date(u.lastLogin);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return loginDate > weekAgo;
      }).length
    };

    // Count by role
    Object.keys(RoleHierarchy).forEach(role => {
      stats.byRole[role] = users.filter(u => u.role === role).length;
    });

    return stats;
  }
}

export const authService = new AuthService();