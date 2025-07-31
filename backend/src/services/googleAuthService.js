import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { db } from '../config/firebase.js';
import dotenv from 'dotenv';

dotenv.config();

export class GoogleAuthService {
  constructor() {
    // Only Client ID is needed for web applications
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    this.usersCollection = db.collection('users');
  }

  async verifyGoogleToken(token) {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      return {
        success: true,
        userData: {
          googleId: payload.sub,
          email: payload.email,
          name: payload.name,
          picture: payload.picture,
          emailVerified: payload.email_verified
        }
      };
    } catch (error) {
      console.error('Google token verification failed:', error);
      return {
        success: false,
        error: 'Invalid Google token'
      };
    }
  }

  async findOrCreateUser(googleUserData) {
    try {
      // Check if user already exists by Google ID
      const googleIdQuery = await this.usersCollection
        .where('googleId', '==', googleUserData.googleId)
        .get();

      if (!googleIdQuery.empty) {
        // User exists, return existing user
        const userDoc = googleIdQuery.docs[0];
        return {
          success: true,
          user: {
            id: userDoc.id,
            ...userDoc.data()
          },
          isNewUser: false
        };
      }

      // Check if user exists by email (for migration of existing accounts)
      const emailQuery = await this.usersCollection
        .where('email', '==', googleUserData.email)
        .get();

      if (!emailQuery.empty) {
        // User exists with email, update with Google ID
        const userDoc = emailQuery.docs[0];
        await userDoc.ref.update({
          googleId: googleUserData.googleId,
          picture: googleUserData.picture,
          lastLogin: new Date(),
          authMethod: 'google'
        });

        return {
          success: true,
          user: {
            id: userDoc.id,
            ...userDoc.data(),
            googleId: googleUserData.googleId,
            picture: googleUserData.picture
          },
          isNewUser: false
        };
      }

      // Create new user
      const newUser = {
        googleId: googleUserData.googleId,
        email: googleUserData.email,
        displayName: googleUserData.name,
        name: googleUserData.name,
        picture: googleUserData.picture,
        role: 'Teacher', // Default role for Google sign-ups
        authMethod: 'google',
        emailVerified: googleUserData.emailVerified,
        status: 'active',
        createdAt: new Date(),
        lastLogin: new Date(),
        preferences: {
          theme: 'light',
          notifications: true
        }
      };

      const docRef = await this.usersCollection.add(newUser);
      
      return {
        success: true,
        user: {
          id: docRef.id,
          ...newUser
        },
        isNewUser: true
      };

    } catch (error) {
      console.error('Find or create user error:', error);
      return {
        success: false,
        error: 'Failed to process user data'
      };
    }
  }

  generateJWT(user) {
    try {
      const tokenPayload = {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.displayName || user.name
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );

      return {
        success: true,
        token,
        user: {
          userId: user.id,
          email: user.email,
          displayName: user.displayName || user.name,
          role: user.role,
          picture: user.picture
        }
      };
    } catch (error) {
      console.error('JWT generation error:', error);
      return {
        success: false,
        error: 'Failed to generate authentication token'
      };
    }
  }

  async authenticateWithGoogle(googleToken) {
    try {
      // Verify Google token
      const verificationResult = await this.verifyGoogleToken(googleToken);
      if (!verificationResult.success) {
        return verificationResult;
      }

      // Find or create user
      const userResult = await this.findOrCreateUser(verificationResult.userData);
      if (!userResult.success) {
        return userResult;
      }

      // Generate JWT
      const jwtResult = this.generateJWT(userResult.user);
      if (!jwtResult.success) {
        return jwtResult;
      }

      return {
        success: true,
        token: jwtResult.token,
        user: jwtResult.user,
        isNewUser: userResult.isNewUser
      };

    } catch (error) {
      console.error('Google authentication error:', error);
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }
}

export default GoogleAuthService;