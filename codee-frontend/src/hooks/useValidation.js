import { useState, useEffect } from 'react';
import { quickValidatePrompt } from '../services/api';

export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useValidation = (prompt, delay = 500) => {
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const debouncedPrompt = useDebounce(prompt, delay);

  useEffect(() => {
    if (!debouncedPrompt || debouncedPrompt.trim().length === 0) {
      setValidationResult(null);
      setIsValidating(false);
      return;
    }

    const validate = async () => {
      setIsValidating(true);

      try {
        const result = await quickValidatePrompt(debouncedPrompt);
        setValidationResult(result);
      } catch (error) {
        setValidationResult({
          valid: false,
          error: error.message,
        });
      } finally {
        setIsValidating(false);
      }
    };

    validate();
  }, [debouncedPrompt]);

  return { validationResult, isValidating };
};
