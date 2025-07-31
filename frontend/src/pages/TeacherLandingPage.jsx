import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Plus, 
  History, 
  MessageSquare, 
  Clock, 
  BookOpen, 
  LogOut,
  Play,
  Calendar,
  Users,
  FileText
} from 'lucide-react';

const TeacherLandingPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [recentConversations, setRecentConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentConversations();
  }, []);

  const loadRecentConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/conversation/my-conversations?limit=5', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setRecentConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewConversation = () => {
    navigate('/lesson-planner');
  };

  const handleViewAllConversations = () => {
    navigate('/conversations');
  };

  const handleResumeConversation = (conversationId) => {
    navigate(`/lesson-planner?conversation=${conversationId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (timestamp) => {
    if (timestamp?.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const getSubjectIcon = (subject) => {
    switch (subject?.toLowerCase()) {
      case 'history': return '📚';
      case 'english': return '✍️';
      case 'science': return '🔬';
      case 'mathematics': return '🔢';
      case 'geography': return '🌍';
      default: return '📖';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">Teaching Cycle AI</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome back, <span className="font-medium">{user?.displayName || user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ready to Create Amazing Lessons?
          </h1>
          <p className="text-gray-600">
            Use our AI assistant to build structured lesson sequences with the Teaching and Learning Cycle framework.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Start New Conversation */}
          <div 
            onClick={handleStartNewConversation}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                <Plus className="h-8 w-8" />
              </div>
              <Play className="h-6 w-6 opacity-80" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Start New Lesson Plan</h2>
            <p className="text-blue-100 mb-4">
              Begin a conversation with our AI to create a customized lesson sequence for your subject and students.
            </p>
            <div className="flex items-center text-sm font-medium">
              <span>Get Started</span>
              <Play className="h-4 w-4 ml-2" />
            </div>
          </div>

          {/* View Conversation History */}
          <div 
            onClick={handleViewAllConversations}
            className="bg-white rounded-xl p-8 border border-gray-200 cursor-pointer hover:border-gray-300 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-gray-100 rounded-full p-3">
                <History className="h-8 w-8 text-gray-600" />
              </div>
              <span className="text-2xl font-bold text-gray-400">
                {recentConversations.length}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Conversation History</h2>
            <p className="text-gray-600 mb-4">
              Review, resume, or revisit your previous lesson planning conversations and generated content.
            </p>
            <div className="flex items-center text-sm font-medium text-blue-600">
              <span>View All Conversations</span>
              <History className="h-4 w-4 ml-2" />
            </div>
          </div>
        </div>

        {/* Recent Conversations */}
        {!loading && recentConversations.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Conversations</h2>
              <button
                onClick={handleViewAllConversations}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => handleResumeConversation(conversation.id)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {getSubjectIcon(conversation.metadata?.subject)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {conversation.metadata?.subject || 'General'} - {conversation.metadata?.topic || 'New Lesson Plan'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        {conversation.metadata?.yearLevel && (
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Year {conversation.metadata.yearLevel}
                          </span>
                        )}
                        <span className="flex items-center">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          {conversation.messageCount} messages
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(conversation.lastActivity)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      conversation.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {conversation.status}
                    </div>
                    <Play className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Getting Started Tips */}
        {recentConversations.length === 0 && !loading && (
          <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">
              Getting Started with Teaching Cycle AI
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Natural Conversation</h3>
                  <p className="text-blue-700 text-sm">
                    Simply tell our AI about your subject, year level, and topic. It will ask intelligent follow-up questions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Custom Lesson Plans</h3>
                  <p className="text-blue-700 text-sm">
                    Get detailed lesson sequences tailored to your students' needs and learning goals.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 rounded-full p-2 flex-shrink-0">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-blue-900 mb-1">Save & Resume</h3>
                  <p className="text-blue-700 text-sm">
                    All conversations are automatically saved. Resume lesson planning anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading your conversations...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherLandingPage;