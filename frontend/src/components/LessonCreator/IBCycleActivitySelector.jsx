import React, { useState, useEffect } from 'react';
import { Search, Clock, Users, Target, CheckCircle, Lightbulb, Filter, Info } from 'lucide-react';

const IBCycleActivitySelector = ({ tags, selections, onActivitiesSelected }) => {
  const [activities, setActivities] = useState({
    inquiry: [],
    action: [],
    reflection: []
  });
  const [selectedActivities, setSelectedActivities] = useState({
    inquiry: [],
    action: [],
    reflection: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showRationales, setShowRationales] = useState(false);

  useEffect(() => {
    if (tags && selections && Object.keys(selections).length > 0) {
      generateIBCycleActivities();
    } else {
      setIsLoading(false);
      const fallbackActivities = generateMockIBActivities();
      setActivities(fallbackActivities);
    }
  }, [tags, selections]);

  const generateIBCycleActivities = async () => {
    setIsLoading(true);
    try {
      console.log('Generating IB Cycle activities...', { tags, selections });
      
      const response = await fetch('http://localhost:3001/api/lesson-creation/ib-activities/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: tags,
          selections: selections,
          subject: 'history'
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate IB activities');
      }

      console.log('IB activities generated successfully');
      setActivities(data.data.activities);
      
    } catch (error) {
      console.error('Error generating IB activities:', error);
      console.log('Using fallback IB activities instead');
      const fallbackActivities = generateMockIBActivities();
      setActivities(fallbackActivities);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockIBActivities = () => {
    const paperFocus = tags?.paper || 'paper1';
    const topic = tags?.syllabusSection || 'Historical Topic';
    
    return {
      inquiry: [
        {
          id: 'inquiry-1',
          title: 'Provocative Question Hook',
          description: `What if ${topic} had developed differently? Opening discussion to spark curiosity`,
          duration: 10,
          rationale: 'Engages students immediately and activates prior knowledge while setting up the central inquiry',
          materials: ['Discussion prompts', 'Visual stimulus'],
          ibSkills: ['Critical thinking', 'Questioning'],
          selected: false
        },
        {
          id: 'inquiry-2',
          title: 'Source Mystery',
          description: 'Students examine an intriguing primary source without context to generate questions',
          duration: 15,
          rationale: 'Develops observation skills and natural questioning before formal analysis',
          materials: ['Mystery source', 'Observation sheet'],
          ibSkills: ['Source analysis', 'Inquiry skills'],
          selected: false
        }
      ],
      action: [
        {
          id: 'action-1',
          title: paperFocus === 'paper1' ? 'OPCVL Source Analysis Workshop' : 'Structured Essay Planning',
          description: paperFocus === 'paper1' 
            ? 'Students work in stations analyzing different sources using OPCVL method'
            : 'Collaborative planning of comparative essay with thesis development',
          duration: 30,
          rationale: `Develops core ${paperFocus.toUpperCase()} skills through structured practice`,
          materials: paperFocus === 'paper1' ? ['Source packets', 'OPCVL worksheets'] : ['Essay planning templates', 'Comparison charts'],
          ibSkills: paperFocus === 'paper1' ? ['Source analysis', 'Critical evaluation'] : ['Written communication', 'Argumentation'],
          selected: false
        },
        {
          id: 'action-2',
          title: 'Structured Historical Debate',
          description: 'Students represent different perspectives using evidence to support their positions',
          duration: 35,
          rationale: 'Develops argumentation skills and understanding of multiple perspectives',
          materials: ['Evidence packs', 'Debate structure guide'],
          ibSkills: ['Oral communication', 'Perspective analysis'],
          selected: false
        },
        {
          id: 'action-3',
          title: 'Collaborative Timeline Analysis',
          description: 'Groups create detailed timelines showing causation and consequence patterns',
          duration: 25,
          rationale: 'Builds chronological thinking and cause-effect understanding',
          materials: ['Timeline templates', 'Event cards'],
          ibSkills: ['Chronological thinking', 'Collaboration'],
          selected: false
        }
      ],
      reflection: [
        {
          id: 'reflection-1',
          title: 'Success Criteria Self-Assessment',
          description: 'Students evaluate their learning against lesson objectives using exit tickets',
          duration: 10,
          rationale: 'Promotes metacognition and helps students track their progress',
          materials: ['Success criteria checklist', 'Exit tickets'],
          ibSkills: ['Self-management', 'Reflection'],
          selected: false
        },
        {
          id: 'reflection-2',
          title: 'Synthesis Paragraph',
          description: 'Students write a paragraph connecting today\'s learning to broader historical patterns',
          duration: 15,
          rationale: 'Consolidates learning and develops written communication skills',
          materials: ['Synthesis prompts', 'Paragraph structure guide'],
          ibSkills: ['Written communication', 'Transfer skills'],
          selected: false
        }
      ]
    };
  };

  const handleActivityToggle = (phase, activityId) => {
    setSelectedActivities(prev => {
      const currentPhase = prev[phase] || [];
      const isSelected = currentPhase.some(a => a.id === activityId);
      const activity = activities[phase].find(a => a.id === activityId);
      
      let newPhase;
      if (isSelected) {
        newPhase = currentPhase.filter(a => a.id !== activityId);
      } else {
        newPhase = [...currentPhase, activity];
      }
      
      const newSelected = { ...prev, [phase]: newPhase };
      
      // Update parent component with flattened array
      const allSelected = [
        ...newSelected.inquiry,
        ...newSelected.action,
        ...newSelected.reflection
      ];
      onActivitiesSelected(allSelected);
      
      return newSelected;
    });
  };

  const getPhaseRequirements = () => {
    return {
      inquiry: { min: 1, max: 1, current: selectedActivities.inquiry.length },
      action: { min: 1, max: 2, current: selectedActivities.action.length },
      reflection: { min: 1, max: 1, current: selectedActivities.reflection.length }
    };
  };

  const getTotalDuration = () => {
    const allSelected = [
      ...selectedActivities.inquiry,
      ...selectedActivities.action,
      ...selectedActivities.reflection
    ];
    return allSelected.reduce((sum, activity) => sum + (activity.duration || 0), 0);
  };

  const isValidSelection = () => {
    const reqs = getPhaseRequirements();
    return reqs.inquiry.current >= reqs.inquiry.min &&
           reqs.action.current >= reqs.action.min &&
           reqs.reflection.current >= reqs.reflection.min;
  };

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'inquiry': return <Search className="w-5 h-5" />;
      case 'action': return <Target className="w-5 h-5" />;
      case 'reflection': return <Lightbulb className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'inquiry': return 'blue';
      case 'action': return 'green';
      case 'reflection': return 'purple';
      default: return 'gray';
    }
  };

  const renderPhaseSection = (phase, title, description, timeRange) => {
    const reqs = getPhaseRequirements()[phase];
    const color = getPhaseColor(phase);
    const phaseActivities = activities[phase] || [];

    return (
      <div className="space-y-4">
        <div className={`bg-${color}-50 p-4 rounded-lg border border-${color}-200`}>
          <div className="flex items-center justify-between mb-2">
            <h4 className={`font-semibold text-${color}-800 flex items-center`}>
              {getPhaseIcon(phase)}
              <span className="ml-2">{title}</span>
              <span className="ml-2 text-sm font-normal">({timeRange})</span>
            </h4>
            <div className="flex items-center space-x-2">
              <span className={`text-sm text-${color}-600`}>
                Selected: {reqs.current}/{reqs.max}
                {reqs.current < reqs.min && <span className="text-red-600 ml-1">*Required</span>}
              </span>
            </div>
          </div>
          <p className={`text-${color}-700 text-sm`}>{description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {phaseActivities.map(activity => {
            const isSelected = selectedActivities[phase].some(a => a.id === activity.id);
            const color = getPhaseColor(phase);
            
            return (
              <div
                key={activity.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected 
                    ? `border-${color}-500 bg-${color}-50 shadow-md` 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => handleActivityToggle(phase, activity.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h5 className="font-semibold text-gray-800">{activity.title}</h5>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {activity.duration} min
                    </span>
                    {isSelected && <CheckCircle className={`w-5 h-5 text-${color}-600`} />}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3">{activity.description}</p>

                {showRationales && (
                  <div className="mb-3 p-2 bg-blue-50 rounded text-sm">
                    <strong className="text-blue-800">Why this activity:</strong>
                    <p className="text-blue-700">{activity.rationale}</p>
                  </div>
                )}

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium text-gray-700">IB Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activity.ibSkills?.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {activity.materials && (
                    <div>
                      <span className="font-medium text-gray-700">Materials:</span>
                      <p className="text-gray-600">{activity.materials.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Generating IB Cycle activities based on your selections...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Build Your IB History Lesson
          </h3>
          <p className="text-gray-600">
            Select activities for each phase of the IB learning cycle. Each phase builds on the previous one.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowRationales(!showRationales)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              showRationales 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>{showRationales ? 'Hide' : 'Show'} Rationales</span>
          </button>
        </div>
      </div>

      {/* Selection Summary */}
      {isValidSelection() && (
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            Valid IB Lesson Structure
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-700">Total Duration:</span>
              <p className="text-green-600">{getTotalDuration()} minutes</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Target Duration:</span>
              <p className="text-green-600">{tags?.duration || '90'} minutes</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Balance:</span>
              <p className="text-green-600">All phases covered ✓</p>
            </div>
          </div>
        </div>
      )}

      {/* Activity Phases */}
      <div className="space-y-8">
        {renderPhaseSection(
          'inquiry',
          'INQUIRY PHASE',
          'Hook students and establish the central question or problem to investigate',
          '10-15 min'
        )}

        {renderPhaseSection(
          'action',
          'ACTION PHASE',
          'Main learning activities where students actively engage with content and develop skills',
          '60-70 min'
        )}

        {renderPhaseSection(
          'reflection',
          'REFLECTION PHASE',
          'Consolidate learning and connect to broader understanding',
          '10-15 min'
        )}
      </div>

      {/* Validation Message */}
      {!isValidSelection() && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-800 mb-2">Selection Requirements</h4>
          <p className="text-yellow-700 text-sm mb-2">
            Please select at least one activity from each phase to create a balanced IB lesson:
          </p>
          <ul className="text-yellow-700 text-sm space-y-1">
            {getPhaseRequirements().inquiry.current === 0 && <li>• Select 1 Inquiry activity</li>}
            {getPhaseRequirements().action.current === 0 && <li>• Select 1-2 Action activities</li>}
            {getPhaseRequirements().reflection.current === 0 && <li>• Select 1 Reflection activity</li>}
          </ul>
        </div>
      )}
    </div>
  );
};

export default IBCycleActivitySelector;