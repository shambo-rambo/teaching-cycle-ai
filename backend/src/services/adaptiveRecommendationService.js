import { methodologyLoader } from './methodologyLoaderService.js';
import { smartTemplateSelector } from './smartTemplateSelector.js';

/**
 * Adaptive Activity Recommendation System
 * Provides intelligent, context-aware activity recommendations that evolve based on teaching patterns
 */
class AdaptiveRecommendationService {
  constructor() {
    this.initialized = false;
    this.teachingPatterns = new Map();
    this.successMetrics = new Map();
  }

  async initialize() {
    if (!this.initialized) {
      await methodologyLoader.loadMethodologies();
      this.initialized = true;
    }
  }

  /**
   * Get adaptive activity recommendations based on context and history
   */
  async getAdaptiveRecommendations(context, teachingHistory = [], preferences = {}) {
    await this.initialize();

    // Analyze teaching patterns from history
    const patterns = this.analyzeTeachingPatterns(teachingHistory);
    
    // Get base recommendations from smart template selector
    const baseRecommendations = await smartTemplateSelector.selectOptimalMethodologies(context);
    
    // Apply adaptive adjustments based on patterns and preferences
    const adaptedRecommendations = this.applyAdaptiveAdjustments(
      baseRecommendations, 
      patterns, 
      preferences,
      context
    );

    // Add contextual enhancements
    const enhancedRecommendations = await this.addContextualEnhancements(
      adaptedRecommendations,
      context,
      patterns
    );

    // Generate personalized activity sequences
    const activitySequences = this.generatePersonalizedSequences(
      enhancedRecommendations,
      context,
      preferences
    );

    return {
      recommendations: enhancedRecommendations,
      activitySequences,
      adaptiveInsights: this.generateAdaptiveInsights(patterns, context),
      personalizedTips: this.generatePersonalizedTips(patterns, preferences),
      nextStepSuggestions: this.generateNextStepSuggestions(context, patterns),
      metadata: {
        patternsUsed: patterns,
        adaptationLevel: this.calculateAdaptationLevel(patterns),
        recommendationConfidence: this.calculateRecommendationConfidence(patterns)
      }
    };
  }

  /**
   * Analyze teaching patterns from historical data
   */
  analyzeTeachingPatterns(teachingHistory) {
    const patterns = {
      preferredPrinciples: {},
      successfulMethodologies: {},
      timePreferences: {},
      studentResponsePatterns: {},
      difficultyAdjustments: {},
      assessmentPreferences: {},
      collaborationPatterns: {},
      resourceUsagePatterns: {}
    };

    if (!teachingHistory || teachingHistory.length === 0) {
      return this.getDefaultPatterns();
    }

    // Analyze principle preferences
    const principleUsage = {};
    teachingHistory.forEach(lesson => {
      if (lesson.methodologyIntegration?.principleWeights) {
        Object.entries(lesson.methodologyIntegration.principleWeights).forEach(([principle, weight]) => {
          principleUsage[principle] = (principleUsage[principle] || 0) + weight;
        });
      }
    });

    // Normalize principle preferences
    const totalUsage = Object.values(principleUsage).reduce((sum, usage) => sum + usage, 0);
    if (totalUsage > 0) {
      Object.keys(principleUsage).forEach(principle => {
        patterns.preferredPrinciples[principle] = principleUsage[principle] / totalUsage;
      });
    }

    // Analyze successful methodologies (based on usage frequency)
    const methodologyUsage = {};
    teachingHistory.forEach(lesson => {
      if (lesson.selectedActivities) {
        lesson.selectedActivities.forEach(activity => {
          if (activity.methodologyMeta?.principle) {
            const key = `${activity.methodologyMeta.principle}:${activity.title}`;
            methodologyUsage[key] = (methodologyUsage[key] || 0) + 1;
          }
        });
      }
    });

    patterns.successfulMethodologies = methodologyUsage;

    // Analyze time preferences
    const durations = teachingHistory.map(lesson => parseInt(lesson.duration)).filter(d => !isNaN(d));
    if (durations.length > 0) {
      patterns.timePreferences = {
        averageDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
        preferredRange: this.calculatePreferredRange(durations),
        activityBreakdown: this.analyzeActivityDurations(teachingHistory)
      };
    }

    // Analyze difficulty adjustments
    const difficultyChoices = [];
    teachingHistory.forEach(lesson => {
      if (lesson.selectedActivities) {
        lesson.selectedActivities.forEach(activity => {
          if (activity.difficulty) {
            difficultyChoices.push(activity.difficulty);
          }
        });
      }
    });

    patterns.difficultyAdjustments = this.analyzeDifficultyPatterns(difficultyChoices);

    // Analyze assessment preferences
    patterns.assessmentPreferences = this.analyzeAssessmentPatterns(teachingHistory);

    // Analyze collaboration patterns
    patterns.collaborationPatterns = this.analyzeCollaborationPatterns(teachingHistory);

    return patterns;
  }

