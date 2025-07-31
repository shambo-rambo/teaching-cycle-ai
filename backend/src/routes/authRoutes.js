import express from 'express';
import { authService } from '../services/authService.js';
import { GoogleAuthService } from '../services/googleAuthService.js';
import { 
  authenticateToken, 
  requireAdmin, 
  requireExecutive,
  checkResourceAccess,
  rateLimit,
  logRequests 
} from '../middleware/authMiddleware.js';

const router = express.Router();
const googleAuthService = new GoogleAuthService();

// Apply logging and rate limiting to all auth routes
router.use(logRequests);
router.use(rateLimit);

// Public routes (no authentication required)

// User Registration
router.post('/register', async (req, res) => {
  try {
    const { email, name, password, schoolId } = req.body;

    // Validate input
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email, name, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    const result = await authService.registerUser({
      email,
      name,
      password,
      schoolId
    });

    if (result.success) {
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: result.user,
        token: result.token
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Registration route error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const result = await authService.loginUser(email, password);

    if (result.success) {
      res.json({
        success: true,
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    console.error('Login route error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

// Google OAuth Login
router.post('/google', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Google token is required'
      });
    }

    const result = await googleAuthService.authenticateWithGoogle(token);

    if (result.success) {
      res.json({
        success: true,
        message: result.isNewUser ? 'Account created successfully' : 'Login successful',
        user: result.user,
        token: result.token,
        isNewUser: result.isNewUser
      });
    } else {
      res.status(401).json(result);
    }
  } catch (error) {
    console.error('Google OAuth route error:', error);
    res.status(500).json({
      success: false,
      error: 'Google authentication failed'
    });
  }
});

// Protected routes (authentication required)

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await authService.getUserProfile(req.user.userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Profile route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve profile'
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, profile, preferences } = req.body;
    
    const result = await authService.updateUserProfile(req.user.userId, {
      name,
      profile,
      preferences
    });

    if (result.success) {
      res.json({
        success: true,
        message: 'Profile updated successfully',
        user: result.user
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile'
    });
  }
});

// Token verification endpoint
router.post('/verify', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user,
    message: 'Token is valid'
  });
});

// Admin routes

// Get all users (Admin only)
router.get('/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await authService.getAllUsers(req.user.userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(403).json(result);
    }
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve users'
    });
  }
});

// Promote user role (Admin only)
router.post('/users/:userId/promote', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        error: 'New role is required'
      });
    }

    const result = await authService.promoteUser(req.user.userId, userId, role);

    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        user: result.user
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Role promotion error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to promote user'
    });
  }
});

// Get specific user (Admin or self)
router.get('/users/:userId', authenticateToken, checkResourceAccess('user'), async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await authService.getUserProfile(userId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve user'
    });
  }
});

// Executive routes (Head of T&L, Head of Learning Support, Admin)

// Get user statistics (Executive only)
router.get('/stats', authenticateToken, requireExecutive, (req, res) => {
  try {
    const stats = authService.getUserStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics'
    });
  }
});

// Development routes (only in development mode)
if (process.env.NODE_ENV === 'development') {
  // Create test users
  router.post('/dev/create-test-users', async (req, res) => {
    try {
      await authService.createTestUsers();
      res.json({
        success: true,
        message: 'Test users created successfully'
      });
    } catch (error) {
      console.error('Create test users error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create test users'
      });
    }
  });

  // Recreate demo users (always available for fixing auth issues)
  router.post('/dev/recreate-demo-users', async (req, res) => {
    try {
      const result = await authService.recreateDemoUsers();
      res.json(result);
    } catch (error) {
      console.error('Recreate demo users error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to recreate demo users'
      });
    }
  });

  // Reset all users (dangerous - development only)
  router.post('/dev/reset-users', authenticateToken, requireAdmin, (req, res) => {
    try {
      authService.users = [];
      authService.initializeDefaultAdmin();
      res.json({
        success: true,
        message: 'All users reset, default admin recreated'
      });
    } catch (error) {
      console.error('Reset users error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reset users'
      });
    }
  });
}

// Logout (client-side token removal, but we can log it)
router.post('/logout', authenticateToken, (req, res) => {
  console.log(`User logged out: ${req.user.name}`);
  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Password reset placeholder (for future implementation)
router.post('/forgot-password', (req, res) => {
  res.json({
    success: false,
    error: 'Password reset not implemented yet',
    message: 'Please contact administrator to reset password'
  });
});

// Error handling for this router
router.use((error, req, res, next) => {
  console.error('Auth route error:', error);
  res.status(500).json({
    success: false,
    error: 'Authentication service error'
  });
});

export default router;