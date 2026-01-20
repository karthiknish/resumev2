import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants
} from '../card';

describe('Card Component', () => {
  describe('Rendering', () => {
    it('should render a div element', () => {
      render(<Card>Card content</Card>);
      const card = screen.getByText('Card content');
      expect(card).toBeInTheDocument();
      expect(card.tagName).toBe('DIV');
    });

    it('should render children text', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toHaveTextContent('Card content');
    });

    it('should render with custom className', () => {
      render(<Card className="custom-class">Card</Card>);
      const card = screen.getByText('Card');
      expect(card).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef();
      render(<Card ref={ref}>Card</Card>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should have default card styling classes', () => {
      render(<Card>Card</Card>);
      const card = screen.getByText('Card');
      expect(card).toHaveClass('rounded-lg');
      expect(card).toHaveClass('border');
      expect(card).toHaveClass('bg-card');
      expect(card).toHaveClass('text-card-foreground');
    });
  });

  describe('Elevation Variants', () => {
    it('should render with flat elevation (no shadow)', () => {
      render(<Card elevation="flat">Flat Card</Card>);
      const card = screen.getByText('Flat Card');
      expect(card).toHaveClass('shadow-[var(--shadow-card-flat)]');
    });

    it('should render with raised elevation (small shadow)', () => {
      render(<Card elevation="raised">Raised Card</Card>);
      const card = screen.getByText('Raised Card');
      expect(card).toHaveClass('shadow-[var(--shadow-card-raised)]');
    });

    it('should render with elevated elevation (medium shadow)', () => {
      render(<Card elevation="elevated">Elevated Card</Card>);
      const card = screen.getByText('Elevated Card');
      expect(card).toHaveClass('shadow-[var(--shadow-card-elevated)]');
    });

    it('should render with floating elevation (large shadow)', () => {
      render(<Card elevation="floating">Floating Card</Card>);
      const card = screen.getByText('Floating Card');
      expect(card).toHaveClass('shadow-[var(--shadow-card-floating)]');
    });

    it('should render with overlay elevation (extra large shadow)', () => {
      render(<Card elevation="overlay">Overlay Card</Card>);
      const card = screen.getByText('Overlay Card');
      expect(card).toHaveClass('shadow-[var(--shadow-card-overlay)]');
    });

    it('should use raised elevation as default', () => {
      render(<Card>Default Card</Card>);
      const card = screen.getByText('Default Card');
      expect(card).toHaveClass('shadow-[var(--shadow-card-raised)]');
    });
  });

  describe('Design Token Integration', () => {
    it('should use card color token for background', () => {
      render(<Card>Card</Card>);
      expect(screen.getByText('Card')).toHaveClass('bg-card');
    });

    it('should use card-foreground color token for text', () => {
      render(<Card>Card</Card>);
      expect(screen.getByText('Card')).toHaveClass('text-card-foreground');
    });

    it('should use shadow-card-flat token for flat variant', () => {
      const classes = cardVariants({ elevation: 'flat' });
      expect(classes).toContain('shadow-[var(--shadow-card-flat)]');
    });

    it('should use shadow-card-raised token for raised variant', () => {
      const classes = cardVariants({ elevation: 'raised' });
      expect(classes).toContain('shadow-[var(--shadow-card-raised)]');
    });

    it('should use shadow-card-elevated token for elevated variant', () => {
      const classes = cardVariants({ elevation: 'elevated' });
      expect(classes).toContain('shadow-[var(--shadow-card-elevated)]');
    });

    it('should use shadow-card-floating token for floating variant', () => {
      const classes = cardVariants({ elevation: 'floating' });
      expect(classes).toContain('shadow-[var(--shadow-card-floating)]');
    });

    it('should use shadow-card-overlay token for overlay variant', () => {
      const classes = cardVariants({ elevation: 'overlay' });
      expect(classes).toContain('shadow-[var(--shadow-card-overlay)]');
    });
  });

  describe('Card Subcomponents', () => {
    it('should render CardHeader with correct classes', () => {
      render(<CardHeader>Header</CardHeader>);
      const header = screen.getByText('Header');
      expect(header).toHaveClass('flex');
      expect(header).toHaveClass('flex-col');
      expect(header).toHaveClass('space-y-1.5');
      expect(header).toHaveClass('p-6');
    });

    it('should render CardTitle with correct classes', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByText('Title');
      expect(title).toHaveClass('text-2xl');
      expect(title).toHaveClass('font-semibold');
      expect(title).toHaveClass('leading-none');
      expect(title).toHaveClass('tracking-tight');
    });

    it('should render CardDescription with correct classes', () => {
      render(<CardDescription>Description</CardDescription>);
      const description = screen.getByText('Description');
      expect(description).toHaveClass('text-sm');
      expect(description).toHaveClass('text-muted-foreground');
    });

    it('should render CardContent with correct classes', () => {
      render(<CardContent>Content</CardContent>);
      const content = screen.getByText('Content');
      expect(content).toHaveClass('p-6');
      expect(content).toHaveClass('pt-0');
    });

    it('should render CardFooter with correct classes', () => {
      render(<CardFooter>Footer</CardFooter>);
      const footer = screen.getByText('Footer');
      expect(footer).toHaveClass('flex');
      expect(footer).toHaveClass('items-center');
      expect(footer).toHaveClass('p-6');
      expect(footer).toHaveClass('pt-0');
    });
  });

  describe('Card Subcomponents with Custom Classes', () => {
    it('should merge custom className with CardHeader classes', () => {
      render(<CardHeader className="custom-header">Header</CardHeader>);
      expect(screen.getByText('Header')).toHaveClass('custom-header');
    });

    it('should merge custom className with CardTitle classes', () => {
      render(<CardTitle className="custom-title">Title</CardTitle>);
      expect(screen.getByText('Title')).toHaveClass('custom-title');
    });

    it('should merge custom className with CardDescription classes', () => {
      render(<CardDescription className="custom-description">Description</CardDescription>);
      expect(screen.getByText('Description')).toHaveClass('custom-description');
    });

    it('should merge custom className with CardContent classes', () => {
      render(<CardContent className="custom-content">Content</CardContent>);
      expect(screen.getByText('Content')).toHaveClass('custom-content');
    });

    it('should merge custom className with CardFooter classes', () => {
      render(<CardFooter className="custom-footer">Footer</CardFooter>);
      expect(screen.getByText('Footer')).toHaveClass('custom-footer');
    });
  });

  describe('Card Subcomponents Ref Forwarding', () => {
    it('should forward ref for CardHeader', () => {
      const ref = React.createRef();
      render(<CardHeader ref={ref}>Header</CardHeader>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should forward ref for CardTitle', () => {
      const ref = React.createRef();
      render(<CardTitle ref={ref}>Title</CardTitle>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should forward ref for CardDescription', () => {
      const ref = React.createRef();
      render(<CardDescription ref={ref}>Description</CardDescription>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should forward ref for CardContent', () => {
      const ref = React.createRef();
      render(<CardContent ref={ref}>Content</CardContent>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should forward ref for CardFooter', () => {
      const ref = React.createRef();
      render(<CardFooter ref={ref}>Footer</CardFooter>);
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('Complete Card Structure', () => {
    it('should render a complete card with all subcomponents', () => {
      render(
        <Card elevation="elevated">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Card Content</CardContent>
          <CardFooter>Card Footer</CardFooter>
        </Card>
      );

      expect(screen.getByText('Card Title')).toBeInTheDocument();
      expect(screen.getByText('Card Description')).toBeInTheDocument();
      expect(screen.getByText('Card Content')).toBeInTheDocument();
      expect(screen.getByText('Card Footer')).toBeInTheDocument();
    });
  });

  describe('cardVariants utility', () => {
    it('should generate correct classes for flat elevation', () => {
      const classes = cardVariants({ elevation: 'flat' });
      expect(classes).toContain('rounded-lg');
      expect(classes).toContain('border');
      expect(classes).toContain('bg-card');
      expect(classes).toContain('text-card-foreground');
      expect(classes).toContain('shadow-[var(--shadow-card-flat)]');
    });

    it('should generate correct classes for raised elevation', () => {
      const classes = cardVariants({ elevation: 'raised' });
      expect(classes).toContain('shadow-[var(--shadow-card-raised)]');
    });

    it('should generate correct classes for elevated elevation', () => {
      const classes = cardVariants({ elevation: 'elevated' });
      expect(classes).toContain('shadow-[var(--shadow-card-elevated)]');
    });

    it('should generate correct classes for floating elevation', () => {
      const classes = cardVariants({ elevation: 'floating' });
      expect(classes).toContain('shadow-[var(--shadow-card-floating)]');
    });

    it('should generate correct classes for overlay elevation', () => {
      const classes = cardVariants({ elevation: 'overlay' });
      expect(classes).toContain('shadow-[var(--shadow-card-overlay)]');
    });

    it('should use raised elevation as default when no elevation provided', () => {
      const classes = cardVariants({});
      expect(classes).toContain('shadow-[var(--shadow-card-raised)]');
    });

    it('should merge custom className with variant classes', () => {
      const classes = cardVariants({ elevation: 'elevated', className: 'custom-class' });
      expect(classes).toContain('custom-class');
    });
  });

  describe('Accessibility', () => {
    it('should have proper structure for screen readers', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
            <CardDescription>This is a description</CardDescription>
          </CardHeader>
          <CardContent>Content goes here</CardContent>
        </Card>
      );

      const title = screen.getByText('Accessible Card');
      expect(title.tagName).toBe('DIV');
    });
  });
});
