import CarouselComponent from "../components/Carousel.svelte";
import LayoutPickerComponent from "../components/LayoutPicker.svelte";
import LegacyLayoutComponent from "../components/LegacyImageLayout.svelte";

import { type MarkdownPostProcessorContext, MarkdownView } from "obsidian";
import {
  type ImageLayoutBlockOptions,
  type LayoutType,
  layoutImages,
} from "../interfaces";
import type ImageLayoutsPlugin from "../main";
import { collectBlockImages } from "../utils/block-images";
import {
  parseFrontMatterBlock,
  stringifyFrontMatterBlock,
} from "../utils/front-matter";
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
  if (!m.data || !layout) {
    const picker = new LayoutPickerComponent({
      target: parent,
      props: {},
    });
    ctx.addChild(new SvelteRenderChild(parent, picker));
    picker.$on(
      "layout-selected",
      (
        event: CustomEvent<{
          type: LayoutType | "carousel";
          params?: { showThumbnails?: boolean };
        }>,
      ) => {
        const newData = m.data ?? {};
        newData.layout = event.detail.type;
        if (event.detail.params?.showThumbnails) {
          newData.carouselShowThumbnails = true;
        }
        // view contains the editor to change the markdown
        const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
        // the context contains the begin and end of the block in the markdown file
        const info = ctx.getSectionInfo(parent);

        if (info) {
          view?.editor.setSelection(
            {
              line: info.lineEnd,
              ch: 0,
            },
            {
              line: info.lineStart + 1,
              ch: 0,
            },
          );
          view?.editor.replaceSelection(
            stringifyFrontMatterBlock(m.body, newData),
          );
        }
        // The editor change makes Obsidian re-run this processor with the
        // updated source, unmounting the picker and rendering the layout.
      },
    );
    return;
  }
  if (layout === "carousel") {
    const carousel = new CarouselComponent({
      target: parent,
      props: {
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
    });
    ctx.addChild(new SvelteRenderChild(parent, carousel));
    return;
  }
  // Accept both `layout: legacy-layout-a` and plain `layout: a`. Slicing the
  // prefix (rather than taking the last character) keeps `single` working.
  const layoutName = layout.startsWith(LEGACY_LAYOUT_PREFIX)
    ? layout.slice(LEGACY_LAYOUT_PREFIX.length)
    : layout;
  if (layoutImages[layoutName as LayoutType]) {
    const layoutType = layoutName as LayoutType;
    const component = new LegacyLayoutComponent({
      target: parent,
      props: {
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
    });
    ctx.addChild(new SvelteRenderChild(parent, component));
  }
}
