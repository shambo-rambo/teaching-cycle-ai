import React, { useState, useEffect } from 'react';
import { Clock, Users, Target, CheckCircle, Lightbulb, Filter } from 'lucide-react';

const ActivitySelector = ({ lessonData, onActivitiesSelected, subject }) => {
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  useEffect(() => {
    // Generate activities if we have a topic OR uploaded files/resources
    const hasTopic = lessonData && lessonData.topic && lessonData.topic.trim().length > 0;
    const hasResources = lessonData && lessonData.resources && lessonData.resources.length > 0;
    
    if (hasTopic || hasResources) {
      generateActivities();
    } else {
      console.log('Waiting for lesson topic or uploaded resources before generating activities...');
      setIsLoading(false);
      // Use fallback activities when no topic or resources are available
      const fallbackActivities = generateMockActivities(lessonData, subject);
      setActivities(fallbackActivities);
    }
  }, [lessonData, subject]);

  const generateActivities = async () => {
    setIsLoading(true);
    try {
      console.log('Generating lesson activities...', { 
        topic: lessonData?.topic, 
        hasLessonData: !!lessonData,
        hasResources: lessonData?.resources?.length > 0,
        resourceCount: lessonData?.resources?.length || 0,
        subject 
      });
      
      // Check we have either topic or resources
      const hasTopic = lessonData && lessonData.topic && lessonData.topic.trim().length > 0;
      const hasResources = lessonData && lessonData.resources && lessonData.resources.length > 0;
      
      if (!hasTopic && !hasResources) {
        throw new Error('Either lesson topic or uploaded resources are required to generate activities');
      }
      
      const response = await fetch('http://localhost:3001/api/lesson-creation/activities/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonData: lessonData,
          subject: subject
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate activities');
      }

      console.log('Activities generated successfully:', data.data.activities?.length || 0);
      setActivities(data.data.activities || []);
      
    } catch (error) {
      console.error('Error generating activities:', error);
      console.log('Using fallback activities instead');
      // Fallback to mock activities if API fails
      const mockActivities = generateMockActivities(lessonData, subject);
      setActivities(mockActivities);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockActivities = (data, subject) => {
    return [
      {
        id: 'pre-reading',
        title: 'Pre-class Reading Assignment',
        description: 'Students complete guided reading with accountability questions',
        duration: 30,
        category: 'Pre-class Preparation',
        learningObjectives: ['Build foundational knowledge', 'Prepare for class discussion'],
        materials: ['Reading materials', 'Guided questions worksheet'],
        difficulty: 'beginner',
        ibSkills: ['Knowledge acquisition', 'Reading comprehension'],
        selected: false
      },
      {
        id: 'hook-activity',
        title: 'Engaging Hook Activity',
        description: 'Provocative question or media to spark student interest',
        duration: 10,
        category: 'Opening',
        learningObjectives: ['Activate prior knowledge', 'Generate interest'],
        materials: ['Video clip or image', 'Discussion prompts'],
        difficulty: 'beginner',
        ibSkills: ['Engagement', 'Connection-making'],
        selected: false
      },
      {
        id: 'source-analysis',
        title: 'Primary Source Analysis Workshop',
        description: 'Students analyze primary sources using OPCVL method',
        duration: 25,
        category: 'Main Activity',
        learningObjectives: ['Develop source analysis skills', 'Understand historical perspectives'],
        materials: ['Primary source documents', 'OPCVL worksheet'],
        difficulty: 'intermediate',
        ibSkills: ['Source analysis', 'Critical thinking'],
        selected: false
      },
      {
        id: 'historical-debate',
        title: 'Structured Historical Debate',
        description: 'Students debate different historical perspectives using evidence',
        duration: 30,
        category: 'Main Activity',
        learningObjectives: ['Develop argumentation skills', 'Understand multiple perspectives'],
        materials: ['Evidence sheets', 'Debate structure guide'],
        difficulty: 'advanced',
        ibSkills: ['Argumentation', 'Perspective analysis'],
        selected: false
      },
      {
        id: 'collaborative-research',
        title: 'Collaborative Research Activity',
        description: 'Students work in groups to research different aspects of the topic',
        duration: 35,
        category: 'Main Activity',
        learningObjectives: ['Develop research skills', 'Foster collaboration'],
        materials: ['Research guides', 'Digital resources'],
        difficulty: 'intermediate',
        ibSkills: ['Research', 'Collaboration'],
        selected: false
      },
      {
        id: 'writing-practice',
        title: 'Historical Writing Practice',
        description: 'Students write analytical paragraphs with peer feedback',
        duration: 20,
        category: 'Assessment',
        learningObjectives: ['Develop writing skills', 'Apply historical analysis'],
        materials: ['Writing prompts', 'Peer feedback forms'],
        difficulty: 'intermediate',
        ibSkills: ['Written communication', 'Analysis'],
        selected: false
      },
      {
        id: 'timeline-creation',
        title: 'Interactive Timeline Creation',
        description: 'Students create digital or physical timelines with key events',
        duration: 25,
        category: 'Main Activity',
        learningObjectives: ['Understand chronology', 'Visualize historical development'],
        materials: ['Timeline templates', 'Event cards'],
        difficulty: 'beginner',
        ibSkills: ['Chronological thinking', 'Visual representation'],
        selected: false
      },
      {
        id: 'peer-assessment',
        title: 'Peer Assessment Activity',
        description: 'Students assess each other\'s work using structured criteria',
        duration: 15,
        category: 'Assessment',
        learningObjectives: ['Develop assessment skills', 'Provide feedback'],
        materials: ['Assessment rubrics', 'Feedback forms'],
        difficulty: 'intermediate',
        ibSkills: ['Peer evaluation', 'Constructive feedback'],
        selected: false
      },
      {
        id: 'synthesis-activity',
        title: 'Learning Synthesis & Reflection',
        description: 'Students consolidate learning and connect to bigger picture',
        duration: 15,
        category: 'Closing',
        learningObjectives: ['Consolidate learning', 'Make connections'],
        materials: ['Reflection prompts', 'Exit tickets'],
        difficulty: 'beginner',
        ibSkills: ['Synthesis', 'Reflection'],
        selected: false
      },
      {
        id: 'extension-research',
        title: 'Advanced Extension Research',
        description: 'Additional research project for advanced students',
        duration: 40,
        category: 'Extension',
        learningObjectives: ['Deepen understanding', 'Independent research'],
        materials: ['Research databases', 'Project guidelines'],
        difficulty: 'advanced',
        ibSkills: ['Independent research', 'Advanced analysis'],
        selected: false
      }
    ];
  };

  const handleActivityToggle = (activityId) => {
    const activity = activities.find(a => a.id === activityId);
    if (!activity) return;

    setSelectedActivities(prev => {
      const isSelected = prev.some(a => a.id === activityId);
      
      if (isSelected) {
        return prev.filter(a => a.id !== activityId);
      } else {
        return [...prev, activity];
      }
    });
  };

  // Update parent component when selectedActivities changes
  useEffect(() => {
    onActivitiesSelected(selectedActivities);
  }, [selectedActivities, onActivitiesSelected]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Pre-class Preparation': return <Clock className="w-4 h-4" />;
      case 'Opening': return <Lightbulb className="w-4 h-4" />;
      case 'Main Activity': return <Target className="w-4 h-4" />;
      case 'Assessment': return <CheckCircle className="w-4 h-4" />;
      case 'Closing': return <Users className="w-4 h-4" />;
      case 'Extension': return <Target className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const filteredActivities = activities.filter(activity => {
    const categoryMatch = filterCategory === 'all' || activity.category === filterCategory;
    const difficultyMatch = filterDifficulty === 'all' || activity.difficulty === filterDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const categories = [...new Set(activities.map(a => a.category))];
  const difficulties = [...new Set(activities.map(a => a.difficulty))];

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">
          {(lessonData?.topic && lessonData.topic.trim().length > 0) || (lessonData?.resources && lessonData.resources.length > 0) 
            ? 'Generating activity options...' 
            : 'Waiting for lesson topic or resources...'}
        </p>
      </div>
    );
  }

  // Show message if no topic or resources are available
  const hasTopic = lessonData && lessonData.topic && lessonData.topic.trim().length > 0;
  const hasResources = lessonData && lessonData.resources && lessonData.resources.length > 0;
  
  if (!hasTopic && !hasResources) {
    return (
      <div className="text-center py-8">
        <Target className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Topic or Resources Required
        </h3>
        <p className="text-gray-500 mb-2">
          Please provide either a lesson topic OR upload lesson materials in the previous step.
        </p>
        <div className="text-sm text-gray-400">
          <p>• Enter a topic in the text field, OR</p>
          <p>• Upload files or add resource links</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Select Activities for Your Lesson
        </h3>
        <p className="text-gray-600">
          Choose from the activities below to customize your lesson plan. You can select multiple activities from different categories.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <span className="font-medium text-gray-700">Filter Activities:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Difficulties</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Activities Summary */}
      {selectedActivities.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">
            Selected Activities ({selectedActivities.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedActivities.map(activity => (
              <span
                key={activity.id}
                className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1"
              >
                <span>{activity.title}</span>
                <span className="text-xs opacity-75">({activity.duration}min)</span>
              </span>
            ))}
          </div>
          <p className="text-blue-700 text-sm mt-2">
            Total estimated time: {selectedActivities.reduce((sum, a) => sum + a.duration, 0)} minutes
          </p>
        </div>
      )}

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActivities.map(activity => {
          const isSelected = selectedActivities.some(a => a.id === activity.id);
          
          return (
            <div
              key={activity.id}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}
              onClick={() => handleActivityToggle(activity.id)}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(activity.category)}
                  <h4 className="font-semibold text-gray-800 text-sm">{activity.title}</h4>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.difficulty)}`}>
                    {activity.difficulty}
                  </span>
                  {isSelected && <CheckCircle className="w-5 h-5 text-blue-600" />}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-3">{activity.description}</p>

              {/* Details */}
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{activity.duration} min</span>
                  </span>
                  <span className="text-blue-600 font-medium">{activity.category}</span>
                </div>
                
                {activity.learningObjectives && activity.learningObjectives.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">Objectives:</span>
                    <ul className="list-disc list-inside ml-2 text-gray-600">
                      {activity.learningObjectives.slice(0, 2).map((obj, index) => (
                        <li key={index}>{obj}</li>
                      ))}
                      {activity.learningObjectives.length > 2 && (
                        <li>+{activity.learningObjectives.length - 2} more...</li>
                      )}
                    </ul>
                  </div>
                )}

                {activity.ibSkills && activity.ibSkills.length > 0 && (
                  <div>
                    <span className="font-medium text-gray-700">IB Skills:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {activity.ibSkills.slice(0, 3).map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {activity.ibSkills.length > 3 && (
                        <span className="text-gray-500">+{activity.ibSkills.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No activities match your filters
          </h3>
          <p className="text-gray-500">
            Try adjusting your filter settings to see more activities.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActivitySelector;