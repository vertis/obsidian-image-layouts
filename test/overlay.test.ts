import { expect, test } from "vitest";
import { resolveOverlayMode } from "../src/utils/overlay.ts";
import type { ImageLayoutsSettings } from "../src/types.ts";

const settings = (
  overrides: Partial<ImageLayoutsSettings> = {},
): ImageLayoutsSettings => ({
  shouldOverlayPermanently: false,
  overlayMode: "hover",
  placeholderImage: "",
  ...overrides,
});

test("defaults to the global overlay mode", () => {
  expect(resolveOverlayMode(null, settings())).toBe("hover");
  expect(resolveOverlayMode({}, settings({ overlayMode: "never" }))).toBe(
    "never",
  );
  expect(resolveOverlayMode(undefined, settings({ overlayMode: "always" }))).toBe(
    "always",
  );
});

test("per-block overlay wins over everything", () => {
  expect(
    resolveOverlayMode(
      { overlay: "never", permanentOverlay: true },
      settings({ overlayMode: "always" }),
    ),
  ).toBe("never");
});

test("invalid per-block overlay values fall through", () => {
  expect(
    resolveOverlayMode({ overlay: "sometimes" }, settings({ overlayMode: "never" })),
  ).toBe("never");
});

test("legacy per-block permanentOverlay boolean still works", () => {
  expect(resolveOverlayMode({ permanentOverlay: true }, settings())).toBe(
    "always",
  );
  expect(
    resolveOverlayMode(
      { permanentOverlay: false },
      settings({ overlayMode: "always" }),
    ),
  ).toBe("hover");
});

test("legacy global toggle applies when overlayMode is missing", () => {
  const legacySettings = {
    shouldOverlayPermanently: true,
  } as ImageLayoutsSettings;
  expect(resolveOverlayMode(null, legacySettings)).toBe("always");
});
