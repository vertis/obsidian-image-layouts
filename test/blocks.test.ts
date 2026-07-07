import { expect, test } from "vitest";
import {
  buildLayoutBlock,
  parseMasonryLayoutName,
  replaceFenceLayout,
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
