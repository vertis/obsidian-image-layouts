import { type MarkdownPostProcessorContext, Notice } from "obsidian";
import type ImageLayoutsPlugin from "../main";
import type { ImageReorderDetail } from "../utils/drag-reorder";
import { writeBlockSource } from "../utils/editor-writeback";
import {
  getReorderDestination,
  reorderImagesInBlockSource,
} from "../utils/image-order";

export function applyImageReorder(
  plugin: ImageLayoutsPlugin,
  ctx: MarkdownPostProcessorContext,
  parent: HTMLElement,
  source: string,
  detail: ImageReorderDetail,
) {
  const targetIndex = getReorderDestination(
    detail.sourceIndex,
    detail.targetIndex,
    detail.position,
  );
  const newSource = reorderImagesInBlockSource(
    source,
    detail.sourceIndex,
    targetIndex,
  );
  if (newSource === source) {
    return;
  }
  if (
    newSource === null ||
    !writeBlockSource(plugin, ctx, parent, newSource, source)
  ) {
    new Notice("Image Layouts: these images can't be reordered safely.");
  }
}
