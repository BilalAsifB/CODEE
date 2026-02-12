import { callHuggingFaceAPI, parseModelResponse } from './modelService.js';
import { formatQwenPrompt, extractCodeFromResponse } from '../utils/prompts.js';
import { getGenerationModel } from './modelRegistry.js';
import { generationParams } from '../configs/huggingface.js';
import { getCachedResponse, setCachedResponse } from './cacheService.js';

export const generateCode = async (prompt) => {
  try {
    const model = getGenerationModel();
    console.log(`🤖 Using ${model.name} for code generation`);
    
    // Check cache first
    const cached = getCachedResponse(prompt, model.id);
    if (cached) {
      return cached;
    }
    
    // Format prompt for Qwen
    const formattedPrompt = formatQwenPrompt(prompt);

    // Call model
    const response = await callHuggingFaceAPI(formattedPrompt, generationParams, model.id);

    // Parse response
    const generatedText = parseModelResponse(response);

    // Extract code from response
    const code = extractCodeFromResponse(generatedText);

    if (!code || code.trim().length === 0) {
      throw new Error('Model did not generate any code');
    }

    // Cache the result
    setCachedResponse(prompt, model.id, code);

    return code;
  } catch (error) {
    console.error('Code generation error:', error.message);
    throw error;
  }
};