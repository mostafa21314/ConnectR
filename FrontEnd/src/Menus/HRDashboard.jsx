import React, { useState } from 'react';
import { FaPlus, FaEye, FaUser, FaFileAlt, FaChartBar, FaBriefcase, FaFileUpload } from 'react-icons/fa';
import { Link, useNavigate, Routes, Route } from 'react-router-dom';
import JobDashboard from '../Jobs/JobDashboard';
import CreateJob from '../Jobs/CreateJob';
import JobsList from '../Jobs/JobsList';
import JobDetails from '../Jobs/JobDetails';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState('jobs');

  const handleCreateJob = () => {
    navigate('/dashboard/jobs/create');
  };

  const handleViewPostings = () => {
    navigate('/dashboard/jobs/postings');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">ConnectR</h1>
        </div>
        <nav className="mt-6">
          <SidebarItem 
            icon={<FaBriefcase />} 
            text="Jobs" 
            active={currentSection === 'jobs'} 
            onClick={() => {
              setCurrentSection('jobs');
              navigate('/dashboard/jobs');
            }}
          />
          <SidebarItem 
            icon={<FaUser />} 
            text="Applicants" 
            active={currentSection === 'applicants'}
            onClick={() => {
              setCurrentSection('applicants');
              navigate('/dashboard/applicants');
            }}
          />
          <Link 
            to="/dashboard/resume-parser" 
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-blue-800 hover:text-white ${
              currentSection === 'parser' ? 'bg-blue-800 text-white' : ''
            }`}
            onClick={() => setCurrentSection('parser')}
          >
            <span className="mr-3"><FaFileUpload /></span>
            <span>Resume Parser</span>
          </Link>
          <SidebarItem 
            icon={<FaChartBar />} 
            text="Analytics" 
            active={currentSection === 'analytics'}
            onClick={() => {
              setCurrentSection('analytics');
              navigate('/dashboard/analytics');
            }}
          />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              onClick={handleCreateJob}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <FaPlus className="mr-2" />
              <span>Create Job Listing</span>
            </button>
            <button 
              onClick={handleViewPostings}
              className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center"
            >
              <FaEye className="mr-2" />
              <span>View Postings</span>
            </button>
          </div>
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
          <Routes>
            <Route path="jobs" element={<JobDashboard />} />
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="jobs/postings" element={<JobsList />} />
            <Route path="jobs/:jobId" element={<JobDetails />} />
            <Route path="applicants" element={<div>Applicants Section</div>} />
            <Route path="analytics" element={<div>Analytics Section</div>} />
            <Route index element={<JobDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, active, onClick }) => {
  return (
    <a 
      href="#" 
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center px-6 py-3 text-gray-300 hover:bg-blue-800 hover:text-white ${active ? 'bg-blue-800 text-white' : ''}`}
    >
      <span className="mr-3">{icon}</span>
      <span>{text}</span>
    </a>
  );
};

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
};

const ActivityItem = ({ avatar, title, subtitle, time }) => {
  return (
    <div className="flex items-start">
      {avatar}
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <span className="text-xs text-gray-400">{time}</span>
    </div>
  );
};

export default Dashboard;
