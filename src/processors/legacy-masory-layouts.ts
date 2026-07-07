import type { MarkdownPostProcessorContext } from "obsidian";
import LegacyMasonryLayout from "../components/LegacyMasonryLayout.svelte";
import SwitchableLayout from "../components/SwitchableLayout.svelte";
import type { LayoutBlockOptions, PickerChoice } from "../interfaces";
import type ImageLayoutsPlugin from "../main";
import { collectBlockImages } from "../utils/block-images";
import { parseFrontMatterBlock } from "../utils/front-matter";
import { normalizeDescriptions } from "../utils/options";
import { resolveOverlayMode } from "../utils/overlay";
import { SvelteRenderChild } from "../utils/svelte-render-child";
import { applyLegacyPickerChoice } from "./legacy-image-layouts";

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
  const wrapper = new SwitchableLayout({
    target: parent,
    props: {
      component: LegacyMasonryLayout,
      componentProps: {
        caption: m.data?.caption ?? "",
        descriptions: normalizeDescriptions(m.data?.descriptions),
        columns: columns,
        images: readyImages,
        overlayMode: resolveOverlayMode(m.data, plugin.settings),
      },
      switchable: ctx.getSectionInfo(parent) !== null,
      imageCount: readyImages.length,
      allowCarousel: false,
      allowCustom: false,
      currentLayout: `masonry-${columns}`,
    },
  });
  wrapper.$on("apply-layout", (event: CustomEvent<PickerChoice>) => {
    applyLegacyPickerChoice(plugin, ctx, parent, event.detail);
  });
  ctx.addChild(new SvelteRenderChild(parent, wrapper));
}
