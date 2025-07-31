# Conversational Lesson Planning AI - Product Requirements Document

## Product Overview

An AI-powered conversational assistant that helps teachers create lesson sequences using the Teaching and Learning Cycle framework. The system engages teachers in natural dialogue to understand their teaching context, then generates structured lesson plans that build academic stamina through scaffolded writing instruction.

## Core Functionality

### Primary Capabilities
- **Conversational Context Building**: Natural dialogue to understand teaching situation
- **Framework Integration**: Deep knowledge of Teaching and Learning Cycle stages
- **Adaptive Lesson Generation**: Creates customised lesson sequences based on conversation
- **Iterative Refinement**: Allows teachers to modify and adjust generated plans
- **Cross-Curricular Application**: Works across subjects (History, English, Science, Geography, Design & Technology)

### AI Knowledge Base
- Complete Teaching and Learning Cycle framework understanding
- Subject-specific writing genres and requirements
- Age-appropriate activity suggestions
- Scaffolding strategies for different learner needs
- Academic stamina building techniques
- IB preparation considerations

## User Flow Examples

### Example 1: Initial Conversation
```
AI: "Hi! I'm here to help you plan lessons using the Teaching and Learning Cycle framework. Let's start - what subject are you teaching and what topic are you working on?"

Teacher: "Year 10 History, we're doing the causes of World War 1"

AI: "Perfect! World War 1 causes work really well with this framework. Are you thinking students will write historical arguments about which cause was most significant, or perhaps explanatory texts about how the causes connected? What kind of writing do your Year 10s typically find challenging?"

Teacher: "They struggle with making proper arguments with evidence. Most just list facts without analysis."

AI: "That's exactly what the framework helps with! Historical arguments are brilliant for building those analytical skills. How long are your lessons usually? And how many lessons can you dedicate to this topic?"

Teacher: "50 minutes each, and I have about 6 lessons before we move on."

AI: "Six 50-minute lessons is ideal for a full cycle. Is there anything specific about this class I should know? Mixed abilities, students with additional needs, or particular interests they have?"

Teacher: "Pretty mixed class, about 25 students. A few struggle with writing but they're quite engaged with the topic."

AI: "Excellent. Based on what you've told me, I can create a 6-lesson sequence that builds from basic understanding of WW1 causes to students writing independent historical arguments. Would you like me to start with an overview of how the cycle would work for your topic?"
```

### Example 2: Subject-Specific Adaptation
```
Teacher: "I teach Year 9 Science and we're covering chemical reactions"

AI: "Chemical reactions are great for explanation writing! Are you thinking students will explain how specific reactions work, or perhaps write about factors that affect reaction rates? What's your main learning goal?"

Teacher: "I want them to explain how combustion works at the molecular level. They always just memorise the equation without understanding the process."

AI: "Perfect - that's exactly what sequential explanations are designed for. The framework will help them build from basic particle theory up to explaining the complete combustion process. How comfortable are your students with scientific writing?"

Teacher: "They can write simple practical reports but struggle with more complex explanations."

AI: "The cycle will scaffold them beautifully from where they are to confident scientific explanations. Would you like the lessons to include hands-on investigations to build their field knowledge, or are you planning to use existing practical work?"
```

### Example 3: Clarification and Refinement
```
Teacher: "I'm doing persuasive writing in English with Year 8"

AI: "Persuasive writing is excellent for building argument skills! Are you thinking traditional persuasive essays, or perhaps speeches, letters to editors, or debates? What's the context or topic they'll be persuading about?"

Teacher: "Actually, I was thinking about environmental issues - maybe arguing for solutions to climate change?"

AI: "That works brilliantly! Are you leaning more towards traditional arguments where they present one strong position, or discussion texts where they weigh up different solutions? And what's your class like with research and finding reliable sources?"

Teacher: "I think arguments would be better. They struggle with research though - they just grab the first Google result."

AI: "Perfect. The supported reading stage will teach them proper source evaluation while building their knowledge of environmental solutions. How long do your English lessons run, and how many can you dedicate to this unit?"
```

## Generated Lesson Outputs