  /**
   * Get default patterns for new users
   */
  getDefaultPatterns() {
    return {
      preferredPrinciples: {
        inquiry_based: 0.25,
        conceptual_understanding: 0.25,
        contextual_learning: 0.15,
        collaborative_learning: 0.15,
        differentiated_learning: 0.1,
        assessment_informed: 0.1
      },
      successfulMethodologies: {},
      timePreferences: {
        averageDuration: 90,
        preferredRange: [60, 120],
        activityBreakdown: { opening: 0.15, main: 0.70, closing: 0.15 }
      },
      difficultyAdjustments: {
        preferred: 'intermediate',
        distribution: { beginner: 0.2, intermediate: 0.6, advanced: 0.2 }
      },
      assessmentPreferences: {
        formativeFrequency: 'moderate',
        peerAssessment: 'sometimes',
        selfReflection: 'always'
      },
      collaborationPatterns: {
        groupSizePreference: 4,
        collaborationFrequency: 'often',
        structureLevel: 'moderate'
      }
    };
  }

  /**
   * Calculate preferred duration range
   */
  calculatePreferredRange(durations) {
    const sorted = [...durations].sort((a, b) => a - b);
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    return [q1, q3];
  }

  /**
   * Analyze activity duration breakdown
   */
  analyzeActivityDurations(teachingHistory) {
    const breakdowns = [];
    
    teachingHistory.forEach(lesson => {
      if (lesson.structure) {
        const total = parseInt(lesson.duration) || 90;
        const breakdown = {
          opening: this.extractDurationFromStructure(lesson.structure.opening, total),
          main: this.extractDurationFromStructure(lesson.structure.mainActivities, total),
          closing: this.extractDurationFromStructure(lesson.structure.closing, total)
        };
        breakdowns.push(breakdown);
      }
    });

    if (breakdowns.length === 0) {
      return { opening: 0.15, main: 0.70, closing: 0.15 };
    }

    // Average the breakdowns
    const avgBreakdown = {
      opening: breakdowns.reduce((sum, b) => sum + b.opening, 0) / breakdowns.length,
      main: breakdowns.reduce((sum, b) => sum + b.main, 0) / breakdowns.length,
      closing: breakdowns.reduce((sum, b) => sum + b.closing, 0) / breakdowns.length
    };

    return avgBreakdown;
  }

  /**
   * Extract duration from lesson structure
   */
  extractDurationFromStructure(structureElement, totalDuration) {
    if (!structureElement) return 0;
    
    if (structureElement.duration) {
      const duration = parseInt(structureElement.duration);
      return isNaN(duration) ? 0 : duration / totalDuration;
    }
    
    if (Array.isArray(structureElement)) {
      const totalActivity = structureElement.reduce((sum, activity) => {
        const activityDuration = parseInt(activity.duration) || 0;
        return sum + activityDuration;
      }, 0);
      return totalActivity / totalDuration;
    }
    
    return 0;
  }

  /**
   * Analyze difficulty patterns
   */
  analyzeDifficultyPatterns(difficultyChoices) {
    if (difficultyChoices.length === 0) {
      return {
        preferred: 'intermediate',
        distribution: { beginner: 0.2, intermediate: 0.6, advanced: 0.2 }
      };
    }

    const counts = {};
    difficultyChoices.forEach(difficulty => {
      counts[difficulty] = (counts[difficulty] || 0) + 1;
    });

    const total = difficultyChoices.length;
    const distribution = {};
    Object.keys(counts).forEach(difficulty => {
      distribution[difficulty] = counts[difficulty] / total;
    });

    const preferred = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);

