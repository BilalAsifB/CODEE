import axios from 'axios';
import { huggingfaceConfig } from '../configs/huggingface.js';

export const callHuggingFaceAPI = async (inputs, params = {}) => {
  const url = `${huggingfaceConfig.apiUrl}/${huggingfaceConfig.modelId}`;
  const requestBody = {
    inputs,
    parameters: {
      ...huggingfaceConfig.generationParams,
      ...params,
    },
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: huggingfaceConfig.headers,
      timeout: huggingfaceConfig.timeout,
    });

    if (!response.data || !response.data[0]) {
      throw new Error('Unexpected response format from Hugging Face API');
    }

    return response.data[0];
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limited by Hugging Face API. Please try again later.');
    }
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Model may be loading. Please try again.');
    }
    throw new Error(`API error: ${error.message}`);
  }
};

export const parseModelResponse = (response) => {
  if (response.generated_text) {
    return response.generated_text;
  }
  return '';
};