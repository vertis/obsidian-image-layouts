import CarouselComponent from "../components/Carousel.svelte";
import CustomGridLayout from "../components/CustomGridLayout.svelte";
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
import {
  parseMasonryLayoutName,
  updateLayoutInBlockSource,
} from "../utils/blocks";
import { parseCustomGrid } from "../utils/custom-grid";
import { writeBlockSource } from "../utils/editor-writeback";
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
    // Edits only the layout lines of the raw source, preserving the user's
    // comments and formatting.
    const newSource = updateLayoutInBlockSource(source, choice);
    if (!writeBlockSource(plugin, ctx, parent, newSource)) {
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
      m.data.carouselShowThumbnails ? "carousel-thumbnails" : "carousel",
    );
    return;
  }

  if (layout === "custom") {
    const parsed = parseCustomGrid(m.data.grid);
    if (parsed.error) {
      const errorEl = parent.createDiv({ cls: "image-layouts-error" });
      errorEl.setText(`Image Layouts: ${parsed.error}`);
      errorEl.setAttr(
        "style",
        "color: var(--text-muted); font-size: 0.85em; padding: 0.5rem; border: 1px dashed var(--background-modifier-border); border-radius: 6px; white-space: pre-wrap;",
      );
      return;
    }
    mountSwitchable(
      CustomGridLayout,
      {
        grid: parsed.grid,
        images: readyImages,
        caption: m.data.caption ?? "",
        descriptions,
        overlayMode: resolveOverlayMode(m.data, plugin.settings),
        fit: m.data.fit,
        placeholderUrl: resolvePlaceholderImage(plugin),
      },
      "custom",
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
