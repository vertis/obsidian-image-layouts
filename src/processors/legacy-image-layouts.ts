import LayoutComponent from "../components/LegacyImageLayout.svelte";
import matter from "gray-matter";

import { Plugin, type MarkdownPostProcessorContext } from "obsidian";
import { getImages, resolveLocalImages } from "../utils/images";

type LayoutType = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i";
const layoutImages: Record<LayoutType, number> = {
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

export function addLegacyMarkdownProcessors(plugin: Plugin) {
  for (const layout in layoutImages) {
    plugin.registerMarkdownCodeBlockProcessor(
      `image-layout-${layout}`,
      (source, el, ctx) => {
        // const images = getImages(source);
        // renderLayout(images, layout, ctx.sourcePath, el, this);
        renderLegacyLayoutComponent(
          source,
          el,
          ctx,
          plugin,
          layout as LayoutType
        );
      }
    );
  }
}

export function renderLegacyLayoutComponent(
  source: string,
  parent: HTMLElement,
  ctx: MarkdownPostProcessorContext,
  plugin: Plugin,
  layout: LayoutType
) {
  const m = matter(source);
  const images = getImages(m.content);
  const readyImages = resolveLocalImages(images, ctx, plugin);
  console.log(readyImages);
  new LayoutComponent({
    target: parent,
    props: {
      // layout,
      caption: m.data.caption ?? "",
      layout: layout,
      requiredImages: layoutImages[layout],
      imageUrls: readyImages.map((i) => i.link),
    },
  });
}
