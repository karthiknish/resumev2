import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { jest } from "@jest/globals";
import { SharePreviewModal } from "../SharePreviewModal";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe("SharePreviewModal", () => {
  const defaultProps = {
    title: "Test Title",
    description: "Test Description",
    url: "https://example.com/test",
    imageUrl: "https://example.com/image.jpg",
  };

  beforeEach(() => {
    // Mock window.URL for hostname parsing
    jest.spyOn(window, "URL").mockImplementation((url) => ({
      hostname: url ? "example.com" : "",
      href: url || "",
      toString: () => url,
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Rendering", () => {
    test("should render the modal trigger button", () => {
      render(<SharePreviewModal {...defaultProps} />);

      expect(screen.getByRole("button", { name: /preview/i })).toBeInTheDocument();
    });

    test("should render custom trigger when children are provided", () => {
      render(
        <SharePreviewModal {...defaultProps}>
          <button type="button">Custom Trigger</button>
        </SharePreviewModal>
      );

      expect(screen.getByRole("button", { name: "Custom Trigger" })).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /preview/i })).not.toBeInTheDocument();
    });

    test("should render with default props when not provided", () => {
      render(<SharePreviewModal />);

      expect(screen.getByRole("button", { name: /preview/i })).toBeInTheDocument();
    });
  });

  describe("Platform Tabs", () => {
    test("should render all platform tabs by default", () => {
      render(<SharePreviewModal {...defaultProps} />);

      // Click to open modal
      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      // Wait for modal to open
      waitFor(() => {
        expect(screen.getByText("Twitter")).toBeInTheDocument();
        expect(screen.getByText("Facebook")).toBeInTheDocument();
        expect(screen.getByText("LinkedIn")).toBeInTheDocument();
        expect(screen.getByText("WhatsApp")).toBeInTheDocument();
      });
    });

    test("should render only specified platforms", () => {
      render(
        <SharePreviewModal {...defaultProps} platforms={["twitter", "facebook"]} />
      );

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        expect(screen.getByText("Twitter")).toBeInTheDocument();
        expect(screen.getByText("Facebook")).toBeInTheDocument();
        expect(screen.queryByText("LinkedIn")).not.toBeInTheDocument();
        expect(screen.queryByText("WhatsApp")).not.toBeInTheDocument();
      });
    });

    test("should highlight the active platform tab", () => {
      render(<SharePreviewModal {...defaultProps} defaultPlatform="facebook" />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        const facebookTab = screen.getByText("Facebook").closest("button");
        const twitterTab = screen.getByText("Twitter").closest("button");

        expect(facebookTab).toHaveClass("bg-slate-900");
        expect(twitterTab).not.toHaveClass("bg-slate-900");
      });
    });
  });

  describe("Platform Switching", () => {
    test("should switch to Facebook platform when tab is clicked", async () => {
      const user = userEvent.setup();
      render(<SharePreviewModal {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      await user.click(trigger);

      const facebookTab = await screen.findByText("Facebook");
      await user.click(facebookTab);

      await waitFor(() => {
        expect(facebookTab.closest("button")).toHaveClass("bg-slate-900");
      });
    });

    test("should switch to LinkedIn platform when tab is clicked", async () => {
      const user = userEvent.setup();
      render(<SharePreviewModal {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      await user.click(trigger);

      const linkedinTab = await screen.findByText("LinkedIn");
      await user.click(linkedinTab);

      await waitFor(() => {
        expect(linkedinTab.closest("button")).toHaveClass("bg-slate-900");
      });
    });

    test("should switch to WhatsApp platform when tab is clicked", async () => {
      const user = userEvent.setup();
      render(<SharePreviewModal {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      await user.click(trigger);

      const whatsappTab = await screen.findByText("WhatsApp");
      await user.click(whatsappTab);

      await waitFor(() => {
        expect(whatsappTab.closest("button")).toHaveClass("bg-slate-900");
      });
    });
  });

  describe("Content Display", () => {
    test("should display the title in the preview", () => {
      render(<SharePreviewModal {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        expect(screen.getByText("Test Title")).toBeInTheDocument();
      });
    });

    test("should display the description in the info section", () => {
      render(<SharePreviewModal {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        expect(screen.getByText("Test Description")).toBeInTheDocument();
      });
    });

    test("should display the URL in the info section", () => {
      render(<SharePreviewModal {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        expect(screen.getByText("https://example.com/test")).toBeInTheDocument();
      });
    });

    test("should display the image URL in the info section when provided", () => {
      render(<SharePreviewModal {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        expect(screen.getByText("https://example.com/image.jpg")).toBeInTheDocument();
      });
    });

    test("should show 'Not set' for missing title", () => {
      render(<SharePreviewModal url="https://example.com" />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        expect(screen.getByText(/not set/i)).toBeInTheDocument();
      });
    });
  });

  describe("Preview Components", () => {
    test("should render TwitterPreview by default", () => {
      render(<SharePreviewModal {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        expect(screen.getByText("Test Title")).toBeInTheDocument();
        // Twitter preview should show title in the post
        const titleElements = screen.getAllByText("Test Title");
        expect(titleElements.length).toBeGreaterThan(0);
      });
    });

    test("should render FacebookPreview when Facebook tab is active", async () => {
      const user = userEvent.setup();
      render(<SharePreviewModal {...defaultProps} defaultPlatform="facebook" />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Facebook")).toBeInTheDocument();
        // Facebook preview should have a Like button
        const likeButtons = screen.getAllByText("Like");
        expect(likeButtons.length).toBeGreaterThan(0);
      });
    });

    test("should render LinkedInPreview when LinkedIn tab is active", async () => {
      const user = userEvent.setup();
      render(<SharePreviewModal {...defaultProps} defaultPlatform="linkedin" />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("LinkedIn")).toBeInTheDocument();
        // LinkedIn preview should have a Repost button
        const repostButtons = screen.getAllByText("Repost");
        expect(repostButtons.length).toBeGreaterThan(0);
      });
    });

    test("should render WhatsAppPreview when WhatsApp tab is active", async () => {
      const user = userEvent.setup();
      render(<SharePreviewModal {...defaultProps} defaultPlatform="whatsapp" />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("WhatsApp")).toBeInTheDocument();
        // WhatsApp preview should show a chat-like interface
        expect(screen.getByText("Contact Name")).toBeInTheDocument();
      });
    });
  });

  describe("Modal Structure", () => {
    test("should render modal with correct title", () => {
      render(<SharePreviewModal {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        expect(screen.getByText("Share Preview")).toBeInTheDocument();
      });
    });

    test("should render modal with description", () => {
      render(<SharePreviewModal {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        expect(screen.getByText(/see how your content will appear/i)).toBeInTheDocument();
      });
    });

    test("should render content info section with labels", () => {
      render(<SharePreviewModal {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        expect(screen.getByText("Title:")).toBeInTheDocument();
        expect(screen.getByText("Description:")).toBeInTheDocument();
        expect(screen.getByText("URL:")).toBeInTheDocument();
        expect(screen.getByText("Image:")).toBeInTheDocument();
      });
    });
  });

  describe("Accessibility", () => {
    test("should have accessible button elements", () => {
      render(<SharePreviewModal {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("type", "button");
    });

    test("should render platform tabs as buttons", () => {
      render(<SharePreviewModal {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        const tabs = screen.getAllByRole("button");
        const platformTabs = tabs.filter((tab) =>
          ["Twitter", "Facebook", "LinkedIn", "WhatsApp"].includes(tab.textContent)
        );
        expect(platformTabs.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Edge Cases", () => {
    test("should handle empty props gracefully", () => {
      render(<SharePreviewModal />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      expect(() => fireEvent.click(trigger)).not.toThrow();
    });

    test("should handle very long titles", () => {
      const longTitle = "A".repeat(200);
      render(<SharePreviewModal title={longTitle} url="https://example.com" />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        expect(screen.getByText(longTitle)).toBeInTheDocument();
      });
    });

    test("should handle very long descriptions", () => {
      const longDescription = "B".repeat(500);
      render(
        <SharePreviewModal
          title="Test"
          description={longDescription}
          url="https://example.com"
        />
      );

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        expect(screen.getByText(longDescription)).toBeInTheDocument();
      });
    });

    test("should handle special characters in title and description", () => {
      const specialChars = "Test with <script> & 'quotes' and \"double quotes\"";
      render(
        <SharePreviewModal
          title={specialChars}
          description={specialChars}
          url="https://example.com"
        />
      );

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        expect(screen.getByText((content) => content.includes("Test with"))).toBeInTheDocument();
      });
    });

    test("should handle invalid URL gracefully", () => {
      // Mock console.error to avoid noise in test output
      const originalError = console.error;
      console.error = jest.fn();

      render(<SharePreviewModal url="not-a-valid-url" />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      expect(() => fireEvent.click(trigger)).not.toThrow();

      console.error = originalError;
    });
  });

  describe("Default Platform", () => {
    test("should use Twitter as default platform when not specified", () => {
      render(<SharePreviewModal {...defaultProps} />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        const twitterTab = screen.getByText("Twitter").closest("button");
        expect(twitterTab).toHaveClass("bg-slate-900");
      });
    });

    test("should use specified default platform", () => {
      render(<SharePreviewModal {...defaultProps} defaultPlatform="linkedin" />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      fireEvent.click(trigger);

      waitFor(() => {
        const linkedinTab = screen.getByText("LinkedIn").closest("button");
        expect(linkedinTab).toHaveClass("bg-slate-900");
      });
    });
  });

  describe("Component Exports", () => {
    test("should export SharePreviewModal as default", () => {
      expect(SharePreviewModal).toBeDefined();
    });

    test("should have displayName set", () => {
      expect(SharePreviewModal.displayName).toBe("SharePreviewModal");
    });
  });

  describe("Custom Trigger Styling", () => {
    test("should apply custom className to default trigger", () => {
      render(<SharePreviewModal {...defaultProps} triggerClassName="custom-class" />);

      const trigger = screen.getByRole("button", { name: /preview/i });
      expect(trigger).toHaveClass("custom-class");
    });
  });
});
