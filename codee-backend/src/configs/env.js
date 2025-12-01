export const config = {
  HF_TOKEN: process.env.HUGGING_FACE_TOKEN,
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  MODEL_ID: 'bilalburney/qwen2.5-3b-coder-alpaca',
  INFERENCE_API: 'https://api-inference.huggingface.co/models',
  REQUEST_TIMEOUT: 120000, // 2 minutes
};

// Validate required config
if (!config.HF_TOKEN) {
  throw new Error('HUGGING_FACE_TOKEN environment variable is required');
}