import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  generateCacheKey,
  getCachedResponse,
  setCachedResponse,
  clearCache,
  getCacheStats,
} from '../../services/cacheService.js';

describe('Cache Service', () => {
  beforeEach(() => {
    clearCache();
  });

  describe('generateCacheKey', () => {
    test('should generate consistent key for same inputs', () => {
      const key1 = generateCacheKey('test prompt', 'model-1');
      const key2 = generateCacheKey('test prompt', 'model-1');
      expect(key1).toBe(key2);
    });

    test('should generate different keys for different prompts', () => {
      const key1 = generateCacheKey('prompt 1', 'model-1');
      const key2 = generateCacheKey('prompt 2', 'model-1');
      expect(key1).not.toBe(key2);
    });

    test('should generate different keys for different models', () => {
      const key1 = generateCacheKey('test prompt', 'model-1');
      const key2 = generateCacheKey('test prompt', 'model-2');
      expect(key1).not.toBe(key2);
    });

    test('should return a hex string', () => {
      const key = generateCacheKey('test', 'model');
      expect(key).toMatch(/^[a-f0-9]+$/);
    });

    test('should generate 64-character SHA-256 hash', () => {
      const key = generateCacheKey('test', 'model');
      expect(key.length).toBe(64);
    });
  });

  describe('getCachedResponse and setCachedResponse', () => {
    test('should return null for non-existent cache entry', () => {
      const result = getCachedResponse('new prompt', 'model-1');
      expect(result).toBeNull();
    });

    test('should store and retrieve cached response', () => {
      const prompt = 'test prompt';
      const modelId = 'model-1';
      const response = { code: 'console.log("test")' };

      setCachedResponse(prompt, modelId, response);
      const cached = getCachedResponse(prompt, modelId);

      expect(cached).toEqual(response);
    });

    test('should retrieve same object reference when useClones is false', () => {
      const prompt = 'test prompt';
      const modelId = 'model-1';
      const response = { code: 'console.log("test")' };

      setCachedResponse(prompt, modelId, response);
      const cached = getCachedResponse(prompt, modelId);

      expect(cached).toBe(response);
    });

    test('should not cache different prompts together', () => {
      setCachedResponse('prompt 1', 'model-1', { code: 'code 1' });
      setCachedResponse('prompt 2', 'model-1', { code: 'code 2' });

      const cached1 = getCachedResponse('prompt 1', 'model-1');
      const cached2 = getCachedResponse('prompt 2', 'model-1');

      expect(cached1.code).toBe('code 1');
      expect(cached2.code).toBe('code 2');
    });
  });

  describe('clearCache', () => {
    test('should clear all cached entries', () => {
      setCachedResponse('prompt 1', 'model-1', { code: 'test' });
      setCachedResponse('prompt 2', 'model-1', { code: 'test' });

      clearCache();

      const cached1 = getCachedResponse('prompt 1', 'model-1');
      const cached2 = getCachedResponse('prompt 2', 'model-1');

      expect(cached1).toBeNull();
      expect(cached2).toBeNull();
    });

    test('should reset cache statistics', () => {
      setCachedResponse('prompt', 'model', { code: 'test' });
      getCachedResponse('prompt', 'model');
      
      clearCache();
      const stats = getCacheStats();

      expect(stats.hits).toBe(0);
      expect(stats.misses).toBe(0);
      expect(stats.sets).toBe(0);
    });
  });

  describe('getCacheStats', () => {
    test('should track cache hits', () => {
      setCachedResponse('prompt', 'model', { code: 'test' });
      getCachedResponse('prompt', 'model');
      
      const stats = getCacheStats();
      expect(stats.hits).toBe(1);
    });

    test('should track cache misses', () => {
      getCachedResponse('non-existent', 'model');
      
      const stats = getCacheStats();
      expect(stats.misses).toBe(1);
    });

    test('should track cache sets', () => {
      setCachedResponse('prompt', 'model', { code: 'test' });
      
      const stats = getCacheStats();
      expect(stats.sets).toBe(1);
    });

    test('should calculate hit rate correctly', () => {
      setCachedResponse('prompt', 'model', { code: 'test' });
      getCachedResponse('prompt', 'model'); // hit
      getCachedResponse('prompt', 'model'); // hit
      getCachedResponse('other', 'model'); // miss
      
      const stats = getCacheStats();
      expect(stats.total).toBe(3);
      expect(stats.hitRate).toBe('66.67%');
    });

    test('should handle zero requests without error', () => {
      const stats = getCacheStats();
      expect(stats.total).toBe(0);
      expect(stats.hitRate).toBe('0%');
    });

    test('should track number of keys', () => {
      setCachedResponse('prompt1', 'model', { code: 'test' });
      setCachedResponse('prompt2', 'model', { code: 'test' });
      
      const stats = getCacheStats();
      expect(stats.keys).toBe(2);
    });
  });
});
