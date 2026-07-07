import type ImageLayoutsPlugin from "../main";
import type { ReadyImageLink } from "./images";

// Inline SVG so empty layout slots never hit the network and render offline —
// the previous default, via.placeholder.com, is defunct and every empty slot
// produced a broken image plus a network request (#23, #27).
export const PLACEHOLDER_DATA_URI = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480"><rect width="100%" height="100%" fill="#88888822"/><circle cx="240" cy="170" r="36" fill="#88888855"/><path d="M120 360l110-140 80 95 60-60 130 105z" fill="#88888855"/></svg>',
)}`;

// Pads a layout's image list with placeholders up to its slot count, or
// trims the extras.
export function padToSlots(
  images: ReadyImageLink[],
  slots: number,
  placeholderUrl: string,
): ReadyImageLink[] {
  if (images.length >= slots) {
    return images.slice(0, slots);
  }
  return [
    ...images,
    ...Array(slots - images.length).fill({
      type: "external",
      link: placeholderUrl,
    }),
  ];
}

// The setting accepts an https:// URL, a data: URI, or a vault path (#27).
export function resolvePlaceholderImage(plugin: ImageLayoutsPlugin): string {
  const configured = plugin.settings.placeholderImage?.trim();
  if (!configured) {
    return PLACEHOLDER_DATA_URI;
  }
  if (/^(https?:|data:)/i.test(configured)) {
    return configured;
  }
  const destFile = plugin.app.metadataCache.getFirstLinkpathDest(
    configured,
    "",
  );
  if (destFile) {
    return plugin.app.vault.adapter.getResourcePath(destFile.path);
  }
  return PLACEHOLDER_DATA_URI;
}
