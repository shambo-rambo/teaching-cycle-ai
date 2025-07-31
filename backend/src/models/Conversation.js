import { db } from '../config/firebase.js';

export class ConversationModel {
  constructor() {
    this.collection = db.collection('conversations');
  }

  async createConversation(userId, initialContext = {}) {
    try {
      const conversationData = {
        userId,
        startTime: new Date(),
        lastActivity: new Date(),
        context: initialContext,
        messageCount: 0,
        status: 'active', // active, completed, archived
        usage: {
          totalTokens: 0,
          totalCost: 0,
          messageLimit: initialContext.type === 'framework_learning' ? 20 : 50, // Lower limit for framework learning
          costLimit: 0.25 // $0.25 limit
        },
        metadata: {
          subject: initialContext.subject || null,
          topic: initialContext.topic || null,
          yearLevel: initialContext.yearLevel || null,
          lessonDuration: initialContext.lessonDuration || null,
          writingGoal: initialContext.writingGoal || null
        }
      };

      const docRef = await this.collection.add(conversationData);
      return {
        success: true,
        conversationId: docRef.id,
        conversation: { id: docRef.id, ...conversationData }
      };
    } catch (error) {
      console.error('Create conversation error:', error);
      return {
        success: false,
        error: 'Failed to create conversation'
      };
    }
  }

  async addMessage(conversationId, message) {
    try {
      const conversationRef = this.collection.doc(conversationId);
      const messagesRef = conversationRef.collection('messages');

      const messageData = {
        type: message.type, // 'user' or 'ai'
        content: message.content,
        timestamp: new Date(),
        context: message.context || null,
        lessonPlan: message.lessonPlan || null,
        generatedContent: message.generatedContent || null
      };

      await messagesRef.add(messageData);

      // Update conversation metadata  
      const currentConv = await conversationRef.get();
      const currentCount = currentConv.exists ? (currentConv.data().messageCount || 0) : 0;
      
      await conversationRef.update({
        lastActivity: new Date(),
        messageCount: currentCount + 1
      });

      return {
        success: true,
        messageId: messageData.timestamp.getTime().toString()
      };
    } catch (error) {
      console.error('Add message error:', error);
      return {
        success: false,
        error: 'Failed to add message'
      };
    }
  }

  async updateConversationContext(conversationId, contextUpdates) {
    try {
      const conversationRef = this.collection.doc(conversationId);
      
      await conversationRef.update({
        context: contextUpdates,
        'metadata.subject': contextUpdates.subject || null,
        'metadata.topic': contextUpdates.topic || null,
        'metadata.yearLevel': contextUpdates.yearLevel || null,
        'metadata.lessonDuration': contextUpdates.lessonDuration || null,
        'metadata.writingGoal': contextUpdates.writingGoal || null,
        lastActivity: new Date()
      });

      return { success: true };
    } catch (error) {
      console.error('Update context error:', error);
      return {
        success: false,
        error: 'Failed to update conversation context'
      };
    }
  }

