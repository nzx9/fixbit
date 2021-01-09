import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Login", () => {
  render(<App />);
  const linkElement = screen.getByText("<h1>Login</h1>");
  expect(linkElement).toBeInTheDocument();
});
