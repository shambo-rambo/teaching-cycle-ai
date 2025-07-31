import { methodologyLoader } from './methodologyLoaderService.js';
import { smartTemplateSelector } from './smartTemplateSelector.js';

/**
 * Intelligent Lesson Enhancement Service
 * Analyzes existing lessons and provides research-based improvement suggestions
 */
class LessonEnhancementService {
  constructor() {
    this.initialized = false;
  }

  async initialize() {
    if (!this.initialized) {
      await methodologyLoader.loadMethodologies();
      this.initialized = true;
    }
  }

  /**
   * Analyze and enhance an existing lesson plan
   */
  async enhanceLesson(lessonPlan, enhancementOptions = {}) {
    await this.initialize();

    const analysis = await this.analyzeLessonQuality(lessonPlan);
    const improvements = await this.generateImprovements(lessonPlan, analysis, enhancementOptions);
    const newActivities = await this.suggestAdditionalActivities(lessonPlan, analysis);

    return {
      originalLesson: lessonPlan,
      qualityAnalysis: analysis,
      improvements,
      suggestedActivities: newActivities,
      enhancementSummary: this.generateEnhancementSummary(analysis, improvements),
      implementationGuidance: this.generateImplementationGuidance(improvements)
    };
  }

  /**
   * Analyze lesson quality against IB quality criteria
   */
  async analyzeLessonQuality(lessonPlan) {
    const checklist = methodologyLoader.getQualityChecklist();
    const analysis = {
      overallScore: 0,
      principleScores: {},
      strengths: [],
      improvements: [],
      missingElements: [],
      recommendations: []
    };

    // Analyze each IB teaching principle
    const principles = [
      'inquiry_based',
      'conceptual_understanding', 
      'contextual_learning',
      'collaborative_learning',
      'differentiated_learning',
      'assessment_informed'
    ];

    for (const principle of principles) {
      const principleScore = this.analyzePrincipleImplementation(lessonPlan, principle);
      analysis.principleScores[principle] = principleScore;
    }

    // Calculate overall score
    const totalScore = Object.values(analysis.principleScores).reduce((sum, score) => sum + score, 0);
    analysis.overallScore = Math.round(totalScore / principles.length);

    // Identify strengths and areas for improvement
    this.identifyStrengthsAndImprovements(analysis, lessonPlan);

    // Check against quality checklist
    analysis.checklistResults = this.evaluateAgainstChecklist(lessonPlan, checklist);

    return analysis;
  }

  /**
   * Analyze implementation of specific IB teaching principle
   */
  analyzePrincipleImplementation(lessonPlan, principle) {
    const lessonContent = JSON.stringify(lessonPlan).toLowerCase();
    let score = 0;

    switch (principle) {
      case 'inquiry_based':
        if (lessonContent.includes('question') || lessonContent.includes('inquiry')) score += 30;
        if (lessonContent.includes('investigate') || lessonContent.includes('explore')) score += 30;
        if (lessonContent.includes('reflect') || lessonContent.includes('reflection')) score += 20;
        if (lessonContent.includes('student-led') || lessonContent.includes('student led')) score += 20;
        break;

      case 'conceptual_understanding':
        if (lessonContent.includes('concept') || lessonContent.includes('big idea')) score += 40;
        if (lessonContent.includes('transfer') || lessonContent.includes('apply')) score += 30;
        if (lessonContent.includes('connection') || lessonContent.includes('pattern')) score += 30;
        break;

      case 'contextual_learning':
        if (lessonContent.includes('context') || lessonContent.includes('real world')) score += 35;
        if (lessonContent.includes('global') || lessonContent.includes('local')) score += 25;
        if (lessonContent.includes('cultural') || lessonContent.includes('perspective')) score += 25;
        if (lessonContent.includes('authentic') || lessonContent.includes('meaningful')) score += 15;
        break;

      case 'collaborative_learning':
        if (lessonContent.includes('group') || lessonContent.includes('team')) score += 30;
        if (lessonContent.includes('collaborate') || lessonContent.includes('peer')) score += 30;
        if (lessonContent.includes('discussion') || lessonContent.includes('share')) score += 25;
        if (lessonContent.includes('social') || lessonContent.includes('communication')) score += 15;
        break;

      case 'differentiated_learning':
        if (lessonContent.includes('differentiat') || lessonContent.includes('scaffold')) score += 35;
        if (lessonContent.includes('support') || lessonContent.includes('extension')) score += 25;
        if (lessonContent.includes('diverse') || lessonContent.includes('individual')) score += 25;
        if (lessonContent.includes('choice') || lessonContent.includes('multiple')) score += 15;
        break;

      case 'assessment_informed':
        if (lessonContent.includes('assessment') || lessonContent.includes('feedback')) score += 40;
        if (lessonContent.includes('formative') || lessonContent.includes('check')) score += 30;
        if (lessonContent.includes('self-assess') || lessonContent.includes('peer assess')) score += 30;
        break;
    }

    return Math.min(score, 100);
  }

