import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader, AlertCircle } from 'lucide-react';

const LessonUpload = ({ onAnalysisComplete }) => {
  const [lessonContent, setLessonContent] = useState('');
  const [metadata, setMetadata] = useState({
    title: '',
    subject: '',
    yearLevel: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setError('');
      setUploadProgress(10);
      
      try {
        if (file.type === 'text/plain') {
          // Handle text files directly
          setUploadProgress(30);
          const reader = new FileReader();
          reader.onload = (e) => {
            setLessonContent(e.target.result);
            setUploadProgress(100);
            setTimeout(() => setUploadProgress(0), 1000);
          };
          reader.readAsText(file);
        } else {
          // Send all other files to backend for processing
          setUploadProgress(30);
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('http://localhost:3001/api/files/upload', {
            method: 'POST',
            body: formData
          });
          
          setUploadProgress(70);
          
          const data = await response.json();
          
          if (!data.success) {
            throw new Error(data.error || 'Failed to process file');
          }
          
          setLessonContent(data.data.content);
          setUploadProgress(100);
          setTimeout(() => setUploadProgress(0), 1000);
        }
        
        setMetadata(prev => ({
          ...prev,
          title: file.name.replace(/\.[^/.]+$/, '') // Remove file extension
        }));
        
      } catch (error) {
        setError(`Failed to process file: ${error.message}`);
        setUploadProgress(0);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!lessonContent.trim()) {
      setError('Please enter or upload lesson content');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setUploadProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('http://localhost:3001/api/analysis/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonContent,
          lessonTitle: metadata.title,
          subject: metadata.subject,
          yearLevel: metadata.yearLevel
        })
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze lesson');
      }

      onAnalysisComplete(data.data);
    } catch (err) {
      setError(err.message || 'Failed to analyze lesson. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleMetadataChange = (field, value) => {
    setMetadata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Upload className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Upload Lesson</h2>
      </div>

      {/* File Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
      >
        <input {...getInputProps()} />
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-blue-600 font-medium">Drop your lesson file here...</p>
        ) : (
          <div>
            <p className="text-gray-600 mb-2">
              Drag and drop your lesson file here, or click to browse
            </p>
            <p className="text-sm text-gray-500">
              Supports: PDF, Word documents (.doc, .docx), or text files (.txt)
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Files are processed securely on our servers
            </p>
          </div>
        )}
      </div>

      {/* Text Input Area */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Or paste your lesson content directly:
        </label>
        <textarea
          value={lessonContent}
          onChange={(e) => setLessonContent(e.target.value)}
          placeholder="Paste your lesson plan, teaching notes, or curriculum content here..."
          className="w-full h-48 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Metadata Input */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lesson Title
          </label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => handleMetadataChange('title', e.target.value)}
            placeholder="Enter lesson title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <select
            value={metadata.subject}
            onChange={(e) => handleMetadataChange('subject', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select subject</option>
            <option value="English">English</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="History">History</option>
            <option value="Geography">Geography</option>
            <option value="Arts">Arts</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Year Level
          </label>
          <select
            value={metadata.yearLevel}
            onChange={(e) => handleMetadataChange('yearLevel', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select year level</option>
            <option value="Foundation">Foundation</option>
            <option value="Year 1">Year 1</option>
            <option value="Year 2">Year 2</option>
            <option value="Year 3">Year 3</option>
            <option value="Year 4">Year 4</option>
            <option value="Year 5">Year 5</option>
            <option value="Year 6">Year 6</option>
            <option value="Year 7">Year 7</option>
            <option value="Year 8">Year 8</option>
            <option value="Year 9">Year 9</option>
            <option value="Year 10">Year 10</option>
            <option value="Year 11">Year 11</option>
            <option value="Year 12">Year 12</option>
          </select>
        </div>
      </div>

      {/* Progress Bar */}
      {(isAnalyzing || uploadProgress > 0) && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">
              {isAnalyzing ? 'Analyzing lesson...' : 'Processing file...'}
            </span>
            <span className="text-sm text-gray-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Analyze Button */}
      <div className="mt-6">
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !lessonContent.trim()}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAnalyzing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              <span>Analyzing Lesson...</span>
            </>
          ) : (
            <>
              <FileText className="w-5 h-5" />
              <span>Analyze with AI Frameworks</span>
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

    </div>
  );
};

export default LessonUpload;