    return { preferred, distribution };
  }

  /**
   * Analyze assessment patterns
   */
  analyzeAssessmentPatterns(teachingHistory) {
    const patterns = {
      formativeFrequency: 'moderate',
      peerAssessment: 'sometimes',
      selfReflection: 'often'
    };

    const assessmentCounts = { formative: 0, peer: 0, self: 0, total: 0 };

    teachingHistory.forEach(lesson => {
      if (lesson.selectedActivities) {
        lesson.selectedActivities.forEach(activity => {
          const activityText = JSON.stringify(activity).toLowerCase();
          if (activityText.includes('formative') || activityText.includes('check')) {
            assessmentCounts.formative++;
          }
          if (activityText.includes('peer') && activityText.includes('assess')) {
            assessmentCounts.peer++;
          }
          if (activityText.includes('self') && activityText.includes('reflect')) {
            assessmentCounts.self++;
          }
          assessmentCounts.total++;
        });
      }
    });

    if (assessmentCounts.total > 0) {
      const formativeRatio = assessmentCounts.formative / assessmentCounts.total;
      patterns.formativeFrequency = formativeRatio > 0.3 ? 'high' : formativeRatio > 0.15 ? 'moderate' : 'low';

      const peerRatio = assessmentCounts.peer / assessmentCounts.total;
      patterns.peerAssessment = peerRatio > 0.2 ? 'often' : peerRatio > 0.1 ? 'sometimes' : 'rarely';

      const selfRatio = assessmentCounts.self / assessmentCounts.total;
      patterns.selfReflection = selfRatio > 0.25 ? 'always' : selfRatio > 0.1 ? 'often' : 'sometimes';
    }

    return patterns;
  }

  /**
   * Analyze collaboration patterns
   */
  analyzeCollaborationPatterns(teachingHistory) {
    const patterns = {
      groupSizePreference: 4,
      collaborationFrequency: 'often',
      structureLevel: 'moderate'
    };

    let collaborativeActivities = 0;
    let totalActivities = 0;
    const groupSizes = [];

    teachingHistory.forEach(lesson => {
      if (lesson.selectedActivities) {
        lesson.selectedActivities.forEach(activity => {
          totalActivities++;
          const activityText = JSON.stringify(activity).toLowerCase();
          
          if (activityText.includes('group') || activityText.includes('collaborate') || 
              activityText.includes('team') || activityText.includes('peer')) {
            collaborativeActivities++;
            
            // Try to extract group size hints
            if (activityText.includes('pair')) groupSizes.push(2);
            else if (activityText.includes('small group')) groupSizes.push(4);
            else if (activityText.includes('large group')) groupSizes.push(8);
            else groupSizes.push(4); // Default assumption
          }
        });
      }
    });

    if (totalActivities > 0) {
      const collaborationRatio = collaborativeActivities / totalActivities;
      patterns.collaborationFrequency = collaborationRatio > 0.4 ? 'always' : 
                                      collaborationRatio > 0.2 ? 'often' : 'sometimes';
    }

    if (groupSizes.length > 0) {
      patterns.groupSizePreference = Math.round(
        groupSizes.reduce((sum, size) => sum + size, 0) / groupSizes.length
      );
    }

    return patterns;
  }

  /**
   * Apply adaptive adjustments to base recommendations
   */
  applyAdaptiveAdjustments(baseRecommendations, patterns, preferences, context) {
    const adjusted = JSON.parse(JSON.stringify(baseRecommendations)); // Deep copy

    // Adjust principle weights based on historical preferences
    if (patterns.preferredPrinciples && Object.keys(patterns.preferredPrinciples).length > 0) {
      const combinedWeights = {};
      
      // Combine base weights with historical preferences (70% base, 30% history)
      Object.keys(adjusted.principleWeights || {}).forEach(principle => {
        const baseWeight = adjusted.principleWeights[principle] || 0;
        const historicalWeight = patterns.preferredPrinciples[principle] || 0;
        combinedWeights[principle] = (baseWeight * 0.7) + (historicalWeight * 0.3);
      });

      adjusted.principleWeights = combinedWeights;
    }

    // Adjust methodology selection based on success patterns
    if (patterns.successfulMethodologies && Object.keys(patterns.successfulMethodologies).length > 0) {
      this.boostSuccessfulMethodologies(adjusted, patterns.successfulMethodologies);
    }

    // Adjust difficulty levels based on patterns
    if (patterns.difficultyAdjustments?.preferred) {
      this.adjustDifficultyPreferences(adjusted, patterns.difficultyAdjustments);
    }

    // Apply user preferences
    if (preferences.preferredPrinciples) {
      this.applyPrinciplePreferences(adjusted, preferences.preferredPrinciples);
    }

    if (preferences.timeConstraints) {
      this.applyTimeConstraints(adjusted, preferences.timeConstraints, context);
    }

    return adjusted;
  }

  /**
   * Boost methodologies that have been successful in the past
   */
  boostSuccessfulMethodologies(recommendations, successfulMethodologies) {
    // Increase scores for methodologies that have been used successfully
    Object.keys(recommendations.selectedMethodologies?.methodologies || {}).forEach(principle => {
      recommendations.selectedMethodologies.methodologies[principle].forEach(methodology => {
        const key = `${principle}:${methodology.methodology.activity_structure?.name}`;
        if (successfulMethodologies[key]) {
          methodology.score = Math.min(methodology.score * 1.2, 1.0); // Boost by 20%
        }
      });
    });
  }

  /**
   * Adjust difficulty preferences based on patterns
   */
  adjustDifficultyPreferences(recommendations, difficultyAdjustments) {
    const preferredDifficulty = difficultyAdjustments.preferred;
    
    // This would be implemented in the methodology-to-activity conversion
    // by adjusting the adaptable parameters for complexity/difficulty
    if (recommendations.metadata) {
      recommendations.metadata.preferredDifficulty = preferredDifficulty;
      recommendations.metadata.difficultyDistribution = difficultyAdjustments.distribution;
    }
  }

  /**
   * Apply user principle preferences
   */
  applyPrinciplePreferences(recommendations, preferredPrinciples) {
    // Boost weights for preferred principles
    Object.keys(preferredPrinciples).forEach(principle => {
      if (recommendations.principleWeights[principle]) {
        recommendations.principleWeights[principle] *= (1 + preferredPrinciples[principle] * 0.3);
      }
    });

    // Normalize weights
    const totalWeight = Object.values(recommendations.principleWeights).reduce((sum, w) => sum + w, 0);
    Object.keys(recommendations.principleWeights).forEach(principle => {
      recommendations.principleWeights[principle] /= totalWeight;
    });
  }

  /**
   * Apply time constraints
   */
  applyTimeConstraints(recommendations, timeConstraints, context) {
    if (timeConstraints.maxActivityDuration) {
      // Filter out methodologies that typically run longer than the constraint
      Object.keys(recommendations.selectedMethodologies?.methodologies || {}).forEach(principle => {
        recommendations.selectedMethodologies.methodologies[principle] = 
          recommendations.selectedMethodologies.methodologies[principle].filter(methodology => {
            const estimatedDuration = this.estimateMethodologyDuration(methodology.methodology, context.duration);
            return estimatedDuration <= timeConstraints.maxActivityDuration;
          });
      });
    }
  }

  /**
   * Estimate methodology duration
   */
  estimateMethodologyDuration(methodology, totalDuration) {
    const phases = methodology.activity_structure?.implementation_phases || [];
    if (phases.length === 0) return totalDuration * 0.3;

    // Sum up phase durations if they're numeric
    let totalMethodologyTime = 0;
    let hasNumericDurations = false;

    phases.forEach(phase => {
      if (typeof phase.duration_minutes === 'number') {
        totalMethodologyTime += phase.duration_minutes;
        hasNumericDurations = true;
      }
    });

    if (hasNumericDurations) {
      return totalMethodologyTime;
    }

    // If durations are variables, estimate based on number of phases
    return Math.round((totalDuration * 0.6) / phases.length) * phases.length;
  }

  /**
   * Add contextual enhancements based on specific context
   */
  async addContextualEnhancements(recommendations, context, patterns) {
    const enhanced = JSON.parse(JSON.stringify(recommendations));

    // Add cultural responsiveness enhancements
    if (context.culturalDiversity === 'high') {
      enhanced.culturalEnhancements = await this.generateCulturalEnhancements(context);
    }

    // Add language support enhancements
    if (context.languageProfiles?.length > 0) {
      enhanced.languageSupport = this.generateLanguageSupportEnhancements(context);
    }

    // Add assessment integration based on preferences
    if (patterns.assessmentPreferences) {
      enhanced.assessmentIntegration = this.generateAssessmentEnhancements(patterns.assessmentPreferences);
    }

    // Add collaboration enhancements
    if (patterns.collaborationPatterns) {
      enhanced.collaborationEnhancements = this.generateCollaborationEnhancements(patterns.collaborationPatterns);
    }

    // Add technology integration suggestions
    if (context.availableResources?.some(resource => resource.includes('technology'))) {
      enhanced.technologyIntegration = this.generateTechnologyEnhancements(context);
    }

    return enhanced;
  }

  /**
   * Generate cultural responsiveness enhancements
   */
  async generateCulturalEnhancements(context) {
    const culturalMethodologies = methodologyLoader.getMethodologiesForPrinciple('differentiated_learning');
    const culturalResponsive = culturalMethodologies.culturally_responsive_differentiation;

    if (!culturalResponsive) return [];

    return [
      {
        type: 'cultural_asset_integration',
        title: 'Integrate Cultural Assets',
        description: 'Incorporate diverse cultural perspectives and knowledge systems',
        implementation: culturalResponsive.specific_strategies?.cultural_asset_recognition || []
      },
      {
        type: 'multiple_perspectives',
        title: 'Multiple Cultural Perspectives',
        description: 'Present content through various cultural lenses',
        implementation: culturalResponsive.specific_strategies?.diverse_perspective_inclusion || []
      }
    ];
  }

  /**
   * Generate language support enhancements
   */
  generateLanguageSupportEnhancements(context) {
    return [
      {
        type: 'multilingual_support',
        title: 'Multilingual Learning Support',
        description: 'Provide scaffolding for multilingual learners',
        strategies: [
          'Use visual supports and graphic organizers',
          'Allow strategic use of home language',
          'Provide multilingual glossaries',
          'Include collaborative language practice'
        ]
      },
      {
        type: 'academic_language_development',
        title: 'Academic Language Development',
        description: 'Develop academic language skills within content learning',
        strategies: [
          'Pre-teach key vocabulary',
          'Use sentence frames and templates',
          'Model academic discourse patterns',
          'Provide opportunities for academic talk'
        ]
      }
    ];
  }

  /**
   * Generate assessment enhancements
   */
  generateAssessmentEnhancements(assessmentPreferences) {
    const enhancements = [];

    if (assessmentPreferences.formativeFrequency === 'high') {
      enhancements.push({
        type: 'frequent_formative',
        title: 'Frequent Formative Assessment',
        strategies: ['Exit tickets', 'Think-pair-share checks', 'One-minute papers', 'Thumbs up/down polls']
      });
    }

    if (assessmentPreferences.peerAssessment === 'often') {
      enhancements.push({
        type: 'peer_assessment',
        title: 'Peer Assessment Integration',
        strategies: ['Peer feedback protocols', 'Gallery walks', 'Collaborative rubrics', 'Peer editing sessions']
      });
    }

    if (assessmentPreferences.selfReflection === 'always') {
      enhancements.push({
        type: 'self_reflection',
        title: 'Self-Reflection Opportunities',
        strategies: ['Learning journals', 'Goal setting activities', 'Progress monitoring sheets', 'Metacognitive prompts']
      });
    }

    return enhancements;
  }

  /**
   * Generate collaboration enhancements
   */
  generateCollaborationEnhancements(collaborationPatterns) {
    const enhancements = [];

    const preferredGroupSize = collaborationPatterns.groupSizePreference || 4;
    enhancements.push({
      type: 'optimal_grouping',
      title: 'Optimal Group Configuration',
      description: `Based on your preference for groups of ${preferredGroupSize}`,
      strategies: [
        `Form groups of ${preferredGroupSize} students`,
        'Use strategic grouping based on complementary skills',
        'Rotate group membership periodically',
        'Assign specific roles within groups'
      ]
    });

    if (collaborationPatterns.collaborationFrequency === 'always') {
      enhancements.push({
        type: 'enhanced_collaboration',
        title: 'Enhanced Collaborative Learning',
        strategies: [
          'Include collaborative element in every activity',
          'Use think-pair-share variations',
          'Design interdependent group tasks',
          'Build in group reflection time'
        ]
      });
    }

    return enhancements;
  }

  /**
   * Generate technology integration enhancements
   */
  generateTechnologyEnhancements(context) {
    return [
      {
        type: 'digital_collaboration',
        title: 'Digital Collaboration Tools',
        tools: ['Shared documents', 'Discussion boards', 'Virtual whiteboards', 'Peer feedback platforms']
      },
      {
        type: 'multimedia_content',
        title: 'Multimedia Content Integration',
        tools: ['Interactive presentations', 'Video resources', 'Digital simulations', 'Virtual field trips']
      },
      {
        type: 'assessment_technology',
        title: 'Digital Assessment Tools',
        tools: ['Online polling', 'Digital rubrics', 'Portfolio platforms', 'Peer assessment apps']
      }
    ];
  }

  /**
   * Generate personalized activity sequences
   */
  generatePersonalizedSequences(recommendations, context, preferences) {
    const sequences = {
      optimal: [],
      alternative: [],
      experimental: []
    };

    // Generate optimal sequence based on patterns and best practices
    sequences.optimal = this.createOptimalSequence(recommendations, context);

    // Generate alternative sequence for variety
    sequences.alternative = this.createAlternativeSequence(recommendations, context);

    // Generate experimental sequence with new methodologies
    sequences.experimental = this.createExperimentalSequence(recommendations, context);

    return sequences;
  }

  /**
   * Create optimal activity sequence
   */
  createOptimalSequence(recommendations, context) {
    const sequence = [];
    const duration = context.duration || 90;

    // Opening (15% of time)
    const openingTime = Math.round(duration * 0.15);
    sequence.push({
      phase: 'opening',
      duration: openingTime,
      type: 'inquiry_based',
      title: 'Engaging Opening Hook',
      rationale: 'Captures attention and activates prior knowledge'
    });

    // Main activities (70% of time)
    const mainTime = Math.round(duration * 0.70);
    const mainActivities = this.selectMainActivities(recommendations, mainTime);
    sequence.push(...mainActivities);

    // Closing (15% of time)
    const closingTime = Math.round(duration * 0.15);
    sequence.push({
      phase: 'closing',
      duration: closingTime,
      type: 'assessment_informed',
      title: 'Synthesis and Reflection',
      rationale: 'Consolidates learning and provides closure'
    });

    return sequence;
  }

  /**
   * Select main activities for optimal sequence
   */
  selectMainActivities(recommendations, availableTime) {
    const activities = [];
    const methodologies = recommendations.selectedMethodologies?.methodologies || {};
    
    // Prioritize methodologies by score
    const allMethodologies = [];
    Object.entries(methodologies).forEach(([principle, methodologyList]) => {
      methodologyList.forEach(methodology => {
        allMethodologies.push({
          ...methodology,
          principle,
          estimatedDuration: this.estimateMethodologyDuration(methodology.methodology, availableTime)
        });
      });
    });

    // Sort by score and select activities that fit within time
    allMethodologies.sort((a, b) => b.score - a.score);
    
    let remainingTime = availableTime;
    for (const methodology of allMethodologies) {
      if (methodology.estimatedDuration <= remainingTime && activities.length < 3) {
        activities.push({
          phase: 'main',
          duration: methodology.estimatedDuration,
          type: methodology.principle,
          title: methodology.methodology.activity_structure?.name || methodology.name,
          rationale: methodology.rationale,
          methodology: methodology.name
        });
        remainingTime -= methodology.estimatedDuration;
      }
    }

    return activities;
  }

  /**
   * Create alternative sequence with different approach
   */
  createAlternativeSequence(recommendations, context) {
    // Similar to optimal but with different methodology prioritization
    const sequence = JSON.parse(JSON.stringify(this.createOptimalSequence(recommendations, context)));
    
    // Modify approach - prioritize less-used methodologies for variety
    sequence.forEach(activity => {
      if (activity.phase === 'main') {
        activity.title = `Alternative: ${activity.title}`;
        activity.rationale += ' (Alternative approach for variety)';
      }
    });

    return sequence;
  }

  /**
   * Create experimental sequence with innovative approaches
   */
  createExperimentalSequence(recommendations, context) {
    const sequence = [];
    const duration = context.duration || 90;

    // Experimental opening with multiple methodologies
    sequence.push({
      phase: 'opening',
      duration: Math.round(duration * 0.20),
      type: 'multi_principle',
      title: 'Multi-Methodology Opening',
      rationale: 'Experimental integration of inquiry and contextual learning',
      experimental: true
    });

    // Experimental main activity
    sequence.push({
      phase: 'main',
      duration: Math.round(duration * 0.60),
      type: 'comprehensive_integration',
      title: 'Comprehensive IB Integration',
      rationale: 'Experimental approach combining all IB teaching principles',
      experimental: true
    });

    // Experimental closing
    sequence.push({
      phase: 'closing',
      duration: Math.round(duration * 0.20),
      type: 'advanced_reflection',
      title: 'Advanced Metacognitive Reflection',
      rationale: 'Experimental deep reflection combining self and peer assessment',
      experimental: true
    });

    return sequence;
  }

  /**
   * Generate adaptive insights based on patterns
   */
  generateAdaptiveInsights(patterns, context) {
    const insights = [];

    // Principle preference insights
    if (patterns.preferredPrinciples) {
      const topPrinciple = Object.entries(patterns.preferredPrinciples)
        .sort(([,a], [,b]) => b - a)[0];
      
      if (topPrinciple) {
        insights.push({
          type: 'principle_preference',
          title: 'Your Teaching Strength',
          message: `You consistently excel at ${topPrinciple[0].replace(/_/g, ' ')} (${Math.round(topPrinciple[1] * 100)}% of your lessons)`,
          suggestion: `Consider exploring how this strength can enhance other IB principles`
        });
      }
    }

    // Time management insights
    if (patterns.timePreferences?.averageDuration) {
      const avgDuration = patterns.timePreferences.averageDuration;
      if (context.duration && Math.abs(context.duration - avgDuration) > 15) {
        insights.push({
          type: 'time_management',
          title: 'Duration Adjustment',
          message: `This lesson (${context.duration} min) differs from your usual ${avgDuration} min lessons`,
          suggestion: `Consider adjusting activity complexity and pacing accordingly`
        });
      }
    }

    // Difficulty progression insights
    if (patterns.difficultyAdjustments?.preferred) {
      insights.push({
        type: 'difficulty_preference',
        title: 'Difficulty Balance',
        message: `You typically prefer ${patterns.difficultyAdjustments.preferred} level activities`,
        suggestion: `This lesson's recommendations include varied difficulty levels for optimal challenge`
      });
    }

    return insights;
  }

  /**
   * Generate personalized tips based on patterns and preferences
   */
  generatePersonalizedTips(patterns, preferences) {
    const tips = [];

    // Teaching pattern tips
    if (patterns.collaborationPatterns?.collaborationFrequency === 'always') {
      tips.push({
        category: 'collaboration',
        tip: 'Since you love collaborative learning, consider having students create their own group norms and roles',
        rationale: 'Builds student ownership and improves collaboration quality'
      });
    }

    if (patterns.assessmentPreferences?.formativeFrequency === 'high') {
      tips.push({
        category: 'assessment',
        tip: 'Try varying your formative assessment techniques - students respond well to novelty',
        rationale: 'Prevents assessment fatigue while maintaining engagement'
      });
    }

    // Progressive challenge tips
    if (patterns.difficultyAdjustments?.preferred === 'intermediate') {
      tips.push({
        category: 'differentiation',
        tip: 'Consider adding both scaffolding and extension options to reach all learners',
        rationale: 'Your intermediate preference suggests readiness to support diverse learning needs'
      });
    }

    // Time management tips
    if (patterns.timePreferences?.activityBreakdown?.main > 0.8) {
      tips.push({
        category: 'time_management',
        tip: 'Try building in more opening and closing time - bookends enhance learning retention',
        rationale: 'Strong openings and closings improve knowledge consolidation'
      });
    }

    return tips;
  }

  /**
   * Generate next step suggestions for continuous improvement
   */
  generateNextStepSuggestions(context, patterns) {
    const suggestions = [];

    // Suggest exploring underutilized principles
    const underutilized = this.identifyUnderutilizedPrinciples(patterns);
    if (underutilized.length > 0) {
      suggestions.push({
        category: 'exploration',
        title: 'Explore New Teaching Approaches',
        description: `Consider experimenting with ${underutilized[0].replace(/_/g, ' ')}`,
        methodology: this.suggestMethodologyForPrinciple(underutilized[0]),
        timeline: 'Next 2-3 lessons'
      });
    }

    // Suggest integration opportunities
    const integrationPattern = this.suggestIntegrationPattern(patterns);
    if (integrationPattern) {
      suggestions.push({
        category: 'integration',
        title: 'Try Methodology Integration',
        description: `Based on your preferences, try combining ${integrationPattern.principles.join(' and ')}`,
        rationale: integrationPattern.rationale,
        timeline: 'Next major lesson'
      });
    }

    // Suggest assessment evolution
    if (patterns.assessmentPreferences?.peerAssessment === 'rarely') {
      suggestions.push({
        category: 'assessment_growth',
        title: 'Explore Peer Assessment',
        description: 'Gradually introduce peer feedback activities',
        startingPoint: 'Begin with structured peer sharing protocols',
        timeline: 'Over next month'
      });
    }

    return suggestions;
  }

  /**
   * Identify underutilized IB principles
   */
  identifyUnderutilizedPrinciples(patterns) {
    const allPrinciples = [
      'inquiry_based',
      'conceptual_understanding', 
      'contextual_learning',
      'collaborative_learning',
      'differentiated_learning',
      'assessment_informed'
    ];

    const used = Object.keys(patterns.preferredPrinciples || {});
    const underutilized = allPrinciples.filter(principle => !used.includes(principle));

    // Also consider principles used less than 10% of the time
    const lowUsage = Object.entries(patterns.preferredPrinciples || {})
      .filter(([, usage]) => usage < 0.1)
      .map(([principle]) => principle);

    return [...underutilized, ...lowUsage];
  }

  /**
   * Suggest methodology for underutilized principle
   */
  suggestMethodologyForPrinciple(principle) {
    const methodologies = methodologyLoader.getMethodologiesForPrinciple(principle);
    const methodologyNames = Object.keys(methodologies);
    
    if (methodologyNames.length > 0) {
      return {
        name: methodologyNames[0],
        title: methodologies[methodologyNames[0]]?.activity_structure?.name || methodologyNames[0],
        description: methodologies[methodologyNames[0]]?.theoretical_foundation?.description || ''
      };
    }

    return null;
  }

  /**
   * Suggest integration pattern based on preferences
   */
  suggestIntegrationPattern(patterns) {
    const commonPatterns = methodologyLoader.getCommonIntegrationPatterns();
    const preferences = patterns.preferredPrinciples || {};
    
    // Find most compatible pattern
    const sortedPreferences = Object.entries(preferences)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([principle]) => principle);

    if (sortedPreferences.includes('inquiry_based') && sortedPreferences.includes('conceptual_understanding')) {
      return {
        principles: ['inquiry_based', 'conceptual_understanding'],
        rationale: 'Your strength in inquiry and conceptual understanding makes this a natural combination',
        pattern: commonPatterns.inquiry_conceptual_pattern
      };
    }

    if (sortedPreferences.includes('contextual_learning') && sortedPreferences.includes('collaborative_learning')) {
      return {
        principles: ['contextual_learning', 'collaborative_learning'],
        rationale: 'Combining contextual and collaborative learning enhances international-mindedness',
        pattern: commonPatterns.contextual_collaborative_pattern
      };
    }

    return null;
  }

  /**
   * Calculate adaptation level based on available patterns
   */
  calculateAdaptationLevel(patterns) {
    let adaptationScore = 0;
    const maxScore = 100;

    // Score based on available historical data
    if (patterns.preferredPrinciples && Object.keys(patterns.preferredPrinciples).length > 0) {
      adaptationScore += 30;
    }

    if (patterns.successfulMethodologies && Object.keys(patterns.successfulMethodologies).length > 0) {
      adaptationScore += 25;
    }

    if (patterns.timePreferences?.averageDuration) {
      adaptationScore += 15;
    }

    if (patterns.difficultyAdjustments?.preferred) {
      adaptationScore += 15;
    }

    if (patterns.assessmentPreferences && patterns.collaborationPatterns) {
      adaptationScore += 15;
    }

    return {
      score: adaptationScore,
      level: adaptationScore > 80 ? 'high' : adaptationScore > 50 ? 'medium' : 'low',
      description: this.getAdaptationDescription(adaptationScore)
    };
  }

  /**
   * Get adaptation level description
   */
  getAdaptationDescription(score) {
    if (score > 80) {
      return 'High personalization based on extensive teaching pattern analysis';
    } else if (score > 50) {
      return 'Moderate personalization based on available teaching history';
    } else {
      return 'Basic personalization - recommendations will improve as you use the system more';
    }
  }

  /**
   * Calculate recommendation confidence
   */
  calculateRecommendationConfidence(patterns) {
    const factorsPresent = [
      patterns.preferredPrinciples && Object.keys(patterns.preferredPrinciples).length > 0,
      patterns.successfulMethodologies && Object.keys(patterns.successfulMethodologies).length > 2,
      patterns.timePreferences?.averageDuration,
      patterns.difficultyAdjustments?.preferred,
      patterns.assessmentPreferences?.formativeFrequency
    ].filter(Boolean).length;

    const confidence = Math.min((factorsPresent / 5) * 100, 100);

    return {
      percentage: Math.round(confidence),
      level: confidence > 80 ? 'very_high' : confidence > 60 ? 'high' : confidence > 40 ? 'medium' : 'low',
      rationale: `Based on ${factorsPresent} of 5 key teaching pattern indicators`
    };
  }

  /**
   * Learn from lesson feedback to improve future recommendations
   */
  async learnFromFeedback(lessonId, feedback, context) {
    // This would store feedback for future pattern analysis
    // In a real implementation, this would update a database
    
    const learningData = {
      lessonId,
      feedback,
      context,
      timestamp: new Date(),
      improvements: this.extractImprovementsFromFeedback(feedback)
    };

    // Store for future pattern analysis
    this.storeLearningData(learningData);

    return {
      acknowledged: true,
      futureImprovements: learningData.improvements,
      message: 'Thank you for your feedback. Future recommendations will be adjusted accordingly.'
    };
  }

  /**
   * Extract improvements from user feedback
   */
  extractImprovementsFromFeedback(feedback) {
    const improvements = [];

    if (feedback.activitiesRating < 3) {
      improvements.push('Adjust activity selection criteria');
    }

    if (feedback.timingIssues) {
      improvements.push('Better duration estimation for recommended activities');
    }

    if (feedback.difficultyMismatch) {
      improvements.push('Improve difficulty level matching to student needs');
    }

    if (feedback.engagementLow) {
      improvements.push('Prioritize more engaging methodologies');
    }

    return improvements;
  }

  /**
   * Store learning data for future analysis
   */
  storeLearningData(learningData) {
    // In a real implementation, this would save to a database
    // For now, we'll just log it for debugging
    console.log('Learning data stored:', {
      lessonId: learningData.lessonId,
      improvementCount: learningData.improvements.length,
      timestamp: learningData.timestamp
    });
  }
}

export const adaptiveRecommendationService = new AdaptiveRecommendationService();
export default AdaptiveRecommendationService;