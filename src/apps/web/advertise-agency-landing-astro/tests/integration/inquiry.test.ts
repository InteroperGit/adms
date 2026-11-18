// Static HTML composition; browser scripts remain covered by E2E.
// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import OrderInquiry from "../../src/components/sections/OrderInquiry.astro";
import OrderFormBlock from "../../src/components/content/OrderFormBlock.astro";
import ContactMenu from "@/components/site-shell/header/ContactMenu.astro";
import type { OrderInquiryContent } from "../../src/types/orderInquiry";
import { render } from "../helpers/render";

const inquiryConfig = vi.hoisted(() => ({
  enabled: false,
}));

vi.mock("@/content/orderInquiry", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/content/orderInquiry")>();
  return {
    ...actual,
    get orderInquiry(): OrderInquiryContent {
      return {
        ...actual.orderInquiry,
        submission: {
          ...actual.orderInquiry.submission,
          enabled: inquiryConfig.enabled,
        },
      };
    },
  };
});

afterEach(() => {
  inquiryConfig.enabled = false;
});

it("composes inquiry fields, consent, status, and no-JS fallback", async () => {
  const body = await render(OrderInquiry);

  const form = body.querySelector<HTMLFormElement>("#order-inquiry form")!;
  expect(form).toHaveAttribute("method", "post");
  expect(form).toHaveAttribute("data-enabled", "false");
  expect(form.querySelector("fieldset")).toBeDisabled();
  expect(form.querySelector('[name="name"]')).toHaveAttribute("type", "text");
  expect(form.querySelector('[name="email"]')).toHaveAttribute("type", "email");
  expect(form.querySelector('[name="phone"]')).toHaveAttribute("type", "tel");
  expect(form.querySelector('[name="message"]')).toHaveAttribute(
    "aria-describedby",
    "inquiry-message-hint inquiry-message-error",
  );
  expect(form.querySelector('[name="consent"]')).toBeRequired();
  expect(form.querySelector('a[href="/privacy-policy"]')).toBeInTheDocument();
  expect(form.querySelector('[type="submit"]')).toBeDisabled();
  expect(form.querySelector('[role="status"]')).toHaveAttribute(
    "aria-live",
    "polite",
  );
  expect(form.querySelector('[role="status"]')).toHaveTextContent(
    "TEST_UNAVAILABLE",
  );
  expect(form.querySelector("noscript")).toHaveTextContent("JavaScript");
});

it("keeps enabled inquiry controls disabled in SSR", async () => {
  inquiryConfig.enabled = true;
  const body = await render(OrderInquiry);

  const form = body.querySelector<HTMLFormElement>("#order-inquiry form")!;
  expect(form).toHaveAttribute("data-enabled", "true");
  expect(form).toHaveAttribute("data-endpoint", "/__fixture/inquiry");
  expect(form.querySelector("fieldset")).toBeDisabled();
  expect(form.querySelector('[type="submit"]')).toBeDisabled();
  expect(form.querySelector('[role="status"]')).toBeEmptyDOMElement();
  expect(form.querySelector("[data-smartcaptcha]")).toHaveAttribute(
    "data-sitekey",
  );
  expect(form.querySelector('script[src*="yandex"]')).toBeNull();
});

it("ties registered project and service forms to their owners", async () => {
  const block = {
    type: "order-form",
    id: "led-letters",
    formId: "led-letters",
    context: "service",
    category: "svetovye-bukvy",
    status: "published",
    provenance: { source: "integration fixture" },
  } as const;
  const published = await render(OrderFormBlock, {
    block,
    context: {
      kind: "service",
      serviceId: "svetovye-bukvy",
      category: "svetovye-bukvy",
      published: true,
    },
  });
  const rejected = await render(OrderFormBlock, {
    block,
    context: {
      kind: "service",
      serviceId: "neon",
      category: "neon",
      published: true,
    },
  });
  const project = await render(OrderFormBlock, {
    block: { ...block, context: "project", category: "led-letters" },
    context: {
      kind: "project",
      projectId: 82,
      category: "led-letters",
      published: true,
    },
  });

  expect(published.querySelector("section#led-letters")).toBeInTheDocument();
  expect(published.querySelector('input[name="serviceId"]')).toHaveValue(
    "svetovye-bukvy",
  );
  expect(rejected.querySelector("[data-led-letters]")).toBeNull();
  expect(
    rejected.querySelector('a[href="/#order-inquiry"]'),
  ).toBeInTheDocument();
  expect(project.querySelector('[name="projectId"]')).toHaveValue("82");
  expect(project.querySelector("[data-led-letters]")).toBeInTheDocument();
});

it("uses a native general inquiry link for unregistered form IDs", async () => {
  const body = await render(OrderFormBlock, {
    block: {
      type: "order-form",
      id: "general-request",
      formId: "general-inquiry",
      context: "service",
      category: "svetovye-bukvy",
      status: "published",
    },
    context: {
      kind: "service",
      serviceId: "svetovye-bukvy",
      category: "svetovye-bukvy",
      published: true,
    },
  });

  expect(body.querySelector("section#general-request")).toBeInTheDocument();
  expect(body.querySelector("[data-led-letters]")).toBeNull();
  expect(body.querySelector('a[href="/#order-inquiry"]')).toBeInTheDocument();
});

it("keeps callback submission disabled with its privacy link", async () => {
  const body = await render(ContactMenu);

  const dialog = body.querySelector<HTMLDialogElement>("#callback-dialog")!;
  const form = dialog.querySelector("form")!;
  expect(dialog.querySelector("[data-callback-form]")).toBeInTheDocument();
  expect(form.querySelector('[name="name"]')).toBeRequired();
  expect(form.querySelector('[name="phone"]')).toHaveAttribute("type", "tel");
  expect(form.querySelector('[name="consent"]')).toBeRequired();
  expect(form.querySelector('a[href="/privacy-policy"]')).toBeInTheDocument();
  expect(form).not.toHaveAttribute("action");
  expect(form.querySelector('[type="submit"]')).toBeDisabled();
});
