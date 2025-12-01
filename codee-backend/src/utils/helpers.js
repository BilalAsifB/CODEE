export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength - 3) + '...';
};

export const sanitizeInput = (input) => {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 5000);
};

export const measureTime = async (fn, label = 'Operation') => {
  const startTime = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - startTime;
    console.log(`✓ ${label} completed in ${duration}ms`);
    return result;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`✗ ${label} failed after ${duration}ms:`, error.message);
    throw error;
  }
};

export const retryAsync = async (fn, maxRetries = 3, delayMs = 1000) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        console.warn(
          `Retry ${i + 1}/${maxRetries - 1} after ${delayMs}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
};

export const formatErrorResponse = (error) => {
  return {
    error: error.message || 'Unknown error',
    status: error.status || 500,
    timestamp: new Date().toISOString(),
  };
};