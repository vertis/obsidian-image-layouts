import { beforeEach, expect, test, vi } from "vitest";

import type { MarkdownPostProcessorContext } from "obsidian";
import type ImageLayoutsPlugin from "../src/main.ts";
import { writeBlockSource } from "../src/utils/editor-writeback.ts";

const originalSource = "![[one.jpg]]\n![[two.jpg]]\n";
let editor: {
  getLine: ReturnType<typeof vi.fn>;
  getRange: ReturnType<typeof vi.fn>;
  replaceRange: ReturnType<typeof vi.fn>;
};
let plugin: ImageLayoutsPlugin;
let ctx: MarkdownPostProcessorContext;

beforeEach(() => {
  editor = {
    getLine: vi.fn((line: number) =>
      line === 0 ? "```image-layout" : "```",
    ),
    getRange: vi.fn(() => originalSource),
    replaceRange: vi.fn(),
  };
  const view = { file: { path: "note.md" }, editor };
  plugin = {
    app: { workspace: { getActiveViewOfType: () => view } },
  } as unknown as ImageLayoutsPlugin;
  ctx = {
    sourcePath: "note.md",
    getSectionInfo: () => ({ lineStart: 0, lineEnd: 4 }),
  } as unknown as MarkdownPostProcessorContext;
});

test("writeBlockSource replaces a block when the expected source is current", () => {
  const updated = "![[two.jpg]]\n![[one.jpg]]\n";
  expect(
    writeBlockSource(plugin, ctx, {} as HTMLElement, updated, originalSource),
  ).toBe(true);
  expect(editor.replaceRange).toHaveBeenCalledWith(
    updated,
    { line: 1, ch: 0 },
    { line: 4, ch: 0 },
  );
});

test("writeBlockSource rejects stale or wrong-block content", () => {
  editor.getRange.mockReturnValue("![[changed.jpg]]\n");
  expect(
    writeBlockSource(
      plugin,
      ctx,
      {} as HTMLElement,
      "![[two.jpg]]\n![[one.jpg]]\n",
      originalSource,
    ),
  ).toBe(false);
  expect(editor.replaceRange).not.toHaveBeenCalled();
});

test("writeBlockSource appends a newline when checking expected source", () => {
  expect(
    writeBlockSource(
      plugin,
      ctx,
      {} as HTMLElement,
      "![[two.jpg]]\n![[one.jpg]]",
      "![[one.jpg]]\n![[two.jpg]]",
    ),
  ).toBe(true);
});
