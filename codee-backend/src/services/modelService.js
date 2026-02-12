import axios from 'axios';
import { createModelConfig } from '../configs/huggingface.js';

export const callHuggingFaceAPI = async (inputs, params = {}, modelId) => {
  const config = createModelConfig(modelId);
  
  const url = config.apiUrl.includes('api-inference.huggingface.co')
    ? config.apiUrl
    : `https://api-inference.huggingface.co/models/${modelId}`;
  
  console.log('🔗 Calling HF API:', { model: modelId, url });

  const requestBody = {
    inputs,
    parameters: params,
  };

  try {
    const response = await axios.post(url, requestBody, {
      headers: config.headers,
      timeout: config.timeout,
    });

    if (!response.data || !response.data[0]) {
      throw new Error('Unexpected response format from Hugging Face API');
    }

    return response.data[0];
  } catch (error) {
    if (error.response?.status === 429) {
      throw new Error('Rate limited by Hugging Face API. Please try again later.');
    }
    if (error.response?.status === 503) {
      throw new Error('Model is loading. Please wait and try again in 20-30 seconds.');
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