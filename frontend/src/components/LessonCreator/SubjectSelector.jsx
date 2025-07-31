import React from 'react';
import { Clock, Users, BookOpen, Calculator, Microscope, Globe } from 'lucide-react';

const SubjectSelector = ({ onSubjectSelect }) => {
  const subjects = [
    {
      id: 'history',
      name: 'History',
      icon: Globe,
      status: 'available',
      curriculum: 'IB DP',
      description: 'Create comprehensive IB History DP lessons using flipped learning principles with structured pre-class preparation and engaging in-class activities.',
      features: [
        'IB DP curriculum aligned',
        'Flipped learning model',
        'Source analysis activities',
        'Historical thinking skills',
        'Assessment preparation',
        'Differentiation strategies'
      ],
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    {
      id: 'math',
      name: 'Mathematics',
      icon: Calculator,
      status: 'coming_soon',
      curriculum: 'IB DP & MYP',
      description: 'Mathematical lesson plans focusing on problem-solving, conceptual understanding, and real-world applications.',
      features: [
        'Problem-based learning',
        'Conceptual understanding',
        'Mathematical modeling',
        'Technology integration',
        'Assessment criteria',
        'Inquiry-based approach'
      ],
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'english',
      name: 'English Language & Literature',
      icon: BookOpen,
      status: 'coming_soon',
      curriculum: 'IB DP',
      description: 'Literature and language lessons emphasizing critical analysis, creative expression, and global perspectives.',
      features: [
        'Text analysis skills',
        'Creative writing',
        'Global contexts',
        'Literary devices',
        'Oral presentations',
        'Cross-cultural understanding'
      ],
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'science',
      name: 'Sciences',
      icon: Microscope,
      status: 'coming_soon',
      curriculum: 'IB DP',
      description: 'Scientific inquiry-based lessons with hands-on experiments and conceptual understanding.',
      features: [
        'Inquiry-based learning',
        'Practical investigations',
        'Scientific method',
        'Data analysis',
        'Lab safety protocols',
        'Real-world applications'
      ],
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const handleSubjectClick = (subject) => {
    if (subject.status === 'available') {
      onSubjectSelect(subject);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Your Subject</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            onClick={() => handleSubjectClick(subject)}
            className={`
              relative border-2 rounded-lg p-6 transition-all duration-200
              ${subject.status === 'available' 
                ? `${subject.borderColor} ${subject.bgColor} hover:shadow-lg cursor-pointer hover:scale-105` 
                : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-75'
              }
            `}
          >
            {/* Status Badge */}
            {subject.status === 'coming_soon' && (
              <div className="absolute top-3 right-3">
                <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                  Coming Soon
                </span>
              </div>
            )}

            {/* Subject Header */}
            <div className="flex items-center space-x-3 mb-4">
              <subject.icon className={`w-8 h-8 ${subject.color}`} />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {subject.curriculum}
                </p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-700 mb-4">
              {subject.description}
            </p>

            {/* Features */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-800">Key Features:</h4>
              <div className="grid grid-cols-2 gap-1">
                {subject.features.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-center space-x-1">
                    <div className={`w-1.5 h-1.5 ${subject.color.replace('text-', 'bg-')} rounded-full`}></div>
                    <span className="text-xs text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Indicator */}
            {subject.status === 'available' && (
              <div className="mt-4 pt-4 border-t border-current border-opacity-20">
                <div className={`flex items-center justify-center space-x-2 ${subject.color} font-medium text-sm`}>
                  <span>Start Creating</span>
                  <Clock className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Help Text */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2">How it works:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
            <div>
              <p className="font-medium">Choose Subject</p>
              <p>Select your teaching subject and curriculum</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
            <div>
              <p className="font-medium">Provide Context</p>
              <p>Upload resources or describe your lesson topic</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
            <div>
              <p className="font-medium">Review & Customize</p>
              <p>Edit the generated lesson plan to fit your needs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelector;