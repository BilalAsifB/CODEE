import { configs } from "../configs/env.js";

export const MODEL_TYPES = {
  SMALL: "0.5B",
  LARGE: "3B",
};

export const MODEL_REGISTRY = {
  [MODEL_TYPES.SMALL]: {
    id: configs.MODEL_ID_0_5B,
    name: "Qwen 2.5 0.5B Coder",
    size: "0.5B",
    description: "Fast and efficient for quick code generation",
    recommendedFor: "generation",
    avgLatency: "2s",
  },
  [MODEL_TYPES.LARGE]: {
    id: configs.MODEL_ID_3B,
    name: "Qwen 2.5 3B Coder",
    size: "3B",
    description: "Higher quality code with better reasoning",
    recommendedFor: "critic",
    avgLatency: "4s",
  },
};

// Default model selection strategy
export const DEFAULT_GENERATION_MODEL = MODEL_TYPES.SMALL;
export const DEFAULT_CRITIC_MODEL = MODEL_TYPES.LARGE;

let userSelectedModel = null;

export const getModelById = (modelType) => {
  return MODEL_REGISTRY[modelType];
};

export const getGenerationModel = () => {
  return userSelectedModel
    ? MODEL_REGISTRY[userSelectedModel]
    : MODEL_REGISTRY[DEFAULT_GENERATION_MODEL];
};

export const getCriticModel = () => {
  return MODEL_REGISTRY[DEFAULT_CRITIC_MODEL];
};

export const setUserModel = (modelType) => {
  if (!MODEL_REGISTRY[modelType]) {
    throw new Error(`Invalid model type: ${modelType}`);
  }
  userSelectedModel = modelType;
  return MODEL_REGISTRY[modelType];
};

export const getUserModel = () => {
  return userSelectedModel;
};

export const getAllModels = () => {
  return Object.values(MODEL_REGISTRY);
};
