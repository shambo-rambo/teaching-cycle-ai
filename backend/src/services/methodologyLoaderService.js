import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Enhanced Methodology Loader Service
 * Loads and manages IB teaching methodologies from JSON files
 */
class MethodologyLoaderService {
  constructor() {
    this.methodologies = {};
    this.aiInstructions = null;
    this.ibFramework = null;
    this.loaded = false;
  }

  /**
   * Load all methodology JSON files
   */
  async loadMethodologies() {
    if (this.loaded) return;

    try {
      const docsPath = path.join(__dirname, '../../../docs/improvements');
      
      // Load core framework and AI instructions
      this.aiInstructions = await this.loadJSONFile(path.join(docsPath, 'ai_usage_instructions.json'));
      this.ibFramework = await this.loadJSONFile(path.join(docsPath, 'ib_core_framework.json'));

      // Load methodology collections
      const methodologyFiles = [
        'inquiry_based_activities.json',
        'conceptual_understanding_activities.json',
        'contextual_learning_activities.json',
        'collaborative_learning_activities.json',
        'differentiated_learning_activities.json',
        'assessment_informed_learning_activities.json'
      ];

      for (const file of methodologyFiles) {
        const methodologyName = file.replace('_activities.json', '').replace(/_/g, '_');
        this.methodologies[methodologyName] = await this.loadJSONFile(path.join(docsPath, file));
      }

      this.loaded = true;
      console.log('✅ All IB methodologies loaded successfully');
    } catch (error) {
      console.error('❌ Error loading methodologies:', error);
      throw new Error('Failed to load IB methodology files');
    }
  }

  /**
   * Load individual JSON file
   */
  async loadJSONFile(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    } catch (error) {
      console.error(`Error loading ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Get AI usage instructions
   */
  getAIInstructions() {
    if (!this.loaded) throw new Error('Methodologies not loaded');
    return this.aiInstructions;
  }

  /**
   * Get IB core framework
   */
  getIBFramework() {
    if (!this.loaded) throw new Error('Methodologies not loaded');
    return this.ibFramework;
  }

  /**
   * Get all methodologies for a specific teaching principle
   */
  getMethodologiesForPrinciple(principle) {
    if (!this.loaded) throw new Error('Methodologies not loaded');
    
    const principleMap = {
      'inquiry_based': 'inquiry_based',
      'conceptual_understanding': 'conceptual_understanding',
      'contextual_learning': 'contextual_learning',
      'collaborative_learning': 'collaborative_learning', 
      'differentiated_learning': 'differentiated_learning',
      'assessment_informed': 'assessment_informed_learning'
    };

    const methodologyKey = principleMap[principle];
    if (!methodologyKey || !this.methodologies[methodologyKey]) {
      return {};
    }

    // Get the methodologies object (first key contains the methodologies)
    const methodologyData = this.methodologies[methodologyKey];
    const methodologiesKey = Object.keys(methodologyData)[0]; // e.g., 'inquiry_based_methodologies'
    
    return methodologyData[methodologiesKey] || {};
  }

  /**
   * Get template selection guide for specific context
   */
  getTemplateSelectionGuide(principle, context) {
    if (!this.loaded) throw new Error('Methodologies not loaded');
    
    const instructions = this.aiInstructions?.ai_usage_instructions;
    if (!instructions) return [];

    const guideKey = `${principle}_template_selection_guide`;
    const guide = instructions[guideKey];
    
    if (!guide || !guide[context]) return [];
    
    return guide[context];
  }

  /**
   * Get contextualization process steps
   */
  getContextualizationProcess() {
    if (!this.loaded) throw new Error('Methodologies not loaded');
    return this.aiInstructions?.ai_usage_instructions?.contextualization_process || [];
  }

  /**
   * Get quality assurance checklist
   */
  getQualityChecklist() {
    if (!this.loaded) throw new Error('Methodologies not loaded');
    return this.aiInstructions?.ai_usage_instructions?.quality_assurance_checklist || [];
  }

  /**
   * Get concept quality criteria
   */
  getConceptQualityCriteria() {
    if (!this.loaded) throw new Error('Methodologies not loaded');
    return this.aiInstructions?.ai_usage_instructions?.concept_quality_criteria || {};
  }

  /**
   * Get variable replacement syntax
   */
  getVariableReplacementSyntax() {
    if (!this.loaded) throw new Error('Methodologies not loaded');
    return this.aiInstructions?.ai_usage_instructions?.variable_replacement_syntax || {};
  }

  /**
   * Get output format requirements
   */
  getOutputFormatRequirements() {
    if (!this.loaded) throw new Error('Methodologies not loaded');
    return this.aiInstructions?.ai_usage_instructions?.output_format_requirements || [];
  }

  /**
   * Get teacher preparation guidance
   */
  getTeacherPreparationGuidance() {
    if (!this.loaded) throw new Error('Methodologies not loaded');
    return this.aiInstructions?.ai_usage_instructions?.teacher_preparation_guidance || {};
  }

  /**
   * Get integration optimization strategies
   */
  getIntegrationOptimization() {
    if (!this.loaded) throw new Error('Methodologies not loaded');
    return this.aiInstructions?.ai_usage_instructions?.integration_optimization || {};
  }

  /**
   * Get common integration patterns
   */
  getCommonIntegrationPatterns() {
    if (!this.loaded) throw new Error('Methodologies not loaded');
    return this.aiInstructions?.ai_usage_instructions?.common_integration_patterns || {};
  }

  /**
   * Get specific methodology by principle and methodology name
   */
  getSpecificMethodology(principle, methodologyName) {
    const methodologies = this.getMethodologiesForPrinciple(principle);
    return methodologies[methodologyName] || null;
  }

  /**
   * Get all methodology names for a principle
   */
  getMethodologyNames(principle) {
    const methodologies = this.getMethodologiesForPrinciple(principle);
    return Object.keys(methodologies);
  }

  /**
   * Search methodologies by keywords
   */
  searchMethodologies(keywords = [], principles = []) {
    if (!this.loaded) throw new Error('Methodologies not loaded');
    
    const results = [];
    const searchTerms = keywords.map(k => k.toLowerCase());
    const targetPrinciples = principles.length > 0 ? principles : 
      ['inquiry_based', 'conceptual_understanding', 'contextual_learning', 
       'collaborative_learning', 'differentiated_learning', 'assessment_informed'];

    for (const principle of targetPrinciples) {
      const methodologies = this.getMethodologiesForPrinciple(principle);
      
      for (const [methodName, methodology] of Object.entries(methodologies)) {
        // Search in methodology content
        const searchableText = JSON.stringify(methodology).toLowerCase();
        const matches = searchTerms.some(term => searchableText.includes(term));
        
        if (matches || searchTerms.length === 0) {
          results.push({
            principle,
            methodologyName: methodName,
            methodology,
            title: methodology.activity_structure?.name || methodName.replace(/_/g, ' '),
            description: methodology.theoretical_foundation?.description || '',
            keyPrinciple: methodology.theoretical_foundation?.key_principle || ''
          });
        }
      }
    }

    return results;
  }

  /**
   * Get recommendations based on teaching context
   */
  getContextualRecommendations(context) {
    const {
      teachingFocus = '',
      studentLevel = '',
      classSize = '',
      duration = 90,
      assessmentNeed = '',
      differentiationNeed = ''
    } = context;

    const recommendations = {
      inquiry: [],
      conceptual: [],
      contextual: [],
      collaborative: [],
      differentiated: [],
      assessment: []
    };

    // Get template selection recommendations
    const instructions = this.aiInstructions?.ai_usage_instructions;
    if (!instructions) return recommendations;

    // Match teaching focus to template selections
    if (teachingFocus.includes('content')) {
      recommendations.inquiry = instructions.inquiry_template_selection_guide?.for_content_heavy_subjects || [];
    }
    if (teachingFocus.includes('skill')) {
      recommendations.inquiry = instructions.inquiry_template_selection_guide?.for_skill_development_focus || [];
    }
    if (teachingFocus.includes('real_world')) {
      recommendations.contextual = instructions.contextual_learning_template_selection_guide?.for_community_engagement || [];
    }

    // Match differentiation needs
    if (differentiationNeed.includes('scaffolding')) {
      recommendations.differentiated = instructions.differentiated_learning_template_selection_guide?.for_learning_support_and_scaffolding || [];
    }
    if (differentiationNeed.includes('extension')) {
      recommendations.differentiated = instructions.differentiated_learning_template_selection_guide?.for_learning_extension_and_enrichment || [];
    }

    // Match assessment needs
    if (assessmentNeed.includes('formative')) {
      recommendations.assessment = instructions.assessment_informed_learning_template_selection_guide?.for_formative_assessment_integration || [];
    }

    return recommendations;
  }

  /**
   * Validate methodology implementation against quality criteria
   */
  validateMethodologyQuality(methodologyImplementation) {
    const checklist = this.getQualityChecklist();
    const results = {
      passed: [],
      failed: [],
      score: 0
    };

    // Simple validation based on checklist items
    for (const criterion of checklist) {
      const passed = this.evaluateCriterion(criterion, methodologyImplementation);
      if (passed) {
        results.passed.push(criterion);
      } else {
        results.failed.push(criterion);
      }
    }

    results.score = (results.passed.length / checklist.length) * 100;
    return results;
  }

  /**
   * Evaluate a single quality criterion (simplified implementation)
   */
  evaluateCriterion(criterion, implementation) {
    const implText = JSON.stringify(implementation).toLowerCase();
    
    // Basic keyword matching for common criteria
    const criterionChecks = {
      'concepts_are_abstract_enduring_and_transferable': () => 
        implText.includes('concept') && (implText.includes('transfer') || implText.includes('abstract')),
      'activities_promote_international_mindedness_and_global_citizenship': () =>
        implText.includes('global') || implText.includes('international') || implText.includes('cultural'),
      'differentiation_affirms_identity_and_builds_on_strengths': () =>
        implText.includes('differentiat') && (implText.includes('strength') || implText.includes('identity')),
      'assessment_enhances_learning_and_provides_meaningful_feedback': () =>
        implText.includes('assessment') && implText.includes('feedback')
    };

    const checkFunction = criterionChecks[criterion];
    return checkFunction ? checkFunction() : true; // Default to true for unimplemented checks
  }
}

export const methodologyLoader = new MethodologyLoaderService();
export default MethodologyLoaderService;