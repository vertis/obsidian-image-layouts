import { expect, test } from "vitest";
import {
  buildLayoutBlock,
  parseMasonryLayoutName,
  replaceFenceLayout,
  updateLayoutInBlockSource,
} from "../src/utils/blocks.ts";

test("parseMasonryLayoutName accepts masonry-2 through masonry-6", () => {
  expect(parseMasonryLayoutName("masonry-2")).toBe(2);
  expect(parseMasonryLayoutName("masonry-6")).toBe(6);
  expect(parseMasonryLayoutName("masonry-7")).toBeNull();
  expect(parseMasonryLayoutName("masonry-1")).toBeNull();
  expect(parseMasonryLayoutName("carousel")).toBeNull();
  expect(parseMasonryLayoutName("a")).toBeNull();
});

test("replaceFenceLayout renames legacy fence tokens", () => {
  expect(replaceFenceLayout("```image-layout-a", "b")).toBe("```image-layout-b");
  expect(replaceFenceLayout("```image-layout-masonry-3", "a")).toBe(
    "```image-layout-a",
  );
  expect(replaceFenceLayout("```image-layout-left", "masonry-4")).toBe(
    "```image-layout-masonry-4",
  );
  expect(replaceFenceLayout("````image-layout-h", "i")).toBe(
    "````image-layout-i",
  );
});

test("replaceFenceLayout rejects non-fence lines", () => {
  expect(replaceFenceLayout("![[image.jpg]]", "a")).toBeNull();
  expect(replaceFenceLayout("```image-layout", "a")).toBeNull();
  expect(replaceFenceLayout("```python", "a")).toBeNull();
  expect(replaceFenceLayout("text ```image-layout-a", "a")).toBeNull();
});

test("buildLayoutBlock wraps selected content", () => {
  const block = buildLayoutBlock(
    { type: "a" },
    "![[one.jpg]]\n![[two.jpg]]",
  );
  expect(block).toBe(
    "```image-layout\n---\nlayout: a\n---\n![[one.jpg]]\n![[two.jpg]]\n```\n",
  );
});

test("buildLayoutBlock with carousel thumbnails and empty content", () => {
  const block = buildLayoutBlock({
    type: "carousel",
    params: { showThumbnails: true },
  });
  expect(block).toBe(
    "```image-layout\n---\nlayout: carousel\ncarouselShowThumbnails: true\n---\n```\n",
  );
});

test("updateLayoutInBlockSource preserves comments, formatting, and key order", () => {
  const source = [
    "---",
    "# my favourite photos",
    "caption: Summer",
    "layout: a",
    "descriptions:",
    "- first",
    "- second",
    "---",
    "![[one.jpg]]",
    "![[two.jpg]]",
    "",
  ].join("\n");
  const updated = updateLayoutInBlockSource(source, { type: "masonry-3" });
  expect(updated).toBe(
    [
      "---",
      "# my favourite photos",
      "caption: Summer",
      "layout: masonry-3",
      "descriptions:",
      "- first",
      "- second",
      "---",
      "![[one.jpg]]",
      "![[two.jpg]]",
      "",
    ].join("\n"),
  );
});

test("updateLayoutInBlockSource adds a layout line when frontmatter has none", () => {
  const source = "---\ncaption: Hi\n---\n![[a.jpg]]\n";
  expect(updateLayoutInBlockSource(source, { type: "b" })).toBe(
    "---\ncaption: Hi\nlayout: b\n---\n![[a.jpg]]\n",
  );
});

test("updateLayoutInBlockSource prepends frontmatter when there is none", () => {
  expect(updateLayoutInBlockSource("![[a.jpg]]", { type: "single" })).toBe(
    "---\nlayout: single\n---\n![[a.jpg]]\n",
  );
});

test("updateLayoutInBlockSource manages the carousel thumbnails line", () => {
  const withThumbs = updateLayoutInBlockSource("---\nlayout: a\n---\n", {
    type: "carousel",
    params: { showThumbnails: true },
  });
  expect(withThumbs).toBe(
    "---\nlayout: carousel\ncarouselShowThumbnails: true\n---\n",
  );
  const backToPills = updateLayoutInBlockSource(withThumbs, {
    type: "carousel",
  });
  expect(backToPills).toBe("---\nlayout: carousel\n---\n");
});

test("buildLayoutBlock lengthens its fence past backtick runs in the content", () => {
  const block = buildLayoutBlock({ type: "a" }, "```js\ncode\n```");
  expect(block.startsWith("````image-layout\n")).toBe(true);
  expect(block.endsWith("\n````\n")).toBe(true);
});

test("updateLayoutInBlockSource seeds a starter grid when picking custom", () => {
  expect(updateLayoutInBlockSource("![[a.jpg]]\n", { type: "custom" })).toBe(
    "---\nlayout: custom\ngrid: |\n  A A B\n  A A C\n---\n![[a.jpg]]\n",
  );
  expect(
    updateLayoutInBlockSource("---\ncaption: Hi\n---\n", { type: "custom" }),
  ).toBe("---\ncaption: Hi\nlayout: custom\ngrid: |\n  A A B\n  A A C\n---\n");
});

test("updateLayoutInBlockSource keeps an existing grid when picking custom", () => {
  const source = "---\nlayout: a\ngrid: |\n  X X\n  Y Z\n---\n![[a.jpg]]\n";
  expect(updateLayoutInBlockSource(source, { type: "custom" })).toBe(
    "---\nlayout: custom\ngrid: |\n  X X\n  Y Z\n---\n![[a.jpg]]\n",
  );
});
