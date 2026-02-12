import React, { useState, useEffect } from 'react';
import { Zap, Brain } from 'lucide-react';
import { getModels, selectModel } from '../services/api';
import '../styles/ModelSelector.css';

export default function ModelSelector() {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('0.5B');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const data = await getModels();
        setModels(data.models);
        setSelectedModel(
          localStorage.getItem('selectedModel') || data.defaults.generation
        );
      } catch (error) {
        console.error('Failed to fetch models:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  const handleModelChange = async (modelType) => {
    try {
      await selectModel(modelType);
      setSelectedModel(modelType);
      localStorage.setItem('selectedModel', modelType);
    } catch (error) {
      console.error('Failed to select model:', error);
    }
  };

  if (loading || models.length === 0) {
    return null;
  }

  return (
    <div className="model-selector">
      <div className="model-selector-label">Model:</div>
      <div className="model-toggle">
        <button
          className={`model-option ${selectedModel === '0.5B' ? 'active' : ''}`}
          onClick={() => handleModelChange('0.5B')}
          title="Fast and efficient for quick code generation"
        >
          <Zap size={16} />
          <span>0.5B</span>
          <span className="model-badge">Fast</span>
        </button>
        <button
          className={`model-option ${selectedModel === '3B' ? 'active' : ''}`}
          onClick={() => handleModelChange('3B')}
          title="Higher quality code with better reasoning"
        >
          <Brain size={16} />
          <span>3B</span>
          <span className="model-badge">Quality</span>
        </button>
      </div>
    </div>
  );
}
