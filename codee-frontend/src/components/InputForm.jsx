import React from 'react';
import { Send, Loader } from 'lucide-react';
import '../styles/InputForm.css';

export default function InputForm({
  prompt,
  setPrompt,
  onSubmit,
  onKeyDown,
  loading,
}) {
  return (
    <div className="input-form-container">
      <label htmlFor="prompt-input" className="input-label">
        Describe your coding task
      </label>
      <textarea
        id="prompt-input"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="e.g., Write a Python function to reverse a string..."
        className="prompt-textarea"
        disabled={loading}
        rows="6"
      />
      <div className="input-form-footer">
        <button
          onClick={onSubmit}
          disabled={loading || !prompt.trim()}
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
        <p className="input-hint">Tip: Press Ctrl+Enter to submit</p>
      </div>
    </div>
  );
}