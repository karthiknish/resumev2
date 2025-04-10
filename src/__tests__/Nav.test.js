import React from "react";
import { render, screen } from "@testing-library/react";
import Nav from "@/components/Nav"; // Adjust import path if needed

// Mocks for next/router and next-auth/react are now in jest.setup.js

// Mock next/link (keep this if needed specifically for Nav tests, though often covered by router mock)
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock ThemeSwitcher component (keep this)
jest.mock("@/components/ThemeSwitcher", () => {
  return function DummyThemeSwitcher() {
    return <div data-testid="theme-switcher-mock">Theme Switcher</div>;
  };
});

describe("Nav Component", () => {
  it("renders main navigation links", () => {
    render(<Nav />);

    // Check if primary navigation links are present
    // Note: These might only be visible on desktop viewports in the actual component
    // Testing Library renders in a jsdom environment which doesn't have a visual viewport size,
    // so it usually renders all conditional elements unless explicitly mocked otherwise.
    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Services" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Resources" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Blog" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Bytes" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  it("renders the logo link", () => {
    render(<Nav />);
    const logoLink = screen.getByRole("link", { name: /logo/i }); // Find link containing the logo image
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute("href", "/");
  });

  // Add more tests:
  // - Test mobile menu toggle
  // - Test search toggle
  // - Test rendering of admin/sign out links when authenticated
});
