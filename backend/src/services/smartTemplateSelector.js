import { methodologyLoader } from './methodologyLoaderService.js';

/**
 * Smart Template Selection System
 * Intelligently selects optimal IB teaching methodologies based on context
 */
class SmartTemplateSelector {
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
   * Select optimal methodologies based on lesson context
   */
  async selectOptimalMethodologies(context) {
    await this.initialize();

    const {
      subject = 'history',
      topic = '',
      duration = 90,
      yearLevel = '',
      studentCount = 25,
      teachingFocus = [],
      assessmentFocus = '',
      differentiationNeeds = [],
      priorKnowledge = 'moderate',
      culturalDiversity = 'moderate',
      languageProfiles = [],
      learningObjectives = [],
      availableResources = [],
      teacherExperience = 'intermediate',
      timeConstraints = 'moderate'
    } = context;

    // Step 1: Determine primary teaching principle focus
    const principleWeights = this.calculatePrincipleWeights(context);
    
    // Step 2: Select methodologies for each principle
    const selectedMethodologies = {};

    for (const [principle, weight] of Object.entries(principleWeights)) {
      if (weight > 0.3) { // Only include principles with significant weight
        selectedMethodologies[principle] = await this.selectMethodologiesForPrinciple(
          principle, 
          context, 
          weight
        );
      }
    }

    // Step 3: Apply integration optimization
    const optimizedSelection = this.optimizeIntegration(selectedMethodologies, context);

    // Step 4: Generate contextual recommendations
    const recommendations = this.generateRecommendations(optimizedSelection, context);

    return {
      selectedMethodologies: optimizedSelection,
      recommendations,
      principleWeights,
      metadata: {
        selectionRationale: this.generateSelectionRationale(context, principleWeights),
        qualityScore: this.calculateQualityScore(optimizedSelection),
        integrationPattern: this.identifyIntegrationPattern(principleWeights)
      }
    };
  }

  /**
   * Calculate weights for each IB teaching principle based on context
   */
  calculatePrincipleWeights(context) {
    const weights = {
      inquiry_based: 0.2,
      conceptual_understanding: 0.2,
      contextual_learning: 0.15,
      collaborative_learning: 0.15,
      differentiated_learning: 0.15,
      assessment_informed: 0.15
    };

    // Adjust based on teaching focus
    if (context.teachingFocus?.includes('questioning')) {
      weights.inquiry_based += 0.3;
    }
    if (context.teachingFocus?.includes('conceptual')) {
      weights.conceptual_understanding += 0.3;
    }
    if (context.teachingFocus?.includes('real_world')) {
      weights.contextual_learning += 0.3;
    }

    // Adjust based on student needs
    if (context.differentiationNeeds?.length > 0) {
      weights.differentiated_learning += 0.2;
    }
    if (context.culturalDiversity === 'high') {
      weights.differentiated_learning += 0.1;
      weights.contextual_learning += 0.1;
    }
    if (context.languageProfiles?.length > 0) {
      weights.differentiated_learning += 0.15;
    }

    // Adjust based on class dynamics
    if (context.studentCount > 20) {
      weights.collaborative_learning += 0.2;
    }

    // Adjust based on assessment focus
    if (context.assessmentFocus?.includes('formative')) {
      weights.assessment_informed += 0.2;
    }

    // Normalize weights
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    Object.keys(weights).forEach(key => {
      weights[key] = weights[key] / totalWeight;
    });

    return weights;
  }

