import type { MarkdownPostProcessorContext } from "obsidian";
import type { LayoutBlockOptions } from "../interfaces";
import type ImageLayoutsPlugin from "../main";
import { getFolderImages } from "./folder-images";
import { resolveLocalImages } from "./image-resolver";
import type { ReadyImageLink } from "./images";
import { getImages } from "./images";

// Images listed in the block body come first, then any pulled in via the
// fromFolder frontmatter key.
export function collectBlockImages(
  data: LayoutBlockOptions | null,
  body: string,
  ctx: MarkdownPostProcessorContext,
  plugin: ImageLayoutsPlugin,
): ReadyImageLink[] {
  const bodyImages = resolveLocalImages(getImages(body), ctx, plugin);
  const folderImages = data?.fromFolder
    ? getFolderImages(plugin, data.fromFolder, {
        sortBy: data.sortBy,
        reverse: data.reverse,
        limit: data.limit,
      })
    : [];
  return [...bodyImages, ...folderImages];
}