  async getConversation(conversationId) {
    try {
      const conversationDoc = await this.collection.doc(conversationId).get();
      
      if (!conversationDoc.exists) {
        return {
          success: false,
          error: 'Conversation not found'
        };
      }

      const conversationData = conversationDoc.data();
      const messagesSnapshot = await conversationDoc.ref.collection('messages')
        .orderBy('timestamp', 'asc')
        .get();

      const messages = messagesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        success: true,
        conversation: {
          id: conversationDoc.id,
          ...conversationData,
          messages
        }
      };
    } catch (error) {
      console.error('Get conversation error:', error);
      return {
        success: false,
        error: 'Failed to retrieve conversation'
      };
    }
  }

  async getUserConversations(userId, limit = 20) {
    try {
      const snapshot = await this.collection
        .where('userId', '==', userId)
        .orderBy('lastActivity', 'desc')
        .limit(limit)
        .get();

      const conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        success: true,
        conversations
      };
    } catch (error) {
      console.error('Get user conversations error:', error);
      return {
        success: false,
        error: 'Failed to retrieve conversations'
      };
    }
  }

  async getAllConversations(limit = 50) {
    try {
      const snapshot = await this.collection
        .orderBy('lastActivity', 'desc')
        .limit(limit)
        .get();

      const conversations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return {
        success: true,
        conversations
      };
    } catch (error) {
      console.error('Get all conversations error:', error);
      return {
        success: false,
        error: 'Failed to retrieve conversations'
      };
    }
  }

  async markConversationComplete(conversationId) {
    try {
      await this.collection.doc(conversationId).update({
        status: 'completed',
        completedAt: new Date(),
        lastActivity: new Date()
      });

      return { success: true };
    } catch (error) {
      console.error('Mark conversation complete error:', error);
      return {
        success: false,
        error: 'Failed to mark conversation as complete'
      };
    }
  }

  async updateConversationTitle(conversationId, title, userId) {
    try {
      const conversationRef = this.collection.doc(conversationId);
      const conversationDoc = await conversationRef.get();

      if (!conversationDoc.exists) {
        return {
          success: false,
          error: 'Conversation not found'
        };
      }

      // Check if user owns this conversation
      const conversationData = conversationDoc.data();
      if (conversationData.userId !== userId) {
        return {
          success: false,
          error: 'Unauthorized: You can only update your own conversations'
        };
      }

      await conversationRef.update({
        title: title,
        lastActivity: new Date()
      });

      return { success: true };
    } catch (error) {
      console.error('Update conversation title error:', error);
      return {
        success: false,
        error: 'Failed to update conversation title'
      };
    }
  }

  async deleteConversation(conversationId, userId) {
    try {
      const conversationRef = this.collection.doc(conversationId);
      const conversationDoc = await conversationRef.get();

      if (!conversationDoc.exists) {
        return {
          success: false,
          error: 'Conversation not found'
        };
      }

      // Check if user owns this conversation
      const conversationData = conversationDoc.data();
      if (conversationData.userId !== userId) {
        return {
          success: false,
          error: 'Unauthorized: You can only delete your own conversations'
        };
      }

      // Delete all messages in the conversation
      const messagesRef = conversationRef.collection('messages');
      const messagesSnapshot = await messagesRef.get();
      
      // Use a batch to delete all messages
      const batch = db.batch();
      messagesSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      // Delete the conversation document itself
      batch.delete(conversationRef);
      
      // Commit the batch
      await batch.commit();

      return { success: true };
    } catch (error) {
      console.error('Delete conversation error:', error);
      return {
        success: false,
        error: 'Failed to delete conversation'
      };
    }
  }

  async updateConversationUsage(conversationId, tokenCount, estimatedCost) {
    try {
      const conversationRef = this.collection.doc(conversationId);
      const conversationDoc = await conversationRef.get();

      if (!conversationDoc.exists) {
        return {
          success: false,
          error: 'Conversation not found'
        };
      }

      const currentData = conversationDoc.data();
      const currentUsage = currentData.usage || { totalTokens: 0, totalCost: 0 };
      
      const newUsage = {
        ...currentUsage,
        totalTokens: (currentUsage.totalTokens || 0) + tokenCount,
        totalCost: (currentUsage.totalCost || 0) + estimatedCost
      };

      await conversationRef.update({
        usage: newUsage,
        lastActivity: new Date()
      });

      return { success: true, usage: newUsage };
    } catch (error) {
      console.error('Update conversation usage error:', error);
      return {
        success: false,
        error: 'Failed to update conversation usage'
      };
    }
  }

  async checkConversationLimits(conversationId) {
    try {
      const conversationDoc = await this.collection.doc(conversationId).get();
      
      if (!conversationDoc.exists) {
        return {
          success: false,
          error: 'Conversation not found'
        };
      }

      const data = conversationDoc.data();
      const usage = data.usage || {};
      const messageCount = data.messageCount || 0;

      const limits = {
        messageLimit: usage.messageLimit || 50,
        costLimit: usage.costLimit || 1.00
      };

      const exceeded = {
        messages: messageCount >= limits.messageLimit,
        cost: (usage.totalCost || 0) >= limits.costLimit
      };

      return {
        success: true,
        limits,
        usage: {
          messageCount,
          totalTokens: usage.totalTokens || 0,
          totalCost: usage.totalCost || 0
        },
        exceeded,
        canContinue: !exceeded.messages && !exceeded.cost
      };
    } catch (error) {
      console.error('Check conversation limits error:', error);
      return {
        success: false,
        error: 'Failed to check conversation limits'
      };
    }
  }

  async getUserConversationCount(userId, conversationType = null) {
    try {
      let query = this.collection.where('userId', '==', userId);
      
      if (conversationType) {
        query = query.where('context.type', '==', conversationType);
      }

      const snapshot = await query.get();
      return {
        success: true,
        count: snapshot.size
      };
    } catch (error) {
      console.error('Get user conversation count error:', error);
      return {
        success: false,
        count: 0,
        error: 'Failed to get conversation count'
      };
    }
  }
}

export default ConversationModel;