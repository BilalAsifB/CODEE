export const configs = {
  HF_TOKEN: process.env.HUGGING_FACE_TOKEN,
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  MODEL_ID_3B: process.env.MODEL_ID_3B || 'bilalburney/qwen2.5-3b-coder-alpaca',
  MODEL_ID_0_5B: process.env.MODEL_ID_0_5B || 'bilalburney/qwen2.5-0.5b-coder-alpaca',
  INFERENCE_API: process.env.INFERENCE_API,
  REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT || 300000,
  CACHE_ENABLED: process.env.CACHE_ENABLED === 'true',
  CACHE_TTL: parseInt(process.env.CACHE_TTL) || 3600,
  STREAMING_ENABLED: process.env.STREAMING_ENABLED === 'true',
};

// Validate required config
if (!configs.HF_TOKEN) {
  throw new Error('HUGGING_FACE_TOKEN environment variable is required');
}