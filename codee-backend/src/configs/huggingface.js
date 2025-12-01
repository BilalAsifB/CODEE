import { config } from './env.js';

export const huggingfaceConfig = {
  apiUrl: config.INFERENCE_API,
  token: config.HF_TOKEN,
  modelId: config.MODEL_ID,
  headers: {
    Authorization: `Bearer ${config.HF_TOKEN}`,
    'Content-Type': 'application/json',
  },
  generationParams: {
    max_new_tokens: 500,
    temperature: 0.7,
    top_p: 0.9,
  },
  criticParams: {
    max_new_tokens: 600,
    temperature: 0.5,
    top_p: 0.9,
  },
  timeout: config.REQUEST_TIMEOUT,
};