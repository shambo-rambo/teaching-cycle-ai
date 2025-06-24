# AI Lesson Analyzer MVP
## Framework-Based Lesson Analysis with Teacher Support

---

## 🎯 **PROJECT OVERVIEW**

### **Core Functionality**
AI-powered lesson analysis tool that helps teachers improve their lessons through supportive questioning and suggestions based on integrated pedagogical frameworks.

### **MVP Scope**
- **Lesson Upload & Analysis**: Teachers upload lessons, AI analyzes using frameworks
- **Intelligent Questioning**: AI asks clarifying questions for unclear elements
- **Supportive Suggestions**: Non-judgmental improvement recommendations
- **Teacher Response System**: Accepts teacher explanations gracefully
- **Progress Tracking**: Simple lesson improvement monitoring
- **Lesson Recording & Storage**: Save lessons and teacher interactions for pattern learning
- **Context Learning**: AI builds knowledge bank from lessons and teacher explanations
- **Resource Intelligence**: Learn what different platforms/resources typically involve
- **School-Specific Patterns**: Adapt to each school's terminology and approaches

### **Frameworks Integrated**
1. **Teaching and Learning Cycle** (Field Building, Supported Reading, Genre Learning, Supported Writing, Independent Writing)
2. **High Impact Teaching** (Explicit Instruction, Explaining/Modelling, Checking Understanding)
3. **Critical Thinking Skills** (Analysis, Evaluation, Synthesis, Application)

---

## 🏗️ **TECHNICAL ARCHITECTURE**

### **Technology Stack**
```
Frontend: React 18+ with JavaScript
Backend: Node.js + Express
Database: Firebase Firestore
AI: Anthropic Claude API (claude-3-sonnet)
Auth: Firebase Authentication
Hosting: Vercel (Frontend) + Railway/Render (Backend)
File Storage: Firebase Storage
```

### **Core Components**
```
1. Lesson Upload System
2. AI Framework Analysis Engine
3. Question Generation System
4. Teacher Response Handler
5. Suggestion Engine
6. Basic Progress Tracking
```

---

## 📚 **FRAMEWORK DETECTION PATTERNS**

### **1. Teaching and Learning Cycle Detection**
```javascript
const teachingLearningCyclePatterns = {
  fieldBuilding: [
    'background knowledge', 'shared experience', 'build understanding',
    'prior knowledge', 'topic introduction', 'context setting'
  ],
  supportedReading: [
    'modelled reading', 'shared reading', 'guided reading', 
    'comprehension strategy', 'text analysis', 'reading support'
  ],
  genreLearning: [
    'text type', 'genre features', 'text structure', 
    'language features', 'text purpose', 'model text'
  ],
  supportedWriting: [
    'joint construction', 'shared writing', 'guided writing',
    'writing support', 'scaffolding', 'writing process'
  ],
  independentWriting: [
    'independent writing', 'student control', 'editing',
    'proofreading', 'publishing', 'final draft'
  ]
};
```

### **2. High Impact Teaching Detection**
```javascript
const highImpactTeachingPatterns = {
  explicitInstruction: [
    'learning intention', 'success criteria', 'learning objective',
    'clear demonstration', 'step by step', 'guided practice'
  ],
  explainingModelling: [
    'think aloud', 'demonstrate thinking', 'model process',
    'show examples', 'explain reasoning', 'metacognitive'
  ],
  checkingUnderstanding: [
    'formative assessment', 'check understanding', 'exit ticket',
    'quick assessment', 'misconception check', 'student response'
  ]
};
```

### **3. Critical Thinking Detection**
```javascript
const criticalThinkingPatterns = {
  analysis: [
    'compare', 'contrast', 'examine', 'break down', 'analyze',
    'identify patterns', 'investigate', 'explore relationships'
  ],
  evaluation: [
    'assess', 'judge', 'evaluate', 'critique', 'justify',
    'determine credibility', 'weigh evidence', 'form judgments'
  ],
  synthesis: [
    'create', 'design', 'develop', 'combine ideas', 'generate',
    'innovate', 'construct', 'build upon'
  ],
  application: [
    'apply', 'use', 'implement', 'demonstrate', 'solve',
    'transfer knowledge', 'practice', 'real world'
  ]
};
```

