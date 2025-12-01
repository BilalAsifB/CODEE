import express from 'express';
import { generateCodeHandler, validateHandler } from '../controllers/codeContollers.contollers.js';
import { validateRequestBody } from '../middleware/validation.middlewares.js';

const router = express.Router();

router.post('/generate-code', validateRequestBody, generateCodeHandler);
router.post('/validate', validateRequestBody, validateHandler);

export default router;