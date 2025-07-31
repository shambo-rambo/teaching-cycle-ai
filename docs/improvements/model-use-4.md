# Claude 4 Migration Guide for AI Lesson Analyzer

## Overview
This guide covers migrating from Claude 3.7 to Claude 4 for the AI-powered lesson analysis platform, including updates for framework detection, question generation, and institutional intelligence features.

## Critical Changes Required

### 1. Model Name Updates
**IMMEDIATE ACTION REQUIRED**

**Old Model Names:**
```javascript
// Replace these in your codebase
const CLAUDE_MODEL = 'claude-3-7-sonnet-20250219';
```

**New Model Names:**
```javascript
// Update to this
const CLAUDE_MODEL = 'claude-sonnet-4-20250514';  // Claude Sonnet 4
```

**Where to Update:**
- `backend/src/services/aiAnalysisService.js`
- Environment variables (`CLAUDE_MODEL`)
- Any configuration files
- Documentation

### 2. Error Handling - New Refusal Stop Reason
**IMPORTANT FOR SAFETY**

Claude 4 introduces a new `refusal` stop reason that you must handle:

```javascript
// aiAnalysisService.js - Update your response handling
class AIAnalysisService {
  async analyzeLesson(lessonContent, systemPrompt) {
    try {
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: `Please analyze this lesson: ${lessonContent}`
          }
        ]
      });
      
      // NEW: Handle refusal stop reason
      if (response.stop_reason === 'refusal') {
        throw new Error('Analysis declined for safety reasons');
      }
      
      return this.parseAnalysisResponse(response.content);
    } catch (error) {
      // Enhanced error handling for Claude 4
      if (error.message.includes('refusal')) {
        // Log safely and provide user-friendly message
        console.log('Content analysis declined for safety reasons');
        return {
          error: 'Unable to analyze this content',
          suggestion: 'Please review content for potentially sensitive material'
        };
      }
      throw error;
    }
  }
}
```

### 3. Remove Deprecated Beta Headers
**CLEANUP REQUIRED**

Remove these beta headers if present in your code:

```javascript
// REMOVE these headers from API calls
const headers = {
  'anthropic-beta': 'token-efficient-tools-2025-02-19',  // REMOVE
  'anthropic-beta': 'output-128k-2025-02-19'            // REMOVE
};

// Clean API calls should look like:
const response = await anthropic.messages.create({
  model: 'claude-sonnet-4-20250514',
  // No deprecated beta headers
  system: systemPrompt,
  messages: messages
});
```

### 4. Text Editor Tool Updates (If Using)
**CONDITIONAL UPDATE**

Only if you're using the text editor tool for lesson content manipulation:

```javascript
// OLD (Claude 3.7)
const textEditorTool = {
  type: "text_editor_20241022",
  name: "str_replace_editor"
};

// NEW (Claude 4)
const textEditorTool = {
  type: "text_editor_20250429",           // Updated type
  name: "str_replace_based_edit_tool"     // Updated name
};

// REMOVE any undo_edit commands - no longer supported
```

## New Features You Can Leverage

### 1. Extended Thinking (Recommended for Complex Analysis)
Perfect for your framework detection and institutional intelligence:

```javascript
// Enable extended thinking for complex lesson analysis
const analyzeWithThinking = async (lessonContent) => {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    system: yourFrameworkPrompt,
    messages: [
      {
        role: 'user',
        content: `Analyze this lesson for Teaching Learning Cycle, High Impact Teaching, and Critical Thinking patterns: ${lessonContent}`
      }
    ]
    // Extended thinking enabled by default in Claude 4
  });
  
  // Access the thinking summary if needed
  if (response.thinking) {
    console.log('AI reasoning process:', response.thinking);
  }
  
  return response;
};
```

### 2. Interleaved Thinking (Beta - Optional)
For more natural conversation flows in your question-answer system:

```javascript
// Optional: Enable interleaved thinking for better teacher interactions
const headers = {
  'anthropic-beta': 'interleaved-thinking-2025-05-14'
};

// Use when processing teacher responses to clarifying questions
```

## Implementation Priority

### High Priority (Do First)
1. **Update model names** - Critical for API calls to work
2. **Add refusal stop reason handling** - Important for safety
3. **Remove deprecated beta headers** - Cleanup

### Medium Priority (Next)
1. **Update text editor tool** (if using)
2. **Test enhanced reasoning capabilities**
3. **Update error handling throughout**

### Low Priority (Future Enhancement)
1. **Implement extended thinking features**
2. **Explore interleaved thinking for teacher interactions**

## Testing Strategy

### 1. Basic Functionality Test
```javascript
// Test basic lesson analysis still works
const testLesson = `
Learning Intention: Students will understand photosynthesis
Success Criteria: Can explain the process and identify factors
Activity: Students examine plant samples and discuss observations
Assessment: Exit ticket with diagram labeling
`;

// Should still work with new model
const result = await aiAnalysisService.analyzeLesson(testLesson, systemPrompt);
console.log('Analysis result:', result);
```

### 2. Error Handling Test
```javascript
// Test refusal handling with edge case content
const edgeCaseContent = "controversial or sensitive content example";
const result = await aiAnalysisService.analyzeLesson(edgeCaseContent, systemPrompt);
// Should handle gracefully without crashing
```

### 3. Performance Comparison
```javascript
// Compare Claude 4 performance vs previous version
const performanceTest = async () => {
  const startTime = Date.now();
  const result = await aiAnalysisService.analyzeLesson(complexLesson, systemPrompt);
  const endTime = Date.now();
  
  console.log(`Analysis time: ${endTime - startTime}ms`);
  console.log(`Quality metrics:`, result.frameworkDetection);
};
```

## Updated Environment Variables

```bash
# Update your .env file
CLAUDE_MODEL=claude-sonnet-4-20250514

# Keep existing
CLAUDE_API_KEY=your_anthropic_api_key
```

## Model Choice: Claude Sonnet 4

### Perfect for Your Use Case:
**Claude Sonnet 4** is ideal for your lesson analysis platform:
- **Faster response times** - Important for real-time lesson analysis
- **Enhanced reasoning** - Better framework detection accuracy
- **Improved tool use** - More reliable for your multi-agent analysis system
- **Good balance** - Capability and speed optimized for educational content
- **Cost effective** - Better performance per dollar than Opus

### Expected Performance:
- Superior framework pattern recognition (Teaching Learning Cycle, High Impact Teaching)
- More accurate critical thinking skills detection
- Better question generation for teacher interactions
- Enhanced institutional intelligence for executive dashboard

## Code Review Checklist

- [ ] Updated all model names to Claude 4
- [ ] Added refusal stop reason handling
- [ ] Removed deprecated beta headers
- [ ] Updated text editor tool (if applicable)
- [ ] Tested basic lesson analysis functionality
- [ ] Tested error handling with edge cases
- [ ] Updated environment variables
- [ ] Updated documentation

## Expected Benefits After Migration

1. **Improved Framework Detection**: Better accuracy in identifying Teaching Learning Cycle stages
2. **Enhanced Question Generation**: More relevant clarifying questions for teachers
3. **Superior Institutional Intelligence**: Better cross-departmental analysis for executives
4. **Robust Error Handling**: Graceful handling of edge cases

## Migration Timeline

**Week 1**: Update model names and basic error handling
**Week 2**: Test thoroughly and remove deprecated features
**Week 3**: Optimize for Claude 4 capabilities
**Week 4**: Production deployment with monitoring

## Support Resources

- [Claude 4 Prompt Engineering Best Practices](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices)
- [Extended Thinking Documentation](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)
- [API Documentation](https://docs.anthropic.com/en/api/overview)

---

**Note**: Your existing framework detection prompts and institutional intelligence system prompts should work better with Claude 4's enhanced reasoning capabilities without modification.