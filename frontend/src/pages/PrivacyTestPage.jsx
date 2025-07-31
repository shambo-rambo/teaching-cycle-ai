import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Eye, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PrivacyTestPage = () => {
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [complianceReport, setComplianceReport] = useState(null);
  const { apiCall } = useAuth();

  const testStudents = [
    {
      studentId: 'test_student_1',
      firstName: 'John',
      lastName: 'Smith',
      studentNumber: 'STU2024001',
      email: 'john.smith@school.edu',
      yearLevel: 'DP1',
      learningSupport: {
        hasAccommodations: true,
        accommodations: ['Movement breaks', 'Visual organizers'],
        learningDifferences: ['ADHD'],
        supportLevel: 'high'
      },
      academicProfile: {
        programme: 'IB DP',
        languageProfile: {
          esl: false,
          firstLanguage: 'English'
        }
      }
    },
    {
      studentId: 'test_student_2',
      firstName: 'Maria',
      lastName: 'Garcia',
      studentNumber: 'STU2024002',
      email: 'maria.garcia@school.edu',
      yearLevel: 'DP1',
      learningSupport: {
        hasAccommodations: true,
        accommodations: ['Extended time', 'Vocabulary support'],
        learningDifferences: ['ESL'],
        supportLevel: 'medium'
      },
      academicProfile: {
        programme: 'IB DP',
        languageProfile: {
          esl: true,
          firstLanguage: 'Spanish'
        }
      }
    }
  ];

  const runPrivacyTest = async () => {
    setLoading(true);
    try {
      const response = await apiCall('http://localhost:3001/api/privacy/test-privacy-protection', {
        method: 'POST',
        body: JSON.stringify({ testStudents })
      });

      if (response.ok) {
        const data = await response.json();
        setTestResults(data);
      } else {
        const errorData = await response.json();
        setTestResults({
          success: false,
          error: errorData.error
        });
      }
    } catch (error) {
      setTestResults({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const getComplianceReport = async () => {
    try {
      const response = await apiCall('http://localhost:3001/api/privacy/compliance-report');

      if (response.ok) {
        const data = await response.json();
        setComplianceReport(data.complianceReport);
      }
    } catch (error) {
      console.error('Failed to get compliance report:', error);
    }
  };

  const validateData = async (data) => {
    try {
      const response = await apiCall('http://localhost:3001/api/privacy/validate-ai-data', {
        method: 'POST',
        body: JSON.stringify({ data })
      });

      if (response.ok) {
        const result = await response.json();
        return result.validation;
      }
    } catch (error) {
      console.error('Validation error:', error);
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center mb-4">
            <Shield className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Privacy Protection Test</h1>
              <p className="text-gray-600">Verify FERPA-compliant AI processing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={runPrivacyTest}
              disabled={loading}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              ) : (
                <Eye className="w-5 h-5 mr-2" />
              )}
              Test Privacy Protection
            </button>

            <button
              onClick={getComplianceReport}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Get Compliance Report
            </button>
          </div>

          {/* Test Results */}
          {testResults && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Protection Test Results</h3>
              
              {testResults.success ? (
                <div className="space-y-4">
                  {/* Privacy Status */}
                  <div className={`p-4 rounded-lg border ${
                    testResults.privacyProtectionWorking 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center">
                      {testResults.privacyProtectionWorking ? (
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                      )}
                      <span className={`font-medium ${
                        testResults.privacyProtectionWorking 
                          ? 'text-green-800' 
                          : 'text-red-800'
                      }`}>
                        Privacy Protection: {testResults.privacyProtectionWorking ? 'WORKING' : 'FAILED'}
                      </span>
                    </div>
                  </div>

                  {/* Test Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Original Student Data</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Students: {testResults.test.originalStudents}
                      </p>
                      <div className="text-xs bg-white p-2 rounded border">
                        <div>✓ Real names: John Smith, Maria Garcia</div>
                        <div>✓ Student numbers: STU2024001, STU2024002</div>
                        <div>✓ Email addresses included</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">AI-Safe Data</h4>
                      <div className="text-xs bg-white p-2 rounded border space-y-1">
                        {testResults.test.aiSafeData.map((student, index) => (
                          <div key={index}>
                            <div className="font-medium text-green-600">
                              {student.studentRef} (Anonymous ID)
                            </div>
                            <div className="text-gray-600">
                              Support: {student.learningSupport.learningDifferences.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Validation Results */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">PII Validation</h4>
                    <div className={`text-sm ${
                      testResults.test.validation.isValid 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {testResults.test.validation.isValid ? (
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          No PII detected in AI data
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center mb-1">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            PII Violations Found:
                          </div>
                          <ul className="list-disc list-inside text-xs">
                            {testResults.test.validation.violations.map((violation, index) => (
                              <li key={index}>{violation}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Response Mapping */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Response Mapping Test</h4>
                    <div className="text-sm text-gray-600">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="font-medium mb-1">AI Response (Anonymous):</div>
                          <div className="text-xs bg-white p-2 rounded border">
                            {Object.entries(testResults.test.mockAIResponse).map(([id, rec]) => (
                              <div key={id}>{id}: {rec.recommendation}</div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium mb-1">Mapped to Real Students:</div>
                          <div className="text-xs bg-white p-2 rounded border">
                            {Object.entries(testResults.test.mappedResponse).map(([id, rec]) => (
                              <div key={id}>Student {id.slice(-4)}: {rec.recommendation}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-red-800">Test Failed: {testResults.error}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Compliance Report */}
          {complianceReport && (
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Compliance Report</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">System Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Encryption:</span>
                      <span className={`font-medium ${
                        complianceReport.encryptionStatus === 'active' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {complianceReport.encryptionStatus}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Audit Entries:</span>
                      <span className="text-gray-600">{complianceReport.auditLogEntries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Sessions:</span>
                      <span className="text-gray-600">{complianceReport.activeSessions}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Compliance Features</h4>
                  <div className="space-y-1 text-sm">
                    {Object.entries(complianceReport.complianceFeatures).map(([feature, enabled]) => (
                      <div key={feature} className="flex items-center">
                        {enabled ? (
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                        )}
                        <span className="text-gray-700">
                          {feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Implementation Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Privacy Implementation Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">✅ Implemented Features:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Anonymous AI identifiers (Student_A7F9 format)</li>
                <li>• PII removal before AI processing</li>
                <li>• Consistent session-based mapping</li>
                <li>• Audit logging for compliance</li>
                <li>• Data validation for AI safety</li>
                <li>• Role-based decryption permissions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">🔒 Privacy Protections:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• No real names sent to AI</li>
                <li>• No student numbers sent to AI</li>
                <li>• No email addresses sent to AI</li>
                <li>• No family/contact information sent to AI</li>
                <li>• Learning support data preserved</li>
                <li>• Teacher receives named recommendations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyTestPage;