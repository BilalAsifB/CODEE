import { callHuggingFaceAPI, parseModelResponse } from './modelService.js';
import { formatQwenPrompt, extractCodeFromResponse } from '../utils/prompts.js';

export const generateCode = async (prompt) => {
  try {
    // Format prompt for Qwen
    const formattedPrompt = formatQwenPrompt(prompt);

    // Call model
    const response = await callHuggingFaceAPI(formattedPrompt);

    // Parse response
    const generatedText = parseModelResponse(response);

    // Extract code from response
    const code = extractCodeFromResponse(generatedText);

    if (!code || code.trim().length === 0) {
      throw new Error('Model did not generate any code');
    }

    return code;
  } catch (error) {
    console.error('Code generation error:', error.message);
    throw error;
  }
};