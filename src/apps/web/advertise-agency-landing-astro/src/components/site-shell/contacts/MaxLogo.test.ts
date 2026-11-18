// The messenger mark is decorative beside its caller's link label.
// @vitest-environment node
import { expect, it } from "vitest";
import MaxLogo from "./MaxLogo.astro";
import { render } from "../../../../tests/helpers/render";

it("renders a local decorative messenger mark", async () => {
  const body = await render(MaxLogo);
  const logo = body.querySelector("svg.max-logo");

  expect(logo).toHaveAttribute("viewBox", "0 0 32 32");
  expect(logo).toHaveAttribute("width", "32");
  expect(logo).toHaveAttribute("height", "32");
  expect(logo).toHaveAttribute("role", "img");
  expect(logo).toHaveAttribute("aria-hidden", "true");
  expect(logo?.querySelector("rect")).toHaveAttribute("rx", "9");
  expect(logo?.querySelector("path")).toHaveAttribute(
    "d",
    "M8 22V10h3l5 6 5-6h3v12h-3v-6l-4 5h-2l-4-5v6H8Z",
  );
  expect(body.querySelectorAll("img, a")).toHaveLength(0);
});
