import React from 'react';
import { Lightbulb, ArrowRight, BookOpen } from 'lucide-react';

const ImprovementSuggestions = ({ suggestions }) => {
  const getAreaIcon = (area) => {
    const icons = {
      engagement: '🎯',
      content: '📚',
      assessment: '📝',
      objectives: '🎯',
      activities: '🎲',
      resources: '💡',
      timing: '⏰',
      differentiation: '👥'
    };
    return icons[area.toLowerCase()] || '💡';
  };

  const getAreaColor = (area) => {
    const colors = {
      engagement: 'bg-purple-100 text-purple-800',
      content: 'bg-blue-100 text-blue-800',
      assessment: 'bg-green-100 text-green-800',
      objectives: 'bg-yellow-100 text-yellow-800',
      activities: 'bg-pink-100 text-pink-800',
      resources: 'bg-indigo-100 text-indigo-800',
      timing: 'bg-orange-100 text-orange-800',
      differentiation: 'bg-teal-100 text-teal-800'
    };
    return colors[area.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Lightbulb className="w-6 h-6 text-yellow-600" />
        <h2 className="text-2xl font-bold text-gray-800">Improvement Suggestions</h2>
      </div>

      {suggestions.suggestions && suggestions.suggestions.length > 0 ? (
        <div className="space-y-4">
          {suggestions.suggestions.map((suggestion, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">{getAreaIcon(suggestion.area)}</span>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAreaColor(suggestion.area)}`}>
                      {suggestion.area.charAt(0).toUpperCase() + suggestion.area.slice(1)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {suggestion.suggestion}
                  </h3>
                  
                  <div className="flex items-start space-x-2 text-gray-600">
                    <BookOpen className="w-4 h-4 mt-1 flex-shrink-0" />
                    <p className="text-sm">{suggestion.rationale}</p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No suggestions available</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Implementation Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Start with one or two suggestions that seem most feasible</li>
          <li>• Consider your specific context, student needs, and available resources</li>
          <li>• Test changes gradually and gather student feedback</li>
          <li>• Document what works well for future lesson planning</li>
        </ul>
      </div>
    </div>
  );
};

export default ImprovementSuggestions;