/**
 * Tests for Design Tokens
 * Validates that the tokens CSS file exists and contains expected tokens
 */

import fs from 'fs';
import path from 'path';

// Read the tokens CSS file
const tokensPath = path.resolve(__dirname, '../tokens.css');
const tokensContent = fs.readFileSync(tokensPath, 'utf-8');

describe('Design Tokens', () => {
  describe('File Structure', () => {
    it('tokens.css file exists', () => {
      expect(fs.existsSync(tokensPath)).toBe(true);
    });

    it('contains :root selector', () => {
      expect(tokensContent).toContain(':root');
    });

    it('uses CSS custom properties syntax', () => {
      expect(tokensContent).toMatch(/--[\w-]+:/);
    });
  });

  describe('Color Tokens', () => {
    it('defines base color tokens', () => {
      const baseColors = [
        '--color-white',
        '--color-black',
      ];

      baseColors.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines semantic color tokens for light mode', () => {
      const semanticColors = [
        '--color-background',
        '--color-foreground',
        '--color-card',
        '--color-card-foreground',
        '--color-popover',
        '--color-popover-foreground',
      ];

      semanticColors.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines primary color tokens', () => {
      const primaryColors = [
        '--color-primary',
        '--color-primary-foreground',
      ];

      primaryColors.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines secondary color tokens', () => {
      const secondaryColors = [
        '--color-secondary',
        '--color-secondary-foreground',
        '--color-brand-secondary',
        '--color-brand-secondary-foreground',
      ];

      secondaryColors.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines status color tokens', () => {
      const statusColors = [
        '--color-destructive',
        '--color-destructive-foreground',
        '--color-success',
        '--color-success-foreground',
        '--color-warning',
        '--color-warning-foreground',
        '--color-info',
        '--color-info-foreground',
      ];

      statusColors.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines border and input color tokens', () => {
      const borderColors = [
        '--color-border',
        '--color-input',
        '--color-ring',
      ];

      borderColors.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });
  });

  describe('Typography Tokens', () => {
    it('defines font family tokens', () => {
      const fontFamilies = [
        '--font-family-sans',
        '--font-family-serif',
        '--font-family-mono',
        '--font-family-calendas',
      ];

      fontFamilies.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines font size tokens', () => {
      const fontSizes = [
        '--font-size-xs',
        '--font-size-sm',
        '--font-size-base',
        '--font-size-lg',
        '--font-size-xl',
        '--font-size-2xl',
        '--font-size-3xl',
        '--font-size-4xl',
        '--font-size-5xl',
      ];

      fontSizes.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines font weight tokens', () => {
      const fontWeights = [
        '--font-weight-normal',
        '--font-weight-medium',
        '--font-weight-semibold',
        '--font-weight-bold',
        '--font-weight-extrabold',
      ];

      fontWeights.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines line height tokens', () => {
      const lineHeights = [
        '--line-height-tight',
        '--line-height-normal',
        '--line-height-relaxed',
        '--line-height-loose',
      ];

      lineHeights.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines letter spacing tokens', () => {
      const letterSpacings = [
        '--letter-spacing-tight',
        '--letter-spacing-normal',
        '--letter-spacing-wide',
      ];

      letterSpacings.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });
  });

  describe('Spacing Tokens', () => {
    it('defines base spacing tokens', () => {
      const spacingTokens = [
        '--spacing-0',
        '--spacing-px',
        '--spacing-0-5',
        '--spacing-1',
        '--spacing-2',
        '--spacing-3',
        '--spacing-4',
        '--spacing-5',
        '--spacing-6',
        '--spacing-8',
        '--spacing-10',
        '--spacing-12',
        '--spacing-16',
        '--spacing-20',
        '--spacing-24',
        '--spacing-32',
        '--spacing-40',
        '--spacing-48',
        '--spacing-56',
        '--spacing-64',
      ];

      spacingTokens.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines container padding tokens', () => {
      const containerPaddings = [
        '--container-padding-sm',
        '--container-padding-md',
        '--container-padding-lg',
      ];

      containerPaddings.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines section padding tokens', () => {
      const sectionPaddings = [
        '--section-padding-sm',
        '--section-padding-md',
        '--section-padding-lg',
      ];

      sectionPaddings.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });
  });

  describe('Border Radius Tokens', () => {
    it('defines all border radius tokens', () => {
      const radiusTokens = [
        '--radius-none',
        '--radius-sm',
        '--radius-md',
        '--radius-lg',
        '--radius-xl',
        '--radius-2xl',
        '--radius-full',
      ];

      radiusTokens.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });
  });

  describe('Shadow Tokens', () => {
    it('defines elevation shadow tokens', () => {
      const elevationShadows = [
        '--shadow-xs',
        '--shadow-sm',
        '--shadow-md',
        '--shadow-lg',
        '--shadow-xl',
        '--shadow-2xl',
        '--shadow-inner',
      ];

      elevationShadows.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines focus ring shadow tokens', () => {
      const ringShadows = [
        '--shadow-ring',
        '--shadow-ring-focus',
      ];

      ringShadows.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines card elevation variant tokens', () => {
      const cardShadows = [
        '--shadow-card-flat',
        '--shadow-card-raised',
        '--shadow-card-elevated',
        '--shadow-card-floating',
        '--shadow-card-overlay',
      ];

      cardShadows.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });
  });

  describe('Z-Index Tokens', () => {
    it('defines z-index layer tokens', () => {
      const zIndexTokens = [
        '--z-index-dropdown',
        '--z-index-sticky',
        '--z-index-fixed',
        '--z-index-modal-backdrop',
        '--z-index-modal',
        '--z-index-popover',
        '--z-index-tooltip',
        '--z-index-toast',
      ];

      zIndexTokens.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });
  });

  describe('Transition Tokens', () => {
    it('defines transition duration tokens', () => {
      const durations = [
        '--transition-fast',
        '--transition-base',
        '--transition-slow',
        '--transition-slower',
      ];

      durations.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines easing function tokens', () => {
      const easings = [
        '--ease-in',
        '--ease-out',
        '--ease-in-out',
        '--ease-bounce',
      ];

      easings.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });
  });

  describe('Layout Tokens', () => {
    it('defines container width tokens', () => {
      const containerWidths = [
        '--container-sm',
        '--container-md',
        '--container-lg',
        '--container-xl',
        '--container-full',
      ];

      containerWidths.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });

    it('defines grid tokens', () => {
      const gridTokens = [
        '--grid-columns',
        '--grid-gap',
        '--grid-gap-lg',
      ];

      gridTokens.forEach(token => {
        expect(tokensContent).toContain(token);
      });
    });
  });

  describe('Token Values', () => {
    it('uses HSL format for color values', () => {
      // Colors should be in HSL format (e.g., "222.2 47.4% 11.2%")
      const hslPattern = /\d+\s+\d+%\s+\d+/;
      const colorLines = tokensContent.match(/--color-[\w-]+:\s*([^;]+);/g) || [];

      // At least some colors should use HSL format
      const hslColors = colorLines.filter(line => hslPattern.test(line));
      expect(hslColors.length).toBeGreaterThan(0);
    });

    it('includes comments for organization', () => {
      expect(tokensContent).toContain('/*');
      expect(tokensContent).toContain('*/');
    });

    it('has proper CSS syntax', () => {
      // Check for proper CSS variable syntax
      const variablePattern = /--[\w-]+:\s*[^;]+;/g;
      const variables = tokensContent.match(variablePattern) || [];
      expect(variables.length).toBeGreaterThan(50); // Should have many tokens
    });
  });
});
