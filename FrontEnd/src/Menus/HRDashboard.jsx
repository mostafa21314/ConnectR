import React from 'react';
import { FaPlus, FaEye, FaUser, FaFileAlt, FaChartBar, FaBriefcase, FaFileUpload } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCreateJob = () => {
    console.log("Create job clicked");
    // navigate('/create-job');
  };

  const handleViewPostings = () => {
    console.log("View postings clicked");
    // navigate('/job-postings');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">ConnectR</h1>
        </div>
        <nav className="mt-6">
          <SidebarItem icon={<FaBriefcase />} text="Jobs" active />
          <SidebarItem icon={<FaUser />} text="Applicants" />
          <Link to="/dashboard/resume-parser" className="
          flex items-center px-6 py-3 text-gray-300 hover:bg-blue-800 hover:text-white">
            <span className="mr-3"><FaFileUpload /></span>
            <span>Resume Parser</span>
            </Link>
          <SidebarItem icon={<FaChartBar />} text="Analytics" />
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
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <StatCard 
              title="Active Jobs" 
              value="--" 
            />
            <StatCard 
              title="Total Applicants" 
              value="--" 
            />
            <StatCard 
              title="Acceptance Rate" 
              value="--%"
            />
          </div>
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <ActivityItem 
                avatar={<div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500"><FaUser /></div>}
                title="New application received"
                subtitle="Senior Developer Position"
                time="2h ago"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, active }) => {
  const handleClick = (e) => {
    e.preventDefault();
    console.log(`${text} clicked`);
    // Add navigation logic here
  };

  return (
    <a 
      href="#" 
      onClick={handleClick}
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
