import NodeCache from 'node-cache';
import crypto from 'crypto';
import { configs } from '../configs/env.js';

// Create cache instance
const cache = new NodeCache({
  stdTTL: configs.CACHE_TTL,
  checkperiod: 120,
  useClones: false,
});

// Cache statistics
let cacheStats = {
  hits: 0,
  misses: 0,
  sets: 0,
};

export const generateCacheKey = (prompt, modelId) => {
  const data = `${prompt}:${modelId}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

export const getCachedResponse = (prompt, modelId) => {
  if (!configs.CACHE_ENABLED) {
    return null;
  }

  const key = generateCacheKey(prompt, modelId);
  const cached = cache.get(key);

  if (cached) {
    cacheStats.hits++;
    console.log(`✅ Cache HIT for prompt (${key.substring(0, 8)}...)`);
    return cached;
  }

  cacheStats.misses++;
  console.log(`❌ Cache MISS for prompt (${key.substring(0, 8)}...)`);
  return null;
};

export const setCachedResponse = (prompt, modelId, response) => {
  if (!configs.CACHE_ENABLED) {
    return;
  }

  const key = generateCacheKey(prompt, modelId);
  cache.set(key, response);
  cacheStats.sets++;
  console.log(`💾 Cached response for prompt (${key.substring(0, 8)}...)`);
};

export const clearCache = () => {
  cache.flushAll();
  cacheStats = { hits: 0, misses: 0, sets: 0 };
  console.log('🗑️  Cache cleared');
};

export const getCacheStats = () => {
  const total = cacheStats.hits + cacheStats.misses;
  const hitRate = total > 0 ? ((cacheStats.hits / total) * 100).toFixed(2) : 0;

  return {
    ...cacheStats,
    total,
    hitRate: `${hitRate}%`,
    keys: cache.keys().length,
  };
};
