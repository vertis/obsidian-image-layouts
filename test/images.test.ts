import { getImageFromLine, getImages } from "../src/utils/images.ts";
import { expect, test } from "vitest";

test("getImageFromLine with external link", () => {
  const line = "![Image](http://example.com/image.jpg)";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "external",
    link: "http://example.com/image.jpg",
    alt: "Image",
  });
});

test("getImageFromLine with external link without alt", () => {
  const line = "![](https://example.com/image.jpg)";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "external",
    link: "https://example.com/image.jpg",
    alt: "",
  });
});

test("getImageFromLine with internal link", () => {
  const line = "![Image](image.jpg)";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "wiki",
    link: "image.jpg",
    alt: "Image",
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

test("getImageFromLine with a non-image line", () => {
  expect(getImageFromLine("just some text")).toBeNull();
  expect(getImageFromLine("")).toBeNull();
});

test("getImages collects only embed lines", () => {
  const source = [
    "![[one.jpg]]",
    "some text",
    "![two](two.jpg)",
    "",
    "![three](https://example.com/three.jpg)",
  ].join("\n");
  const images = getImages(source);
  expect(images).toHaveLength(3);
  expect(images.map((i) => i.link)).toEqual([
    "one.jpg",
    "two.jpg",
    "https://example.com/three.jpg",
  ]);
});
