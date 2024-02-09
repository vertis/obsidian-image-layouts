import LegacyMasonryLayout from "../components/LegacyMasonryLayout.svelte";
import { Plugin, type MarkdownPostProcessorContext } from "obsidian";
import { getImages } from "../utils/images";
import { resolveLocalImages } from "../utils/image-resolver";
import matter from "gray-matter";
import type ImageLayoutsPlugin from "../main";

export function addLegacyMasonryMarkdownProcessors(plugin: ImageLayoutsPlugin) {
  for (let columns = 2; columns <= 6; columns++) {
    plugin.registerMarkdownCodeBlockProcessor(
      `image-layout-masonry-${columns}`,
      (source, el, ctx) => {
        renderLegacyMasonryLayoutComponent(source, el, ctx, plugin, columns);
      }
    );
  }
}

export function renderLegacyMasonryLayoutComponent(
  source: string,
  parent: HTMLElement,
  ctx: MarkdownPostProcessorContext,
  plugin: ImageLayoutsPlugin,
  columns: number
) {
  const m = matter(source);
  const images = getImages(source);
  const readyImages = resolveLocalImages(images, ctx, plugin);
  new LegacyMasonryLayout({
    target: parent,
    props: {
      caption: m.data.caption ?? "",
      descriptions: m.data.descriptions,
      columns: columns,
      images: readyImages,
      permanentOverlay:
        m.data.permanentOverlay ?? plugin.settings.shouldOverlayPermanently,
    },
  });
}
