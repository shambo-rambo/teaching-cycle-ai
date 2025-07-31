import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, Copy, ArrowLeft, LogOut, History, Plus } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked for better lesson plan formatting
marked.setOptions({
  breaks: true,
  gfm: true
});

const FrameworkLearningPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversationTitle, setConversationTitle] = useState('TLC Framework Discussion');
  const [showConversationList, setShowConversationList] = useState(false);
  const [savedConversations, setSavedConversations] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const existingConversationId = searchParams.get('conversation');
    if (existingConversationId) {
      // Load existing conversation
      loadConversation(existingConversationId);
    } else {
      // Initialize new conversation
      initializeConversation();
    }
    loadSavedConversations();
  }, [searchParams]);

  const initializeConversation = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/framework-learning/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          initialContext: { type: 'framework_learning' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setConversationId(data.conversationId);
        
        // Add initial AI message
        setMessages([{
          id: 1,
          type: 'ai',
          content: `Hello! I'm your **Teaching and Learning Cycle framework expert**. I'm here to help you understand and implement the TLC framework effectively in your classroom.

I can help you with:
- **Understanding TLC principles** and how they work
- **Practical implementation strategies** for each stage
- **Troubleshooting common challenges** you might face
- **Differentiation approaches** for diverse learners
- **Subject-specific applications** across different areas
- **Assessment strategies** that align with TLC

**What would you like to know about the Teaching and Learning Cycle framework?** 

Here are some questions you might ask:
- "What is the Teaching and Learning Cycle?"
- "How do I implement the 4 stages effectively?"
- "My students aren't engaged during modeling - what do I do?"
- "How do I support EAL/D students in TLC?"
- "How does TLC work in Science or other subjects?"
- "I'm running out of time - how do I finish the unit?"

Ask me anything from basic concepts to advanced implementation strategies!`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error creating framework conversation:', error);
      // Fallback: create local conversation with welcome message
      setMessages([{
        id: 1,
        type: 'ai',
        content: `Hello! I'm your **Teaching and Learning Cycle framework expert**. I'm here to help you understand and implement the TLC framework effectively in your classroom.

**What would you like to know about the Teaching and Learning Cycle framework?**`,
        timestamp: new Date()
      }]);
    }
  };

  const loadSavedConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/framework-learning/my-conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSavedConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error loading framework conversations:', error);
    }
  };

  const loadConversation = async (selectedConversationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/framework-learning/${selectedConversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const conversation = data.conversation;
        
        setConversationId(selectedConversationId);
        setConversationTitle(conversation.title || 'TLC Framework Discussion');
        
        // Convert stored messages to UI format
        const formattedMessages = conversation.messages?.map((msg, index) => ({
          id: index + 1,
          type: msg.type,
          content: msg.content,
          timestamp: new Date(msg.timestamp)
        })) || [];
        
        setMessages(formattedMessages);
        setShowConversationList(false);
      }
    } catch (error) {
      console.error('Error loading framework conversation:', error);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setConversationTitle('TLC Framework Discussion');
    setShowConversationList(false);
    initializeConversation();
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/framework-learning/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages,
          conversationId: conversationId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get framework expert response');
      }

      const data = await response.json();

      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: data.message,
        timestamp: new Date(),
        limitExceeded: data.limitExceeded || false
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  // Function to safely render markdown as HTML
  const renderMarkdownContent = (content) => {
    const rawHTML = marked(content);
    const cleanHTML = DOMPurify.sanitize(rawHTML);
    return { __html: cleanHTML };
  };

  // Function to copy message content to clipboard
  const copyMessageContent = async (content) => {
    try {
      await navigator.clipboard.writeText(content);
      console.log('Content copied to clipboard');
    } catch (error) {
      console.error('Failed to copy content:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = content;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    }
  };

  const MessageBubble = ({ message }) => {
    const isAI = message.type === 'ai';
    
    return (
      <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} mb-4`}>
        {isAI ? (
          <div className="max-w-3xl group">
            <div className="relative">
              <div 
                className="prose prose-sm max-w-none lesson-plan-content text-dark-text border border-dark-highlight rounded-2xl px-6 py-4"
                dangerouslySetInnerHTML={renderMarkdownContent(message.content)}
              />
              <button
                onClick={() => copyMessageContent(message.content)}
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 bg-dark-bg hover:bg-dark-border rounded-lg text-dark-secondary hover:text-dark-highlight"
                title="Copy message"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl px-6 py-4 rounded-2xl bg-gradient-to-br from-dark-highlight to-primary-600 text-white shadow-xl">
            <div className="whitespace-pre-wrap text-sm leading-relaxed text-white">
              {message.content}
            </div>
          </div>
        )}
        
        {/* Timestamp outside the bubble */}
        <div className="text-xs text-dark-secondary mt-2 opacity-70">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-dark-bg">
      {/* Header */}
      <div className="bg-dark-lighter shadow-lg px-8 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleBackToHome}
              className="mr-4 p-2 text-dark-secondary hover:text-dark-text rounded-lg hover:bg-dark-border transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <BookOpen className="h-8 w-8 text-dark-highlight mr-3" />
            <div>
              <h1 className="text-xl font-semibold text-dark-text">
                TLC Framework Learning Hub
              </h1>
              <p className="text-sm text-dark-secondary mt-1">
                Expert guidance on implementing the Teaching and Learning Cycle
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-dark-secondary">
              Welcome, {user?.displayName || user?.email}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowConversationList(!showConversationList)}
                className="flex items-center space-x-2 px-4 py-2 text-dark-secondary hover:text-dark-text hover:bg-dark-border rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                title="View conversation history"
              >
                <History className="h-4 w-4" />
                <span className="text-sm">History</span>
              </button>
              <button
                onClick={startNewConversation}
                className="flex items-center space-x-2 px-6 py-2 bg-dark-highlight text-white hover:bg-primary-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                title="Start new conversation"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">New</span>
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-dark-secondary hover:text-dark-text hover:bg-dark-border rounded-lg transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conversation List Modal */}
      {showConversationList && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-lighter rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-96 overflow-hidden border border-dark-border">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-dark-text">Your Framework Learning Conversations</h2>
              <button
                onClick={() => setShowConversationList(false)}
                className="text-dark-secondary hover:text-dark-text"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-80">
              {savedConversations.length === 0 ? (
                <div className="p-8 text-center text-dark-secondary">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-dark-border" />
                  <p>No framework learning conversations yet</p>
                  <p className="text-sm">Start a new conversation to begin learning about the TLC framework</p>
                </div>
              ) : (
                <div className="divide-y">
                  {savedConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => loadConversation(conv.id)}
                      className="p-6 hover:bg-dark-border transition-all duration-200 rounded-xl mx-2 my-1 group cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="text-2xl">🎓</div>
                          <div className="flex-1">
                            <h3 className="font-medium text-dark-text mb-1">
                              {conv.title || 'TLC Framework Discussion'}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-dark-secondary">
                              <span>{conv.messageCount} messages</span>
                              <span>{new Date(conv.lastActivity.seconds * 1000).toLocaleDateString()}</span>
                            </div>
                            {conv.usage && (
                              <div className="mt-2 text-xs text-dark-secondary">
                                Cost: ${(conv.usage.totalCost || 0).toFixed(3)} / $1.00
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          conv.status === 'active' ? 'bg-green-900 text-green-400' : 'bg-dark-border text-dark-secondary'
                        }`}>
                          {conv.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-dark-border bg-dark-bg">
              <p className="text-xs text-dark-secondary text-center">
                {savedConversations.length}/5 conversations used • Development limit to manage costs
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="max-w-3xl px-6 py-4 rounded-2xl bg-gradient-to-br from-dark-lighter to-dark-border shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-dark-highlight border-t-transparent"></div>
                  <span className="text-sm text-dark-secondary">Framework expert is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-8 py-4">
        <div className="max-w-3xl mx-auto flex space-x-4">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about the Teaching and Learning Cycle framework... (Press Enter to send, Shift+Enter for new line)"
              className="w-full px-6 py-4 border border-dark-highlight bg-dark-bg text-dark-text rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-dark-highlight shadow-inner placeholder-dark-secondary"
              rows="3"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!inputMessage.trim() || isLoading}
            className="px-6 py-3 bg-dark-highlight text-white hover:bg-primary-600 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-dark-highlight focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default FrameworkLearningPage;