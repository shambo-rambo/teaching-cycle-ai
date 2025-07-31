import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ConversationModel } from '../models/Conversation.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      
      console.log('Anthropic SDK initialized for framework learning service');
    } catch (error) {
      console.error('Failed to initialize Anthropic SDK:', error.message);
      throw new Error('Framework learning service is currently unavailable: ' + error.message);
    }
  }
  return anthropic;
};

export class FrameworkLearningService {
  constructor() {
    this.knowledgeBase = null;
    this.conversationModel = new ConversationModel();
    this.loadKnowledgeBase();
  }

  loadKnowledgeBase() {
    try {
      const knowledgePath = path.join(__dirname, '../data/framework-knowledge.json');
      const knowledgeData = fs.readFileSync(knowledgePath, 'utf8');
      this.knowledgeBase = JSON.parse(knowledgeData);
      console.log('Framework knowledge base loaded successfully');
    } catch (error) {
      console.error('Error loading knowledge base:', error);
      this.knowledgeBase = null;
    }
  }

  buildFrameworkPrompt(conversationHistory, userMessage) {
    if (!this.knowledgeBase) {
      return "I'm sorry, but I'm having trouble accessing my knowledge base right now. Please try again later.";
    }

    const kb = this.knowledgeBase.knowledge_base;
    
    const systemPrompt = `You are a Teaching and Learning Cycle (TLC) framework expert and mentor for secondary school teachers. Your role is to help teachers understand and implement the TLC framework effectively using evidence-based practices.

KNOWLEDGE BASE OVERVIEW:
${JSON.stringify(kb.metadata, null, 2)}

YOUR EXPERTISE COVERS:
${kb.topics.map(topic => `- ${topic.title}: ${topic.summary}`).join('\n')}

CONVERSATION STYLE:
- Professional but approachable - you're a supportive colleague, not lecturing
- Use practical examples and real classroom scenarios
- Reference the evidence base (95% student improvement rate) when relevant
- Use British spelling throughout (realise, colour, organised, centre, analyse)
- Keep responses concise but comprehensive
- Always connect theory to practical classroom application

RESPONSE FORMAT:
- Use markdown formatting for clear, readable responses
- Use **bold** for key concepts and important points
- Use bullet points for practical tips and strategies
- Include relevant examples from the knowledge base
- When appropriate, reference specific topics for follow-up questions

KEY PRINCIPLES TO EMPHASISE:
${kb.topics[0].content.key_principles.map(principle => `- ${principle}`).join('\n')}

LESSON PLANNER INTEGRATION:
When teachers ask for specific lesson plans, activities, or detailed implementation guidance, direct them to the lesson planner chatbot with messages like:
"For detailed lesson plans implementing these strategies, use our **lesson planner chatbot**. You can access it from the homepage by clicking 'Start New Lesson Planning'. It can create customized lessons based on your specific genre, year level, and student needs."

Look for these keywords that indicate they want lesson plans: "lesson plan", "activities", "create", "generate", "design", "unit", "assessment", "worksheet", "detailed implementation"

CONVERSATION HISTORY:
${conversationHistory.map(msg => `${msg.type === 'ai' ? 'Framework Expert' : 'Teacher'}: ${msg.content}`).join('\n')}

CURRENT KNOWLEDGE BASE CONTENT:
${JSON.stringify(kb, null, 2)}

Remember: You're here to build teacher confidence and understanding of the TLC framework. Make complex pedagogical concepts accessible and actionable.`;

    return systemPrompt;
  }

