import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import GoogleLoginButton from '../components/GoogleLoginButton';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, register, googleLogin } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = isLogin 
        ? await login(formData.email, formData.password)
        : await register({ 
            email: formData.email, 
            password: formData.password, 
            name: formData.name 
          });

      if (result.success) {
        console.log('Authentication successful, redirecting...');
        // Redirect based on role
        redirectBasedOnRole(result.user.role);
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('Network error. Please check if the server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectBasedOnRole = (role) => {
    switch (role) {
      case 'Admin':
        navigate('/admin');
        break;
      case 'HeadOfTeachingLearning':
        navigate('/executive/teaching-learning');
        break;
      case 'HeadOfLearningSupport':
        navigate('/executive/learning-support');
        break;
      case 'Teacher':
      default:
        navigate('/teacher');
        break;
    }
  };

  const handleGoogleSuccess = async (token) => {
    setIsLoading(true);
    setError('');

    try {
      const result = await googleLogin(token);
      if (result.success) {
        console.log('Google authentication successful:', result);
        redirectBasedOnRole(result.user.role);
      } else {
        setError(result.error || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = (error) => {
    console.error('Google login error:', error);
    setError(error || 'Google login failed. Please try again.');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      name: ''
    });
    setError('');
  };

  // Demo user credentials for testing
  const demoCredentials = [
    { role: 'Admin', email: 'admin@school.edu', password: 'admin123' },
    { role: 'Head of T&L', email: 'head.teaching@school.edu', password: 'password123' },
    { role: 'Head of Learning Support', email: 'head.support@school.edu', password: 'password123' },
    { role: 'Teacher', email: 'teacher.history@school.edu', password: 'password123' }
  ];

  const fillDemoCredentials = (email, password) => {
    setFormData(prev => ({ ...prev, email, password }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left side - Welcome content */}
        <div className="text-center lg:text-left">
          <div className="mb-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Welcome to
              <span className="block text-blue-600">School Intelligence</span>
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Transform your teaching with AI-powered lesson creation and school-wide 
              framework integration
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-2">For Teachers</h3>
              <p className="text-sm text-gray-600">Create lessons that automatically comply with school frameworks</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h3 className="font-semibold text-gray-800 mb-2">For Executives</h3>
              <p className="text-sm text-gray-600">Design frameworks that guide teaching across your school</p>
            </div>
          </div>

          {/* Demo credentials */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="font-semibold text-yellow-800 mb-2">Demo Accounts (Click to use):</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => fillDemoCredentials(cred.email, cred.password)}
                  className="text-left p-2 bg-white rounded border hover:bg-yellow-50 transition-colors"
                >
                  <div className="font-medium text-yellow-800">{cred.role}</div>
                  <div className="text-yellow-600 text-xs">{cred.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Auth form */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                {isLogin ? (
                  <LogIn className="w-8 h-8 text-blue-600" />
                ) : (
                  <UserPlus className="w-8 h-8 text-blue-600" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600 mt-2">
                {isLogin 
                  ? 'Sign in to access your dashboard' 
                  : 'Register to start using School Intelligence'
                }
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {!isLogin && (
                  <p className="text-xs text-gray-500 mt-1">
                    Password must be at least 6 characters long
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            {/* Google OAuth Login */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-6">
                <GoogleLoginButton
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text={isLogin ? "Sign in with Google" : "Sign up with Google"}
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={toggleMode}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"
                }
              </button>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <Link 
                  to="/"
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  ← Back to Lesson Creator
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;