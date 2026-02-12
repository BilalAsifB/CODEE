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

export const quickValidatePrompt = async (prompt) => {
  try {
    const response = await fetch(`${API_BASE_URL}/validate/quick`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { valid: false, error: error.message };
  }
};

export const getModels = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/models/list`, {
      method: 'GET',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error('Failed to fetch models');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch models');
  }
};

export const selectModel = async (modelType) => {
  try {
    const response = await fetch(`${API_BASE_URL}/models/select`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ modelType }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to select model');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Model selection failed');
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