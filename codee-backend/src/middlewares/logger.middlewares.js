import { config } from '../config/env.js';

export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  const method = req.method;
  const path = req.path;

  // Log request
  if (config.LOG_LEVEL !== 'silent') {
    console.log(`[${new Date().toISOString()}] ${method} ${path}`);
  }

  // Log response when finished
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    const status = res.statusCode;

    if (config.LOG_LEVEL !== 'silent') {
      console.log(`[${new Date().toISOString()}] ${method} ${path} - ${status} (${duration}ms)`);
    }

    return originalSend.call(this, data);
  };

  next();
};