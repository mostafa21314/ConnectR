import React, { useState } from 'react';
import officeWorkerImage from '../assets/LoginHuman.jpeg';
import { Link } from 'react-router-dom';
const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle registration logic here
    console.log(formData);
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left side - Registration Form */}
      <div className="w-1/2 h-full bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo and Tagline */}
          <div className="mb-10">
            <h1 className="text-6xl text-center font-bold text-blue-900">ConnectR</h1>
            <p className="text-sm font-bold text-blue-950 mt-2 text-center">Effortless HR Skill Matching for Top Talent</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded bg-gray-200/50"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded bg-gray-200/50"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded bg-gray-200/50"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded bg-gray-200/50"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded bg-gray-200/50"
                required
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600"
                required
              />
              <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-600">
                I agree to the <a href="#" className="text-blue-800 hover:underline">Terms and Conditions</a>
              </label>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              className="w-full bg-blue-900 hover:bg-blue-900 text-white py-3 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Register Now
            </button>

            {/* Login Link */}
            <div className="text-center mt-8 text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-800 hover:underline">
                  Log in
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-1/2 h-full overflow-hidden">
        <img
          src={officeWorkerImage} 
          alt="Office worker at computers"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Register;