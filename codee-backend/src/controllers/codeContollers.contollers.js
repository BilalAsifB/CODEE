import { validatePrompt, quickValidatePrompt } from '../services/guardrails.js';
import { generateCode } from '../services/generationService.js';
import { improveCode } from '../services/criticService.js';

export const generateCodeHandler = async (req, res) => {
  const { prompt } = req.body;

  try {
    // Step 1: Validate prompt
    const validation = validatePrompt(prompt);
    if (!validation.valid) {
      return res.status(400).json({
        error: validation.reason,
        type: validation.type,
      });
    }

    // Step 2: Generate code
    const generatedCode = await generateCode(prompt);

    // Step 3: Improve code
    const improvementResult = await improveCode(generatedCode, prompt);

    // Step 4: Return results
    res.status(200).json({
      generated_code: generatedCode,
      improved_code: improvementResult.improved_code,
      improvements: improvementResult.improvements,
    });
  } catch (error) {
    console.error('Code generation error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to generate code',
    });
  }
};

export const validateHandler = async (req, res) => {
  const { prompt } = req.body;

  try {
    const validation = validatePrompt(prompt);

    if (!validation.valid) {
      return res.status(400).json({
        valid: false,
        reason: validation.reason,
        type: validation.type,
      });
    }

    res.status(200).json({
      valid: true,
      message: 'Prompt is valid and safe for code generation',
    });
  } catch (error) {
    console.error('Validation error:', error.message);
    res.status(500).json({
      error: error.message || 'Validation failed',
    });
  }
};

export const quickValidateHandler = async (req, res) => {
  const { prompt } = req.body;

  try {
    if (!prompt) {
      return res.status(400).json({
        error: 'Prompt is required',
      });
    }

    const validation = quickValidatePrompt(prompt);

    res.status(200).json(validation);
  } catch (error) {
    console.error('Quick validation error:', error.message);
    res.status(500).json({
      error: error.message || 'Validation failed',
    });
  }
};