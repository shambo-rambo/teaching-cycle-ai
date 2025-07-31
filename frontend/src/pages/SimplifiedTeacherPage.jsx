import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ConversationalLessonPlanner from './ConversationalLessonPlanner';
import { LogOut } from 'lucide-react';

const SimplifiedTeacherPage = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header with Logout */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              Teaching Cycle AI
            </h1>
            <p className="text-sm text-gray-600">
              Welcome, {user?.displayName || user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Conversational Lesson Planner */}
      <div className="h-[calc(100vh-73px)]">
        <ConversationalLessonPlanner embedded={true} />
      </div>
    </div>
  );
};

export default SimplifiedTeacherPage;