  /**
   * Select specific methodologies for a teaching principle
   */
  async selectMethodologiesForPrinciple(principle, context, weight) {
    const methodologies = methodologyLoader.getMethodologiesForPrinciple(principle);
    const templateGuide = this.getRelevantTemplateGuide(principle, context);
    
    const scored = [];

    for (const [methodName, methodology] of Object.entries(methodologies)) {
      const score = this.scoreMethodology(methodology, context, templateGuide);
      if (score > 0.5) { // Only include methodologies with reasonable fit
        scored.push({
          name: methodName,
          methodology,
          score: score * weight,
          rationale: this.generateMethodologyRationale(methodology, context)
        });
      }
    }

    // Sort by score and return top methodologies
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.ceil(weight * 5)) // More methodologies for higher-weighted principles
      .map(item => ({
        ...item,
        adaptedParameters: this.adaptMethodologyParameters(item.methodology, context)
      }));
  }

  /**
   * Get relevant template selection guide based on context
   */
  getRelevantTemplateGuide(principle, context) {
    const guides = methodologyLoader.getAIInstructions()?.ai_usage_instructions;
    if (!guides) return [];

    const guideKey = `${principle}_template_selection_guide`;
    const guide = guides[guideKey];
    if (!guide) return [];

    // Select most relevant guide based on context
    let selectedGuide = [];

    switch (principle) {
      case 'inquiry_based':
        if (context.teachingFocus?.includes('content')) {
          selectedGuide = guide.for_content_heavy_subjects || [];
        } else if (context.teachingFocus?.includes('skill')) {
          selectedGuide = guide.for_skill_development_focus || [];
        } else if (context.teachingFocus?.includes('real_world')) {
          selectedGuide = guide.for_real_world_application || [];
        }
        break;

      case 'conceptual_understanding':
        if (context.priorKnowledge === 'low') {
          selectedGuide = guide.for_concept_introduction || [];
        } else if (context.learningObjectives?.some(obj => obj.includes('transfer'))) {
          selectedGuide = guide.for_concept_transfer || [];
        } else {
          selectedGuide = guide.for_concept_deepening || [];
        }
        break;

      case 'contextual_learning':
        if (context.culturalDiversity === 'high') {
          selectedGuide = guide.for_international_mindedness_development || [];
        } else if (context.teachingFocus?.includes('personal')) {
          selectedGuide = guide.for_personal_relevance_building || [];
        } else {
          selectedGuide = guide.for_concept_meaning_deepening || [];
        }
        break;

      case 'collaborative_learning':
        if (context.studentCount > 25) {
          selectedGuide = guide.for_social_skill_development || [];
        } else if (context.teachingFocus?.includes('knowledge')) {
          selectedGuide = guide.for_knowledge_construction || [];
        }
        break;

      case 'differentiated_learning':
        if (context.culturalDiversity === 'high') {
          selectedGuide = guide.for_cultural_responsiveness || [];
        } else if (context.languageProfiles?.length > 0) {
          selectedGuide = guide.for_multilingual_learners || [];
        } else if (context.differentiationNeeds?.includes('support')) {
          selectedGuide = guide.for_learning_support_and_scaffolding || [];
        } else if (context.differentiationNeeds?.includes('extension')) {
          selectedGuide = guide.for_learning_extension_and_enrichment || [];
        }
        break;

      case 'assessment_informed':
        if (context.assessmentFocus?.includes('formative')) {
          selectedGuide = guide.for_formative_assessment_integration || [];
        } else if (context.assessmentFocus?.includes('feedback')) {
          selectedGuide = guide.for_feedback_and_improvement || [];
        }
        break;
    }

    return selectedGuide;
  }

  /**
   * Score methodology fitness for context
   */
  scoreMethodology(methodology, context, templateGuide) {
    let score = 0.5; // Base score

    // Check if methodology is in template guide
    if (templateGuide.length > 0) {
      const methodologyKey = Object.keys(methodology)[0];
      if (templateGuide.includes(methodologyKey)) {
        score += 0.3;
      }
    }

    // Check duration compatibility
    const structure = methodology.activity_structure;
    if (structure && structure.implementation_phases) {
      const totalDuration = structure.implementation_phases.reduce((sum, phase) => {
        const duration = phase.duration_minutes || '{base_duration * 0.2}';
        if (typeof duration === 'number') {
          return sum + duration;
        }
        // Estimate duration from variable
        return sum + (context.duration * 0.2);
      }, 0);

      if (totalDuration <= context.duration * 0.8) {
        score += 0.2;
      }
    }

    // Check adaptable parameters alignment
    if (methodology.adaptable_parameters) {
      const params = methodology.adaptable_parameters;
      
      // Duration compatibility
      if (params.base_duration && Array.isArray(params.base_duration)) {
        if (params.base_duration.some(d => Math.abs(d - context.duration) <= 30)) {
          score += 0.1;
        }
      }

      // Group size compatibility
      if (params.group_size || params.collaboration_size) {
        const groupSizes = params.group_size || params.collaboration_size;
        if (Array.isArray(groupSizes)) {
          // Estimate optimal group size based on class size
          const optimalGroupSize = Math.ceil(context.studentCount / 6);
          if (groupSizes.some(size => 
            typeof size === 'number' && Math.abs(size - optimalGroupSize) <= 2
          )) {
            score += 0.1;
          }
        }
      }
    }

    // Check IB connections alignment
    if (methodology.ib_connections) {
      const connections = methodology.ib_connections;
      
      // ATL skills alignment
      if (connections.atl_skills && context.learningObjectives) {
        const skillMatch = connections.atl_skills.some(skill =>
          context.learningObjectives.some(obj => 
            obj.toLowerCase().includes(skill.replace(/_/g, ' '))
          )
        );
        if (skillMatch) score += 0.1;
      }

      // International mindedness for diverse contexts
      if (connections.international_mindedness && context.culturalDiversity === 'high') {
        score += 0.1;
      }
    }

    return Math.min(score, 1.0);
  }

  /**
   * Generate rationale for methodology selection
   */
  generateMethodologyRationale(methodology, context) {
    const reasons = [];

    if (methodology.theoretical_foundation) {
      reasons.push(`Based on ${methodology.theoretical_foundation.source} research`);
    }

    if (methodology.activity_structure) {
      reasons.push(`Structured approach with ${methodology.activity_structure.implementation_phases?.length || 'multiple'} phases`);
    }

    if (context.culturalDiversity === 'high' && methodology.ib_connections?.international_mindedness) {
      reasons.push('Supports international-mindedness for diverse classroom');
    }

    if (context.differentiationNeeds?.length > 0 && methodology.differentiation_strategies) {
      reasons.push('Includes built-in differentiation strategies');
    }

    return reasons.join('; ');
  }

  /**
   * Adapt methodology parameters to context
   */
  adaptMethodologyParameters(methodology, context) {
    if (!methodology.adaptable_parameters) return {};

    const adapted = {};
    const params = methodology.adaptable_parameters;

    // Adapt duration
    if (params.base_duration) {
      const closestDuration = Array.isArray(params.base_duration) 
        ? params.base_duration.find(d => Math.abs(d - context.duration) <= 30) || context.duration
        : context.duration;
      adapted.base_duration = closestDuration;
    }

    // Adapt group configuration
    if (params.group_size && context.studentCount) {
      const optimalGroupSize = Math.max(3, Math.min(6, Math.ceil(context.studentCount / 5)));
      adapted.group_size = optimalGroupSize;
    }

    // Adapt complexity based on year level
    if (params.complexity_level || params.difficulty_level) {
      const complexityLevels = params.complexity_level || params.difficulty_level;
      if (Array.isArray(complexityLevels)) {
        let selectedComplexity = 'intermediate';
        if (context.yearLevel?.includes('11') || context.yearLevel?.includes('12')) {
          selectedComplexity = complexityLevels.includes('advanced') ? 'advanced' : 'intermediate';
        } else if (context.yearLevel?.includes('9') || context.yearLevel?.includes('10')) {
          selectedComplexity = 'intermediate';
        }
        adapted.complexity_level = selectedComplexity;
      }
    }

    // Adapt support level based on differentiation needs
    if (params.scaffolding_level || params.support_level) {
      const supportLevels = params.scaffolding_level || params.support_level;
      if (Array.isArray(supportLevels) && context.differentiationNeeds) {
        if (context.differentiationNeeds.includes('support')) {
          adapted.scaffolding_level = 'high_support';
        } else if (context.differentiationNeeds.includes('extension')) {
          adapted.scaffolding_level = 'minimal_support';
        } else {
          adapted.scaffolding_level = 'moderate_support';
        }
      }
    }

    return adapted;
  }

  /**
   * Optimize integration across selected methodologies
   */
  optimizeIntegration(selectedMethodologies, context) {
    const integrationPatterns = methodologyLoader.getCommonIntegrationPatterns();
    const optimization = methodologyLoader.getIntegrationOptimization();

    // Determine optimal integration level based on context
    let integrationLevel = 'dual_principle_integration';
    
    const principleCount = Object.keys(selectedMethodologies).length;
    const timeAvailable = context.duration;

    if (principleCount <= 2 && timeAvailable <= 60) {
      integrationLevel = 'single_principle_focus';
    } else if (principleCount <= 3 && timeAvailable <= 120) {
      integrationLevel = 'dual_principle_integration';
    } else if (principleCount <= 4 && timeAvailable >= 120) {
      integrationLevel = 'multi_principle_synthesis';
    } else if (principleCount >= 5 && timeAvailable >= 180) {
      integrationLevel = 'comprehensive_integration';
    }

    // Apply optimization strategy
    const optimizedSelection = {};
    const maxMethodologiesPerPrinciple = this.getMaxMethodologiesForLevel(integrationLevel);

    for (const [principle, methodologies] of Object.entries(selectedMethodologies)) {
      optimizedSelection[principle] = methodologies.slice(0, maxMethodologiesPerPrinciple);
    }

    // Apply common integration patterns if available
    const applicablePatterns = this.findApplicablePatterns(integrationPatterns, Object.keys(optimizedSelection));
    
    return {
      methodologies: optimizedSelection,
      integrationLevel,
      applicablePatterns,
      optimizationStrategy: optimization[integrationLevel]
    };
  }

  /**
   * Get maximum methodologies per principle based on integration level
   */
  getMaxMethodologiesForLevel(level) {
    const limits = {
      'single_principle_focus': 3,
      'dual_principle_integration': 2,
      'multi_principle_synthesis': 2,
      'comprehensive_integration': 1
    };
    return limits[level] || 2;
  }

  /**
   * Find applicable integration patterns
   */
  findApplicablePatterns(patterns, principles) {
    const applicable = [];
    
    for (const [patternName, pattern] of Object.entries(patterns)) {
      const patternPrinciples = this.extractPrinciplesFromPattern(pattern.methodology_combination);
      const hasOverlap = patternPrinciples.some(p => 
        principles.some(principle => principle.includes(p.split('_')[0]))
      );
      
      if (hasOverlap) {
        applicable.push({
          name: patternName,
          ...pattern
        });
      }
    }

    return applicable;
  }

  /**
   * Extract principles from pattern methodology combination
   */
  extractPrinciplesFromPattern(combination) {
    return combination || [];
  }

  /**
   * Generate contextual recommendations
   */
  generateRecommendations(optimizedSelection, context) {
    const recommendations = {
      implementation: [],
      differentiation: [],
      assessment: [],
      resources: [],
      timing: []
    };

    // Implementation recommendations
    if (context.teacherExperience === 'novice') {
      recommendations.implementation.push('Start with structured methodologies before moving to open inquiry');
      recommendations.implementation.push('Use provided implementation phases as step-by-step guides');
    }

    // Differentiation recommendations
    if (context.culturalDiversity === 'high') {
      recommendations.differentiation.push('Incorporate diverse cultural perspectives in examples');
      recommendations.differentiation.push('Allow for multiple ways of expressing knowledge');
    }

    if (context.languageProfiles?.length > 0) {
      recommendations.differentiation.push('Provide multilingual resources where possible');
      recommendations.differentiation.push('Use visual supports and collaborative opportunities');
    }

    // Assessment recommendations
    if (context.assessmentFocus?.includes('formative')) {
      recommendations.assessment.push('Embed quick check-ins throughout each activity phase');
      recommendations.assessment.push('Use peer assessment opportunities in collaborative activities');
    }

    // Resource recommendations
    recommendations.resources.push('Prepare materials for multiple representation modes');
    if (context.availableResources?.includes('technology')) {
      recommendations.resources.push('Integrate digital tools to enhance selected methodologies');
    }

    // Timing recommendations
    if (context.duration < 90) {
      recommendations.timing.push('Focus on fewer methodologies with deeper implementation');
    } else {
      recommendations.timing.push('Allow time for reflection between methodology transitions');
    }

    return recommendations;
  }

  /**
   * Generate selection rationale
   */
  generateSelectionRationale(context, principleWeights) {
    const topPrinciples = Object.entries(principleWeights)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([principle, weight]) => ({ principle, weight }));

    let rationale = `Based on your lesson context, the methodology selection prioritizes:\n\n`;

    for (const { principle, weight } of topPrinciples) {
      const percentage = Math.round(weight * 100);
      const principleName = principle.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      rationale += `• ${principleName} (${percentage}%): `;

      switch (principle) {
        case 'inquiry_based':
          rationale += 'Emphasizes student questioning and investigation\n';
          break;
        case 'conceptual_understanding':
          rationale += 'Focuses on transferable big ideas and deep understanding\n';
          break;
        case 'contextual_learning':
          rationale += 'Connects learning to meaningful local and global contexts\n';
          break;
        case 'collaborative_learning':
          rationale += 'Promotes knowledge construction through social interaction\n';
          break;
        case 'differentiated_learning':
          rationale += 'Addresses diverse student needs and learning differences\n';
          break;
        case 'assessment_informed':
          rationale += 'Integrates assessment as learning rather than evaluation\n';
          break;
      }
    }

    return rationale;
  }

  /**
   * Calculate quality score for methodology selection
   */
  calculateQualityScore(optimizedSelection) {
    const checklist = methodologyLoader.getQualityChecklist();
    let score = 0;
    const maxScore = checklist.length;

    // Simplified quality assessment
    const hasInquiry = optimizedSelection.methodologies?.inquiry_based?.length > 0;
    const hasConceptual = optimizedSelection.methodologies?.conceptual_understanding?.length > 0;
    const hasContextual = optimizedSelection.methodologies?.contextual_learning?.length > 0;
    const hasCollaborative = optimizedSelection.methodologies?.collaborative_learning?.length > 0;
    const hasDifferentiated = optimizedSelection.methodologies?.differentiated_learning?.length > 0;
    const hasAssessment = optimizedSelection.methodologies?.assessment_informed?.length > 0;

    // Award points for having methodologies from each principle
    if (hasInquiry) score += maxScore * 0.2;
    if (hasConceptual) score += maxScore * 0.2;
    if (hasContextual) score += maxScore * 0.15;
    if (hasCollaborative) score += maxScore * 0.15;
    if (hasDifferentiated) score += maxScore * 0.15;
    if (hasAssessment) score += maxScore * 0.15;

    return Math.round((score / maxScore) * 100);
  }

  /**
   * Identify integration pattern
   */
  identifyIntegrationPattern(principleWeights) {
    const sortedPrinciples = Object.entries(principleWeights)
      .sort(([,a], [,b]) => b - a)
      .map(([principle]) => principle);

    const topTwo = sortedPrinciples.slice(0, 2);

    // Match to common patterns
    if (topTwo.includes('inquiry_based') && topTwo.includes('conceptual_understanding')) {
      return 'inquiry_conceptual_pattern';
    } else if (topTwo.includes('contextual_learning') && topTwo.includes('collaborative_learning')) {
      return 'contextual_collaborative_pattern';
    } else if (topTwo.includes('differentiated_learning') && topTwo.includes('assessment_informed')) {
      return 'differentiated_assessment_pattern';
    } else {
      return 'custom_integration_pattern';
    }
  }
}

export const smartTemplateSelector = new SmartTemplateSelector();
export default SmartTemplateSelector;