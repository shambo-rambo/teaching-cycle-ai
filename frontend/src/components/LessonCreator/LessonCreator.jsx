import React, { useState } from 'react';
import { BookOpen, Users, Clock, Target, ArrowRight } from 'lucide-react';
import SubjectSelector from './SubjectSelector';
import HistoryLessonCreator from './subjects/HistoryLessonCreator';

const LessonCreator = () => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [creationMode, setCreationMode] = useState(null); // 'upload' | 'idea' | null

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setCreationMode(null);
  };

  const handleBack = () => {
    if (creationMode) {
      setCreationMode(null);
    } else {
      setSelectedSubject(null);
    }
  };

  const renderSubjectCreator = () => {
    switch (selectedSubject?.id) {
      case 'history':
        return (
          <HistoryLessonCreator
            mode={creationMode}
            onBack={handleBack}
          />
        );
      case 'math':
        return (
          <div className="text-center py-8">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">Math Lesson Creator</h3>
            <p className="text-gray-500 mt-2">Coming soon...</p>
          </div>
        );
      case 'english':
        return (
          <div className="text-center py-8">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">English Lesson Creator</h3>
            <p className="text-gray-500 mt-2">Coming soon...</p>
          </div>
        );
      case 'science':
        return (
          <div className="text-center py-8">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600">Science Lesson Creator</h3>
            <p className="text-gray-500 mt-2">Coming soon...</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (selectedSubject && creationMode) {
    return renderSubjectCreator();
  }

  if (selectedSubject) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <selectedSubject.icon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">
              {selectedSubject.name} Lesson Creator
            </h1>
          </div>
          <button
            onClick={handleBack}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Back to Subjects
          </button>
        </div>

        {/* Creation Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upload Resources */}
          <div 
            onClick={() => setCreationMode('upload')}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors group"
          >
            <div className="text-center">
              <BookOpen className="w-12 h-12 text-gray-400 group-hover:text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Upload Resources
              </h3>
              <p className="text-gray-600 mb-4">
                Upload your lesson materials, resources, or rough lesson plan and let AI help you create a structured lesson.
              </p>
              <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                <span className="mr-2">Get started</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Start with Idea */}
          <div 
            onClick={() => setCreationMode('idea')}
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors group"
          >
            <div className="text-center">
              <Target className="w-12 h-12 text-gray-400 group-hover:text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Start with Topic
              </h3>
              <p className="text-gray-600 mb-4">
                Tell us your lesson topic and objectives. AI will ask clarifying questions and create a complete lesson plan.
              </p>
              <div className="flex items-center justify-center text-blue-600 group-hover:text-blue-700">
                <span className="mr-2">Get started</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>

        {/* Subject-Specific Info */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-3">
            {selectedSubject.name} Lesson Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            {selectedSubject.features?.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-blue-700">{feature}</span>
              </div>
            ))}
          </div>
          {selectedSubject.description && (
            <p className="text-blue-700 mt-4 text-sm">
              {selectedSubject.description}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-800">Lesson Creator</h1>
      </div>

      {/* Introduction */}
      <div className="mb-8">
        <p className="text-lg text-gray-600 mb-4">
          Create comprehensive, structured lesson plans tailored to your subject and curriculum. 
          Our AI will guide you through the process with contextual questions to ensure your lesson meets all learning objectives.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-green-700">
            <Users className="w-4 h-4" />
            <span>Curriculum-aligned</span>
          </div>
          <div className="flex items-center space-x-2 text-green-700">
            <Clock className="w-4 h-4" />
            <span>Time-efficient planning</span>
          </div>
          <div className="flex items-center space-x-2 text-green-700">
            <Target className="w-4 h-4" />
            <span>Learning objective focused</span>
          </div>
        </div>
      </div>

      {/* Subject Selection */}
      <SubjectSelector onSubjectSelect={handleSubjectSelect} />
    </div>
  );
};

export default LessonCreator;