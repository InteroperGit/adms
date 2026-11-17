// Check rendered theme colors and utility output, independently of data-theme.
import type { Page } from "@playwright/test";
import { expect } from "../fixtures";

export type SiteTheme = "light" | "dark";

const palettes = {
  light: {
    surface: "rgb(255, 255, 255)",
    ink: "rgb(24, 34, 45)",
    muted: "rgb(82, 97, 112)",
    boundary: "rgb(104, 119, 135)",
    primary: "rgb(178, 56, 10)",
    panel: "rgba(24, 34, 45, 0.08) 0px 4px 16px 0px",
    elevated: "rgba(24, 34, 45, 0.12) 0px 8px 28px 0px",
    footer: "rgb(24, 34, 45)",
  },
  dark: {
    surface: "rgb(24, 33, 43)",
    ink: "rgb(237, 242, 247)",
    muted: "rgb(189, 200, 212)",
    boundary: "rgb(135, 152, 170)",
    primary: "rgb(255, 160, 77)",
    panel: "rgba(0, 0, 0, 0.18) 0px 4px 16px 0px",
    elevated: "rgba(0, 0, 0, 0.24) 0px 8px 28px 0px",
    footer: "rgb(32, 44, 56)",
  },
} as const;

/** Assert the document and scoped surfaces, including when JS is disabled. */
export async function expectThemeStyles(page: Page, theme: SiteTheme) {
  const palette = palettes[theme];
  // Read one coherent computed-style sample per poll instead of making many
  // browser round trips. A hidden sample covers utilities absent in fixtures.
  await expect
    .poll(() =>
      page.evaluate(() => {
        const probe = document.createElement("div");
        probe.hidden = true;
        const utility = document.createElement("span");
        utility.className =
          "text-muted border-control-border shadow-panel rounded-panel";
        const elevated = document.createElement("span");
        elevated.className = "shadow-elevated";
        const direct = document.createElement("span");
        direct.style.boxShadow = "var(--shadow-panel)";
        direct.style.color = "var(--color-brand)";
        probe.append(utility, elevated, direct);
        document.body.append(probe);

        try {
          const body = getComputedStyle(document.body);
          const root = getComputedStyle(document.documentElement);
          const footer = document.querySelector("footer");
          const settings = document.querySelector(".settings-panel");
          if (!footer || !settings) {
            return null;
          }
          const panel = getComputedStyle(settings);
          const sample = getComputedStyle(utility);
          const tokens = getComputedStyle(direct);
          return {
            scheme: root.colorScheme,
            surface: body.backgroundColor,
            ink: body.color,
            footer: getComputedStyle(footer).backgroundColor,
            panel: {
              shadow: panel.boxShadow,
              boundary: panel.borderColor,
              radius: panel.borderRadius,
            },
            utility: {
              muted: sample.color,
              boundary: sample.borderColor,
              radius: sample.borderRadius,
              shadow: sample.boxShadow,
              elevated: getComputedStyle(elevated).boxShadow,
            },
            directShadow: tokens.boxShadow,
            brand: tokens.color,
          };
        } finally {
          probe.remove();
        }
      }),
    )
    .toEqual({
      scheme: theme,
      surface: palette.surface,
      ink: palette.ink,
      footer: palette.footer,
      panel: {
        shadow: palette.elevated,
        boundary: palette.boundary,
        radius: "8px",
      },
      utility: {
        muted: palette.muted,
        boundary: palette.boundary,
        radius: "16px",
        // Preserve the existing light compile-time utility shadow recipes.
        shadow: expect.stringMatching(
          /rgba\(24, 34, 45, 0\.08\) 0px 4px 16px 0px$/,
        ),
        elevated: expect.stringMatching(
          /rgba\(24, 34, 45, 0\.12\) 0px 8px 28px 0px$/,
        ),
      },
      directShadow: palette.panel,
      brand: "rgb(234, 88, 12)",
    });
}

/** Check the document-wide focus ring after real keyboard navigation. */
export async function expectDocumentFocus(page: Page, theme: SiteTheme) {
  const focused = page.locator(":focus-visible");
  await expect(focused).toHaveCount(1);
  await expect(focused).toHaveCSS("outline-style", "solid");
  await expect(focused).toHaveCSS("outline-width", "2px");
  await expect(focused).toHaveCSS("outline-offset", "4px");
  await expect(focused).toHaveCSS("outline-color", palettes[theme].primary);
}
