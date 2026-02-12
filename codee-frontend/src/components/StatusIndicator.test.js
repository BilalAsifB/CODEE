import { render, screen } from '@testing-library/react';
import StatusIndicator from './StatusIndicator';

describe('StatusIndicator Component', () => {
  test('renders all three stages', () => {
    render(<StatusIndicator stage="validation" />);
    
    expect(screen.getByText('Validating request...')).toBeInTheDocument();
    expect(screen.getByText('Generating code...')).toBeInTheDocument();
    expect(screen.getByText('Applying improvements...')).toBeInTheDocument();
  });

  test('highlights validation stage when active', () => {
    const { container } = render(<StatusIndicator stage="validation" />);
    
    const statusItems = container.querySelectorAll('.status-item');
    expect(statusItems[0]).toHaveClass('active');
    expect(statusItems[1]).toHaveClass('inactive');
    expect(statusItems[2]).toHaveClass('inactive');
  });

  test('highlights generation stage when active', () => {
    const { container } = render(<StatusIndicator stage="generation" />);
    
    const statusItems = container.querySelectorAll('.status-item');
    expect(statusItems[0]).toHaveClass('inactive');
    expect(statusItems[1]).toHaveClass('active');
    expect(statusItems[2]).toHaveClass('inactive');
  });

  test('highlights criticism stage when active', () => {
    const { container } = render(<StatusIndicator stage="criticism" />);
    
    const statusItems = container.querySelectorAll('.status-item');
    expect(statusItems[0]).toHaveClass('inactive');
    expect(statusItems[1]).toHaveClass('inactive');
    expect(statusItems[2]).toHaveClass('active');
  });

  test('shows loader icon for active stage', () => {
    const { container } = render(<StatusIndicator stage="generation" />);
    
    const loaders = container.querySelectorAll('.status-loader');
    expect(loaders).toHaveLength(1);
  });

  test('shows check icons for inactive stages', () => {
    const { container } = render(<StatusIndicator stage="generation" />);
    
    const checks = container.querySelectorAll('.status-check');
    expect(checks).toHaveLength(2);
  });

  test('handles empty stage prop', () => {
    const { container } = render(<StatusIndicator stage="" />);
    
    const statusItems = container.querySelectorAll('.status-item');
    statusItems.forEach(item => {
      expect(item).toHaveClass('inactive');
    });
  });
});
