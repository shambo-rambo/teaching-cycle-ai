import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw, Loader } from 'lucide-react';
import SuggestionCard from './SuggestionCard';
import EnhancementPreview from './EnhancementPreview';

const SuggestionEngine = ({ lessonAnalysis, teacherResponses }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState({});
  const [enhancementPreview, setEnhancementPreview] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (lessonAnalysis) {
      generateSuggestions();
    }
  }, [lessonAnalysis, teacherResponses]);

  const generateSuggestions = async () => {
    if (!lessonAnalysis) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/analysis/suggestions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: lessonAnalysis.lessonId,
          frameworkAnalysis: lessonAnalysis.frameworkAnalysis,
          teacherResponses: teacherResponses || []
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate suggestions');
      }

      // Add unique IDs to suggestions if they don't have them
      const suggestionsWithIds = (data.data.suggestions || []).map((suggestion, index) => ({
        ...suggestion,
        id: suggestion.id || `suggestion_${index}_${Date.now()}`
      }));

      setSuggestions(suggestionsWithIds);
    } catch (err) {
      console.error('Error generating suggestions:', err);
      setError(err.message || 'Failed to generate suggestions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionFeedback = async (suggestionId, rating) => {
    try {
      const response = await fetch('http://localhost:3001/api/analysis/suggestions/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          suggestionId,
          rating
        })
      });

      const data = await response.json();

      if (data.success) {
        setFeedbackSubmitted(prev => ({
          ...prev,
          [suggestionId]: rating
        }));
      }

      return data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  };

  const handleApplySuggestion = async (suggestion) => {
    if (!lessonAnalysis?.originalContent) {
      console.error('No original lesson content available');
      return;
    }

    setIsApplying(true);
    try {
      const response = await fetch('http://localhost:3001/api/analysis/suggestions/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: lessonAnalysis.lessonId,
          suggestionId: suggestion.id,
          originalLesson: lessonAnalysis.originalContent,
          suggestion: suggestion,
          teacherResponse: null, // Could be enhanced to include teacher's specific context
          lessonElements: {} // Could be enhanced to include parsed lesson elements
        })
      });

      const data = await response.json();
      console.log('Apply suggestion response:', data);

      if (data.success) {
        // Transform backend response to match EnhancementPreview expectations
        const transformedPreview = {
          previewId: data.data.preview?.previewId || `preview_${Date.now()}`,
          lessonId: data.data.lessonId,
          original: lessonAnalysis?.originalContent || lessonAnalysis?.content || '',
          enhanced: data.data.preview?.previewLesson || data.data.preview?.enhanced || '',
          changes: data.data.enhancements?.map((enhancement, index) => ({
            id: enhancement.id || `change_${index}`,
            type: enhancement.type || 'text_addition',
            title: enhancement.title || enhancement.rationale || `Enhancement ${index + 1}`,
            description: enhancement.description || enhancement.enhancedText || '',
            enhancedText: enhancement.enhancedText || enhancement.implementation || '',
            originalText: enhancement.originalText || '',
            rationale: enhancement.rationale || enhancement.description || '',
            location: enhancement.location || null,
            impact: enhancement.impact || 'medium'
          })) || [],
          statistics: data.data.preview?.statistics || {
            originalWordCount: (lessonAnalysis?.originalContent || '').split(/\s+/).length,
            enhancedWordCount: (data.data.preview?.previewLesson || '').split(/\s+/).length
          }
        };
        
        console.log('Transformed preview:', transformedPreview);
        setEnhancementPreview(transformedPreview);
      } else {
        throw new Error(data.error || 'Failed to apply suggestion');
      }
    } catch (error) {
      console.error('Error applying suggestion:', error);
      setError('Failed to apply suggestion. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleConfirmEnhancement = async (confirmationData) => {
    try {
      console.log('Confirming enhancement with data:', confirmationData);
      console.log('Enhancement preview:', enhancementPreview);
      
      // Include additional required data for processing the enhancement
      const enhancementRequest = {
        ...confirmationData,
        originalLesson: lessonAnalysis?.originalContent || lessonAnalysis?.content || '',
        previewData: enhancementPreview
      };

      console.log('Sending enhancement request:', enhancementRequest);

      const response = await fetch('http://localhost:3001/api/analysis/enhancements/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enhancementRequest)
      });

      const data = await response.json();
      console.log('Confirm enhancement response:', data);

      if (data.success && data.data.enhancedLesson) {
        // Close the preview modal first
        setEnhancementPreview(null);
        
        // Show success message with copy option
        const copyToClipboard = async () => {
          try {
            await navigator.clipboard.writeText(data.data.enhancedLesson);
            return true;
          } catch (err) {
            console.error('Failed to copy to clipboard:', err);
            return false;
          }
        };

        // Create a more robust success dialog
        const stats = data.data.statistics;
        const userChoice = window.confirm(
          `✅ Your lesson has been successfully enhanced!\n\n` +
          `📊 Statistics:\n` +
          `• Original: ${stats.originalWordCount} words\n` +
          `• Enhanced: ${stats.enhancedWordCount} words\n` +
          `• Changes applied: ${stats.changesApplied}\n` +
          `• Word increase: +${stats.enhancedWordCount - stats.originalWordCount} words\n\n` +
          `📋 Click OK to copy the enhanced lesson to your clipboard, or Cancel to just close this dialog.`
        );

        if (userChoice) {
          const copied = await copyToClipboard();
          if (copied) {
            alert('✅ Enhanced lesson copied to clipboard successfully!');
          } else {
            // Fallback: show the lesson text in a modal for manual copying
            const textarea = document.createElement('textarea');
            textarea.value = data.data.enhancedLesson;
            textarea.style.position = 'fixed';
            textarea.style.top = '50%';
            textarea.style.left = '50%';
            textarea.style.transform = 'translate(-50%, -50%)';
            textarea.style.width = '80%';
            textarea.style.height = '60%';
            textarea.style.zIndex = '10000';
            textarea.style.border = '2px solid #ccc';
            textarea.style.borderRadius = '8px';
            textarea.style.padding = '16px';
            document.body.appendChild(textarea);
            textarea.select();
            alert('Copy failed automatically. Please manually copy the text from the text box and then click OK to close it.');
            document.body.removeChild(textarea);
          }
        }
        
        // Update the lesson content in parent component if callback exists
        if (typeof onLessonUpdated === 'function') {
          onLessonUpdated(data.data.enhancedLesson);
        }
        
      } else {
        throw new Error(data.error || 'Failed to generate enhanced lesson. Please try again.');
      }
    } catch (error) {
      console.error('Error confirming enhancement:', error);
      setError('Failed to apply enhancement. Please try again.');
    }
  };

  const handleCancelPreview = () => {
    setEnhancementPreview(null);
  };

  if (!lessonAnalysis) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Lightbulb className="w-6 h-6 text-yellow-600" />
          <h2 className="text-2xl font-bold text-gray-800">Improvement Suggestions</h2>
        </div>
        <button
          onClick={generateSuggestions}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? (
            <Loader className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span>{isLoading ? 'Generating...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && suggestions.length === 0 && (
        <div className="text-center py-8">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Generating personalized suggestions...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <SuggestionCard
              key={suggestion.id}
              suggestion={suggestion}
              onFeedback={handleSuggestionFeedback}
              onApplySuggestion={handleApplySuggestion}
            />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && suggestions.length === 0 && (
        <div className="text-center py-8">
          <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Excellent lesson planning!
          </h3>
          <p className="text-gray-500">
            Your lesson shows strong evidence across all frameworks. 
            Check back after completing the clarifying questions for personalized suggestions.
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
        <h4 className="font-semibold text-yellow-800 mb-2">About these suggestions</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Suggestions are based on our analysis of your lesson against proven frameworks</li>
          <li>• They're designed to be supportive, not prescriptive</li>
          <li>• Your feedback helps us improve future suggestions</li>
          <li>• Consider your specific context when implementing suggestions</li>
        </ul>
      </div>

      {/* Enhancement Preview Modal */}
      {enhancementPreview && (
        <EnhancementPreview
          preview={enhancementPreview}
          onConfirm={handleConfirmEnhancement}
          onCancel={handleCancelPreview}
          loading={isApplying}
        />
      )}
    </div>
  );
};

export default SuggestionEngine;