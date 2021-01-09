import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Login", () => {
  render(<App />);
  const linkElement = screen.getAllByText(/Login/i);
  expect(linkElement).toBeInTheDocument();
});