  /**
   * Identify strengths and improvement areas
   */
  identifyStrengthsAndImprovements(analysis, lessonPlan) {
    // Identify strengths (scores > 70)
    for (const [principle, score] of Object.entries(analysis.principleScores)) {
      if (score > 70) {
        analysis.strengths.push({
          principle,
          score,
          description: this.getPrincipleDescription(principle, 'strength')
        });
      } else if (score < 50) {
        analysis.improvements.push({
          principle,
          score,
          description: this.getPrincipleDescription(principle, 'improvement'),
          suggestions: this.getPrincipleSuggestions(principle)
        });
      }
    }

    // Check for missing essential elements
    this.identifyMissingElements(analysis, lessonPlan);
  }

  /**
   * Get description for principle strength or improvement
   */
  getPrincipleDescription(principle, type) {
    const descriptions = {
      inquiry_based: {
        strength: 'Strong implementation of inquiry-based learning with student questioning and investigation',
        improvement: 'Limited evidence of inquiry approaches - students need more opportunities to ask questions and investigate'
      },
      conceptual_understanding: {
        strength: 'Good focus on conceptual understanding with transferable ideas',
        improvement: 'Lesson appears content-heavy - needs more emphasis on big ideas and conceptual connections'
      },
      contextual_learning: {
        strength: 'Excellent use of meaningful contexts and real-world connections',
        improvement: 'Limited contextual relevance - needs stronger connections to local/global contexts'
      },
      collaborative_learning: {
        strength: 'Well-designed collaborative learning opportunities with structured interaction',
        improvement: 'Insufficient collaborative elements - students need more peer interaction and shared responsibility'
      },
      differentiated_learning: {
        strength: 'Good differentiation strategies that address diverse learning needs',
        improvement: 'Limited differentiation - needs more scaffolding, choice, and support for diverse learners'
      },
      assessment_informed: {
        strength: 'Strong integration of assessment for learning with regular feedback',
        improvement: 'Weak assessment integration - needs more formative assessment and feedback opportunities'
      }
    };

    return descriptions[principle]?.[type] || '';
  }

