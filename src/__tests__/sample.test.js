import { render, screen } from "@testing-library/react";

describe("Sample Test", () => {
  it("renders a simple message", () => {
    render(<div>Hello, Jest!</div>);
    expect(screen.getByText("Hello, Jest!")).toBeInTheDocument();
  });
});
