import React, { useState } from 'react';
import { MessageCircle, Send, SkipForward, BookOpen, Target, Brain } from 'lucide-react';

const QuestionCard = ({ question, onResponse, onSkip }) => {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!response.trim()) return;

    setIsSubmitting(true);
    try {
      await onResponse(question.id, response.trim());
      setResponse('');
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onSkip(question.id);
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
        return <MessageCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getFrameworkName = (framework) => {
    switch (framework) {
      case 'teachingLearningCycle':
        return 'Teaching & Learning Cycle';
      case 'highImpactTeaching':
        return 'High Impact Teaching';
      case 'criticalThinking':
        return 'Critical Thinking';
      default:
        return framework;
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
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatElementName = (element) => {
    return element
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {getFrameworkIcon(question.framework)}
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getFrameworkColor(question.framework)}`}>
                {getFrameworkName(question.framework)}
              </span>
              {question.element && (
                <span className="text-sm text-gray-600">
                  → {formatElementName(question.element)}
                </span>
              )}
            </div>
            {question.priority && (
              <div className="mt-1">
                <span className="text-xs text-gray-500">
                  Priority: {question.priority > 0.8 ? 'High' : question.priority > 0.6 ? 'Medium' : 'Low'}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          We'd like to understand your lesson better:
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Response Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your response:
          </label>
          <textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Please explain how this element appears in your lesson, or let us know if it's not applicable..."
            className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleSkip}
            disabled={isSubmitting}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <SkipForward className="w-4 h-4" />
            <span>Skip this question</span>
          </button>

          <button
            type="submit"
            disabled={!response.trim() || isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Response'}</span>
          </button>
        </div>
      </form>

      {/* Helper Text */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">
          💡 <strong>Don't worry!</strong> This isn't a test. We're just trying to understand your teaching approach better. 
          You can explain why something isn't relevant to your lesson, or describe how you address it in ways that might not be obvious from the written plan.
        </p>
      </div>
    </div>
  );
};

export default QuestionCard;