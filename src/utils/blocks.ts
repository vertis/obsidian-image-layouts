import type { PickerChoice } from "../interfaces";
import { stringifyFrontMatterBlock } from "./front-matter";

// `layout: masonry-3` → 3; null for anything that isn't a masonry layout name.
export const parseMasonryLayoutName = (layout: string): number | null => {
  const match = layout.match(/^masonry-(\d+)$/);
  if (!match) {
    return null;
  }
  const columns = Number(match[1]);
  return columns >= 2 && columns <= 6 ? columns : null;
};

// Renames the layout token on a legacy codeblock fence line, e.g.
// ```image-layout-a → ```image-layout-masonry-3. Returns null if the line
// isn't a legacy image-layout fence.
export const replaceFenceLayout = (
  fenceLine: string,
  layout: string,
): string | null => {
  if (!/^\s*(`{3,}|~{3,})\s*image-layout-[\w-]+\s*$/.test(fenceLine)) {
    return null;
  }
  return fenceLine.replace(/image-layout-[\w-]+/, `image-layout-${layout}`);
};

// Builds a complete modern image-layout codeblock for the insert command.
export const buildLayoutBlock = (
  choice: PickerChoice,
  content = "",
): string => {
  const data: Record<string, unknown> = { layout: choice.type };
  if (choice.params?.showThumbnails) {
    data.carouselShowThumbnails = true;
  }
  const trimmed = content.trim();
  const body = trimmed === "" ? "" : `${trimmed}\n`;
  return `\`\`\`image-layout\n${stringifyFrontMatterBlock(body, data)}\`\`\`\n`;
};
