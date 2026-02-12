// Mock react-syntax-highlighter
jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }) => <div data-testid="syntax-highlighter">{children}</div>,
}));

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  atomDark: {},
}));

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CODEE title', () => {
  render(<App />);
  const titleElement = screen.getByText(/CODEE/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders coding assistant container', () => {
  render(<App />);
  const container = screen.getByText(/Describe your coding task/i);
  expect(container).toBeInTheDocument();
});
