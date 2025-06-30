import React, { useState } from 'react';
import { MessageCircle, CheckCircle, Clock, PanelLeftOpen, PanelLeftClose } from 'lucide-react';
import QuestionCard from './QuestionCard';
import LessonSidebar from './LessonSidebar';

const QuestionInterface = ({ questions, lessonId, lessonContent, onResponseComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [completedQuestions, setCompletedQuestions] = useState(new Set());
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [updatedLessonContent, setUpdatedLessonContent] = useState(lessonContent);
  const [personalizedQuestions, setPersonalizedQuestions] = useState(null);
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);

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
        if (currentQuestionIndex < (questionsToUse?.length || 0) - 1) {
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

    if (currentQuestionIndex < (questionsToUse?.length || 0) - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      onResponseComplete(responses);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleLessonUpdate = (newContent) => {
    setUpdatedLessonContent(newContent);
    // Could trigger re-analysis or save to backend here
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  // Debug logging
  console.log('QuestionInterface received questions:', questions);
  
  // Backend should always provide questions, but add minimal frontend fallback as last resort
  const questionsToUse = questions && questions.length > 0 ? questions : [
    {
      id: 'frontend-fallback-1',
      framework: 'teachingLearningCycle',
      element: 'fieldBuilding',
      question: 'What is the main learning objective or goal for this lesson?',
      rationale: 'Understanding the lesson objective helps us provide targeted feedback.'
    }
  ];
  
  console.log('Questions to use:', questionsToUse);

  const currentQuestion = questionsToUse?.[currentQuestionIndex];
  const allQuestionsCompleted = currentQuestionIndex >= (questionsToUse?.length || 0);

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
            Responses: {Object.keys(responses).length} of {questionsToUse?.length || 0} questions
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Clarifying Questions</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questionsToUse?.length || 0}
          </div>
          <button
            onClick={toggleSidebar}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title={sidebarVisible ? "Hide lesson content" : "Show lesson content"}
          >
            {sidebarVisible ? (
              <PanelLeftClose className="w-5 h-5" />
            ) : (
              <PanelLeftOpen className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex h-[calc(100vh-12rem)]">
        {/* Questions Section */}
        <div className={`${sidebarVisible ? 'w-1/2' : 'w-full'} p-6 overflow-y-auto transition-all duration-300`}>
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-600">
                {Math.round(((currentQuestionIndex) / (questionsToUse?.length || 1)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex) / (questionsToUse?.length || 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Navigation */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {(questionsToUse || []).map((question, index) => (
                <button
                  key={question.id || `question-${index}`}
                  onClick={() => goToQuestion(index)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                    ${index === currentQuestionIndex 
                      ? 'bg-blue-600 text-white' 
                      : completedQuestions.has(question.id || `question-${index}`)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  title={`Question ${index + 1}: ${question.framework || 'General'}`}
                >
                  {completedQuestions.has(question.id || `question-${index}`) ? (
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

        {/* Lesson Sidebar */}
        {sidebarVisible && (
          <div className="w-1/2 border-l border-gray-200">
            <LessonSidebar
              lessonContent={updatedLessonContent}
              currentQuestion={currentQuestion}
              onLessonUpdate={handleLessonUpdate}
              isVisible={sidebarVisible}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionInterface;