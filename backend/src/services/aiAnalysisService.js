import dotenv from 'dotenv';

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
        model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
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

      return this.parseAnalysisResponse(response.content[0].text);
    } catch (error) {
      console.error('Error analyzing lesson:', error);
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
        model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
        max_tokens: 3000,
        system: this.SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

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
        model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022',
        max_tokens: 2000,
        system: this.SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

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
}