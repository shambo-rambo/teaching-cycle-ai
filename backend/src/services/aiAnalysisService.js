import dotenv from 'dotenv';
import { studentPrivacyService } from './studentPrivacyService.js';

dotenv.config();

// Dynamic import for Anthropic SDK
let Anthropic = null;
let anthropic = null;

const initAnthropic = async () => {
  if (!anthropic) {
    try {
      if (!process.env.CLAUDE_API_KEY) {
        throw new Error('CLAUDE_API_KEY not found in environment variables');
      }
      
      const AnthropicSDK = await import('@anthropic-ai/sdk');
      Anthropic = AnthropicSDK.default;
      
      anthropic = new Anthropic({
        apiKey: process.env.CLAUDE_API_KEY,
      });
      
      console.log('Anthropic SDK initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Anthropic SDK:', error.message);
      throw new Error('AI analysis is currently unavailable: ' + error.message);
    }
  }
  return anthropic;
};

export class AIAnalysisService {
  constructor() {
    this.SYSTEM_PROMPT = `You are an expert educational AI assistant that analyzes lesson plans using three integrated pedagogical frameworks:

1. **Teaching and Learning Cycle (TLC)**: Field Building → Supported Reading → Genre Learning → Supported Writing → Independent Writing
2. **High Impact Teaching (HIT)**: Explicit Instruction, Explaining/Modelling, Checking Understanding
3. **Critical Thinking Skills**: Analysis, Evaluation, Synthesis, Application

Your role is to:
- Detect evidence of each framework element in lesson content
- Generate supportive, clarifying questions for unclear/missing elements
- Provide constructive suggestions for improvement
- Accept teacher explanations gracefully and update understanding

Be supportive, not judgmental. Focus on helping teachers improve their practice through gentle questioning and practical suggestions.`;
  }

  async analyzeLesson(lessonContent) {
    try {
      const anthropicClient = await initAnthropic();
      const response = await anthropicClient.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: this.SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Please analyze this lesson using the three frameworks. Return a JSON object with:
            - frameworkAnalysis: detected elements with evidence
            - questions: clarifying questions for unclear/missing elements  
            - suggestions: supportive improvement recommendations
            - overallAssessment: brief summary

            Lesson content:
            ${lessonContent}`
          }
        ]
      });

      // NEW: Handle refusal stop reason for Claude 4
      if (response.stop_reason === 'refusal') {
        console.log('Lesson analysis declined for safety reasons');
        return {
          error: true,
          message: 'Unable to analyze this lesson content',
          suggestion: 'Please review content for potentially sensitive material',
          frameworkAnalysis: {
            teachingLearningCycle: {},
            highImpactTeaching: {},
            criticalThinking: {}
          },
          questions: [],
          suggestions: [],
          overallAssessment: 'Analysis declined for safety reasons'
        };
      }

      // Access extended thinking if available
      if (response.thinking) {
        console.log('AI reasoning process for lesson analysis:', response.thinking);
      }

      return this.parseAnalysisResponse(response.content[0].text);
    } catch (error) {
      console.error('Error analyzing lesson:', error);
      
      // Enhanced error handling for Claude 4
      if (error.message && error.message.includes('refusal')) {
        console.log('Content analysis declined for safety reasons');
        return {
          error: true,
          message: 'Unable to analyze this content',
          suggestion: 'Please review content for potentially sensitive material',
          frameworkAnalysis: {
            teachingLearningCycle: {},
            highImpactTeaching: {},
            criticalThinking: {}
          },
          questions: [],
          suggestions: [],
          overallAssessment: 'Analysis declined for safety reasons'
        };
      }
      
      throw new Error('Failed to analyze lesson content');
    }
  }

  parseAnalysisResponse(responseText) {
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        frameworkAnalysis: {
          teachingLearningCycle: {},
          highImpactTeaching: {},
          criticalThinking: {}
        },
        questions: [],
        suggestions: [],
        overallAssessment: 'Analysis could not be parsed'
      };
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      return {
        frameworkAnalysis: {
          teachingLearningCycle: {},
          highImpactTeaching: {},
          criticalThinking: {}
        },
        questions: [],
        suggestions: [],
        overallAssessment: 'Analysis could not be parsed'
      };
    }
  }

  async processTeacherResponse(questionId, response, originalAnalysis) {
    try {
      const anthropicClient = await initAnthropic();
      const prompt = `A teacher has responded to a clarifying question about their lesson. Please update the analysis gracefully accepting their explanation.

      Original Analysis: ${JSON.stringify(originalAnalysis, null, 2)}
      Question ID: ${questionId}
      Teacher Response: ${response}

      Return updated analysis JSON with the teacher's explanation incorporated.`;

      const apiResponse = await anthropicClient.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        system: this.SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      // Handle refusal stop reason
      if (apiResponse.stop_reason === 'refusal') {
        console.log('Teacher response processing declined for safety reasons');
        return originalAnalysis; // Return original analysis unchanged
      }

      // Access extended thinking if available
      if (apiResponse.thinking) {
        console.log('AI reasoning for teacher response processing:', apiResponse.thinking);
      }

      return this.parseAnalysisResponse(apiResponse.content[0].text);
    } catch (error) {
      console.error('Error processing teacher response:', error);
      throw new Error('Failed to process teacher response');
    }
  }

  async generateSuggestions(frameworkAnalysis, teacherResponses = []) {
    try {
      const anthropicClient = await initAnthropic();
      const prompt = `Based on this framework analysis, provide 3-5 specific, supportive suggestions to help improve the lesson. Be constructive and practical.

      Framework Analysis: ${JSON.stringify(frameworkAnalysis, null, 2)}
      Teacher Responses: ${JSON.stringify(teacherResponses, null, 2)}

      Return JSON with:
      {
        "suggestions": [
          {
            "framework": "teachingLearningCycle",
            "element": "fieldBuilding", 
            "suggestion": "Consider adding...",
            "rationale": "This would help because...",
            "implementation": "You could do this by..."
          }
        ]
      }`;

      const response = await anthropicClient.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: this.SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      // Handle refusal stop reason
      if (response.stop_reason === 'refusal') {
        console.log('Suggestion generation declined for safety reasons');
        return { 
          suggestions: [],
          error: true,
          message: 'Unable to generate suggestions for this content'
        };
      }

      // Access extended thinking if available
      if (response.thinking) {
        console.log('AI reasoning for suggestion generation:', response.thinking);
      }

      const jsonMatch = response.content[0].text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return { suggestions: [] };
    } catch (error) {
      console.error('Error generating suggestions:', error);
      throw new Error('Failed to generate suggestions');
    }
  }

  // Privacy-compliant lesson analysis with student differentiation
  async analyzeLessonWithStudentContext(lessonData, classData, students, sessionId = null) {
    try {
      // Create privacy-compliant context
      const privacyCompliantContext = studentPrivacyService.createPrivacyCompliantLessonContext(
        lessonData, classData, students, sessionId
      );

      // Validate that no PII is present before sending to AI
      const validation = studentPrivacyService.validateAISafeData(privacyCompliantContext);
      if (!validation.isValid) {
        throw new Error(`Privacy validation failed: ${validation.violations.join(', ')}`);
      }

      const anthropicClient = await initAnthropic();
      
      const prompt = `Analyze this lesson plan and provide personalized differentiation suggestions for each student based on their learning support needs. Remember that student identifiers are anonymized for privacy.

Lesson Context: ${JSON.stringify(privacyCompliantContext, null, 2)}

Provide analysis in this JSON format:
{
  "lessonAnalysis": {
    "teachingLearningCycle": {
      "fieldBuilding": { "present": true/false, "evidence": "...", "suggestions": "..." },
      "supportedReading": { "present": true/false, "evidence": "...", "suggestions": "..." },
      "genreLearning": { "present": true/false, "evidence": "...", "suggestions": "..." },
      "supportedWriting": { "present": true/false, "evidence": "...", "suggestions": "..." },
      "independentWriting": { "present": true/false, "evidence": "...", "suggestions": "..." }
    },
    "highImpactTeaching": {
      "explicitInstruction": { "present": true/false, "evidence": "...", "suggestions": "..." },
      "explainingModelling": { "present": true/false, "evidence": "...", "suggestions": "..." },
      "checkingUnderstanding": { "present": true/false, "evidence": "...", "suggestions": "..." }
    },
    "criticalThinking": {
      "analysis": { "present": true/false, "evidence": "...", "suggestions": "..." },
      "evaluation": { "present": true/false, "evidence": "...", "suggestions": "..." },
      "synthesis": { "present": true/false, "evidence": "...", "suggestions": "..." },
      "application": { "present": true/false, "evidence": "...", "suggestions": "..." }
    }
  },
  "studentDifferentiation": {
    "Student_XXXX": {
      "accommodations": ["specific recommendations based on their learning support needs"],
      "activities": ["adapted activities for this student"],
      "assessment": ["modified assessment approaches"]
    }
  },
  "classWideAdaptations": [
    "Suggestions that benefit multiple students or the whole class"
  ]
}

Focus on practical, implementable suggestions that respect each student's learning needs while maintaining lesson quality.`;

      const response = await anthropicClient.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: this.SYSTEM_PROMPT + `

CRITICAL PRIVACY REQUIREMENT: You are receiving anonymized student data. Student identifiers like "Student_A7F9" are anonymous - never attempt to guess real names or identify students. Focus only on the learning support information provided.`,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      // Handle refusal stop reason
      if (response.stop_reason === 'refusal') {
        console.log('Lesson analysis with student context declined for safety reasons');
        return {
          success: false,
          error: 'Analysis declined for safety reasons',
          lessonAnalysis: null,
          studentDifferentiation: {}
        };
      }

      // Access extended thinking if available
      if (response.thinking) {
        console.log('AI reasoning for privacy-compliant lesson analysis:', response.thinking);
      }

      const analysisResult = this.parseAnalysisResponse(response.content[0].text);
      
      // Map AI recommendations back to real students for teacher interface
      if (analysisResult.studentDifferentiation) {
        const mappedRecommendations = studentPrivacyService.mapAIResponseToStudents(
          analysisResult.studentDifferentiation, 
          sessionId
        );
        analysisResult.studentDifferentiation = mappedRecommendations;
      }

      return {
        success: true,
        lessonAnalysis: analysisResult.lessonAnalysis,
        studentDifferentiation: analysisResult.studentDifferentiation,
        classWideAdaptations: analysisResult.classWideAdaptations,
        sessionId: privacyCompliantContext.sessionId,
        privacyCompliant: true
      };

    } catch (error) {
      console.error('Error in privacy-compliant lesson analysis:', error);
      throw new Error('Failed to analyze lesson with student context: ' + error.message);
    }
  }

  // Generate personalized recommendations while maintaining privacy
  async generatePersonalizedRecommendations(lessonContent, students, frameworkRequirements = [], sessionId = null) {
    try {
      // Prepare AI-safe student data
      const aiSafeStudents = studentPrivacyService.prepareStudentDataForAI(students, sessionId);
      
      // Validate no PII present
      const validation = studentPrivacyService.validateAISafeData(aiSafeStudents);
      if (!validation.isValid) {
        throw new Error(`Privacy validation failed: ${validation.violations.join(', ')}`);
      }

      const anthropicClient = await initAnthropic();
      
      const prompt = `Generate personalized teaching recommendations for this lesson content based on student learning support needs. Student identifiers are anonymized for privacy protection.

Lesson Content: ${lessonContent}

Student Profiles (Anonymized): ${JSON.stringify(aiSafeStudents, null, 2)}

Framework Requirements: ${JSON.stringify(frameworkRequirements, null, 2)}

Provide recommendations in this JSON format:
{
  "personalizedRecommendations": {
    "Student_XXXX": {
      "preLesson": ["preparation suggestions"],
      "duringLesson": ["in-class adaptations"],
      "postLesson": ["follow-up activities"],
      "assessment": ["modified assessment approaches"]
    }
  },
  "implementationTips": [
    "Practical tips for implementing these recommendations"
  ]
}

Focus on actionable strategies that teachers can easily implement.`;

      const response = await anthropicClient.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: 3000,
        system: this.SYSTEM_PROMPT + `

PRIVACY PROTECTION: Student data has been anonymized. Never attempt to identify real students. Focus only on learning support needs and educational recommendations.`,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      if (response.stop_reason === 'refusal') {
        return {
          success: false,
          error: 'Recommendation generation declined for safety reasons'
        };
      }

      const result = this.parseAnalysisResponse(response.content[0].text);
      
      // Map recommendations back to real students
      if (result.personalizedRecommendations) {
        const mappedRecommendations = studentPrivacyService.mapAIResponseToStudents(
          result.personalizedRecommendations, 
          sessionId
        );
        result.personalizedRecommendations = mappedRecommendations;
      }

      return {
        success: true,
        ...result,
        privacyCompliant: true
      };

    } catch (error) {
      console.error('Error generating personalized recommendations:', error);
      throw new Error('Failed to generate personalized recommendations: ' + error.message);
    }
  }
}