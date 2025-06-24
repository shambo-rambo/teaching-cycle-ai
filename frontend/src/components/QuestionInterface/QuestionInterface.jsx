import React, { useState } from 'react';
import { MessageCircle, CheckCircle, Clock } from 'lucide-react';
import QuestionCard from './QuestionCard';

const QuestionInterface = ({ questions, lessonId, onResponseComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [completedQuestions, setCompletedQuestions] = useState(new Set());

  const handleResponse = async (questionId, response) => {
    try {
      const apiResponse = await fetch('http://localhost:3001/api/analysis/questions/respond', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionId,
          response,
          lessonId
        })
      });

      const data = await apiResponse.json();

      if (data.success) {
        // Store the response
        setResponses(prev => ({
          ...prev,
          [questionId]: {
            response,
            timestamp: data.data.timestamp,
            responseType: data.data.responseType
          }
        }));

        // Mark question as completed
        setCompletedQuestions(prev => new Set([...prev, questionId]));

        // Move to next question or complete
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
        } else {
          // All questions completed
          onResponseComplete(responses);
        }
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      // For now, still proceed to next question
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSkip = (questionId) => {
    // Mark as skipped and move to next
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        response: 'SKIPPED',
        timestamp: new Date().toISOString(),
        responseType: 'skipped'
      }
    }));

    setCompletedQuestions(prev => new Set([...prev, questionId]));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onResponseComplete(responses);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Great lesson analysis!
          </h3>
          <p className="text-gray-600">
            No clarifying questions needed. Your lesson plan clearly shows evidence of all three frameworks.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const allQuestionsCompleted = currentQuestionIndex >= questions.length;

  if (allQuestionsCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Thank you for your responses!
          </h3>
          <p className="text-gray-600 mb-4">
            We've recorded your explanations and will use them to provide better suggestions.
          </p>
          <div className="text-sm text-gray-500">
            Responses: {Object.keys(responses).length} of {questions.length} questions
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Clarifying Questions</h2>
        </div>
        <div className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {Math.round(((currentQuestionIndex) / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {questions.map((question, index) => (
            <button
              key={question.id}
              onClick={() => goToQuestion(index)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                ${index === currentQuestionIndex 
                  ? 'bg-blue-600 text-white' 
                  : completedQuestions.has(question.id)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              title={`Question ${index + 1}: ${question.framework}`}
            >
              {completedQuestions.has(question.id) ? (
                <CheckCircle className="w-4 h-4" />
              ) : index < currentQuestionIndex ? (
                <Clock className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Current Question */}
      <QuestionCard
        question={currentQuestion}
        onResponse={handleResponse}
        onSkip={handleSkip}
      />

      {/* Footer Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">About these questions</h4>
        <p className="text-sm text-blue-700">
          These questions help us understand elements that weren't clearly evident in your written lesson plan. 
          Your responses help us learn about your teaching approach and provide better suggestions. 
          Feel free to explain your reasoning or let us know if something isn't relevant to your lesson.
        </p>
      </div>
    </div>
  );
};

export default QuestionInterface;