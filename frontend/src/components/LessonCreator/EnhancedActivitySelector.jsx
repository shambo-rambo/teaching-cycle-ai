import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Target, Users, Globe, BookOpen, BarChart3, Lightbulb } from 'lucide-react';

const EnhancedActivitySelector = ({ 
  lessonData, 
  onActivitiesGenerated, 
  teachingHistory = [], 
  userPreferences = {} 
}) => {
  const [loading, setLoading] = useState(false);
  const [enhancedActivities, setEnhancedActivities] = useState(null);
  const [adaptiveRecommendations, setAdaptiveRecommendations] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [viewMode, setViewMode] = useState('smart'); // 'smart', 'adaptive', 'methodology'
  const [methodologyFilters, setMethodologyFilters] = useState({
    principles: [],
    difficulty: 'all',
    duration: 'all'
  });

  useEffect(() => {
    if (lessonData?.topic && lessonData?.duration) {
      generateEnhancedActivities();
    }
  }, [lessonData]);

  const generateEnhancedActivities = async () => {
    setLoading(true);
    try {
      console.log('🚀 Generating enhanced activities...');
      
      const response = await fetch('/api/enhanced-lessons/activities/enhanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonData,
          subject: 'history',
          teachingHistory,
          preferences: {
            ...userPreferences,
            preferredPrinciples: methodologyFilters.principles
          }
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setEnhancedActivities(data.basicActivities);
        setAdaptiveRecommendations(data.adaptiveRecommendations);
        console.log('✅ Enhanced activities generated');
      } else {
        console.error('❌ Failed to generate enhanced activities:', data.error);
      }
    } catch (error) {
      console.error('❌ Error generating enhanced activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivityToggle = (activityId, isSelected) => {
    if (isSelected) {
      const activity = findActivityById(activityId);
      if (activity) {
        setSelectedActivities(prev => [...prev, activity]);
      }
    } else {
      setSelectedActivities(prev => prev.filter(a => a.id !== activityId));
    }
  };

  const findActivityById = (activityId) => {
    // Search in enhanced activities
    if (enhancedActivities?.activities) {
      const found = enhancedActivities.activities.find(a => a.id === activityId);
      if (found) return found;
    }

    // Search in adaptive recommendations
    if (adaptiveRecommendations?.recommendations?.selectedMethodologies?.methodologies) {
      const methodologies = adaptiveRecommendations.recommendations.selectedMethodologies.methodologies;
      for (const [principle, methodologyList] of Object.entries(methodologies)) {
        for (const methodology of methodologyList) {
          if (methodology.id === activityId || `methodology_${methodology.name}` === activityId) {
            return {
              id: activityId,
              title: methodology.methodology.activity_structure?.name || methodology.name,
              description: methodology.methodology.activity_structure?.description || '',
              duration: methodology.adaptedParameters?.base_duration || 30,
              category: 'Methodology-Based',
              principle,
              methodologyMeta: methodology
            };
          }
        }
      }
    }

    return null;
  };

  const renderSmartView = () => {
    if (!enhancedActivities?.activities) return null;

    return (
      <div className="space-y-6">
        {/* Enhanced Activities Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">AI-Enhanced Activities</h3>
            {enhancedActivities.methodologyIntegration && (
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                Methodology-Integrated
              </span>
            )}
          </div>
          <p className="text-blue-700 text-sm">
            Research-based activities selected specifically for your lesson context
          </p>
        </div>

        {/* Activity Grid */}
        <div className="grid gap-4">
          {enhancedActivities.activities.map((activity) => (
            <div 
              key={activity.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-gray-900">{activity.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(activity.category)}`}>
                      {activity.category}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(activity.difficulty)}`}>
                      {activity.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{activity.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{activity.duration} min</span>
                    </span>
                    {activity.ibSkills && activity.ibSkills.length > 0 && (
                      <span className="flex items-center space-x-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{activity.ibSkills.slice(0, 2).join(', ')}</span>
                      </span>
                    )}
                  </div>

                  {/* Methodology Integration Info */}
                  {activity.methodologyMeta && (
                    <div className="mt-3 p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                      <div className="flex items-center space-x-2 mb-1">
                        <Sparkles className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          Methodology: {activity.methodologyMeta.principle?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{activity.methodologyMeta.rationale}</p>
                    </div>
                  )}
                </div>
                
                <div className="ml-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    onChange={(e) => handleActivityToggle(activity.id, e.target.checked)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAdaptiveView = () => {
    if (!adaptiveRecommendations) return null;

    const { recommendations, activitySequences, adaptiveInsights, personalizedTips } = adaptiveRecommendations;

    return (
      <div className="space-y-6">
        {/* Adaptive Insights */}
        {adaptiveInsights && adaptiveInsights.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center space-x-2 mb-3">
              <Lightbulb className="w-5 h-5 text-purple-600" />
              <h3 className="font-semibold text-purple-800">Personalized Insights</h3>
            </div>
            <div className="space-y-2">
              {adaptiveInsights.map((insight, index) => (
                <div key={index} className="bg-white p-3 rounded border border-purple-100">
                  <h4 className="font-medium text-purple-800 text-sm">{insight.title}</h4>
                  <p className="text-purple-700 text-xs mt-1">{insight.message}</p>
                  {insight.suggestion && (
                    <p className="text-purple-600 text-xs mt-1 italic">💡 {insight.suggestion}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Sequences */}
        {activitySequences && (
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-3">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <h3 className="font-semibold text-green-800">Recommended Lesson Sequence</h3>
            </div>
            
            <div className="space-y-3">
              {activitySequences.optimal?.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 bg-white p-3 rounded border border-green-100">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-medium text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-green-800">{activity.title}</h4>
                      <span className="text-green-600 text-sm">({activity.duration} min)</span>
                    </div>
                    <p className="text-green-700 text-sm">{activity.rationale}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personalized Tips */}
        {personalizedTips && personalizedTips.length > 0 && (
          <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-5 h-5 text-amber-600" />
              <h3 className="font-semibold text-amber-800">Personalized Teaching Tips</h3>
            </div>
            <div className="space-y-2">
              {personalizedTips.map((tip, index) => (
                <div key={index} className="bg-white p-3 rounded border border-amber-100">
                  <span className="inline-block bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium mb-2">
                    {tip.category}
                  </span>
                  <p className="text-amber-800 text-sm font-medium">{tip.tip}</p>
                  <p className="text-amber-700 text-xs mt-1">{tip.rationale}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMethodologyView = () => {
    if (!adaptiveRecommendations?.recommendations?.selectedMethodologies?.methodologies) return null;

    const methodologies = adaptiveRecommendations.recommendations.selectedMethodologies.methodologies;

    return (
      <div className="space-y-6">
        {Object.entries(methodologies).map(([principle, methodologyList]) => (
          <div key={principle} className="border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                {getPrincipleIcon(principle)}
                <h3 className="font-medium text-gray-900 capitalize">
                  {principle.replace(/_/g, ' ')}
                </h3>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {methodologyList.length} methodologies
                </span>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              {methodologyList.map((methodology, index) => (
                <div 
                  key={index}
                  className="border border-gray-100 rounded p-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {methodology.methodology.activity_structure?.name || methodology.name}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        {methodology.methodology.activity_structure?.description || ''}
                      </p>
                      
                      {/* Research Foundation */}
                      {methodology.methodology.theoretical_foundation && (
                        <div className="bg-blue-50 p-2 rounded text-xs mb-2">
                          <span className="font-medium text-blue-800">Research Base: </span>
                          <span className="text-blue-700">
                            {methodology.methodology.theoretical_foundation.source}
                          </span>
                        </div>
                      )}

                      {/* Implementation Phases */}
                      {methodology.methodology.activity_structure?.implementation_phases && (
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Phases: </span>
                          {methodology.methodology.activity_structure.implementation_phases.length} structured steps
                        </div>
                      )}

                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Score: {Math.round(methodology.score * 100)}%</span>
                        {methodology.adaptedParameters?.base_duration && (
                          <span>Duration: {methodology.adaptedParameters.base_duration} min</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        onChange={(e) => handleActivityToggle(
                          `methodology_${methodology.name}`, 
                          e.target.checked
                        )}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Opening': 'bg-green-100 text-green-800',
      'Main Activity': 'bg-blue-100 text-blue-800',
      'Assessment': 'bg-purple-100 text-purple-800',
      'Closing': 'bg-orange-100 text-orange-800',
      'Support Activity': 'bg-yellow-100 text-yellow-800',
      'Methodology-Based': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-700',
      'intermediate': 'bg-yellow-100 text-yellow-700',
      'advanced': 'bg-red-100 text-red-700'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-700';
  };

  const getPrincipleIcon = (principle) => {
    const icons = {
      'inquiry_based': <Target className="w-5 h-5 text-blue-600" />,
      'conceptual_understanding': <Brain className="w-5 h-5 text-purple-600" />,
      'contextual_learning': <Globe className="w-5 h-5 text-green-600" />,
      'collaborative_learning': <Users className="w-5 h-5 text-orange-600" />,
      'differentiated_learning': <Sparkles className="w-5 h-5 text-pink-600" />,
      'assessment_informed': <BarChart3 className="w-5 h-5 text-indigo-600" />
    };
    return icons[principle] || <BookOpen className="w-5 h-5 text-gray-600" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Generating AI-enhanced activities...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Brain className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Enhanced Activity Selection</h2>
            <p className="text-gray-600">AI-powered recommendations based on IB methodology research</p>
          </div>
        </div>

        {/* Adaptation Level Indicator */}
        {adaptiveRecommendations?.metadata?.adaptationLevel && (
          <div className="text-right">
            <div className="text-sm text-gray-500">Adaptation Level</div>
            <div className={`font-medium ${
              adaptiveRecommendations.metadata.adaptationLevel.level === 'high' ? 'text-green-600' :
              adaptiveRecommendations.metadata.adaptationLevel.level === 'medium' ? 'text-yellow-600' :
              'text-gray-600'
            }`}>
              {adaptiveRecommendations.metadata.adaptationLevel.level.toUpperCase()}
            </div>
            <div className="text-xs text-gray-500">
              {adaptiveRecommendations.metadata.adaptationLevel.score}% personalized
            </div>
          </div>
        )}
      </div>

      {/* View Mode Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setViewMode('smart')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'smart'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Smart Activities
        </button>
        <button
          onClick={() => setViewMode('adaptive')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'adaptive'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Adaptive Insights
        </button>
        <button
          onClick={() => setViewMode('methodology')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            viewMode === 'methodology'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Methodologies
        </button>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'smart' && renderSmartView()}
      {viewMode === 'adaptive' && renderAdaptiveView()}
      {viewMode === 'methodology' && renderMethodologyView()}

      {/* Selection Summary */}
      {selectedActivities.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800">
                {selectedActivities.length} activities selected
              </h3>
              <p className="text-blue-700 text-sm">
                Total duration: {selectedActivities.reduce((sum, a) => sum + (a.duration || 0), 0)} minutes
              </p>
            </div>
            <button
              onClick={() => onActivitiesGenerated(selectedActivities)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Use Selected Activities
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedActivitySelector;