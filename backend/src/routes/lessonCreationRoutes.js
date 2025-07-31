import express from 'express';
import multer from 'multer';
import { lessonCreationService } from '../services/lessonCreationService.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Unsupported file type'), false);
    }
  }
});

// Generate lesson activities for selection
router.post('/activities/generate', async (req, res) => {
  try {
    const { lessonData, subject = 'history' } = req.body;

    // Check if we have either topic or resources
    const hasTopic = lessonData && lessonData.topic && lessonData.topic.trim().length > 0;
    const hasResources = lessonData && lessonData.resources && lessonData.resources.length > 0;
    
    if (!hasTopic && !hasResources) {
      return res.status(400).json({
        success: false,
        error: 'Either lesson topic or uploaded resources are required'
      });
    }

    console.log('Generating lesson activities for selection:', {
      topic: lessonData.topic,
      subject: subject
    });

    const result = await lessonCreationService.generateLessonActivities(lessonData, subject);

    if (result.error) {
      return res.status(400).json({
        success: false,
        error: result.message,
        suggestion: result.suggestion
      });
    }

    res.json({
      success: true,
      data: result,
      message: 'Lesson activities generated successfully'
    });
  } catch (error) {
    console.error('Error in generateLessonActivities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate lesson activities'
    });
  }
});

// Generate IB Cycle activities
router.post('/ib-activities/generate', async (req, res) => {
  try {
    const { tags, selections, subject = 'history' } = req.body;

    if (!tags || !selections) {
      return res.status(400).json({
        success: false,
        error: 'Tags and selections are required'
      });
    }

    console.log('Generating IB Cycle activities:', {
      paper: tags.paper,
      topic: tags.syllabusSection,
      conceptualFocus: selections.conceptualFocus,
      atlSkills: selections.atlSkills,
      subject: subject
    });

    const result = await lessonCreationService.generateIBCycleActivities(tags, selections, subject);

    if (result.error) {
      return res.status(400).json({
        success: false,
        error: result.message,
        suggestion: result.suggestion
      });
    }

    res.json({
      success: true,
      data: result,
      message: 'IB Cycle activities generated successfully'
    });
  } catch (error) {
    console.error('Error in generateIBCycleActivities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate IB Cycle activities'
    });
  }
});

// Generate complete lesson plan
router.post('/generate', upload.array('files', 10), async (req, res) => {
  try {
    const lessonData = JSON.parse(req.body.lessonData || '{}');
    const selectedActivities = JSON.parse(req.body.selectedActivities || '[]');
    const subject = req.body.subject || 'history';
    const uploadedFiles = req.files || [];

    // Check if we have either topic or resources (consistent with activities route)
    const hasTopic = lessonData && lessonData.topic && lessonData.topic.trim().length > 0;
    const hasResources = (lessonData && lessonData.resources && lessonData.resources.length > 0) || uploadedFiles.length > 0;
    
    if (!hasTopic && !hasResources) {
      return res.status(400).json({
        success: false,
        error: 'Either lesson topic or uploaded resources are required'
      });
    }

    // Extract file content for text files
    let fileContents = [];
    for (const file of uploadedFiles) {
      try {
        if (file.mimetype === 'text/plain') {
          const content = file.buffer.toString('utf-8');
          fileContents.push({
            filename: file.originalname,
            content: content,
            type: 'text'
          });
        } else {
          // For other file types, just store metadata for now
          fileContents.push({
            filename: file.originalname,
            content: `[${file.mimetype} file - ${(file.size / 1024).toFixed(1)}KB]`,
            type: 'file'
          });
        }
      } catch (error) {
        console.error(`Error processing file ${file.originalname}:`, error);
      }
    }

    console.log('\n🚀 Starting lesson plan generation...');
    console.log('📊 Generation parameters:', {
      topic: lessonData.topic || 'Will be determined from resources',
      hasTopic: hasTopic,
      hasResources: hasResources,
      subject: subject,
      selectedActivitiesCount: selectedActivities.length,
      uploadedFilesCount: uploadedFiles.length,
      fileContentsExtracted: fileContents.length,
      hasAPIKey: !!process.env.CLAUDE_API_KEY,
      model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514'
    });
    
    if (selectedActivities.length === 0) {
      console.log('⚠️  WARNING: No activities selected!');
    }
    
    if (!hasTopic) {
      console.log('📝 No topic provided - will extract from uploaded resources');
    }

    const result = await lessonCreationService.generateLessonPlan(
      lessonData, 
      selectedActivities, 
      subject,
      fileContents
    );

    if (result.error) {
      console.log('🚫 Service returned error:', result.message);
      return res.status(400).json({
        success: false,
        error: result.message,
        suggestion: result.suggestion
      });
    }

    console.log('✅ Lesson plan generated successfully:', result.title);
    res.json({
      success: true,
      data: {
        lessonPlan: result,
        metadata: {
          generatedAt: new Date().toISOString(),
          subject: subject,
          model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
          selectedActivitiesUsed: selectedActivities.length,
          filesProcessed: fileContents.length
        }
      },
      message: 'Lesson plan generated successfully'
    });
  } catch (error) {
    console.error('💥 Route error in generateLessonPlan:', error);
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      success: false,
      error: 'Failed to generate lesson plan: ' + error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Save lesson plan (placeholder for future database integration)
router.post('/save', async (req, res) => {
  try {
    const { lessonPlan, userId } = req.body;

    if (!lessonPlan || !lessonPlan.title) {
      return res.status(400).json({
        success: false,
        error: 'Valid lesson plan is required'
      });
    }

    // For now, just return success (future: save to database)
    const savedLesson = {
      ...lessonPlan,
      id: lessonPlan.id || `lesson_${Date.now()}`,
      savedAt: new Date().toISOString(),
      userId: userId || 'anonymous'
    };

    console.log('Lesson plan saved:', savedLesson.title);

    res.json({
      success: true,
      data: savedLesson,
      message: 'Lesson plan saved successfully'
    });
  } catch (error) {
    console.error('Error in saveLessonPlan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save lesson plan'
    });
  }
});

// Get available subjects and their capabilities
router.get('/subjects', async (req, res) => {
  try {
    const subjects = {
      history: {
        id: 'history',
        name: 'History',
        curriculum: 'IB DP',
        available: true,
        features: [
          'IB DP curriculum aligned',
          'Flipped learning model',
          'Source analysis activities',
          'Historical thinking skills',
          'Assessment preparation',
          'Differentiation strategies'
        ],
        description: 'Create comprehensive IB History DP lessons using flipped learning principles with structured pre-class preparation and engaging in-class activities.'
      },
      math: {
        id: 'math',
        name: 'Mathematics',
        curriculum: 'IB DP & MYP',
        available: false,
        features: [
          'Problem-based learning',
          'Conceptual understanding',
          'Mathematical modeling',
          'Technology integration'
        ],
        description: 'Mathematical lesson plans focusing on problem-solving and conceptual understanding.'
      },
      english: {
        id: 'english',
        name: 'English Language & Literature',
        curriculum: 'IB DP',
        available: false,
        features: [
          'Text analysis skills',
          'Creative writing',
          'Global contexts',
          'Literary devices'
        ],
        description: 'Literature and language lessons emphasizing critical analysis and creative expression.'
      },
      science: {
        id: 'science',
        name: 'Sciences',
        curriculum: 'IB DP',
        available: false,
        features: [
          'Inquiry-based learning',
          'Practical investigations',
          'Scientific method',
          'Data analysis'
        ],
        description: 'Scientific inquiry-based lessons with hands-on experiments.'
      }
    };

    res.json({
      success: true,
      data: subjects,
      message: 'Available subjects retrieved successfully'
    });
  } catch (error) {
    console.error('Error in getSubjects:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve subjects'
    });
  }
});

export default router;