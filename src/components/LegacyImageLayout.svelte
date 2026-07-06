<script lang="ts">
  import type { AlignMode, FitMode, LayoutType } from "../interfaces";
  import type { OverlayMode } from "../types";
  import type { ReadyImageLink } from "../utils/images";
  import { PLACEHOLDER_DATA_URI } from "../utils/placeholder";
  import Caption from "./Caption.svelte";
  import LegacyGridImage from "./LegacyGridImage.svelte";

  export let layout: LayoutType = "a";
  export let images: ReadyImageLink[] = [];
  export let requiredImages = 0;
  export let caption: string = "";
  export let descriptions: (string | undefined)[] = [];
  export let overlayMode: OverlayMode = "hover";
  export let fit: FitMode = "cover";
  export let align: AlignMode = "full";
  export let width: number | string | undefined = undefined;
  export let placeholderUrl: string = PLACEHOLDER_DATA_URI;

  let displayImages: ReadyImageLink[] = [];

  // If there are fewer images than the layout needs, fill the remaining
  // slots with the placeholder.
  if (images.length < requiredImages) {
    displayImages = [
      ...images,
      ...Array(requiredImages - images.length).fill({
        type: "external",
        link: placeholderUrl,
      }),
    ];
  } else {
    displayImages = images.slice(0, requiredImages);
  }

  const widthStyle = typeof width === "number" ? `${width}px` : width;
</script>

<div
  class="image-layouts-align"
  class:align-left={align === "left"}
  class:align-center={align === "center"}
  class:align-right={align === "right"}
>
  <div
    class={`image-layouts image-layouts-grid image-layouts-layout-${layout} cursor-default`}
    class:fit-natural={fit === "natural"}
    style:width={align !== "full" ? (widthStyle ?? "50%") : undefined}
    style:max-width={widthStyle}
  >
    {#each displayImages as image, index}
      <LegacyGridImage
        {index}
        src={image.link}
        description={descriptions[index] ?? image.alt}
        width={image.width}
        {overlayMode}
        {fit}
      />
    {/each}
  </div>
</div>
<Caption {caption} />

<style>
  :global(.image-layouts button) {
    background-color: unset;
    box-shadow: unset;
  }

  .image-layouts-align.align-left {
    display: flex;
    justify-content: flex-start;
  }

  .image-layouts-align.align-center {
    display: flex;
    justify-content: center;
  }

  .image-layouts-align.align-right {
    display: flex;
    justify-content: flex-end;
  }

  .image-layouts-grid {
    display: grid;
    grid-gap: 0.5rem;
  }

  /* Natural fit keeps each image's intrinsic aspect ratio; stop grid cells
     stretching to the tallest row mate (#16). */
  .image-layouts-grid.fit-natural {
    align-items: start;
  }

  .image-layouts-layout-a {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "image-0 image-1";
  }

  .image-layouts-layout-b {
    grid-template-columns: 2fr 1fr;
    grid-template-areas: "image-0 image-1";
  }

  .image-layouts-layout-c {
    grid-template-columns: 1fr 2fr;
    grid-template-areas: "image-1 image-0";
  }

  .image-layouts-layout-d {
    grid-template-columns: 2fr 1fr;
    grid-template-areas:
      "image-0 image-1"
      "image-0 image-2";
  }

  .image-layouts-layout-e {
    grid-template-columns: 1fr 2fr;
    grid-template-areas:
      "image-1 image-0"
      "image-2 image-0";
  }

  .image-layouts-layout-f {
    grid-template-columns: 3fr 1fr;
    grid-template-areas:
      "image-0 image-1"
      "image-0 image-2"
      "image-0 image-3";
  }

  .image-layouts-layout-g {
    grid-template-columns: 1fr 3fr;
    grid-template-areas:
      "image-1 image-0"
      "image-2 image-0"
      "image-3 image-0";
  }

  .image-layouts-layout-h {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: "image-0 image-1 image-2";
  }

  .image-layouts-layout-i {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-areas: "image-0 image-1 image-2 image-3";
  }

  .image-layouts-layout-single {
    grid-template-columns: 1fr;
    grid-template-areas: "image-0";
  }
</style>
