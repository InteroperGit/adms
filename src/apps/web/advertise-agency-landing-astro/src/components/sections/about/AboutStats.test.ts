// @vitest-environment node
import { expect, it } from "vitest";
import { getByText } from "@testing-library/dom";
import Component from "./AboutStats.astro";
import { render } from "../../../../tests/helpers/render";

it("keeps values paired with labels in order", async () => {
  const body = await render(Component, {
    items: [
      { value: "12", label: "years" },
      { value: "300+", label: "projects completed" },
    ],
  });
  const entries = body.querySelectorAll("dl > div");

  expect(entries).toHaveLength(2);
  expect(entries[0].querySelector("dt")).toHaveTextContent("years");
  expect(entries[0].querySelector("dd")).toHaveTextContent("12");
  expect(entries[1].querySelector("dt")).toHaveTextContent(
    "projects completed",
  );
  expect(entries[1].querySelector("dd")).toHaveTextContent("300+");
  expect(getByText(body, "projects completed")).toBeInTheDocument();
});

it("renders an empty definition list", async () => {
  const body = await render(Component, { items: [] });

  expect(body.querySelector("dl")).toBeInTheDocument();
  expect(body.querySelectorAll("dt, dd")).toHaveLength(0);
});
