const QWEN_SYSTEM_PROMPT = `You are Qwen, created by Alibaba Cloud. You are a helpful coding assistant that writes clean, efficient, and well-documented code. Follow best practices and provide explanations when helpful.`;

const CRITIC_SYSTEM_PROMPT = `You are an expert code reviewer. Your task is to review code and suggest improvements focusing on: readability, efficiency, error handling, security, and best practices. Provide the improved code and explain the changes made.`;

export const formatQwenPrompt = (userPrompt) => {
  return `<|im_start|>system
${QWEN_SYSTEM_PROMPT}
<|im_end|>
<|im_start|>user
${userPrompt}
<|im_end|>
<|im_start|>assistant`;
};

export const formatCriticPrompt = (code, originalPrompt) => {
  return `<|im_start|>system
${CRITIC_SYSTEM_PROMPT}
<|im_end|>
<|im_start|>user
Original request: ${originalPrompt}

Current code:
\`\`\`
${code}
\`\`\`

Please review this code and provide improvements.
<|im_end|>
<|im_start|>assistant`;
};

export const extractCodeFromResponse = (responseText) => {
  let code = responseText;

  code = code.replace(/<\|im_start\|>system[\s\S]*?<\|im_end\|>/g, '');
  code = code.replace(/<\|im_start\|>user[\s\S]*?<\|im_end\|>/g, '');
  code = code.replace(/<\|im_start\|>assistant/g, '');
  code = code.replace(/<\|im_end\|>/g, '');

  const codeBlockMatch = code.match(/```[\w]*\n([\s\S]*?)\n```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }

  return code.trim();
};

export const extractImprovementsFromResponse = (responseText) => {
  let text = responseText;

  text = text.replace(/<\|im_start\|>[\s\S]*?<\|im_end\|>/g, '');

  const codeBlockMatch = text.match(/```[\w]*\n([\s\S]*?)\n```/);
  const improvedCode = codeBlockMatch ? codeBlockMatch[1].trim() : null;

  let improvements = text;
  if (codeBlockMatch) {
    improvements = text
      .replace(codeBlockMatch[0], '')
      .trim();
  }

  improvements = improvements
    .replace(/^#+\s*/gm, '')
    .replace(/\n\n+/g, '\n')
    .trim();

  if (!improvements || improvements.length === 0) {
    improvements =
      'Code reviewed and enhanced for quality, efficiency, and best practices.';
  }

  return {
    improved_code: improvedCode,
    improvements: improvements.substring(0, 500),
  };
};