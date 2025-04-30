import axios from 'axios';

const API_URL = 'http://localhost:8000/api/jobs';

// Get the token from localStorage
const getAuthToken = () => {
    const token = localStorage.getItem('token');
    return token ? `Bearer ${token}` : '';
};

// Create axios instance with default config
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const createJob = async (jobData) => {
    try {
        console.log('Making API call to create job:', `${API_URL}/create/`);
        const response = await axios.post(`${API_URL}/create/`, jobData, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('API response:', response);
        return response.data;
    } catch (error) {
        console.error('API error:', error.response || error);
        throw error.response?.data || error.message;
    }
};

export const getJobs = async () => {
    try {
        console.log('Making API call to get jobs:', `${API_URL}/`);
        const response = await axios.get(`${API_URL}/`);
        console.log('API response:', response);
        return response.data.jobs;
    } catch (error) {
        console.error('API error:', error.response || error);
        throw error.response?.data || error.message;
    }
};

export const getJobDetails = async (jobId) => {
    try {
        console.log('Making API call to get job details:', `${API_URL}/${jobId}/`);
        const response = await axios.get(`${API_URL}/${jobId}/`);
        console.log('API response:', response);
        return response.data;
    } catch (error) {
        console.error('API error:', error.response || error);
        throw error.response?.data || error.message;
    }
}; 