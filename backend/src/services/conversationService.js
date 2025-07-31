import dotenv from 'dotenv';
import { LessonCreationService } from './lessonCreationService.js';
import { ConversationModel } from '../models/Conversation.js';

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
      
      console.log('Anthropic SDK initialized for conversation service');
    } catch (error) {
      console.error('Failed to initialize Anthropic SDK:', error.message);
      throw new Error('AI conversation service is currently unavailable: ' + error.message);
    }
  }
  return anthropic;
};

export class ConversationService {
  constructor() {
    this.lessonCreationService = new LessonCreationService();
    this.conversationModel = new ConversationModel();
  }

  async processMessage({ message, conversationHistory, context, userId, conversationId }) {
    const anthropicClient = await initAnthropic();

    // Build conversation context for Claude
    const conversationPrompt = this.buildConversationPrompt(conversationHistory, context);
    
    try {
      const response = await anthropicClient.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `${conversationPrompt}\n\nTeacher's latest message: "${message}"`
          }
        ]
      });

      const aiResponse = response.content[0].text;
      
      // Calculate estimated cost for lesson planner as well
      const inputTokens = response.usage?.input_tokens || 0;
      const outputTokens = response.usage?.output_tokens || 0;
      const estimatedCost = (inputTokens * 0.003 / 1000) + (outputTokens * 0.015 / 1000);
      const totalTokens = inputTokens + outputTokens;
      
      // Parse the response to extract context updates and determine if lesson generation is needed
      const parsedResponse = await this.parseAIResponse(aiResponse, message, context);
      
      // Save messages to database if userId and conversationId are provided
      if (userId && conversationId) {
        // Save user message
        await this.conversationModel.addMessage(conversationId, {
          type: 'user',
          content: message,
          context: context
        });

        // Save AI response
        await this.conversationModel.addMessage(conversationId, {
          type: 'ai',
          content: parsedResponse.message,
          context: parsedResponse.updatedContext,
          lessonPlan: parsedResponse.lessonPlan,
          generatedContent: parsedResponse.generatedContent
        });

        // Update conversation context
        if (parsedResponse.updatedContext) {
          await this.conversationModel.updateConversationContext(conversationId, parsedResponse.updatedContext);
        }

        // Update usage tracking
        await this.conversationModel.updateConversationUsage(conversationId, totalTokens, estimatedCost);
      }
      
      return {
        message: parsedResponse.message,
        updatedContext: parsedResponse.updatedContext,
        lessonPlan: parsedResponse.lessonPlan,
        generatedContent: parsedResponse.generatedContent,
        conversationId: conversationId
      };

    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw new Error('Failed to get AI response');
    }
  }

  buildConversationPrompt(conversationHistory, context) {
    const systemPrompt = `You are an expert educator AI assistant specializing in the Teaching and Learning Cycle framework. Your role is to engage teachers in natural conversation to understand their teaching context and help them create structured lesson sequences.

CONVERSATION GOALS:
1. Understand the teaching context through natural dialogue
2. Gather information about: subject, topic, year level, student needs, writing goals
3. Use the Teaching and Learning Cycle framework to create lesson sequences
4. Generate detailed lesson plans when sufficient context is gathered

IMPORTANT: All lessons are 45 minutes long. Always use "45 minutes" as the lesson duration in all lesson plans and templates.

CONVERSATION STYLE:
- Natural, supportive, and encouraging
- Keep responses concise and direct - avoid unnecessary elaboration
- Ask focused follow-up questions to clarify context
- Reference previous parts of the conversation
- Suggest specific examples when helpful
- Be adaptive based on teacher responses
- Use British spelling throughout (e.g., realise, colour, organised, centre, analyse)

RESPONSE FORMATTING:
Always use markdown formatting for professional, readable responses. For conversational responses, use natural formatting with **bold** for emphasis.

When generating lesson plans or sequences, ALWAYS use this exact template structure for Google Docs compatibility:

---

# Lesson Sequence: [Topic Name]
**Subject:** [Subject] | **Year Level:** [Year] | **Duration:** 45 minutes | **Total Lessons:** [Number]

## Learning Objectives
- [Primary objective using action verbs]
- [Secondary objective] 
- [Tertiary objective]

## Writing Goal
*[Specific writing outcome students will achieve]*

---

## 🌱 Stage 1: Building Knowledge of the Field
**Duration:** [Time allocation]
**Purpose:** Students explore the topic and build foundational knowledge

### Key Activities:
- **[Activity 1 Name]:** [Brief description]
- **[Activity 2 Name]:** [Brief description]
- **[Activity 3 Name]:** [Brief description]

### Resources Needed:
- [Resource 1]
- [Resource 2]

### Assessment:
*[How you'll check understanding]*

---

## 📚 Stage 2: Supported Reading
**Duration:** [Time allocation]  
**Purpose:** Analyze model texts and build vocabulary

### Key Activities:
- **Text Analysis:** [Specific texts to examine]
- **Vocabulary Building:** [Key terms to focus on]
- **Reading Strategies:** [Specific strategies to teach]

### Model Texts:
- [Text 1 with brief description]
- [Text 2 with brief description]

### Assessment:
*[Reading comprehension checks]*

---

## 🔍 Stage 3: Learning About the Genre
**Duration:** [Time allocation]
**Purpose:** Understand text structure and language features

### Genre Focus: *[Specific genre/text type]*

### Key Features to Teach:
- **Structure:** [Text organization patterns]
- **Language Features:** [Specific language elements]
- **Purpose:** [Why this genre is used]

### Activities:
- [Specific genre analysis activities]

---

## ✍️ Stage 4: Supported Writing
**Duration:** [Time allocation]
**Purpose:** Joint construction and guided practice

### Writing Process:
1. **Planning:** [How students will plan their writing]
2. **Drafting:** [Joint construction activities]
3. **Revising:** [Peer/teacher feedback processes]

### Scaffolding Strategies:
- [Specific support strategies]
- [Differentiation for different ability levels]

---

## 🎓 Stage 5: Independent Writing
**Duration:** [Time allocation]
**Purpose:** Students write independently with confidence

### Independent Task:
*[Clear description of final writing task]*

### Success Criteria:
- [Specific criteria 1]
- [Specific criteria 2] 
- [Specific criteria 3]

### Assessment Rubric:
| Criteria | Excellent | Good | Developing |
|----------|-----------|------|------------|
| [Criterion 1] | [Description] | [Description] | [Description] |
| [Criterion 2] | [Description] | [Description] | [Description] |

---

## 🔄 Differentiation Strategies
- **For Advanced Learners:** [Specific extensions]
- **For Struggling Learners:** [Additional support]
- **For EAL Learners:** [Language support strategies]

## 📋 Resources Required
- [Complete list of all resources needed]

---

FORMATTING RULES:
- Always start lesson sequences with the # heading and emoji
- Use ## for major stages with emojis (🌱📚🔍✍️🎓)
- Use ### for subsections within stages
- Use **bold** for activity names and key concepts
- Use *italics* for purposes and descriptions
- Use bullet points for lists
- Use tables for rubrics when appropriate
- Use horizontal rules (---) to separate major sections

CURRENT CONTEXT:
${Object.entries(context).map(([key, value]) => 
  value ? `${key}: ${value}` : null
).filter(Boolean).join('\n')}

CONVERSATION HISTORY:
${conversationHistory.map(msg => 
  `${msg.type === 'ai' ? 'AI' : 'Teacher'}: ${msg.content}`
).join('\n')}

FRAMEWORK KNOWLEDGE:
The Teaching and Learning Cycle has 5 stages:
1. Building Knowledge of the Field - Students explore the topic and genre
2. Supported Reading - Analyzing model texts and building vocabulary
3. Learning About the Genre - Understanding text structure and language features
4. Supported Writing - Joint construction and guided practice
5. Independent Writing - Students write independently with learned skills

WHEN TO USE THE TEMPLATE:
- Only use the full lesson sequence template when you have sufficient context AND the teacher explicitly requests a lesson plan
- Required context: subject, topic, year level, lesson duration, student needs/context
- Always confirm details before generating the full lesson sequence

CONVERSATION APPROACH:
1. **Information Gathering Phase:** Use natural conversational responses with **bold** for key concepts
2. **Clarification Phase:** Ask specific follow-up questions about missing context
3. **Confirmation Phase:** Summarize what you understand before generating lessons
4. **Generation Phase:** Use the complete template structure for lesson sequences

Your response should be conversational and natural until generating actual lesson plans. When ready to generate lessons, use the complete template structure provided above.`;

    return systemPrompt;
  }

  async parseAIResponse(aiResponse, userMessage, currentContext) {
    // Simple context extraction - in a real implementation, you might use more sophisticated NLP
    const updatedContext = { ...currentContext };
    
    // Extract context updates from user message and AI response
    const contextUpdates = await this.extractContextUpdates(userMessage, aiResponse, currentContext);
    Object.assign(updatedContext, contextUpdates);

    // Determine if we should generate lesson content
    const shouldGenerateLesson = this.shouldGenerateLesson(aiResponse, updatedContext);
    
    let lessonPlan = null;
    let generatedContent = null;

    if (shouldGenerateLesson) {
      try {
        // Use existing lesson creation service
        const lessonRequest = this.buildLessonRequest(updatedContext);
        const lessonResult = await this.lessonCreationService.createLesson(lessonRequest);
        
        lessonPlan = lessonResult.lessonPlan;
        generatedContent = lessonResult.activities;
      } catch (error) {
        console.error('Error generating lesson:', error);
        // Continue with conversation even if lesson generation fails
      }
    }

    return {
      message: aiResponse,
      updatedContext,
      lessonPlan,
      generatedContent
    };
  }

  async extractContextUpdates(userMessage, aiResponse, currentContext) {
    const updates = {};
    const lowerMessage = userMessage.toLowerCase();

    // Simple keyword-based extraction (could be enhanced with NLP)
    if (!currentContext.subject) {
      const subjects = ['history', 'english', 'science', 'geography', 'mathematics', 'design technology'];
      for (const subject of subjects) {
        if (lowerMessage.includes(subject)) {
          updates.subject = subject;
          break;
        }
      }
    }

    // Extract year level
    const yearMatch = userMessage.match(/year\s+(\d+)|grade\s+(\d+)|(\d+)th\s+grade/i);
    if (yearMatch && !currentContext.yearLevel) {
      updates.yearLevel = yearMatch[1] || yearMatch[2] || yearMatch[3];
    }

    // Extract lesson duration
    const durationMatch = userMessage.match(/(\d+)\s*(minute|min|hour|hr)/i);
    if (durationMatch && !currentContext.lessonDuration) {
      updates.lessonDuration = `${durationMatch[1]} ${durationMatch[2]}`;
    }

    // Extract topic from context
    if (!currentContext.topic && userMessage.length > 10 && !lowerMessage.includes('yes') && !lowerMessage.includes('no')) {
      // This is a simple heuristic - could be improved
      if (lowerMessage.includes('topic') || lowerMessage.includes('about') || lowerMessage.includes('teaching')) {
        updates.topic = userMessage.substring(0, 100); // Capture potential topic
      }
    }

    return updates;
  }

  shouldGenerateLesson(aiResponse, context) {
    // Check if AI response indicates readiness to generate lesson
    const readyIndicators = [
      'create a lesson',
      'generate a sequence',
      'lesson plan',
      'start with an overview',
      'preliminary lesson'
    ];

    return readyIndicators.some(indicator => 
      aiResponse.toLowerCase().includes(indicator)
    ) && context.subject && context.topic;
  }

  buildLessonRequest(context) {
    return {
      subject: context.subject || 'general',
      topic: context.topic || 'General Topic',
      yearLevel: context.yearLevel || '10',
      duration: context.lessonDuration || '45 minutes',
      numberOfLessons: context.numberOfLessons || '6',
      writingGoal: context.writingGoal || 'Students will produce analytical writing',
      studentNeeds: context.studentNeeds || 'Mixed ability class',
      additionalContext: context.classContext || ''
    };
  }

  // Conversation management methods
  async createConversation(userId, initialContext = {}) {
    return await this.conversationModel.createConversation(userId, initialContext);
  }

  async getConversation(conversationId) {
    return await this.conversationModel.getConversation(conversationId);
  }

  async getUserConversations(userId, limit = 20) {
    return await this.conversationModel.getUserConversations(userId, limit);
  }

  async getAllConversations(limit = 50) {
    return await this.conversationModel.getAllConversations(limit);
  }

  async markConversationComplete(conversationId) {
    return await this.conversationModel.markConversationComplete(conversationId);
  }
}

export default ConversationService;