import React, { useState } from 'react';
import { Target, Brain, Users, ClipboardCheck, Lightbulb } from 'lucide-react';

const StrategicSelections = ({ tags, onSelectionsUpdate }) => {
  const [selections, setSelections] = useState({
    conceptualFocus: [],
    atlSkills: [],
    teachingPreference: '',
    assessmentFocus: '',
    historicalThinking: ''
  });

  const conceptualOptions = [
    { id: 'change-continuity', label: 'Change and Continuity', description: 'What changed? What stayed the same? Why?' },
    { id: 'causation', label: 'Causation (short/long term)', description: 'Why did events happen? Multiple causes and their significance' },
    { id: 'consequence', label: 'Consequence (intended/unintended)', description: 'What were the results? Expected vs unexpected outcomes' },
    { id: 'significance', label: 'Significance', description: 'Why does this matter? Historical importance and impact' },
    { id: 'perspectives', label: 'Perspectives', description: 'Different viewpoints and how they shaped events' },
    { id: 'power-authority', label: 'Power and Authority', description: 'Who had power? How was it used and challenged?' },
    { id: 'conflict-cooperation', label: 'Conflict and Cooperation', description: 'Tensions, alliances, and resolution attempts' }
  ];

  const atlSkillsOptions = [
    { id: 'critical-thinking', label: 'Critical Thinking', description: 'Analysis, evaluation, and reasoned judgment' },
    { id: 'source-analysis', label: 'Source Analysis', description: 'OPCVL and evidence evaluation skills' },
    { id: 'research-skills', label: 'Research Skills', description: 'Information gathering and synthesis' },
    { id: 'written-communication', label: 'Communication (written)', description: 'Essay writing and structured arguments' },
    { id: 'oral-communication', label: 'Communication (oral)', description: 'Discussion, debate, and presentation skills' },
    { id: 'collaboration', label: 'Collaboration', description: 'Group work and peer learning' },
    { id: 'self-management', label: 'Self-Management', description: 'Organization and independent learning' },
    { id: 'transfer-skills', label: 'Transfer Skills', description: 'Applying learning to new contexts' }
  ];

  const teachingOptions = [
    { id: 'flipped', label: 'Flipped Learning', description: '30 min pre-reading, application focus in class' },
    { id: 'traditional', label: 'Full In-Class Instruction', description: 'Content delivery and practice in class' },
    { id: 'hybrid', label: 'Hybrid Approach', description: 'Mix of content delivery and application' }
  ];

  const assessmentOptions = [
    { id: 'formative', label: 'Formative - Skill Building', description: 'Practice and feedback for improvement' },
    { id: 'summative', label: 'Summative - Paper Practice', description: 'Assessment preparation and evaluation' },
    { id: 'diagnostic', label: 'Diagnostic - Check Understanding', description: 'Identify gaps and misconceptions' },
    { id: 'peer-self', label: 'Peer/Self Assessment', description: 'Student-led evaluation and reflection' }
  ];

  const historicalThinkingOptions = [
    { id: 'evidence-reasoning', label: 'Evidence-Based Reasoning', description: 'Using sources to support arguments' },
    { id: 'chronological', label: 'Chronological Thinking', description: 'Understanding sequence and causation' },
    { id: 'comparison', label: 'Comparison/Contextualization', description: 'Connecting events across time and place' },
    { id: 'argumentation', label: 'Historical Argumentation', description: 'Building and defending historical claims' },
    { id: 'interpretation', label: 'Interpretation/Synthesis', description: 'Making meaning from multiple sources' }
  ];

  const handleConceptualChange = (conceptId) => {
    setSelections(prev => {
      const newConceptual = prev.conceptualFocus.includes(conceptId)
        ? prev.conceptualFocus.filter(id => id !== conceptId)
        : prev.conceptualFocus.length < 2
          ? [...prev.conceptualFocus, conceptId]
          : [prev.conceptualFocus[1], conceptId]; // Keep only 2, replace oldest
      
      const newSelections = { ...prev, conceptualFocus: newConceptual };
      onSelectionsUpdate(newSelections);
      return newSelections;
    });
  };

  const handleATLChange = (skillId) => {
    setSelections(prev => {
      const newATL = prev.atlSkills.includes(skillId)
        ? prev.atlSkills.filter(id => id !== skillId)
        : prev.atlSkills.length < 2
          ? [...prev.atlSkills, skillId]
          : [prev.atlSkills[1], skillId]; // Keep only 2, replace oldest
      
      const newSelections = { ...prev, atlSkills: newATL };
      onSelectionsUpdate(newSelections);
      return newSelections;
    });
  };

  const handleSingleChange = (field, value) => {
    const newSelections = { ...selections, [field]: value };
    setSelections(newSelections);
    onSelectionsUpdate(newSelections);
  };

  const getSelectedCount = (array, max) => `${array.length}/${max}`;

  const isReadyToGenerate = () => {
    return selections.conceptualFocus.length > 0 &&
           selections.atlSkills.length > 0 &&
           selections.assessmentFocus &&
           selections.historicalThinking;
  };

  // Adjust recommendations based on paper type
  const getPaperSpecificRecommendations = () => {
    if (!tags?.paper) return null;
    
    const recommendations = {
      paper1: {
        atlSkills: ['source-analysis', 'critical-thinking'],
        historicalThinking: 'evidence-reasoning',
        concepts: ['perspectives', 'significance']
      },
      paper2: {
        atlSkills: ['written-communication', 'critical-thinking'],
        historicalThinking: 'argumentation',
        concepts: ['causation', 'consequence']
      },
      paper3: {
        atlSkills: ['research-skills', 'critical-thinking'],
        historicalThinking: 'interpretation',
        concepts: ['change-continuity', 'significance']
      }
    };
    
    return recommendations[tags.paper];
  };

  const recommendations = getPaperSpecificRecommendations();

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          <Target className="w-5 h-5 mr-2 text-blue-600" />
          Learning Priorities
        </h3>
        <p className="text-gray-600 mb-4">
          Select your key priorities to generate targeted activities. Quick selections using tick boxes ensure your lesson focuses on what matters most.
        </p>
        
        {recommendations && (
          <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-amber-800 mb-2 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2" />
              Recommended for {tags.paper?.toUpperCase()}
            </h4>
            <p className="text-amber-700 text-sm">
              Based on your paper selection, we recommend focusing on specific skills and concepts for optimal preparation.
            </p>
          </div>
        )}
      </div>

      {/* Conceptual Focus */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-800 flex items-center">
            <Brain className="w-4 h-4 mr-2" />
            Conceptual Focus
          </h4>
          <span className="text-sm text-gray-500">Select 1-2 ({getSelectedCount(selections.conceptualFocus, 2)})</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {conceptualOptions.map((concept) => (
            <label
              key={concept.id}
              className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                selections.conceptualFocus.includes(concept.id)
                  ? 'border-blue-500 bg-blue-50'
                  : recommendations?.concepts.includes(concept.id)
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selections.conceptualFocus.includes(concept.id)}
                onChange={() => handleConceptualChange(concept.id)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-800 flex items-center">
                  {concept.label}
                  {recommendations?.concepts.includes(concept.id) && (
                    <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded">Recommended</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{concept.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* ATL Skills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-800 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            ATL Skills Priority
          </h4>
          <span className="text-sm text-gray-500">Select 1-2 ({getSelectedCount(selections.atlSkills, 2)})</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {atlSkillsOptions.map((skill) => (
            <label
              key={skill.id}
              className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                selections.atlSkills.includes(skill.id)
                  ? 'border-blue-500 bg-blue-50'
                  : recommendations?.atlSkills.includes(skill.id)
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <input
                type="checkbox"
                checked={selections.atlSkills.includes(skill.id)}
                onChange={() => handleATLChange(skill.id)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-800 flex items-center">
                  {skill.label}
                  {recommendations?.atlSkills.includes(skill.id) && (
                    <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded">Recommended</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{skill.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Teaching Preference */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800">Teaching Preferences</h4>
        <div className="space-y-2">
          {teachingOptions.map((option) => (
            <label
              key={option.id}
              className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                selections.teachingPreference === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <input
                type="radio"
                name="teachingPreference"
                value={option.id}
                checked={selections.teachingPreference === option.id}
                onChange={(e) => handleSingleChange('teachingPreference', e.target.value)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-800">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Assessment Focus */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800 flex items-center">
          <ClipboardCheck className="w-4 h-4 mr-2" />
          Assessment Focus
        </h4>
        <div className="space-y-2">
          {assessmentOptions.map((option) => (
            <label
              key={option.id}
              className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                selections.assessmentFocus === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <input
                type="radio"
                name="assessmentFocus"
                value={option.id}
                checked={selections.assessmentFocus === option.id}
                onChange={(e) => handleSingleChange('assessmentFocus', e.target.value)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-800">{option.label}</div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Historical Thinking */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800">Historical Thinking (Primary Focus)</h4>
        <div className="space-y-2">
          {historicalThinkingOptions.map((option) => (
            <label
              key={option.id}
              className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                selections.historicalThinking === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : recommendations?.historicalThinking === option.id
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <input
                type="radio"
                name="historicalThinking"
                value={option.id}
                checked={selections.historicalThinking === option.id}
                onChange={(e) => handleSingleChange('historicalThinking', e.target.value)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-800 flex items-center">
                  {option.label}
                  {recommendations?.historicalThinking === option.id && (
                    <span className="ml-2 text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded">Recommended</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Progress Summary */}
      {isReadyToGenerate() && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2">Ready to Generate Activities!</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-700">Conceptual Focus:</span>
              <p className="text-green-600">
                {selections.conceptualFocus.map(id => 
                  conceptualOptions.find(opt => opt.id === id)?.label
                ).join(', ')}
              </p>
            </div>
            <div>
              <span className="font-medium text-green-700">ATL Skills:</span>
              <p className="text-green-600">
                {selections.atlSkills.map(id => 
                  atlSkillsOptions.find(opt => opt.id === id)?.label
                ).join(', ')}
              </p>
            </div>
            <div>
              <span className="font-medium text-green-700">Assessment:</span>
              <p className="text-green-600">
                {assessmentOptions.find(opt => opt.id === selections.assessmentFocus)?.label}
              </p>
            </div>
            <div>
              <span className="font-medium text-green-700">Historical Thinking:</span>
              <p className="text-green-600">
                {historicalThinkingOptions.find(opt => opt.id === selections.historicalThinking)?.label}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategicSelections;