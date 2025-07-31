import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      
      console.log('Anthropic SDK initialized for curriculum service');
    } catch (error) {
      console.error('Failed to initialize Anthropic SDK:', error.message);
      throw new Error('AI curriculum service is currently unavailable: ' + error.message);
    }
  }
  return anthropic;
};

// Load the curriculum data
const loadCurriculumData = () => {
  try {
    // Try multiple possible paths for the curriculum file
    const possiblePaths = [
      path.join(process.cwd(), 'docs', 'improvements', 'history-curriculum-tagging.md'),
      path.join(process.cwd(), '..', 'docs', 'improvements', 'history-curriculum-tagging.md'),
      path.join(__dirname, '..', '..', '..', 'docs', 'improvements', 'history-curriculum-tagging.md')
    ];
    
    for (const curriculumPath of possiblePaths) {
      try {
        const curriculumContent = fs.readFileSync(curriculumPath, 'utf-8');
        console.log('Successfully loaded curriculum data from:', curriculumPath);
        return curriculumContent;
      } catch (e) {
        // Try next path
        continue;
      }
    }
    
    throw new Error('Curriculum file not found in any expected location');
  } catch (error) {
    console.error('Error loading curriculum data:', error.message);
    return null;
  }
};

export class CurriculumService {
  constructor() {
    this.curriculumData = loadCurriculumData();
  }

  async suggestSyllabusPoints(topic, papers) {
    try {
      const anthropicClient = await initAnthropic();
      
      const response = await anthropicClient.messages.create({
        model: 'claude-3-5-sonnet-20241022', // Using the cost-effective model
        max_tokens: 1000,
        system: `You are an expert IB History DP curriculum consultant. Your task is to analyze a teacher's topic and suggest the most relevant syllabus points from the official IB History curriculum.

You have access to the complete IB History DP curriculum structure including:
- Prescribed Subjects (Paper 1): PS1-PS5 with specific case studies
- World History Topics (Paper 2): WHT1-WHT12 with detailed content
- HL Options (Paper 3): HLO1-HLO4 with 18 sections each

Based on the teacher's topic and selected papers, suggest 3-5 most relevant syllabus points that would be appropriate for lesson planning.`,
        messages: [
          {
            role: 'user',
            content: `Please suggest relevant IB History DP syllabus points for this lesson:

**Topic:** ${topic}
**Papers being taught:** ${papers.join(', ')}

**Available Curriculum (excerpt):**
${this.curriculumData ? this.curriculumData.substring(0, 8000) : 'Curriculum data not available'}

**Instructions:**
1. Analyze the topic and identify which curriculum areas it relates to
2. Consider the papers being taught (Paper 1 = Prescribed Subjects, Paper 2 = World History Topics, Paper 3 = HL Options)
3. Suggest 3-5 specific syllabus points that would be most relevant
4. Return ONLY a JSON array of strings, each containing a concise syllabus point reference

**Example format:**
["WHT10 - Authoritarian states (20th century) - Conditions for emergence: economic factors and social division", "PS3 - The move to global war - German and Italian expansion (1933-1940)", "WHT11 - Causes and effects of 20th century wars - Economic, ideological, political and territorial causes"]

Return only the JSON array, no other text.`
          }
        ]
      });

      // Handle refusal stop reason
      if (response.stop_reason === 'refusal') {
        console.log('Curriculum suggestion declined for safety reasons');
        return {
          error: true,
          message: 'Unable to suggest curriculum points for this content'
        };
      }

      // Parse the response
      const responseText = response.content[0].text.trim();
      
      try {
        // Extract JSON array from response
        const jsonMatch = responseText.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const syllabusPoints = JSON.parse(jsonMatch[0]);
          return {
            syllabusPoints: syllabusPoints,
            confidence: 'high'
          };
        }
        
        // Fallback parsing
        return this.generateFallbackSuggestions(topic, papers);
      } catch (parseError) {
        console.error('Error parsing curriculum response:', parseError);
        return this.generateFallbackSuggestions(topic, papers);
      }
    } catch (error) {
      console.error('Error suggesting syllabus points:', error);
      
      // Enhanced error handling for Claude
      if (error.message && error.message.includes('refusal')) {
        return {
          error: true,
          message: 'Unable to suggest curriculum points for this content'
        };
      }
      
      // Return fallback suggestions
      return this.generateFallbackSuggestions(topic, papers);
    }
  }

  generateFallbackSuggestions(topic, papers) {
    const topicLower = topic.toLowerCase();
    const suggestions = [];

    // Topic-based suggestions
    if (topicLower.includes('nazi') || topicLower.includes('hitler') || topicLower.includes('germany')) {
      suggestions.push(
        'WHT10 - Authoritarian states (20th century) - Methods used to establish states: persuasion, coercion, propaganda',
        'PS3 - The move to global war - German and Italian expansion (1933-1940)',
        'WHT11 - Causes and effects of 20th century wars - Economic, ideological, political and territorial causes'
      );
    } else if (topicLower.includes('cold war') || topicLower.includes('soviet') || topicLower.includes('usa')) {
      suggestions.push(
        'WHT12 - The Cold War: Superpower tensions and rivalries - Breakdown of Grand Alliance and superpower rivalry',
        'WHT12 - The Cold War: Superpower tensions and rivalries - US, USSR and China relations (1947-1979)',
        'WHT12 - The Cold War: Superpower tensions and rivalries - Confrontation, reconciliation and end of Cold War'
      );
    } else if (topicLower.includes('civil rights') || topicLower.includes('discrimination') || topicLower.includes('apartheid')) {
      suggestions.push(
        'PS4 - Rights and protest - Civil rights movement in the United States (1954-1965)',
        'PS4 - Rights and protest - Apartheid South Africa (1948-1964)',
        'WHT8 - Independence movements (1800-2000) - Methods of achieving independence (violent and non-violent)'
      );
    } else if (topicLower.includes('war') || topicLower.includes('conflict')) {
      suggestions.push(
        'WHT11 - Causes and effects of 20th century wars - Economic, ideological, political and territorial causes',
        'WHT2 - Causes and effects of wars (750-1500) - Dynastic, territorial and religious disputes',
        'PS5 - Conflict and intervention - Rwanda (1990-1998) or Kosovo (1989-2002)'
      );
    } else {
      // Generic suggestions based on papers
      if (papers.includes('paper1')) {
        suggestions.push('PS1 - Military leaders - Genghis Khan or Richard I case studies');
      }
      if (papers.includes('paper2')) {
        suggestions.push(
          'WHT10 - Authoritarian states (20th century) - Conditions for emergence',
          'WHT11 - Causes and effects of 20th century wars - Types of war'
        );
      }
      if (papers.includes('paper3')) {
        suggestions.push('HLO4 - History of Europe - Various sections depending on regional focus');
      }
    }

    return {
      syllabusPoints: suggestions.slice(0, 5), // Limit to 5 suggestions
      confidence: 'medium'
    };
  }
}

export const curriculumService = new CurriculumService();