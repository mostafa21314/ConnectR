import React, { useState } from 'react';
import { FaPlus, FaFileUpload, FaPlay, FaUser, FaFileAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from "axios";


const ResumeParser = () => {
  const [files, setFiles] = useState([]);
  const [parsedResumes, setParsedResumes] = useState([]);
  const [isParsing, setIsParsing] = useState(false);



  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    console.log("Files selected:", selectedFiles);
    
    if (selectedFiles.length === 0) return;
    
    // Add files to state immediately for better UI feedback
    setFiles(prev => [...prev, ...selectedFiles]);
    
    // Then upload in the background
    selectedFiles.forEach(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        // For testing/development - if your API isn't ready yet, comment this out
        console.log(`Attempting to upload ${file.name}`);
        const response = await axios({
          method: 'post',
          url: '/api/upload-resume',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log(`Successfully uploaded ${file.name}:`, response);
        
        // Note: We already added the file to state above, so no need to do it again
      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err);
        // Remove the file from state if upload failed
        // setFiles(prev => prev.filter(f => f !== file));
        
        // Alternatively, show an error message to the user
        alert(`Failed to upload ${file.name}. Please try again.`);
      }
    });
  };

  const handleStartParsing = async () => {
    if (files.length === 0) return;
  
    setIsParsing(true);
  
    try {
      const results = await Promise.all(files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
  
        try {
          const response = await axios({
            method: 'post',
            url: '/api/parse-resume',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
          });
  
          return {
            id: Date.now() + Math.random(),
            name: file.name,
            experience: Array.isArray(response.data.experience) ? response.data.experience : [], // Keep as array
            skills: Array.isArray(response.data.skills) ? response.data.skills : []
          };
        } catch (err) {
          console.error(`Error parsing ${file.name}:`, err);
          return {
            id: Date.now() + Math.random(),
            name: file.name,
            error: err.response?.data?.error || 'Failed to parse resume',
            experience: [],
            skills: []
          };
        }
      }));
  
      setParsedResumes(results);
    } catch (err) {
      console.error('Unexpected parsing error:', err);
      setParsedResumes(files.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        error: 'Unexpected error occurred',
        experience: [],
        skills: []
      })));
    } finally {
      setIsParsing(false);
    }
  };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">ConnectR</h1>
        </div>
        <nav className="mt-6">
        <Link to="/dashboard" className="flex items-center px-6 py-3 text-gray-300 hover:bg-blue-800 hover:text-white">
            <span className="mr-3"><FaFileAlt /></span>
                <span>Jobs</span>
            </Link>
          <SidebarItem icon={<FaUser />} text="Applicants" />
          <SidebarItem icon={<FaFileUpload />} text="Resume Parser" active />
          <SidebarItem icon={<FaFileAlt />} text="Analytics" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Resume Parser</h1>
          <div className="flex items-center">
            <button className="text-gray-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="h-8 w-8 rounded-full bg-gray-300"></div>
          </div>
        </header>

        <main className="p-6">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <input 
                type="file" 
                id="resume-upload" 
                className="hidden" 
                multiple 
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
              />
              <label 
                htmlFor="resume-upload" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center cursor-pointer"
              >
                <FaPlus className="mr-2" />
                Add Resumes
              </label>
            </div>

            {/* Resume Count Widget */}
            <div className="bg-white rounded-lg shadow p-6 mb-6 w-64">
              <h3 className="text-sm font-medium text-gray-500">Total Resumes</h3>
              <p className="text-3xl font-bold mt-1">{files.length}</p>
            </div>

            {/* Start Parsing Button */}
            <button 
              onClick={handleStartParsing}
              disabled={files.length === 0 || isParsing}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center ${
                (files.length === 0 || isParsing) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FaPlay className="mr-2" />
              {isParsing ? 'Parsing...' : 'Start Parsing'}
            </button>
          </div>

          {/* Selected Files */}
          {files.length > 0 && (
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Selected Resumes</h2>
              </div>
              <div className="p-6">
                <ul className="divide-y">
                  {files.map((file, index) => (
                    <li key={index} className="py-3 flex items-center">
                      <FaFileAlt className="text-gray-400 mr-3" />
                      <span>{file.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Parsed Results */}
          {parsedResumes.length > 0 && (
  <div className="bg-white rounded-lg shadow">
    <div className="px-6 py-4 border-b">
      <h2 className="text-lg font-semibold">Parsed Results</h2>
    </div>
    <div className="divide-y">
      {parsedResumes.map((resume) => (
        <div key={resume.id} className="p-6">
          <h3 className="font-medium text-lg mb-2">{resume.name}</h3>
          {resume.error ? (
            <p className="text-red-500">{resume.error}</p>
          ) : (
            <>
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-500">Experience:</span>
                <div className="ml-2 mt-1">
                  {resume.experience.length > 0 ? (
                    resume.experience.map((exp, index) => (
                      <div key={index} className="mb-1">
                        <span className="font-medium">{exp.title}</span>
                        {exp.organization && <span> at {exp.organization}</span>}
                        {exp.location && <span> - {exp.location}</span>}
                        {(exp.dates || exp.date_start) && (
                          <span className="text-gray-600">
                            {' ('}
                            {exp.dates ? exp.dates.join(' - ') : `${exp.date_start} - ${exp.date_end || 'Present'}`}
                            {')'}
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-gray-500">No experience found</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Skills:</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {resume.skills.length > 0 ? (
                    resume.skills.map((skill, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No skills found</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  </div>
)}
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, active }) => {
  return (
    <a 
      href="#" 
      className={`flex items-center px-6 py-3 text-gray-300 hover:bg-blue-800 hover:text-white ${active ? 'bg-blue-800 text-white' : ''}`}
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </a>
  );
};

export default ResumeParser;
