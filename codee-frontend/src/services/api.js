import { API_BASE_URL } from '../config/api';

export const generateCode = async (prompt) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return data;
  } catch (error) {
    throw new Error(
      error.message || 'Failed to connect to server. Please try again.'
    );
  }
};

export const validatePrompt = async (prompt) => {
  try {
    const response = await fetch(`${API_BASE_URL}/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Validation failed');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Validation request failed');
  }
};

export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Health check failed');
    }

    return data;
  } catch (error) {
    throw new Error('Server is not available');
  }
};