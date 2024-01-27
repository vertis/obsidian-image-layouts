import LayoutComponent from "../components/ImageLayout.svelte";
import ImageLayoutA from "../components/ImageLayoutA.svelte";

import { Plugin, type MarkdownPostProcessorContext } from "obsidian";
import { getImages, resolveLocalImages } from "../utils/images";

const layoutImages: Record<string, number> = {
  a: 2,
  b: 2,
  c: 2,
  d: 3,
  e: 3,
  f: 4,
  g: 4,
  h: 3,
  i: 4,
};

const layoutComponents: Record<string, typeof ImageLayoutA> = {
  a: ImageLayoutA,
  // b: 2,
  // c: 2,
  // d: 3,
  // e: 3,
  // f: 4,
  // g: 4,
  // h: 3,
  // i: 4,
};

export function addLegacyMarkdownProcessors(plugin: Plugin) {
  Object.keys(layoutImages).forEach((layout) => {
    plugin.registerMarkdownCodeBlockProcessor(
      `image-layout-${layout}`,
      (source, el, ctx) => {
        // const images = getImages(source);
        // renderLayout(images, layout, ctx.sourcePath, el, this);
        renderLegacyLayoutComponent(source, el, ctx, plugin, layout);
      }
    );
  });
}

export function renderLegacyLayoutComponent(
  source: string,
  parent: HTMLElement,
  ctx: MarkdownPostProcessorContext,
  plugin: Plugin,
  layout: keyof typeof layoutImages
) {
  plugin.app.metadataCache;
  const images = getImages(source);
  const readyImages = resolveLocalImages(images, ctx, plugin);
  console.log(readyImages);
  new layoutComponents[layout]({
    target: parent,
    props: {
      // layout,
      imageUrls: readyImages.map((i) => i.link),
    },
  });
}
