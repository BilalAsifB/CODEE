import { getCacheStats, clearCache } from "../services/cacheService.js";

export const getCacheStatsHandler = async (req, res) => {
  try {
    const stats = getCacheStats();
    res.status(200).json(stats);
  } catch (error) {
    console.error("Cache stats error:", error.message);
    res.status(500).json({ error: "Failed to retrieve cache stats" });
  }
};

export const clearCacheHandler = async (req, res) => {
  try {
    clearCache();
    res.status(200).json({ message: "Cache cleared successfully" });
  } catch (error) {
    console.error("Clear cache error:", error.message);
    res.status(500).json({ error: "Failed to clear cache" });
  }
};
