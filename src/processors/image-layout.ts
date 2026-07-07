import CarouselComponent from "../components/Carousel.svelte";
import LayoutPickerComponent from "../components/LayoutPicker.svelte";
import LegacyLayoutComponent from "../components/LegacyImageLayout.svelte";
import LegacyMasonryLayout from "../components/LegacyMasonryLayout.svelte";
import SwitchableLayout from "../components/SwitchableLayout.svelte";

import { type MarkdownPostProcessorContext, Notice } from "obsidian";
import type { ComponentType } from "svelte";
import {
  type ImageLayoutBlockOptions,
  type LayoutType,
  type PickerChoice,
  layoutImages,
} from "../interfaces";
import type ImageLayoutsPlugin from "../main";
import { collectBlockImages } from "../utils/block-images";
import { parseMasonryLayoutName } from "../utils/blocks";
import { writeBlockData } from "../utils/editor-writeback";
import { parseFrontMatterBlock } from "../utils/front-matter";
import { normalizeAlign, normalizeDescriptions } from "../utils/options";
import { resolveOverlayMode } from "../utils/overlay";
import { resolvePlaceholderImage } from "../utils/placeholder";
import { SvelteRenderChild } from "../utils/svelte-render-child";

const LEGACY_LAYOUT_PREFIX = "legacy-layout-";

export function addImageLayoutMarkdownProcessor(plugin: ImageLayoutsPlugin) {
  plugin.registerMarkdownCodeBlockProcessor(
    "image-layout",
    (source, el, ctx) => {
      renderImageLayoutComponent(source, el, ctx, plugin);
    },
  );
}

export function renderImageLayoutComponent(
  source: string,
  parent: HTMLElement,
  ctx: MarkdownPostProcessorContext,
  plugin: ImageLayoutsPlugin,
) {
  const m = parseFrontMatterBlock<ImageLayoutBlockOptions>(source);
  const readyImages = collectBlockImages(m.data, m.body, ctx, plugin);
  const descriptions = normalizeDescriptions(m.data?.descriptions);

  // A non-string layout value (e.g. `layout: 1`) is treated as unset.
  const layout = typeof m.data?.layout === "string" ? m.data.layout : undefined;

  const applyChoice = (choice: PickerChoice) => {
    const newData: ImageLayoutBlockOptions = { ...(m.data ?? {}) };
    newData.layout = choice.type;
    if (choice.type === "carousel") {
      if (choice.params?.showThumbnails) {
        newData.carouselShowThumbnails = true;
      } else {
        newData.carouselShowThumbnails = undefined;
      }
    }
    if (
      !writeBlockData(
        plugin,
        ctx,
        parent,
        m.body,
        newData as Record<string, unknown>,
      )
    ) {
      new Notice("Image Layouts: the layout can't be changed in this view.");
    }
    // On success the editor change re-runs this processor with the new
    // source, unmounting the picker and rendering the chosen layout.
  };

  if (!m.data || !layout) {
    const picker = new LayoutPickerComponent({
      target: parent,
      props: { imageCount: readyImages.length },
    });
    ctx.addChild(new SvelteRenderChild(parent, picker));
    picker.$on("layout-selected", (event: CustomEvent<PickerChoice>) => {
      applyChoice(event.detail);
    });
    return;
  }

  const switchable = ctx.getSectionInfo(parent) !== null;
  const mountSwitchable = (
    component: ComponentType,
    componentProps: Record<string, unknown>,
    currentLayout: string,
  ) => {
    const wrapper = new SwitchableLayout({
      target: parent,
      props: {
        component,
        componentProps,
        switchable,
        imageCount: readyImages.length,
        allowCarousel: true,
        currentLayout,
      },
    });
    wrapper.$on("apply-layout", (event: CustomEvent<PickerChoice>) => {
      applyChoice(event.detail);
    });
    ctx.addChild(new SvelteRenderChild(parent, wrapper));
  };

  if (layout === "carousel") {
    mountSwitchable(
      CarouselComponent,
      {
        images:
          readyImages.length > 0
            ? readyImages
            : [{ type: "external", link: resolvePlaceholderImage(plugin) }],
        showThumbnails: !!m.data.carouselShowThumbnails,
        caption: m.data.caption ?? "",
        descriptions,
        background: m.data.carouselBackground,
        height: m.data.carouselHeight,
      },
      "carousel",
    );
    return;
  }

  const masonryColumns = parseMasonryLayoutName(layout);
  if (masonryColumns !== null) {
    mountSwitchable(
      LegacyMasonryLayout,
      {
        caption: m.data.caption ?? "",
        descriptions,
        columns: masonryColumns,
        images: readyImages,
        overlayMode: resolveOverlayMode(m.data, plugin.settings),
      },
      layout,
    );
    return;
  }

  // Accept both `layout: legacy-layout-a` and plain `layout: a`. Slicing the
  // prefix (rather than taking the last character) keeps `single` working.
  const layoutName = layout.startsWith(LEGACY_LAYOUT_PREFIX)
    ? layout.slice(LEGACY_LAYOUT_PREFIX.length)
    : layout;
  if (layoutImages[layoutName as LayoutType]) {
    const layoutType = layoutName as LayoutType;
    mountSwitchable(
      LegacyLayoutComponent,
      {
        caption: m.data.caption ?? "",
        descriptions,
        layout: layoutType,
        requiredImages: layoutImages[layoutType],
        images: readyImages,
        overlayMode: resolveOverlayMode(m.data, plugin.settings),
        fit: m.data.fit,
        align: normalizeAlign(m.data.align),
        width: m.data.width,
        placeholderUrl: resolvePlaceholderImage(plugin),
      },
      layoutType,
    );
  }
}
