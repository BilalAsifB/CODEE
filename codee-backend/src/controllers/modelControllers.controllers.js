import { getAllModels, setUserModel, getUserModel, MODEL_TYPES } from '../services/modelRegistry.js';

export const getModelsHandler = async (req, res) => {
  try {
    const models = getAllModels();
    const currentModel = getUserModel();
    
    res.status(200).json({
      models,
      current: currentModel,
      defaults: {
        generation: MODEL_TYPES.SMALL,
        critic: MODEL_TYPES.LARGE,
      },
    });
  } catch (error) {
    console.error('Get models error:', error.message);
    res.status(500).json({ error: 'Failed to retrieve models' });
  }
};

export const selectModelHandler = async (req, res) => {
  const { modelType } = req.body;

  try {
    if (!modelType) {
      return res.status(400).json({ error: 'modelType is required' });
    }

    const selectedModel = setUserModel(modelType);
    
    res.status(200).json({
      message: 'Model selected successfully',
      model: selectedModel,
    });
  } catch (error) {
    console.error('Model selection error:', error.message);
    res.status(400).json({ error: error.message });
  }
};
