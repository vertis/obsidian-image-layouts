import { TFile, TFolder, normalizePath } from "obsidian";
import type ImageLayoutsPlugin from "../main";
import type { ReadyImageLink } from "./images";

const IMAGE_EXTENSIONS = new Set([
  "avif",
  "bmp",
  "gif",
  "jpeg",
  "jpg",
  "png",
  "svg",
  "webp",
]);

export type FolderImageOptions = {
  sortBy?: "name" | "mtime";
  reverse?: boolean;
  limit?: number;
};

// Populates a layout from a vault folder's images (direct children only), as
// requested in #30.
export function getFolderImages(
  plugin: ImageLayoutsPlugin,
  folderPath: string,
  options: FolderImageOptions = {},
): ReadyImageLink[] {
  const folder = plugin.app.vault.getAbstractFileByPath(
    normalizePath(folderPath),
  );
  if (!(folder instanceof TFolder)) {
    return [];
  }
  const files = folder.children.filter(
    (child): child is TFile =>
      child instanceof TFile &&
      IMAGE_EXTENSIONS.has(child.extension.toLowerCase()),
  );
  files.sort(
    options.sortBy === "mtime"
      ? (a, b) => a.stat.mtime - b.stat.mtime
      : (a, b) => a.name.localeCompare(b.name),
  );
  if (options.reverse) {
    files.reverse();
  }
  const limited =
    typeof options.limit === "number" && options.limit > 0
      ? files.slice(0, options.limit)
      : files;
  return limited.map((file) => ({
    type: "resolved",
    link: plugin.app.vault.adapter.getResourcePath(file.path),
  }));
}
