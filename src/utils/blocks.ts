import type { PickerChoice } from "../interfaces";
import { STARTER_GRID_LINES } from "./custom-grid";

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

// Applies a picker choice to a block's raw source by editing only the
// layout / carouselShowThumbnails lines. Everything else — comments, key
// order, formatting — is preserved byte for byte, so switching layouts never
// rewrites frontmatter the user authored by hand.
export const updateLayoutInBlockSource = (
  source: string,
  choice: PickerChoice,
): string => {
  const layoutLine = `layout: ${choice.type}`;
  const wantThumbnails =
    choice.type === "carousel" && !!choice.params?.showThumbnails;
  const thumbnailsLine = "carouselShowThumbnails: true";

  const lines = source.split("\n");
  if (lines[0]?.trim() === "---") {
    const closing = lines.slice(1).findIndex((line) => line.trim() === "---");
    if (closing >= 0) {
      const end = closing + 1;
      const inner = lines.slice(1, end);
      // Keys are matched at column 0 only — an indented `layout:` inside a
      // block scalar (e.g. a multi-line caption) is content, not a key.
      const layoutIndex = inner.findIndex((line) => /^layout\s*:/.test(line));
      if (layoutIndex >= 0) {
        inner[layoutIndex] = layoutLine;
      } else {
        inner.push(layoutLine);
      }
      const thumbnailsIndex = inner.findIndex((line) =>
        /^carouselShowThumbnails\s*:/.test(line),
      );
      if (wantThumbnails) {
        if (thumbnailsIndex >= 0) {
          inner[thumbnailsIndex] = thumbnailsLine;
        } else {
          inner.push(thumbnailsLine);
        }
      } else if (choice.type === "carousel" && thumbnailsIndex >= 0) {
        inner.splice(thumbnailsIndex, 1);
      }
      // Picking Custom seeds a starter grid to edit, unless one exists.
      if (
        choice.type === "custom" &&
        !inner.some((line) => /^grid\s*:/.test(line))
      ) {
        inner.push(...STARTER_GRID_LINES);
      }
      const rest = lines.slice(end + 1).join("\n");
      return `---\n${inner.join("\n")}\n---\n${rest}`;
    }
  }
  const frontMatterLines = [layoutLine];
  if (wantThumbnails) {
    frontMatterLines.push(thumbnailsLine);
  }
  if (choice.type === "custom") {
    frontMatterLines.push(...STARTER_GRID_LINES);
  }
  const body = source === "" || source.endsWith("\n") ? source : `${source}\n`;
  return `---\n${frontMatterLines.join("\n")}\n---\n${body}`;
};

// Builds a complete modern image-layout codeblock for the insert command.
// The fence is longer than any backtick run in the content so selections
// containing codeblocks can't terminate it early.
export const buildLayoutBlock = (
  choice: PickerChoice,
  content = "",
): string => {
  const trimmed = content.trim();
  const body = trimmed === "" ? "" : `${trimmed}\n`;
  const inner = updateLayoutInBlockSource(body, choice);
  const longestRun = Math.max(
    0,
    ...[...inner.matchAll(/`+/g)].map((match) => match[0].length),
  );
  const fence = "`".repeat(Math.max(3, longestRun + 1));
  return `${fence}image-layout\n${inner}${fence}\n`;
};
