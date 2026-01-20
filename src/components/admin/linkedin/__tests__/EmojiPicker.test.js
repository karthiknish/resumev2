import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmojiPicker, { EmojiPickerButton } from "../EmojiPicker";

// Mock framer-motion to avoid animation issues in tests
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }) => React.createElement("div", { ...props }, children),
    button: ({ children, ...props }) => React.createElement("button", { ...props }, children),
  },
  AnimatePresence: ({ children }) => children,
}));

// Mock all Radix UI components with simple implementations
jest.mock("@radix-ui/react-popover", () => {
  const React = require("react");
  const MockPopoverContext = React.createContext({});

  const Popover = ({ open, onOpenChange, children }) => {
    const [internalOpen, setInternalOpen] = React.useState(false);
    const isOpen = open !== undefined ? open : internalOpen;

    const handleToggle = () => {
      const newState = !isOpen;
      if (open === undefined) {
        setInternalOpen(newState);
      }
      onOpenChange?.(newState);
    };

    return React.createElement(
      MockPopoverContext.Provider,
      { value: { isOpen, onToggle: handleToggle } },
      React.Children.map(children, (child) => {
        if (child?.type?.displayName === "PopoverTrigger") {
          return React.cloneElement(child, { onClick: handleToggle, isOpen });
        }
        if (child?.type?.displayName === "PopoverContent") {
          return isOpen ? child : null;
        }
        return child;
      })
    );
  };
  Popover.displayName = "Popover";

  const PopoverTrigger = ({ children, onClick, isOpen }) => {
    return React.createElement("div", {
      onClick: onClick,
      "data-open": isOpen,
      "data-testid": "popover-trigger"
    }, children);
  };
  PopoverTrigger.displayName = "PopoverTrigger";

  const PopoverContent = ({ children }) => {
    return React.createElement("div", { "data-testid": "popover-content" }, children);
  };
  PopoverContent.displayName = "PopoverContent";

  return { Root: Popover, Trigger: PopoverTrigger, Content: PopoverContent };
});

// Mock ScrollArea component
jest.mock("@radix-ui/react-scroll-area", () => {
  const React = require("react");

  const Root = React.forwardRef(({ className, children }, ref) =>
    React.createElement("div", { ref, className, "data-testid": "scroll-area" }, children)
  );
  Root.displayName = "ScrollAreaPrimitiveRoot";

  const Viewport = React.forwardRef(({ children }, ref) =>
    React.createElement("div", { ref }, children)
  );
  Viewport.displayName = "ScrollAreaPrimitiveViewport";

  const Scrollbar = React.forwardRef(({ children }, ref) =>
    React.createElement("div", { ref }, children)
  );
  Scrollbar.displayName = "ScrollAreaPrimitiveScrollAreaScrollbar";

  const Thumb = React.forwardRef((props, ref) =>
    React.createElement("div", { ...props, ref })
  );
  Thumb.displayName = "ScrollAreaPrimitiveScrollAreaThumb";

  const Corner = () => null;

  return { Root, Viewport, ScrollAreaScrollbar: Scrollbar, ScrollAreaThumb: Thumb, Corner };
});

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Smile: () => React.createElement("svg", { "data-testid": "smile-icon" }),
  X: () => React.createElement("svg", { "data-testid": "x-icon" }),
  Search: () => React.createElement("svg", { "data-testid": "search-icon" }),
}));

