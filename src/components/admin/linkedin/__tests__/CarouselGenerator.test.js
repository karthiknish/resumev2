import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import CarouselGenerator from "../CarouselGenerator";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock toast
jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock fetch globally
global.fetch = jest.fn();

describe("CarouselGenerator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    test("should render the component without errors", () => {
      render(<CarouselGenerator />);
      expect(screen.getByText(/Generate Carousel Images/i)).toBeInTheDocument();
    });

    test("should render topic input field", () => {
      render(<CarouselGenerator />);
      const topicInput = screen.getByLabelText(/Carousel Topic/i);
      expect(topicInput).toBeInTheDocument();
    });

    test("should render templates button", () => {
      render(<CarouselGenerator />);
      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      expect(templatesButton).toBeInTheDocument();
    });
  });

  describe("Template Library UI", () => {
    test("should open templates panel when Templates button is clicked", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      expect(screen.getByText(/Carousel Templates/i)).toBeInTheDocument();
    });

    test("should close templates panel when clicked again", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);
      expect(screen.getByText(/Carousel Templates/i)).toBeInTheDocument();

      await user.click(templatesButton);
      expect(screen.queryByText(/Carousel Templates/i)).not.toBeInTheDocument();
    });

    test("should display all three category tabs", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      expect(screen.getByText(/Educational/i)).toBeInTheDocument();
      expect(screen.getByText(/Professional/i)).toBeInTheDocument();
      expect(screen.getByText(/Engaging/i)).toBeInTheDocument();
    });

    test("should have Educational category selected by default", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const educationalTab = screen.getByText(/Educational/i).closest("button");
      expect(educationalTab).toHaveClass("bg-primary");
    });
  });

  describe("Template Categories", () => {
    test("should switch to Professional category when clicked", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const professionalTab = screen.getByText(/Professional/i).closest("button");
      await user.click(professionalTab);

      expect(screen.getByText(/Career Journey/i)).toBeInTheDocument();
    });

    test("should switch to Engaging category when clicked", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const engagingTab = screen.getByText(/Engaging/i).closest("button");
      await user.click(engagingTab);

      expect(screen.getByText(/Quiz Format/i)).toBeInTheDocument();
    });
  });

  describe("Educational Templates", () => {
    test("should display all educational templates", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      expect(screen.getByText(/Quick Tips/i)).toBeInTheDocument();
      expect(screen.getByText(/Common Mistakes/i)).toBeInTheDocument();
      expect(screen.getByText(/Step-by-Step Guide/i)).toBeInTheDocument();
      expect(screen.getByText(/Myth vs Reality/i)).toBeInTheDocument();
      expect(screen.getByText(/Actionable Checklist/i)).toBeInTheDocument();
    });

    test("should load Quick Tips template when clicked", async () => {
      const user = userEvent.setup();
      const { toast } = require("sonner");
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const quickTipsButton = screen.getByText(/Quick Tips/i).closest("button");
      await user.click(quickTipsButton);

      const topicInput = screen.getByPlaceholderText(/5 Tips for Better Code Reviews/i);
      expect(topicInput).toHaveValue("5 Quick Tips for Better JavaScript");
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("Quick Tips"));
    });

    test("should load Common Mistakes template when clicked", async () => {
      const user = userEvent.setup();
      const { toast } = require("sonner");
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const mistakesButton = screen.getByText(/Common Mistakes/i).closest("button");
      await user.click(mistakesButton);

      const topicInput = screen.getByPlaceholderText(/5 Tips for Better Code Reviews/i);
      expect(topicInput).toHaveValue("6 Common New Developer Mistakes to Avoid");
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("Common Mistakes"));
    });
  });

  describe("Professional Templates", () => {
    test("should display all professional templates", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const professionalTab = screen.getByText(/Professional/i).closest("button");
      await user.click(professionalTab);

      expect(screen.getByText(/Career Journey/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Lessons Learned/i)).toBeInTheDocument();
      expect(screen.getByText(/Tools & Resources/i)).toBeInTheDocument();
      expect(screen.getByText(/Industry Trends/i)).toBeInTheDocument();
      expect(screen.getByText(/Pro Tips/i)).toBeInTheDocument();
    });

    test("should load Career Journey template when clicked", async () => {
      const user = userEvent.setup();
      const { toast } = require("sonner");
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const professionalTab = screen.getByText(/Professional/i).closest("button");
      await user.click(professionalTab);

      const careerJourneyButton = screen.getByText(/Career Journey/i).closest("button");
      await user.click(careerJourneyButton);

      const topicInput = screen.getByPlaceholderText(/5 Tips for Better Code Reviews/i);
      expect(topicInput).toHaveValue("My 5-Year Career Journey in Tech");
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("Career Journey"));
    });
  });

  describe("Engaging Templates", () => {
    test("should display all engaging templates", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const engagingTab = screen.getByText(/Engaging/i).closest("button");
      await user.click(engagingTab);

      expect(screen.getByText(/Quiz Format/i)).toBeInTheDocument();
      expect(screen.getByText(/Before & After/i)).toBeInTheDocument();
      expect(screen.getByText(/This vs That/i)).toBeInTheDocument();
      expect(screen.getByText(/Story Series/i)).toBeInTheDocument();
      expect(screen.getByText(/Statistics Roundup/i)).toBeInTheDocument();
    });

    test("should load Quiz Format template when clicked", async () => {
      const user = userEvent.setup();
      const { toast } = require("sonner");
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const engagingTab = screen.getByText(/Engaging/i).closest("button");
      await user.click(engagingTab);

      const quizButton = screen.getByText(/Quiz Format/i).closest("button");
      await user.click(quizButton);

      const topicInput = screen.getByPlaceholderText(/5 Tips for Better Code Reviews/i);
      expect(topicInput).toHaveValue("Quiz: How Much Do You Know About Web Development?");
      expect(toast.success).toHaveBeenCalledWith(expect.stringContaining("Quiz Format"));
    });
  });

  describe("Template Selection Behavior", () => {
    test("should close templates panel after selecting a template", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const quickTipsButton = screen.getByText(/Quick Tips/i).closest("button");
      await user.click(quickTipsButton);

      await waitFor(() => {
        expect(screen.queryByText(/Carousel Templates/i)).not.toBeInTheDocument();
      });
    });

    test("should show toast with template name when selected", async () => {
      const user = userEvent.setup();
      const { toast } = require("sonner");
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const quickTipsButton = screen.getByText(/Quick Tips/i).closest("button");
      await user.click(quickTipsButton);

      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("Loaded \"Quick Tips\" template")
      );
    });

    test("should show toast with placeholder customization instructions", async () => {
      const user = userEvent.setup();
      const { toast } = require("sonner");
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const quickTipsButton = screen.getByText(/Quick Tips/i).closest("button");
      await user.click(quickTipsButton);

      expect(toast.success).toHaveBeenCalledWith(
        expect.stringContaining("Edit the topic to customize")
      );
    });
  });

  describe("Template Slide Count", () => {
    test("should update slide count when template is selected", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const stepsButton = screen.getByText(/Step-by-Step Guide/i).closest("button");
      await user.click(stepsButton);

      // The Step-by-Step Guide template has 7 slides
      const slideCountSelects = screen.getAllByRole("combobox");
      const slideCountSelect = slideCountSelects[0];
      expect(slideCountSelect).toHaveTextContent("7");
    });

    test("should display slide count badge on each template", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      // Check for slide count badges
      const slideCounts = screen.getAllByText(/\d+ slides/);
      expect(slideCounts.length).toBeGreaterThan(0);
    });
  });

  describe("Template Design", () => {
    test("should display template descriptions", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      expect(screen.getByText(/Share bite-sized tips on any topic/i)).toBeInTheDocument();
      expect(screen.getByText(/Highlight mistakes and how to avoid them/i)).toBeInTheDocument();
    });

    test("should have proper test-id attributes on category tabs", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      expect(screen.getByTestId("carousel-template-category-educational")).toBeInTheDocument();
      expect(screen.getByTestId("carousel-template-category-professional")).toBeInTheDocument();
      expect(screen.getByTestId("carousel-template-category-engaging")).toBeInTheDocument();
    });

    test("should have proper test-id attributes on educational templates", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      expect(screen.getByTestId("carousel-template-edu-tips")).toBeInTheDocument();
      expect(screen.getByTestId("carousel-template-edu-mistakes")).toBeInTheDocument();
    });

    test("should have proper test-id attributes on professional templates", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const professionalTab = screen.getByText(/Professional/i).closest("button");
      await user.click(professionalTab);

      expect(screen.getByTestId("carousel-template-prof-journey")).toBeInTheDocument();
      expect(screen.getByTestId("carousel-template-prof-lessons")).toBeInTheDocument();
    });

    test("should have proper test-id attributes on engaging templates", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const engagingTab = screen.getByText(/Engaging/i).closest("button");
      await user.click(engagingTab);

      expect(screen.getByTestId("carousel-template-eng-quiz")).toBeInTheDocument();
      expect(screen.getByTestId("carousel-template-eng-story")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    test("should have proper labels on template buttons", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      expect(templatesButton).toHaveAttribute("type", "button");
    });

    test("should have accessible category tabs", async () => {
      const user = userEvent.setup();
      render(<CarouselGenerator />);

      const templatesButton = screen.getByRole("button", { name: /Templates/i });
      await user.click(templatesButton);

      const categoryTabs = screen.getAllByText(/Educational|Professional|Engaging/i);
      categoryTabs.forEach((tab) => {
        expect(tab.closest("button")).toHaveAttribute("type", "button");
      });
    });
  });
});
