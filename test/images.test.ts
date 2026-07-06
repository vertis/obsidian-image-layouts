import { expect, test } from "vitest";
import { getImageFromLine, getImages, safeDecode } from "../src/utils/images.ts";

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
  });
});

test("getImageFromLine does not decode external links", () => {
  const line = "![](https://example.com/some%20image.jpg)";
  const result = getImageFromLine(line);
  expect(result?.link).toBe("https://example.com/some%20image.jpg");
});

test("getImageFromLine with internal markdown link", () => {
  const line = "![Image](image.jpg)";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "wiki",
    link: "image.jpg",
    alt: "Image",
  });
});

test("getImageFromLine keeps percent-encoded local paths raw for the resolver", () => {
  // Obsidian inserts markdown-style local links percent-encoded (#32)
  const line = "![](Test%20folder/attachments/image.jpg)";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "wiki",
    link: "Test%20folder/attachments/image.jpg",
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

test("getImageFromLine with wiki link caption (#22)", () => {
  const line = "![[image.jpg|My caption]]";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "wiki",
    link: "image.jpg",
    alt: "My caption",
  });
});

test("getImageFromLine with wiki link size hint (#33)", () => {
  const line = "![[image.jpg|300]]";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "wiki",
    link: "image.jpg",
    width: 300,
  });
});

test("getImageFromLine with wiki link width x height", () => {
  const line = "![[image.jpg|300x200]]";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "wiki",
    link: "image.jpg",
    width: 300,
    height: 200,
  });
});

test("getImageFromLine with wiki link caption and size", () => {
  const line = "![[image.jpg|My caption|300]]";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "wiki",
    link: "image.jpg",
    alt: "My caption",
    width: 300,
  });
});

test("getImageFromLine with markdown alt pipe size", () => {
  const line = "![My caption|300](image.jpg)";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "wiki",
    link: "image.jpg",
    alt: "My caption",
    width: 300,
  });
});

test("getImageFromLine with file:// url stays a wiki link for the resolver (#17)", () => {
  const line = "![](file:///Users/someone/Pictures/photo.jpg)";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "wiki",
    link: "file:///Users/someone/Pictures/photo.jpg",
  });
});

test("getImageFromLine with a non-image line", () => {
  expect(getImageFromLine("just some text")).toBeNull();
  expect(getImageFromLine("")).toBeNull();
  expect(getImageFromLine("![[]]")).toBeNull();
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

test("safeDecode decodes percent-encoding and tolerates stray percents", () => {
  expect(safeDecode("Test%20folder/image.jpg")).toBe("Test folder/image.jpg");
  expect(safeDecode("100% done.jpg")).toBe("100% done.jpg");
});

test("getImageFromLine with parentheses in alt text does not hijack the link", () => {
  const line = "![Sunset (Hawaii)](sunset.jpg)";
  const result = getImageFromLine(line);
  expect(result).toEqual({
    type: "wiki",
    link: "sunset.jpg",
    alt: "Sunset (Hawaii)",
  });
});

test("getImageFromLine with parentheses in the filename", () => {
  const result = getImageFromLine("![](Screenshot%20(1).png)");
  expect(result).toEqual({
    type: "wiki",
    link: "Screenshot%20(1).png",
  });
  expect(getImageFromLine("![](Pasted image (1).png)")).toEqual({
    type: "wiki",
    link: "Pasted image (1).png",
  });
});
