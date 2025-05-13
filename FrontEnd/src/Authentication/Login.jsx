import React, { useState } from 'react';
import officeWorkerImage from '../assets/LoginHuman.jpeg'; // Replace with your image path
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { loginUser, signInWithGoogle } from '../Services/authService.jsx';
import { FaGoogle } from 'react-icons/fa';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginUser(username, password);
      console.log('Login successful:', user);
      setLoading(false);
      // Redirect to your main application page
      navigate('/dashboard'); // Replace '/dashboard' with your desired route
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Invalid username or password');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError('');
      setLoading(true);
      const user = await signInWithGoogle();
      console.log('Google sign-in successful:', user);
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google sign-in failed:', err);
      setError(err.message || 'Failed to sign in with Google');
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left side - Image */}
      <div className="w-1/2 h-full overflow-hidden">
        <img
          src={officeWorkerImage}
          alt="Office worker at computers"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login Form */}
      <div className="w-1/2 h-full bg-gray-50 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo and Tagline */}
          <div className="mb-10">
            <h1 className="text-6xl text-center font-bold text-blue-900 ">ConnectR</h1>
            <p className="text-sm font-bold text-blue-950 mt-2 text-center">Effortless HR Skill Matching for Top Talent</p>
          </div>

          {/* Display Error Message */}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded bg-gray-200/50"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded bg-gray-200/50"
              />
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-gray-600 hover:text-blue-800">
                Forgot Password?
              </a>
            </div>

            {/* Login Button with Loading State */}
            <button
              type="submit"
              className={`w-full bg-blue-900 hover:bg-blue-900 text-white py-3 px-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Login Now'}
            </button>

            {/* OR Divider */}
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <div className="px-3 text-sm text-gray-500">OR</div>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Social Login Buttons - Only Google */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-2xl py-2 px-4 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <FaGoogle className="text-red-400 mr-2" />
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center mt-8 text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-800 hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;