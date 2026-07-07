import { type MarkdownPostProcessorContext, MarkdownView } from "obsidian";
import type ImageLayoutsPlugin from "../main";
import { replaceFenceLayout } from "./blocks";

const OPENING_FENCE = /^\s*(?:`{3,}|~{3,})\s*image-layout/;
const CLOSING_FENCE = /^\s*(?:`{3,}|~{3,})\s*$/;

// The active editor, but only if it is showing the same file the block was
// rendered from — hover popovers and embeds render blocks from other files
// while a different note is active, and writing there would corrupt it.
function editorForBlock(
  plugin: ImageLayoutsPlugin,
  ctx: MarkdownPostProcessorContext,
) {
  const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
  if (!view || view.file?.path !== ctx.sourcePath) {
    return null;
  }
  return view.editor;
}

// Replaces the content between the fences of the codeblock rendered into
// `parent` with new source text. Returns false when the block's position
// can't be resolved or doesn't look like a fenced image-layout block (e.g.
// an unclosed block at the end of a note, where lineEnd is content, not a
// fence — writing there would mangle the note).
export function writeBlockSource(
  plugin: ImageLayoutsPlugin,
  ctx: MarkdownPostProcessorContext,
  parent: HTMLElement,
  source: string,
): boolean {
  const editor = editorForBlock(plugin, ctx);
  const info = ctx.getSectionInfo(parent);
  if (!editor || !info) {
    return false;
  }
  if (
    !OPENING_FENCE.test(editor.getLine(info.lineStart)) ||
    !CLOSING_FENCE.test(editor.getLine(info.lineEnd))
  ) {
    return false;
  }
  const text = source === "" || source.endsWith("\n") ? source : `${source}\n`;
  editor.replaceRange(
    text,
    { line: info.lineStart + 1, ch: 0 },
    { line: info.lineEnd, ch: 0 },
  );
  return true;
}

// Renames the layout token on a legacy block's opening fence line, e.g.
// ```image-layout-a → ```image-layout-masonry-3.
export function renameFenceLayout(
  plugin: ImageLayoutsPlugin,
  ctx: MarkdownPostProcessorContext,
  parent: HTMLElement,
  layout: string,
): boolean {
  const editor = editorForBlock(plugin, ctx);
  const info = ctx.getSectionInfo(parent);
  if (!editor || !info) {
    return false;
  }
  const fenceLine = editor.getLine(info.lineStart);
  const renamed = replaceFenceLayout(fenceLine, layout);
  if (renamed === null) {
    return false;
  }
  editor.replaceRange(
    renamed,
    { line: info.lineStart, ch: 0 },
    { line: info.lineStart, ch: fenceLine.length },
  );
  return true;
}