describe("EmojiPicker Component", () => {
  const mockOnEmojiSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("should render trigger button by default", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} />);
      expect(screen.getByTestId("smile-icon")).toBeInTheDocument();
    });

    test("should render custom trigger when provided", () => {
      const customTrigger = React.createElement("button", { type: "button", "data-testid": "custom-trigger" }, "Custom Trigger");
      render(
        React.createElement(EmojiPicker, {
          onEmojiSelect: mockOnEmojiSelect,
          trigger: customTrigger
        })
      );
      expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
    });

    test("should accept custom triggerClassName", () => {
      const { container } = render(
        <EmojiPicker onEmojiSelect={mockOnEmojiSelect} triggerClassName="custom-class" />
      );
      expect(container.querySelector(".custom-class")).toBeInTheDocument();
    });
  });

  describe("Emoji Categories", () => {
    test("should display all category tabs when open", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      expect(screen.getByText("Frequently Used")).toBeInTheDocument();
      expect(screen.getByText("Smileys & People")).toBeInTheDocument();
      expect(screen.getByText("Gestures")).toBeInTheDocument();
      expect(screen.getByText("Animals & Nature")).toBeInTheDocument();
      expect(screen.getByText("Food & Drink")).toBeInTheDocument();
      expect(screen.getByText("Activities")).toBeInTheDocument();
      expect(screen.getByText("Travel & Places")).toBeInTheDocument();
      expect(screen.getByText("Objects")).toBeInTheDocument();
      expect(screen.getByText("Symbols")).toBeInTheDocument();
      expect(screen.getByText("Business & Work")).toBeInTheDocument();
    });

    test("should show frequently used emojis by default", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      // Check for some default frequently used emojis
      expect(screen.getAllByTitle("👍").length).toBeGreaterThan(0);
      expect(screen.getAllByTitle("❤️").length).toBeGreaterThan(0);
      expect(screen.getAllByTitle("🔥").length).toBeGreaterThan(0);
    });
  });

  describe("Emoji Selection", () => {
    test("should call onEmojiSelect when emoji is clicked", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const thumbsUpButtons = screen.getAllByTitle("👍");
      fireEvent.click(thumbsUpButtons[0]);

      expect(mockOnEmojiSelect).toHaveBeenCalledWith("👍");
    });

    test("should update frequently used emojis after selection", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const emojiButtons = screen.queryAllByTitle(/./);
      fireEvent.click(emojiButtons[0]);

      expect(mockOnEmojiSelect).toHaveBeenCalled();
    });

    test("should handle keyboard Enter key", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const emojiButtons = screen.getAllByTitle("👍");
      fireEvent.keyDown(emojiButtons[0], { key: "Enter", code: "Enter" });

      expect(mockOnEmojiSelect).toHaveBeenCalledWith("👍");
    });

    test("should handle keyboard Space key", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const emojiButtons = screen.getAllByTitle("👎");
      fireEvent.keyDown(emojiButtons[0], { key: " ", code: "Space" });

      expect(mockOnEmojiSelect).toHaveBeenCalledWith("👎");
    });
  });

  describe("Search Functionality", () => {
    test("should show search input", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      expect(screen.getByPlaceholderText("Search emojis...")).toBeInTheDocument();
    });

    test("should filter emojis by search query 'heart'", async () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const searchInput = screen.getByPlaceholderText("Search emojis...");
      await userEvent.type(searchInput, "heart");

      // Should show heart emojis
      expect(screen.getAllByTitle("❤️").length).toBeGreaterThan(0);
    });

    test("should filter emojis by keyword 'thumbs'", async () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const searchInput = screen.getByPlaceholderText("Search emojis...");
      await userEvent.type(searchInput, "thumbs");

      const thumbsUp = screen.queryAllByTitle("👍");
      const thumbsDown = screen.queryAllByTitle("👎");
      expect(thumbsUp.length + thumbsDown.length).toBeGreaterThan(0);
    });

    test("should filter emojis by keyword 'fire'", async () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const searchInput = screen.getByPlaceholderText("Search emojis...");
      await userEvent.type(searchInput, "fire");

      expect(screen.queryAllByTitle("🔥").length).toBeGreaterThan(0);
    });

    test("should filter emojis by keyword 'tech'", async () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const searchInput = screen.getByPlaceholderText("Search emojis...");
      await userEvent.type(searchInput, "tech");

      expect(screen.queryAllByTitle("💻").length).toBeGreaterThan(0);
    });

    test("should filter emojis by keyword 'money'", async () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const searchInput = screen.getByPlaceholderText("Search emojis...");
      await userEvent.type(searchInput, "money");

      expect(screen.queryAllByTitle("💰").length).toBeGreaterThan(0);
    });

    test("should show no results message for empty search", async () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const searchInput = screen.getByPlaceholderText("Search emojis...");
      await userEvent.type(searchInput, "nonexistentemoji123");

      expect(screen.getByText(/No emojis found/)).toBeInTheDocument();
    });

    test("should show X icon when search has text", async () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const searchInput = screen.getByPlaceholderText("Search emojis...");
      await userEvent.type(searchInput, "heart");

      expect(screen.getByTestId("x-icon")).toBeInTheDocument();
    });
  });

  describe("Controlled Mode", () => {
    test("should use controlled open state when provided", () => {
      const { rerender } = render(
        <EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={false} />
      );

      expect(screen.queryByTestId("popover-content")).not.toBeInTheDocument();

      rerender(
        <EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />
      );

      expect(screen.getByTestId("popover-content")).toBeInTheDocument();
    });

    test("should call onOpenChange when state changes", () => {
      const mockOnOpenChange = jest.fn();
      render(
        <EmojiPicker
          onEmojiSelect={mockOnEmojiSelect}
          open={false}
          onOpenChange={mockOnOpenChange}
        />
      );

      const trigger = screen.getByTestId("popover-trigger");
      fireEvent.click(trigger);

      expect(mockOnOpenChange).toHaveBeenCalledWith(true);
    });
  });

  describe("Accessibility", () => {
    test("should have title attributes for emoji buttons", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const emojiButtons = screen.queryAllByTitle(/./);
      expect(emojiButtons.length).toBeGreaterThan(0);
    });

    test("should have hover and focus classes on emoji buttons", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const emojiButtons = screen.queryAllByTitle(/./);
      expect(emojiButtons[0]).toHaveClass("hover:bg-accent");
      expect(emojiButtons[0]).toHaveClass("focus:ring-2");
    });
  });

  describe("Emoji Data", () => {
    test("should contain business-related emojis", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      // Click on business category
      const businessTab = screen.getByText("Business & Work");
      fireEvent.click(businessTab);

      expect(screen.queryAllByTitle("💼").length).toBeGreaterThan(0);
    });

    test("should contain hand gesture emojis", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const gesturesTab = screen.getByText("Gestures");
      fireEvent.click(gesturesTab);

      const clap = screen.queryAllByTitle("👏");
      const thumbsUp = screen.queryAllByTitle("👍");
      expect(clap.length + thumbsUp.length).toBeGreaterThan(0);
    });

    test("should contain smileys", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const smileysTab = screen.getByText("Smileys & People");
      fireEvent.click(smileysTab);

      expect(screen.queryAllByTitle("😀").length).toBeGreaterThan(0);
    });

    test("should contain food emojis", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const foodTab = screen.getByText("Food & Drink");
      fireEvent.click(foodTab);

      expect(screen.queryAllByTitle("🍕").length).toBeGreaterThan(0);
    });

    test("should contain travel emojis", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const travelTab = screen.getByText("Travel & Places");
      fireEvent.click(travelTab);

      expect(screen.queryAllByTitle("✈️").length).toBeGreaterThan(0);
    });

    test("should contain activity emojis", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const activitiesTab = screen.getByText("Activities");
      fireEvent.click(activitiesTab);

      expect(screen.queryAllByTitle("⚽").length).toBeGreaterThan(0);
    });

    test("should contain animal emojis", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const animalsTab = screen.getByText("Animals & Nature");
      fireEvent.click(animalsTab);

      expect(screen.queryAllByTitle("🐶").length).toBeGreaterThan(0);
    });

    test("should contain object emojis", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const objectsTab = screen.getByText("Objects");
      fireEvent.click(objectsTab);

      expect(screen.queryAllByTitle("💻").length).toBeGreaterThan(0);
    });

    test("should contain symbol emojis", () => {
      render(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} open={true} />);

      const symbolsTab = screen.getByText("Symbols");
      fireEvent.click(symbolsTab);

      expect(screen.queryAllByTitle("✅").length).toBeGreaterThan(0);
    });
  });
});

describe("EmojiPickerButton Component", () => {
  describe("Rendering", () => {
    test("should render trigger button", () => {
      render(<EmojiPickerButton />);

      expect(screen.getByTestId("smile-icon")).toBeInTheDocument();
    });

    test("should accept buttonClassName prop", () => {
      const { container } = render(<EmojiPickerButton buttonClassName="my-custom-class" />);

      expect(container.querySelector(".my-custom-class")).toBeInTheDocument();
    });
  });

  describe("Integration", () => {
    test("should use onEmojiInsert callback when provided", () => {
      const mockOnEmojiInsert = jest.fn();
      render(<EmojiPickerButton onEmojiInsert={mockOnEmojiInsert} open={true} />);

      const emojiButtons = screen.queryAllByTitle("👍");
      fireEvent.click(emojiButtons[0]);

      expect(mockOnEmojiInsert).toHaveBeenCalledWith("👍");
    });

    test("should pass onEmojiSelect to underlying EmojiPicker", () => {
      const mockOnEmojiInsert = jest.fn();
      render(<EmojiPickerButton onEmojiInsert={mockOnEmojiInsert} open={true} />);

      const emojiButtons = screen.queryAllByTitle("🚀");
      fireEvent.click(emojiButtons[0]);

      expect(mockOnEmojiInsert).toHaveBeenCalledWith("🚀");
    });
  });
});
