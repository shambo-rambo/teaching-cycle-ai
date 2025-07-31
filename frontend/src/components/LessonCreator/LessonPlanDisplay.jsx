import React, { useState } from 'react';
import { FileText, Download, Edit, Save, Copy, Eye, EyeOff } from 'lucide-react';

const LessonPlanDisplay = ({ lessonPlan, onEdit, onSave, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(lessonPlan?.content || '');
  const [showFullLesson, setShowFullLesson] = useState(true);

  const handleSave = () => {
    onSave({ ...lessonPlan, content: editedContent });
    setIsEditing(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(lessonPlan?.content || editedContent);
      alert('Lesson plan copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy to clipboard');
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([lessonPlan?.content || editedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${lessonPlan?.title || 'lesson-plan'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!lessonPlan) {
    return (
      <div className="text-center py-8">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600">No lesson plan available</h3>
        <p className="text-gray-500">Please generate a lesson plan first.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-amber-50 p-6 border-b border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-amber-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {lessonPlan.title}
              </h1>
              <p className="text-amber-700">
                {lessonPlan.subject} • {lessonPlan.duration} minutes • {lessonPlan.yearLevel}
              </p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
          >
            ← Back to Creator
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>{isEditing ? 'Preview' : 'Edit'}</span>
            </button>
            <button
              onClick={() => setShowFullLesson(!showFullLesson)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              {showFullLesson ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{showFullLesson ? 'Collapse' : 'Expand'}</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-3">
            {isEditing && (
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            )}
            <button
              onClick={handleCopy}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lesson Plan Content */}
      <div className="p-6">
        {isEditing ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Edit Lesson Plan</h3>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-96 p-4 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Edit your lesson plan content here..."
            />
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            {showFullLesson ? (
              <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                {lessonPlan.content}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Lesson Overview */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2">Lesson Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Topic:</span> {lessonPlan.topic}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> {lessonPlan.duration} minutes
                    </div>
                    <div>
                      <span className="font-medium">Year Level:</span> {lessonPlan.yearLevel}
                    </div>
                  </div>
                </div>

                {/* Learning Objectives */}
                {lessonPlan.objectives && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Learning Objectives</h3>
                    <ul className="list-disc list-inside text-blue-700 text-sm space-y-1">
                      {lessonPlan.objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Activities */}
                {lessonPlan.activities && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Key Activities</h3>
                    <ul className="list-disc list-inside text-green-700 text-sm space-y-1">
                      {lessonPlan.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => setShowFullLesson(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Complete Lesson Plan →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 p-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            Generated on {lessonPlan.createdAt || new Date().toLocaleDateString()}
          </div>
          <div>
            Word count: {(lessonPlan.content || '').split(/\s+/).length} words
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanDisplay;