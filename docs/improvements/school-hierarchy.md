# School Hierarchy Build Order
## Sequential Development Steps for School Intelligence System

---

## 🎯 **BUILD OBJECTIVE**
Add organizational hierarchy and framework distribution to existing lesson analyzer/creator app, enabling executives to create frameworks that guide teacher lesson creation. MVP version with simple user registration for testing.

---

## 📋 **STEP-BY-STEP BUILD ORDER**

### **STEP 1: Basic User Registration & Role System**
**What to Build:**
- Simple user registration (no domain validation for MVP)
- Basic role assignment system
- User dashboard shells

**Specific Requirements:**
- User registration form: Name, Email, Password
- Default role assignment: "Teacher" 
- Basic role options: Teacher, HeadOfTeachingLearning, HeadOfLearningSupport, Admin
- Simple user dashboard showing role and basic info

**Database Schema:**
```javascript
User {
  userId: string (unique)
  email: string
  name: string
  role: string (Teacher, HeadOfTeachingLearning, HeadOfLearningSupport, Admin)
  createdAt: timestamp
}
```

**Success Criteria:** 
- Users can register with any email
- Users get assigned "Teacher" role by default
- Users can access basic dashboard
- Role is displayed in user interface

---

### **STEP 2: Role Promotion System**
**What to Build:**
- Admin interface to promote users to executive roles
- Role-based dashboard routing
- Executive dashboard shells

**Specific Requirements:**
- Admin dashboard shows list of all users
- "Promote to Executive" buttons for Head of Teaching & Learning, Head of Learning Support
- Role change updates user record
- Different dashboard interfaces for each role
- Admin role assignment (for testing, make first user admin or add admin promotion)

**New Interface Requirements:**
- Admin can see user list
- Promote/demote role buttons  
- Different dashboard layouts for Teacher, Executive roles, Admin
- Role indicator in user interface

**Success Criteria:**
- Admin can promote users to Head of Teaching & Learning and Head of Learning Support roles
- Executive users see different dashboard than regular teachers
- Role changes persist and update user interface

---

### **STEP 3: Department Structure Creation**
**What to Build:**
- Department creation interface
- Subject assignment within departments
- Department dashboard

**Specific Requirements:**
- Admin can create departments (Languages, Sciences, Individuals & Societies, etc.)
- Assign subjects to departments (IB History DP, IB Biology HL, etc.)
- Department head assignment from user list
- Basic department dashboard for department heads

**Database Schema:**
```javascript
Department {
  departmentId: string (unique)
  departmentName: string
  headOfDepartmentId: string (foreign key to User)
  subjects: array of strings
  createdAt: timestamp
}
```

**Success Criteria:**
- Admin can create multiple departments
- Subjects can be assigned to departments
- Department heads can access department dashboard
- Departments display in admin interface

---

### **STEP 4: Student Data Import System**
**What to Build:**
- CSV upload interface
- Student profile creation
- Learning support tag system

**Specific Requirements:**
- CSV upload form for student data
- Required fields: Student Name, Year Level (DP1/DP2), Learning Support Tags
- Learning support tags: ADHD, Dyslexia, ESL, etc.
- Student list display in admin dashboard

**Database Schema:**
```javascript
Student {
  studentId: string (unique)
  studentName: string
  yearLevel: string (DP1, DP2)
  learningSupport: {
    tags: array of strings
    accommodations: array of strings
  }
  createdAt: timestamp
}
```

**CSV Format Example:**
```
Student Name,Year Level,Learning Support Tags
John Smith,DP1,"ADHD,Movement breaks"
Jane Doe,DP2,ESL
```

**Success Criteria:**
- Can upload CSV with student data
- Learning support tags are properly parsed
- Student list displays in admin interface

---

### **STEP 5: Basic Framework Creation (Head of Teaching & Learning)**
**What to Build:**
- Framework creation form
- Framework storage system
- Teaching & Learning dashboard

