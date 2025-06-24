import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw, Loader } from 'lucide-react';
import SuggestionCard from './SuggestionCard';

const SuggestionEngine = ({ lessonAnalysis, teacherResponses }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState({});

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
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
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
    </div>
  );
};

export default SuggestionEngine;