  async processFrameworkQuery({ message, conversationHistory = [], userId, conversationId }) {
    // Check conversation limits before processing
    if (conversationId) {
      const limitsCheck = await this.conversationModel.checkConversationLimits(conversationId);
      if (limitsCheck.success && !limitsCheck.canContinue) {
        let limitMessage = "I'm sorry, but this conversation has reached its limits. ";
        if (limitsCheck.exceeded.messages) {
          limitMessage += `You've reached the maximum of ${limitsCheck.limits.messageLimit} messages per conversation. `;
        }
        if (limitsCheck.exceeded.cost) {
          limitMessage += `This conversation has reached the $${limitsCheck.limits.costLimit.toFixed(2)} cost limit. `;
        }
        limitMessage += "Please start a new conversation to continue learning about the TLC framework.";
        
        return {
          message: limitMessage,
          success: false,
          limitExceeded: true,
          limits: limitsCheck
        };
      }
    }

    const anthropicClient = await initAnthropic();
    
    try {
      const systemPrompt = this.buildFrameworkPrompt(conversationHistory, message);
      
      const response = await anthropicClient.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: `${systemPrompt}\n\nTeacher's question: "${message}"`
          }
        ]
      });

      const aiResponse = response.content[0].text;
      
      // Calculate estimated cost (Claude Sonnet pricing: ~$3 per 1M input tokens, ~$15 per 1M output tokens)
      const inputTokens = response.usage?.input_tokens || 0;
      const outputTokens = response.usage?.output_tokens || 0;
      const estimatedCost = (inputTokens * 0.003 / 1000) + (outputTokens * 0.015 / 1000);
      const totalTokens = inputTokens + outputTokens;

      // Save messages to database if userId and conversationId are provided
      if (userId && conversationId) {
        // Save user message
        await this.conversationModel.addMessage(conversationId, {
          type: 'user',
          content: message,
          context: { type: 'framework_learning' }
        });

        // Save AI response
        await this.conversationModel.addMessage(conversationId, {
          type: 'ai',
          content: aiResponse,
          context: { type: 'framework_learning' }
        });

        // Update usage tracking
        await this.conversationModel.updateConversationUsage(conversationId, totalTokens, estimatedCost);
      }

      return {
        message: aiResponse,
        success: true,
        conversationId: conversationId,
        usage: {
          tokens: totalTokens,
          cost: estimatedCost
        }
      };

    } catch (error) {
      console.error('Error processing framework query:', error);
      return {
        message: "I'm sorry, I'm having trouble processing your question right now. Please try again in a moment.",
        success: false,
        error: error.message
      };
    }
  }

  // Method to search knowledge base for relevant topics
  findRelevantTopics(query) {
    if (!this.knowledgeBase) return [];
    
    const queryLower = query.toLowerCase();
    const kb = this.knowledgeBase.knowledge_base;
    
    return kb.topics.filter(topic => {
      return topic.title.toLowerCase().includes(queryLower) ||
             topic.summary.toLowerCase().includes(queryLower) ||
             topic.keywords.some(keyword => keyword.toLowerCase().includes(queryLower)) ||
             topic.teacher_queries.some(tq => tq.toLowerCase().includes(queryLower));
    });
  }

  // Method to get quick reference information
  getQuickReference() {
    if (!this.knowledgeBase) return null;
    return this.knowledgeBase.knowledge_base.quick_reference;
  }

  // Method to get FAQ
  getFAQ() {
    if (!this.knowledgeBase) return [];
    return this.knowledgeBase.knowledge_base.teacher_faq;
  }

  // Conversation management methods
  async createFrameworkConversation(userId, initialContext = {}) {
    // Check if user has reached the 5 conversation limit
    const countResult = await this.conversationModel.getUserConversationCount(userId, 'framework_learning');
    
    if (countResult.success && countResult.count >= 5) {
      return {
        success: false,
        error: 'You have reached the maximum of 5 framework learning conversations. This limit helps us manage development costs. Please delete an existing conversation to create a new one.',
        limitReached: true,
        currentCount: countResult.count,
        maxCount: 5
      };
    }

    const conversationContext = {
      ...initialContext,
      type: 'framework_learning',
      subject: 'TLC Framework Learning',
      topic: 'Teaching and Learning Cycle'
    };
    
    return await this.conversationModel.createConversation(userId, conversationContext);
  }

  async getFrameworkConversation(conversationId) {
    return await this.conversationModel.getConversation(conversationId);
  }

  async getUserFrameworkConversations(userId, limit = 20) {
    const result = await this.conversationModel.getUserConversations(userId, limit);
    
    if (result.success) {
      // Filter to only framework learning conversations
      const frameworkConversations = result.conversations.filter(conv => 
        conv.context?.type === 'framework_learning' || 
        conv.metadata?.subject === 'TLC Framework Learning'
      );
      
      return {
        success: true,
        conversations: frameworkConversations
      };
    }
    
    return result;
  }
}

export default FrameworkLearningService;