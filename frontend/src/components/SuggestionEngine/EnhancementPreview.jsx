import React, { useState } from 'react';
import { X, Check, Eye, EyeOff, ArrowLeft, ArrowRight, FileText, BarChart3 } from 'lucide-react';

const EnhancementPreview = ({ preview, onConfirm, onCancel, loading }) => {
  const [selectedChanges, setSelectedChanges] = useState(
    preview.changes?.reduce((acc, change) => {
      acc[change.id] = true;
      return acc;
    }, {}) || {}
  );
  const [showComparison, setShowComparison] = useState(false);

  const handleChangeToggle = (changeId) => {
    setSelectedChanges(prev => ({
      ...prev,
      [changeId]: !prev[changeId]
    }));
  };

  const handleConfirm = () => {
    const selectedChangeIds = Object.keys(selectedChanges).filter(id => selectedChanges[id]);
    onConfirm({
      previewId: preview.previewId,
      lessonId: preview.lessonId,
      selectedChanges: selectedChangeIds,
      changes: preview.changes?.filter(change => selectedChanges[change.id]) || []
    });
  };

  const selectedCount = Object.values(selectedChanges).filter(Boolean).length;
  const totalChanges = preview.changes?.length || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Enhancement Preview</h2>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(90vh-12rem)]">
          {/* Left Panel - Changes List */}
          <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Proposed Changes</h3>
                <span className="text-sm text-gray-600">
                  {selectedCount} of {totalChanges} selected
                </span>
              </div>
              
              {preview.changes && preview.changes.length > 0 ? (
                <div className="space-y-3">
                  {preview.changes.map((change) => (
                    <div
                      key={change.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedChanges[change.id]
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleChangeToggle(change.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                            selectedChanges[change.id]
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedChanges[change.id] && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 mb-1">
                            {change.title}
                          </h4>
                          <p className="text-xs text-gray-600 mb-2">
                            {change.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              change.type === 'text_addition' ? 'bg-green-100 text-green-700' :
                              change.type === 'text_modification' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {change.type?.replace('_', ' ') || 'Enhancement'}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded ${
                              change.impact === 'high' ? 'bg-red-100 text-red-700' :
                              change.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {change.impact} impact
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No specific changes to preview
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 flex flex-col">
            {/* Preview Controls */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    {showComparison ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{showComparison ? 'Hide' : 'Show'} Comparison</span>
                  </button>
                </div>
                
                {preview.statistics && (
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="w-4 h-4" />
                      <span>
                        {preview.statistics.originalWordCount} → {preview.statistics.enhancedWordCount} words
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {showComparison ? (
                <div className="grid grid-cols-2 gap-4 h-full">
                  {/* Original */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Original
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg h-full">
                      <div className="whitespace-pre-wrap text-sm text-gray-700">
                        {preview.original || 'No original content available'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Enhanced
                    </h4>
                    <div className="bg-green-50 p-4 rounded-lg h-full">
                      <div className="whitespace-pre-wrap text-sm text-gray-700">
                        {preview.enhanced || 'No enhanced content available'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Enhanced Lesson</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="whitespace-pre-wrap text-sm text-gray-700">
                      {preview.enhanced || 'No enhanced content available'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedCount > 0 
                ? `${selectedCount} enhancement${selectedCount === 1 ? '' : 's'} selected`
                : 'No enhancements selected'
              }
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading || selectedCount === 0}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Applying...' : `Apply ${selectedCount} Enhancement${selectedCount === 1 ? '' : 's'}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancementPreview;