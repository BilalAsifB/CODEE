import { configs } from './env.js';

export const huggingfaceConfig = {
  apiUrl: configs.INFERENCE_API,
  token: configs.HF_TOKEN,
  modelId: configs.MODEL_ID,
  headers: {
    Authorization: `Bearer ${configs.HF_TOKEN}`,
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
  timeout: configs.REQUEST_TIMEOUT,
};