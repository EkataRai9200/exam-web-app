import { render, screen } from "@testing-library/react";

describe("Loader", () => {
  test("renders heading", async () => {
    render(<p>Hello world</p>);
    expect(screen.getByRole("heading", { name: "Hello" })).toBeInTheDocument();
  });
});