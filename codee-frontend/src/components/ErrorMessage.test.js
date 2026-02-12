import { render, screen } from '@testing-library/react';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component', () => {
  test('renders error message', () => {
    render(<ErrorMessage error="Test error message" />);
    
    expect(screen.getByText('Request Rejected')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  test('displays alert icon', () => {
    const { container } = render(<ErrorMessage error="Test error" />);
    
    const icon = container.querySelector('.error-icon');
    expect(icon).toBeInTheDocument();
  });

  test('applies correct CSS classes', () => {
    const { container } = render(<ErrorMessage error="Test error" />);
    
    expect(container.querySelector('.error-message-container')).toBeInTheDocument();
    expect(container.querySelector('.error-content')).toBeInTheDocument();
    expect(container.querySelector('.error-title')).toBeInTheDocument();
    expect(container.querySelector('.error-text')).toBeInTheDocument();
  });

  test('renders different error messages correctly', () => {
    const { rerender } = render(<ErrorMessage error="First error" />);
    expect(screen.getByText('First error')).toBeInTheDocument();

    rerender(<ErrorMessage error="Second error" />);
    expect(screen.getByText('Second error')).toBeInTheDocument();
    expect(screen.queryByText('First error')).not.toBeInTheDocument();
  });

  test('handles empty error message', () => {
    render(<ErrorMessage error="" />);
    
    expect(screen.getByText('Request Rejected')).toBeInTheDocument();
    const errorContent = screen.getByText('Request Rejected').closest('.error-message-container');
    expect(errorContent).toBeInTheDocument();
  });
});
