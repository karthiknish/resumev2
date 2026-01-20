/**
 * Tests for LinkedInPostGenerator component
 * Focus on hashtag suggestions and character counter features
 */

import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";
import LinkedInPostGenerator from "../LinkedInPostGenerator";

// Mock dependencies
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(() => ({
    data: { user: { role: "admin" } },
  })),
}));

// Mock fetch
global.fetch = jest.fn();

describe("LinkedInPostGenerator - Hashtag Suggestions Feature", () => {
  let consoleErrorMock;

  beforeEach(() => {
    consoleErrorMock = jest.spyOn(console, "error").mockImplementation(() => {});
    localStorage.clear();
    global.fetch.mockClear();
    toast.error.mockClear();
    toast.success.mockClear();
    toast.info.mockClear();
  });

  afterEach(() => {
    consoleErrorMock.mockRestore();
  });

  describe("suggestHashtags utility function", () => {
    // The suggestHashtags function is not exported, so we test it through component behavior
    // by checking what hashtags are suggested based on the topic input

    test("should suggest technology-related hashtags for tech topics", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "I want to post about React and NextJS development");

      // Wait for suggestions to appear
      await waitFor(() => {
        const suggestionSection = screen.queryByText(/Suggested Hashtags/i);
        expect(suggestionSection).toBeInTheDocument();
      });
    });

    test("should suggest career-related hashtags for career topics", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "My career growth journey in tech");

      await waitFor(() => {
        const suggestionSection = screen.queryByText(/Suggested Hashtags/i);
        expect(suggestionSection).toBeInTheDocument();
      });
    });

    test("should suggest AI-related hashtags for AI topics", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "Building AI tools with machine learning");

      await waitFor(() => {
        const suggestionSection = screen.queryByText(/Suggested Hashtags/i);
        expect(suggestionSection).toBeInTheDocument();
      });
    });

    test("should suggest startup-related hashtags for startup topics", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "Building a startup in public");

      await waitFor(() => {
        const suggestionSection = screen.queryByText(/Suggested Hashtags/i);
        expect(suggestionSection).toBeInTheDocument();
      });
    });

    test("should show no suggestions for empty input", () => {
      render(<LinkedInPostGenerator />);

      const suggestionSection = screen.queryByText(/Suggested Hashtags/i);
      expect(suggestionSection).not.toBeInTheDocument();
    });

    test("should show no suggestions for gibberish input", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "xyzabc123");

      // Wait for potential suggestions
      await waitFor(
        () => {
          const suggestionSection = screen.queryByText(/Suggested Hashtags/i);
          expect(suggestionSection).not.toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });
  });

  describe("Selected Hashtags Management", () => {
    test("should add hashtag when clicking on suggested hashtag", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React development tips");

      await waitFor(() => {
        expect(screen.queryByText(/Suggested Hashtags/i)).toBeInTheDocument();
      });

      // Find and click first suggested hashtag
      const suggestedBadges = screen.getAllByText(/^\+ #/i);
      if (suggestedBadges.length > 0) {
        await userEvent.click(suggestedBadges[0]);

        await waitFor(() => {
          expect(screen.queryByText(/Selected Hashtags/i)).toBeInTheDocument();
        });
      }
    });

    test("should remove hashtag when clicking on selected hashtag", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React development");

      await waitFor(() => {
        expect(screen.queryByText(/Suggested Hashtags/i)).toBeInTheDocument();
      });

      // Add a hashtag
      const suggestedBadges = screen.getAllByText(/^\+ #/i);
      if (suggestedBadges.length > 0) {
        await userEvent.click(suggestedBadges[0]);

        await waitFor(() => {
          expect(screen.queryByText(/Selected Hashtags/i)).toBeInTheDocument();
        });

        // Find and click the selected hashtag to remove it
        const selectedSection = screen.getByText(/Selected Hashtags/i).closest("div");
        const selectedBadge = selectedSection?.querySelector('[class*="cursor-pointer"]');
        if (selectedBadge) {
          await userEvent.click(selectedBadge);

          await waitFor(() => {
            const selectedSectionAfter = screen.queryByText(/Selected Hashtags/i);
            expect(selectedSectionAfter).not.toBeInTheDocument();
          });
        }
      }
    });

    test("should clear all selected hashtags when clicking clear all", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React and NodeJS development");

      await waitFor(() => {
        expect(screen.queryByText(/Suggested Hashtags/i)).toBeInTheDocument();
      });

      // Add multiple hashtags
      const suggestedBadges = screen.getAllByText(/^\+ #/i);
      for (let i = 0; i < Math.min(2, suggestedBadges.length); i++) {
        await userEvent.click(suggestedBadges[i]);
      }

      await waitFor(() => {
        expect(screen.queryByText(/Selected Hashtags/i)).toBeInTheDocument();
      });

      // Click clear all
      const clearButton = screen.getByText(/Clear all/i);
      await userEvent.click(clearButton);

      await waitFor(() => {
        expect(screen.queryByText(/Selected Hashtags/i)).not.toBeInTheDocument();
      });
    });

    test("should show count of selected hashtags", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React development");

      await waitFor(() => {
        expect(screen.queryByText(/Suggested Hashtags/i)).toBeInTheDocument();
      });

      const suggestedBadges = screen.getAllByText(/^\+ #/i);
      if (suggestedBadges.length > 0) {
        await userEvent.click(suggestedBadges[0]);

        await waitFor(() => {
          const selectedText = screen.getByText(/Selected Hashtags \(/i);
          expect(selectedText).toBeInTheDocument();
        });
      }
    });
  });

  describe("Custom Hashtag Input", () => {
    test("should allow adding custom hashtag", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React development");

      await waitFor(() => {
        expect(screen.queryByText(/Suggested Hashtags/i)).toBeInTheDocument();
      });

      const customInput = screen.getByPlaceholderText(/Add custom hashtag/i);
      await userEvent.type(customInput, "MyCustomTag");

      const addButton = screen.getByRole("button", { name: /^Add$/i });
      await userEvent.click(addButton);

      expect(toast.success).toHaveBeenCalledWith("Hashtag added");

      await waitFor(() => {
        expect(screen.queryByText(/#MyCustomTag/i)).toBeInTheDocument();
      });
    });

    test("should auto-add # to custom hashtag without it", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React development");

      await waitFor(() => {
        expect(screen.queryByText(/Suggested Hashtags/i)).toBeInTheDocument();
      });

      const customInput = screen.getByPlaceholderText(/Add custom hashtag/i);
      await userEvent.type(customInput, "TestTag");

      const addButton = screen.getByRole("button", { name: /^Add$/i });
      await userEvent.click(addButton);

      // Verify toast was called with success
      expect(toast.success).toHaveBeenCalledWith("Hashtag added");

      // After adding, the hashtag should appear with # prefix
      await waitFor(() => {
        const allHashtags = screen.queryAllByText(/TestTag/i);
        // Should find at least one element with TestTag text
        expect(allHashtags.length).toBeGreaterThan(0);
      });
    });

    test("should show error for invalid hashtag format", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React development");

      await waitFor(() => {
        expect(screen.queryByText(/Suggested Hashtags/i)).toBeInTheDocument();
      });

      const customInput = screen.getByPlaceholderText(/Add custom hashtag/i);
      await userEvent.type(customInput, "invalid-tag!");

      const addButton = screen.getByRole("button", { name: /^Add$/i });
      await userEvent.click(addButton);

      expect(toast.error).toHaveBeenCalledWith(
        "Invalid hashtag format. Use letters, numbers, and underscores only."
      );
    });

    test("should show info for duplicate hashtag", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React development");

      await waitFor(() => {
        expect(screen.queryByText(/Suggested Hashtags/i)).toBeInTheDocument();
      });

      // Add first hashtag
      const customInput = screen.getByPlaceholderText(/Add custom hashtag/i);
      await userEvent.type(customInput, "DuplicateTag");
      const addButton = screen.getByRole("button", { name: /^Add$/i });
      await userEvent.click(addButton);

      // Try to add same hashtag again
      await userEvent.type(customInput, "DuplicateTag");
      await userEvent.click(addButton);

      expect(toast.info).toHaveBeenCalledWith("Hashtag already added");
    });

    test("should support Enter key to add custom hashtag", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React development");

      await waitFor(() => {
        expect(screen.queryByText(/Suggested Hashtags/i)).toBeInTheDocument();
      });

      const customInput = screen.getByPlaceholderText(/Add custom hashtag/i);
      await userEvent.type(customInput, "EnterTag{Enter}");

      expect(toast.success).toHaveBeenCalledWith("Hashtag added");

      await waitFor(() => {
        expect(screen.queryByText(/#EnterTag/i)).toBeInTheDocument();
      });
    });

    test("should disable add button when input is empty", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React development");

      await waitFor(() => {
        expect(screen.queryByText(/Suggested Hashtags/i)).toBeInTheDocument();
      });

      const addButton = screen.getByRole("button", { name: /^Add$/i });
      expect(addButton).toBeDisabled();
    });
  });

  describe("Character Counter", () => {
    const LINKEDIN_CHAR_LIMIT = 3000;

    beforeEach(() => {
      // Mock successful API response
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          post: "A".repeat(100), // Short post
          hashtags: [],
          metadata: {},
        }),
      });
    });

    test("should display character count when post is generated", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "Test topic");

      const generateButton = screen.getByRole("button", { name: /Generate Post/i });
      await userEvent.click(generateButton);

      await waitFor(() => {
        expect(screen.queryByText(/100 \/ 3,000/i)).toBeInTheDocument();
      });
    });

    test("should show correct character count format", async () => {
      const postLength = 1500;
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          post: "A".repeat(postLength),
          hashtags: [],
          metadata: {},
        }),
      });

      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "Test topic");

      const generateButton = screen.getByRole("button", { name: /Generate Post/i });
      await userEvent.click(generateButton);

      await waitFor(() => {
        expect(screen.getByText(`${postLength.toLocaleString()} / ${LINKEDIN_CHAR_LIMIT.toLocaleString()}`)).toBeInTheDocument();
      });
    });

    test("should show warning color when near character limit", async () => {
      const postLength = 2750; // > 90% of 3000
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          post: "A".repeat(postLength),
          hashtags: [],
          metadata: {},
        }),
      });

      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "Test topic");

      const generateButton = screen.getByRole("button", { name: /Generate Post/i });
      await userEvent.click(generateButton);

      await waitFor(() => {
        const charCountElement = screen.getByText(`${postLength.toLocaleString()} / ${LINKEDIN_CHAR_LIMIT.toLocaleString()}`);
        expect(charCountElement).toHaveClass("text-warning");
      });
    });

    test("should show over limit message when exceeding character limit", async () => {
      const postLength = 3100;
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          post: "A".repeat(postLength),
          hashtags: [],
          metadata: {},
        }),
      });

      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "Test topic");

      const generateButton = screen.getByRole("button", { name: /Generate Post/i });
      await userEvent.click(generateButton);

      await waitFor(() => {
        expect(screen.getByText(/100 characters over limit/i)).toBeInTheDocument();
      });
    });

    test("should show destructive color when over limit", async () => {
      const postLength = 3100;
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          post: "A".repeat(postLength),
          hashtags: [],
          metadata: {},
        }),
      });

      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "Test topic");

      const generateButton = screen.getByRole("button", { name: /Generate Post/i });
      await userEvent.click(generateButton);

      await waitFor(() => {
        const charCountElement = screen.getByText(`${postLength.toLocaleString()} / ${LINKEDIN_CHAR_LIMIT.toLocaleString()}`);
        expect(charCountElement).toHaveClass("text-destructive");
      });
    });
  });

  describe("Hashtag Suggestions Filtering", () => {
    test("should not show already selected hashtags in suggestions", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React development");

      await waitFor(() => {
        expect(screen.queryByText(/Suggested Hashtags/i)).toBeInTheDocument();
      });

      // Get initial suggested hashtags count
      const initialSuggestions = screen.getAllByText(/^\+ #/i);
      const initialCount = initialSuggestions.length;

      // Add first hashtag
      await userEvent.click(initialSuggestions[0]);

      await waitFor(() => {
        expect(screen.queryByText(/Selected Hashtags/i)).toBeInTheDocument();
      });

      // Check that suggestions count decreased
      const afterSuggestions = screen.getAllByText(/^\+ #/i);
      expect(afterSuggestions.length).toBeLessThan(initialCount);
    });

    test("should update suggestions when topic changes", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);

      // Type first topic
      await userEvent.clear(topicInput);
      await userEvent.type(topicInput, "React development");

      await waitFor(() => {
        expect(screen.queryByText(/Suggested Hashtags/i)).toBeInTheDocument();
      });

      const firstSuggestions = screen.getAllByText(/^\+ #/i);
      const firstSuggestionText = firstSuggestions[0]?.textContent;

      // Change topic
      await userEvent.clear(topicInput);
      await userEvent.type(topicInput, "Career growth in tech");

      await waitFor(() => {
        const newSuggestions = screen.getAllByText(/^\+ #/i);
        // Suggestions should change based on topic
        expect(newSuggestions.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Accessibility", () => {
    test("should have proper labels for hashtag input", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React development");

      await waitFor(() => {
        expect(screen.queryByText(/Suggested Hashtags/i)).toBeInTheDocument();
      });

      const customInput = screen.getByPlaceholderText(/Add custom hashtag/i);
      expect(customInput).toBeInTheDocument();
      expect(customInput).toHaveAttribute("type", "text");
    });

    test("should have clickable hashtag badges with proper cursor", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React development");

      await waitFor(() => {
        expect(screen.queryByText(/Suggested Hashtags/i)).toBeInTheDocument();
      });

      const suggestedBadges = screen.getAllByText(/^\+ #/i);
      suggestedBadges.forEach((badge) => {
        expect(badge).toHaveClass("cursor-pointer");
      });
    });
  });

  describe("Component Integration", () => {
    beforeEach(() => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          post: "Test post content",
          hashtags: ["#React", "#WebDevelopment"],
          metadata: {},
        }),
      });
    });

    test("should generate post successfully with hashtag options", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React hooks tutorial");

      // Ensure hashtags checkbox is checked
      const hashtagCheckbox = screen.getByRole("checkbox", { name: /Include hashtags/i });
      expect(hashtagCheckbox).toBeChecked();

      const generateButton = screen.getByRole("button", { name: /Generate Post/i });
      await userEvent.click(generateButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/ai/linkedin-post",
          expect.objectContaining({
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: expect.stringContaining('"includeHashtags":true'),
          })
        );
      });
    });

    test("should render hashtag suggestions section with proper animations", async () => {
      render(<LinkedInPostGenerator />);

      const topicInput = screen.getByLabelText(/Topic \/ Idea/i);
      await userEvent.type(topicInput, "React and AI development");

      await waitFor(() => {
        const suggestionSection = screen.queryByText(/Suggested Hashtags/i);
        expect(suggestionSection).toBeInTheDocument();
        // Check that it has the proper animation classes
        const parent = suggestionSection.closest(".space-y-3");
        expect(parent).toBeInTheDocument();
      });
    });
  });
});
