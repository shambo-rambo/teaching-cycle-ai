import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LessonAnalysisPage from './pages/LessonAnalysisPage';
import LessonCreatorPage from './pages/LessonCreatorPage';
import ConversationalLessonPlanner from './pages/ConversationalLessonPlanner';
import FrameworkLearningPage from './pages/FrameworkLearningPage';
import SimplifiedHomePage from './pages/SimplifiedHomePage';
import LearningCycleHomePage from './pages/LearningCycleHomePage';
import SimplifiedTeacherPage from './pages/SimplifiedTeacherPage';
import TeacherLandingPage from './pages/TeacherLandingPage';
import ConversationsPage from './pages/ConversationsPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import HeadOfTeachingDashboard from './pages/HeadOfTeachingDashboard';
import HeadOfLearningSupportDashboard from './pages/HeadOfLearningSupportDashboard';
import DepartmentManagementPage from './pages/DepartmentManagementPage';
import Navigation from './components/Navigation/Navigation';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, hasAnyRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !hasAnyRole(allowedRoles)) {
    return <Navigate to="/teacher" replace />;
  }

  return children;
};

// Dashboard Router Component
const DashboardRouter = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  switch (user.role) {
    case 'Admin':
      return <AdminDashboard user={user} onLogout={logout} />;
    case 'HeadOfTeachingLearning':
      return <HeadOfTeachingDashboard />;
    case 'HeadOfLearningSupport':
      return <HeadOfLearningSupportDashboard />;
    case 'Teacher':
    default:
      return <TeacherDashboard user={user} onLogout={logout} />;
  }
};

// App Routes Component
const AppRoutes = () => {
  const { user, logout } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={
        user ? <Navigate to="/teacher" replace /> : <LoginPage />
      } />
      
      {/* Protected routes */}
      {/* Temporarily disabled dashboard - redirect to teacher landing page */}
      <Route path="/dashboard" element={<Navigate to="/teacher" replace />} />
      
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <AdminDashboard user={user} onLogout={logout} />
        </ProtectedRoute>
      } />
      
      {/* Legacy teacher dashboard */}
      <Route path="/legacy-teacher" element={
        <ProtectedRoute allowedRoles={['Teacher', 'HeadOfTeachingLearning', 'HeadOfLearningSupport', 'Admin']}>
          <TeacherDashboard user={user} onLogout={logout} />
        </ProtectedRoute>
      } />
      
      {/* New teacher landing page */}
      <Route path="/teacher" element={
        <ProtectedRoute allowedRoles={['Teacher', 'HeadOfTeachingLearning', 'HeadOfLearningSupport', 'Admin']}>
          <TeacherLandingPage />
        </ProtectedRoute>
      } />
      
      {/* Conversations page */}
      <Route path="/conversations" element={
        <ProtectedRoute allowedRoles={['Teacher', 'HeadOfTeachingLearning', 'HeadOfLearningSupport', 'Admin']}>
          <ConversationsPage />
        </ProtectedRoute>
      } />
      
      {/* Legacy simplified teacher route */}
      <Route path="/legacy-simple-teacher" element={
        <ProtectedRoute allowedRoles={['Teacher', 'HeadOfTeachingLearning', 'HeadOfLearningSupport', 'Admin']}>
          <SimplifiedTeacherPage />
        </ProtectedRoute>
      } />

      <Route path="/departments" element={
        <ProtectedRoute allowedRoles={['Admin']}>
          <DepartmentManagementPage />
        </ProtectedRoute>
      } />

      {/* New Learning Cycle homepage */}
      <Route path="/" element={<LearningCycleHomePage />} />
      
      {/* Legacy simplified homepage */}
      <Route path="/legacy-simple-home" element={<SimplifiedHomePage />} />
      
      {/* New simplified teacher page */}
      <Route path="/simple-teacher" element={
        <ProtectedRoute>
          <SimplifiedTeacherPage />
        </ProtectedRoute>
      } />
      
      {/* Standalone conversational lesson planner */}
      <Route path="/lesson-planner" element={
        <ProtectedRoute>
          <ConversationalLessonPlanner />
        </ProtectedRoute>
      } />
      
      {/* Framework learning chatbot */}
      <Route path="/framework-learning" element={
        <ProtectedRoute>
          <FrameworkLearningPage />
        </ProtectedRoute>
      } />
      
      {/* Legacy lesson analyzer route */}
      <Route path="/legacy-analyzer" element={
        <ProtectedRoute>
          <div className="App">
            <Navigation />
            <LessonAnalysisPage />
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/legacy-creator" element={
        <ProtectedRoute>
          <div className="App">
            <Navigation />
            <LessonCreatorPage />
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/lesson-creator" element={<Navigate to="/" replace />} />
      <Route path="/lesson-analyzer" element={<Navigate to="/" replace />} />
      
      <Route path="/creator" element={<Navigate to="/lesson-creator" replace />} />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  // Use global config instead of environment variables
  const clientId = window.APP_CONFIG?.GOOGLE_CLIENT_ID || '531124404080-uk3pq4aajr0p4u7vifuer18ab2cuol1p.apps.googleusercontent.com';
  
  console.log('🚀 FINAL FIX - Using global config clientId:', clientId);
  console.log('Global config loaded:', !!window.APP_CONFIG);
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;// Force rebuild Thu Jul 31 15:50:56 AEST 2025
