import type { OverlayMode } from "./types";

export type LayoutType =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "single";
export const layoutImages: Record<LayoutType, number> = {
  a: 2,
  b: 2,
  c: 2,
  d: 3,
  e: 3,
  f: 4,
  g: 4,
  h: 3,
  i: 4,
  single: 1,
};

// One entry per grid layout, mirroring the CSS in LegacyImageLayout.svelte.
// Used by the layout picker to draw miniature schematics of each grid.
export type GridTemplate = {
  columns: string;
  areas: string;
};

export const layoutTemplates: Record<LayoutType, GridTemplate> = {
  a: { columns: "1fr 1fr", areas: '"image-0 image-1"' },
  b: { columns: "2fr 1fr", areas: '"image-0 image-1"' },
  c: { columns: "1fr 2fr", areas: '"image-1 image-0"' },
  d: { columns: "2fr 1fr", areas: '"image-0 image-1" "image-0 image-2"' },
  e: { columns: "1fr 2fr", areas: '"image-1 image-0" "image-2 image-0"' },
  f: {
    columns: "3fr 1fr",
    areas: '"image-0 image-1" "image-0 image-2" "image-0 image-3"',
  },
  g: {
    columns: "1fr 3fr",
    areas: '"image-1 image-0" "image-2 image-0" "image-3 image-0"',
  },
  h: { columns: "1fr 1fr 1fr", areas: '"image-0 image-1 image-2"' },
  i: {
    columns: "1fr 1fr 1fr 1fr",
    areas: '"image-0 image-1 image-2 image-3"',
  },
  single: { columns: "1fr", areas: '"image-0"' },
};

// What the layout picker emits: a grid letter, single, masonry-N, or carousel.
export type PickerChoice = {
  type: string;
  params?: { showThumbnails?: boolean };
};

export type FitMode = "cover" | "contain" | "natural";
export type AlignMode = "left" | "center" | "right" | "full";

// Frontmatter options shared by every codeblock family.
export type LayoutBlockOptions = {
  caption?: string;
  descriptions?: string[];
  permanentOverlay?: boolean;
  overlay?: OverlayMode;
  fit?: FitMode;
  align?: AlignMode;
  width?: number | string;
  fromFolder?: string;
  sortBy?: "name" | "mtime";
  reverse?: boolean;
  limit?: number;
};

// Extra options understood by the modern `image-layout` block.
export type ImageLayoutBlockOptions = LayoutBlockOptions & {
  layout?: string;
  carouselShowThumbnails?: boolean;
  carouselBackground?: string;
  carouselHeight?: number | string;
};
