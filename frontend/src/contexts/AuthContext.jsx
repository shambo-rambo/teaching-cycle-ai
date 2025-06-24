// src/context/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../services/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create or update user profile in Firestore
  const createUserProfile = async (user, additionalData = {}) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { displayName, email } = user;
      const defaultRole = email?.includes('@admin') || email?.includes('@exec') ? 'executive' : 'teacher';
      
      try {
        await setDoc(userRef, {
          displayName,
          email,
          role: additionalData.role || defaultRole,
          school: additionalData.school || '',
          subject: additionalData.subject || '',
          createdAt: new Date(),
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user profile:', error);
      }
    }

    return userRef;
  };

  // Fetch user profile data
  const fetchUserProfile = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUserProfile(userSnap.data());
        return userSnap.data();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
    return null;
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserProfile(result.user);
      toast.success('Successfully signed in!');
      return result;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Failed to sign in with Google');
      throw error;
    }
  };

  // Sign in with email and password
  const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Successfully signed in!');
      return result;
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('Failed to sign in');
      throw error;
    }
  };

  // Sign up with email and password
  const signUpWithEmail = async (email, password, additionalData = {}) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await createUserProfile(result.user, additionalData);
      toast.success('Account created successfully!');
      return result;
    } catch (error) {
      console.error('Error signing up:', error);
      toast.error('Failed to create account');
      throw error;
    }
  };

  // Sign out
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  // Check if user has required role
  const hasRole = (requiredRole) => {
    if (!userProfile) return false;
    if (requiredRole === 'executive') {
      return userProfile.role === 'executive' || userProfile.role === 'admin';
    }
    return userProfile.role === requiredRole;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
    hasRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};