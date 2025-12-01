import {
  UNSAFE_KEYWORDS,
  NON_CODING_KEYWORDS,
  CODING_KEYWORDS,
  MIN_PROMPT_LENGTH,
  MAX_PROMPT_LENGTH,
} from '../utils/constants.js';

export const validatePrompt = (prompt) => {
  const trimmedPrompt = prompt.trim();

  // Check 1: Length validation
  if (trimmedPrompt.length < MIN_PROMPT_LENGTH) {
    return {
      valid: false,
      reason: `Prompt is too short. Minimum ${MIN_PROMPT_LENGTH} characters required.`,
    };
  }

  if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      reason: `Prompt is too long. Maximum ${MAX_PROMPT_LENGTH} characters allowed.`,
    };
  }

  // Check 2: Unsafe content
  const unsafeResult = checkUnsafeKeywords(trimmedPrompt);
  if (!unsafeResult.safe) {
    return {
      valid: false,
      reason: unsafeResult.reason,
    };
  }

  // Check 3: Coding relevance
  const codingResult = checkCodingRelevance(trimmedPrompt);
  if (!codingResult.relevant) {
    return {
      valid: false,
      reason: codingResult.reason,
    };
  }

  // Check 4: Non-coding content
  const nonCodingResult = checkNonCodingContent(trimmedPrompt);
  if (!nonCodingResult.allowed) {
    return {
      valid: false,
      reason: nonCodingResult.reason,
    };
  }

  return { valid: true };
};

export const checkUnsafeKeywords = (text) => {
  const lowerText = text.toLowerCase();

  for (const keyword of UNSAFE_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return {
        safe: false,
        reason: `Request contains potentially unsafe content. Please ask coding-related questions only.`,
      };
    }
  }

  return { safe: true };
};

export const checkCodingRelevance = (text) => {
  const lowerText = text.toLowerCase();
  const hasCodingKeyword = CODING_KEYWORDS.some((keyword) =>
    lowerText.includes(keyword)
  );

  if (!hasCodingKeyword) {
    return {
      relevant: false,
      reason: 'Your request does not appear to be coding-related. Please ask for help with programming, scripting, or development tasks.',
    };
  }

  return { relevant: true };
};

export const checkNonCodingContent = (text) => {
  const lowerText = text.toLowerCase();

  for (const keyword of NON_CODING_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return {
        allowed: false,
        reason: 'Your request appears to be for non-coding content. Please focus on programming questions.',
      };
    }
  }

  return { allowed: true };
};