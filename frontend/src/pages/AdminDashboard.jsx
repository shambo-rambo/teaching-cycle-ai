import { useState, useEffect } from 'react';
import { 
  Users, 
  Shield, 
  TrendingUp, 
  Settings, 
  Crown,
  UserCheck,
  AlertCircle,
  LogOut,
  Plus,
  Search,
  Building2
} from 'lucide-react';

const AdminDashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Load users and stats in parallel
      const [usersResponse, statsResponse] = await Promise.all([
        fetch('http://localhost:3001/api/auth/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('http://localhost:3001/api/auth/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const usersData = await usersResponse.json();
      const statsData = await statsResponse.json();

      if (usersData.success) {
        setUsers(usersData.users);
      }

      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Dashboard loading error:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/auth/users/${userId}/promote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await response.json();

      if (data.success) {
        // Update users list
        setUsers(prev => 
          prev.map(u => 
            u.userId === userId 
              ? { ...u, role: newRole, permissions: data.user.permissions }
              : u
          )
        );
        
        // Refresh stats
        loadDashboardData();
        alert(`User promoted to ${newRole} successfully!`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Promotion error:', error);
      alert('Failed to promote user');
    }
  };

  const createTestUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/auth/dev/create-test-users', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        loadDashboardData();
        alert('Test users created successfully!');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Test users creation error:', error);
      alert('Failed to create test users');
    }
  };

  const recreateDemoUsers = async () => {
    if (!confirm('This will recreate all demo users with fresh credentials. Continue?')) {
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/dev/recreate-demo-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`Demo users recreated successfully!\n\n${data.users.map(u => `${u.email} (${u.role})`).join('\n')}`);
        loadDashboardData(); // Reload to show updated users
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Recreate demo users error:', error);
      alert('Failed to recreate demo users');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    const colors = {
      Admin: 'bg-red-100 text-red-800',
      HeadOfTeachingLearning: 'bg-purple-100 text-purple-800',
      HeadOfLearningSupport: 'bg-blue-100 text-blue-800',
      Teacher: 'bg-green-100 text-green-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin': return <Crown className="w-4 h-4" />;
      case 'HeadOfTeachingLearning': return <Shield className="w-4 h-4" />;
      case 'HeadOfLearningSupport': return <UserCheck className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
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
              <Crown className="w-8 h-8 text-red-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="/departments"
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Manage Departments
              </a>
              
              <button
                onClick={recreateDemoUsers}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Fix Demo Users
              </button>
              
              <button
                onClick={createTestUsers}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Test Users
              </button>
              
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
        {error && (
          <div className="mb-6 flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-gray-600">Total Users</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <UserCheck className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                  <p className="text-gray-600">Active Users</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <Shield className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {(stats.byRole.HeadOfTeachingLearning || 0) + (stats.byRole.HeadOfLearningSupport || 0)}
                  </p>
                  <p className="text-gray-600">Executives</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.recentLogins}</p>
                  <p className="text-gray-600">Recent Logins</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 sm:mb-0">User Management</h2>
              
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Role Filter */}
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="HeadOfTeachingLearning">Head of T&L</option>
                  <option value="HeadOfLearningSupport">Head of Learning Support</option>
                  <option value="Teacher">Teacher</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((userItem) => (
                  <tr key={userItem.userId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                        <div className="text-sm text-gray-500">{userItem.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(userItem.role)}`}>
                        {getRoleIcon(userItem.role)}
                        <span className="ml-1">{userItem.role.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userItem.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {userItem.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userItem.lastLogin 
                        ? new Date(userItem.lastLogin).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {userItem.role === 'Teacher' && (
                        <>
                          <button
                            onClick={() => promoteUser(userItem.userId, 'HeadOfTeachingLearning')}
                            className="text-purple-600 hover:text-purple-900 font-medium"
                          >
                            → Head of T&L
                          </button>
                          <button
                            onClick={() => promoteUser(userItem.userId, 'HeadOfLearningSupport')}
                            className="text-blue-600 hover:text-blue-900 font-medium"
                          >
                            → Head of Support
                          </button>
                        </>
                      )}
                      {userItem.role !== 'Admin' && userItem.role !== 'Teacher' && (
                        <button
                          onClick={() => promoteUser(userItem.userId, 'Teacher')}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          → Teacher
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No users found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;