  /**
   * Get improvement suggestions for principle
   */
  getPrincipleSuggestions(principle) {
    const suggestions = {
      inquiry_based: [
        'Add opening hook with provocative questions',
        'Include structured inquiry investigation activity',
        'Build in reflection on inquiry process',
        'Allow student choice in investigation topics'
      ],
      conceptual_understanding: [
        'Identify 2-3 key transferable concepts',
        'Add concept mapping or exploration activity',
        'Include explicit transfer opportunities',
        'Connect facts to broader conceptual patterns'
      ],
      contextual_learning: [
        'Add local community connections',
        'Include global perspective examples',
        'Design authentic real-world applications',
        'Incorporate diverse cultural viewpoints'
      ],
      collaborative_learning: [
        'Add structured group work with defined roles',
        'Include peer feedback opportunities',
        'Design collaborative knowledge construction tasks',
        'Build in social skill development'
      ],
      differentiated_learning: [
        'Provide multiple learning pathways',
        'Add scaffolding for struggling learners',
        'Include extension activities for advanced students',
        'Offer choice in how students demonstrate learning'
      ],
      assessment_informed: [
        'Embed formative assessment check-ins',
        'Add peer and self-assessment opportunities',
        'Design feedback-rich activities',
        'Include reflection on learning progress'
      ]
    };

    return suggestions[principle] || [];
  }

  /**
   * Identify missing essential elements
   */
  identifyMissingElements(analysis, lessonPlan) {
    const essentialElements = [
      'clear_learning_objectives',
      'ib_learner_profile_connections',
      'atl_skill_development',
      'international_mindedness',
      'tok_connections',
      'differentiation_strategies',
      'assessment_opportunities'
    ];

    const lessonContent = JSON.stringify(lessonPlan).toLowerCase();

    for (const element of essentialElements) {
      if (!this.hasElement(lessonContent, element)) {
        analysis.missingElements.push({
          element,
          description: this.getElementDescription(element),
          importance: this.getElementImportance(element)
        });
      }
    }
  }

  /**
   * Check if lesson has essential element
   */
  hasElement(lessonContent, element) {
    const elementKeywords = {
      clear_learning_objectives: ['objective', 'goal', 'outcome', 'aim'],
      ib_learner_profile_connections: ['learner profile', 'inquirer', 'thinker', 'communicator'],
      atl_skill_development: ['atl', 'skill', 'thinking', 'communication', 'research'],
      international_mindedness: ['international', 'global', 'cultural', 'perspective'],
      tok_connections: ['tok', 'theory of knowledge', 'way of knowing'],
      differentiation_strategies: ['differentiat', 'scaffold', 'support', 'extension'],
      assessment_opportunities: ['assessment', 'feedback', 'check', 'evaluate']
    };

    const keywords = elementKeywords[element] || [];
    return keywords.some(keyword => lessonContent.includes(keyword));
  }

  /**
   * Get description for missing element
   */
  getElementDescription(element) {
    const descriptions = {
      clear_learning_objectives: 'Specific, measurable learning objectives that align with IB standards',
      ib_learner_profile_connections: 'Explicit connections to IB Learner Profile attributes',
      atl_skill_development: 'Development of Approaches to Learning skills',
      international_mindedness: 'Global perspectives and intercultural understanding',
      tok_connections: 'Theory of Knowledge connections and epistemological thinking',
      differentiation_strategies: 'Support for diverse learning needs and abilities',
      assessment_opportunities: 'Formative and summative assessment integration'
    };

    return descriptions[element] || '';
  }

  /**
   * Get importance level for missing element
   */
  getElementImportance(element) {
    const importance = {
      clear_learning_objectives: 'critical',
      ib_learner_profile_connections: 'important',
      atl_skill_development: 'important',
      international_mindedness: 'important',
      tok_connections: 'moderate',
      differentiation_strategies: 'critical',
      assessment_opportunities: 'critical'
    };

    return importance[element] || 'moderate';
  }

  /**
   * Evaluate lesson against quality checklist
   */
  evaluateAgainstChecklist(lessonPlan, checklist) {
    const results = {
      totalItems: checklist.length,
      passedItems: 0,
      failedItems: [],
      passedPercentage: 0
    };

    const lessonContent = JSON.stringify(lessonPlan).toLowerCase();

    for (const criterion of checklist) {
      if (this.evaluateChecklistCriterion(criterion, lessonContent)) {
        results.passedItems++;
      } else {
        results.failedItems.push({
          criterion,
          suggestion: this.getChecklistSuggestion(criterion)
        });
      }
    }

    results.passedPercentage = Math.round((results.passedItems / results.totalItems) * 100);
    return results;
  }

