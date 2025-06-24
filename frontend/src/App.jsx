import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LessonAnalysisPage from './pages/LessonAnalysisPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LessonAnalysisPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;