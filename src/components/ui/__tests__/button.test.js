import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button, buttonVariants } from '../button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render a button element by default', () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button.tagName).toBe('BUTTON');
    });

    it('should render children text', () => {
      render(<Button>Submit</Button>);
      expect(screen.getByRole('button')).toHaveTextContent('Submit');
    });

    it('should render with custom className', () => {
      render(<Button className="custom-class">Click</Button>);
      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Button disabled>Click</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef();
      render(<Button ref={ref}>Click</Button>);
      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Variants', () => {
    it('should render with default variant', () => {
      render(<Button variant="default">Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-primary');
    });

    it('should render with destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-destructive');
    });

    it('should render with outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole('button')).toHaveClass('border');
    });

    it('should render with secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-secondary');
    });

    it('should render with ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveClass('hover:bg-accent');
    });

    it('should render with link variant', () => {
      render(<Button variant="link">Link</Button>);
      expect(screen.getByRole('button')).toHaveClass('underline-offset-4');
    });

    it('should render with success variant using semantic color tokens', () => {
      render(<Button variant="success">Success</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-success');
    });

    it('should render with warning variant using semantic color tokens', () => {
      render(<Button variant="warning">Warning</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-warning');
    });

    it('should render with info variant using semantic color tokens', () => {
      render(<Button variant="info">Info</Button>);
      expect(screen.getByRole('button')).toHaveClass('bg-info');
    });

    it('should render with ghost-destructive variant', () => {
      render(<Button variant="ghost-destructive">Ghost Destructive</Button>);
      expect(screen.getByRole('button')).toHaveClass('hover:bg-destructive/10');
    });

    it('should render with outline-success variant', () => {
      render(<Button variant="outline-success">Outline Success</Button>);
      expect(screen.getByRole('button')).toHaveClass('border-success');
    });

    it('should render with outline-warning variant', () => {
      render(<Button variant="outline-warning">Outline Warning</Button>);
      expect(screen.getByRole('button')).toHaveClass('border-warning');
    });

    it('should render with outline-info variant', () => {
      render(<Button variant="outline-info">Outline Info</Button>);
      expect(screen.getByRole('button')).toHaveClass('border-info');
    });
  });

  describe('Sizes', () => {
    it('should render with default size', () => {
      render(<Button size="default">Default</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-10');
    });

    it('should render with sm size', () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-9');
    });

    it('should render with lg size', () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole('button')).toHaveClass('h-11');
    });

    it('should render with icon size', () => {
      render(<Button size="icon"><span>Icon</span></Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10', 'w-10');
    });
  });

  describe('Semantic Color Tokens', () => {
    it('should use primary color token for default variant', () => {
      render(<Button variant="default">Primary</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-primary-foreground');
    });

    it('should use destructive color token for destructive variant', () => {
      render(<Button variant="destructive">Destructive</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-destructive-foreground');
    });

    it('should use secondary color token for secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-secondary-foreground');
    });

    it('should use accent color token for hover states', () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole('button')).toHaveClass('hover:text-accent-foreground');
    });

    it('should use success color token for success variant', () => {
      render(<Button variant="success">Success</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-success-foreground');
    });

    it('should use warning color token for warning variant', () => {
      render(<Button variant="warning">Warning</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-warning-foreground');
    });

    it('should use info color token for info variant', () => {
      render(<Button variant="info">Info</Button>);
      expect(screen.getByRole('button')).toHaveClass('text-info-foreground');
    });
  });

  describe('buttonVariants utility', () => {
    it('should generate correct classes for default variant', () => {
      const classes = buttonVariants({ variant: 'default', size: 'default' });
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('text-primary-foreground');
    });

    it('should generate correct classes for success variant', () => {
      const classes = buttonVariants({ variant: 'success', size: 'default' });
      expect(classes).toContain('bg-success');
      expect(classes).toContain('text-success-foreground');
    });

    it('should generate correct classes for warning variant', () => {
      const classes = buttonVariants({ variant: 'warning', size: 'default' });
      expect(classes).toContain('bg-warning');
      expect(classes).toContain('text-warning-foreground');
    });

    it('should generate correct classes for info variant', () => {
      const classes = buttonVariants({ variant: 'info', size: 'default' });
      expect(classes).toContain('bg-info');
      expect(classes).toContain('text-info-foreground');
    });

    it('should merge custom className with variant classes', () => {
      const classes = buttonVariants({ variant: 'default', className: 'custom-class' });
      expect(classes).toContain('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('should have visible focus styles using ring token', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:ring-ring');
    });

    it('should have ring-offset using background token', () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('ring-offset-background');
    });

    it('should have reduced opacity when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toHaveClass('disabled:opacity-50');
    });

    it('should have pointer-events-none when disabled', () => {
      render(<Button disabled>Disabled</Button>);
      expect(screen.getByRole('button')).toHaveClass('disabled:pointer-events-none');
    });
  });
});
