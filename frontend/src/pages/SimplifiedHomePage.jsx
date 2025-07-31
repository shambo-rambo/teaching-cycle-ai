import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Shield, ArrowRight } from 'lucide-react';

const SimplifiedHomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // If already logged in, redirect to appropriate dashboard
  useEffect(() => {
    if (user) {
      if (user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/simple-teacher');
      }
    }
  }, [user, navigate]);

  const handleLogin = (userType) => {
    navigate('/login', { state: { userType } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 rounded-full p-4">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Teaching Cycle AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conversational AI for creating structured lesson sequences using the Teaching and Learning Cycle framework
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Teacher Login */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Teacher Portal
              </h2>
              <p className="text-gray-600 mb-6">
                Create lesson plans through conversational AI guidance using the Teaching and Learning Cycle
              </p>
              <button
                onClick={() => handleLogin('teacher')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Access Teacher Portal</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Admin Login */}
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-gray-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                Admin Portal
              </h2>
              <p className="text-gray-600 mb-6">
                Manage users, departments, and system settings for the teaching platform
              </p>
              <button
                onClick={() => handleLogin('admin')}
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Access Admin Portal</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Powered by AI • Built for Educators
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimplifiedHomePage;