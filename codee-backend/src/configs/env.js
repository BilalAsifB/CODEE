export const configs = {
  HF_TOKEN: process.env.HUGGING_FACE_TOKEN,
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  MODEL_ID: process.env.MODEL_ID,
  INFERENCE_API: process.env.INFERENCE_API,
  REQUEST_TIMEOUT: process.env.REQUEST_TIMEOUT, // 2 minutes
};

// Validate required config
if (!configs.HF_TOKEN) {
  throw new Error('HUGGING_FACE_TOKEN environment variable is required');
}