import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import codeRoutes from './routes/codeRoutes.routers.js';
import { errorHandler } from './middlewares/errorHandler.middlewares.js';
import { requestLogger } from './middlewares/logger.middlewares.js';
import { configs } from './configs/env.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api', codeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the Codee API!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

const PORT = configs.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${configs.NODE_ENV}`);
});

export default app;