  /**
   * Evaluate single checklist criterion
   */
  evaluateChecklistCriterion(criterion, lessonContent) {
    // Simplified evaluation based on keyword matching
    const criterionKeywords = {
      'concepts_are_abstract_enduring_and_transferable': ['concept', 'transfer', 'abstract', 'enduring'],
      'content_makes_concepts_concrete_and_meaningful': ['concrete', 'example', 'specific', 'meaningful'],
      'skills_provide_access_to_conceptual_understanding': ['skill', 'access', 'understand', 'develop'],
      'contexts_are_relevant_to_student_identity_and_future': ['relevant', 'identity', 'future', 'personal'],
      'collaboration_promotes_meaningful_knowledge_construction': ['collaborate', 'construct', 'knowledge', 'meaningful'],
      'differentiation_affirms_identity_and_builds_on_strengths': ['differentiat', 'identity', 'strength', 'build'],
      'assessment_enhances_learning_and_provides_meaningful_feedback': ['assessment', 'enhance', 'feedback', 'meaningful'],
      'activities_promote_international_mindedness_and_global_citizenship': ['international', 'global', 'citizen', 'mindedness'],
      'atl_skills_are_explicitly_developed_and_practiced': ['atl', 'skill', 'develop', 'practice'],
      'inquiry_promotes_authentic_questions_and_sustained_investigation': ['inquiry', 'question', 'investigate', 'authentic']
    };

    const keywords = criterionKeywords[criterion] || [];
    const requiredMatches = Math.ceil(keywords.length / 2); // Need at least half the keywords
    const actualMatches = keywords.filter(keyword => lessonContent.includes(keyword)).length;

    return actualMatches >= requiredMatches;
  }

  /**
   * Get suggestion for failed checklist item
   */
  getChecklistSuggestion(criterion) {
    const suggestions = {
      'concepts_are_abstract_enduring_and_transferable': 'Focus on 2-3 big ideas that students can apply in new contexts',
      'content_makes_concepts_concrete_and_meaningful': 'Use specific examples and case studies to illustrate abstract concepts',
      'skills_provide_access_to_conceptual_understanding': 'Teach skills explicitly as tools for accessing deeper understanding',
      'contexts_are_relevant_to_student_identity_and_future': 'Connect learning to students\' personal experiences and aspirations',
      'collaboration_promotes_meaningful_knowledge_construction': 'Design collaborative tasks that require genuine knowledge building',
      'differentiation_affirms_identity_and_builds_on_strengths': 'Provide multiple pathways that honor student diversity',
      'assessment_enhances_learning_and_provides_meaningful_feedback': 'Integrate assessment as learning, not just evaluation',
      'activities_promote_international_mindedness_and_global_citizenship': 'Include global perspectives and intercultural connections',
      'atl_skills_are_explicitly_developed_and_practiced': 'Name and practice specific ATL skills within content learning',
      'inquiry_promotes_authentic_questions_and_sustained_investigation': 'Begin with genuine questions that drive extended investigation'
    };

    return suggestions[criterion] || 'Consider how to better integrate this IB principle';
  }

  /**
   * Generate specific improvements based on analysis
   */
  async generateImprovements(lessonPlan, analysis, options = {}) {
    const improvements = {
      priority: 'high',
      structural: [],
      pedagogical: [],
      assessment: [],
      differentiation: [],
      resources: []
    };

    // Generate structural improvements
    improvements.structural = this.generateStructuralImprovements(analysis, lessonPlan);

    // Generate pedagogical improvements
    improvements.pedagogical = await this.generatePedagogicalImprovements(analysis, lessonPlan);

    // Generate assessment improvements
    improvements.assessment = this.generateAssessmentImprovements(analysis, lessonPlan);

    // Generate differentiation improvements
    improvements.differentiation = this.generateDifferentiationImprovements(analysis, lessonPlan);

    // Generate resource improvements
    improvements.resources = this.generateResourceImprovements(analysis, lessonPlan);

    return improvements;
  }

