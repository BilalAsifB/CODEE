import { render, screen, fireEvent } from '@testing-library/react';
import InputForm from './InputForm';

describe('InputForm Component', () => {
  const mockProps = {
    prompt: '',
    setPrompt: jest.fn(),
    onSubmit: jest.fn(),
    onKeyDown: jest.fn(),
    loading: false,
    validationResult: null,
    isValidating: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders textarea and submit button', () => {
    render(<InputForm {...mockProps} />);
    
    expect(screen.getByLabelText('Describe your coding task')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Generate Code/i })).toBeInTheDocument();
  });

  test('displays character count', () => {
    render(<InputForm {...mockProps} prompt="Hello world" />);
    
    expect(screen.getByText('11 / 5000 characters')).toBeInTheDocument();
  });

  test('calls setPrompt when typing in textarea', () => {
    render(<InputForm {...mockProps} />);
    
    const textarea = screen.getByLabelText('Describe your coding task');
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });
    
    expect(mockProps.setPrompt).toHaveBeenCalledWith('Test prompt');
  });

  test('calls onKeyDown when key is pressed', () => {
    render(<InputForm {...mockProps} />);
    
    const textarea = screen.getByLabelText('Describe your coding task');
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
    
    expect(mockProps.onKeyDown).toHaveBeenCalled();
  });

  test('calls onSubmit when button is clicked', () => {
    render(<InputForm {...mockProps} prompt="Valid prompt" />);
    
    const button = screen.getByRole('button', { name: /Generate Code/i });
    fireEvent.click(button);
    
    expect(mockProps.onSubmit).toHaveBeenCalled();
  });

  test('disables button when loading', () => {
    render(<InputForm {...mockProps} loading={true} prompt="Test" />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('disables button when prompt is empty', () => {
    render(<InputForm {...mockProps} prompt="" />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('disables button when validation fails', () => {
    render(
      <InputForm
        {...mockProps}
        prompt="test"
        validationResult={{ valid: false }}
      />
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  test('shows loading state on button', () => {
    render(<InputForm {...mockProps} loading={true} />);
    
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  test('disables textarea when loading', () => {
    render(<InputForm {...mockProps} loading={true} />);
    
    const textarea = screen.getByLabelText('Describe your coding task');
    expect(textarea).toBeDisabled();
  });

  test('shows validation success icon when valid', () => {
    const { container } = render(
      <InputForm
        {...mockProps}
        prompt="test"
        validationResult={{ valid: true, suggestion: 'Ready to generate' }}
      />
    );
    
    const successIcon = container.querySelector('.validation-icon.success');
    expect(successIcon).toBeInTheDocument();
  });

  test('shows validation error icon when invalid', () => {
    const { container } = render(
      <InputForm
        {...mockProps}
        prompt="test"
        validationResult={{ valid: false }}
      />
    );
    
    const errorIcon = container.querySelector('.validation-icon.error');
    expect(errorIcon).toBeInTheDocument();
  });

  test('shows loading icon when validating', () => {
    const { container } = render(
      <InputForm {...mockProps} isValidating={true} />
    );
    
    const loadingIcon = container.querySelector('.validation-icon.spinning');
    expect(loadingIcon).toBeInTheDocument();
  });

  test('shows success message when validation passes', () => {
    render(
      <InputForm
        {...mockProps}
        prompt="test"
        validationResult={{ valid: true, suggestion: 'Ready to generate' }}
      />
    );
    
    expect(screen.getByText('Ready to generate')).toBeInTheDocument();
  });

  test('shows length error message when prompt is too short', () => {
    render(
      <InputForm
        {...mockProps}
        prompt="test"
        validationResult={{
          valid: false,
          checks: {
            length: { valid: false, message: '6 more characters needed' },
          },
        }}
      />
    );
    
    expect(screen.getByText('6 more characters needed')).toBeInTheDocument();
  });

  test('shows injection error message', () => {
    render(
      <InputForm
        {...mockProps}
        prompt="test"
        validationResult={{
          valid: false,
          checks: {
            injection: { safe: false, reason: 'Unsafe content detected' },
          },
        }}
      />
    );
    
    expect(screen.getByText('Unsafe content detected')).toBeInTheDocument();
  });

  test('adds invalid class to textarea when validation fails', () => {
    render(
      <InputForm
        {...mockProps}
        prompt="test"
        validationResult={{ valid: false }}
      />
    );
    
    const textarea = screen.getByLabelText('Describe your coding task');
    expect(textarea).toHaveClass('invalid');
  });

  test('shows keyboard shortcut hint', () => {
    render(<InputForm {...mockProps} />);
    
    expect(screen.getByText(/Press Ctrl\+Enter to submit/i)).toBeInTheDocument();
  });
});
