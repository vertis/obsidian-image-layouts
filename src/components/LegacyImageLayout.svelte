<script lang="ts">
  import type { ReadyImageLink } from "../utils/images";
  import LegacyGridImage from "./LegacyGridImage.svelte";
  import Caption from "./Caption.svelte";

  export let layout: "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" = "a";
  export let images: ReadyImageLink[] = [];
  export let requiredImages = 0;
  export let caption: string = "";
  export let descriptions: string[] = [];
  export let permanentOverlay = false;

  let displayImages: ReadyImageLink[] = [];

  // If the number of imageUrls is less than requiredImages, fill the remaining with "placeholder.jpg"
  if (images.length < requiredImages) {
    displayImages = [
      ...images,
      ...Array(requiredImages - images.length).fill({
        type: "external",
        link: "https://via.placeholder.com/640x480",
      }),
    ];
  } else {
    displayImages = images.slice(0, requiredImages);
  }
</script>

<div
  class={`image-layouts image-layouts-grid image-layouts-layout-${layout} cursor-default`}
>
  {#each displayImages as image, index (image.link)}
    <LegacyGridImage
      {index}
      src={image.link}
      description={descriptions[index] ?? image.alt ?? `Image ${index + 1}`}
      {permanentOverlay}
    />
  {/each}
</div>
<Caption {caption} />

<style>
  :global(.image-layouts button) {
    background-color: unset;
    box-shadow: unset;
  }

  .image-layouts-grid {
    display: grid;
    grid-gap: 0.5rem;
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
</style>
