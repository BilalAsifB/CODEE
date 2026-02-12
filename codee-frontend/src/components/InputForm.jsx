import React from 'react';
import { Send, Loader, CheckCircle, AlertCircle, Info } from 'lucide-react';
import '../styles/InputForm.css';

export default function InputForm({
  prompt,
  setPrompt,
  onSubmit,
  onKeyDown,
  loading,
  validationResult,
  isValidating,
}) {
  const getValidationIcon = () => {
    if (isValidating) {
      return <Loader className="validation-icon spinning" size={16} />;
    }
    if (!validationResult) {
      return null;
    }
    if (validationResult.valid) {
      return <CheckCircle className="validation-icon success" size={16} />;
    }
    return <AlertCircle className="validation-icon error" size={16} />;
  };

  const getValidationMessage = () => {
    if (!validationResult || prompt.trim().length === 0) {
      return null;
    }

    if (validationResult.valid) {
      return (
        <div className="validation-message success">
          <CheckCircle size={14} />
          <span>{validationResult.suggestion}</span>
        </div>
      );
    }

    const lengthCheck = validationResult.checks?.length;
    const injectionCheck = validationResult.checks?.injection;

    return (
      <div className="validation-message error">
        <AlertCircle size={14} />
        <div className="validation-details">
          {lengthCheck && !lengthCheck.valid && (
            <span>{lengthCheck.message}</span>
          )}
          {injectionCheck && !injectionCheck.safe && (
            <span>{injectionCheck.reason}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="input-form-container">
      <div className="input-label-row">
        <label htmlFor="prompt-input" className="input-label">
          Describe your coding task
        </label>
        {getValidationIcon()}
      </div>
      <textarea
        id="prompt-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="e.g., Write a Python function to reverse a string..."
        className={`prompt-textarea ${validationResult && !validationResult.valid ? 'invalid' : ''}`}
        disabled={loading}
        rows="6"
      />
      {getValidationMessage()}
      <div className="input-form-footer">
        <div className="character-count">
          <Info size={14} />
          <span>{prompt.length} / 5000 characters</span>
        </div>
        <button
          onClick={onSubmit}
          disabled={loading || !prompt.trim() || (validationResult && !validationResult.valid)}
          className="submit-button"
        >
          {loading ? (
            <>
              <Loader className="button-icon spinning" />
              Processing...
            </>
          ) : (
            <>
              <Send className="button-icon" />
              Generate Code
            </>
          )}
        </button>
      </div>
      <p className="input-hint">Tip: Press Ctrl+Enter to submit</p>
    </div>
  );
}