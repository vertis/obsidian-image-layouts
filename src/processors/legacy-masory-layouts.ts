import type { MarkdownPostProcessorContext } from "obsidian";
import LegacyMasonryLayout from "../components/LegacyMasonryLayout.svelte";
import type { LayoutBlockOptions } from "../interfaces";
import type ImageLayoutsPlugin from "../main";
import { collectBlockImages } from "../utils/block-images";
import { parseFrontMatterBlock } from "../utils/front-matter";
import { resolveOverlayMode } from "../utils/overlay";
import { SvelteRenderChild } from "../utils/svelte-render-child";

export function addLegacyMasonryMarkdownProcessors(plugin: ImageLayoutsPlugin) {
  for (let columns = 2; columns <= 6; columns++) {
    plugin.registerMarkdownCodeBlockProcessor(
      `image-layout-masonry-${columns}`,
      (source, el, ctx) => {
        renderLegacyMasonryLayoutComponent(source, el, ctx, plugin, columns);
      },
    );
  }
}

export function renderLegacyMasonryLayoutComponent(
  source: string,
  parent: HTMLElement,
  ctx: MarkdownPostProcessorContext,
  plugin: ImageLayoutsPlugin,
  columns: number,
) {
  const m = parseFrontMatterBlock<LayoutBlockOptions>(source);
  const readyImages = collectBlockImages(m.data, m.body, ctx, plugin);
  const component = new LegacyMasonryLayout({
    target: parent,
    props: {
      caption: m.data?.caption ?? "",
      descriptions: m.data?.descriptions,
      columns: columns,
      images: readyImages,
      overlayMode: resolveOverlayMode(m.data, plugin.settings),
    },
  });
  ctx.addChild(new SvelteRenderChild(parent, component));
}
