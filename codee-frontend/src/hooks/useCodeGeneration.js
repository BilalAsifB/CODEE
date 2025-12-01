import { useState } from 'react';
import { generateCode } from '../services/api';

export const useCodeGeneration = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stage, setStage] = useState('');

  const generate = async (userPrompt) => {
    setLoading(true);
    setError('');
    setResult(null);
    setStage('generation');

    try {
      const data = await generateCode(userPrompt);
      setResult(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      setStage('');
    }
  };

  const reset = () => {
    setPrompt('');
    setResult(null);
    setError('');
    setStage('');
  };

  return {
    prompt,
    setPrompt,
    result,
    loading,
    error,
    stage,
    generate,
    reset,
  };
};