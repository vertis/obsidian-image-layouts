import { beforeEach, expect, test } from "vitest";
import { Platform } from "obsidian";
import { hasReorderModifier } from "../src/utils/drag-reorder.ts";

const event = (ctrlKey: boolean, metaKey: boolean) => ({
  ctrlKey,
  metaKey,
  altKey: false,
  shiftKey: false,
});

beforeEach(() => {
  Platform.isMacOS = false;
});

test("default uses Ctrl outside macOS", () => {
  expect(hasReorderModifier(event(true, false), "default")).toBe(true);
  expect(hasReorderModifier(event(false, true), "default")).toBe(false);
});

test("default uses Meta on macOS", () => {
  Platform.isMacOS = true;
  expect(hasReorderModifier(event(false, true), "default")).toBe(true);
  expect(hasReorderModifier(event(true, false), "default")).toBe(false);
});

test("Meta can be selected on Linux", () => {
  expect(hasReorderModifier(event(false, true), "meta")).toBe(true);
  expect(hasReorderModifier(event(true, false), "meta")).toBe(false);
});

test("Ctrl can be selected on macOS", () => {
  Platform.isMacOS = true;
  expect(hasReorderModifier(event(true, false), "ctrl")).toBe(true);
  expect(hasReorderModifier(event(false, true), "ctrl")).toBe(false);
});

test("Alt and Shift use their respective modifier flags", () => {
  expect(
    hasReorderModifier(
      { ctrlKey: false, metaKey: false, altKey: true, shiftKey: false },
      "alt",
    ),
  ).toBe(true);
  expect(
    hasReorderModifier(
      { ctrlKey: false, metaKey: false, altKey: false, shiftKey: true },
      "shift",
    ),
  ).toBe(true);
  expect(hasReorderModifier(event(true, true), "alt")).toBe(false);
});


test("None allows an unmodified drag", () => {
  expect(hasReorderModifier(event(false, false), "none")).toBe(true);
  expect(hasReorderModifier(event(true, true), "none")).toBe(true);
});
