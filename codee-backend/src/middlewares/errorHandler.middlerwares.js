export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  const statusCode = err.status || 500;
  const message = err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    error: message,
    status: statusCode,
    timestamp: new Date().toISOString(),
  });
};