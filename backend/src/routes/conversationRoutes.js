import express from 'express';
import { ConversationService } from '../services/conversationService.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const conversationService = new ConversationService();

// Create new conversation
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { initialContext } = req.body;
    const userId = req.user.userId;

    const result = await conversationService.createConversation(userId, initialContext || {});

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ 
      error: 'Failed to create conversation'
    });
  }
});

// POST /api/conversation/lesson-planning
router.post('/lesson-planning', authenticateToken, async (req, res) => {
  try {
    const { message, conversationHistory, context, conversationId } = req.body;
    const userId = req.user.userId;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await conversationService.processMessage({
      message,
      conversationHistory: conversationHistory || [],
      context: context || {},
      userId,
      conversationId
    });

    res.json(result);
  } catch (error) {
    console.error('Error in lesson planning conversation:', error);
    res.status(500).json({ 
      error: 'Failed to process conversation',
      message: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
    });
  }
});

// Get user's conversations
router.get('/my-conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 20;

    const result = await conversationService.getUserConversations(userId, limit);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error getting user conversations:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve conversations'
    });
  }
});

// Get specific conversation
router.get('/:conversationId', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const result = await conversationService.getConversation(conversationId);

    if (result.success) {
      // Check if user owns this conversation (basic security)
      if (result.conversation.userId !== req.user.userId && req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Access denied' });
      }
      res.json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error getting conversation:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve conversation'
    });
  }
});

// Update conversation title
router.put('/:conversationId/title', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { title } = req.body;
    const userId = req.user.userId;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }

    const result = await conversationService.conversationModel.updateConversationTitle(
      conversationId, 
      title.trim(), 
      userId
    );

    if (result.success) {
      res.json({ message: 'Title updated successfully' });
    } else {
      if (result.error.includes('not found')) {
        res.status(404).json(result);
      } else if (result.error.includes('Unauthorized')) {
        res.status(403).json(result);
      } else {
        res.status(500).json(result);
      }
    }
  } catch (error) {
    console.error('Error updating conversation title:', error);
    res.status(500).json({ 
      error: 'Failed to update conversation title'
    });
  }
});

// Delete conversation
router.delete('/:conversationId', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.userId;

    const result = await conversationService.conversationModel.deleteConversation(
      conversationId, 
      userId
    );

    if (result.success) {
      res.json({ message: 'Conversation deleted successfully' });
    } else {
      if (result.error.includes('not found')) {
        res.status(404).json(result);
      } else if (result.error.includes('Unauthorized')) {
        res.status(403).json(result);
      } else {
        res.status(500).json(result);
      }
    }
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({ 
      error: 'Failed to delete conversation'
    });
  }
});

export default router;