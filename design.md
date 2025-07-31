<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Docs Compatible Lesson Plan Styles</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        /* GOOGLE DOCS COMPATIBLE LESSON PLAN STYLES */
        
        .lesson-plan-content {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #2c3e50;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
        }

        /* LESSON TITLE */
        .lesson-plan-content h1 {
            font-family: 'Inter', sans-serif;
            font-size: 24px;
            font-weight: 700;
            color: #1a365d;
            text-align: center;
            margin: 0 0 8px 0;
            padding: 20px;
            background-color: #f7fafc;
            border: 2px solid #e2e8f0;
        }

        /* Subject/Duration Info - Table Format */
        .lesson-plan-content h1 + p {
            margin: 0 0 30px 0;
        }

        .lesson-plan-content h1 + p strong {
            background-color: #edf2f7;
            padding: 4px 8px;
            font-weight: 600;
            color: #2d3748;
        }

        /* MAIN SECTION HEADINGS */
        .lesson-plan-content h2 {
            font-family: 'Inter', sans-serif;
            font-size: 18px;
            font-weight: 600;
            margin: 30px 0 15px 0;
            padding: 12px 16px;
            border-left: 4px solid #4a5568;
            background-color: #f7fafc;
            color: #2d3748;
        }

        /* Framework Stage Colors - Google Docs Compatible */
        .lesson-plan-content h2:contains("Stage 1"),
        .lesson-plan-content h2:contains("Building Knowledge") {
            background-color: #f0fff4;
            border-left-color: #38a169;
            color: #2f855a;
        }

        .lesson-plan-content h2:contains("Stage 2"), 
        .lesson-plan-content h2:contains("Supported Reading") {
            background-color: #ebf8ff;
            border-left-color: #3182ce;
            color: #2c5282;
        }

        .lesson-plan-content h2:contains("Stage 3"),
        .lesson-plan-content h2:contains("Learning Genre") {
            background-color: #faf5ff;
            border-left-color: #805ad5;
            color: #553c9a;
        }

        .lesson-plan-content h2:contains("Stage 4"),
        .lesson-plan-content h2:contains("Supported Writing") {
            background-color: #fffaf0;
            border-left-color: #dd6b20;
            color: #c05621;
        }

        .lesson-plan-content h2:contains("Stage 5"),
        .lesson-plan-content h2:contains("Independent Writing") {
            background-color: #fed7d7;
            border-left-color: #e53e3e;
            color: #c53030;
        }

        /* Special Sections */
        .lesson-plan-content h2:contains("Learning Objectives") {
            background-color: #e6fffa;
            border-left-color: #319795;
            color: #2c7a7b;
        }

        .lesson-plan-content h2:contains("Writing Goal") {
            background-color: #f0fff4;
            border-left-color: #38a169;
            color: #2f855a;
        }

        /* SUBSECTION HEADINGS */
        .lesson-plan-content h3 {
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            font-weight: 600;
            color: #4a5568;
            margin: 20px 0 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }

        /* LISTS - Clean and Copy-Friendly */
        .lesson-plan-content ul {
            margin: 15px 0;
            padding: 15px;
            border: 1px solid #d1d5db;
            background: white;
        }

        .lesson-plan-content li {
            margin: 6px 0;
            padding: 0;
            background: none;
            border: none;
            font-size: 14px;
            line-height: 1.5;
            list-style: disc inside;
        }

        /* Ordered lists */
        .lesson-plan-content ol {
            margin: 15px 0;
            padding-left: 20px;
        }

        .lesson-plan-content ol li {
            background: none;
            border: none;
            padding: 5px 0;
            list-style: decimal;
        }

        /* TABLES - Enhanced for Google Docs */
        .lesson-plan-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
        }

        .lesson-plan-content th {
            background-color: #4a5568;
            color: white;
            padding: 12px 15px;
            text-align: left;
            font-weight: 600;
            border: 1px solid #2d3748;
        }

        .lesson-plan-content td {
            padding: 10px 15px;
            border: 1px solid #e2e8f0;
            background-color: white;
        }

        .lesson-plan-content tr:nth-child(even) td {
            background-color: #f9fafb;
        }

        /* EMPHASIS AND STRONG TEXT */
        .lesson-plan-content strong {
            font-weight: 600;
            color: #2d3748;
            background-color: #edf2f7;
            padding: 2px 4px;
        }

        .lesson-plan-content em {
            font-style: italic;
            background-color: #fefcbf;
            padding: 8px 12px;
            display: block;
            margin: 10px 0;
            border-left: 3px solid #d69e2e;
            color: #744210;
            font-weight: 500;
        }

        /* SECTION DIVIDERS */
        .lesson-plan-content hr {
            border: none;
            height: 2px;
            background-color: #cbd5e0;
            margin: 30px 0;
        }

        /* PARAGRAPHS */
        .lesson-plan-content p {
            margin: 12px 0;
            line-height: 1.6;
        }

        /* BLOCKQUOTES */
        .lesson-plan-content blockquote {
            margin: 20px 0;
            padding: 15px 20px;
            background-color: #f7fafc;
            border-left: 4px solid #4a5568;
            color: #4a5568;
            font-style: italic;
        }

        /* DURATION/TIME BOXES */
        .lesson-plan-content p:contains("Duration:") {
            background-color: #e6fffa;
            padding: 10px 15px;
            margin: 10px 0;
            border-left: 3px solid #319795;
            font-weight: 500;
        }

        /* CODE/KEYBOARD ELEMENTS */
        .lesson-plan-content code {
            background-color: #edf2f7;
            padding: 2px 6px;
            font-family: 'Monaco', 'Consolas', monospace;
            font-size: 13px;
            color: #2d3748;
        }

        /* PRINT STYLES */
        @media print {
            .lesson-plan-content {
                font-size: 12px;
                padding: 20px 0;
            }
            
            .lesson-plan-content h1 {
                font-size: 20px;
            }
            
            .lesson-plan-content h2 {
                font-size: 16px;
            }
            
            .lesson-plan-content h3 {
                font-size: 14px;
            }
        }
    </style>
</head>
<body>
    <!-- DEMO: Clean, Google Docs compatible lesson plan -->
    <div class="lesson-plan-content prose prose-sm">
        <h1>Lesson Sequence: World War I Propaganda Analysis</h1>
        <p><strong>Subject:</strong> History | <strong>Year Level:</strong> 10 | <strong>Duration:</strong> 50 minutes | <strong>Total Lessons:</strong> 6</p>
        
        <h2>Learning Objectives</h2>
        <ul>
            <li>Analyze primary source propaganda posters from WWI</li>
            <li>Evaluate the effectiveness of persuasive techniques</li>
            <li>Create original propaganda poster using historical techniques</li>
        </ul>
        
        <h2>Writing Goal</h2>
        <em>Students will produce analytical essays evaluating WWI propaganda techniques</em>
        
        <hr>
        
        <h2>Stage 1: Building Knowledge of the Field</h2>
        <p><strong>Duration:</strong> 100 minutes (2 lessons)</p>
        <p><strong>Purpose:</strong> Students explore the topic and build foundational knowledge</p>
        
        <h3>Key Activities</h3>
        <ul>
            <li><strong>Historical Context:</strong> Overview of WWI and propaganda use</li>
            <li><strong>Visual Analysis:</strong> Examine 10-15 propaganda posters</li>
            <li><strong>Vocabulary Building:</strong> Key terms (propaganda, persuasion, symbolism)</li>
        </ul>
        
        <h3>Resources Needed</h3>
        <ul>
            <li>WWI propaganda poster collection</li>
            <li>Historical timeline</li>
            <li>Vocabulary handout</li>
        </ul>
        
        <h3>Assessment</h3>
        <em>Exit ticket: Name 3 propaganda techniques observed</em>
        
        <hr>
        
        <h2>Stage 2: Supported Reading</h2>
        <p><strong>Duration:</strong> 100 minutes (2 lessons)</p>
        <p><strong>Purpose:</strong> Students engage with mentor texts and develop analytical skills</p>
        
        <h3>Sample Rubric Table</h3>
        <table>
            <thead>
                <tr>
                    <th>Criteria</th>
                    <th>Excellent (4)</th>
                    <th>Good (3)</th>
                    <th>Satisfactory (2)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Analysis Depth</td>
                    <td>Thorough analysis with multiple examples</td>
                    <td>Good analysis with some examples</td>
                    <td>Basic analysis with few examples</td>
                </tr>
                <tr>
                    <td>Historical Context</td>
                    <td>Strong understanding demonstrated</td>
                    <td>Good understanding shown</td>
                    <td>Basic understanding evident</td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>