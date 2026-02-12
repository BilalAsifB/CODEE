import {
  generateCode,
  validatePrompt,
  quickValidatePrompt,
  getModels,
  selectModel,
  healthCheck,
} from './api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe('generateCode', () => {
    test('should call API with correct parameters', async () => {
      const mockResponse = {
        generated_code: 'console.log("Hello")',
        improved_code: 'console.log("Hello World")',
        improvements: 'Added better message',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await generateCode('Write a hello world program');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/generate-code'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: 'Write a hello world program' }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should throw error when API returns error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid prompt' }),
      });

      await expect(generateCode('test')).rejects.toThrow('Invalid prompt');
    });

    test('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(generateCode('test')).rejects.toThrow();
    });
  });

  describe('validatePrompt', () => {
    test('should validate prompt successfully', async () => {
      const mockResponse = { valid: true, message: 'Prompt is valid' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await validatePrompt('Valid coding prompt');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/validate'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ prompt: 'Valid coding prompt' }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should throw error for invalid prompt', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Prompt too short' }),
      });

      await expect(validatePrompt('short')).rejects.toThrow('Prompt too short');
    });
  });

  describe('quickValidatePrompt', () => {
    test('should perform quick validation', async () => {
      const mockResponse = {
        valid: true,
        checks: { length: { valid: true } },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await quickValidatePrompt('Test prompt');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/validate/quick'),
        expect.objectContaining({
          method: 'POST',
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should return error object on failure', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await quickValidatePrompt('test');

      expect(result).toEqual({
        valid: false,
        error: 'Network error',
      });
    });
  });

  describe('getModels', () => {
    test('should fetch available models', async () => {
      const mockResponse = {
        models: ['0.5B', '3B'],
        defaults: { generation: '0.5B' },
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getModels();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/models/list'),
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should throw error when fetch fails', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });

      await expect(getModels()).rejects.toThrow('Failed to fetch models');
    });
  });

  describe('selectModel', () => {
    test('should select model successfully', async () => {
      const mockResponse = {
        message: 'Model selected',
        selectedModel: '3B',
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await selectModel('3B');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/models/select'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ modelType: '3B' }),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should throw error for invalid model', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Invalid model' }),
      });

      await expect(selectModel('invalid')).rejects.toThrow('Invalid model');
    });
  });

  describe('healthCheck', () => {
    test('should perform health check', async () => {
      const mockResponse = {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await healthCheck();

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/health'),
        expect.objectContaining({
          method: 'GET',
        })
      );
      expect(result).toEqual(mockResponse);
    });

    test('should throw error when server is down', async () => {
      fetch.mockRejectedValueOnce(new Error('Connection refused'));

      await expect(healthCheck()).rejects.toThrow('Server is not available');
    });
  });
});
