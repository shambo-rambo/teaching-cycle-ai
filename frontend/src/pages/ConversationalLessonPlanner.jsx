import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { History, Plus, MessageSquare, Clock, X, Edit2, Trash2, Check, X as XIcon, Copy } from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked for better lesson plan formatting
marked.setOptions({
  breaks: true,
  gfm: true
});

const ConversationalLessonPlanner = (props) => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversationContext, setConversationContext] = useState({
    subject: null,
    topic: null,
    yearLevel: null,
    lessonDuration: null,
    numberOfLessons: null,
    studentNeeds: null,
    writingGoal: null,
    classContext: null
  });
  const [showConversationList, setShowConversationList] = useState(false);
  const [savedConversations, setSavedConversations] = useState([]);
  const [editingConversationId, setEditingConversationId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [conversationTitle, setConversationTitle] = useState('New Conversation');
  const [selectedConversations, setSelectedConversations] = useState(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
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
      const response = await fetch('http://localhost:3001/api/conversation/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          initialContext: conversationContext
        })
      });

      if (response.ok) {
        const data = await response.json();
        setConversationId(data.conversationId);
        
        // Add initial AI message
        setMessages([{
          id: 1,
          type: 'ai',
          content: "Hi! I'm here to help you plan lessons using the Teaching and Learning Cycle framework. Let's start - what subject are you teaching and what topic are you working on?",
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      // Fallback: create local conversation
      setMessages([{
        id: 1,
        type: 'ai',
        content: "Hi! I'm here to help you plan lessons using the Teaching and Learning Cycle framework. Let's start - what subject are you teaching and what topic are you working on?",
        timestamp: new Date()
      }]);
    }
  };

  const loadSavedConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/conversation/my-conversations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSavedConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadConversation = async (selectedConversationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/conversation/${selectedConversationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const conversation = data.conversation;
        
        setConversationId(selectedConversationId);
        setConversationContext(conversation.context || {});
        setConversationTitle(conversation.title || 'New Conversation');
        
        // Convert stored messages to UI format
        const formattedMessages = conversation.messages?.map((msg, index) => ({
          id: index + 1,
          type: msg.type,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          lessonPlan: msg.lessonPlan,
          generatedContent: msg.generatedContent
        })) || [];
        
        setMessages(formattedMessages);
        setShowConversationList(false);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setConversationId(null);
    setConversationContext({
      subject: null,
      topic: null,
      yearLevel: null,
      lessonDuration: null,
      numberOfLessons: null,
      studentNeeds: null,
      writingGoal: null,
      classContext: null
    });
    setShowConversationList(false);
    setConversationTitle('New Conversation');
    setSelectedConversations(new Set());
    setIsMultiSelectMode(false);
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
      const response = await fetch('http://localhost:3001/api/conversation/lesson-planning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: messages,
          context: conversationContext,
          conversationId: conversationId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();

      const aiMessage = {
        id: messages.length + 2,
        type: 'ai',
        content: data.message,
        timestamp: new Date(),
        lessonPlan: data.lessonPlan || null,
        generatedContent: data.generatedContent || null
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update conversation context if provided
      if (data.updatedContext) {
        setConversationContext(prev => ({
          ...prev,
          ...data.updatedContext
        }));
      }

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startEditingTitle = (conversationId, currentTitle) => {
    setEditingConversationId(conversationId);
    setEditingTitle(currentTitle);
  };

  const cancelEditingTitle = () => {
    setEditingConversationId(null);
    setEditingTitle('');
  };

  const saveConversationTitle = async (conversationId) => {
    if (!editingTitle.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/conversation/${conversationId}/title`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editingTitle.trim()
        })
      });

      if (response.ok) {
        // Update local state
        setSavedConversations(prev => 
          prev.map(conv => 
            conv.id === conversationId 
              ? { ...conv, title: editingTitle.trim() }
              : conv
          )
        );
        
        // Update current conversation title if it's the active one
        if (conversationId === conversationId) {
          setConversationTitle(editingTitle.trim());
        }
        
        setEditingConversationId(null);
        setEditingTitle('');
      }
    } catch (error) {
      console.error('Error updating conversation title:', error);
    }
  };

  const deleteConversation = async (conversationId, e) => {
    e.stopPropagation(); // Prevent loading the conversation
    
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/conversation/${conversationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Remove from local state
        setSavedConversations(prev => prev.filter(conv => conv.id !== conversationId));
        
        // Remove from selected conversations if it was selected
        setSelectedConversations(prev => {
          const newSet = new Set(prev);
          newSet.delete(conversationId);
          return newSet;
        });
        
        // If deleting the current conversation, start a new one
        if (conversationId === conversationId) {
          startNewConversation();
        }
        
        // DON'T close the modal - let user continue managing conversations
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  const toggleConversationSelection = (conversationId) => {
    setSelectedConversations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(conversationId)) {
        newSet.delete(conversationId);
      } else {
        newSet.add(conversationId);
      }
      return newSet;
    });
  };

  const selectAllConversations = () => {
    const allIds = new Set(savedConversations.map(conv => conv.id));
    setSelectedConversations(allIds);
  };

  const deselectAllConversations = () => {
    setSelectedConversations(new Set());
  };

  const deleteSelectedConversations = async () => {
    if (selectedConversations.size === 0) return;
    
    const count = selectedConversations.size;
    if (!confirm(`Are you sure you want to delete ${count} conversation${count > 1 ? 's' : ''}? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const deletePromises = Array.from(selectedConversations).map(conversationId => 
        fetch(`http://localhost:3001/api/conversation/${conversationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      );

      await Promise.all(deletePromises);
      
      // Remove all selected conversations from local state
      setSavedConversations(prev => 
        prev.filter(conv => !selectedConversations.has(conv.id))
      );
      
      // Clear selection
      setSelectedConversations(new Set());
      
      // If current conversation was deleted, start a new one
      if (selectedConversations.has(conversationId)) {
        startNewConversation();
      }
    } catch (error) {
      console.error('Error deleting conversations:', error);
    }
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
      // You could add a toast notification here if desired
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
            
            {/* Render generated lesson content if present */}
            {message.lessonPlan && (
              <div className="mt-4 p-4 bg-dark-bg border border-dark-border rounded-lg">
                <h3 className="font-semibold text-dark-text mb-2">Generated Lesson Plan</h3>
                <div 
                  className="prose prose-sm max-w-none text-dark-text"
                  dangerouslySetInnerHTML={renderMarkdownContent(message.lessonPlan)}
                />
              </div>
            )}
            
            {message.generatedContent && (
              <div className="mt-4 p-4 bg-green-900 border border-green-700 rounded-lg">
                <h3 className="font-semibold text-green-400 mb-2">Lesson Activities</h3>
                <div 
                  className="prose prose-sm max-w-none text-green-300"
                  dangerouslySetInnerHTML={renderMarkdownContent(message.generatedContent)}
                />
              </div>
            )}
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
    <div className="flex flex-col h-full bg-dark-bg">
      {/* Header - only show if standalone */}
      {!props?.embedded && (
        <div className="bg-dark-lighter shadow-lg px-8 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-dark-text">
                Teaching Cycle Lesson Planner
              </h1>
              {conversationId && (
                <p className="text-sm text-dark-secondary mt-1">
                  {conversationTitle}
                </p>
              )}
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
            </div>
          </div>
        </div>
      )}

      {/* Conversation List Modal */}
      {showConversationList && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-dark-lighter rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-96 overflow-hidden border border-dark-border">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-dark-text">Your Conversations</h2>
                {savedConversations.length > 0 && (
                  <button
                    onClick={() => {
                      setIsMultiSelectMode(!isMultiSelectMode);
                      if (isMultiSelectMode) {
                        setSelectedConversations(new Set());
                      }
                    }}
                    className="text-sm text-dark-secondary hover:text-dark-highlight px-3 py-1 rounded-lg transition-colors"
                  >
                    {isMultiSelectMode ? 'Cancel' : 'Select Multiple'}
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowConversationList(false)}
                className="text-dark-secondary hover:text-dark-text"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Multi-select controls */}
            {isMultiSelectMode && savedConversations.length > 0 && (
              <div className="p-4 bg-dark-bg border-b border-dark-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={selectAllConversations}
                      className="text-sm text-dark-highlight hover:text-primary-400"
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAllConversations}
                      className="text-sm text-dark-secondary hover:text-dark-text"
                    >
                      Deselect All
                    </button>
                    <span className="text-sm text-dark-secondary">
                      {selectedConversations.size} selected
                    </span>
                  </div>
                  {selectedConversations.size > 0 && (
                    <button
                      onClick={deleteSelectedConversations}
                      className="flex items-center space-x-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="text-sm">Delete Selected ({selectedConversations.size})</span>
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="overflow-y-auto max-h-80">
              {savedConversations.length === 0 ? (
                <div className="p-8 text-center text-dark-secondary">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-dark-border" />
                  <p>No saved conversations yet</p>
                  <p className="text-sm">Start a new conversation to begin planning lessons</p>
                </div>
              ) : (
                <div className="divide-y">
                  {savedConversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`p-6 hover:bg-dark-border transition-all duration-200 rounded-xl mx-2 my-1 group ${selectedConversations.has(conv.id) ? 'bg-dark-border' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          {isMultiSelectMode && (
                            <input
                              type="checkbox"
                              checked={selectedConversations.has(conv.id)}
                              onChange={() => toggleConversationSelection(conv.id)}
                              className="mt-1 w-4 h-4 text-dark-highlight bg-dark-bg border-dark-border rounded focus:ring-dark-highlight focus:ring-2"
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => !isMultiSelectMode && loadConversation(conv.id)}
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <MessageSquare className="h-4 w-4 text-dark-secondary" />
                              {editingConversationId === conv.id ? (
                                <div className="flex items-center space-x-2 flex-1">
                                  <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    className="bg-dark-bg text-dark-text text-sm px-2 py-1 rounded border border-dark-highlight flex-1"
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        saveConversationTitle(conv.id);
                                      } else if (e.key === 'Escape') {
                                        cancelEditingTitle();
                                      }
                                    }}
                                    autoFocus
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      saveConversationTitle(conv.id);
                                    }}
                                    className="text-green-400 hover:text-green-300"
                                  >
                                    <Check className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      cancelEditingTitle();
                                    }}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <XIcon className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <span className="font-medium text-dark-text">
                                  {conv.title || conv.metadata?.subject || 'New Conversation'}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-dark-secondary mb-2">
                              {conv.metadata?.yearLevel && `Year ${conv.metadata.yearLevel} • `}
                              {conv.messageCount} messages
                            </div>
                            <div className="flex items-center text-xs text-dark-secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(conv.lastActivity.seconds * 1000).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEditingTitle(conv.id, conv.title || conv.metadata?.subject || 'New Conversation');
                              }}
                              className="text-dark-secondary hover:text-dark-highlight p-1"
                              title="Edit title"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => deleteConversation(conv.id, e)}
                              className="text-dark-secondary hover:text-red-400 p-1"
                              title="Delete conversation"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className={`px-2 py-1 rounded-full text-xs ${
                            conv.status === 'active' ? 'bg-green-900 text-green-400' : 'bg-dark-border text-dark-secondary'
                          }`}>
                            {conv.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                  <span className="text-sm text-dark-secondary">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div>
        <div className="max-w-3xl mx-auto flex space-x-4">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your response here... (Press Enter to send, Shift+Enter for new line)"
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

export default ConversationalLessonPlanner;