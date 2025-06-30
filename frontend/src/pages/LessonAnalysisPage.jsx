import React, { useState } from 'react';
import LessonUpload from '../components/LessonUpload/LessonUpload';
import FrameworkDisplay from '../components/FrameworkAnalysis/FrameworkDisplay';
import QuestionInterface from '../components/QuestionInterface/QuestionInterface';
import SuggestionEngine from '../components/SuggestionEngine/SuggestionEngine';

const LessonAnalysisPage = () => {
  const [currentStep, setCurrentStep] = useState('upload');
  const [lessonAnalysis, setLessonAnalysis] = useState(null);
  const [teacherResponses, setTeacherResponses] = useState({});

  const handleAnalysisComplete = (analysis) => {
    setLessonAnalysis(analysis);
    
    // Always go to questions step first to get contextual AI questions
    setCurrentStep('questions');
  };

  const handleResponseComplete = (responses) => {
    setTeacherResponses(responses);
    setCurrentStep('suggestions');
  };

  const handleStartOver = () => {
    setCurrentStep('upload');
    setLessonAnalysis(null);
    setTeacherResponses({});
  };

  const getStepNumber = (step) => {
    switch (step) {
      case 'upload': return 1;
      case 'questions': return 2;
      case 'suggestions': return 3;
      default: return 1;
    }
  };

  const getStepTitle = (step) => {
    switch (step) {
      case 'upload': return 'Upload Lesson';
      case 'questions': return 'Contextual Questions';
      case 'suggestions': return 'AI Improvements';
      default: return 'Upload Lesson';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI Lesson Analyser
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Framework-based lesson analysis with supportive questioning and improvement suggestions
          </p>
          
          {/* Framework Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              Teaching & Learning Cycle
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              High Impact Teaching
            </span>
            <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              Critical Thinking Skills
            </span>
          </div>
        </div>

        {/* Progress Steps */}
        {lessonAnalysis && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              {['upload', 'questions', 'suggestions'].map((step, index) => {
                const stepNum = index + 1;
                const isActive = currentStep === step;
                const isCompleted = getStepNumber(currentStep) > stepNum;
                const isAccessible = getStepNumber(currentStep) >= stepNum;

                return (
                  <div key={step} className="flex items-center">
                    <div className={`flex items-center space-x-3 ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold
                        ${isCompleted 
                          ? 'bg-green-600 text-white' 
                          : isActive 
                            ? 'bg-blue-600 text-white'
                            : isAccessible
                              ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                              : 'bg-gray-100 text-gray-400'
                        }`}>
                        {isCompleted ? '✓' : stepNum}
                      </div>
                      <span className={`font-medium hidden md:block
                        ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-600'}
                      `}>
                        {getStepTitle(step)}
                      </span>
                    </div>
                    {index < 2 && (
                      <div className={`w-8 h-1 mx-4 
                        ${getStepNumber(currentStep) > stepNum ? 'bg-green-600' : 'bg-gray-200'}
                      `}></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {/* Step 1: Upload */}
          {currentStep === 'upload' && (
            <LessonUpload onAnalysisComplete={handleAnalysisComplete} />
          )}

          {/* Framework analysis hidden to reduce clutter - focus on questions and suggestions */}

          {/* Step 3: Questions */}
          {currentStep === 'questions' && lessonAnalysis && (
            <QuestionInterface
              questions={lessonAnalysis.questions}
              lessonId={lessonAnalysis.lessonId}
              lessonContent={lessonAnalysis.originalContent}
              onResponseComplete={handleResponseComplete}
            />
          )}

          {/* Step 4: Suggestions */}
          {currentStep === 'suggestions' && lessonAnalysis && (
            <SuggestionEngine
              lessonAnalysis={lessonAnalysis}
              teacherResponses={teacherResponses}
            />
          )}
        </div>

        {/* Action Buttons */}
        {lessonAnalysis && (
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={handleStartOver}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Analyze Another Lesson
            </button>
            
            {currentStep === 'questions' && (
              <button
                onClick={() => setCurrentStep('suggestions')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Skip to Suggestions
              </button>
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            This tool analyzes lessons using evidence-based pedagogical frameworks to support teacher improvement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LessonAnalysisPage;