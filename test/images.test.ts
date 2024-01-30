import { getImageFromLine } from "../src/utils/images.ts";
import { expect, test } from "vitest";

test("getImageFromLine with external link", () => {
  const line = "![Image](http://example.com/image.jpg)";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "external",
    link: "http://example.com/image.jpg",
  });
});

test("getImageFromLine with internal link", () => {
  const line = "![Image](image.jpg)";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "wiki",
    link: "image.jpg",
  });
});

test("getImageFromLine with wiki link", () => {
  const line = "![[image.jpg]]";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "wiki",
    link: "image.jpg",
  });
});
