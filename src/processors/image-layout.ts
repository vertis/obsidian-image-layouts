import LegacyLayoutComponent from "../components/LegacyImageLayout.svelte";
import SliderComponent from "../components/Slider.svelte";

import matter from "gray-matter";

import {
  MarkdownView,
  Plugin,
  type MarkdownPostProcessorContext,
} from "obsidian";
import { getImages, resolveLocalImages } from "../utils/images";

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

  const slider = new SliderComponent({
    target: parent,
    props: {
      imageUrls: readyImages.map((i) => i.link),
    },
  });
}
