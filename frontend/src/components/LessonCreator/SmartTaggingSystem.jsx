import { useState, useEffect } from 'react';
import { Tag, Clock, BookOpen, Users, Search, Loader } from 'lucide-react';

const SmartTaggingSystem = ({ onTagsSelected }) => {
  const [tags, setTags] = useState({
    papers: [],
    topic: '',
    suggestedSyllabusPoints: [],
    selectedSyllabusPoint: '',
    duration: '90',
    hasPreReading: false
  });
  const [isSearching, setIsSearching] = useState(false);

  const paperOptions = [
    { value: 'paper1', label: 'Paper 1 - Source Analysis', description: 'Focus on OPCVL, source comparison, and historical investigation' },
    { value: 'paper2', label: 'Paper 2 - Comparative Essays', description: 'Essay skills, comparison, and thematic analysis' },
    { value: 'paper3', label: 'Paper 3 - Regional Studies', description: 'Detailed knowledge and regional focus' }
  ];

  const handleTagChange = (field, value) => {
    const newTags = { ...tags, [field]: value };
    setTags(newTags);
    onTagsSelected(newTags);
  };

  const handlePaperToggle = (paperValue) => {
    const newPapers = tags.papers.includes(paperValue)
      ? tags.papers.filter(p => p !== paperValue)
      : [...tags.papers, paperValue];
    
    const newTags = { ...tags, papers: newPapers };
    setTags(newTags);
    onTagsSelected(newTags);
  };

  const searchSyllabusPoints = async () => {
    if (!tags.topic.trim() || tags.papers.length === 0) {
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch('http://localhost:3001/api/curriculum/suggest-syllabus-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: tags.topic,
          papers: tags.papers
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const newTags = { ...tags, suggestedSyllabusPoints: data.syllabusPoints };
        setTags(newTags);
        onTagsSelected(newTags);
      }
    } catch (error) {
      console.error('Error searching syllabus points:', error);
      // Fallback to sample suggestions
      const fallbackSuggestions = [
        'WHT10 - Authoritarian states (20th century) - Conditions for emergence: economic factors and social division',
        'WHT11 - Causes and effects of 20th century wars - Economic, ideological, political and territorial causes',
        'PS3 - The move to global war - German and Italian expansion (1933-1940)'
      ];
      const newTags = { ...tags, suggestedSyllabusPoints: fallbackSuggestions };
      setTags(newTags);
      onTagsSelected(newTags);
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-search when topic and papers are available
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tags.topic.trim() && tags.papers.length > 0) {
        searchSyllabusPoints();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [tags.topic, tags.papers]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
          <Tag className="w-5 h-5 mr-2 text-blue-600" />
          Lesson Context
        </h3>
        <p className="text-gray-600 mb-6">
          Set the foundation for your lesson by selecting the key context. This will pre-determine many IB requirements and focus areas.
        </p>
      </div>

      {/* Topic Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          What topic are you teaching? *
        </label>
        <input
          type="text"
          value={tags.topic}
          onChange={(e) => handleTagChange('topic', e.target.value)}
          placeholder="e.g., Rise of Nazi Germany, Cold War tensions, Apartheid..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500">
          Enter your lesson topic and we'll suggest relevant IB syllabus points
        </p>
      </div>

      {/* Paper Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Which IB History papers are you teaching for? *
        </label>
        <div className="grid grid-cols-1 gap-3">
          {paperOptions.map((paper) => (
            <label
              key={paper.value}
              className={`flex items-start p-4 border rounded-lg cursor-pointer transition-colors ${
                tags.papers.includes(paper.value)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <input
                type="checkbox"
                value={paper.value}
                checked={tags.papers.includes(paper.value)}
                onChange={() => handlePaperToggle(paper.value)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
              />
              <div className="ml-3">
                <div className="font-medium text-gray-800">{paper.label}</div>
                <div className="text-sm text-gray-600">{paper.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* AI Syllabus Suggestions */}
      {(tags.topic.trim() && tags.papers.length > 0) && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Search className="w-4 h-4 mr-2" />
            AI-Suggested Syllabus Points
          </label>
          
          {isSearching ? (
            <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Loader className="w-6 h-6 text-blue-600 animate-spin mr-2" />
              <span className="text-gray-600">Finding relevant syllabus points...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {tags.suggestedSyllabusPoints.map((point, index) => (
                <label
                  key={index}
                  className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                    tags.selectedSyllabusPoint === point
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="syllabusPoint"
                    value={point}
                    checked={tags.selectedSyllabusPoint === point}
                    onChange={(e) => handleTagChange('selectedSyllabusPoint', e.target.value)}
                    className="mt-1 text-green-600 focus:ring-green-500"
                  />
                  <div className="ml-3">
                    <div className="text-sm text-gray-800">{point}</div>
                  </div>
                </label>
              ))}
              
              {tags.suggestedSyllabusPoints.length === 0 && !isSearching && (
                <div className="p-4 text-center text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <Search className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p>No syllabus suggestions found. Try adjusting your topic or papers.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Duration and Teaching Approach */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            Lesson Duration
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="duration"
                value="90"
                checked={tags.duration === '90'}
                onChange={(e) => handleTagChange('duration', e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">90 minutes (Standard block)</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="duration"
                value="180"
                checked={tags.duration === '180'}
                onChange={(e) => handleTagChange('duration', e.target.value)}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2">180 minutes (Double block)</span>
            </label>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 flex items-center">
            <BookOpen className="w-4 h-4 mr-2" />
            Teaching Approach
          </label>
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={tags.hasPreReading}
              onChange={(e) => handleTagChange('hasPreReading', e.target.checked)}
              className="mt-1 text-blue-600 focus:ring-blue-500"
            />
            <div className="ml-3">
              <span className="font-medium">Using Flipped Learning?</span>
              <p className="text-sm text-gray-600">
                Students complete 30 minutes of pre-reading before class
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Context Summary */}
      {tags.topic && tags.papers.length > 0 && tags.selectedSyllabusPoint && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Lesson Context Set
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-700">Topic:</span>
              <p className="text-green-600">{tags.topic}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Papers:</span>
              <p className="text-green-600">{tags.papers.map(p => paperOptions.find(opt => opt.value === p)?.label.split(' - ')[0]).join(', ')}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Syllabus Point:</span>
              <p className="text-green-600">{tags.selectedSyllabusPoint}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Duration:</span>
              <p className="text-green-600">{tags.duration} minutes</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Approach:</span>
              <p className="text-green-600">{tags.hasPreReading ? 'Flipped Learning' : 'Traditional'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartTaggingSystem;