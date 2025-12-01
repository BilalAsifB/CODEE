export const formatCode = (code) => {
  if (!code) return '';
  return code.trim();
};

export const highlightCode = (code, language = 'javascript') => {
  // Basic code formatting
  // For production, use Prism.js or Highlight.js
  return code;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};