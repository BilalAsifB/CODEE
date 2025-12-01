import React, { useState } from 'react';
import { Send, Loader, AlertCircle, CheckCircle, Copy, Check } from 'lucide-react';
import InputForm from './InputForm';
import CodeDisplay from './CodeDisplay';
import StatusIndicator from './StatusIndicator';
import ErrorMessage from './ErrorMessage';
import { generateCode } from '../services/api';
import '../styles/CodingAssistant.css';

export default function CodingAssistant() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [stage, setStage] = useState('');

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setStage('validation');

    try {
      setStage('generation');
      const data = await generateCode(prompt);
      setResult(data);
      setStage('');
    } catch (err) {
      setError(err.message || 'Failed to generate code');
      setStage('');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="coding-assistant-container">
      <div className="coding-assistant-wrapper">
        {/* Header */}
        <div className="assistant-header">
          <h1 className="assistant-title">AI Coding Assistant</h1>
          <p className="assistant-subtitle">
            Powered by Qwen 2.5 3B Coder with Safety Guardrails
          </p>
        </div>

        {/* Main Content */}
        <div className="assistant-content">
          {/* Input Form */}
          <InputForm
            prompt={prompt}
            setPrompt={setPrompt}
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            loading={loading}
          />

          {/* Status Messages */}
          {loading && <StatusIndicator stage={stage} />}

          {/* Error Message */}
          {error && <ErrorMessage error={error} />}

          {/* Results */}
          {result && (
            <div className="results-container">
              <CodeDisplay
                title="Generated Code"
                code={result.generated_code}
                type="generated"
              />

              {result.improved_code && (
                <>
                  <CodeDisplay
                    title="Improved Code"
                    code={result.improved_code}
                    type="improved"
                  />
                  {result.improvements && (
                    <div className="improvements-section">
                      <h3 className="improvements-title">
                        <CheckCircle className="improvements-icon" />
                        Improvements Made
                      </h3>
                      <p className="improvements-text">{result.improvements}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}