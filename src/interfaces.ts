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
