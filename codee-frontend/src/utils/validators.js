export const validatePrompt = (prompt) => {
  const minLength = 10;
  const maxLength = 5000;
  const trimmed = prompt.trim();

  if (!trimmed) {
    return { valid: false, message: 'Prompt cannot be empty' };
  }

  if (trimmed.length < minLength) {
    return {
      valid: false,
      message: `Prompt must be at least ${minLength} characters`,
    };
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      message: `Prompt must not exceed ${maxLength} characters`,
    };
  }

  return { valid: true };
};

export const isValidCode = (code) => {
  return typeof code === 'string' && code.trim().length > 0;
};