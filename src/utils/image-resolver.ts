import { Plugin, type MarkdownPostProcessorContext } from "obsidian";
import type { ImageLink, ReadyImageLink } from "./images";

export function resolveLocalImages(
  images: ImageLink[],
  ctx: MarkdownPostProcessorContext,
  plugin: Plugin
): ReadyImageLink[] {
  // 	var destFile = plugin.app.metadataCache.getFirstLinkpathDest(link, sourcePath);
  // if (destFile) {
  // 	const img = parent.createEl("img");
  // 	img.src = plugin.app.vault.adapter.getResourcePath(destFile.path);
  // }
  return images.map((image) => {
    if (image.type === "wiki") {
      const destFile = plugin.app.metadataCache.getFirstLinkpathDest(
        image.link,
        ctx.sourcePath
      );
      if (destFile) {
        return {
          type: "resolved",
          link: plugin.app.vault.adapter.getResourcePath(destFile.path),
        };
      }
    }
    return image as ReadyImageLink;
  });
}
