// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://carbon-tracker-004k.onrender.com'  // Remove trailing slash
  : 'http://localhost:8001';

export const API_ENDPOINTS = {
  upload: `${API_BASE_URL}/api/upload`,
  dashboard: `${API_BASE_URL}/api/dashboard`,
  recommendations: `${API_BASE_URL}/api/recommendations`,
  audit: `${API_BASE_URL}/api/audit`,
  records: `${API_BASE_URL}/api/records`,
  emissionFactors: `${API_BASE_URL}/api/emission-factors`
};

export default API_BASE_URL;