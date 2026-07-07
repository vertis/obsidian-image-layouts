import { expect, test } from "vitest";
import { parseCustomGrid } from "../src/utils/custom-grid.ts";

test("parseCustomGrid maps tokens in order of first appearance", () => {
  const result = parseCustomGrid("A A B\nA A C\n");
  expect(result.error).toBeUndefined();
  expect(result.grid).toEqual({
    columns: 3,
    rows: 2,
    slots: 3,
    templateAreas: '"image-0 image-0 image-1" "image-0 image-0 image-2"',
  });
});

test("parseCustomGrid supports empty cells with dots", () => {
  const result = parseCustomGrid("A . B\nA . B");
  expect(result.grid?.templateAreas).toBe(
    '"image-0 . image-1" "image-0 . image-1"',
  );
  expect(result.grid?.slots).toBe(2);
});

test("parseCustomGrid accepts a single row", () => {
  const result = parseCustomGrid("A B C D");
  expect(result.grid?.columns).toBe(4);
  expect(result.grid?.slots).toBe(4);
});

test("parseCustomGrid rejects ragged rows", () => {
  const result = parseCustomGrid("A A\nA");
  expect(result.error).toMatch(/same number of cells/);
});

test("parseCustomGrid rejects non-rectangular regions", () => {
  // A forms an L shape
  const result = parseCustomGrid("A A\nA B");
  expect(result.error).toMatch(/solid rectangle/);
});

test("parseCustomGrid rejects disjoint regions of the same token", () => {
  const result = parseCustomGrid("A B A");
  expect(result.error).toMatch(/solid rectangle/);
});

test("parseCustomGrid rejects missing or empty grids", () => {
  expect(parseCustomGrid(undefined).error).toBeDefined();
  expect(parseCustomGrid(null).error).toBeDefined();
  expect(parseCustomGrid("").error).toBeDefined();
  expect(parseCustomGrid(". .\n. .").error).toMatch(/at least one/);
});

test("parseCustomGrid handles multi-character tokens", () => {
  const result = parseCustomGrid("hero hero side\nhero hero foot");
  expect(result.grid?.slots).toBe(3);
  expect(result.grid?.templateAreas).toBe(
    '"image-0 image-0 image-1" "image-0 image-0 image-2"',
  );
});