---

## 🤖 **AI SYSTEM ARCHITECTURE**

### **Analysis Pipeline**
```javascript
// Core Analysis Flow
const analysisWorkflow = {
  1: 'SCAN_LESSON',      // Extract text content and identify framework elements
  2: 'DETECT_PATTERNS',  // Match against framework pattern libraries
  3: 'CLASSIFY_ELEMENTS', // Determine explicit vs implicit vs missing
  4: 'GENERATE_QUESTIONS', // Create clarifying questions for gaps
  5: 'PROCESS_RESPONSES', // Handle teacher explanations
  6: 'SUGGEST_IMPROVEMENTS', // Offer supportive recommendations
  7: 'STORE_RESULTS'     // Save analysis and teacher interactions
};
```

### **Question Generation Logic**
```javascript
// Question Templates by Framework
const questionTemplates = {
  teachingLearningCycle: {
    fieldBuilding: "What background knowledge do students need for this topic? How will you build shared understanding?",
    supportedReading: "How will you support students in reading this text? What comprehension strategies will you use?",
    genreLearning: "How will students learn about this text type? What makes this genre effective?",
    supportedWriting: "How will you guide students in constructing this text? What modeling will you provide?",
    independentWriting: "How will students take control of their writing? What editing support will they have?"
  },
  
  highImpactTeaching: {
    explicitInstruction: "How will you clearly demonstrate what students need to learn?",
    explainingModelling: "How will you show your thinking process to students?",
    checkingUnderstanding: "How will you know if students understand? What will you do if they don't?"
  },
  
  criticalThinking: {
    analysis: "Will students compare, examine, or break down information? What thinking beyond facts?",
    evaluation: "Will students assess quality, judge credibility, or critique approaches?", 
    synthesis: "Will students create something new, combine ideas, or develop original solutions?",
    application: "Will students use this learning to solve problems or demonstrate understanding?"
  }
};
```

---

## 📊 **DATA STRUCTURES**

### **Lesson Analysis Record**
```javascript
const lessonAnalysisStructure = {
  lessonId: "unique_lesson_id",
  teacherId: "teacher_id",
  uploadDate: "2025-01-01T00:00:00Z",
  originalLesson: "lesson_content_text",
  
  // Framework Detection Results
  frameworkAnalysis: {
    teachingLearningCycle: {
      fieldBuilding: { detected: true, evidence: ["background knowledge activity"] },
      supportedReading: { detected: false, evidence: [] },
      genreLearning: { detected: true, evidence: ["text structure discussion"] },
      supportedWriting: { detected: false, evidence: [] },
      independentWriting: { detected: true, evidence: ["draft writing time"] }
    },
    
    highImpactTeaching: {
      explicitInstruction: { detected: true, evidence: ["learning intention stated"] },
      explainingModelling: { detected: false, evidence: [] },
      checkingUnderstanding: { detected: true, evidence: ["exit ticket planned"] }
    },
    
    criticalThinking: {
      analysis: { detected: true, evidence: ["compare two sources"] },
      evaluation: { detected: false, evidence: [] },
      synthesis: { detected: false, evidence: [] },
      application: { detected: true, evidence: ["apply to local example"] }
    }
  },
  
  // AI Questions and Teacher Responses
  interactions: [
    {
      questionId: "q1",
      framework: "highImpactTeaching",
      element: "explainingModelling",
      question: "How will you show your thinking process to students?",
      teacherResponse: "Students will work through examples together",
      aiClassification: "collaborative_modelling",
      timestamp: "2025-01-01T10:30:00Z"
    }
  ],
  
  // Improvement Suggestions
  suggestions: [
    {
      framework: "teachingLearningCycle",
      element: "supportedReading", 
      suggestion: "Consider adding shared reading of one source before independent analysis",
      teacherFeedback: "helpful", // helpful | unhelpful | null
      implemented: false
    }
  ],
  
  // Teacher Ratings
  ratings: {
    aiAccuracy: 4,        // 1-5 scale
    suggestionQuality: 5, // 1-5 scale
    questionClarity: 4,   // 1-5 scale
    overallHelpfulness: 4 // 1-5 scale
  }
};
```

