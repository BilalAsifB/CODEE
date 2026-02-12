import { configs } from './env.js';

const HF_INFERENCE_API = 'https://api-inference.huggingface.co/models';

export const createModelConfig = (modelId) => ({
  apiUrl: configs.INFERENCE_API || `${HF_INFERENCE_API}/${modelId}`,
  token: configs.HF_TOKEN,
  modelId,
  headers: {
    Authorization: `Bearer ${configs.HF_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: configs.REQUEST_TIMEOUT,
});

export const generationParams = {
  max_new_tokens: 500,
  temperature: 0.7,
  top_p: 0.9,
  do_sample: true,
};

export const criticParams = {
  max_new_tokens: 600,
  temperature: 0.5,
  top_p: 0.9,
  do_sample: true,
};

// Legacy export for backward compatibility
export const huggingfaceConfig = {
  ...createModelConfig(configs.MODEL_ID_0_5B),
  generationParams,
  criticParams,
};