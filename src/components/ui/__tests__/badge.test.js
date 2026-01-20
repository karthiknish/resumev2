import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Badge, badgeVariants } from '../badge';

describe('Badge Component', () => {
  describe('Rendering', () => {
    it('should render a div element by default', () => {
      render(<Badge>New</Badge>);
      const badge = screen.getByText('New');
      expect(badge).toBeInTheDocument();
      expect(badge.tagName).toBe('DIV');
    });

    it('should render children text', () => {
      render(<Badge>Featured</Badge>);
      expect(screen.getByText('Featured')).toHaveTextContent('Featured');
    });

    it('should render with custom className', () => {
      render(<Badge className="custom-class">Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef();
      render(<Badge ref={ref}>Ref Badge</Badge>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should spread additional props', () => {
      render(<Badge data-testid="test-badge">Test</Badge>);
      expect(screen.getByTestId('test-badge')).toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should render with default variant', () => {
      render(<Badge variant="default">Default</Badge>);
      expect(screen.getByText('Default')).toHaveClass('bg-primary');
    });

    it('should render with secondary variant', () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      expect(screen.getByText('Secondary')).toHaveClass('bg-secondary');
    });

    it('should render with destructive variant', () => {
      render(<Badge variant="destructive">Destructive</Badge>);
      expect(screen.getByText('Destructive')).toHaveClass('bg-destructive');
    });

    it('should render with outline variant', () => {
      render(<Badge variant="outline">Outline</Badge>);
      expect(screen.getByText('Outline')).toHaveClass('text-foreground');
    });

    it('should render with success variant using semantic color tokens', () => {
      render(<Badge variant="success">Success</Badge>);
      expect(screen.getByText('Success')).toHaveClass('bg-success');
    });

    it('should render with warning variant using semantic color tokens', () => {
      render(<Badge variant="warning">Warning</Badge>);
      expect(screen.getByText('Warning')).toHaveClass('bg-warning');
    });

    it('should render with info variant using semantic color tokens', () => {
      render(<Badge variant="info">Info</Badge>);
      expect(screen.getByText('Info')).toHaveClass('bg-info');
    });

    it('should render with error variant using destructive tokens', () => {
      render(<Badge variant="error">Error</Badge>);
      expect(screen.getByText('Error')).toHaveClass('bg-destructive');
    });
  });

  describe('Design Token Integration', () => {
    it('should use primary color token for default variant', () => {
      render(<Badge variant="default">Primary</Badge>);
      expect(screen.getByText('Primary')).toHaveClass('text-primary-foreground');
    });

    it('should use secondary color token for secondary variant', () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      expect(screen.getByText('Secondary')).toHaveClass('text-secondary-foreground');
    });

    it('should use destructive color token for destructive variant', () => {
      render(<Badge variant="destructive">Destructive</Badge>);
      expect(screen.getByText('Destructive')).toHaveClass('text-destructive-foreground');
    });

    it('should use success color token for success variant', () => {
      render(<Badge variant="success">Success</Badge>);
      expect(screen.getByText('Success')).toHaveClass('text-success-foreground');
    });

    it('should use warning color token for warning variant', () => {
      render(<Badge variant="warning">Warning</Badge>);
      expect(screen.getByText('Warning')).toHaveClass('text-warning-foreground');
    });

    it('should use info color token for info variant', () => {
      render(<Badge variant="info">Info</Badge>);
      expect(screen.getByText('Info')).toHaveClass('text-info-foreground');
    });

    it('should use border-transparent for filled variants', () => {
      render(<Badge variant="success">Success</Badge>);
      expect(screen.getByText('Success')).toHaveClass('border-transparent');
    });

    it('should use focus ring token for focus state', () => {
      render(<Badge variant="default">Focusable</Badge>);
      const badge = screen.getByText('Focusable');
      expect(badge).toHaveClass('focus:ring-ring');
    });
  });

  describe('Styling Classes', () => {
    it('should have inline-flex layout', () => {
      render(<Badge>Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveClass('inline-flex');
    });

    it('should have rounded-full border radius', () => {
      render(<Badge>Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveClass('rounded-full');
    });

    it('should have border class', () => {
      render(<Badge>Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveClass('border');
    });

    it('should have proper padding', () => {
      render(<Badge>Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveClass('px-2.5');
      expect(screen.getByText('Badge')).toHaveClass('py-0.5');
    });

    it('should have text-xs font size', () => {
      render(<Badge>Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveClass('text-xs');
    });

    it('should have font-semibold weight', () => {
      render(<Badge>Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveClass('font-semibold');
    });

    it('should have transition-colors class', () => {
      render(<Badge>Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveClass('transition-colors');
    });
  });

  describe('badgeVariants utility', () => {
    it('should generate correct classes for default variant', () => {
      const classes = badgeVariants({ variant: 'default' });
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('text-primary-foreground');
    });

    it('should generate correct classes for success variant', () => {
      const classes = badgeVariants({ variant: 'success' });
      expect(classes).toContain('bg-success');
      expect(classes).toContain('text-success-foreground');
    });

    it('should generate correct classes for warning variant', () => {
      const classes = badgeVariants({ variant: 'warning' });
      expect(classes).toContain('bg-warning');
      expect(classes).toContain('text-warning-foreground');
    });

    it('should generate correct classes for info variant', () => {
      const classes = badgeVariants({ variant: 'info' });
      expect(classes).toContain('bg-info');
      expect(classes).toContain('text-info-foreground');
    });

    it('should generate correct classes for error variant', () => {
      const classes = badgeVariants({ variant: 'error' });
      expect(classes).toContain('bg-destructive');
      expect(classes).toContain('text-destructive-foreground');
    });

    it('should merge custom className with variant classes', () => {
      const classes = badgeVariants({ variant: 'default', className: 'custom-class' });
      expect(classes).toContain('custom-class');
    });

    it('should include hover states for filled variants', () => {
      const successClasses = badgeVariants({ variant: 'success' });
      expect(successClasses).toContain('hover:bg-success/80');
    });
  });

  describe('Accessibility', () => {
    it('should have visible focus styles using ring token', () => {
      render(<Badge>Focusable</Badge>);
      const badge = screen.getByText('Focusable');
      expect(badge).toHaveClass('focus:ring-2');
    });

    it('should have ring-offset using background token', () => {
      render(<Badge>Focusable</Badge>);
      const badge = screen.getByText('Focusable');
      expect(badge).toHaveClass('focus:ring-offset-2');
    });

    it('should have focus-outline-none for custom ring styles', () => {
      render(<Badge>Focusable</Badge>);
      const badge = screen.getByText('Focusable');
      expect(badge).toHaveClass('focus:outline-none');
    });
  });

  describe('Hover States', () => {
    it('should have hover state for default variant', () => {
      render(<Badge variant="default">Default</Badge>);
      expect(screen.getByText('Default')).toHaveClass('hover:bg-primary/80');
    });

    it('should have hover state for secondary variant', () => {
      render(<Badge variant="secondary">Secondary</Badge>);
      expect(screen.getByText('Secondary')).toHaveClass('hover:bg-secondary/80');
    });

    it('should have hover state for destructive variant', () => {
      render(<Badge variant="destructive">Destructive</Badge>);
      expect(screen.getByText('Destructive')).toHaveClass('hover:bg-destructive/80');
    });
  });
});
