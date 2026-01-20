import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input, inputVariants } from '../input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render an input element by default', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });

    it('should render with default styling classes', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('flex', 'w-full', 'rounded-md', 'border');
    });

    it('should render with custom type prop', () => {
      render(<Input type="email" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render with custom className', () => {
      render(<Input className="custom-class" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef();
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('should pass through additional props', () => {
      render(<Input placeholder="Enter text" data-testid="test-input" />);
      const input = screen.getByTestId('test-input');
      expect(input).toHaveAttribute('placeholder', 'Enter text');
    });

    it('should render with value prop', () => {
      const handleChange = jest.fn();
      render(<Input value="test value" onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('test value');
    });
  });

  describe('Size Variants', () => {
    it('should render with default size', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('h-10');
    });

    it('should render with sm size', () => {
      render(<Input size="sm" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('h-9');
      expect(input).toHaveClass('px-2.5');
      expect(input).toHaveClass('py-1.5');
    });

    it('should render with lg size', () => {
      render(<Input size="lg" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('h-11');
      expect(input).toHaveClass('px-4');
      expect(input).toHaveClass('py-2.5');
    });
  });

  describe('Input State Variants', () => {
    it('should render with default input state', () => {
      render(<Input inputState="default" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-input');
      expect(input).toHaveClass('focus-visible:border-ring');
    });

    it('should render with error state using destructive tokens', () => {
      render(<Input inputState="error" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-destructive');
      expect(input).toHaveClass('focus-visible:border-destructive');
      expect(input).toHaveClass('focus-visible:ring-destructive');
    });

    it('should render with success state using success tokens', () => {
      render(<Input inputState="success" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-success');
      expect(input).toHaveClass('focus-visible:border-success');
      expect(input).toHaveClass('focus-visible:ring-success');
    });

    it('should render with warning state using warning tokens', () => {
      render(<Input inputState="warning" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-warning');
      expect(input).toHaveClass('focus-visible:border-warning');
      expect(input).toHaveClass('focus-visible:ring-warning');
    });
  });

  describe('Design Token Integration', () => {
    it('should use ring-offset-background token for focus offset', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('ring-offset-background');
    });

    it('should use ring-ring token for focus ring color', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('focus-visible:ring-ring');
    });

    it('should use background token for input background', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('bg-background');
    });

    it('should use muted-foreground token for placeholder', () => {
      render(<Input placeholder="Placeholder" />);
      expect(screen.getByRole('textbox')).toHaveClass('placeholder:text-muted-foreground');
    });

    it('should use foreground token for file input text', () => {
      const { container } = render(<Input type="file" />);
      const input = container.querySelector('input[type="file"]');
      expect(input).toHaveClass('file:text-foreground');
    });
  });

  describe('Focus Ring Styling', () => {
    it('should have visible focus styles using ring token', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus-visible:ring-2');
      expect(input).toHaveClass('focus-visible:ring-ring');
    });

    it('should have ring-offset-2 for focus ring spacing', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('focus-visible:ring-offset-2');
    });

    it('should have outline-none for custom focus styles', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('focus-visible:outline-none');
    });
  });

  describe('File Input Styling', () => {
    it('should have file input specific classes', () => {
      const { container } = render(<Input type="file" />);
      const input = container.querySelector('input[type="file"]');
      expect(input).toHaveClass('file:border-0');
      expect(input).toHaveClass('file:bg-transparent');
      expect(input).toHaveClass('file:text-sm');
      expect(input).toHaveClass('file:font-medium');
    });
  });

  describe('Disabled State', () => {
    it('should have reduced opacity when disabled', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toHaveClass('disabled:opacity-50');
    });

    it('should have not-allowed cursor when disabled', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toHaveClass('disabled:cursor-not-allowed');
    });
  });

  describe('Responsive Typography', () => {
    it('should have text-base on mobile', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('text-base');
    });

    it('should have text-sm on medium screens and above', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('md:text-sm');
    });
  });

  describe('inputVariants utility', () => {
    it('should generate correct classes for default size and state', () => {
      const classes = inputVariants({ size: 'default', inputState: 'default' });
      expect(classes).toContain('h-10');
      expect(classes).toContain('border-input');
    });

    it('should generate correct classes for sm size', () => {
      const classes = inputVariants({ size: 'sm', inputState: 'default' });
      expect(classes).toContain('h-9');
      expect(classes).toContain('px-2.5');
    });

    it('should generate correct classes for lg size', () => {
      const classes = inputVariants({ size: 'lg', inputState: 'default' });
      expect(classes).toContain('h-11');
      expect(classes).toContain('px-4');
    });

    it('should generate correct classes for error state', () => {
      const classes = inputVariants({ size: 'default', inputState: 'error' });
      expect(classes).toContain('border-destructive');
      expect(classes).toContain('focus-visible:ring-destructive');
    });

    it('should generate correct classes for success state', () => {
      const classes = inputVariants({ size: 'default', inputState: 'success' });
      expect(classes).toContain('border-success');
      expect(classes).toContain('focus-visible:ring-success');
    });

    it('should generate correct classes for warning state', () => {
      const classes = inputVariants({ size: 'default', inputState: 'warning' });
      expect(classes).toContain('border-warning');
      expect(classes).toContain('focus-visible:ring-warning');
    });

    it('should merge size and state variants correctly', () => {
      const classes = inputVariants({ size: 'sm', inputState: 'error' });
      expect(classes).toContain('h-9');
      expect(classes).toContain('border-destructive');
    });

    it('should include focus ring classes in utility output', () => {
      const classes = inputVariants({ size: 'default', inputState: 'default' });
      expect(classes).toContain('focus-visible:ring-2');
      expect(classes).toContain('focus-visible:ring-ring');
    });
  });

  describe('Accessibility', () => {
    it('should have visible focus ring for keyboard navigation', () => {
      render(<Input />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus-visible:ring-2');
      expect(input).toHaveClass('focus-visible:ring-offset-2');
    });

    it('should be properly labeled when used with aria-label', () => {
      render(<Input aria-label="Email input" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-label', 'Email input');
    });

    it('should be properly described when used with aria-describedby', () => {
      render(<Input aria-describedby="error-message" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'error-message');
    });

    it('should be invalid when aria-invalid is true', () => {
      render(<Input aria-invalid="true" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('Border Radius', () => {
    it('should use rounded-md class for border radius', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('rounded-md');
    });

    it('should maintain rounded-md when size variants change', () => {
      render(<Input size="lg" />);
      expect(screen.getByRole('textbox')).toHaveClass('rounded-md');
    });
  });

  describe('Flex Layout', () => {
    it('should have flex class for layout', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('flex');
    });

    it('should have w-full for full width', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('w-full');
    });
  });
});
