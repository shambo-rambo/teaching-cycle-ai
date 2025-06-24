import { AIAnalysisService } from './aiAnalysisService.js';

export class QuestionService {
  constructor() {
    this.aiService = new AIAnalysisService();
  }

  async createQuestionQueue(frameworkAnalysis) {
    const questions = [];
    let questionId = 1;

    // Create questions for unclear or missing elements
    const frameworks = ['teachingLearningCycle', 'highImpactTeaching', 'criticalThinking'];
    
    for (const framework of frameworks) {
      const frameworkData = frameworkAnalysis[framework];
      if (frameworkData) {
        for (const [element, analysis] of Object.entries(frameworkData)) {
          if (!analysis.detected || analysis.confidence < 0.5) {
            const question = this.generateQuestionForElement(framework, element);
            if (question) {
              questions.push({
                id: `${framework}_${element}_${questionId++}`,
                framework,
                element,
                question,
                priority: this.getQuestionPriority(framework, element),
                answered: false,
                createdAt: new Date().toISOString()
              });
            }
          }
        }
      }
    }

    // Sort by priority and limit to avoid overwhelming teachers
    return questions
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 5);
  }

  generateQuestionForElement(framework, element) {
    const questionTemplates = {
      teachingLearningCycle: {
        fieldBuilding: "What background knowledge do students need for this topic? How will you help them build shared understanding?",
        supportedReading: "How will you support students in reading and understanding the text? What comprehension strategies will you use?",
        genreLearning: "How will students learn about this text type or genre? What features will you explore together?",
        supportedWriting: "How will you guide students in constructing their writing? What modeling or scaffolding will you provide?",
        independentWriting: "How will students demonstrate independent control of their writing? What support will they have for editing and publishing?"
      },
      highImpactTeaching: {
        explicitInstruction: "How will you clearly demonstrate what students need to learn? What will your 'I do' phase look like?",
        explainingModelling: "How will you show your thinking process to students? What will you make visible about your reasoning?",
        checkingUnderstanding: "How will you know if students understand during the lesson? What will you do if they don't?"
      },
      criticalThinking: {
        analysis: "Will students compare, examine, or break down information in this lesson? How will they think beyond just remembering facts?",
        evaluation: "Will students assess quality, judge credibility, or critique different approaches? How will they make reasoned judgments?",
        synthesis: "Will students create something new, combine ideas, or develop original solutions? How will they construct new understanding?",
        application: "Will students use this learning to solve problems or apply knowledge in new contexts? How will they transfer their learning?"
      }
    };

    return questionTemplates[framework]?.[element] || null;
  }

  getQuestionPriority(framework, element) {
    // Priority based on educational research importance
    const priorities = {
      teachingLearningCycle: {
        fieldBuilding: 0.9,      // Critical foundation
        supportedReading: 0.8,   // Essential scaffolding
        genreLearning: 0.7,      // Important structure
        supportedWriting: 0.8,   // Key construction phase
        independentWriting: 0.6  // Final demonstration
      },
      highImpactTeaching: {
        explicitInstruction: 0.9,    // Fundamental clarity
        explainingModelling: 0.8,    // Essential demonstration
        checkingUnderstanding: 0.9   // Critical feedback loop
      },
      criticalThinking: {
        analysis: 0.8,      // Important depth
        evaluation: 0.7,    // Valuable judgment
        synthesis: 0.6,     // Creative construction
        application: 0.9    // Essential transfer
      }
    };

    return priorities[framework]?.[element] || 0.5;
  }

  async recordTeacherResponse(questionId, response, teacherId, lessonId) {
    const responseRecord = {
      questionId,
      teacherId,
      lessonId,
      response: response.trim(),
      timestamp: new Date().toISOString(),
      responseType: this.classifyResponse(response)
    };

    return responseRecord;
  }

  classifyResponse(response) {
    const lowerResponse = response.toLowerCase();
    
    if (lowerResponse.includes('not relevant') || lowerResponse.includes('not applicable') || lowerResponse.includes('doesn\'t apply')) {
      return 'not_applicable';
    } else if (lowerResponse.includes('already doing') || lowerResponse.includes('implicit') || lowerResponse.includes('understood')) {
      return 'implicit_element';
    } else if (lowerResponse.includes('good idea') || lowerResponse.includes('will add') || lowerResponse.includes('could include')) {
      return 'receptive_improvement';
    } else if (response.length > 50) {
      return 'detailed_explanation';
    } else {
      return 'brief_response';
    }
  }

  async updateAnalysisFromResponse(lessonId, questionId, response, originalAnalysis) {
    try {
      // Use AI service to gracefully incorporate teacher response
      const updatedAnalysis = await this.aiService.processTeacherResponse(
        questionId, 
        response, 
        originalAnalysis
      );

      return {
        ...updatedAnalysis,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'teacher_response'
      };
    } catch (error) {
      console.error('Error updating analysis from response:', error);
      // Fallback: return original analysis with response recorded
      return {
        ...originalAnalysis,
        teacherResponses: [
          ...(originalAnalysis.teacherResponses || []),
          {
            questionId,
            response,
            timestamp: new Date().toISOString()
          }
        ]
      };
    }
  }

  getQuestionsByPriority(questions) {
    return questions.sort((a, b) => {
      // Sort by priority first, then by framework importance
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      
      // Secondary sort by framework importance
      const frameworkOrder = ['highImpactTeaching', 'teachingLearningCycle', 'criticalThinking'];
      return frameworkOrder.indexOf(a.framework) - frameworkOrder.indexOf(b.framework);
    });
  }
}