  /**
   * Generate structural improvements
   */
  generateStructuralImprovements(analysis, lessonPlan) {
    const improvements = [];

    // Check lesson structure
    if (!lessonPlan.structure || !lessonPlan.structure.opening) {
      improvements.push({
        type: 'add_opening',
        title: 'Add engaging opening hook',
        description: 'Include a compelling opening that captures attention and activates prior knowledge',
        priority: 'high',
        implementation: 'Add 10-15 minute opening with provocative question or intriguing scenario'
      });
    }

    if (!lessonPlan.structure || !lessonPlan.structure.closing) {
      improvements.push({
        type: 'add_closing',
        title: 'Add synthesis closing',
        description: 'Include meaningful closure that consolidates learning and previews next steps',
        priority: 'high',
        implementation: 'Add 10-15 minute closing with reflection and connection to future learning'
      });
    }

    // Check for balanced timing
    if (lessonPlan.activities && lessonPlan.activities.length > 0) {
      const totalTime = lessonPlan.activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
      if (totalTime > parseInt(lessonPlan.duration) * 1.1) {
        improvements.push({
          type: 'adjust_timing',
          title: 'Adjust activity timing',
          description: 'Activities exceed available time - consider prioritizing or shortening',
          priority: 'medium',
          implementation: 'Review activity durations and prioritize most essential elements'
        });
      }
    }

    return improvements;
  }

  /**
   * Generate pedagogical improvements based on methodology analysis
   */
  async generatePedagogicalImprovements(analysis, lessonPlan) {
    const improvements = [];

    // Suggest methodologies for weak principles
    for (const improvement of analysis.improvements) {
      const methodologies = methodologyLoader.getMethodologiesForPrinciple(improvement.principle);
      const topMethodologies = Object.keys(methodologies).slice(0, 2);

      improvements.push({
        type: 'add_methodology',
        principle: improvement.principle,
        title: `Enhance ${improvement.principle.replace(/_/g, ' ')}`,
        description: improvement.description,
        suggestedMethodologies: topMethodologies,
        priority: improvement.score < 30 ? 'high' : 'medium',
        implementation: `Consider integrating ${topMethodologies[0].replace(/_/g, ' ')} methodology`
      });
    }

    return improvements;
  }

  /**
   * Generate assessment improvements
   */
  generateAssessmentImprovements(analysis, lessonPlan) {
    const improvements = [];

    if (analysis.principleScores.assessment_informed < 50) {
      improvements.push({
        type: 'add_formative_assessment',
        title: 'Add formative assessment checkpoints',
        description: 'Include regular check-ins to monitor student understanding',
        priority: 'high',
        implementation: 'Add 2-3 quick formative assessments throughout the lesson'
      });

      improvements.push({
        type: 'add_feedback_opportunities',
        title: 'Increase feedback opportunities',
        description: 'Provide more specific, timely feedback to students',
        priority: 'high',
        implementation: 'Include peer feedback activities and teacher feedback moments'
      });
    }

    return improvements;
  }

  /**
   * Generate differentiation improvements
   */
  generateDifferentiationImprovements(analysis, lessonPlan) {
    const improvements = [];

    if (analysis.principleScores.differentiated_learning < 50) {
      improvements.push({
        type: 'add_scaffolding',
        title: 'Add learning scaffolds',
        description: 'Provide support structures for struggling learners',
        priority: 'high',
        implementation: 'Include graphic organizers, sentence starters, and step-by-step guides'
      });

      improvements.push({
        type: 'add_choice',
        title: 'Provide student choice',
        description: 'Offer multiple ways for students to engage with content',
        priority: 'medium',
        implementation: 'Allow choice in topics, methods, or demonstration formats'
      });

      improvements.push({
        type: 'add_extension',
        title: 'Add extension activities',
        description: 'Challenge advanced learners with additional complexity',
        priority: 'medium',
        implementation: 'Include optional extension tasks for early finishers'
      });
    }

    return improvements;
  }

