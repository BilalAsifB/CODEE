import {
  UNSAFE_KEYWORDS,
  NON_CODING_KEYWORDS,
  CODING_KEYWORDS,
  MIN_PROMPT_LENGTH,
  MAX_PROMPT_LENGTH,
} from "../utils/constants.js";
import { validatePromptSafety } from "./promptInjectionDetection.js";

export const validatePrompt = (prompt) => {
  const trimmedPrompt = prompt.trim();

  // Check 1: Length validation
  if (trimmedPrompt.length < MIN_PROMPT_LENGTH) {
    return {
      valid: false,
      reason: `Prompt is too short. Minimum ${MIN_PROMPT_LENGTH} characters required.`,
      type: "length",
    };
  }

  if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      reason: `Prompt is too long. Maximum ${MAX_PROMPT_LENGTH} characters allowed.`,
      type: "length",
    };
  }

  // Check 2: Prompt injection detection
  const injectionResult = validatePromptSafety(trimmedPrompt);
  if (!injectionResult.safe) {
    return {
      valid: false,
      reason: injectionResult.reason,
      type: "injection",
      details: injectionResult.details,
    };
  }

  // Check 3: Unsafe content
  const unsafeResult = checkUnsafeKeywords(trimmedPrompt);
  if (!unsafeResult.safe) {
    return {
      valid: false,
      reason: unsafeResult.reason,
      type: "unsafe",
    };
  }

  // Check 4: Coding relevance
  const codingResult = checkCodingRelevance(trimmedPrompt);
  if (!codingResult.relevant) {
    return {
      valid: false,
      reason: codingResult.reason,
      type: "relevance",
    };
  }

  // Check 5: Non-coding content
  const nonCodingResult = checkNonCodingContent(trimmedPrompt);
  if (!nonCodingResult.allowed) {
    return {
      valid: false,
      reason: nonCodingResult.reason,
      type: "non-coding",
    };
  }

  return { valid: true };
};

export const quickValidatePrompt = (prompt) => {
  const trimmedPrompt = prompt.trim();

  // Only perform lightweight checks for real-time validation
  const checks = {
    length: {
      valid:
        trimmedPrompt.length >= MIN_PROMPT_LENGTH &&
        trimmedPrompt.length <= MAX_PROMPT_LENGTH,
      message:
        trimmedPrompt.length < MIN_PROMPT_LENGTH
          ? `${MIN_PROMPT_LENGTH - trimmedPrompt.length} more characters needed`
          : trimmedPrompt.length > MAX_PROMPT_LENGTH
            ? `${trimmedPrompt.length - MAX_PROMPT_LENGTH} characters over limit`
            : "Length OK",
    },
    injection: validatePromptSafety(trimmedPrompt),
  };

  const allValid = checks.length.valid && checks.injection.safe;

  return {
    valid: allValid,
    checks,
    suggestion: !allValid
      ? "Fix the issues highlighted before generating code"
      : "Ready to generate",
  };
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
      reason:
        "Your request does not appear to be coding-related. Please ask for help with programming, scripting, or development tasks.",
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
        reason:
          "Your request appears to be for non-coding content. Please focus on programming questions.",
      };
    }
  }

  return { allowed: true };
};
