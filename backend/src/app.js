import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import lessonRoutes from './routes/lessonRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import fileRoutes from './routes/fileRoutes.js';
import lessonCreationRoutes from './routes/lessonCreationRoutes.js';
import curriculumRoutes from './routes/curriculumRoutes.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import frameworkRoutes from './routes/frameworkRoutes.js';
import departmentRoutes from './routes/departmentRoutes.js';
import privacyRoutes from './routes/privacyRoutes.js';
import enhancedLessonRoutes from './routes/enhancedLessonRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import frameworkLearningRoutes from './routes/frameworkLearningRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: [
    'https://learning-cycle-v2.web.app',
    'https://learning-cycle-v2.firebaseapp.com',
    'https://learning-cycle-95ee7.web.app',
    'https://learning-cycle-95ee7.firebaseapp.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/frameworks', frameworkRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/privacy', privacyRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/analysis', analysisRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/lesson-creation', lessonCreationRoutes);
app.use('/api/curriculum', curriculumRoutes);
app.use('/api/enhanced-lessons', enhancedLessonRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/framework-learning', frameworkLearningRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;