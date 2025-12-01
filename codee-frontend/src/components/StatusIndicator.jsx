import React from 'react';
import { Loader, CheckCircle } from 'lucide-react';
import '../styles/StatusIndicator.css';

export default function StatusIndicator({ stage }) {
  const stages = [
    { key: 'validation', label: 'Validating request...' },
    { key: 'generation', label: 'Generating code...' },
    { key: 'criticism', label: 'Applying improvements...' },
  ];

  return (
    <div className="status-indicator-container">
      {stages.map((s) => (
        <div
          key={s.key}
          className={`status-item ${stage === s.key ? 'active' : 'inactive'}`}
        >
          <div className={`status-icon ${stage === s.key ? 'spinning' : ''}`}>
            {stage === s.key ? (
              <Loader className="status-loader" />
            ) : (
              <CheckCircle className="status-check" />
            )}
          </div>
          <span className="status-label">{s.label}</span>
        </div>
      ))}
    </div>
  );
}