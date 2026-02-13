import express from "express";
import {
  getModelsHandler,
  selectModelHandler,
} from "../controllers/modelControllers.controllers.js";

const router = express.Router();

router.get("/list", getModelsHandler);
router.post("/select", selectModelHandler);

export default router;
