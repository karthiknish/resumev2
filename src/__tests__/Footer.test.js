import React from "react";
import { render, screen } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime"; // Import RouterContext
import Footer from "@/components/Footer"; // Adjust import path if needed

// Mock next/link (still useful for basic link checks)
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock next-auth session hook (using the one from jest.setup.js)
// No need to mock it here if it's already in jest.setup.js

// Function to create a mock router object
const createMockRouter = (params = {}) => ({
  route: "/",
  pathname: "/",
  query: {},
  asPath: "/",
  push: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
  back: jest.fn(),
  prefetch: jest.fn(() => Promise.resolve()),
  beforePopState: jest.fn(() => null),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  ...params,
});

// Helper function to render with Router context
const renderWithRouter = (ui, { router = {} } = {}) => {
  const mockRouter = createMockRouter(router);
  return render(
    <RouterContext.Provider value={mockRouter}>{ui}</RouterContext.Provider>
  );
};

describe("Footer Component", () => {
  it("renders the footer", () => {
    renderWithRouter(<Footer />);
    // Check for a common element or text, like the copyright year
    // Using a regex to be flexible about the exact year
    const copyrightText = screen.getByText(/© \d{4} Karthik Nishanth/i);
    expect(copyrightText).toBeInTheDocument();
  });

  it("renders social media links", () => {
    renderWithRouter(<Footer />);
    // Check for links by their accessible name (aria-label or text content)
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
    // Removed Twitter check, as it's not in Footer
    // Add checks for other social links if present
  });

  it("renders navigation links", () => {
    renderWithRouter(<Footer />);
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
    // Add checks for other footer navigation links
  });
});
