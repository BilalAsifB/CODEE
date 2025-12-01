import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import '../styles/CodeDisplay.css';

export default function CodeDisplay({ title, code, type }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`code-display-container code-display-${type}`}>
      <div className="code-display-header">
        <h2 className="code-display-title">{title}</h2>
        <button
          onClick={handleCopy}
          className="copy-button"
          title="Copy to clipboard"
        >
          {copied ? (
            <>
              <Check className="copy-icon" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="copy-icon" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="code-block">
        <code>{code}</code>
      </pre>
    </div>
  );
}