### Lesson Sequence Overview
```
**Year 10 History: Causes of World War 1 - Historical Argument Writing**
*6-lesson sequence using Teaching and Learning Cycle*

**Overall Goal**: Students write a 400-word historical argument answering: "Which cause of World War 1 was most significant in leading to conflict?"

**Lesson 1-2: Building Knowledge of the Field**
- Introduce WW1 causes through multimedia timeline
- Shared reading of textbook extracts on nationalism, imperialism, alliances, militarism
- Class mapping of cause-and-effect relationships
- Students write initial response (10 minutes): "Which cause do you think was most important and why?"

**Lesson 3: Supported Reading** 
- Modelled reading of historian interpretations
- Guided analysis of primary sources (speeches, treaties, newspaper articles)
- Students revise initial response incorporating new evidence (15 minutes)

**Lesson 4: Learning About the Genre**
- Deconstruct model historical argument
- Identify structure: position statement, evidence paragraphs, conclusion
- Analyse historian language: "This suggests...", "Evidence indicates...", "Most significantly..."
- Students restructure their draft to match argument format (20 minutes)

**Lesson 5: Supported Writing**
- Joint construction of strong opening paragraph
- Guided writing of evidence paragraphs with teacher conferencing
- Peer feedback on use of historical evidence

**Lesson 6: Independent Writing**
- 35-minute independent writing session
- Students complete final historical argument
- Self-assessment against co-constructed criteria
```

### Individual Lesson Detail Example
```
**Lesson 3: Supported Reading - WW1 Causes**

**Learning Intention**: Students will analyse different historical interpretations to gather evidence for their argument

**Success Criteria**: 
- Identify historians' different viewpoints on cause significance
- Extract relevant evidence with proper attribution
- Begin to evaluate strength of different arguments

**Activities**:

*Modelled Reading (15 minutes)*:
- Teacher demonstrates reading Historian A's interpretation of nationalism
- Think-aloud: "I notice she uses the phrase 'most crucial factor' - that's a strong claim"
- Models note-taking: evidence vs. opinion, author viewpoint, useful quotes

*Shared Reading (20 minutes)*:
- Class reads Historian B's view on alliance system together
- Guided questions: "How does this differ from our first reading?"
- Identify language that shows certainty/uncertainty in historical claims
- Create class comparison chart

*Guided Reading (10 minutes)*:
- Small groups with different primary sources (Franz Ferdinand's letters, German government statements, etc.)
- Teacher circulates supporting source analysis
- Groups identify key evidence related to different causes

**Student Writing Task (15 minutes)**:
Revise your initial response to include:
- One piece of evidence from today's readings
- One historian's viewpoint that supports OR challenges your original thinking
- Explanation of how this new evidence affects your argument

**Homework**: Read provided extract on economic factors, answer text-dependent questions
```

## Conversation Management Features

### Context Retention
The AI maintains conversation history and refers back to previous information:
```
AI: "Earlier you mentioned your students struggle with research skills. For the Supported Reading stage, would you prefer me to pre-select sources for them, or include explicit lessons on source evaluation?"

AI: "Since you have 50-minute lessons, we can combine the modelled and shared reading activities in Lesson 3. Does your classroom setup allow for easy transition between whole-class and small group work?"
```

### Clarification Requests
```
AI: "When you say 'explanation writing,' are you thinking more about sequential explanations that show step-by-step processes, or causal explanations that focus on why things happen?"

AI: "You mentioned mixed abilities - are there particular students who might need additional scaffolding, or others who could extend their learning?"

AI: "I want to make sure I understand your assessment requirements - is this a formative unit building towards something bigger, or will their final writing piece be formally assessed?"
```

### Adaptive Suggestions
```
AI: "Based on your 40-minute lessons, I'd suggest combining Stages 1 and 2 across three lessons rather than rushing each stage. Would that work better for your pacing?"

AI: "Since your students are strong with practical work but struggle with writing, shall I include more hands-on activities in the field-building stage to give them concrete experiences to write about?"

AI: "Given that this is your first time using the framework, would you like me to focus on just 2-3 key language features rather than trying to cover everything? We can always build complexity later."
```

## Technical Requirements

### AI Capabilities
- **Natural Language Processing**: Understand teaching context, subject matter, student needs
- **Framework Knowledge**: Complete understanding of all five cycle stages
- **Pedagogical Reasoning**: Make appropriate teaching decisions based on context
- **Content Generation**: Create detailed lesson plans, activities, and assessment criteria
- **Iterative Improvement**: Refine plans based on teacher feedback

### User Interface
- **Chat Interface**: Clean, focused conversation view
- **Conversation History**: Full transcript accessible throughout session
- **Generated Content Display**: Clear formatting for lesson plans and activities
- **Edit and Refine Options**: Teachers can request modifications to generated content
- **Save and Export**: Store lesson sequences, export to common formats
- **Quick Actions**: "Generate lesson," "Modify activity," "Add extension task"

### Data Storage
- **Session Management**: Maintain conversation state throughout planning session
- **User Preferences**: Remember teacher's typical class sizes, lesson lengths, teaching style
- **Generated Content**: Store and retrieve lesson sequences for future reference
- **Iteration Tracking**: Keep version history of refined lesson plans

## AI Response Examples

### Framework Guidance
```
AI: "In the Teaching and Learning Cycle, we always start writing early - even in Stage 1. This isn't their final piece, just a rough first attempt so you can see what they already know. Then they keep revising this same piece throughout the cycle rather than starting fresh at the end. Does that approach make sense for your topic?"

AI: "The key to Stage 3 is being really explicit about the writing genre. Your students need to see multiple examples of scientific explanations and identify the pattern: purpose statement, sequence of steps/stages, conclusion about the overall process. Would you like me to suggest some good model texts for combustion explanations?"
```

### Subject-Specific Adaptations
```
AI: "For Geography, place descriptions work brilliantly with this framework. Students will build knowledge through fieldwork and sources, then learn how geographical writing moves from general location to specific features to human-environment interactions. Your coastal erosion topic fits this perfectly."

AI: "Historical arguments in Year 10 should be about 300-400 words - long enough to develop ideas properly but not overwhelming. The key language features to focus on are: clear position statement, evidence with attribution, connective phrases like 'This demonstrates that...' or 'Furthermore, evidence suggests...'"
```

### Practical Teaching Advice
```
AI: "For the joint construction in Stage 4, have the students contribute ideas but you do the actual writing on the board. They're learning to see how their spoken ideas get crafted into proper written language. Don't worry if it feels teacher-directed - that's the point at this stage."

AI: "The independent writing in Stage 5 should feel achievable because they've been building the same piece all cycle. By now they know the content, understand the structure, and have practiced the language features. If they're struggling, it usually means we need to spend more time in Stages 2-4."
```

## Success Metrics

### Teacher Engagement
- **Conversation Completion Rate**: Percentage of teachers who complete full planning conversation
- **Lesson Generation Success**: Teachers successfully generate usable lesson sequences
- **Refinement Requests**: Frequency of teachers asking for modifications (indicates engagement)
- **Return Usage**: Teachers returning to plan additional units

### Generated Content Quality
- **Framework Alignment**: All generated lessons follow proper cycle stages
- **Subject Appropriateness**: Content matches subject-specific requirements and conventions
- **Differentiation**: Plans include appropriate scaffolding for different learner needs
- **Practical Feasibility**: Activities fit within stated lesson lengths and classroom constraints

### Educational Impact
- **Implementation Rate**: Teachers actually using generated lesson plans
- **Student Engagement**: Reported improvements in student writing and academic stamina
- **Cross-Curricular Adoption**: Framework spreading across multiple subjects in schools
- **Lesson Modification**: Teachers adapting and improving generated content (shows understanding)

## Example Generated Assessment Criteria

```
**Student Success Criteria - Historical Argument: WW1 Causes**

*Co-constructed with class during Stage 3*

**Content Knowledge**:
- I can identify and explain at least three major causes of WW1
- I can use specific historical evidence (dates, events, people)
- I can show connections between different causes

**Argument Structure**:
- I clearly state my position in the opening
- I organise my evidence into logical paragraphs
- I have a conclusion that reinforces my argument

**Historical Language**:
- I use historian phrases like "This suggests..." or "Evidence indicates..."
- I refer to historical sources properly
- I write in past tense and use formal language

**Academic Stamina**:
- I can write for 35 minutes independently
- I plan my writing before starting
- I check my work for clarity and accuracy
```

Answers 

Perfect! Here are the direct answers for your MVP:
1. Interface Style
Chat-like interface - full conversational flow like Claude with:

Message bubbles back and forth
AI responds naturally to teacher input
Conversation history maintained
Teachers can interrupt/redirect at any point

2. Integration
Connect to existing lesson creation backend - since this is your full product MVP, the conversational interface should feed into your current lesson generation system once the AI has gathered enough context.
3. Authentication
Keep existing authentication - maintain your current login system since this is replacing your main interface, not just a prototype.
4. AI Backend
Use your existing API from .env - leverage whatever AI service you already have configured. The conversation logic should build context through the chat, then pass that structured data to your lesson generation endpoint.
Key Implementation Flow:

User logs in (existing auth)
Chat interface replaces current landing page
AI gathers context through conversation
When ready, AI calls your lesson creation backend with structured data
Generated lessons display in chat or redirect to lesson view