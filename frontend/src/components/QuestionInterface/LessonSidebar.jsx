import React, { useState } from 'react';
import { FileText, Edit3, Save, X } from 'lucide-react';

const LessonSidebar = ({ lessonContent, currentQuestion, onLessonUpdate, isVisible }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(lessonContent || '');

  const handleSave = () => {
    onLessonUpdate(editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(lessonContent || '');
    setIsEditing(false);
  };

  if (!isVisible) return null;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-gray-600" />
            <h3 className="font-semibold text-gray-800">Lesson Content</h3>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {currentQuestion && (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <h4 className="text-sm font-semibold text-blue-800 mb-1">Current Question Focus</h4>
          <p className="text-xs text-blue-700">
            {currentQuestion.framework}: {currentQuestion.element}
          </p>
        </div>
      )}

      <div className="flex-1 p-4 overflow-y-auto">
        {isEditing ? (
          <div className="h-full flex flex-col">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="flex-1 w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your lesson content here..."
            />
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleSave}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="prose prose-sm max-w-none">
            {lessonContent ? (
              <div className="whitespace-pre-wrap text-gray-700">
                {lessonContent}
              </div>
            ) : (
              <div className="text-gray-500 italic">
                No lesson content available. Click the edit button to add content.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-200 bg-white">
        <p className="text-xs text-gray-600">
          Reference your lesson content while answering questions. You can edit it here if needed.
        </p>
      </div>
    </div>
  );
};

export default LessonSidebar;