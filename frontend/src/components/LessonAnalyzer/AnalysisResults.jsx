import React from 'react';
import { Trophy, TrendingUp, AlertTriangle, Target } from 'lucide-react';

const AnalysisResults = ({ analysis }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Trophy className="w-6 h-6 text-yellow-600" />
        <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
        <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          Framework: {analysis.framework}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
            {analysis.overallScore}
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mt-2">Overall Score</h3>
          <p className="text-sm text-gray-600">Out of 100</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
            Strengths
          </h3>
          <ul className="space-y-2">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {analysis.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm text-gray-700">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {analysis.detailedAnalysis && Object.keys(analysis.detailedAnalysis).length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Detailed Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.detailedAnalysis).map(([category, details]) => (
              <div key={category} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800 capitalize">{category}</h4>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(details.score)}`}>
                    {details.score}/100
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${getScoreBarColor(details.score)}`}
                    style={{ width: `${details.score}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{details.feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.recommendations && analysis.recommendations.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="w-5 h-5 text-blue-600 mr-2" />
            Recommendations
          </h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs rounded-full font-medium flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-700">{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;