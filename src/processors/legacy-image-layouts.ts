import LayoutComponent from "../components/LegacyImageLayout.svelte";
import matter from "gray-matter";

import {
  MarkdownView,
  Plugin,
  type MarkdownPostProcessorContext,
} from "obsidian";
import { layoutImages, type LayoutType } from "../interfaces";
import { getImages } from "../utils/images";
import { resolveLocalImages } from "../utils/image-resolver";
import type ImageLayoutsPlugin from "../main";

export function addLegacyImageLayoutMarkdownProcessors(
  plugin: ImageLayoutsPlugin
) {
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
  plugin: ImageLayoutsPlugin,
  layout: LayoutType
) {
  const m = matter(source);
  const images = getImages(m.content);
  const readyImages = resolveLocalImages(images, ctx, plugin);

  const _component = new LayoutComponent({
    target: parent,
    props: {
      // layout,
      caption: m.data.caption ?? "",
      descriptions: m.data.descriptions,
      layout: layout,
      requiredImages: layoutImages[layout],
      images: readyImages,
      permanentOverlay:
        m.data.permanentOverlay ?? plugin.settings.shouldOverlayPermanently,
    },
  });
}
