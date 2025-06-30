import React, { useState } from 'react';
import { FileText, Brain, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import AnalysisResults from './AnalysisResults';
import ImprovementSuggestions from './ImprovementSuggestions';

const LessonAnalyzer = () => {
  const [lessonContent, setLessonContent] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('general');
  const [analysis, setAnalysis] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [frameworks, setFrameworks] = useState([
    { id: 'general', name: 'General Pedagogy', description: 'Comprehensive educational best practices' },
    { id: 'bloom', name: "Bloom's Taxonomy", description: 'Focus on cognitive learning levels' },
    { id: 'solo', name: 'SOLO Taxonomy', description: 'Structure of Observed Learning Outcomes' },
    { id: 'constructivism', name: 'Constructivist Learning', description: 'Knowledge construction and scaffolding' }
  ]);

  const analyzeLesson = async () => {
    if (!lessonContent.trim()) {
      setError('Please enter lesson content to analyze');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);
    setSuggestions(null);

    try {
      const response = await fetch('http://localhost:3001/api/lessons/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: lessonContent,
          framework: selectedFramework
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze lesson');
      }

      setAnalysis(data.data);
    } catch (err) {
      setError(err.message || 'Failed to analyze lesson. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async () => {
    if (!analysis) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/lessons/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: lessonContent,
          currentAnalysis: analysis
        })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get suggestions');
      }

      setSuggestions(data.data);
    } catch (err) {
      setError(err.message || 'Failed to get suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Brain className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Lesson Analyser</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lesson Content
              </label>
              <textarea
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                placeholder="Paste your lesson plan, teaching notes, or curriculum content here..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={analyzeLesson}
                disabled={loading || !lessonContent.trim()}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span>{loading ? 'Analyzing...' : 'Analyze Lesson'}</span>
              </button>

              {analysis && (
                <button
                  onClick={getSuggestions}
                  disabled={loading}
                  className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Lightbulb className="w-5 h-5" />
                  <span>{loading ? 'Getting Suggestions...' : 'Get Suggestions'}</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Framework
              </label>
              <select
                value={selectedFramework}
                onChange={(e) => setSelectedFramework(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {frameworks.map((framework) => (
                  <option key={framework.id} value={framework.id}>
                    {framework.name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1">
                {frameworks.find(f => f.id === selectedFramework)?.description}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">Analysis Features:</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Educational framework analysis</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Detailed scoring breakdown</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Actionable recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Improvement suggestions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}
      </div>

      {analysis && (
        <AnalysisResults analysis={analysis} />
      )}

      {suggestions && (
        <ImprovementSuggestions suggestions={suggestions} />
      )}
    </div>
  );
};

export default LessonAnalyzer;