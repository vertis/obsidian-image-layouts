import { type MarkdownPostProcessorContext, Platform, Plugin } from "obsidian";
import { type ImageLink, type ReadyImageLink, safeDecode } from "./images";

export function resolveLocalImages(
  images: ImageLink[],
  ctx: MarkdownPostProcessorContext,
  plugin: Plugin,
): ReadyImageLink[] {
  return images.map((image) => {
    if (image.type === "wiki") {
      // file:// URLs point outside the vault; Obsidian's webview blocks raw
      // file:// image loads, but exposes the same files via its resource
      // scheme (app://<id>/<path> on desktop). Mirror Obsidian core's rewrite.
      if (/^file:\/\//i.test(image.link)) {
        return {
          type: "resolved",
          link:
            Platform.resourcePathPrefix +
            image.link.replace(/^file:\/{2,3}/i, ""),
          alt: image.alt,
          width: image.width,
          height: image.height,
        };
      }
      // Try the path as written, then percent-decoded — Obsidian encodes
      // markdown-style local links (e.g. Test%20folder/image.jpg) but
      // getFirstLinkpathDest expects decoded vault paths.
      const destFile =
        plugin.app.metadataCache.getFirstLinkpathDest(
          image.link,
          ctx.sourcePath,
        ) ??
        plugin.app.metadataCache.getFirstLinkpathDest(
          safeDecode(image.link),
          ctx.sourcePath,
        );
      if (destFile) {
        return {
          type: "resolved",
          link: plugin.app.vault.adapter.getResourcePath(destFile.path),
          alt: image.alt,
          width: image.width,
          height: image.height,
        };
      }
    }
    return image as ReadyImageLink;
  });
}
