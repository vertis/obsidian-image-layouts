import type { MarkdownPostProcessorContext } from "obsidian";
import LayoutComponent from "../components/LegacyImageLayout.svelte";
import {
  type AlignMode,
  type LayoutBlockOptions,
  type LayoutType,
  layoutImages,
} from "../interfaces";
import type ImageLayoutsPlugin from "../main";
import { collectBlockImages } from "../utils/block-images";
import { parseFrontMatterBlock } from "../utils/front-matter";
import { resolveOverlayMode } from "../utils/overlay";
import { resolvePlaceholderImage } from "../utils/placeholder";
import { SvelteRenderChild } from "../utils/svelte-render-child";

// Single-image blocks aligned to a side, as asked for in #6.
const ALIGN_SHORTHANDS: Record<string, AlignMode> = {
  left: "left",
  center: "center",
  right: "right",
};

export function addLegacyImageLayoutMarkdownProcessors(
  plugin: ImageLayoutsPlugin,
) {
  for (const layout in layoutImages) {
    plugin.registerMarkdownCodeBlockProcessor(
      `image-layout-${layout}`,
      (source, el, ctx) => {
        renderLegacyLayoutComponent(
          source,
          el,
          ctx,
          plugin,
          layout as LayoutType,
        );
      },
    );
  }
  for (const shorthand in ALIGN_SHORTHANDS) {
    plugin.registerMarkdownCodeBlockProcessor(
      `image-layout-${shorthand}`,
      (source, el, ctx) => {
        renderLegacyLayoutComponent(
          source,
          el,
          ctx,
          plugin,
          "single",
          ALIGN_SHORTHANDS[shorthand],
        );
      },
    );
  }
}

export function renderLegacyLayoutComponent(
  source: string,
  parent: HTMLElement,
  ctx: MarkdownPostProcessorContext,
  plugin: ImageLayoutsPlugin,
  layout: LayoutType,
  defaultAlign: AlignMode = "full",
) {
  const m = parseFrontMatterBlock<LayoutBlockOptions>(source);
  const readyImages = collectBlockImages(m.data, m.body, ctx, plugin);

  const component = new LayoutComponent({
    target: parent,
    props: {
      caption: m.data?.caption ?? "",
      descriptions: m.data?.descriptions,
      layout: layout,
      requiredImages: layoutImages[layout],
      images: readyImages,
      overlayMode: resolveOverlayMode(m.data, plugin.settings),
      fit: m.data?.fit,
      align: m.data?.align ?? defaultAlign,
      width: m.data?.width,
      placeholderUrl: resolvePlaceholderImage(plugin),
    },
  });
  ctx.addChild(new SvelteRenderChild(parent, component));
}
