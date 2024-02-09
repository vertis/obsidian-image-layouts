import LegacyLayoutComponent from "../components/LegacyImageLayout.svelte";
import CarouselComponent from "../components/Carousel.svelte";
import LayoutPickerComponent from "../components/LayoutPicker.svelte";

import matter from "gray-matter";

import {
  MarkdownView,
  Plugin,
  type MarkdownPostProcessorContext,
} from "obsidian";
import { getImages } from "../utils/images";
import { layoutImages, type LayoutType } from "../interfaces";
import { resolveLocalImages } from "../utils/image-resolver";

export function addImageLayoutMarkdownProcessor(plugin: Plugin) {
  plugin.registerMarkdownCodeBlockProcessor(
    "image-layout",
    (source, el, ctx) => {
      // const images = getImages(source);
      // renderLayout(images, layout, ctx.sourcePath, el, this);
      renderImageLayoutComponent(source, el, ctx, plugin);
    }
  );
}

export function renderImageLayoutComponent(
  source: string,
  parent: HTMLElement,
  ctx: MarkdownPostProcessorContext,
  plugin: Plugin
) {
  const m = matter(source);
  const images = getImages(m.content);
  const readyImages = resolveLocalImages(images, ctx, plugin);

  // const layout = "b" as LayoutType; // Soon we will show a picker if it isn't in the yaml

  // const _component = new LegacyLayoutComponent({
  //   target: parent,
  //   props: {
  //     // layout,
  //     caption: m.data.caption ?? "",
  //     descriptions: m.data.descriptions,
  //     layout: layout,
  //     requiredImages: layoutImages[layout],
  //     imageUrls: readyImages.map((i) => i.link),
  //   },
  // });
  if (!m.data.layout) {
    const picker = new LayoutPickerComponent({
      target: parent,
      props: {
        // layouts: layoutImages,
      },
    });
    picker.$on(
      "layout-selected",
      (event: CustomEvent<{ type: LayoutType | "carousel"; params?: any }>) => {
        console.log(event.detail.type);
        m.data.layout = event.detail.type;
        if (event.detail.params?.showThumbnails) {
          m.data.carouselShowThumbnails = true;
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
            }
          );
          view?.editor.replaceSelection(matter.stringify(m.content, m.data));
          // Deselect?
        }
        renderImageLayoutComponent(source, parent, ctx, plugin);
      }
    );
    return;
  }
  if (m.data.layout === "carousel") {
    const _carousel = new CarouselComponent({
      target: parent,
      props: {
        imageUrls:
          readyImages.length > 0
            ? readyImages.map((i) => i.link)
            : ["https://via.placeholder.com/640x480"],
        showThumbnails: !!m.data.carouselShowThumbnails,
      },
    });
    return;
  }
  if (m.data.layout.startsWith("legacy-layout-")) {
    const layoutType = m.data.layout.charAt(
      m.data.layout.length - 1
    ) as LayoutType;
    if (!layoutImages[layoutType]) {
      return; // TODO handle bad layout
    }
    const _component = new LegacyLayoutComponent({
      target: parent,
      props: {
        caption: m.data.caption ?? "",
        descriptions: m.data.descriptions,
        layout: layoutType,
        requiredImages: layoutImages[layoutType],
        images: readyImages,
      },
    });
  }
}
