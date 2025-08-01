// Centralized API configuration
const getApiBaseUrl = () => {
  // Use environment variable if available, otherwise fall back to localhost
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function for making API calls
export const makeApiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, finalOptions);
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response;
};