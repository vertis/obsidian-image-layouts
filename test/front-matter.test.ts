import { expect, test } from "vitest";
import {
  parseFrontMatterBlock,
  stringifyFrontMatterBlock,
} from "../src/utils/front-matter.ts";

test("stringifyFrontMatterBlock output shape matches what the picker writes back", () => {
  const out = stringifyFrontMatterBlock("![[img.jpg]]\n", { layout: "a" });
  expect(out).toBe('---\nlayout: "a"\n---\n![[img.jpg]]\n');
});

test("stringifyFrontMatterBlock appends a trailing newline to the body", () => {
  const out = stringifyFrontMatterBlock("![[img.jpg]]", { layout: "a" });
  expect(out.endsWith("![[img.jpg]]\n")).toBe(true);
});

test("stringifyFrontMatterBlock round-trips through parseFrontMatterBlock", () => {
  const data = {
    layout: "carousel",
    carouselShowThumbnails: true,
    caption: "colons: quotes \" and 'single' — all fine",
    descriptions: ["first", "with | pipe", "with: colon"],
    limit: 3,
  };
  const body = "![[one.jpg]]\n![two](two.jpg)\n";
  const out = stringifyFrontMatterBlock(body, data);
  const parsed = parseFrontMatterBlock<typeof data>(out);
  expect(parsed.error).toBeUndefined();
  expect(parsed.data).toEqual(data);
  expect(parsed.body).toBe(body);
});

test("stringifyFrontMatterBlock skips undefined values", () => {
  const out = stringifyFrontMatterBlock("", {
    layout: "carousel",
    carouselShowThumbnails: undefined,
  });
  expect(out).toBe('---\nlayout: "carousel"\n---\n');
});