---

## 🎨 **USER INTERFACE COMPONENTS**

### **1. Lesson Upload Interface**
```javascript
// LessonUpload.jsx
const LessonUploadComponent = () => {
  // Features:
  // - Drag and drop file upload (PDF, Word, text)
  // - Rich text editor for direct input
  // - Lesson metadata (subject, year level, duration)
  // - Real-time processing indicator
  // - Framework analysis progress bar
};
```

### **2. Framework Analysis Display**
```javascript
// FrameworkAnalysis.jsx  
const FrameworkAnalysisComponent = () => {
  // Features:
  // - Integrated view of all three frameworks
  // - Green checkmarks for detected elements
  // - Question marks for unclear elements
  // - Red indicators for missing elements
  // - Positive reinforcement for strengths
};
```

### **3. Interactive Question System**
```javascript
// QuestionInterface.jsx
const QuestionInterfaceComponent = () => {
  // Features:
  // - Clear question presentation with framework context
  // - Conversational text input for responses
  // - Examples and clarification when helpful
  // - Option to skip questions respectfully
  // - Progress indicator for question queue
};
```

### **4. Suggestion Engine**
```javascript
// SuggestionEngine.jsx
const SuggestionComponent = () => {
  // Features:
  // - Specific, actionable improvement suggestions
  // - Implementation guidance and examples
  // - Teacher feedback collection (helpful/unhelpful)
  // - Option to apply suggestions to lesson
  // - Track which suggestions were implemented
};
```

---

## 📁 **PROJECT STRUCTURE**

```
TEACHING-CYCLE-AI/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── LessonUpload/
│   │   │   │   ├── LessonUpload.jsx
│   │   │   │   └── FileProcessor.jsx
│   │   │   ├── FrameworkAnalysis/
│   │   │   │   ├── FrameworkDisplay.jsx
│   │   │   │   └── FrameworkIndicators.jsx
│   │   │   ├── QuestionInterface/
│   │   │   │   ├── QuestionCard.jsx
│   │   │   │   └── ResponseInput.jsx
│   │   │   ├── SuggestionEngine/
│   │   │   │   ├── SuggestionCard.jsx
│   │   │   │   └── FeedbackButtons.jsx
│   │   │   └── common/
│   │   ├── hooks/
│   │   │   ├── useAIAnalysis.js
│   │   │   ├── useQuestions.js
│   │   │   └── useSuggestions.js
│   │   ├── services/
│   │   │   ├── aiService.js
│   │   │   ├── firebaseService.js
│   │   │   └── lessonProcessor.js
│   │   ├── utils/
│   │   │   ├── frameworkPatterns.js
│   │   │   └── textAnalysis.js
│   │   └── App.jsx
│   └── package.json
├── backend/                     # Node.js API
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── lessonController.js
│   │   │   ├── analysisController.js
│   │   │   └── questionController.js
│   │   ├── services/
│   │   │   ├── aiAnalysisService.js
│   │   │   ├── frameworkDetectionService.js
│   │   │   ├── questionGenerationService.js
│   │   │   └── suggestionService.js
│   │   ├── models/
│   │   │   ├── lessonModel.js
│   │   │   └── analysisModel.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── routes/
│   │   │   ├── lessons.js
│   │   │   ├── analysis.js
│   │   │   └── questions.js
│   │   └── app.js
│   └── package.json
├── README.md
└── package.json
```

---

## 🔧 **IMPLEMENTATION PHASES**

### **Phase 1: Core Analysis Engine (Weeks 1-2)**
```javascript
// Priority Development Order
const phase1Tasks = [
  'Set up Claude API integration',
  'Build framework pattern detection',
  'Create question generation system', 
  'Implement teacher response processing',
  'Test AI accuracy with sample lessons'
];
```

