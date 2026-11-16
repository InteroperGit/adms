// @vitest-environment node
import { expect, it } from "vitest";
import { getByRole } from "@testing-library/dom";
import Component from "./MobileHeaderContacts.astro";
import { render } from "../../../tests/helpers/render";

it.each([
  {
    address: "42 Sample Avenue, Suite 5, Sample City",
    city: "42 Sample Avenue",
    details: "Suite 5, Sample City",
  },
  {
    address: "Sample City, Sample Avenue 42",
    city: "Sample City",
    details: "Sample Avenue 42",
  },
  {
    address: "Sample Avenue 42",
    city: "Sample Avenue 42",
    details: "",
  },
])("renders native contact links and address: $address", async (fixture) => {
  const phone = "+7 900 123 45 67";
  const body = await render(Component, { phone, address: fixture.address });
  const group = getByRole(body, "group");
  const phoneAction = group.querySelector<HTMLAnchorElement>(
    ".mobile-header-phone",
  );
  const chatAction = group.querySelector<HTMLAnchorElement>(
    "[data-contact-menu-opener]",
  );
  const addressLink = group.querySelector<HTMLAnchorElement>(
    ".mobile-header-address",
  );

  expect(group).toHaveAccessibleName();
  expect(phoneAction?.tagName).toBe("A");
  expect(phoneAction).toHaveAttribute("href", "tel:+79001234567");
  expect(phoneAction).toHaveAccessibleName();
  expect(phoneAction?.querySelector(".lucide-phone")).not.toBeNull();

  expect(chatAction).toHaveAttribute("href", "/#contacts");
  expect(chatAction).toHaveAttribute("aria-controls", "contact-menu");
  expect(chatAction).toHaveAttribute("aria-expanded", "false");
  expect(chatAction).toHaveAccessibleName();
  expect(chatAction?.querySelector(".lucide-message-circle")).not.toBeNull();

  expect(addressLink).toHaveAttribute("href", "/#contacts");
  expect(addressLink).toHaveAccessibleName();
  expect(addressLink).toHaveAttribute("title", fixture.address);
  expect(addressLink?.querySelector(".mobile-header-address-city"))
    .toHaveTextContent(fixture.city);

  if (fixture.details) {
    expect(addressLink?.querySelector(".mobile-header-address-details"))
      .toHaveTextContent(fixture.details);
  } else {
    expect(addressLink?.querySelector(".mobile-header-address-details"))
      .toBeNull();
  }
});
