import { callHuggingFaceAPI, parseModelResponse } from './modelService.js';
import { formatCriticPrompt, extractImprovementsFromResponse } from '../utils/prompts.js';
import { huggingfaceConfig } from '../config/huggingface.js';

export const improveCode = async (code, originalPrompt) => {
  try {
    // Format prompt for critic
    const criticPrompt = formatCriticPrompt(code, originalPrompt);

    // Call model with critic parameters
    const response = await callHuggingFaceAPI(
      criticPrompt,
      huggingfaceConfig.criticParams
    );

    // Parse response
    const improvedText = parseModelResponse(response);

    // Extract improvements
    const { improved_code, improvements } =
      extractImprovementsFromResponse(improvedText);

    return {
      improved_code: improved_code || code,
      improvements:
        improvements || 'Code reviewed and enhanced for quality and efficiency.',
    };
  } catch (error) {
    console.error('Code improvement error:', error.message);
    // Return original code if critic fails
    return {
      improved_code: code,
      improvements: 'Improvement step skipped due to an error.',
    };
  }
};