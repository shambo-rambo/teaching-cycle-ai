import React from 'react';
import LessonCreator from '../components/LessonCreator/LessonCreator';

const LessonCreatorPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <LessonCreator />
      </div>
    </div>
  );
};

export default LessonCreatorPage;