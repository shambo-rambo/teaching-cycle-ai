import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  FileText, 
  PlusCircle, 
  Clock,
  TrendingUp,
  Settings,
  LogOut,
  Play,
  History,
  Star,
  Calendar,
  CheckCircle
} from 'lucide-react';

const TeacherDashboard = ({ user, onLogout }) => {
  const [recentLessons, setRecentLessons] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load real frameworks from API
      const frameworksResponse = await fetch('http://localhost:3001/api/frameworks?forRole=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (frameworksResponse.ok) {
        const frameworksData = await frameworksResponse.json();
        setFrameworks(frameworksData.frameworks || []);
      }
      
      // Mock data for demonstration (lessons)
      setRecentLessons([
        {
          id: 'lesson_1',
          title: 'Rise of Nazi Germany',
          subject: 'IB History DP',
          createdAt: '2025-01-02',
          status: 'completed'
        },
        {
          id: 'lesson_2',
          title: 'Cold War Tensions',
          subject: 'IB History DP',
          createdAt: '2025-01-01',
          status: 'draft'
        }
      ]);

      setClasses([
        {
          id: 'class_1',
          name: 'IB History DP1',
          subject: 'IB History DP',
          yearLevel: 'DP1',
          studentCount: 24,
          currentTopic: 'Authoritarian States',
          nextClass: '2025-01-03 09:00'
        }
      ]);
    } catch (error) {
      console.error('Dashboard loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      id: 'create-lesson',
      title: 'Create New Lesson',
      description: 'Start creating a new lesson with AI assistance',
      icon: <PlusCircle className="w-6 h-6" />,
      action: () => navigate('/lesson-creator'),
      color: 'bg-blue-600 hover:bg-blue-700',
      featured: true
    },
    {
      id: 'analyze-lesson',
      title: 'Analyze Existing Lesson',
      description: 'Upload and analyze an existing lesson plan',
      icon: <FileText className="w-6 h-6" />,
      action: () => navigate('/lesson-analyzer'),
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'view-classes',
      title: 'View My Classes',
      description: 'Manage your class profiles and students',
      icon: <Users className="w-6 h-6" />,
      action: () => navigate('/classes'),
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 'browse-frameworks',
      title: 'Browse Frameworks',
      description: 'See school frameworks and guidelines',
      icon: <BookOpen className="w-6 h-6" />,
      action: () => navigate('/frameworks'),
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date().toLocaleDateString()}
              </div>
              
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className={`${action.color} text-white p-6 rounded-lg transition-colors ${
                  action.featured ? 'md:col-span-2 lg:col-span-2' : ''
                } hover:scale-105 transform transition-transform`}
              >
                <div className="flex items-center mb-3">
                  {action.icon}
                  {action.featured && <Star className="w-5 h-5 ml-2" />}
                </div>
                <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                <p className="text-white/90 text-sm">{action.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Recent Lessons & Classes */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Recent Lessons */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Lessons</h3>
                  <Link 
                    to="/lessons"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    View all →
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {recentLessons.length > 0 ? (
                  <div className="space-y-4">
                    {recentLessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                            <p className="text-sm text-gray-500">{lesson.subject}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            lesson.status === 'completed' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {lesson.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(lesson.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No lessons created yet</p>
                    <button
                      onClick={() => navigate('/lesson-creator')}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create Your First Lesson
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* My Classes */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">My Classes</h3>
                  <Link 
                    to="/classes"
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Manage classes →
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                {classes.length > 0 ? (
                  <div className="space-y-4">
                    {classes.map((classItem) => (
                      <div key={classItem.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{classItem.name}</h4>
                            <p className="text-sm text-gray-500">{classItem.subject} • {classItem.yearLevel}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Current topic: <span className="font-medium">{classItem.currentTopic}</span>
                            </p>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex items-center text-sm text-gray-500 mb-1">
                              <Users className="w-4 h-4 mr-1" />
                              {classItem.studentCount} students
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-4 h-4 mr-1" />
                              Next: {new Date(classItem.nextClass).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No classes set up yet</p>
                    <button
                      onClick={() => navigate('/classes/create')}
                      className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create Class Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Frameworks & Notifications */}
          <div className="space-y-6">
            
            {/* Active Frameworks */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">School Frameworks</h3>
                <p className="text-sm text-gray-500 mt-1">Guidelines for your lessons</p>
              </div>
              
              <div className="p-6">
                {frameworks.length > 0 ? (
                  <div className="space-y-4">
                    {frameworks.map((framework, index) => (
                      <div key={framework.id || `framework-${index}`} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900 text-sm">{framework.title}</h4>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(framework.priority)}`}>
                            {framework.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{framework.description}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {framework.type === 'teaching' ? 'Teaching & Learning' : 'Learning Support'}
                          </span>
                          {framework.mandatory && (
                            <span className="text-xs text-red-600 font-medium">Mandatory</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No frameworks assigned yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">This Week</h3>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <span className="text-gray-700">Lessons Created</span>
                  </div>
                  <span className="font-semibold text-gray-900">2</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-gray-700">Framework Compliance</span>
                  </div>
                  <span className="font-semibold text-green-600">95%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="text-gray-700">Avg. Prep Time</span>
                  </div>
                  <span className="font-semibold text-gray-900">15 min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;