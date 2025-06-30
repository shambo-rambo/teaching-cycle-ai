import React, { useState } from 'react';
import { Lightbulb, ThumbsUp, ThumbsDown, CheckCircle, ArrowRight, BookOpen, Target, Brain, Wand2 } from 'lucide-react';

const SuggestionCard = ({ suggestion, onFeedback, onApplySuggestion }) => {
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showImplementationOption, setShowImplementationOption] = useState(false);

  const handleFeedback = async (rating) => {
    setIsSubmitting(true);
    try {
      const response = await onFeedback(suggestion.id, rating);
      setFeedback(rating);
      
      // Show implementation option if rating was helpful and API supports it
      if (rating === 'helpful' && response?.data?.implementationOption?.available) {
        setShowImplementationOption(true);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApplySuggestion = () => {
    if (onApplySuggestion) {
      onApplySuggestion(suggestion);
    }
  };

  const getFrameworkIcon = (framework) => {
    switch (framework) {
      case 'teachingLearningCycle':
        return <BookOpen className="w-5 h-5 text-blue-600" />;
      case 'highImpactTeaching':
        return <Target className="w-5 h-5 text-green-600" />;
      case 'criticalThinking':
        return <Brain className="w-5 h-5 text-purple-600" />;
      default:
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getFrameworkColor = (framework) => {
    switch (framework) {
      case 'teachingLearningCycle':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'highImpactTeaching':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'criticalThinking':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const formatElementName = (element) => {
    if (!element) return '';
    return element
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              {getFrameworkIcon(suggestion.framework)}
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getFrameworkColor(suggestion.framework)}`}>
                {suggestion.framework === 'teachingLearningCycle' ? 'Teaching & Learning Cycle' :
                 suggestion.framework === 'highImpactTeaching' ? 'High Impact Teaching' :
                 suggestion.framework === 'criticalThinking' ? 'Critical Thinking' :
                 suggestion.framework}
              </span>
              {suggestion.element && (
                <span className="text-sm text-gray-600">
                  → {formatElementName(suggestion.element)}
                </span>
              )}
            </div>
          </div>
        </div>
        {feedback && (
          <div className="flex-shrink-0">
            {feedback === 'helpful' ? (
              <CheckCircle className="w-6 h-6 text-green-600" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-600">✓</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Suggestion Content */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          {suggestion.suggestion}
        </h3>
        
        {suggestion.rationale && (
          <div className="mb-3">
            <p className="text-gray-700 text-sm leading-relaxed">
              <span className="font-medium">Why this helps:</span> {suggestion.rationale}
            </p>
          </div>
        )}

        {suggestion.implementation && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <ArrowRight className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 mb-1">How to implement:</p>
                <p className="text-sm text-blue-700">{suggestion.implementation}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feedback Section */}
      {!feedback ? (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">Was this suggestion helpful?</p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleFeedback('helpful')}
              disabled={isSubmitting}
              className="flex items-center space-x-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm">Helpful</span>
            </button>
            <button
              onClick={() => handleFeedback('unhelpful')}
              disabled={isSubmitting}
              className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <ThumbsDown className="w-4 h-4" />
              <span className="text-sm">Not helpful</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {feedback === 'helpful' 
                ? 'Thank you! Your feedback helps us improve.' 
                : 'Thank you for your feedback. We\'ll work on better suggestions.'}
            </p>
            <div className="flex items-center space-x-2">
              {feedback === 'helpful' && showImplementationOption && (
                <button
                  onClick={handleApplySuggestion}
                  className="flex items-center space-x-1 px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm font-medium"
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Apply Suggestion</span>
                </button>
              )}
              {feedback === 'helpful' && (
                <button
                  onClick={() => handleFeedback('implemented')}
                  className="flex items-center space-x-1 px-3 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark as implemented</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestionCard;