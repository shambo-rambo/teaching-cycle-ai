import React, { useState, useEffect } from 'react';
import { MessageCircle, CheckCircle, Clock, Lightbulb } from 'lucide-react';

const CreationWizard = ({ lessonData, onDataUpdate, subject }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [completedQuestions, setCompletedQuestions] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateContextualQuestions();
  }, [lessonData, subject]);

  const generateContextualQuestions = async () => {
    setIsLoading(true);
    try {
      console.log('Generating contextual questions with Claude 4...', { lessonData, subject });
      
      const response = await fetch('http://localhost:3001/api/lesson-creation/questions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonData: lessonData,
          subject: subject
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      console.log('Questions generated successfully:', data.data.questions?.length || 0);
      setQuestions(data.data.questions || []);
      
    } catch (error) {
      console.error('Error generating questions:', error);
      // Fallback to mock questions if API fails
      const mockQuestions = generateMockQuestions(lessonData, subject);
      setQuestions(mockQuestions);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockQuestions = (data, subject) => {
    const baseQuestions = [
      {
        id: 'learning-objectives',
        category: 'Learning Objectives',
        question: `What specific historical thinking skills do you want students to develop in this lesson about "${data.topic || 'your topic'}"?`,
        rationale: 'This helps us create activities that develop the right analytical skills.',
        options: ['Analysis', 'Evaluation', 'Synthesis', 'Comparison', 'Causation', 'Change and Continuity'],
        type: 'multiple-choice'
      },
      {
        id: 'student-prior-knowledge',
        category: 'Student Context',
        question: 'What prior knowledge do your students have about this historical period?',
        rationale: 'Understanding baseline knowledge helps us pitch activities appropriately.',
        type: 'text'
      },
      {
        id: 'source-preferences',
        category: 'Resources',
        question: 'What types of historical sources would be most engaging for your students?',
        rationale: 'We\'ll prioritize these source types in the lesson activities.',
        options: ['Primary documents', 'Visual sources (maps, cartoons)', 'Statistical data', 'Diary/memoir excerpts', 'Government documents', 'Newspaper articles'],
        type: 'multiple-choice'
      },
      {
        id: 'assessment-focus',
        category: 'Assessment',
        question: 'Which IB History assessment skills should this lesson prepare students for?',
        rationale: 'This ensures activities align with assessment requirements.',
        options: ['Paper 1 (Source analysis)', 'Paper 2 (Comparative essays)', 'Paper 3 (Regional study)', 'Internal Assessment'],
        type: 'multiple-choice'
      },
      {
        id: 'differentiation-needs',
        category: 'Differentiation',
        question: 'Do you have specific student needs to consider in this lesson?',
        rationale: 'We\'ll include appropriate support strategies and extensions.',
        options: ['EAL/multilingual learners', 'Students needing reading support', 'Gifted and talented extensions', 'Students with processing difficulties'],
        type: 'multiple-choice'
      }
    ];

    // Add topic-specific questions based on the lesson content
    if (data.topic?.toLowerCase().includes('appeasement') || data.topic?.toLowerCase().includes('munich')) {
      baseQuestions.push({
        id: 'appeasement-perspective',
        category: 'Content-Specific',
        question: 'Which perspectives on appeasement policy do you want students to explore?',
        rationale: 'This helps us select appropriate sources and structure the debate activity.',
        options: ['British perspective', 'French perspective', 'German perspective', 'Czechoslovakian perspective', 'American perspective', 'Soviet perspective'],
        type: 'multiple-choice'
      });
    }

    return baseQuestions;
  };

  const handleResponse = (questionId, response) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));

    setCompletedQuestions(prev => new Set([...prev, questionId]));

    // Update lesson data with responses
    onDataUpdate(prev => ({
      ...prev,
      contextualResponses: {
        ...prev.contextualResponses,
        [questionId]: response
      }
    }));

    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSkip = (questionId) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: 'SKIPPED'
    }));

    setCompletedQuestions(prev => new Set([...prev, questionId]));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Generating contextual questions...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-8">
        <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Ready to Generate!
        </h3>
        <p className="text-gray-600">
          We have enough information to create your lesson plan.
        </p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const allQuestionsCompleted = completedQuestions.size >= questions.length;

  if (allQuestionsCompleted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Perfect! All set to create your lesson.
        </h3>
        <p className="text-gray-600 mb-4">
          We have all the context we need to generate a comprehensive IB History DP lesson plan.
        </p>
        <div className="text-sm text-gray-500">
          Responses: {Object.keys(responses).length} of {questions.length} questions
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Contextual Questions
        </h3>
        <p className="text-gray-600">
          Help us tailor your lesson by answering a few questions about your students and teaching context.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Navigation */}
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
            title={`Question ${index + 1}: ${question.category}`}
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

      {/* Current Question */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">
              {currentQuestion.category}
            </span>
          </div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            {currentQuestion.question}
          </h4>
          <p className="text-sm text-gray-600">
            {currentQuestion.rationale}
          </p>
        </div>

        {currentQuestion.type === 'multiple-choice' ? (
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  name={currentQuestion.id}
                  value={option}
                  onChange={(e) => {
                    const currentResponse = responses[currentQuestion.id] || [];
                    const newResponse = e.target.checked
                      ? [...currentResponse, option]
                      : currentResponse.filter(item => item !== option);
                    setResponses(prev => ({
                      ...prev,
                      [currentQuestion.id]: newResponse
                    }));
                  }}
                  checked={responses[currentQuestion.id]?.includes(option) || false}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        ) : (
          <textarea
            value={responses[currentQuestion.id] || ''}
            onChange={(e) => setResponses(prev => ({
              ...prev,
              [currentQuestion.id]: e.target.value
            }))}
            placeholder="Share your thoughts..."
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => handleSkip(currentQuestion.id)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Skip for now
          </button>
          <button
            onClick={() => handleResponse(currentQuestion.id, responses[currentQuestion.id] || '')}
            disabled={!responses[currentQuestion.id] || 
              (Array.isArray(responses[currentQuestion.id]) && responses[currentQuestion.id].length === 0)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreationWizard;