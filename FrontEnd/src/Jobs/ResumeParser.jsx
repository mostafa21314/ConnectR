import React, { useState } from 'react';

const ResumeParser = ({ jobId, requiredSkills }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [matchingResults, setMatchingResults] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please upload a PDF file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      // Mock API response
      const mockResponse = {
        matchingSkills: ['JavaScript', 'React', 'Node.js'],
        missingSkills: ['AWS'],
        matchPercentage: 75,
        extractedSkills: ['JavaScript', 'React', 'Node.js', 'HTML', 'CSS', 'Git'],
        experience: '4 years',
        education: 'Bachelor\'s in Computer Science'
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMatchingResults(mockResponse);
    } catch (err) {
      setError('Error processing resume. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Resume Parser</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Resume (PDF)
        </label>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <button
        onClick={handleUpload}
        disabled={isUploading || !file}
        className={`px-4 py-2 rounded-md text-white ${
          isUploading || !file
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isUploading ? 'Processing...' : 'Parse Resume'}
      </button>

      {matchingResults && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Skill Matching Results</h3>
          
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-medium">Match Score</span>
              <div className="flex items-center">
                <div className="w-32 h-4 bg-gray-200 rounded-full mr-2">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${matchingResults.matchPercentage}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold">{matchingResults.matchPercentage}%</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Matching Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {matchingResults.matchingSkills.map((skill, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Missing Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {matchingResults.missingSkills.map((skill, index) => (
                    <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-medium mb-2">Extracted Information</h4>
            <div className="space-y-2">
              <p><span className="font-medium">Experience:</span> {matchingResults.experience}</p>
              <p><span className="font-medium">Education:</span> {matchingResults.education}</p>
              <div>
                <span className="font-medium">All Extracted Skills:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {matchingResults.extractedSkills.map((skill, index) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeParser; 