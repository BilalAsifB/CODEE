export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  generateCode: '/generate-code',
  validate: '/validate',
  health: '/health',
};

export const API_CONFIG = {
  timeout: 120000, // 2 minutes
  retries: 1,
  retryDelay: 1000,
};