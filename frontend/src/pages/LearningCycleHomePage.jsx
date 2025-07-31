import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { BookOpen, Users, Target, Lightbulb, ArrowRight } from 'lucide-react';

const LearningCycleHomePage = () => {
  const navigate = useNavigate();
  const { user, googleLogin } = useAuth();

  // Optional: If already logged in, show different content but don't auto-redirect
  // useEffect(() => {
  //   if (user) {
  //     if (user.role === 'Admin') {
  //       navigate('/admin');
  //     } else {
  //       navigate('/teacher');
  //     }
  //   }
  // }, [user, navigate]);

  const handleGoogleSuccess = async (token) => {
    try {
      const result = await googleLogin(token);
      if (result.success) {
        // Redirect will happen automatically via useEffect above
        console.log('Google authentication successful');
      }
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google login failed:', error);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-900">Teaching Cycle AI</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Teaching with the 
            <span className="text-blue-600"> Learning Cycle</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            An AI-powered conversational assistant that helps teachers create structured lesson sequences 
            using the proven Teaching and Learning Cycle framework.
          </p>
        </div>

        {/* Learning Cycle Explanation */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left Column - What is the Learning Cycle */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              What is the Teaching & Learning Cycle?
            </h2>
            <p className="text-gray-600 mb-6">
              The Teaching and Learning Cycle is a research-based framework that builds students' 
              academic stamina through scaffolded writing instruction across five progressive stages.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Building Knowledge of the Field</h3>
                  <p className="text-gray-600 text-sm">Students explore the topic and genre through multimedia and discussion</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Supported Reading</h3>
                  <p className="text-gray-600 text-sm">Analyzing model texts and building vocabulary together</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Learning About the Genre</h3>
                  <p className="text-gray-600 text-sm">Understanding text structure and language features</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Supported Writing</h3>
                  <p className="text-gray-600 text-sm">Joint construction and guided practice with teacher support</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">5</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Independent Writing</h3>
                  <p className="text-gray-600 text-sm">Students write independently with learned skills and confidence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - How Our AI Helps */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              How Our AI Assistant Helps
            </h2>
            <p className="text-gray-600 mb-6">
              Through natural conversation, our AI guides you to create customized lesson sequences 
              that perfectly fit your teaching context and student needs.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Natural Conversation</h3>
                  <p className="text-gray-600 text-sm">
                    Simply tell the AI about your subject, students, and goals. It asks intelligent 
                    follow-up questions to understand your teaching context.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Customized Lesson Plans</h3>
                  <p className="text-gray-600 text-sm">
                    Generates detailed lesson sequences tailored to your year level, lesson length, 
                    topic, and student writing goals.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Lightbulb className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Expert Pedagogical Guidance</h3>
                  <p className="text-gray-600 text-sm">
                    Built-in knowledge of best practices, differentiation strategies, and 
                    subject-specific writing genres across all curriculum areas.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Saved Conversations</h3>
                  <p className="text-gray-600 text-sm">
                    Pause and resume lesson planning conversations anytime. All your work is 
                    automatically saved and accessible whenever you return.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login/Dashboard Section */}
        {user ? (
          // Show dashboard options for logged-in users
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user.displayName || user.name}!
              </h2>
              <p className="text-gray-600">
                Ready to continue your lesson planning journey?
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/lesson-planner')}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Start New Lesson Planning
              </button>
              
              <button
                onClick={() => navigate('/framework-learning')}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Learn about the Framework
              </button>
              
              {user.role === 'Admin' && (
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Admin Dashboard
                </button>
              )}
            </div>
          </div>
        ) : (
          // Show login for non-authenticated users
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Get Started Today
              </h2>
              <p className="text-gray-600">
                Sign in with your Google account to begin creating amazing lessons with AI guidance
              </p>
            </div>
            
            <GoogleLoginButton
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="Continue with Google"
            />

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                By continuing, you agree to our terms of service and privacy policy
              </p>
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Perfect for Every Teacher
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Cross-Curricular</h3>
              <p className="text-gray-600 text-sm">
                Works across all subjects - History, English, Science, Geography, and more
              </p>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">All Year Levels</h3>
              <p className="text-gray-600 text-sm">
                Adapts content and complexity for any grade level from primary to senior years
              </p>
            </div>
            
            <div className="p-6">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Differentiated</h3>
              <p className="text-gray-600 text-sm">
                Includes scaffolding strategies for diverse learners and mixed-ability classes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 Teaching Cycle AI. Empowering educators with intelligent lesson planning.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningCycleHomePage;