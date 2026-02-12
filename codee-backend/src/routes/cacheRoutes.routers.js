import express from "express";
import {
  getCacheStatsHandler,
  clearCacheHandler,
} from "../controllers/cacheControllers.controllers.js";

const router = express.Router();

router.get("/stats", getCacheStatsHandler);
router.post("/clear", clearCacheHandler);

export default router;