### **Phase 2: User Interface (Weeks 3-4)**
```javascript
const phase2Tasks = [
  'Build lesson upload interface',
  'Create framework analysis display',
  'Implement question-answer system',
  'Add suggestion presentation',
  'Include teacher feedback collection'
];
```

### **Phase 3: Integration & Testing (Weeks 5-6)**
```javascript
const phase3Tasks = [
  'Connect frontend to backend API',
  'Add Firebase data persistence',
  'Implement user authentication',
  'Test full user workflow',
  'Gather teacher feedback and iterate'
];
```

---

### **Key Environment Variables**
```bash
# Backend .env
CLAUDE_API_KEY=your_anthropic_api_key
CLAUDE_MODEL=claude-3-sonnet-20240229
FIREBASE_PROJECT_ID=lesson-analyzer-mvp
FIREBASE_API_KEY=your_firebase_api_key
NODE_ENV=development
PORT=3001
```

---

## 🎯 **CORE FEATURES TO IMPLEMENT**

### **1. AI Analysis Service**
```javascript
// aiAnalysisService.js
class AIAnalysisService {
  async analyzeLesson(lessonContent, systemPrompt) {
    // Send lesson to Claude with your custom system prompt
    // Parse response for framework elements
    // Generate clarifying questions for gaps
    // Return structured analysis object
  }
  
  async processTeacherResponse(question, response) {
    // Accept teacher explanation gracefully  
    // Classify response for future intelligence
    // Generate follow-up suggestions if teacher is receptive
    // Update lesson analysis record
  }
  
  async generateSuggestions(frameworkAnalysis, teacherResponses) {
    // Create specific, actionable improvement suggestions
    // Focus on supportive tone, not judgmental
    // Provide implementation guidance and examples
    // Allow teacher to accept/reject suggestions
  }
}
```

### **2. Framework Detection Service**
```javascript  
// frameworkDetectionService.js
class FrameworkDetectionService {
  detectTeachingLearningCycle(text) {
    // Scan for TLC stage indicators
    // Return detected stages with evidence
  }
  
  detectHighImpactTeaching(text) {
    // Look for explicit instruction, modeling, checking patterns
    // Return strategy implementation status
  }
  
  detectCriticalThinking(text) {
    // Identify analysis, evaluation, synthesis, application activities
    // Return thinking skill development evidence
  }
  
  generateQuestions(missingElements) {
    // Create clarifying questions for unclear/missing framework elements
    // Use appropriate question templates
    // Provide helpful context and examples
  }
}
```

### **3. Question Management System**
```javascript
// questionService.js
class QuestionService {
  async createQuestionQueue(frameworkAnalysis) {
    // Generate prioritized list of clarifying questions
    // Start with most important missing elements
    // Limit to 3-5 questions per lesson to avoid overwhelm
  }
  
  async recordTeacherResponse(questionId, response) {
    // Store response with timestamp
    // Classify response type (explanation, pushback, receptive)
    // Trigger suggestion generation if appropriate
  }
  
  async updateAnalysisFromResponse(lessonId, questionId, response) {
    // Update framework analysis based on teacher explanation
    // Accept teacher reasoning gracefully
    // Flag areas for potential suggestions
  }
}
```

---

## 📋 **DEVELOPMENT CHECKLIST**

### **Backend Development**
- [ ] Set up Express server with basic routes
- [ ] Integrate Anthropic Claude API
- [ ] Implement framework pattern detection
- [ ] Build question generation system
- [ ] Create teacher response processing
- [ ] Add Firebase Firestore integration
- [ ] Implement user authentication
- [ ] Add file upload handling (PDF, Word)

### **Frontend Development**  
- [ ] Create lesson upload interface with drag-drop
- [ ] Build framework analysis visualization
- [ ] Implement interactive question system
- [ ] Add suggestion display and feedback
- [ ] Create progress tracking interface
- [ ] Add user authentication flow
- [ ] Implement responsive design
- [ ] Add loading states and error handling

