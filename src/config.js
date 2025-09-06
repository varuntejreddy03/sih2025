// API Configuration for different environments
const config = {
  development: {
    API_BASE_URL: 'http://localhost:10000'
  },
  production: {
    API_BASE_URL: '' // Use relative URLs in production
  }
};

const environment = import.meta.env.MODE || 'development';
export const API_BASE_URL = config[environment].API_BASE_URL;

// Helper function to get full API URL
export const getApiUrl = (endpoint) => {
  if (environment === 'production') {
    return endpoint; // Use relative URLs in production
  }
  return `${API_BASE_URL}${endpoint}`;
};