  /**
   * Generate resource improvements
   */
  generateResourceImprovements(analysis, lessonPlan) {
    const improvements = [];

    // Check for multimedia resources
    const hasMultimedia = lessonPlan.resources?.technology?.length > 0;
    if (!hasMultimedia) {
      improvements.push({
        type: 'add_multimedia',
        title: 'Add multimedia resources',
        description: 'Include digital tools to enhance engagement',
        priority: 'medium',
        implementation: 'Consider videos, interactive simulations, or digital collaboration tools'
      });
    }

    // Check for authentic materials
    const hasAuthentic = JSON.stringify(lessonPlan).toLowerCase().includes('authentic');
    if (!hasAuthentic) {
      improvements.push({
        type: 'add_authentic_materials',
        title: 'Include authentic materials',
        description: 'Use real-world documents and resources',
        priority: 'medium',
        implementation: 'Find primary sources, news articles, or industry examples'
      });
    }

    return improvements;
  }

  /**
   * Suggest additional activities based on gaps
   */
  async suggestAdditionalActivities(lessonPlan, analysis) {
    const suggestions = [];

    // Suggest activities for weak principles
    for (const improvement of analysis.improvements) {
      const context = this.extractLessonContext(lessonPlan);
      const methodologySelection = await smartTemplateSelector.selectOptimalMethodologies({
        ...context,
        teachingFocus: [improvement.principle]
      });

      const activities = this.convertMethodologySelectionToActivities(methodologySelection, improvement.principle);
      
      suggestions.push({
        principle: improvement.principle,
        reason: `Strengthen ${improvement.principle.replace(/_/g, ' ')} (current score: ${improvement.score}%)`,
        activities: activities.slice(0, 2) // Top 2 suggestions
      });
    }

    return suggestions;
  }

  /**
   * Extract lesson context for activity suggestions
   */
  extractLessonContext(lessonPlan) {
    return {
      subject: lessonPlan.subject || 'history',
      topic: lessonPlan.topic || '',
      duration: parseInt(lessonPlan.duration) || 90,
      yearLevel: lessonPlan.yearLevel || '',
      studentCount: 25 // Default assumption
    };
  }

  /**
   * Convert methodology selection to activity suggestions
   */
  convertMethodologySelectionToActivities(methodologySelection, targetPrinciple) {
    const activities = [];
    const principleMethodologies = methodologySelection.selectedMethodologies.methodologies?.[targetPrinciple] || [];

    for (const methodology of principleMethodologies.slice(0, 2)) {
      const activity = {
        title: methodology.methodology.activity_structure?.name || methodology.name,
        description: methodology.methodology.activity_structure?.description || '',
        duration: 30, // Default duration
        rationale: methodology.rationale,
        implementation: methodology.methodology.activity_structure?.implementation_phases?.map(phase => 
          phase.description
        ).join(' → ') || 'Follow methodology implementation phases'
      };
      activities.push(activity);
    }

    return activities;
  }

  /**
   * Generate enhancement summary
   */
  generateEnhancementSummary(analysis, improvements) {
    const summary = {
      overallAssessment: this.getOverallAssessment(analysis.overallScore),
      keyStrengths: analysis.strengths.map(s => s.description),
      priorityImprovements: this.getPriorityImprovements(improvements),
      implementationComplexity: this.assessImplementationComplexity(improvements),
      estimatedImprovementTime: this.estimateImprovementTime(improvements)
    };

    return summary;
  }

  /**
   * Get overall assessment based on score
   */
  getOverallAssessment(score) {
    if (score >= 80) return 'Excellent - Strong IB pedagogy implementation';
    if (score >= 70) return 'Good - Solid foundation with room for enhancement';
    if (score >= 60) return 'Satisfactory - Some IB elements present, needs strengthening';
    if (score >= 50) return 'Developing - Basic structure present, significant improvements needed';
    return 'Beginning - Major revisions needed to align with IB pedagogy';
  }

  /**
   * Get priority improvements
   */
  getPriorityImprovements(improvements) {
    const priority = [];
    
    Object.values(improvements).forEach(category => {
      if (Array.isArray(category)) {
        const highPriority = category.filter(item => item.priority === 'high');
        priority.push(...highPriority.map(item => item.title));
      }
    });

    return priority.slice(0, 5); // Top 5 priorities
  }

  /**
   * Assess implementation complexity
   */
  assessImplementationComplexity(improvements) {
    let complexity = 0;
    
    Object.values(improvements).forEach(category => {
      if (Array.isArray(category)) {
        complexity += category.length;
      }
    });

    if (complexity <= 3) return 'Low - Minor adjustments needed';
    if (complexity <= 7) return 'Medium - Moderate revisions required';
    return 'High - Significant restructuring needed';
  }

  /**
   * Estimate improvement implementation time
   */
  estimateImprovementTime(improvements) {
    let totalImprovements = 0;
    
    Object.values(improvements).forEach(category => {
      if (Array.isArray(category)) {
        totalImprovements += category.length;
      }
    });

    const timePerImprovement = 15; // minutes
    const totalMinutes = totalImprovements * timePerImprovement;
    
    if (totalMinutes <= 30) return '30 minutes or less';
    if (totalMinutes <= 60) return '1 hour';
    if (totalMinutes <= 120) return '2 hours';
    return '2+ hours';
  }

  /**
   * Generate implementation guidance
   */
  generateImplementationGuidance(improvements) {
    const guidance = {
      phaseOne: [],
      phaseTwo: [],
      phaseThree: [],
      resources: [],
      timeline: ''
    };

    // Organize improvements by implementation phase
    const allImprovements = [];
    Object.values(improvements).forEach(category => {
      if (Array.isArray(category)) {
        allImprovements.push(...category);
      }
    });

    // Phase 1: High priority, low complexity
    guidance.phaseOne = allImprovements
      .filter(imp => imp.priority === 'high' && !imp.type?.includes('methodology'))
      .map(imp => ({ title: imp.title, implementation: imp.implementation }));

    // Phase 2: Medium priority or methodology additions
    guidance.phaseTwo = allImprovements
      .filter(imp => imp.priority === 'medium' || imp.type?.includes('methodology'))
      .map(imp => ({ title: imp.title, implementation: imp.implementation }));

    // Phase 3: Resource and enhancement improvements
    guidance.phaseThree = allImprovements
      .filter(imp => imp.type?.includes('resource') || imp.type?.includes('extension'))
      .map(imp => ({ title: imp.title, implementation: imp.implementation }));

    // Generate timeline
    const totalPhases = [guidance.phaseOne, guidance.phaseTwo, guidance.phaseThree]
      .filter(phase => phase.length > 0).length;
    
    if (totalPhases <= 1) {
      guidance.timeline = 'Complete all improvements in single session';
    } else if (totalPhases === 2) {
      guidance.timeline = 'Implement in 2 sessions over 1 week';
    } else {
      guidance.timeline = 'Implement in 3 phases over 2 weeks';
    }

    // Suggest resources
    guidance.resources = [
      'IB Teaching Methodology Documentation',
      'Activity Templates and Implementation Guides',
      'Assessment Rubrics and Feedback Tools',
      'Differentiation Strategy Guides'
    ];

    return guidance;
  }
}

export const lessonEnhancementService = new LessonEnhancementService();
export default LessonEnhancementService;