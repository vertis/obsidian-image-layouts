import LayoutComponent from "../components/LegacyImageLayout.svelte";
import matter from "gray-matter";

import {
  MarkdownView,
  Plugin,
  type MarkdownPostProcessorContext,
} from "obsidian";
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
  const component = new LayoutComponent({
    target: parent,
    props: {
      // layout,
      caption: m.data.caption ?? "",
      descriptions: m.data.descriptions,
      layout: layout,
      requiredImages: layoutImages[layout],
      imageUrls: readyImages.map((i) => i.link),
    },
  });
  const res = component.$on("buttonClicked", (event) => {
    console.log(JSON.stringify(event));

    // view contains the editor to change the markdown
    const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
    // the context contains the begin and end of the block in the markdown file
    const info = ctx.getSectionInfo(parent);

    if (info) {
      m.data.testing = true;
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
  });
}

// let line = view?.editor.getLine(lineno).split(",");
// line[j] = ev.currentTarget.value;
// view?.editor.setLine(lineno, line?.join(","));

// view?.editor.setSelection(
//   {
//     line: info.lineStart,
//     ch: 0,
//   },
//   {
//     line: info.lineStart,
//     ch: 0,
//   }
// );
