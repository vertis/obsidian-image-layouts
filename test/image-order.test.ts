import { expect, test } from "vitest";
import {
  getReorderDestination,
  reorderImagesInBlockSource,
} from "../src/utils/image-order.ts";

test("getReorderDestination accounts for removing the dragged item", () => {
  expect(getReorderDestination(0, 2, "before")).toBe(1);
  expect(getReorderDestination(0, 2, "after")).toBe(2);
  expect(getReorderDestination(2, 0, "before")).toBe(0);
  expect(getReorderDestination(2, 0, "after")).toBe(1);
  expect(getReorderDestination(1, 1, "before")).toBe(1);
  expect(getReorderDestination(1, 1, "after")).toBe(1);
});

test("reorders complete image lines and preserves unrelated source", () => {
  const source = [
    "---",
    "# favourite photos",
    "layout: custom",
    "grid: |",
    "  A B C",
    "fit: contain",
    "---",
    "![[one.jpg|First caption]]",
    "",
    "<!-- keep this comment in place -->",
    "![Second](two%20folder/two.jpg)",
    "![[three.jpg|Third|300x200]]",
    "",
  ].join("\n");
  expect(reorderImagesInBlockSource(source, 0, 2)).toBe(
    [
      "---",
      "# favourite photos",
      "layout: custom",
      "grid: |",
      "  A B C",
      "fit: contain",
      "---",
      "![Second](two%20folder/two.jpg)",
      "",
      "<!-- keep this comment in place -->",
      "![[three.jpg|Third|300x200]]",
      "![[one.jpg|First caption]]",
      "",
    ].join("\n"),
  );
});

test("moves images backwards and preserves a trailing newline", () => {
  const source = "![[one.jpg]]\n![[two.jpg]]\n![[three.jpg]]\n";
  expect(reorderImagesInBlockSource(source, 2, 0)).toBe(
    "![[three.jpg]]\n![[one.jpg]]\n![[two.jpg]]\n",
  );
});

test("reorders block descriptions with their images", () => {
  const source = [
    "---",
    "layout: masonry-2",
    "descriptions:",
    "  - First description",
    "  - Second description",
    "  - Third description",
    "---",
    "![[one.jpg|Inline one]]",
    "![[two.jpg|Inline two]]",
    "![[three.jpg|Inline three]]",
  ].join("\n");
  expect(reorderImagesInBlockSource(source, 0, 2)).toBe(
    [
      "---",
      "layout: masonry-2",
      "descriptions:",
      "  - Second description",
      "  - Third description",
      "  - First description",
      "---",
      "![[two.jpg|Inline two]]",
      "![[three.jpg|Inline three]]",
      "![[one.jpg|Inline one]]",
    ].join("\n"),
  );
});

test("reorders inline descriptions with quoted commas and comments", () => {
  const source = [
    "---",
    "descriptions: [\"First, one\", 'Second', Third] # keep",
    "layout: a",
    "---",
    "![[one.jpg]]",
    "![[two.jpg]]",
    "![[three.jpg]]",
  ].join("\n");
  expect(reorderImagesInBlockSource(source, 2, 0)).toBe(
    [
      "---",
      "descriptions: [Third, \"First, one\", 'Second'] # keep",
      "layout: a",
      "---",
      "![[three.jpg]]",
      "![[one.jpg]]",
      "![[two.jpg]]",
    ].join("\n"),
  );
});

test("pads sparse descriptions with null before moving them", () => {
  const source = [
    "---",
    "descriptions:",
    "- First description",
    "---",
    "![[one.jpg]]",
    "![[two.jpg]]",
    "![[three.jpg]]",
  ].join("\n");
  expect(reorderImagesInBlockSource(source, 0, 2)).toBe(
    [
      "---",
      "descriptions:",
      "- null",
      "- null",
      "- First description",
      "---",
      "![[two.jpg]]",
      "![[three.jpg]]",
      "![[one.jpg]]",
    ].join("\n"),
  );
});

test("keeps extra descriptions after the image-associated entries", () => {
  const source = [
    "---",
    "descriptions: [First, Second, Extra]",
    "---",
    "![[one.jpg]]",
    "![[two.jpg]]",
  ].join("\n");
  expect(reorderImagesInBlockSource(source, 0, 1)).toBe(
    [
      "---",
      "descriptions: [Second, First, Extra]",
      "---",
      "![[two.jpg]]",
      "![[one.jpg]]",
    ].join("\n"),
  );
});

test("same-position drops and sources without descriptions are unchanged", () => {
  const source = "![[one.jpg]]\n![[two.jpg]]";
  expect(reorderImagesInBlockSource(source, 1, 1)).toBe(source);
  expect(reorderImagesInBlockSource(source, 0, 1)).toBe(
    "![[two.jpg]]\n![[one.jpg]]",
  );
});

test("rejects invalid indexes and malformed frontmatter", () => {
  const source = "![[one.jpg]]\n![[two.jpg]]";
  expect(reorderImagesInBlockSource(source, -1, 1)).toBeNull();
  expect(reorderImagesInBlockSource(source, 0, 2)).toBeNull();
  expect(reorderImagesInBlockSource(source, 0.5, 1)).toBeNull();
  expect(
    reorderImagesInBlockSource(
      '---\ndescriptions: ["unterminated]\n---\n![[one.jpg]]\n![[two.jpg]]',
      0,
      1,
    ),
  ).toBeNull();
});

test("rejects multiline descriptions instead of corrupting them", () => {
  const source = [
    "---",
    "descriptions:",
    "  - First description",
    "    continued on another line",
    "  - Second description",
    "---",
    "![[one.jpg]]",
    "![[two.jpg]]",
  ].join("\n");
  expect(reorderImagesInBlockSource(source, 0, 1)).toBeNull();
});

test("supports remote images and percent-encoded local paths", () => {
  const source =
    "![Remote](https://example.com/image.png)\n![](Test%20folder/local.png)";
  expect(reorderImagesInBlockSource(source, 1, 0)).toBe(
    "![](Test%20folder/local.png)\n![Remote](https://example.com/image.png)",
  );
});


test("preserves descriptions with a dot frontmatter closing delimiter", () => {
  const source = [
    "---",
    "descriptions: [First, Second]",
    "...",
    "![[one.jpg]]",
    "![[two.jpg]]",
  ].join("\n");
  expect(reorderImagesInBlockSource(source, 0, 1)).toBe(
    [
      "---",
      "descriptions: [Second, First]",
      "...",
      "![[two.jpg]]",
      "![[one.jpg]]",
    ].join("\n"),
  );
});

test("preserves descriptions with yaml delimiters", () => {
  const source = [
    "= yaml =",
    "descriptions: [First, Second]",
    "= yaml =",
    "![[one.jpg]]",
    "![[two.jpg]]",
  ].join("\n");
  expect(reorderImagesInBlockSource(source, 0, 1)).toBe(
    [
      "= yaml =",
      "descriptions: [Second, First]",
      "= yaml =",
      "![[two.jpg]]",
      "![[one.jpg]]",
    ].join("\n"),
  );
});

test("rejects tagged and aliased descriptions instead of detaching them", () => {
  const tagged = [
    "---",
    "descriptions: !!seq [First, Second]",
    "---",
    "![[one.jpg]]",
    "![[two.jpg]]",
  ].join("\n");
  expect(reorderImagesInBlockSource(tagged, 0, 1)).toBeNull();

  const aliased = [
    "---",
    "shared: &shared [First, Second]",
    "descriptions: *shared",
    "---",
    "![[one.jpg]]",
    "![[two.jpg]]",
  ].join("\n");
  expect(reorderImagesInBlockSource(aliased, 0, 1)).toBeNull();
});