### **Integration & Testing**
- [ ] Connect frontend to backend API
- [ ] Test full lesson analysis workflow
- [ ] Validate AI accuracy with sample lessons
- [ ] Test question-response system
- [ ] Verify suggestion generation
- [ ] Performance test with large lesson files
- [ ] User acceptance testing with teachers

---

## 🧪 **TESTING STRATEGY**

### **Sample Test Lessons**
```javascript
const testScenarios = {
  strongAllFrameworks: {
    description: "Lesson with clear TLC stages, HIT strategies, and critical thinking",
    expectation: "Should detect most elements accurately, minimal questions"
  },
  
  missingCriticalThinking: {
    description: "Good TLC and HIT but no analysis/evaluation activities",
    expectation: "Should ask about thinking skills opportunities"
  },
  
  implicitElements: {
    description: "Good teaching practices but not explicitly documented", 
    expectation: "Should ask clarifying questions, accept teacher explanations"
  },
  
  teacherPushback: {
    description: "Teacher explains why framework element isn't appropriate",
    expectation: "Should accept explanation gracefully and record reasoning"
  }
};
```

### **Success Metrics**
```javascript
const successCriteria = {
  aiAccuracy: 85,        // % correct framework detection
  responseTime: 30,      // seconds for lesson analysis
  teacherSatisfaction: 4.0, // out of 5 rating
  questionQuality: 80,   // % of questions rated helpful
  suggestionUptake: 60   // % of suggestions teachers find valuable
};
```

---

## 🔗 **API ENDPOINTS**

### **Lesson Management**
```javascript
// Lesson routes
POST /api/lessons/upload          // Upload and analyze lesson
GET  /api/lessons/:id             // Get lesson analysis
PUT  /api/lessons/:id/update      // Update lesson with teacher changes

// Question management  
GET  /api/lessons/:id/questions   // Get pending questions
POST /api/lessons/:id/questions/:qid/respond  // Submit teacher response

// Suggestions
GET  /api/lessons/:id/suggestions // Get improvement suggestions  
POST /api/lessons/:id/suggestions/:sid/feedback // Rate suggestion
```

### **Analysis Data**
```javascript
// Framework analysis structure returned by API
{
  lessonId: "lesson_123",
  frameworks: {
    teachingLearningCycle: { /* detection results */ },
    highImpactTeaching: { /* detection results */ },
    criticalThinking: { /* detection results */ }
  },
  questions: [
    {
      id: "q1", 
      framework: "criticalThinking",
      element: "analysis",
      question: "Will students compare or analyze information?",
      answered: false
    }
  ],
  suggestions: [
    {
      id: "s1",
      framework: "teachingLearningCycle", 
      suggestion: "Consider adding shared reading support",
      helpful: null
    }
  ]
}
```

---

## 💡 **SYSTEM PROMPT INTEGRATION**

### **Where You'll Add Your System Prompt**
```javascript
// aiAnalysisService.js
class AIAnalysisService {
  constructor() {
    // You'll add your custom system prompt here
    this.SYSTEM_PROMPT = `
      // Your integrated framework system prompt goes here
      // This will eventually come from executive dashboard
      // For MVP, it's hardcoded in this service
    `;
  }
  
  async analyzeLesson(lessonContent) {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      system: this.SYSTEM_PROMPT,  // Your prompt here
      messages: [
        {
          role: 'user',
          content: `Please analyze this lesson: ${lessonContent}`
        }
      ]
    });
    
    // Process Claude's response and return structured data
    return this.parseAnalysisResponse(response.content);
  }
}
```

### **Future Integration Point**
```javascript
// For future executive dashboard integration
async getSystemPromptFromDashboard(schoolId) {
  // Eventually this will fetch custom prompts from executive settings
  // For now, return the hardcoded prompt
  return this.SYSTEM_PROMPT;
}
```

---

**This MVP focuses purely on the lesson analyzer functionality with clear integration points for your custom system prompt and future executive dashboard features.**