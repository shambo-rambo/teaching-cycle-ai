import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

if (!process.env.CLAUDE_API_KEY) {
  console.error('CLAUDE_API_KEY not found in environment variables');
}

export class LessonAnalysisService {
  async analyzeLesson(lessonContent, framework = 'general') {
    try {
      const prompt = this.buildAnalysisPrompt(lessonContent, framework);
      
      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const analysis = this.parseAnalysisResponse(response.content[0].text);
      return analysis;
    } catch (error) {
      console.error('Error analyzing lesson:', error);
      throw new Error('Failed to analyze lesson content');
    }
  }

  buildAnalysisPrompt(lessonContent, framework) {
    const frameworkInstructions = this.getFrameworkInstructions(framework);
    
    return `As an educational expert, analyze the following lesson content using ${framework} framework principles.

${frameworkInstructions}

Lesson Content:
${lessonContent}

Please provide a comprehensive analysis in the following JSON format:
{
  "overallScore": 85,
  "strengths": ["Clear learning objectives", "Good use of examples"],
  "improvements": ["Add more interactive elements", "Include assessment criteria"],
  "framework": "${framework}",
  "detailedAnalysis": {
    "objectives": {
      "score": 90,
      "feedback": "Learning objectives are well-defined and measurable"
    },
    "content": {
      "score": 80,
      "feedback": "Content is relevant but could benefit from more varied examples"
    },
    "engagement": {
      "score": 75,
      "feedback": "Consider adding more interactive activities"
    },
    "assessment": {
      "score": 70,
      "feedback": "Assessment methods could be more diverse"
    }
  },
  "recommendations": [
    "Add formative assessment checkpoints",
    "Include multimedia resources",
    "Create reflection activities"
  ]
}`;
  }

  getFrameworkInstructions(framework) {
    const frameworks = {
      'bloom': 'Focus on Bloom\'s Taxonomy levels: Remember, Understand, Apply, Analyze, Evaluate, Create. Assess how well the lesson progresses through these cognitive levels.',
      'solo': 'Use SOLO Taxonomy: Prestructural, Unistructural, Multistructural, Relational, Extended Abstract. Evaluate the depth of learning outcomes.',
      'constructivism': 'Apply constructivist principles: prior knowledge activation, scaffolding, social learning, and knowledge construction.',
      'general': 'Evaluate using general pedagogical principles: clear objectives, appropriate content, student engagement, and effective assessment.'
    };
    
    return frameworks[framework] || frameworks['general'];
  }

  parseAnalysisResponse(responseText) {
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        overallScore: 0,
        strengths: [],
        improvements: ['Analysis could not be parsed'],
        framework: 'general',
        detailedAnalysis: {},
        recommendations: []
      };
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      return {
        overallScore: 0,
        strengths: [],
        improvements: ['Analysis could not be parsed'],
        framework: 'general',
        detailedAnalysis: {},
        recommendations: []
      };
    }
  }

  async suggestImprovements(lessonContent, currentAnalysis) {
    try {
      const prompt = `Based on the following lesson content and analysis, provide specific, actionable suggestions for improvement:

Lesson Content:
${lessonContent}

Current Analysis:
${JSON.stringify(currentAnalysis, null, 2)}

Please provide 3-5 specific, implementable suggestions that address the identified weaknesses. Format as JSON:
{
  "suggestions": [
    {
      "area": "engagement",
      "suggestion": "Add a think-pair-share activity after the main concept introduction",
      "rationale": "This will increase student participation and help reinforce understanding"
    }
  ]
}`;

      const response = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-3-sonnet-20240229',
        max_tokens: 2000,
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
      throw new Error('Failed to generate improvement suggestions');
    }
  }
}