import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const JobDetails = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        // Mock data for now
        const mockJob = {
          id: jobId,
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          description: 'We are looking for a skilled Senior Software Engineer to join our team...',
          requiredSkills: ['JavaScript', 'React', 'Node.js', 'AWS'],
          preferredSkills: ['TypeScript', 'Docker', 'CI/CD'],
          experience: '5+ years',
          location: 'Remote',
          salary: '$120,000 - $150,000'
        };
        setJob(mockJob);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job details:', error);
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const onDrop = useCallback((acceptedFiles) => {
    const newResumes = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0,
      matchingScore: null,
      matchingSkills: [],
      missingSkills: [],
      error: null
    }));

    setResumes(prev => [...prev, ...newResumes]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const processResumes = async () => {
    setIsProcessing(true);
    setBatchProgress(0);

    // Process resumes in batches of 5
    const batchSize = 5;
    const totalBatches = Math.ceil(resumes.length / batchSize);
    let currentBatch = 0;

    const pendingResumes = resumes.filter(resume => resume.status === 'pending');

    for (let i = 0; i < pendingResumes.length; i += batchSize) {
      const batch = pendingResumes.slice(i, i + batchSize);
      
      // Process batch
      await Promise.all(batch.map(async (resume) => {
        try {
          setResumes(prev => prev.map(r => 
            r.id === resume.id ? { ...r, status: 'processing' } : r
          ));

          // Mock API call for resume processing
          await new Promise(resolve => setTimeout(resolve, 1500));

          // Mock response
          const mockResult = {
            matchingSkills: ['JavaScript', 'React'],
            missingSkills: ['AWS', 'Node.js'],
            matchingScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
          };

          setResumes(prev => prev.map(r => 
            r.id === resume.id ? {
              ...r,
              status: 'completed',
              matchingScore: mockResult.matchingScore,
              matchingSkills: mockResult.matchingSkills,
              missingSkills: mockResult.missingSkills,
              progress: 100
            } : r
          ));
        } catch (error) {
          setResumes(prev => prev.map(r => 
            r.id === resume.id ? { ...r, status: 'error', error: error.message } : r
          ));
        }
      }));

      currentBatch++;
      setBatchProgress((currentBatch / totalBatches) * 100);
    }

    setIsProcessing(false);
  };

  const clearCompleted = () => {
    setResumes(prev => prev.filter(resume => resume.status !== 'completed'));
  };

  const clearAll = () => {
    setResumes([]);
    setBatchProgress(0);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!job) {
    return <div className="flex justify-center items-center h-screen">Job not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
        <p className="text-xl text-gray-600 mb-6">{job.company}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Job Description</h2>
            <p className="text-gray-700 mb-6">{job.description}</p>
            
            <h2 className="text-xl font-semibold mb-4">Requirements</h2>
            <div className="mb-6">
              <h3 className="font-medium mb-2">Required Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-2">Preferred Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {job.preferredSkills.map((skill, index) => (
                  <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Job Details</h2>
              <div className="space-y-4">
                <div>
                  <span className="font-medium">Experience:</span>
                  <span className="ml-2">{job.experience}</span>
                </div>
                <div>
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{job.location}</span>
                </div>
                <div>
                  <span className="font-medium">Salary:</span>
                  <span className="ml-2">{job.salary}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Upload Section */}
        <div className="mt-8">
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-6">Resume Processing</h2>
            
            {/* Drag and Drop Zone */}
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center cursor-pointer
                ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}`}
            >
              <input {...getInputProps()} />
              <p className="text-gray-600">
                {isDragActive
                  ? 'Drop the resumes here...'
                  : 'Drag and drop resumes here, or click to select files'}
              </p>
              <p className="text-sm text-gray-500 mt-2">Only PDF files are accepted</p>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="space-x-4">
                <button
                  onClick={processResumes}
                  disabled={isProcessing || resumes.length === 0}
                  className={`px-4 py-2 rounded-md text-white ${
                    isProcessing || resumes.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isProcessing ? 'Processing...' : 'Process Resumes'}
                </button>
                <button
                  onClick={clearCompleted}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Clear Completed
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Clear All
                </button>
              </div>
              <div className="text-sm text-gray-600">
                {resumes.length} resumes uploaded
              </div>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <div className="mb-6">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${batchProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Processing batch: {Math.round(batchProgress)}%
                </p>
              </div>
            )}

            {/* Resumes List */}
            <div className="space-y-4">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium">{resume.name}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({(resume.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    {resume.status === 'completed' && (
                      <div className="mt-2">
                        <div className="flex items-center">
                          <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${resume.matchingScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">
                            {resume.matchingScore}% match
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {resume.matchingSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {resume.missingSkills.map((skill, index) => (
                            <span
                              key={index}
                              className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    {resume.status === 'pending' && (
                      <span className="text-gray-500">Pending</span>
                    )}
                    {resume.status === 'processing' && (
                      <span className="text-blue-500">Processing...</span>
                    )}
                    {resume.status === 'completed' && (
                      <span className="text-green-500">Completed</span>
                    )}
                    {resume.status === 'error' && (
                      <span className="text-red-500">Error</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails; 