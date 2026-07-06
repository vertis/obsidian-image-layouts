import { expect, test } from "vitest";
import { normalizeAlign, normalizeDescriptions } from "../src/utils/options.ts";

test("normalizeDescriptions handles YAML null and scalar values", () => {
  expect(normalizeDescriptions(undefined)).toEqual([]);
  expect(normalizeDescriptions(null)).toEqual([]);
  expect(normalizeDescriptions("just a string")).toEqual([]);
  expect(normalizeDescriptions(42)).toEqual([]);
});

test("normalizeDescriptions keeps sparse entries undefined so alt fallback applies", () => {
  expect(normalizeDescriptions([null, "second"])).toEqual([undefined, "second"]);
  expect(normalizeDescriptions([1, "two"])).toEqual(["1", "two"]);
});

test("normalizeAlign accepts only known modes", () => {
  expect(normalizeAlign("left")).toBe("left");
  expect(normalizeAlign("middle")).toBe("full");
  expect(normalizeAlign(null)).toBe("full");
  expect(normalizeAlign(undefined, "center")).toBe("center");
});
