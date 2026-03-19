/** * API Configuration - Single source of truth for backend URLs * 
 * This file centralizes all backend API URLs to make updates easy.
 * When the backend URL changes, update ONLY this file.
 */

// Backend API Configuration
// ==========================
// Priority order for determining API URL:
// 1. Environment variable: import.meta.env.VITE_API_URL
// 2. Fallback to hardcoded value below

const FALLBACK_API_URL = 'http://julz-mission.duckdns.org/api';  // Will upgrade to HTTPS once SSL is working

// Get API URL from environment or fallback
const getApiUrl = () => {
  // Check for Vite environment variable
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check for regular env variable (for other build systems)
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Fallback to hardcoded value
  return FALLBACK_API_URL;
};

// Export the base API URL
export const API_URL = getApiUrl();

// Export WebSocket URL (derived from API URL)
export const getWebSocketUrl = () => {
  return API_URL.replace('https://', 'wss://').replace('/api', '');
};

// Export helper for making API calls
export const apiFetch = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  return response;
};

// Export default for convenience
export default { API_URL, getWebSocketUrl, apiFetch };
