jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }) => <pre>{children}</pre>,
}));

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  atomDark: {},
}));
