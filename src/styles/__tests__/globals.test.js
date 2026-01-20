/**
 * Tests for globals.css
 * Validates that the globals.css file properly imports theme tokens
 * and does not contain commented theme class definitions
 */

import fs from 'fs';
import path from 'path';

// Read the globals.css file
const globalsPath = path.resolve(__dirname, '../globals.css');
const globalsContent = fs.readFileSync(globalsPath, 'utf-8');

// Read the tokens.css file for comparison
const tokensPath = path.resolve(__dirname, '../theme/tokens.css');

describe('globals.css', () => {
  describe('File Structure', () => {
    it('globals.css file exists', () => {
      expect(fs.existsSync(globalsPath)).toBe(true);
    });

    it('imports theme tokens file', () => {
      expect(globalsContent).toContain('@import');
      expect(globalsContent).toContain('./theme/tokens.css');
    });

    it('imports theme tokens near the top of the file', () => {
      // The import should be in the first 10 lines
      const lines = globalsContent.split('\n');
      const importLineIndex = lines.findIndex(line =>
        line.includes('./theme/tokens.css')
      );
      expect(importLineIndex).toBeGreaterThanOrEqual(0);
      expect(importLineIndex).toBeLessThan(10);
    });
  });

  describe('Theme Class Cleanup', () => {
    it('does not contain commented theme class definitions', () => {
      // These commented theme definitions should be removed
      const commentedThemes = [
        '.theme-dark-hacker',
        '.theme-minimal',
        '.theme-playful',
        '.theme-neon-cyberpunk',
        '.theme-studio-ghibli',
        'Theme Definitions',
        'REMOVE ALL THEME CLASS DEFINITIONS',
      ];

      commentedThemes.forEach(theme => {
        expect(globalsContent).not.toContain(theme);
      });
    });

    it('does not have multi-line comment blocks for theme definitions', () => {
      // Check for the specific pattern that was removed
      expect(globalsContent).not.toMatch(/\/\*.*\.theme-.*\*\//s);
    });
  });

  describe('Required Imports', () => {
    it('imports tailwindcss', () => {
      expect(globalsContent).toContain('@import "tailwindcss"');
    });

    it('imports tailwindcss typography plugin', () => {
      expect(globalsContent).toContain('@plugin "@tailwindcss/typography"');
    });

    it('imports tailwindcss animate plugin', () => {
      expect(globalsContent).toContain('@plugin "tailwindcss-animate"');
    });
  });

  describe('CSS Layers', () => {
    it('contains @layer base', () => {
      expect(globalsContent).toContain('@layer base');
    });

    it('contains @layer utilities', () => {
      expect(globalsContent).toContain('@layer utilities');
    });

    it('contains @layer components', () => {
      expect(globalsContent).toContain('@layer components');
    });
  });

  describe('Base Styles', () => {
    it('defines body styles', () => {
      expect(globalsContent).toContain('body');
    });

    it('defines :root styles', () => {
      expect(globalsContent).toContain(':root');
    });

    it('has heading styles', () => {
      expect(globalsContent).toContain('h1');
      expect(globalsContent).toContain('h2');
      expect(globalsContent).toContain('h3');
    });
  });

  describe('Custom Utilities', () => {
    it('defines form-input utility', () => {
      expect(globalsContent).toContain('.form-input');
    });

    it('defines section padding utilities', () => {
      expect(globalsContent).toContain('.section-padding-sm');
      expect(globalsContent).toContain('.section-padding-md');
      expect(globalsContent).toContain('.section-padding-lg');
    });

    it('defines container width variants', () => {
      expect(globalsContent).toContain('.container-sm');
      expect(globalsContent).toContain('.container-md');
      expect(globalsContent).toContain('.container-lg');
    });
  });

  describe('Editor Styles', () => {
    it('defines ProseMirror table styles', () => {
      expect(globalsContent).toContain('.ProseMirror table');
    });

    it('defines ProseMirror code block styles', () => {
      expect(globalsContent).toContain('.ProseMirror pre');
      expect(globalsContent).toContain('.ProseMirror code');
    });

    it('defines prose typography overrides', () => {
      expect(globalsContent).toContain('.prose :where(strong)');
    });
  });

  describe('Accessibility', () => {
    it('includes reduced motion media query', () => {
      expect(globalsContent).toContain('@media (prefers-reduced-motion: reduce)');
    });

    it('includes reduced motion styles', () => {
      expect(globalsContent).toContain('animation-duration: 0.01ms');
      expect(globalsContent).toContain('transition-duration: 0.01ms');
    });
  });

  describe('Token Integration', () => {
    it('uses CSS custom properties from tokens', () => {
      // Check that globals.css references tokens from tokens.css
      expect(globalsContent).toMatch(/var\(--[\w-]+\)/);
    });

    it('references color tokens', () => {
      expect(globalsContent).toContain('var(--background)');
      expect(globalsContent).toContain('var(--foreground)');
    });
  });
});
