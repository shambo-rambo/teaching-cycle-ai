import React from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const LessonPlanRenderer = ({ content }) => {
  // Parse the markdown content to identify lesson plan sections
  const sections = parseContent(content);
  
  if (sections.isLessonPlan) {
    return <StructuredLessonPlan sections={sections} />;
  }
  
  // Fallback to regular markdown rendering
  const renderMarkdownContent = (content) => {
    const rawHTML = marked(content);
    const cleanHTML = DOMPurify.sanitize(rawHTML);
    return { __html: cleanHTML };
  };

  return (
    <div 
      className="prose prose-sm max-w-none lesson-plan-content"
      dangerouslySetInnerHTML={renderMarkdownContent(content)}
    />
  );
};

const StructuredLessonPlan = ({ sections }) => {
  return (
    <div className="lesson-plan-structured">
      {/* Header */}
      <div className="lesson-header bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-2xl font-bold mb-2">{sections.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm opacity-90">
          <span>📚 {sections.subject}</span>
          <span>🎯 Year {sections.yearLevel}</span>
          <span>⏰ {sections.duration}</span>
          <span>📝 {sections.totalLessons} lessons</span>
        </div>
      </div>

      {/* Learning Objectives */}
      {sections.objectives && (
        <div className="objectives-card bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
          <h2 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
            🎯 Learning Objectives
          </h2>
          <ul className="space-y-2">
            {sections.objectives.map((obj, i) => (
              <li key={i} className="flex items-start">
                <span className="text-green-600 mr-2">•</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Writing Goal */}
      {sections.writingGoal && (
        <div className="writing-goal bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-purple-800 mb-2 flex items-center">
            📖 Writing Goal
          </h2>
          <p className="text-purple-700 italic">{sections.writingGoal}</p>
        </div>
      )}

      {/* Teaching Stages */}
      <div className="stages space-y-6">
        {sections.stages?.map((stage, index) => (
          <StageCard key={index} stage={stage} stageNumber={index + 1} />
        ))}
      </div>

      {/* Differentiation */}
      {sections.differentiation && (
        <div className="differentiation bg-orange-50 border border-orange-200 rounded-lg p-4 mt-6">
          <h2 className="text-lg font-semibold text-orange-800 mb-3 flex items-center">
            🔄 Differentiation Strategies
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h3 className="font-medium text-orange-700">Advanced Learners</h3>
              <p className="text-sm text-orange-600">{sections.differentiation.advanced}</p>
            </div>
            <div>
              <h3 className="font-medium text-orange-700">Struggling Learners</h3>
              <p className="text-sm text-orange-600">{sections.differentiation.struggling}</p>
            </div>
            <div>
              <h3 className="font-medium text-orange-700">EAL Learners</h3>
              <p className="text-sm text-orange-600">{sections.differentiation.eal}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StageCard = ({ stage, stageNumber }) => {
  const stageColors = {
    1: 'green',   // Building Knowledge
    2: 'blue',    // Supported Reading  
    3: 'purple',  // Learning Genre
    4: 'orange',  // Supported Writing
    5: 'red'      // Independent Writing
  };
  
  const color = stageColors[stageNumber] || 'gray';
  
  return (
    <div className={`stage-card bg-${color}-50 border border-${color}-200 rounded-lg p-5`}>
      <h2 className={`text-lg font-semibold text-${color}-800 mb-3 flex items-center`}>
        {stage.emoji} {stage.title}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div>
          <span className={`text-sm font-medium text-${color}-700`}>Duration:</span>
          <span className="ml-2 text-sm">{stage.duration}</span>
        </div>
        <div>
          <span className={`text-sm font-medium text-${color}-700`}>Purpose:</span>
          <span className="ml-2 text-sm italic">{stage.purpose}</span>
        </div>
      </div>

      {stage.activities && (
        <div className="activities mb-4">
          <h3 className={`font-medium text-${color}-700 mb-2`}>Key Activities:</h3>
          <ul className="space-y-2">
            {stage.activities.map((activity, i) => (
              <li key={i} className="flex items-start">
                <span className={`text-${color}-600 mr-2`}>•</span>
                <div>
                  <strong className={`text-${color}-800`}>{activity.name}:</strong>
                  <span className="ml-1">{activity.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stage.assessment && (
        <div className={`assessment bg-${color}-100 rounded p-3`}>
          <h3 className={`font-medium text-${color}-700 mb-1`}>Assessment:</h3>
          <p className={`text-sm text-${color}-600 italic`}>{stage.assessment}</p>
        </div>
      )}
    </div>
  );
};

// Helper function to parse content and identify lesson plan structure
const parseContent = (content) => {
  const lessonPlanRegex = /# 📚 Lesson Sequence:/;
  const isLessonPlan = lessonPlanRegex.test(content);
  
  if (!isLessonPlan) {
    return { isLessonPlan: false };
  }
  
  // Parse lesson plan sections
  // This would be expanded to fully parse the markdown structure
  return {
    isLessonPlan: true,
    title: "Sample Lesson",
    subject: "History", 
    yearLevel: "10",
    duration: "50 minutes",
    totalLessons: "6",
    // ... more parsing logic
  };
};

export default LessonPlanRenderer;