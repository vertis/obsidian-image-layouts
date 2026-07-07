import { type MarkdownPostProcessorContext, Notice } from "obsidian";
import LayoutComponent from "../components/LegacyImageLayout.svelte";
import SwitchableLayout from "../components/SwitchableLayout.svelte";
import {
  type AlignMode,
  type LayoutBlockOptions,
  type LayoutType,
  type PickerChoice,
  layoutImages,
} from "../interfaces";
import type ImageLayoutsPlugin from "../main";
import { collectBlockImages } from "../utils/block-images";
import { renameFenceLayout } from "../utils/editor-writeback";
import { parseFrontMatterBlock } from "../utils/front-matter";
import { normalizeAlign, normalizeDescriptions } from "../utils/options";
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
          shorthand,
        );
      },
    );
  }
}

// Legacy blocks encode the layout in the fence name, so applying a picker
// choice means renaming the fence token; the fences have no carousel form.
export function applyLegacyPickerChoice(
  plugin: ImageLayoutsPlugin,
  ctx: MarkdownPostProcessorContext,
  parent: HTMLElement,
  choice: PickerChoice,
) {
  if (!renameFenceLayout(plugin, ctx, parent, choice.type)) {
    new Notice("Image Layouts: the layout can't be changed in this view.");
  }
}

export function renderLegacyLayoutComponent(
  source: string,
  parent: HTMLElement,
  ctx: MarkdownPostProcessorContext,
  plugin: ImageLayoutsPlugin,
  layout: LayoutType,
  defaultAlign: AlignMode = "full",
  // The token in the fence name — differs from `layout` for the align
  // shorthands (image-layout-left renders `single` but its token is `left`),
  // and the picker must not mark `single` as current for those blocks.
  fenceLayout: string = layout,
) {
  const m = parseFrontMatterBlock<LayoutBlockOptions>(source);
  const readyImages = collectBlockImages(m.data, m.body, ctx, plugin);

  const wrapper = new SwitchableLayout({
    target: parent,
    props: {
      component: LayoutComponent,
      componentProps: {
        caption: m.data?.caption ?? "",
        descriptions: normalizeDescriptions(m.data?.descriptions),
        layout: layout,
        requiredImages: layoutImages[layout],
        images: readyImages,
        overlayMode: resolveOverlayMode(m.data, plugin.settings),
        fit: m.data?.fit,
        align: normalizeAlign(m.data?.align, defaultAlign),
        width: m.data?.width,
        placeholderUrl: resolvePlaceholderImage(plugin),
      },
      switchable: ctx.getSectionInfo(parent) !== null,
      imageCount: readyImages.length,
      allowCarousel: false,
      currentLayout: fenceLayout,
    },
  });
  wrapper.$on("apply-layout", (event: CustomEvent<PickerChoice>) => {
    applyLegacyPickerChoice(plugin, ctx, parent, event.detail);
  });
  ctx.addChild(new SvelteRenderChild(parent, wrapper));
}
