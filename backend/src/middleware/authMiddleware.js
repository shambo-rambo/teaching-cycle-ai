import jwt from 'jsonwebtoken';
import { authService } from '../services/authService.js';
import { db } from '../config/firebase.js';

// JWT token verification middleware
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Access token required'
    });
  }

  try {
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // First try to find user in the legacy in-memory system
    const legacyResult = authService.verifyToken(token);
    if (legacyResult.success) {
      req.user = legacyResult.user;
      return next();
    }
    
    // If not found in legacy system, try the new database system
    try {
      const usersRef = db.collection('users');
      const userQuery = await usersRef.where('email', '==', decoded.email).get();
      
      if (!userQuery.empty) {
        const userDoc = userQuery.docs[0];
        const userData = userDoc.data();
        
        req.user = {
          userId: userDoc.id,
          email: userData.email,
          role: userData.role || 'Teacher',
          displayName: userData.displayName || userData.name,
          name: userData.name || userData.displayName
        };
        return next();
      }
    } catch (dbError) {
      console.error('Database user lookup error:', dbError);
    }
    
    // If user not found in either system, but token is valid, create minimal user object
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role || 'Teacher',
      displayName: decoded.name,
      name: decoded.name
    };
    next();
    
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({
      success: false,
      error: 'Invalid token'
    });
  }
};

// Role-based authorization middleware
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Allow if user has required role or is admin
    if (req.user.role === 'Admin' || allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        required: allowedRoles,
        current: req.user.role
      });
    }
  };
};

// Permission-based authorization middleware
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Admin has all permissions
    if (req.user.role === 'Admin') {
      next();
      return;
    }

    // Check if user has specific permission
    if (req.user.permissions && req.user.permissions.includes(permission)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        required: permission,
        current: req.user.permissions
      });
    }
  };
};

// Admin-only middleware
export const requireAdmin = requireRole(['Admin']);

// Executive-only middleware (Head of T&L, Head of Learning Support, Admin)
export const requireExecutive = requireRole(['Admin', 'HeadOfTeachingLearning', 'HeadOfLearningSupport']);

// Optional authentication middleware (adds user to request if token is valid, but doesn't require it)
export const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    const result = authService.verifyToken(token);
    if (result.success) {
      req.user = result.user;
    }
  }

  next();
};

// Middleware to check if user can access specific resource
export const checkResourceAccess = (resourceType) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    // Admin can access everything
    if (req.user.role === 'Admin') {
      next();
      return;
    }

    const resourceId = req.params.id || req.params.userId || req.params.classId;
    
    switch (resourceType) {
      case 'user':
        // Users can access their own profile
        if (req.user.userId === resourceId) {
          next();
        } else {
          res.status(403).json({
            success: false,
            error: 'Can only access your own profile'
          });
        }
        break;
        
      case 'class':
        // Teachers can access their own classes, executives can access all
        if (req.user.role === 'HeadOfTeachingLearning' || 
            req.user.role === 'HeadOfLearningSupport') {
          next();
        } else {
          // TODO: Check if teacher owns this class
          next(); // For now, allow all teachers
        }
        break;
        
      default:
        next();
    }
  };
};

// Rate limiting middleware (simple implementation)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // per window

export const rateLimit = (req, res, next) => {
  const clientId = req.ip || req.user?.userId || 'anonymous';
  const now = Date.now();
  
  // Clean old entries
  for (const [id, data] of requestCounts.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_WINDOW) {
      requestCounts.delete(id);
    }
  }
  
  // Check current client
  const clientData = requestCounts.get(clientId);
  
  if (!clientData) {
    requestCounts.set(clientId, {
      count: 1,
      firstRequest: now
    });
    next();
  } else if (clientData.count < MAX_REQUESTS) {
    clientData.count++;
    next();
  } else {
    res.status(429).json({
      success: false,
      error: 'Too many requests',
      retryAfter: Math.ceil((clientData.firstRequest + RATE_LIMIT_WINDOW - now) / 1000)
    });
  }
};

// Error handling middleware for auth-related errors
export const authErrorHandler = (err, req, res, next) => {
  console.error('Auth error:', err);
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token expired'
    });
  }
  
  next(err);
};

// Development middleware to log all requests
export const logRequests = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`${req.method} ${req.path} - User: ${req.user?.name || 'Anonymous'} (${req.user?.role || 'None'})`);
  }
  next();
};