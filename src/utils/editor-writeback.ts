import { type MarkdownPostProcessorContext, MarkdownView } from "obsidian";
import type ImageLayoutsPlugin from "../main";
import { replaceFenceLayout } from "./blocks";
import { stringifyFrontMatterBlock } from "./front-matter";

// Replaces the content between the fences of the codeblock rendered into
// `parent` with new frontmatter + body. Returns false when the block's
// position can't be resolved (embeds, exports).
export function writeBlockData(
  plugin: ImageLayoutsPlugin,
  ctx: MarkdownPostProcessorContext,
  parent: HTMLElement,
  body: string,
  data: Record<string, unknown>,
): boolean {
  const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
  const info = ctx.getSectionInfo(parent);
  if (!view || !info) {
    return false;
  }
  view.editor.setSelection(
    { line: info.lineEnd, ch: 0 },
    { line: info.lineStart + 1, ch: 0 },
  );
  view.editor.replaceSelection(stringifyFrontMatterBlock(body, data));
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
  const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
  const info = ctx.getSectionInfo(parent);
  if (!view || !info) {
    return false;
  }
  const fenceLine = view.editor.getLine(info.lineStart);
  const renamed = replaceFenceLayout(fenceLine, layout);
  if (renamed === null) {
    return false;
  }
  view.editor.replaceRange(
    renamed,
    { line: info.lineStart, ch: 0 },
    { line: info.lineStart, ch: fenceLine.length },
  );
  return true;
}
