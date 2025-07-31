import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  Target,
  Users,
  BarChart3,
  BookOpen,
  Globe,
  Brain,
  ArrowRight
} from 'lucide-react';

const LessonEnhancement = ({ lessonPlan, onEnhancementApplied }) => {
  const [loading, setLoading] = useState(false);
  const [enhancement, setEnhancement] = useState(null);
  const [selectedImprovements, setSelectedImprovements] = useState([]);
  const [activeTab, setActiveTab] = useState('analysis');

  useEffect(() => {
    if (lessonPlan) {
      analyzeLessonQuality();
    }
  }, [lessonPlan]);

  const analyzeLessonQuality = async () => {
    setLoading(true);
    try {
      console.log('🔍 Analyzing lesson quality...');
      
      const response = await fetch('/api/enhanced-lessons/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonPlan,
          enhancementOptions: {
            includeMethodologyUpgrades: true,
            focusOnWeakPrinciples: true,
            provideImplementationGuidance: true
          }
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setEnhancement(data.enhancement);
        console.log('✅ Lesson analysis complete');
      } else {
        console.error('❌ Failed to analyze lesson:', data.error);
      }
    } catch (error) {
      console.error('❌ Error analyzing lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImprovementToggle = (improvementId, isSelected) => {
    if (isSelected) {
      setSelectedImprovements(prev => [...prev, improvementId]);
    } else {
      setSelectedImprovements(prev => prev.filter(id => id !== improvementId));
    }
  };

  const applySelectedImprovements = () => {
    if (selectedImprovements.length > 0 && enhancement) {
      const selectedDetails = [];
      
      // Collect selected improvements from all categories
      Object.values(enhancement.improvements).forEach(category => {
        if (Array.isArray(category)) {
          category.forEach(improvement => {
            if (selectedImprovements.includes(improvement.type)) {
              selectedDetails.push(improvement);
            }
          });
        }
      });

      onEnhancementApplied({
        originalLesson: lessonPlan,
        appliedImprovements: selectedDetails,
        enhancementSummary: enhancement.enhancementSummary,
        implementationGuidance: enhancement.implementationGuidance
      });
    }
  };

  const renderQualityAnalysis = () => {
    if (!enhancement?.qualityAnalysis) return null;

    const { overallScore, principleScores, strengths, improvements, checklistResults } = enhancement.qualityAnalysis;

    return (
      <div className="space-y-6">
        {/* Overall Score */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Overall IB Quality Score</h3>
              <p className="text-blue-700 text-sm">Based on IB teaching principles assessment</p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
                {overallScore}%
              </div>
              <div className="text-sm text-gray-600">
                {getScoreDescription(overallScore)}
              </div>
            </div>
          </div>
        </div>

        {/* Principle Scores */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">IB Teaching Principles Analysis</h3>
          <div className="space-y-4">
            {Object.entries(principleScores).map(([principle, score]) => (
              <div key={principle} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getPrincipleIcon(principle)}
                  <span className="font-medium text-gray-700 capitalize">
                    {principle.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getScoreBarColor(score)}`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <span className={`font-medium ${getScoreColor(score)}`}>
                    {score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        {strengths.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">Lesson Strengths</h3>
            </div>
            <div className="space-y-3">
              {strengths.map((strength, index) => (
                <div key={index} className="bg-white p-3 rounded border border-green-100">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-800 capitalize">
                      {strength.principle.replace(/_/g, ' ')}
                    </span>
                    <span className="text-green-600 font-medium">{strength.score}%</span>
                  </div>
                  <p className="text-green-700 text-sm mt-1">{strength.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Areas for Improvement */}
        {improvements.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-yellow-800">Areas for Improvement</h3>
            </div>
            <div className="space-y-3">
              {improvements.map((improvement, index) => (
                <div key={index} className="bg-white p-3 rounded border border-yellow-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-yellow-800 capitalize">
                      {improvement.principle.replace(/_/g, ' ')}
                    </span>
                    <span className="text-yellow-600 font-medium">{improvement.score}%</span>
                  </div>
                  <p className="text-yellow-700 text-sm mb-2">{improvement.description}</p>
                  {improvement.suggestions && (
                    <ul className="text-yellow-600 text-xs space-y-1">
                      {improvement.suggestions.slice(0, 2).map((suggestion, i) => (
                        <li key={i} className="flex items-start space-x-1">
                          <span>•</span>
                          <span>{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checklist Results */}
        {checklistResults && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">IB Quality Checklist</h3>
              <div className="text-right">
                <div className="text-lg font-bold text-blue-600">
                  {checklistResults.passedItems}/{checklistResults.totalItems}
                </div>
                <div className="text-sm text-gray-600">
                  {checklistResults.passedPercentage}% complete
                </div>
              </div>
            </div>
            
            {checklistResults.failedItems.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-700 mb-2">Missing Elements:</h4>
                <div className="space-y-2">
                  {checklistResults.failedItems.slice(0, 3).map((item, index) => (
                    <div key={index} className="bg-white p-2 rounded text-sm">
                      <p className="text-gray-600">{item.criterion.replace(/_/g, ' ')}</p>
                      {item.suggestion && (
                        <p className="text-blue-600 text-xs mt-1">💡 {item.suggestion}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderImprovements = () => {
    if (!enhancement?.improvements) return null;

    const { structural, pedagogical, assessment, differentiation, resources } = enhancement.improvements;
    const allImprovements = [...structural, ...pedagogical, ...assessment, ...differentiation, ...resources];

    return (
      <div className="space-y-6">
        {/* Improvement Categories */}
        {[
          { key: 'structural', title: 'Structural Improvements', items: structural, icon: BookOpen },
          { key: 'pedagogical', title: 'Pedagogical Enhancements', items: pedagogical, icon: Brain },
          { key: 'assessment', title: 'Assessment Integration', items: assessment, icon: BarChart3 },
          { key: 'differentiation', title: 'Differentiation Strategies', items: differentiation, icon: Users },
          { key: 'resources', title: 'Resource Enhancements', items: resources, icon: Globe }
        ].map(category => (
          category.items.length > 0 && (
            <div key={category.key} className="border border-gray-200 rounded-lg">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <category.icon className="w-5 h-5 text-gray-600" />
                  <h3 className="font-medium text-gray-900">{category.title}</h3>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                    {category.items.length} suggestions
                  </span>
                </div>
              </div>
              
              <div className="p-4 space-y-3">
                {category.items.map((improvement, index) => (
                  <div 
                    key={index}
                    className="border border-gray-100 rounded p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium text-gray-900">{improvement.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(improvement.priority)}`}>
                            {improvement.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{improvement.description}</p>
                        
                        {improvement.implementation && (
                          <div className="bg-blue-50 p-2 rounded text-xs">
                            <span className="font-medium text-blue-800">Implementation: </span>
                            <span className="text-blue-700">{improvement.implementation}</span>
                          </div>
                        )}

                        {improvement.suggestedMethodologies && (
                          <div className="mt-2">
                            <span className="text-xs font-medium text-purple-700">Suggested Methodologies: </span>
                            <span className="text-xs text-purple-600">
                              {improvement.suggestedMethodologies.join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          onChange={(e) => handleImprovementToggle(improvement.type, e.target.checked)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    );
  };

  const renderSuggestedActivities = () => {
    if (!enhancement?.suggestedActivities) return null;

    return (
      <div className="space-y-6">
        {enhancement.suggestedActivities.map((suggestion, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {getPrincipleIcon(suggestion.principle)}
                <h3 className="font-medium text-gray-900 capitalize">
                  {suggestion.principle.replace(/_/g, ' ')}
                </h3>
              </div>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                Score boost needed
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4">{suggestion.reason}</p>
            
            <div className="space-y-3">
              {suggestion.activities.map((activity, actIndex) => (
                <div key={actIndex} className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-800 mb-1">{activity.title}</h4>
                  <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Duration: {activity.duration} minutes</span>
                    <span>{activity.rationale}</span>
                  </div>
                  {activity.implementation && (
                    <div className="mt-2 text-xs text-blue-600">
                      <ArrowRight className="w-3 h-3 inline mr-1" />
                      {activity.implementation}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderImplementationGuidance = () => {
    if (!enhancement?.implementationGuidance) return null;

    const { phaseOne, phaseTwo, phaseThree, timeline, resources } = enhancement.implementationGuidance;

    return (
      <div className="space-y-6">
        {/* Timeline Overview */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2 mb-2">
            <Target className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">Implementation Timeline</h3>
          </div>
          <p className="text-green-700">{timeline}</p>
        </div>

        {/* Implementation Phases */}
        {[
          { title: 'Phase 1: High Priority Changes', items: phaseOne, color: 'red' },
          { title: 'Phase 2: Pedagogical Enhancements', items: phaseTwo, color: 'yellow' },
          { title: 'Phase 3: Resource & Extension', items: phaseThree, color: 'green' }
        ].map((phase, index) => (
          phase.items.length > 0 && (
            <div key={index} className={`border border-${phase.color}-200 rounded-lg`}>
              <div className={`bg-${phase.color}-50 px-4 py-3 border-b border-${phase.color}-200`}>
                <h3 className={`font-medium text-${phase.color}-800`}>{phase.title}</h3>
              </div>
              <div className="p-4 space-y-2">
                {phase.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-6 h-6 bg-${phase.color}-100 rounded-full flex items-center justify-center text-${phase.color}-600 font-medium text-xs`}>
                      {itemIndex + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-gray-600 text-xs">{item.implementation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}

        {/* Recommended Resources */}
        {resources && resources.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium text-blue-800">Recommended Resources</h3>
            </div>
            <ul className="space-y-1">
              {resources.map((resource, index) => (
                <li key={index} className="text-blue-700 text-sm flex items-center space-x-2">
                  <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                  <span>{resource}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreDescription = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    if (score >= 50) return 'Developing';
    return 'Needs Work';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
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
        <span className="ml-3 text-gray-600">Analyzing lesson quality...</span>
      </div>
    );
  }

  if (!enhancement) {
    return (
      <div className="text-center py-8">
        <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600">Ready to Enhance</h3>
        <p className="text-gray-500 mt-2">Provide a lesson plan to get AI-powered enhancement suggestions</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Sparkles className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Lesson Enhancement</h2>
            <p className="text-gray-600">AI-powered analysis and improvement recommendations</p>
          </div>
        </div>

        {/* Enhancement Summary */}
        {enhancement.enhancementSummary && (
          <div className="text-right">
            <div className="text-sm text-gray-500">Overall Assessment</div>
            <div className="font-medium text-gray-800">
              {enhancement.enhancementSummary.overallAssessment}
            </div>
            <div className="text-xs text-gray-500">
              {enhancement.enhancementSummary.estimatedImprovementTime}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        {[
          { key: 'analysis', label: 'Quality Analysis', icon: BarChart3 },
          { key: 'improvements', label: 'Improvements', icon: TrendingUp },
          { key: 'activities', label: 'Suggested Activities', icon: Lightbulb },
          { key: 'guidance', label: 'Implementation', icon: Target }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
              activeTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'analysis' && renderQualityAnalysis()}
      {activeTab === 'improvements' && renderImprovements()}
      {activeTab === 'activities' && renderSuggestedActivities()}
      {activeTab === 'guidance' && renderImplementationGuidance()}

      {/* Apply Improvements Button */}
      {selectedImprovements.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-800">
                {selectedImprovements.length} improvements selected
              </h3>
              <p className="text-blue-700 text-sm">
                Ready to apply selected enhancements to your lesson
              </p>
            </div>
            <button
              onClick={applySelectedImprovements}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply Enhancements</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonEnhancement;