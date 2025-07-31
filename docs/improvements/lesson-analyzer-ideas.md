# Lesson Analyzer Improvements

*Branch: `feature/lesson-analyzer-improvements`*  
*Date: 2025-06-25*

## 🎯 Ideas to Explore

### Current System Analysis
- **What's Working:** 
  - Lesson upload and document parsing works well
  - Subject and year level selection is effective
  - AI suggestions are good quality and relevant
  - Framework detection captures the right elements
  
- **What Could Be Better:** 
  - Questions are too general and don't reference specific lesson content
  - Teachers can't see their lesson while answering questions (UX problem)
  - AI suggestions should offer to implement changes, not just suggest them
  - Helpful/unhelpful feedback could trigger actual implementation
  
- **User Feedback:** 
  - Questions feel disconnected from the actual lesson
  - Teachers want to reference their lesson while answering
  - Suggestions are useful but implementing them manually is tedious

### Improvement Ideas

#### 1. Context-Aware Question Generation
**Problem:** Questions are generic ("How will you support reading?") instead of lesson-specific ("I see you mention reading the article 'Why Schools Should Ban Homework' - how will you support students with this specific text?")

**Solution:** 
- Extract specific lesson elements (texts, activities, resources) and reference them in questions
- Use lesson content to make questions more targeted and relevant
- Include quotes from the lesson in question context

**Implementation:** 
- Update questionGenerationService.js to parse lesson for specific elements
- Modify question templates to include lesson-specific references
- Add lesson content extraction to AI analysis pipeline

**Priority:** High

#### 2. Lesson Reference During Questions
**Problem:** Teachers can't see their lesson while answering questions, making it hard to provide context

**Solution:** 
- Display lesson content alongside questions
- Highlight relevant sections when asking specific questions
- Allow teachers to reference and scroll through their lesson

**Implementation:** 
- Update frontend to show lesson content in side panel during questioning
- Add highlighting functionality for referenced lesson sections
- Ensure responsive design for split-screen view

**Priority:** High

#### 3. AI-Powered Suggestion Implementation
**Problem:** AI provides good suggestions but teachers have to manually implement them

**Solution:** 
- When teacher marks suggestion as "helpful", offer to implement it automatically
- Generate enhanced lesson text with suggestion integrated
- Provide before/after preview of changes

**Implementation:** 
- Extend suggestion feedback to include "Apply this suggestion" option
- Build lesson text modification service
- Create enhancement preview functionality
- Update suggestion data structure to include implementation details

**Priority:** Medium

#### 4. Smart Enhancement Annotations
**Problem:** Current system only shows suggestions, doesn't help implement them

**Solution:** 
- Generate specific text additions/modifications based on teacher responses
- Show exact changes that would be made to the lesson
- Allow selective application of enhancements

**Implementation:** 
- Build enhancement generation service based on teacher responses
- Create text diff/merge functionality
- Add granular enhancement acceptance interface

**Priority:** Medium

### Framework Detection Enhancements
*Since you're looking at frameworkDetectionService.js*

- [ ] **Idea:** Extract specific lesson elements (texts, activities, resources) for targeted questions
- [ ] **Idea:** Improve context awareness by parsing lesson structure and content
- [ ] **Idea:** Add confidence scoring for framework element detection
- [ ] **Idea:** Subject-specific framework detection patterns implementation

### Question Generation Improvements
- [ ] **Idea:** Reference specific lesson content in questions (texts, activities, resources mentioned)
- [ ] **Idea:** Generate follow-up questions based on teacher responses
- [ ] **Idea:** Implement subject-specific question templates
- [ ] **Idea:** Add question priority scoring to show most important first

### UI/UX Enhancements
- [ ] **Idea:** Split-screen view showing lesson during questioning
- [ ] **Idea:** Highlight lesson sections referenced in questions
- [ ] **Idea:** Suggestion implementation preview before applying
- [ ] **Idea:** Progressive enhancement display (show changes step-by-step)

## 🧪 Experiments to Try

### Experiment 1: Lesson-Specific Question Generation
**Hypothesis:** Teachers will find questions more relevant and easier to answer when they reference specific lesson content
**Method:** 
- A/B test generic vs. lesson-specific questions
- Compare teacher engagement and response quality
- Measure time spent on questions and completion rates
**Success Criteria:** 
- 80%+ of teachers prefer lesson-specific questions
- Reduced question skipping rate
- Higher quality teacher responses
**Results:** [Fill in after testing]

### Experiment 2: Auto-Implementation of Suggestions
**Hypothesis:** Teachers will use suggestions more when AI can implement them automatically
**Method:** 
- Track suggestion uptake before/after auto-implementation feature
- Compare manual vs. auto-implemented enhancement quality
- Measure teacher satisfaction with implemented changes
**Success Criteria:** 
- 60%+ increase in suggestion implementation rate
- 90%+ teacher satisfaction with auto-implementations
- Maintained or improved lesson quality
**Results:** [Fill in after testing]

### Experiment 3: Subject-Specific Prompting
**Hypothesis:** Math teachers will get better questions about problem-solving, English teachers better questions about text analysis
**Method:** 
- Test generic vs. subject-specific question templates
- Compare relevance ratings across different subjects
- Measure framework detection accuracy by subject
**Success Criteria:** 
- 85%+ framework detection accuracy per subject
- Higher teacher ratings for subject-specific questions
- Reduced "this doesn't apply" responses
**Results:** [Fill in after testing]

## 📊 Testing Notes

### Test Cases
- [ ] **Test Case 1:** Upload English lesson with specific text - verify questions reference the actual text title and content
- [ ] **Test Case 2:** Math lesson with problem-solving - check for subject-specific critical thinking questions
- [ ] **Test Case 3:** Teacher marks suggestion helpful - verify auto-implementation offer appears
- [ ] **Test Case 4:** Enhancement preview - ensure original lesson preserved and changes clearly shown
- [ ] **Test Case 5:** Subject-specific detection - verify different frameworks emphasized per subject

### Performance Notes
- **Before:** Generic question generation, manual suggestion implementation
- **After:** [Measure question specificity, implementation uptake, teacher satisfaction]

### Success Metrics
- Framework Detection Accuracy: Target >85% per subject
- Question Relevance Rating: Target >80% helpful
- Suggestion Implementation Rate: Target >60% uptake
- Teacher Satisfaction: Target >4.0/5.0
- Question Completion Rate: Target >90%

## 🚀 Implementation Log

### [Date] - Context-Aware Questions
- **What:** Extract lesson content elements for specific question generation
- **Why:** Generic questions don't reference actual lesson content
- **Result:** [Track question relevance improvements]
- **Next:** Add lesson content highlighting during questions

### [Date] - Suggestion Auto-Implementation  
- **What:** Add "Apply this suggestion" functionality to helpful ratings
- **Why:** Teachers want AI to implement good suggestions automatically
- **Result:** [Measure implementation uptake]
- **Next:** Build enhancement preview system

### [Date] - Subject-Specific Prompting
- **What:** Implement subject-specific question templates and framework emphasis
- **Why:** Math vs English teachers need different types of questions
- **Result:** [Track subject-specific accuracy]
- **Next:** Expand to more subjects

## Key Implementation Areas

### 1. Lesson Content Extraction (questionGenerationService.js)
```javascript
// Extract specific elements for targeted questions
extractLessonElements(lessonText) {
  // Find: texts mentioned, activities described, resources referenced
  // Return: structured data for question templates
}

generateContextAwareQuestions(frameworkGaps, lessonElements) {
  // Use actual lesson content in questions
  // Example: "I see you mention reading 'Article Title' - how will you support students with this text?"
}
```

### 2. Enhancement Implementation (suggestionService.js)
```javascript
// Generate actual lesson modifications
generateEnhancement(originalLesson, suggestion, teacherResponse) {
  // Create specific text additions/modifications
  // Show before/after preview
  // Allow granular acceptance
}
```

### 3. Subject-Specific Analysis (aiAnalysisService.js)
```javascript
// Apply subject-specific framework emphasis
getSubjectPrompt(subject) {
  // Return subject-specific templates for Math/English/Science/History
  // Emphasize relevant frameworks per subject
}
```

## Priority Implementation Order
1. **Context-aware question generation** (High priority - directly addresses main user complaint)
2. **Lesson reference during questions** (High priority - UX improvement)  
3. **Suggestion auto-implementation** (Medium priority - value-add feature)
4. **Subject-specific prompting** (Medium priority - accuracy improvement)