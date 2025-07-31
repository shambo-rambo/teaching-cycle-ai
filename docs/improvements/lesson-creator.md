# Smart Questioning Feature - IB History Enhanced Implementation Guide

## 🎯 CORE CONCEPT
Transform lesson planning from overwhelming choices to strategic selections through smart tagging and targeted questions

## 📋 OVERALL FLOW

```pseudocode
WHEN teacher starts lesson planning:
  1. TAG lesson context (Paper 1/2/3, syllabus topic)
  2. SELECT key priorities via tick boxes (not open questions)
  3. SYSTEM generates activities split by IB cycle (Inquiry/Action/Reflection)
  4. TEACHER selects at least one from each category
  5. CREATE targeted lesson plan with IB standards built-in
```

## 🏗️ ENHANCED COMPONENTS

### 1. Smart Tagging System (NEW)
```pseudocode
INITIAL TAGGING:
{
  paper: "Paper 1 | Paper 2 | Paper 3",
  syllabusSection: [dropdown of IB topics],
  duration: "90 min | 180 min",
  hasPreReading: boolean (checkbox)
}

// This pre-determines many requirements:
IF Paper 1: focus on source analysis, OPCVL
IF Paper 2: focus on essay skills, comparison
IF Paper 3: focus on regional depth, detail
```

### 2. Strategic Tick Box Selections
```pseudocode
CONCEPTUAL FOCUS (select 1-2):
□ Change and Continuity
□ Causation (short/long term)
□ Consequence (intended/unintended)
□ Significance
□ Perspectives
□ Power and Authority
□ Conflict and Cooperation

ATL SKILLS PRIORITY (select 1-2):
□ Critical Thinking
□ Source Analysis
□ Research Skills
□ Communication (written)
□ Communication (oral)
□ Collaboration
□ Self-Management
□ Transfer Skills

TEACHING PREFERENCES:
□ Flipped Learning (30 min pre-reading)
□ Full In-Class Instruction
□ Hybrid Approach

ASSESSMENT FOCUS (select one):
□ Formative - Skill Building
□ Summative - Paper Practice
□ Diagnostic - Check Understanding
□ Peer/Self Assessment

HISTORICAL THINKING (select primary):
□ Evidence-Based Reasoning
□ Chronological Thinking
□ Comparison/Contextualization
□ Historical Argumentation
□ Interpretation/Synthesis
```

### 3. IB Cycle Activity Generation
```pseudocode
ACTIVITY_GENERATION_LOGIC:
  BASED ON: tags + selections
  GENERATE: 2-3 activities per IB phase
  
  INQUIRY ACTIVITIES (Choose 1):
    - Provocative questions
    - Source mysteries
    - Concept exploration
    - Problem posing
    
  ACTION ACTIVITIES (Choose 1-2):
    - Collaborative analysis
    - Debate/discussion
    - Research tasks
    - Writing workshops
    - Skill application
    
  REFLECTION ACTIVITIES (Choose 1):
    - Synthesis tasks
    - Self-assessment
    - Connection making
    - Exit strategies
```

### 4. SmartQuestioningService (REVISED)
```pseudocode
CLASS SmartQuestioningService:
  
  FUNCTION processTagsAndSelections(tagData, selections):
    INPUT: {
      tags: {paper, syllabus, duration, flipped},
      conceptualFocus: [selected concepts],
      atlSkills: [selected skills],
      assessmentFocus: selected,
      historicalThinking: selected
    }
    
    GENERATE activities organized by IB cycle:
    OUTPUT: {
      inquiryOptions: [2-3 activities],
      actionOptions: [3-4 activities],
      reflectionOptions: [2-3 activities],
      rationale: "Why these activities match your needs"
    }
  
  FUNCTION validateLessonBalance(selectedActivities):
    ENSURE: at least 1 from each IB phase
    ENSURE: activities flow logically
    ENSURE: time allocations work
    RETURN: balanced lesson structure
```

### 5. Enhanced AI Prompts
```pseudocode
IB_CYCLE_ACTIVITY_PROMPT = `
You are an IB History DP expert creating targeted activities.

CONTEXT PROVIDED:
- Paper type: {determines skill focus}
- Syllabus topic: {content area}
- Conceptual focus: {big ideas to explore}
- ATL priorities: {skills to develop}
- Assessment type: {formative/summative focus}
- Teaching approach: {flipped/traditional}

GENERATE:
- 2-3 INQUIRY activities (opening hooks, questions)
- 3-4 ACTION activities (main learning tasks)
- 2-3 REFLECTION activities (synthesis, assessment)

Each activity must:
- Fit the IB paper requirements
- Develop selected conceptual understanding
- Build chosen ATL skills
- Align with assessment focus
- Work within time constraints
- Include brief rationale
`
```

## 🔄 IMPROVED UI FLOW

### Step 1: Smart Tagging
```pseudocode
SCREEN: Lesson Context
- Dropdown: Select Paper (1/2/3)
- Dropdown: Select Syllabus Topic
- Radio: Lesson Duration
- Checkbox: Using Flipped Learning?
[NEXT →]
```

### Step 2: Quick Selections
```pseudocode
SCREEN: Learning Priorities (All Tick Boxes)
- Conceptual Focus (pick 1-2)
- ATL Skills (pick 1-2)
- Assessment Focus (pick 1)
- Historical Thinking (pick primary)
[GENERATE ACTIVITIES →]
```

### Step 3: Activity Selection by IB Cycle
```pseudocode
SCREEN: Build Your Lesson

INQUIRY PHASE (10-15 min)
○ Provocative Question: "Why did peace fail..."
○ Source Mystery: "Analyze this cartoon..."
[Rationale shown on hover]

ACTION PHASE (65-70 min)
○ Source Analysis Workshop: "OPCVL stations..."
○ Structured Debate: "Was appeasement justified..."
○ Collaborative Timeline: "Cause mapping..."
[Select 1-2, time auto-calculated]

REFLECTION PHASE (10-15 min)
○ Exit Ticket: "Self-assess using success criteria"
○ Synthesis Paragraph: "Most significant factor..."
[Rationale shown on hover]

[GENERATE FULL LESSON →]
```

## 📊 REVISED API STRUCTURE

```pseudocode
POST /api/lessons/ib-history/create
  INPUT: {
    tags: {paper, topic, duration, flipped},
    priorities: {concepts, skills, assessment, thinking},
    selectedActivities: {inquiry[], action[], reflection[]}
  }
  OUTPUT: Complete IB-aligned lesson plan

GET /api/lessons/ib-history/activities
  INPUT: tags + priorities
  OUTPUT: Activities organized by IB cycle
```

## 🎯 IB-SPECIFIC SUCCESS CRITERIA

```pseudocode
LESSON QUALITY METRICS:
✓ Includes all three IB phases (Inquiry→Action→Reflection)
✓ Develops specific paper skills
✓ Addresses selected conceptual understanding
✓ Builds chosen ATL skills
✓ Aligns with IB assessment criteria
✓ Incorporates historical thinking
✓ Promotes international mindedness
✓ Includes differentiation options

USER EXPERIENCE METRICS:
✓ Setup time: < 3 minutes
✓ Selections: mostly tick boxes
✓ Activities: pre-filtered by context
✓ Rationales: clear and visible
```

## 🧠 INTELLIGENCE ENHANCEMENTS

### Context-Aware Filtering
```pseudocode
IF Paper 1 selected:
  PRIORITIZE: source analysis, OPCVL activities
  INCLUDE: variety of source types
  FOCUS: 4-5 sources maximum

IF Paper 2 selected:
  PRIORITIZE: essay planning, comparison
  INCLUDE: thesis development
  FOCUS: argumentation skills

IF Paper 3 selected:
  PRIORITIZE: detailed knowledge, regional focus
  INCLUDE: case studies
  FOCUS: depth over breadth
```

### Flipped Learning Adjustments
```pseudocode
IF flipped_learning = true:
  INQUIRY: Quick knowledge check (5 min)
  ACTION: All application/analysis (75 min)
  REFLECTION: Synthesis only (10 min)
  
ELSE:
  INQUIRY: Full introduction (15 min)
  ACTION: Mixed content/skills (65 min)
  REFLECTION: Standard close (10 min)
```

## 🔧 IMPLEMENTATION ADVANTAGES

1. **Faster Setup**: Tick boxes instead of typing
2. **IB Alignment**: Built into every choice
3. **Balanced Lessons**: Automatic IB cycle structure
4. **Clear Rationales**: Teachers understand why
5. **Flexibility**: Still allows customization
6. **Standards Met**: All IB requirements included

This approach maintains your innovative efficiency while ensuring every lesson meets IB History DP standards through smart design rather than lengthy questionnaires.