**Specific Requirements:**
- Framework creation form with fields: Title, Description, Strategies, Priority Level
- Pre-populated IB DP curriculum options
- High Impact Teaching strategies (Learning Intentions & Success Criteria)
- Framework list display

**Database Schema:**
```javascript
Framework {
  frameworkId: string (unique)
  createdBy: string (foreign key to User)
  frameworkType: string (TeachingLearning)
  title: string
  description: string
  strategies: array of objects
  priority: string (high, medium, low)
  curriculumScope: string (IB_DP)
  createdAt: timestamp
}
```

**Pre-configured Options:**
- IB DP subjects list
- High Impact Teaching strategies template
- Learning Intentions & Success Criteria framework

**Success Criteria:**
- Head of T&L can create frameworks
- Frameworks save with proper metadata
- Framework list displays in executive dashboard

---

### **STEP 6: Basic Framework Creation (Head of Teaching & Learning)**
**What to Build:**
- Framework creation form
- Framework storage system
- Teaching & Learning dashboard

**Specific Requirements:**
- Framework creation form with fields: Title, Description, Strategies, Priority Level
- Pre-populated IB DP curriculum options
- High Impact Teaching strategies (Learning Intentions & Success Criteria)
- Framework list display

**Database Schema:**
```javascript
Framework {
  frameworkId: string (unique)
  schoolId: string (foreign key)
  createdBy: string (foreign key to User)
  frameworkType: string (TeachingLearning)
  title: string
  description: string
  strategies: array of objects
  priority: string (high, medium, low)
  curriculumScope: string (IB_DP)
  createdAt: timestamp
}
```

**Pre-configured Options:**
- IB DP subjects list
- High Impact Teaching strategies template
- Learning Intentions & Success Criteria framework

**Success Criteria:**
- Head of T&L can create frameworks
- Frameworks save with proper metadata
- Framework list displays in executive dashboard

---

### **STEP 6: Learning Support Framework Creation**
**What to Build:**
- Learning support framework interface
- Differentiation strategy templates
- Head of Learning Support dashboard

**Specific Requirements:**
- Framework creation for learning support strategies
- Pre-populated accommodation templates (ADHD, Dyslexia, ESL)
- Individual student accommodation options
- Strategy assignment to student tags

**Framework Templates:**
- ADHD: Movement breaks, reduced text, visual organizers
- Dyslexia: Audio support, extended time, simplified instructions
- ESL: Visual vocabulary, translation support, peer partnering

**Success Criteria:**
- Head of Learning Support can create accommodation frameworks
- Templates are available for common learning support needs
- Frameworks link to student learning support tags

---

### **STEP 7: Class Profile Creation System**
**What to Build:**
- Class creation interface
- Student assignment to classes
- Course context configuration

**Specific Requirements:**
- Class creation form: Subject, Year Level, Teacher Assignment
- Student selection from student database
- Course context: Papers teaching (Paper 1, 2, 3, IA), Lesson duration
- Class size auto-calculation from student count

**Database Schema:**
```javascript
Class {
  classId: string (unique)
  teacherId: string (foreign key to User)
  departmentId: string (foreign key)
  subject: string
  yearLevel: string (DP1, DP2)
  papersTeaching: array of strings
  lessonDuration: string (free text)
  studentIds: array of strings (foreign keys to Student)
  createdAt: timestamp
}
```

**Success Criteria:**
- Teachers can create classes with student assignments
- Course context captures all required information
- Class profiles display student learning support requirements

---

### **STEP 8: Scope & Sequence Wizard**
**What to Build:**
- Curriculum topic selection interface
- Unit sequencing system
- Progress tracking

**Specific Requirements:**
- Subject-specific topic lists (e.g., IB History Paper 2 topics)
- Checkbox selection for topics teaching this year
- Drag-and-drop unit sequencing
- Progress indicators (Not started, Current, Completed)

**IB History Example Topics:**
- WHT10: Authoritarian States (20th century)
- WHT11: Causes and effects of 20th century wars
- WHT12: The Cold War
- etc.

**Database Schema:**
```javascript
ScopeSequence {
  scopeId: string (unique)
  classId: string (foreign key)
  selectedTopics: array of strings
  unitSequence: array of objects {topicId, order, status}
  currentPosition: string
  updatedAt: timestamp
}
```

**Success Criteria:**
- Teachers can select curriculum topics for their class
- Topics can be sequenced in teaching order
- Progress can be tracked throughout the year

---

### **STEP 9: Framework Distribution System**
**What to Build:**
- Framework inheritance from executives to classes
- Framework display in teacher interface
- Priority messaging system

**Specific Requirements:**
- Automatic framework distribution to appropriate classes
- Teacher interface showing applicable frameworks
- Priority indicators ("School Priority" tags)
- Framework compliance tracking

**Teacher Framework View:**
- List of applicable frameworks for their class
- Framework details and implementation guidance
- Priority level indicators
- "Accept/Adapt/Ignore" options for future AI integration

**Success Criteria:**
- Executive frameworks automatically appear in relevant teacher dashboards
- Teachers can view framework details and implementation guidance
- Priority frameworks are clearly highlighted

---

### **STEP 10: Basic Reporting Dashboard**
**What to Build:**
- Executive overview dashboard
- Department summary views
- Class profile analytics

**Specific Requirements:**
- Executive dashboard showing framework adoption across classes
- Department dashboard showing class profiles and teacher assignments
- Admin dashboard showing school-wide statistics

**Key Metrics to Display:**
- Number of classes created
- Framework distribution status
- Student learning support summary
- Department activity overview

**Success Criteria:**
- Executives can see school-wide framework implementation
- Department heads can see their department's classes and teachers
- Admin has overview of all school activity

---

### **STEP 11: Integration Preparation for Lesson Creator/Analyzer**
**What to Build:**
- API endpoints for lesson system integration
- Class profile data access
- Framework data formatting

**Specific Requirements:**
- API endpoint: GET /api/classes/{classId}/profile (returns full class context)
- API endpoint: GET /api/frameworks/applicable/{classId} (returns relevant frameworks)
- API endpoint: GET /api/students/{classId}/learning-support (returns student accommodations)
- Data formatting for AI system prompt generation

**API Response Examples:**
```javascript
// Class Profile API
{
  classId: "class123",
  subject: "IB History DP",
  yearLevel: "DP1", 
  students: [...],
  frameworks: [...],
  scopeSequence: [...]
}

// Framework API  
{
  frameworks: [
    {
      type: "TeachingLearning",
      title: "Learning Intentions & Success Criteria",
      systemPrompt: "Ensure all lessons include clear learning intentions...",
      priority: "high"
    }
  ]
}
```

**Success Criteria:**
- Lesson creator can access complete class profile data
- Framework information is properly formatted for AI integration
- Student learning support data is available for differentiation

---

## ✅ **COMPLETION CHECKLIST**

After completing all 11 steps, the system should have:

- [ ] Simple user registration and role system
- [ ] Role promotion capabilities (Teacher → Executive)
- [ ] Department and subject organization
- [ ] Student data import and management
- [ ] Framework creation for Teaching & Learning and Learning Support
- [ ] Class profile system with course context
- [ ] Scope & sequence planning tools
- [ ] Framework distribution and priority messaging
- [ ] Basic reporting and analytics
- [ ] API integration points for lesson creator/analyzer

---

## 🔄 **WORKFLOW AFTER COMPLETION**

**Ready for AI Integration:**
1. Random users register and get assigned Teacher role
2. Admin promotes some users to Head of T&L and Head of Learning Support
3. Executives create frameworks (IB DP + High Impact Teaching, Learning Support)
4. Admin imports student data with learning support tags
5. Teachers create class profiles using imported student lists
6. Teacher creates lesson in lesson creator
7. System pulls class profile data (students, frameworks, scope & sequence)
8. AI applies frameworks as system prompts
9. AI suggests differentiation based on student learning support profiles
10. Teacher receives framework-compliant lesson with differentiation options

**This completes the organizational hierarchy shell ready for your existing lesson analyzer/creator integration.**