import React, { useState, useCallback } from 'react';
import { Globe, Upload, MessageCircle, ArrowLeft, ArrowRight, FileText, Link, Users, Clock, Loader } from 'lucide-react';
import SmartTaggingSystem from '../SmartTaggingSystem';
import StrategicSelections from '../StrategicSelections';
import IBCycleActivitySelector from '../IBCycleActivitySelector';
import LessonPlanDisplay from '../LessonPlanDisplay';

const HistoryLessonCreator = ({ mode, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState(null);
  
  // IB-specific state
  const [tags, setTags] = useState({
    papers: [],
    topic: '',
    suggestedSyllabusPoints: [],
    selectedSyllabusPoint: '',
    duration: '90',
    hasPreReading: false
  });
  const [strategicSelections, setStrategicSelections] = useState({
    conceptualFocus: [],
    atlSkills: [],
    teachingPreference: '',
    assessmentFocus: '',
    historicalThinking: ''
  });
  const [selectedActivities, setSelectedActivities] = useState([]);
  
  // Legacy support for upload mode
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [resourceLinks, setResourceLinks] = useState(['', '']);
  const [lessonData, setLessonData] = useState({
    topic: '',
    resources: [],
    objectives: [],
    yearLevel: '',
    duration: '90',
    studentCount: '',
    additionalInfo: ''
  });

  const handleInputChange = (field, value) => {
    setLessonData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
    
    // Update lesson data with file info
    setLessonData(prev => ({
      ...prev,
      resources: [...prev.resources, ...files.map(file => ({
        type: 'file',
        name: file.name,
        size: file.size,
        file: file
      }))]
    }));
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setLessonData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const handleResourceLinkChange = (index, value) => {
    setResourceLinks(prev => {
      const newLinks = [...prev];
      newLinks[index] = value;
      return newLinks;
    });
    
    // Update lesson data with links
    setLessonData(prev => ({
      ...prev,
      resources: [
        ...prev.resources.filter(r => r.type !== 'link'),
        ...resourceLinks.filter(link => link.trim()).map(link => ({
          type: 'link',
          url: link
        }))
      ]
    }));
  };

  const addResourceLink = () => {
    setResourceLinks(prev => [...prev, '']);
  };

  const handleActivitiesSelected = useCallback((activities) => {
    setSelectedActivities(activities);
  }, []);

  const handleNext = async () => {
    if (currentStep === 4) {
      // Generate lesson plan when moving from step 4 to 5
      await generateLessonPlan();
    }
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const generateLessonPlan = async () => {
    setIsGenerating(true);
    try {
      console.log('Generating lesson plan with Claude 4...', {
        lessonData,
        contextualResponses: lessonData.contextualResponses || {}
      });

      // Prepare form data to handle file uploads
      const formData = new FormData();
      
      // Add uploaded files
      uploadedFiles.forEach((file, index) => {
        formData.append(`files`, file);
      });
      
      // Prepare lesson data with IB context
      const ibLessonData = {
        ...lessonData,
        topic: tags.topic || lessonData.topic,
        syllabusPoint: tags.selectedSyllabusPoint,
        duration: tags.duration,
        yearLevel: 'IB DP',
        papers: tags.papers,
        hasPreReading: tags.hasPreReading,
        conceptualFocus: strategicSelections.conceptualFocus,
        atlSkills: strategicSelections.atlSkills,
        assessmentFocus: strategicSelections.assessmentFocus,
        historicalThinking: strategicSelections.historicalThinking
      };
      
      // Add other data as JSON
      formData.append('lessonData', JSON.stringify(ibLessonData));
      formData.append('selectedActivities', JSON.stringify(selectedActivities));
      formData.append('tags', JSON.stringify(tags));
      formData.append('strategicSelections', JSON.stringify(strategicSelections));
      formData.append('subject', 'history');
      
      const response = await fetch('http://localhost:3001/api/lesson-creation/generate', {
        method: 'POST',
        body: formData // Don't set Content-Type header, let browser set it with boundary
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate lesson plan');
      }

      console.log('Lesson plan generated successfully:', data.data.lessonPlan.title);
      setGeneratedLesson(data.data.lessonPlan);
      
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      // Fallback to sample lesson if API fails
      const sampleLesson = generateSampleLesson(lessonData);
      setGeneratedLesson(sampleLesson);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSampleLesson = (data) => {
    const topic = data.topic || 'Historical Topic';
    const duration = data.duration || '90';
    const yearLevel = data.yearLevel || 'IB DP';
    
    return {
      id: `lesson_${Date.now()}`,
      title: `IB History DP Lesson: ${topic}`,
      topic: topic,
      subject: 'IB History DP',
      duration: `${duration}`,
      yearLevel: yearLevel,
      createdAt: new Date().toLocaleDateString(),
      objectives: data.objectives.length > 0 ? data.objectives : [
        `Analyze historical perspectives on ${topic}`,
        'Develop critical thinking skills through source analysis',
        'Apply historical thinking concepts to evaluate evidence'
      ],
      activities: [
        'Pre-class reading assignment with guided questions',
        'Source analysis workshop using primary documents',
        'Structured academic discussion or debate',
        'Historical writing practice',
        'Synthesis and reflection activity'
      ],
      content: `# IB History DP Lesson Plan: ${topic}

**Subject:** IB History DP  
**Duration:** ${duration} minutes  
**Year Level:** ${yearLevel}  
**Date:** ${new Date().toLocaleDateString()}

---

## PRE-CLASS PREPARATION (30 minutes maximum)

### Pre-Reading Assignment
Students complete assigned reading on ${topic} focusing on:
- Key historical context and timeline
- Major figures and their perspectives
- Primary source excerpts with guided questions

### Pre-Reading Accountability
Students complete a 3-2-1 reflection:
- 3 key points learned from the reading
- 2 connections to previous learning
- 1 question for class discussion

---

## LEARNING INTENTIONS & SUCCESS CRITERIA

**Learning Intention:**
By the end of this lesson, students will be able to:
1. Analyze multiple perspectives on ${topic}
2. Evaluate historical evidence using critical thinking skills
3. Develop collaborative argumentation skills

**Success Criteria:**
I can:
□ Identify at least 3 different perspectives on ${topic}
□ Explain the historical context that shaped these perspectives
□ Use specific evidence to support my analysis
□ Contribute meaningfully to group discussions
□ CHALLENGE: Assess which perspective was most justified given the historical context

---

## LESSON STRUCTURE (${duration} minutes)

### 1. OPENING: Quick Check & Activation (10-15 minutes)

**Knowledge Verification (5 minutes)**
- Entry ticket: 3 key questions from pre-reading
- Quick discussion of main themes with table partners

**Hook & Connection (5-7 minutes)**
- Provocative question: "What would you have done in this situation?"
- Brief video clip or primary source image to spark interest

**Lesson Roadmap (3 minutes)**
- Review learning intentions and success criteria
- Preview main activities and connections to assessment

### 2. MAIN ACTIVITIES: "Doing History" (60-65 minutes)

#### Activity 1: Source Analysis Workshop (25-30 minutes)
**Purpose:** Develop critical analysis skills using primary sources

**Structure:**
- Individual analysis of assigned source (10 minutes)
  - Students apply OPCVL method
  - Identify perspective and potential bias
- Pair comparison of different sources (10 minutes)
  - Compare perspectives and corroborate evidence
- Group synthesis and preparation for discussion (10 minutes)
  - Prepare key points for whole-class sharing

#### Activity 2: Structured Academic Discussion (25-30 minutes)
**Purpose:** Develop argumentation and perspective-taking skills

**Structure:**
- Fishbowl discussion format
- Students represent different historical perspectives
- Evidence-based arguments required
- Teacher facilitates and probes for deeper thinking

#### Activity 3: Historical Writing Practice (15 minutes)
**Purpose:** Apply learning through written analysis

**Structure:**
- Quick paragraph response to lesson question
- Peer feedback using success criteria
- Individual reflection on learning

### 3. CLOSING: Synthesis & Forward Thinking (10-15 minutes)

**Learning Consolidation (7 minutes)**
- Exit ticket: Self-assess against success criteria
- One-minute write: Most important insight from today's lesson

**Connection Preview (5 minutes)**
- Preview next lesson's topic and its connection to today
- Distribute pre-reading for next class
- Highlight how today's skills will be applied

**Homework Assignment (3 minutes)**
- Extension reading on related historical topic
- Complete reflection task connecting to broader themes
- Prepare for next class's source analysis activity

---

## DIFFERENTIATION STRATEGIES

### For Advanced Students:
- Additional source complexity with historiographical perspectives
- Leadership roles in group discussions
- Extended writing options with more sophisticated analysis

### For Students Needing Support:
- Graphic organizers for source analysis
- Sentence starters for discussion contributions
- Partner support during activities

### For EAL/Multilingual Learners:
- Key vocabulary pre-teaching with visual supports
- Home language resources when available
- Extended processing time for complex sources

---

## ASSESSMENT OPPORTUNITIES

### Formative Assessment:
- Entry and exit ticket responses
- Quality of source analysis work
- Discussion participation and evidence use
- Peer assessment during group work

### Evidence Collection:
- Completed source analysis worksheets
- Audio recordings of key discussion moments
- Written paragraph responses
- Self-reflection against success criteria

---

## RESOURCES NEEDED

### Materials:
- Primary source document set (4-6 sources)
- Source analysis graphic organizer
- Entry/exit ticket templates
- Timer for activity transitions

### Technology:
- Projector for source display
- Audio system for video clips
- Digital copies of sources for accessibility

---

## IB HISTORY CONCEPTS INTEGRATED

### Historical Thinking Concepts:
- **Perspectives:** Multiple viewpoints on ${topic}
- **Evidence:** Source reliability and corroboration
- **Causation:** Factors that influenced historical decisions
- **Significance:** Why this topic matters historically

### Assessment Skills Developed:
- **Paper 1:** Source analysis and comparison techniques
- **Paper 2:** Comparative analysis and argumentation
- **Paper 3:** Detailed knowledge and historiographical awareness

---

## REFLECTION NOTES

**What worked well:**
[Space for teacher reflection after lesson]

**Areas for improvement:**
[Space for teacher notes]

**Student engagement level:**
[Space for assessment]

**Next steps:**
[Space for planning follow-up lessons]

---

*This lesson plan follows IB History DP guidelines and incorporates flipped learning principles for maximum student engagement and skill development.*`
    };
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderUploadMode = () => (
    <div className="space-y-6">
      {/* File Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition-colors">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Upload Your Lesson Materials
        </h3>
        <p className="text-gray-600 mb-4">
          Upload any existing lesson plans, resource documents, or reference materials
        </p>
        <div className="flex justify-center space-x-4">
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Choose Files
          </label>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Browse Resources
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Supported formats: PDF, Word, Text, Images
        </p>
      </div>

      {/* Uploaded Files Display */}
      {uploadedFiles.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-3">Uploaded Files</h4>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-3 rounded border">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-800">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resource Links */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <Link className="w-5 h-5 mr-2" />
          Add Resource Links
        </h4>
        <div className="space-y-3">
          {resourceLinks.map((link, index) => (
            <input
              key={index}
              type="url"
              value={link}
              onChange={(e) => handleResourceLinkChange(index, e.target.value)}
              placeholder={index === 0 ? "https://example.com/historical-source" : "https://example.com/video-resource"}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ))}
          <button
            onClick={addResourceLink}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            + Add another link
          </button>
        </div>
      </div>

      {/* Topic Input for Upload Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lesson Topic (optional)
        </label>
        <input
          type="text"
          value={lessonData.topic}
          onChange={(e) => handleInputChange('topic', e.target.value)}
          placeholder="e.g., The Munich Crisis and Appeasement, 1938"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          If not provided, AI will extract the topic from your uploaded materials
        </p>
      </div>
    </div>
  );

  const renderIdeaMode = () => (
    <div className="space-y-6">
      {/* Topic Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Lesson Topic or Theme
        </label>
        <input
          type="text"
          value={lessonData.topic}
          onChange={(e) => handleInputChange('topic', e.target.value)}
          placeholder="e.g., The Munich Crisis and Appeasement, 1938"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Learning Objectives */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Learning Objectives (optional)
        </label>
        <textarea
          value={lessonData.objectives.join('\n')}
          onChange={(e) => handleInputChange('objectives', e.target.value.split('\n').filter(obj => obj.trim()))}
          placeholder="e.g., Students will be able to analyze multiple perspectives on appeasement policy"
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Year Level and Duration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year Level
          </label>
          <select
            value={lessonData.yearLevel}
            onChange={(e) => handleInputChange('yearLevel', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Year</option>
            <option value="ib-dp-1">IB DP Year 1</option>
            <option value="ib-dp-2">IB DP Year 2</option>
            <option value="year-11">Year 11</option>
            <option value="year-12">Year 12</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            value={lessonData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            placeholder="90"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Class Size
          </label>
          <input
            type="number"
            value={lessonData.studentCount}
            onChange={(e) => handleInputChange('studentCount', e.target.value)}
            placeholder="25"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Additional Context */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Context (optional)
        </label>
        <textarea
          value={lessonData.additionalInfo}
          onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
          placeholder="Any specific requirements, student needs, or curriculum focus areas..."
          rows="3"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <SmartTaggingSystem onTagsSelected={setTags} />
        );
      case 2:
        return (
          <StrategicSelections 
            tags={tags}
            onSelectionsUpdate={setStrategicSelections}
          />
        );
      case 3:
        return (
          <IBCycleActivitySelector
            tags={tags}
            selections={strategicSelections}
            onActivitiesSelected={handleActivitiesSelected}
          />
        );
      case 4:
        return (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {mode === 'upload' ? 'Upload Your Resources (Optional)' : 'Additional Resources (Optional)'}
            </h3>
            {mode === 'upload' ? renderUploadMode() : renderIdeaMode()}
          </div>
        );
      case 5:
        if (isGenerating) {
          return (
            <div className="text-center py-8">
              <Loader className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Generating Your Lesson Plan...
              </h3>
              <p className="text-gray-600 mb-4">
                Creating a comprehensive IB History DP lesson based on your selected activities and uploaded resources.
              </p>
              <div className="text-sm text-gray-500 max-w-2xl mx-auto">
                <p>• Processing {selectedActivities.length} selected activities</p>
                <p>• Integrating {uploadedFiles.length} uploaded file(s)</p>
                <p>• Using Claude 4 with extended thinking for optimal lesson structure</p>
              </div>
            </div>
          );
        }
        
        if (generatedLesson) {
          return (
            <LessonPlanDisplay
              lessonPlan={generatedLesson}
              onSave={(updatedLesson) => setGeneratedLesson(updatedLesson)}
              onBack={() => setCurrentStep(1)}
            />
          );
        }
        
        return (
          <div className="text-center py-8">
            <FileText className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Generation Failed
            </h3>
            <p className="text-gray-600">
              There was an issue generating your lesson plan. Please try again.
            </p>
            <button
              onClick={() => setCurrentStep(2)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return tags.topic && tags.papers.length > 0 && tags.selectedSyllabusPoint;
      case 2:
        return strategicSelections.conceptualFocus.length > 0 &&
               strategicSelections.atlSkills.length > 0 &&
               strategicSelections.assessmentFocus &&
               strategicSelections.historicalThinking;
      case 3:
        return selectedActivities.length >= 3; // At least one from each IB phase
      case 4:
        return true; // Resources are optional
      case 5:
        return false; // Final step
      default:
        return true;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-amber-50 p-6 border-b border-amber-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-amber-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                IB History DP Lesson Creator
              </h1>
              <p className="text-amber-700">
                {mode === 'upload' ? 'Create from uploaded resources' : 'Create from topic idea'}
              </p>
            </div>
          </div>
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4, 5].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step <= currentStep 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {step}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${step <= currentStep ? 'text-gray-800' : 'text-gray-500'}`}>
                  {step === 1 && 'Context'}
                  {step === 2 && 'Priorities'}
                  {step === 3 && 'Activities'}
                  {step === 4 && 'Resources'}
                  {step === 5 && 'Generate'}
                </p>
              </div>
              {step < 5 && (
                <div className={`
                  w-8 h-1 mx-2
                  ${step < currentStep ? 'bg-amber-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Step {currentStep} of 5</span>
          </div>

          <button
            onClick={handleNext}
            disabled={!canProceed() || currentStep === 5 || isGenerating}
            className="flex items-center space-x-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGenerating ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <span>
                  {currentStep === 5 ? 'Complete' : 
                   currentStep === 4 ? 'Generate Lesson' : 'Next'}
                </span>
                {currentStep < 5 && <ArrowRight className="w-4 h-4" />}
              </>
            )}
          </button>
        </div>
      </div>

      {/* IB History Info Panel */}
      <div className="bg-amber-50 p-6 border-t border-amber-200">
        <h4 className="font-semibold text-amber-800 mb-3">IB History DP Lesson Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700">Flipped Learning Model</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700">Source Analysis Activities</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700">Assessment Preparation</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700">90-minute Structure</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryLessonCreator;