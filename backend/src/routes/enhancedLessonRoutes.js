import express from 'express';
import { lessonCreationService } from '../services/lessonCreationService.js';
import { lessonEnhancementService } from '../services/lessonEnhancementService.js';
import { adaptiveRecommendationService } from '../services/adaptiveRecommendationService.js';
import { methodologyLoader } from '../services/methodologyLoaderService.js';
import { smartTemplateSelector } from '../services/smartTemplateSelector.js';

const router = express.Router();

/**
 * Enhanced lesson activity generation with methodology integration
 */
router.post('/activities/enhanced', async (req, res) => {
  try {
    console.log('🚀 Enhanced activity generation requested');
    const { lessonData, subject, teachingHistory, preferences } = req.body;

    // Get both basic and adaptive recommendations
    const [basicActivities, adaptiveRecommendations] = await Promise.all([
      lessonCreationService.generateLessonActivities(lessonData, subject),
      adaptiveRecommendationService.getAdaptiveRecommendations(
        {
          subject: subject || 'history',
          topic: lessonData.topic,
          duration: parseInt(lessonData.duration) || 90,
          yearLevel: lessonData.yearLevel,
          studentCount: parseInt(lessonData.studentCount) || 25,
          teachingFocus: lessonData.teachingFocus || [],
          culturalDiversity: lessonData.culturalDiversity || 'moderate'
        },
        teachingHistory || [],
        preferences || {}
      )
    ]);

    res.json({
      success: true,
      basicActivities,
      adaptiveRecommendations,
      metadata: {
        enhancementLevel: 'full',
        methodologyIntegration: true,
        adaptationLevel: adaptiveRecommendations.metadata?.adaptationLevel,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Enhanced activity generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate enhanced activities',
      message: error.message
    });
  }
});

/**
 * Smart methodology selection based on context
 */
router.post('/methodologies/select', async (req, res) => {
  try {
    console.log('🧠 Smart methodology selection requested');
    const { context } = req.body;

    const methodologySelection = await smartTemplateSelector.selectOptimalMethodologies(context);

    res.json({
      success: true,
      methodologySelection,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Methodology selection error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to select methodologies',
      message: error.message
    });
  }
});

/**
 * Analyze and enhance existing lesson plan
 */
router.post('/enhance', async (req, res) => {
  try {
    console.log('✨ Lesson enhancement requested');
    const { lessonPlan, enhancementOptions } = req.body;

    const enhancement = await lessonEnhancementService.enhanceLesson(lessonPlan, enhancementOptions);

    res.json({
      success: true,
      enhancement,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Lesson enhancement error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to enhance lesson',
      message: error.message
    });
  }
});

/**
 * Get quality analysis for a lesson plan
 */
router.post('/analyze/quality', async (req, res) => {
  try {
    console.log('📊 Lesson quality analysis requested');
    const { lessonPlan } = req.body;

    const analysis = await lessonEnhancementService.analyzeLessonQuality(lessonPlan);

    res.json({
      success: true,
      qualityAnalysis: analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Quality analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze lesson quality',
      message: error.message
    });
  }
});

/**
 * Get adaptive recommendations based on teaching history
 */
router.post('/recommendations/adaptive', async (req, res) => {
  try {
    console.log('🎯 Adaptive recommendations requested');
    const { context, teachingHistory, preferences } = req.body;

    const recommendations = await adaptiveRecommendationService.getAdaptiveRecommendations(
      context,
      teachingHistory || [],
      preferences || {}
    );

    res.json({
      success: true,
      recommendations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Adaptive recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate adaptive recommendations',
      message: error.message
    });
  }
});

/**
 * Get available methodologies for a specific principle
 */
router.get('/methodologies/:principle', async (req, res) => {
  try {
    const { principle } = req.params;
    console.log(`📚 Methodologies requested for principle: ${principle}`);

    await methodologyLoader.loadMethodologies();
    const methodologies = methodologyLoader.getMethodologiesForPrinciple(principle);
    const methodologyNames = methodologyLoader.getMethodologyNames(principle);

    res.json({
      success: true,
      principle,
      methodologies,
      methodologyNames,
      count: methodologyNames.length
    });

  } catch (error) {
    console.error('❌ Methodology retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve methodologies',
      message: error.message
    });
  }
});

/**
 * Search methodologies by keywords and principles
 */
router.post('/methodologies/search', async (req, res) => {
  try {
    const { keywords, principles } = req.body;
    console.log(`🔍 Methodology search: keywords=${keywords?.join(',')}, principles=${principles?.join(',')}`);

    await methodologyLoader.loadMethodologies();
    const results = methodologyLoader.searchMethodologies(keywords || [], principles || []);

    res.json({
      success: true,
      results,
      count: results.length,
      searchCriteria: { keywords, principles }
    });

  } catch (error) {
    console.error('❌ Methodology search error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search methodologies',
      message: error.message
    });
  }
});

/**
 * Get contextual recommendations for teaching situation
 */
router.post('/recommendations/contextual', async (req, res) => {
  try {
    const { context } = req.body;
    console.log('🌍 Contextual recommendations requested');

    await methodologyLoader.loadMethodologies();
    const recommendations = methodologyLoader.getContextualRecommendations(context);

    res.json({
      success: true,
      contextualRecommendations: recommendations,
      context
    });

  } catch (error) {
    console.error('❌ Contextual recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate contextual recommendations',
      message: error.message
    });
  }
});

/**
 * Get IB framework information
 */
router.get('/framework/ib', async (req, res) => {
  try {
    console.log('📋 IB framework information requested');

    await methodologyLoader.loadMethodologies();
    const ibFramework = methodologyLoader.getIBFramework();
    const qualityCriteria = methodologyLoader.getConceptQualityCriteria();
    const contextualizationProcess = methodologyLoader.getContextualizationProcess();

    res.json({
      success: true,
      ibFramework,
      qualityCriteria,
      contextualizationProcess,
      supportingData: {
        teachingPrinciples: Object.keys(ibFramework?.ib_teaching_principles || {}),
        atlCategories: Object.keys(ibFramework?.atl_categories || {}),
        learnerProfileAttributes: Object.keys(ibFramework?.learner_profile_attributes || {})
      }
    });

  } catch (error) {
    console.error('❌ IB framework retrieval error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve IB framework',
      message: error.message
    });
  }
});

/**
 * Validate methodology implementation against quality criteria
 */
router.post('/validate/methodology', async (req, res) => {
  try {
    const { methodologyImplementation } = req.body;
    console.log('✅ Methodology validation requested');

    await methodologyLoader.loadMethodologies();
    const validation = methodologyLoader.validateMethodologyQuality(methodologyImplementation);

    res.json({
      success: true,
      validation,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Methodology validation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate methodology',
      message: error.message
    });
  }
});

/**
 * Submit feedback for adaptive learning
 */
router.post('/feedback/adaptive', async (req, res) => {
  try {
    const { lessonId, feedback, context } = req.body;
    console.log(`📝 Adaptive feedback submitted for lesson: ${lessonId}`);

    const learningResult = await adaptiveRecommendationService.learnFromFeedback(lessonId, feedback, context);

    res.json({
      success: true,
      learningResult,
      message: 'Feedback processed successfully'
    });

  } catch (error) {
    console.error('❌ Adaptive feedback error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process feedback',
      message: error.message
    });
  }
});

/**
 * Get integration patterns and optimization strategies
 */
router.get('/integration/patterns', async (req, res) => {
  try {
    console.log('🔗 Integration patterns requested');

    await methodologyLoader.loadMethodologies();
    const integrationPatterns = methodologyLoader.getCommonIntegrationPatterns();
    const optimization = methodologyLoader.getIntegrationOptimization();
    const teacherGuidance = methodologyLoader.getTeacherPreparationGuidance();

    res.json({
      success: true,
      integrationPatterns,
      optimization,
      teacherGuidance,
      supportInfo: {
        availablePatterns: Object.keys(integrationPatterns).length,
        optimizationLevels: Object.keys(optimization).length
      }
    });

  } catch (error) {
    console.error('❌ Integration patterns error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve integration patterns',
      message: error.message
    });
  }
});

/**
 * Health check for enhanced services
 */
router.get('/health', async (req, res) => {
  try {
    console.log('🏥 Enhanced services health check');

    // Test all services
    const healthChecks = await Promise.allSettled([
      methodologyLoader.loadMethodologies(),
      smartTemplateSelector.initialize(),
      lessonEnhancementService.initialize(),
      adaptiveRecommendationService.initialize()
    ]);

    const servicesStatus = {
      methodologyLoader: healthChecks[0].status === 'fulfilled',
      smartTemplateSelector: healthChecks[1].status === 'fulfilled',
      lessonEnhancementService: healthChecks[2].status === 'fulfilled',
      adaptiveRecommendationService: healthChecks[3].status === 'fulfilled'
    };

    const allHealthy = Object.values(servicesStatus).every(status => status);

    res.json({
      success: true,
      status: allHealthy ? 'healthy' : 'degraded',
      services: servicesStatus,
      timestamp: new Date().toISOString(),
      version: '2.0.0-enhanced'
    });

  } catch (error) {
    console.error('❌ Health check error:', error);
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;