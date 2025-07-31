import { useState, useEffect } from 'react';
import { Building2, Users, BookOpen, Plus, Settings, UserCheck, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DepartmentManagementPage = () => {
  const [departments, setDepartments] = useState([]);
  const [users, setUsers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({
    departmentName: '',
    description: '',
    templateName: ''
  });
  const [newSubject, setNewSubject] = useState({
    subjectName: '',
    curriculum: 'IB_DP',
    yearLevels: ['DP1', 'DP2'],
    description: ''
  });

  const { user, apiCall } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadDepartments(),
        loadUsers(),
        loadTemplates()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDepartments = async () => {
    try {
      const response = await apiCall('http://localhost:3001/api/departments/with-staff');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data.departments || []);
      }
    } catch (error) {
      console.error('Error loading departments:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await apiCall('http://localhost:3001/api/auth/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      const response = await apiCall('http://localhost:3001/api/departments/templates/ib');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const createDepartment = async (e) => {
    e.preventDefault();
    try {
      const response = await apiCall('http://localhost:3001/api/departments', {
        method: 'POST',
        body: JSON.stringify(newDepartment)
      });

      if (response.ok) {
        setShowCreateForm(false);
        setNewDepartment({ departmentName: '', description: '', templateName: '' });
        await loadDepartments();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create department');
      }
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Error creating department');
    }
  };

  const createIBDepartments = async () => {
    if (!confirm('This will create all standard IB departments. Continue?')) {
      return;
    }

    try {
      const response = await apiCall('http://localhost:3001/api/departments/create-ib-departments', {
        method: 'POST',
        body: JSON.stringify({ schoolId: 'school_default' })
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Created ${data.created} departments successfully`);
        await loadDepartments();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create IB departments');
      }
    } catch (error) {
      console.error('Error creating IB departments:', error);
      alert('Error creating IB departments');
    }
  };

  const assignDepartmentHead = async (departmentId, userId) => {
    try {
      const response = await apiCall(`http://localhost:3001/api/departments/${departmentId}/assign-head`, {
        method: 'POST',
        body: JSON.stringify({ userId })
      });

      if (response.ok) {
        await loadDepartments();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to assign department head');
      }
    } catch (error) {
      console.error('Error assigning department head:', error);
      alert('Error assigning department head');
    }
  };

  const addSubject = async (e) => {
    e.preventDefault();
    try {
      const response = await apiCall(`http://localhost:3001/api/departments/${selectedDepartment.departmentId}/subjects`, {
        method: 'POST',
        body: JSON.stringify(newSubject)
      });

      if (response.ok) {
        setShowSubjectForm(false);
        setNewSubject({ subjectName: '', curriculum: 'IB_DP', yearLevels: ['DP1', 'DP2'], description: '' });
        await loadDepartments();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to add subject');
      }
    } catch (error) {
      console.error('Error adding subject:', error);
      alert('Error adding subject');
    }
  };

  const removeSubject = async (departmentId, subjectId) => {
    if (!confirm('Are you sure you want to remove this subject?')) {
      return;
    }

    try {
      const response = await apiCall(`http://localhost:3001/api/departments/${departmentId}/subjects/${subjectId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadDepartments();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to remove subject');
      }
    } catch (error) {
      console.error('Error removing subject:', error);
      alert('Error removing subject');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
                <p className="text-gray-600">Organize subjects and assign department heads</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Department
              </button>
              <button
                onClick={createIBDepartments}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Create All IB Departments
              </button>
            </div>
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {departments.map((department) => (
            <div key={department.departmentId} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{department.departmentName}</h3>
                  <p className="text-sm text-gray-600">{department.description}</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedDepartment(department);
                    setShowSubjectForm(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Department Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-blue-900">{department.subjectCount}</div>
                  <div className="text-xs text-blue-600">Subjects</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-green-900">{department.staffCount}</div>
                  <div className="text-xs text-green-600">Staff</div>
                </div>
              </div>

              {/* Department Head */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Head</label>
                {department.headOfDepartmentId ? (
                  <div className="flex items-center text-sm text-gray-600">
                    <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                    {users.find(u => u.userId === department.headOfDepartmentId)?.name || 'Unknown User'}
                  </div>
                ) : (
                  <select
                    onChange={(e) => assignDepartmentHead(department.departmentId, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value=""
                  >
                    <option value="">Select Department Head</option>
                    {users.filter(u => u.role !== 'Teacher' || u.role === 'Teacher').map(user => (
                      <option key={user.userId} value={user.userId}>
                        {user.name} ({user.role})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Subjects List */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Subjects ({department.subjects.length})</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {department.subjects.map((subject) => (
                    <div key={subject.subjectId} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{subject.subjectName}</span>
                      <button
                        onClick={() => removeSubject(department.departmentId, subject.subjectId)}
                        className="text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {departments.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Departments Created</h3>
            <p className="text-gray-600 mb-4">Create your first department or use IB templates</p>
            <button
              onClick={createIBDepartments}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create Standard IB Departments
            </button>
          </div>
        )}
      </div>

      {/* Create Department Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Department</h3>
              <form onSubmit={createDepartment}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
                  <input
                    type="text"
                    value={newDepartment.departmentName}
                    onChange={(e) => setNewDepartment({ ...newDepartment, departmentName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="3"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Template (Optional)</label>
                  <select
                    value={newDepartment.templateName}
                    onChange={(e) => setNewDepartment({ ...newDepartment, templateName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Custom Department</option>
                    {templates.map((template) => (
                      <option key={template.templateName} value={template.templateName}>
                        {template.departmentName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Subject Modal */}
      {showSubjectForm && selectedDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Add Subject to {selectedDepartment.departmentName}
              </h3>
              <form onSubmit={addSubject}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                  <input
                    type="text"
                    value={newSubject.subjectName}
                    onChange={(e) => setNewSubject({ ...newSubject, subjectName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Curriculum</label>
                  <select
                    value={newSubject.curriculum}
                    onChange={(e) => setNewSubject({ ...newSubject, curriculum: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="IB_DP">IB Diploma Programme</option>
                    <option value="IB_MYP">IB Middle Years Programme</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newSubject.description}
                    onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="2"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowSubjectForm(false);
                      setSelectedDepartment(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add Subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagementPage;