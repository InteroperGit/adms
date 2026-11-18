// @vitest-environment node
import { expect, it } from "vitest";
import { getByRole } from "@testing-library/dom";
import Component from "./Disclosure.astro";
import { render } from "../../../tests/helpers/render";

it("renders a closed native disclosure with its summary and slot", async () => {
  const body = await render(
    Component,
    { id: "delivery", class: "delivery-panel", summary: "Delivery details" },
    { default: "<p>Delivery by agreement.</p>" },
  );
  const details = getByRole(body, "group");

  expect(details).toHaveAttribute("id", "delivery");
  expect(details).toHaveClass("delivery-panel");
  expect(details).not.toHaveAttribute("open");
  expect(details.firstElementChild).toHaveTextContent("Delivery details");
  expect(details.firstElementChild?.tagName).toBe("SUMMARY");
  expect(details.querySelector("p")).toHaveTextContent("Delivery by agreement");
});
