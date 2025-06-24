export class FrameworkDetectionService {
  constructor() {
    this.teachingLearningCyclePatterns = {
      fieldBuilding: [
        'background knowledge', 'shared experience', 'build understanding',
        'prior knowledge', 'topic introduction', 'context setting',
        'brainstorm', 'discussion', 'what do you know'
      ],
      supportedReading: [
        'modelled reading', 'shared reading', 'guided reading',
        'comprehension strategy', 'text analysis', 'reading support',
        'read together', 'reading scaffold', 'text exploration'
      ],
      genreLearning: [
        'text type', 'genre features', 'text structure',
        'language features', 'text purpose', 'model text',
        'writing features', 'text characteristics', 'genre study'
      ],
      supportedWriting: [
        'joint construction', 'shared writing', 'guided writing',
        'writing support', 'scaffolding', 'writing process',
        'write together', 'collaborative writing', 'writing frame'
      ],
      independentWriting: [
        'independent writing', 'student control', 'editing',
        'proofreading', 'publishing', 'final draft',
        'individual writing', 'own writing', 'self-directed'
      ]
    };

    this.highImpactTeachingPatterns = {
      explicitInstruction: [
        'learning intention', 'success criteria', 'learning objective',
        'clear demonstration', 'step by step', 'guided practice',
        'I do, we do, you do', 'model', 'demonstrate'
      ],
      explainingModelling: [
        'think aloud', 'demonstrate thinking', 'model process',
        'show examples', 'explain reasoning', 'metacognitive',
        'thinking process', 'show how', 'work through'
      ],
      checkingUnderstanding: [
        'formative assessment', 'check understanding', 'exit ticket',
        'quick assessment', 'misconception check', 'student response',
        'thumbs up', 'traffic lights', 'mini whiteboard'
      ]
    };

    this.criticalThinkingPatterns = {
      analysis: [
        'compare', 'contrast', 'examine', 'break down', 'analyze',
        'identify patterns', 'investigate', 'explore relationships',
        'dissect', 'categorize', 'classify'
      ],
      evaluation: [
        'assess', 'judge', 'evaluate', 'critique', 'justify',
        'determine credibility', 'weigh evidence', 'form judgments',
        'rate', 'rank', 'appraise'
      ],
      synthesis: [
        'create', 'design', 'develop', 'combine ideas', 'generate',
        'innovate', 'construct', 'build upon', 'integrate',
        'compose', 'formulate'
      ],
      application: [
        'apply', 'use', 'implement', 'demonstrate', 'solve',
        'transfer knowledge', 'practice', 'real world',
        'put into practice', 'utilize'
      ]
    };

    this.questionTemplates = {
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
  }

  detectFrameworkElements(text) {
    const lowerText = text.toLowerCase();
    
    const results = {
      teachingLearningCycle: {},
      highImpactTeaching: {},
      criticalThinking: {}
    };

    // Detect Teaching and Learning Cycle elements
    for (const [stage, patterns] of Object.entries(this.teachingLearningCyclePatterns)) {
      const matches = patterns.filter(pattern => lowerText.includes(pattern.toLowerCase()));
      results.teachingLearningCycle[stage] = {
        detected: matches.length > 0,
        evidence: matches,
        confidence: matches.length > 0 ? Math.min(matches.length * 0.3, 1.0) : 0
      };
    }

    // Detect High Impact Teaching elements
    for (const [strategy, patterns] of Object.entries(this.highImpactTeachingPatterns)) {
      const matches = patterns.filter(pattern => lowerText.includes(pattern.toLowerCase()));
      results.highImpactTeaching[strategy] = {
        detected: matches.length > 0,
        evidence: matches,
        confidence: matches.length > 0 ? Math.min(matches.length * 0.3, 1.0) : 0
      };
    }

    // Detect Critical Thinking elements
    for (const [skill, patterns] of Object.entries(this.criticalThinkingPatterns)) {
      const matches = patterns.filter(pattern => lowerText.includes(pattern.toLowerCase()));
      results.criticalThinking[skill] = {
        detected: matches.length > 0,
        evidence: matches,
        confidence: matches.length > 0 ? Math.min(matches.length * 0.3, 1.0) : 0
      };
    }

    return results;
  }

  generateQuestions(frameworkAnalysis, lessonContent = '') {
    const questions = [];
    let questionId = 1;

    // Generate questions for Teaching and Learning Cycle
    for (const [stage, analysis] of Object.entries(frameworkAnalysis.teachingLearningCycle)) {
      if (!analysis.detected || analysis.confidence < 0.5) {
        questions.push({
          id: `tlc_${questionId++}`,
          framework: 'teachingLearningCycle',
          element: stage,
          question: this.generateContextualQuestion('teachingLearningCycle', stage, lessonContent),
          priority: this.getQuestionPriority('teachingLearningCycle', stage),
          answered: false
        });
      }
    }

    // Generate questions for High Impact Teaching
    for (const [strategy, analysis] of Object.entries(frameworkAnalysis.highImpactTeaching)) {
      if (!analysis.detected || analysis.confidence < 0.5) {
        questions.push({
          id: `hit_${questionId++}`,
          framework: 'highImpactTeaching',
          element: strategy,
          question: this.generateContextualQuestion('highImpactTeaching', strategy, lessonContent),
          priority: this.getQuestionPriority('highImpactTeaching', strategy),
          answered: false
        });
      }
    }

    // Generate questions for Critical Thinking
    for (const [skill, analysis] of Object.entries(frameworkAnalysis.criticalThinking)) {
      if (!analysis.detected || analysis.confidence < 0.5) {
        questions.push({
          id: `ct_${questionId++}`,
          framework: 'criticalThinking',
          element: skill,
          question: this.generateContextualQuestion('criticalThinking', skill, lessonContent),
          priority: this.getQuestionPriority('criticalThinking', skill),
          answered: false
        });
      }
    }

    // Sort by priority and limit to 5 questions to avoid overwhelming
    return questions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5);
  }

  getQuestionPriority(framework, element) {
    const priorities = {
      teachingLearningCycle: {
        fieldBuilding: 0.9,
        supportedReading: 0.8,
        genreLearning: 0.7,
        supportedWriting: 0.8,
        independentWriting: 0.6
      },
      highImpactTeaching: {
        explicitInstruction: 0.9,
        explainingModelling: 0.8,
        checkingUnderstanding: 0.9
      },
      criticalThinking: {
        analysis: 0.8,
        evaluation: 0.7,
        synthesis: 0.6,
        application: 0.9
      }
    };

    return priorities[framework]?.[element] || 0.5;
  }

  generateContextualQuestion(framework, element, lessonContent) {
    // Extract key lesson details
    const lessonSummary = this.extractLessonContext(lessonContent);
    
    // Use templates as base but make them contextual
    const baseTemplates = this.questionTemplates[framework]?.[element];
    
    if (!baseTemplates) {
      return `How does your lesson address ${element} in this context?`;
    }

    // Generate lesson-specific questions based on context
    switch (framework) {
      case 'teachingLearningCycle':
        return this.generateTLCContextualQuestion(element, lessonSummary);
      case 'highImpactTeaching':
        return this.generateHITContextualQuestion(element, lessonSummary);
      case 'criticalThinking':
        return this.generateCTContextualQuestion(element, lessonSummary);
      default:
        return baseTemplates;
    }
  }

  extractLessonContext(lessonContent) {
    if (!lessonContent || lessonContent.length < 50) {
      return { subject: 'this topic', activities: [], yearLevel: 'students' };
    }

    const content = lessonContent.toLowerCase();
    
    // Extract subject hints
    const subjects = ['english', 'math', 'science', 'history', 'geography', 'art', 'music'];
    const detectedSubject = subjects.find(subject => content.includes(subject)) || 'this topic';
    
    // Extract year level hints
    const yearLevels = ['foundation', 'year 1', 'year 2', 'year 3', 'year 4', 'year 5', 'year 6', 
                      'year 7', 'year 8', 'year 9', 'year 10', 'year 11', 'year 12'];
    const detectedYear = yearLevels.find(year => content.includes(year)) || 'students';
    
    // Extract activity hints
    const activities = [];
    if (content.includes('read')) activities.push('reading');
    if (content.includes('writ')) activities.push('writing');
    if (content.includes('discuss')) activities.push('discussion');
    if (content.includes('group')) activities.push('group work');
    if (content.includes('present')) activities.push('presentation');
    
    return { subject: detectedSubject, activities, yearLevel: detectedYear };
  }

  generateTLCContextualQuestion(element, context) {
    const { subject, activities, yearLevel } = context;
    
    switch (element) {
      case 'fieldBuilding':
        return `What background knowledge do ${yearLevel} need to understand ${subject}? How will you activate their prior knowledge about this topic?`;
      case 'supportedReading':
        if (activities.includes('reading')) {
          return `How will you support ${yearLevel} in reading the ${subject} texts? What specific reading strategies will you teach?`;
        }
        return `Will students be reading any materials in this ${subject} lesson? If so, how will you support their comprehension?`;
      case 'genreLearning':
        return `What type of text or genre are students learning about in this ${subject} lesson? How will you teach them its key features?`;
      case 'supportedWriting':
        if (activities.includes('writing')) {
          return `How will you guide ${yearLevel} through the writing process for this ${subject} task? What scaffolding will you provide?`;
        }
        return `Will students be writing anything in this ${subject} lesson? If so, how will you support their writing development?`;
      case 'independentWriting':
        return `How will ${yearLevel} demonstrate independent control of their ${subject} writing? What editing and publishing opportunities will they have?`;
      default:
        return this.questionTemplates.teachingLearningCycle[element];
    }
  }

  generateHITContextualQuestion(element, context) {
    const { subject, yearLevel } = context;
    
    switch (element) {
      case 'explicitInstruction':
        return `How will you clearly explain the ${subject} concepts to ${yearLevel}? What will your step-by-step demonstration look like?`;
      case 'explainingModelling':
        return `How will you model your thinking process when working through ${subject} problems with ${yearLevel}? What will you make visible?`;
      case 'checkingUnderstanding':
        return `How will you check if ${yearLevel} understand the ${subject} concepts during the lesson? What will you do if they're confused?`;
      default:
        return this.questionTemplates.highImpactTeaching[element];
    }
  }

  generateCTContextualQuestion(element, context) {
    const { subject, yearLevel } = context;
    
    switch (element) {
      case 'analysis':
        return `Will ${yearLevel} compare, examine, or break down ${subject} information in this lesson? How will they think beyond just remembering facts?`;
      case 'evaluation':
        return `Will ${yearLevel} assess quality, judge evidence, or critique different approaches in this ${subject} lesson? How will they make reasoned judgments?`;
      case 'synthesis':
        return `Will ${yearLevel} create something new or combine ideas in this ${subject} lesson? How will they construct new understanding?`;
      case 'application':
        return `Will ${yearLevel} apply their ${subject} learning to solve problems or real-world situations? How will they transfer their knowledge?`;
      default:
        return this.questionTemplates.criticalThinking[element];
    }
  }

  getFrameworkInfo() {
    return {
      teachingLearningCycle: {
        name: 'Teaching and Learning Cycle',
        description: 'A structured approach to literacy instruction',
        stages: Object.keys(this.teachingLearningCyclePatterns)
      },
      highImpactTeaching: {
        name: 'High Impact Teaching',
        description: 'Evidence-based teaching strategies',
        strategies: Object.keys(this.highImpactTeachingPatterns)
      },
      criticalThinking: {
        name: 'Critical Thinking Skills',
        description: 'Higher-order thinking development',
        skills: Object.keys(this.criticalThinkingPatterns)
      }
    };
  }
}