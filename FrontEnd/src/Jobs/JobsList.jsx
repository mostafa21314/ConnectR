import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const JobsList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchJobs = async () => {
      try {
        // Mock data for now
        const mockJobs = [
          {
            id: 1,
            title: 'Senior Software Engineer',
            company: 'Tech Corp',
            requiredSkills: ['JavaScript', 'React', 'Node.js', 'AWS'],
            experience: '5+ years',
            location: 'Remote'
          },
          {
            id: 2,
            title: 'Data Scientist',
            company: 'Data Analytics Inc',
            requiredSkills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'],
            experience: '3+ years',
            location: 'New York'
          }
        ];
        setJobs(mockJobs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Jobs</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2">{job.title}</h2>
            <p className="text-gray-600 mb-2">{job.company}</p>
            <p className="text-gray-500 mb-4">{job.location}</p>
            <div className="mb-4">
              <h3 className="font-medium mb-2">Required Skills:</h3>
              <div className="flex flex-wrap gap-2">
                {job.requiredSkills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-gray-600 mb-4">Experience: {job.experience}</p>
            <Link
              to={`/dashboard/jobs/${job.id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors inline-block"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsList; 