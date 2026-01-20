import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SocialShare, SocialIcons, getShareUrl } from '../SocialShare';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileHover, whileTap, ...props }) => <button {...props}>{children}</button>,
  },
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock navigator.clipboard
const mockClipboard = {
  writeText: jest.fn().mockResolvedValue(undefined),
};

Object.defineProperty(navigator, 'clipboard', {
  writable: true,
  value: mockClipboard,
});

// Mock window.open
global.open = jest.fn();

describe('SocialShare Component', () => {
  const defaultProps = {
    url: 'https://example.com/blog/test-post',
    title: 'Test Blog Post',
    description: 'This is a test blog post',
    hashtags: ['react', 'javascript'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render share buttons container', () => {
      render(<SocialShare {...defaultProps} />);
      const container = screen.getByLabelText(/Share on Twitter/i).closest('div');
      expect(container).toBeInTheDocument();
    });

    it('should render all default platform buttons', () => {
      render(<SocialShare {...defaultProps} />);

      expect(screen.getByLabelText(/Share on Twitter/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Share on Facebook/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Share on LinkedIn/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Copy link/i)).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <SocialShare {...defaultProps} className="custom-class" />
      );
      const shareContainer = container.querySelector('.flex');
      expect(shareContainer).toHaveClass('custom-class');
    });

    it('should use current page URL when no URL is provided', () => {
      delete window.location;
      window.location = { href: 'https://current-page.com' };

      render(<SocialShare title="Test" />);
      // Component should render without errors
      expect(screen.getByLabelText(/Share on Twitter/i)).toBeInTheDocument();
    });
  });

  describe('Size Variants', () => {
    it('should render small size buttons', () => {
      render(<SocialShare {...defaultProps} size="sm" />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      expect(twitterButton).toHaveClass('p-1.5');
    });

    it('should render medium size buttons (default)', () => {
      render(<SocialShare {...defaultProps} size="md" />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      expect(twitterButton).toHaveClass('p-2');
    });

    it('should render large size buttons', () => {
      render(<SocialShare {...defaultProps} size="lg" />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      expect(twitterButton).toHaveClass('p-2.5');
    });
  });

  describe('Variant Styles', () => {
    it('should render default variant style', () => {
      render(<SocialShare {...defaultProps} variant="default" />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      expect(twitterButton).toHaveClass('bg-slate-900');
      expect(twitterButton).toHaveClass('text-white');
    });

    it('should render minimal variant style', () => {
      render(<SocialShare {...defaultProps} variant="minimal" />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      expect(twitterButton).toHaveClass('bg-slate-100');
      expect(twitterButton).toHaveClass('text-slate-700');
    });

    it('should render pill variant style', () => {
      render(<SocialShare {...defaultProps} variant="pill" />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      expect(twitterButton).toHaveClass('rounded-full');
    });
  });

  describe('Share Functionality', () => {
    it('should open Twitter share URL when Twitter button is clicked', () => {
      render(<SocialShare {...defaultProps} />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      fireEvent.click(twitterButton);

      expect(global.open).toHaveBeenCalledWith(
        expect.stringContaining('twitter.com/intent/tweet'),
        '_blank',
        expect.stringContaining('width=600')
      );
      expect(global.open).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent(defaultProps.url)),
        '_blank',
        expect.anything()
      );
    });

    it('should include hashtags in Twitter share URL', () => {
      render(<SocialShare {...defaultProps} hashtags={['react', 'javascript']} />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      fireEvent.click(twitterButton);

      expect(global.open).toHaveBeenCalledWith(
        expect.stringContaining('hashtags=react'),
        '_blank',
        expect.anything()
      );
    });

    it('should open Facebook share URL when Facebook button is clicked', () => {
      render(<SocialShare {...defaultProps} />);
      const facebookButton = screen.getByLabelText(/Share on Facebook/i);
      fireEvent.click(facebookButton);

      expect(global.open).toHaveBeenCalledWith(
        expect.stringContaining('facebook.com/sharer/sharer.php'),
        '_blank',
        expect.anything()
      );
    });

    it('should open LinkedIn share URL when LinkedIn button is clicked', () => {
      render(<SocialShare {...defaultProps} />);
      const linkedinButton = screen.getByLabelText(/Share on LinkedIn/i);
      fireEvent.click(linkedinButton);

      expect(global.open).toHaveBeenCalledWith(
        expect.stringContaining('linkedin.com/sharing/share-offsite/'),
        '_blank',
        expect.anything()
      );
    });
  });

  describe('Copy to Clipboard', () => {
    it('should copy URL to clipboard when copy button is clicked', async () => {
      const { toast } = require('sonner');
      render(<SocialShare {...defaultProps} />);
      const copyButton = screen.getByLabelText(/Copy link/i);
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(mockClipboard.writeText).toHaveBeenCalledWith(defaultProps.url);
        expect(toast.success).toHaveBeenCalledWith('Link copied to clipboard!');
      });
    });

    it('should show error toast when clipboard API is not available', async () => {
      const { toast } = require('sonner');

      // Temporarily remove clipboard
      const originalClipboard = navigator.clipboard;
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        value: undefined,
      });

      render(<SocialShare {...defaultProps} />);
      const copyButton = screen.getByLabelText(/Copy link/i);
      fireEvent.click(copyButton);

      expect(toast.error).toHaveBeenCalledWith('Clipboard not supported');

      // Restore clipboard for other tests
      Object.defineProperty(navigator, 'clipboard', {
        writable: true,
        value: originalClipboard,
      });
    });

    it('should show error toast when clipboard write fails', async () => {
      const { toast } = require('sonner');
      mockClipboard.writeText.mockRejectedValueOnce(new Error('Copy failed'));

      render(<SocialShare {...defaultProps} />);
      const copyButton = screen.getByLabelText(/Copy link/i);
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to copy link');
      });

      // Reset mock for other tests
      mockClipboard.writeText.mockResolvedValue(undefined);
    });
  });

  describe('Native Web Share API', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'share', {
        writable: true,
        value: jest.fn().mockResolvedValue(undefined),
      });
    });

    afterEach(() => {
      Object.defineProperty(navigator, 'share', {
        writable: true,
        value: undefined,
      });
    });

    it('should use native share when available and useNativeShare is true', async () => {
      render(<SocialShare {...defaultProps} useNativeShare={true} />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      fireEvent.click(twitterButton);

      await waitFor(() => {
        expect(navigator.share).toHaveBeenCalledWith({
          title: defaultProps.title,
          text: defaultProps.description,
          url: defaultProps.url,
        });
      });
    });

    it('should not use native share when useNativeShare is false', () => {
      render(<SocialShare {...defaultProps} useNativeShare={false} />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      fireEvent.click(twitterButton);

      expect(navigator.share).not.toHaveBeenCalled();
      expect(global.open).toHaveBeenCalled();
    });

    it('should not use native share for copy button', async () => {
      render(<SocialShare {...defaultProps} useNativeShare={true} />);
      const copyButton = screen.getByLabelText(/Copy link/i);
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(navigator.share).not.toHaveBeenCalled();
        expect(mockClipboard.writeText).toHaveBeenCalled();
      });
    });

    it('should fall back to popup when native share is aborted', async () => {
      const { toast } = require('sonner');

      Object.defineProperty(navigator, 'share', {
        writable: true,
        value: jest.fn()
          .mockRejectedValueOnce({ name: 'AbortError' })
          .mockResolvedValue(undefined),
      });

      render(<SocialShare {...defaultProps} useNativeShare={true} />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      fireEvent.click(twitterButton);

      // First call is aborted, should fall back to window.open
      await waitFor(() => {
        expect(global.open).toHaveBeenCalled();
      });

      // Reset share mock
      Object.defineProperty(navigator, 'share', {
        writable: true,
        value: jest.fn().mockResolvedValue(undefined),
      });
    });
  });

  describe('Show Label Option', () => {
    it('should hide labels by default', () => {
      render(<SocialShare {...defaultProps} showLabel={false} />);
      expect(screen.queryByText('Twitter')).not.toBeInTheDocument();
      expect(screen.queryByText('Facebook')).not.toBeInTheDocument();
    });

    it('should show platform labels when showLabel is true', () => {
      render(<SocialShare {...defaultProps} showLabel={true} />);
      expect(screen.getByText('Twitter')).toBeInTheDocument();
      expect(screen.getByText('Facebook')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('Copy')).toBeInTheDocument();
    });

    it('should show "Copied!" label after successful copy', async () => {
      render(<SocialShare {...defaultProps} showLabel={true} />);
      const copyButton = screen.getByLabelText(/Copy link/i);
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(screen.getByText('Copied!')).toBeInTheDocument();
      });
    });
  });

  describe('onShare Callback', () => {
    it('should call onShare callback with platform name after share', () => {
      const onShare = jest.fn();
      render(<SocialShare {...defaultProps} onShare={onShare} />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      fireEvent.click(twitterButton);

      expect(onShare).toHaveBeenCalledWith('twitter');
    });

    it('should call onShare callback with "copy" after copying to clipboard', async () => {
      const onShare = jest.fn();
      render(<SocialShare {...defaultProps} onShare={onShare} />);
      const copyButton = screen.getByLabelText(/Copy link/i);
      fireEvent.click(copyButton);

      await waitFor(() => {
        expect(onShare).toHaveBeenCalledWith('copy');
      });
    });

    it('should call onShare callback with "native" after native share', async () => {
      const onShare = jest.fn();

      Object.defineProperty(navigator, 'share', {
        writable: true,
        value: jest.fn().mockResolvedValue(undefined),
      });

      render(<SocialShare {...defaultProps} useNativeShare={true} onShare={onShare} />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      fireEvent.click(twitterButton);

      await waitFor(() => {
        expect(onShare).toHaveBeenCalledWith('native');
      });

      Object.defineProperty(navigator, 'share', {
        writable: true,
        value: undefined,
      });
    });
  });

  describe('SocialIcons Export', () => {
    it('should export social icons object', () => {
      expect(SocialIcons).toBeDefined();
      expect(SocialIcons.twitter).toBeDefined();
      expect(SocialIcons.facebook).toBeDefined();
      expect(SocialIcons.linkedin).toBeDefined();
      // Note: 'copy' and 'native' are not in staticIcons as they are dynamic/use lucide-react
    });

    it('should export all expected static platform icons', () => {
      const expectedPlatforms = [
        'twitter', 'x', 'facebook', 'linkedin', 'whatsapp',
        'email', 'reddit', 'pinterest', 'native'
      ];

      expectedPlatforms.forEach(platform => {
        expect(SocialIcons[platform]).toBeDefined();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-labels on all buttons', () => {
      render(<SocialShare {...defaultProps} />);

      expect(screen.getByLabelText(/Share on Twitter/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Share on Facebook/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Share on LinkedIn/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Copy link/i)).toBeInTheDocument();
    });

    it('should have title attributes on buttons when labels are hidden', () => {
      render(<SocialShare {...defaultProps} showLabel={false} />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      expect(twitterButton).toHaveAttribute('title', 'Twitter');
    });

    it('should not have title attributes when labels are shown', () => {
      render(<SocialShare {...defaultProps} showLabel={true} />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      expect(twitterButton).not.toHaveAttribute('title');
    });
  });

  describe('Share URL Generation', () => {
    it('should properly encode URL in share links', () => {
      const urlWithSpecialChars = 'https://example.com/blog?param=value&other=123';
      render(<SocialShare {...defaultProps} url={urlWithSpecialChars} />);
      const facebookButton = screen.getByLabelText(/Share on Facebook/i);
      fireEvent.click(facebookButton);

      expect(global.open).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent(urlWithSpecialChars)),
        '_blank',
        expect.anything()
      );
    });

    it('should properly encode title in share links', () => {
      const titleWithSpecialChars = 'My Blog Post: "Hello World" & More!';
      render(<SocialShare {...defaultProps} title={titleWithSpecialChars} />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      fireEvent.click(twitterButton);

      expect(global.open).toHaveBeenCalledWith(
        expect.stringContaining(encodeURIComponent(titleWithSpecialChars)),
        '_blank',
        expect.anything()
      );
    });

    it('should handle empty hashtags array', () => {
      render(<SocialShare {...defaultProps} hashtags={[]} />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      fireEvent.click(twitterButton);

      expect(global.open).toHaveBeenCalled();
      const shareUrl = global.open.mock.calls[0][0];
      expect(shareUrl).not.toContain('hashtags');
    });

    it('should strip # from hashtags if present', () => {
      render(<SocialShare {...defaultProps} hashtags={['#react', '#javascript']} />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      fireEvent.click(twitterButton);

      expect(global.open).toHaveBeenCalledWith(
        expect.stringContaining('hashtags=react'),
        '_blank',
        expect.anything()
      );
    });
  });

  describe('Responsive Design', () => {
    it('should hide labels on small screens when showLabel is true', () => {
      render(<SocialShare {...defaultProps} showLabel={true} />);
      const labels = screen.getAllByText('Twitter');
      // First occurrence should be in the button with hidden sm:hidden
      expect(labels[0]).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing url prop gracefully', () => {
      delete window.location;
      window.location = { href: 'https://fallback.com' };

      render(<SocialShare title="Test" url="" />);
      const copyButton = screen.getByLabelText(/Copy link/i);
      fireEvent.click(copyButton);

      expect(mockClipboard.writeText).toHaveBeenCalled();
    });

    it('should handle missing title prop', () => {
      render(<SocialShare {...defaultProps} title="" />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      expect(() => fireEvent.click(twitterButton)).not.toThrow();
    });

    it('should handle missing description prop', () => {
      render(<SocialShare {...defaultProps} description="" />);
      const twitterButton = screen.getByLabelText(/Share on Twitter/i);
      expect(() => fireEvent.click(twitterButton)).not.toThrow();
    });
  });
});
