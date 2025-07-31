import express from 'express';
import { FrameworkLearningService } from '../services/frameworkLearningService.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const frameworkService = new FrameworkLearningService();

// Create new framework learning conversation
router.post('/create', authenticateToken, async (req, res) => {
  try {
    const { initialContext } = req.body;
    const userId = req.user.userId;

    const result = await frameworkService.createFrameworkConversation(userId, initialContext || {});

    if (result.success) {
      res.status(201).json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error creating framework conversation:', error);
    res.status(500).json({ 
      error: 'Failed to create framework conversation'
    });
  }
});

// Process framework learning query
router.post('/query', authenticateToken, async (req, res) => {
  try {
    const { message, conversationHistory, conversationId } = req.body;
    const userId = req.user.userId;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await frameworkService.processFrameworkQuery({
      message,
      conversationHistory: conversationHistory || [],
      userId,
      conversationId
    });

    res.json(result);
  } catch (error) {
    console.error('Error in framework learning query:', error);
    res.status(500).json({ 
      error: 'Failed to process framework query',
      message: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
    });
  }
});

// Get user's framework conversations
router.get('/my-conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const limit = parseInt(req.query.limit) || 20;

    const result = await frameworkService.getUserFrameworkConversations(userId, limit);

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error) {
    console.error('Error getting user framework conversations:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve framework conversations'
    });
  }
});

// Get specific framework conversation
router.get('/:conversationId', authenticateToken, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const result = await frameworkService.getFrameworkConversation(conversationId);

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
    console.error('Error getting framework conversation:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve framework conversation'
    });
  }
});

// Get relevant topics based on search
router.get('/topics/search', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const topics = frameworkService.findRelevantTopics(q);
    res.json({ topics });
  } catch (error) {
    console.error('Error searching topics:', error);
    res.status(500).json({ error: 'Failed to search topics' });
  }
});

// Get quick reference information
router.get('/quick-reference', authenticateToken, async (req, res) => {
  try {
    const quickRef = frameworkService.getQuickReference();
    res.json({ quickReference: quickRef });
  } catch (error) {
    console.error('Error getting quick reference:', error);
    res.status(500).json({ error: 'Failed to get quick reference' });
  }
});

// Get FAQ
router.get('/faq', authenticateToken, async (req, res) => {
  try {
    const faq = frameworkService.getFAQ();
    res.json({ faq });
  } catch (error) {
    console.error('Error getting FAQ:', error);
    res.status(500).json({ error: 'Failed to get FAQ' });
  }
});

export default router;