import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  FileText, 
  PlusCircle, 
  TrendingUp,
  LogOut,
  Shield,
  UserCheck,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  Upload,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HeadOfLearningSupportDashboard = () => {
  const [frameworks, setFrameworks] = useState([]);
  const [students, setStudents] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const navigate = useNavigate();
  const { user, logout, apiCall } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [frameworksResponse, studentsResponse, statsResponse] = await Promise.all([
        apiCall('http://localhost:3001/api/frameworks?type=support'),
        apiCall('http://localhost:3001/api/students/support'),
        apiCall('http://localhost:3001/api/students/statistics')
      ]);

      if (frameworksResponse.ok) {
        const frameworksData = await frameworksResponse.json();
        setFrameworks(frameworksData.frameworks || []);
      }

      if (studentsResponse.ok) {
        const studentsData = await studentsResponse.json();
        setStudents(studentsData.students || []);
      }

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStatistics(statsData.statistics);
      }
    } catch (error) {
      console.error('Dashboard loading error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createFramework = () => {
    navigate('/frameworks/create?type=support');
  };

  const editFramework = (frameworkId) => {
    navigate(`/frameworks/${frameworkId}/edit`);
  };

  const activateFramework = async (frameworkId) => {
    try {
      const response = await apiCall(`http://localhost:3001/api/frameworks/${frameworkId}/activate`, {
        method: 'POST'
      });

      if (response.ok) {
        loadDashboardData();
      }
    } catch (error) {
      console.error('Activate framework error:', error);
    }
  };

  const archiveFramework = async (frameworkId) => {
    try {
      const response = await apiCall(`http://localhost:3001/api/frameworks/${frameworkId}/archive`, {
        method: 'POST'
      });

      if (response.ok) {
        loadDashboardData();
      }
    } catch (error) {
      console.error('Archive framework error:', error);
    }
  };

  const importStudents = () => {
    navigate('/students/import');
  };

  const filteredFrameworks = frameworks.filter(framework => {
    const matchesSearch = framework.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         framework.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || framework.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredStudents = students.filter(student => {
    return student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           student.studentNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      archived: 'bg-orange-100 text-orange-800',
      suspended: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSupportLevelColor = (level) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
      none: 'bg-gray-100 text-gray-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
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
              <Heart className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Learning Support Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={importStudents}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Students
              </button>

              <button
                onClick={createFramework}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Framework
              </button>
              
              <button
                onClick={logout}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'students', label: 'Student Support', icon: Users },
                { id: 'frameworks', label: 'Support Frameworks', icon: Shield },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Statistics Cards */}
            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                      <p className="text-gray-600">Support Students</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <UserCheck className="w-8 h-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {statistics.supportStats?.withAccommodations || 0}
                      </p>
                      <p className="text-gray-600">With Accommodations</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <Shield className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{frameworks.length}</p>
                      <p className="text-gray-600">Support Frameworks</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center">
                    <AlertTriangle className="w-8 h-8 text-orange-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {(statistics.supportStats?.byLevel?.high || 0) + (statistics.supportStats?.byLevel?.medium || 0)}
                      </p>
                      <p className="text-gray-600">High/Medium Support</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={importStudents}
                  className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Upload className="w-6 h-6 text-green-600 mr-3" />
                  <div className="text-left">
                    <div className="font-medium text-green-900">Import Students</div>
                    <div className="text-sm text-green-600">Upload student data via CSV</div>
                  </div>
                </button>

                <button
                  onClick={createFramework}
                  className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <PlusCircle className="w-6 h-6 text-blue-600 mr-3" />
                  <div className="text-left">
                    <div className="font-medium text-blue-900">Create Framework</div>
                    <div className="text-sm text-blue-600">Design support guidelines</div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('students')}
                  className="flex items-center p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Users className="w-6 h-6 text-purple-600 mr-3" />
                  <div className="text-left">
                    <div className="font-medium text-purple-900">Review Students</div>
                    <div className="text-sm text-purple-600">Manage support profiles</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Students Needing Attention */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Students Needing Attention</h3>
              <div className="space-y-3">
                {students.filter(s => s.learningSupport.supportLevel === 'high').slice(0, 5).map((student) => (
                  <div key={student.studentId} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{student.firstName} {student.lastName}</div>
                        <div className="text-sm text-gray-500">
                          {student.yearLevel} • {student.learningSupport.learningDifferences.join(', ')}
                        </div>
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      High Support
                    </span>
                  </div>
                ))}
                
                {students.filter(s => s.learningSupport.supportLevel === 'high').length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    All high-support students are up to date
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Students List */}
            <div className="space-y-4">
              {filteredStudents.map((student) => (
                <div key={student.studentId} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">
                          {student.firstName} {student.lastName}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          {student.studentNumber}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ml-2 ${getSupportLevelColor(student.learningSupport.supportLevel)}`}>
                          {student.learningSupport.supportLevel} support
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <strong>Year Level:</strong> {student.yearLevel}
                        </div>
                        <div>
                          <strong>Programme:</strong> {student.academicProfile.programme}
                        </div>
                        <div>
                          <strong>ESL:</strong> {student.academicProfile.languageProfile.esl ? 'Yes' : 'No'}
                        </div>
                      </div>

                      {student.learningSupport.learningDifferences.length > 0 && (
                        <div className="mt-3">
                          <strong className="text-sm text-gray-700">Learning Differences:</strong>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {student.learningSupport.learningDifferences.map((diff, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                                {diff}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {student.learningSupport.accommodations.length > 0 && (
                        <div className="mt-3">
                          <strong className="text-sm text-gray-700">Accommodations:</strong>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {student.learningSupport.accommodations.map((acc, index) => (
                              <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                                {acc}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-200">
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredStudents.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm 
                      ? 'Try adjusting your search criteria'
                      : 'Import student data to get started'
                    }
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={importStudents}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Import Students
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Frameworks Tab */}
        {activeTab === 'frameworks' && (
          <div className="space-y-6">
            
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search frameworks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Filter className="w-4 h-4 text-gray-400 mr-2" />
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Frameworks List */}
            <div className="space-y-4">
              {filteredFrameworks.map((framework) => (
                <div key={framework.frameworkId} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 mr-3">{framework.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(framework.status)}`}>
                          {framework.status}
                        </span>
                        {framework.mandatory && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 ml-2">
                            Mandatory
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{framework.description}</p>
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {framework.requirements.length} requirements
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {framework.scope.schoolWide ? 'School-wide' : 'Targeted scope'}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          Updated {new Date(framework.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => editFramework(framework.frameworkId)}
                        className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-200"
                      >
                        Edit
                      </button>
                      
                      {framework.status === 'draft' && (
                        <button
                          onClick={() => activateFramework(framework.frameworkId)}
                          className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded border border-green-200"
                        >
                          Activate
                        </button>
                      )}
                      
                      {framework.status === 'active' && (
                        <button
                          onClick={() => archiveFramework(framework.frameworkId)}
                          className="px-3 py-1 text-sm text-orange-600 hover:bg-orange-50 rounded border border-orange-200"
                        >
                          Archive
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredFrameworks.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No frameworks found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || selectedFilter !== 'all' 
                      ? 'Try adjusting your search or filter criteria'
                      : 'Create your first support framework to get started'
                    }
                  </p>
                  {!searchTerm && selectedFilter === 'all' && (
                    <button
                      onClick={createFramework}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      Create Framework
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Analytics</h3>
              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Analytics Coming Soon</h4>
                <p className="text-gray-500">
                  Detailed support tracking and student progress analytics will be available in the next release.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadOfLearningSupportDashboard;