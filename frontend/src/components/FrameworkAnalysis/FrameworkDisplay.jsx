import React from 'react';
import { CheckCircle, HelpCircle, XCircle, BookOpen, Target, Brain } from 'lucide-react';

const FrameworkDisplay = ({ analysis }) => {
  const getStatusIcon = (detected, confidence = 0) => {
    if (detected && confidence > 0.7) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (detected && confidence > 0.3) {
      return <HelpCircle className="w-5 h-5 text-yellow-600" />;
    } else {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (detected, confidence = 0) => {
    if (detected && confidence > 0.7) {
      return 'bg-green-50 border-green-200';
    } else if (detected && confidence > 0.3) {
      return 'bg-yellow-50 border-yellow-200';
    } else {
      return 'bg-red-50 border-red-200';
    }
  };

  const getStatusText = (detected, confidence = 0) => {
    if (detected && confidence > 0.7) {
      return 'Clearly Present';
    } else if (detected && confidence > 0.3) {
      return 'Partially Evident';
    } else {
      return 'Not Detected';
    }
  };

  const formatElementName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const getFrameworkIcon = (framework) => {
    switch (framework) {
      case 'teachingLearningCycle':
        return <BookOpen className="w-6 h-6 text-blue-600" />;
      case 'highImpactTeaching':
        return <Target className="w-6 h-6 text-green-600" />;
      case 'criticalThinking':
        return <Brain className="w-6 h-6 text-purple-600" />;
      default:
        return <BookOpen className="w-6 h-6 text-gray-600" />;
    }
  };

  const getFrameworkTitle = (framework) => {
    switch (framework) {
      case 'teachingLearningCycle':
        return 'Teaching & Learning Cycle';
      case 'highImpactTeaching':
        return 'High Impact Teaching';
      case 'criticalThinking':
        return 'Critical Thinking Skills';
      default:
        return framework;
    }
  };

  const getFrameworkDescription = (framework) => {
    switch (framework) {
      case 'teachingLearningCycle':
        return 'Structured literacy instruction approach';
      case 'highImpactTeaching':
        return 'Evidence-based teaching strategies';
      case 'criticalThinking':
        return 'Higher-order thinking development';
      default:
        return '';
    }
  };

  if (!analysis?.frameworkAnalysis) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-600">No framework analysis available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Target className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Framework Analysis</h2>
      </div>

      <div className="space-y-6">
        {Object.entries(analysis.frameworkAnalysis).map(([frameworkKey, frameworkData]) => (
          <div key={frameworkKey} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              {getFrameworkIcon(frameworkKey)}
              <div>
                <h3 className="text-xl font-semibold text-gray-800">
                  {getFrameworkTitle(frameworkKey)}
                </h3>
                <p className="text-sm text-gray-600">
                  {getFrameworkDescription(frameworkKey)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(frameworkData).map(([elementKey, elementData]) => (
                <div 
                  key={elementKey}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(elementData.detected, elementData.confidence)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">
                      {formatElementName(elementKey)}
                    </h4>
                    {getStatusIcon(elementData.detected, elementData.confidence)}
                  </div>

                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      Status: {getStatusText(elementData.detected, elementData.confidence)}
                    </span>
                    {elementData.confidence !== undefined && (
                      <div className="mt-1">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Confidence</span>
                          <span>{Math.round(elementData.confidence * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${elementData.confidence * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {elementData.evidence && elementData.evidence.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Evidence found:</p>
                      <div className="flex flex-wrap gap-1">
                        {elementData.evidence.slice(0, 3).map((evidence, index) => (
                          <span 
                            key={index}
                            className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            "{evidence}"
                          </span>
                        ))}
                        {elementData.evidence.length > 3 && (
                          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{elementData.evidence.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Overall Summary */}
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Analysis Summary</h3>
        <p className="text-blue-700 text-sm">
          {analysis.overallAssessment || 'Your lesson has been analyzed across three key pedagogical frameworks. Review the detailed results above and check the questions section for areas that may need clarification.'}
        </p>
      </div>
    </div>
  );
};

export default FrameworkDisplay;