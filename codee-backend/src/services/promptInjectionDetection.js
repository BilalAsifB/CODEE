// Prompt injection attack patterns
export const INJECTION_PATTERNS = [
  // Role manipulation
  /ignore\s+(previous|prior|above|all)\s+instructions?/i,
  /forget\s+(previous|prior|above|all)\s+instructions?/i,
  /disregard\s+(previous|prior|above|all)\s+instructions?/i,
  /you\s+are\s+now/i,
  /new\s+role:/i,
  /act\s+as\s+(?!a\s+(?:developer|programmer|coder))/i,
  
  // System prompt leaking
  /(?:show|print|display|reveal|tell)\s+(?:me\s+)?(?:your|the)\s+(?:system\s+)?(?:prompt|instructions|rules)/i,
  /what\s+(?:are|is)\s+your\s+(?:prompt|instructions|rules)/i,
  /repeat\s+your\s+instructions/i,
  
  // Delimiter injection
  /```system/i,
  /<\|system\|>/i,
  /<\|endoftext\|>/i,
  /\[SYSTEM\]/i,
  /\[INST\]/i,
  
  // Jailbreak attempts
  /DAN\s+mode/i,
  /developer\s+mode/i,
  /jailbreak/i,
  /override\s+(?:safety|ethics)/i,
  /bypass\s+(?:safety|filters|guardrails)/i,
  
  // Encoding tricks (simple detection)
  /(?:base64|hex|unicode)\s*:/i,
  /\\x[0-9a-fA-F]{2}/,
  /\\u[0-9a-fA-F]{4}/,
];

export const ROLE_MANIPULATION_KEYWORDS = [
  'ignore instructions',
  'forget previous',
  'new role',
  'you are now',
  'act as something',
  'pretend to be',
];

export const detectPromptInjection = (text) => {
  const lowerText = text.toLowerCase();
  const detections = [];

  // Check each pattern
  for (const pattern of INJECTION_PATTERNS) {
    const match = pattern.exec(text);
    if (match) {
      detections.push({
        type: 'pattern_match',
        matched: match[0],
        severity: 'high',
      });
    }
  }

  // Check for suspicious quote patterns
  const tripleQuotes = (text.match(/```/g) || []).length;
  if (tripleQuotes >= 4) {
    detections.push({
      type: 'delimiter_injection',
      matched: 'Multiple code block delimiters',
      severity: 'medium',
    });
  }

  // Check for XML/HTML-like tags suspicious patterns
  const suspiciousTags = text.match(/<\|[^>]+\|>/g);
  if (suspiciousTags) {
    detections.push({
      type: 'delimiter_injection',
      matched: suspiciousTags.join(', '),
      severity: 'high',
    });
  }

  // Calculate overall severity
  const hasCritical = detections.some(d => d.severity === 'high');
  const score = detections.length;

  return {
    isInjection: detections.length > 0,
    detections,
    score,
    severity: hasCritical ? 'high' : detections.length > 0 ? 'medium' : 'none',
  };
};

export const validatePromptSafety = (prompt) => {
  const injectionResult = detectPromptInjection(prompt);

  if (injectionResult.isInjection) {
    return {
      safe: false,
      reason: 'Potential prompt injection detected. Please rephrase your request.',
      details: injectionResult,
    };
  }

  return {
    safe: true,
    details: injectionResult,
  };
};
