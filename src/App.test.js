import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Login check for Register Link", () => {
  render(<App />);
  const linkElement = screen.getByText(/Register/i);
  expect(linkElement).toBeInTheDocument();
});
