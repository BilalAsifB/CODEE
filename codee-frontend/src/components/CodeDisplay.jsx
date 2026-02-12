import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '../styles/CodeDisplay.css';

const detectLanguage = (code) => {
  if (code.includes('def ') || code.includes('import ')) return 'python';
  if (code.includes('function ') || code.includes('const ') || code.includes('let ')) return 'javascript';
  if (code.includes('public class') || code.includes('System.out')) return 'java';
  if (code.includes('#include') || code.includes('int main')) return 'cpp';
  if (code.includes('fn ') || code.includes('let mut')) return 'rust';
  if (code.includes('func ') || code.includes('package main')) return 'go';
  return 'javascript';
};

export default function CodeDisplay({ title, code, type }) {
  const [copied, setCopied] = useState(false);
  const language = detectLanguage(code);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const customStyle = {
    background: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.6',
  };

  return (
    <div className={`code-display-container code-display-${type}`}>
      <div className="code-display-header">
        <h2 className="code-display-title">{title}</h2>
        <div className="code-header-actions">
          <span className="language-badge">{language.toUpperCase()}</span>
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
      </div>
      <div className="code-wrapper">
        <SyntaxHighlighter
          language={language}
          style={atomDark}
          customStyle={customStyle}
          showLineNumbers
          wrapLines
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}