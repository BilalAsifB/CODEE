import React from 'react';
import { AlertCircle } from 'lucide-react';
import '../styles/ErrorMessage.css';

export default function ErrorMessage({ error }) {
  return (
    <div className="error-message-container">
      <AlertCircle className="error-icon" />
      <div className="error-content">
        <p className="error-title">Request Rejected</p>
        <p className="error-text">{error}</p>
      </div>
    </div>
  );
}