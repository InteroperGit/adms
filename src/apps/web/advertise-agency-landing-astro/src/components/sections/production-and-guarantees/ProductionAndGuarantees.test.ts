// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
import { getByRole } from "@testing-library/dom";
import Component from "./ProductionAndGuarantees.astro";
import { render } from "../../../../tests/helpers/render";

const approval = vi.hoisted(() => ({ enabled: false }));

vi.mock("@/content/productionAndGuarantees", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/content/productionAndGuarantees")>();
  const content = actual.productionAndGuarantees;

  return {
    get productionAndGuarantees() {
      const approve = <T extends { approval: "draft" | "approved" }>(
        item: T,
      ) => ({
        ...item,
        approval: approval.enabled ? "approved" : item.approval,
      });

      return {
        ...content,
        demoMode: false,
        copyApproved: approval.enabled,
        productionOperations: content.productionOperations.map(approve),
        materials: content.materials.map(approve),
        qualityChecks: content.qualityChecks.map(approve),
        photos: approval.enabled
          ? [
              {
                src: "/images/fixture.webp",
                alt: "Synthetic production photo",
                caption: "Synthetic caption",
                width: 640,
                height: 480,
                source: "fixture",
                rights: "fixture",
                approval: "approved",
              },
            ]
          : content.photos,
        warrantyTerms: content.warrantyTerms.map(approve),
        maintenance: {
          ...content.maintenance,
          approval: approval.enabled ? "approved" : "draft",
        },
      };
    },
  };
});

afterEach(() => {
  approval.enabled = false;
});

it("shows guidance and hides unapproved production evidence", async () => {
  const body = await render(Component, {});
  expect(Component).toBeDefined();
  expect(getByRole(body, "heading", { level: 2 })).toBeInTheDocument();
  expect(
    body.querySelectorAll(".card-carousel .production-card"),
  ).not.toHaveLength(0);
  expect(body.querySelector(".production-photos")).toBeNull();
  expect(body.querySelector(".production-groups")).toBeInTheDocument();
  expect(body.querySelector(".production-action a")).toHaveAttribute("href");
  expect(body.querySelector(".warranty-group")).toBeNull();
  expect(body.querySelector(".maintenance-group")).toBeNull();
});

it("shows approved production evidence and service details", async () => {
  approval.enabled = true;
  const body = await render(Component, {});

  expect(body.querySelector(".production-photos img")).toHaveAttribute(
    "alt",
    "Synthetic production photo",
  );
  expect(body.querySelector(".production-groups")).toHaveTextContent(
    "TEST_EVIDENCE",
  );
  expect(body.querySelector(".warranty-group")).toBeInTheDocument();
  expect(body.querySelector(".maintenance-group")).toBeInTheDocument();
});
