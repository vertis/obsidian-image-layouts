<script lang="ts">
  import type { OverlayMode } from "../types";
  import type { ReadyImageLink } from "../utils/images";
  import Caption from "./Caption.svelte";
  import LegacyMasonryImage from "./LegacyMasonryImage.svelte";

  export let columns: number;
  export let images: ReadyImageLink[] = [];
  export let caption: string = "";
  export let descriptions: (string | undefined)[] = [];
  export let overlayMode: OverlayMode = "hover";
</script>

<div class={`image-layouts-masonry-grid-${columns}`}>
  {#each Array(columns) as _, colIndex}
    <div class={"image-layouts-masonry-column"}>
      {#each images as image, index}
        {#if index % columns === colIndex}
          <LegacyMasonryImage
            src={image.link}
            description={descriptions[index] ?? image.alt}
            width={image.width}
            {index}
            {overlayMode}
          />
        {/if}
      {/each}
    </div>
  {/each}
</div>
<Caption {caption} />

<style>
  .image-layouts-masonry-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: masonry;
    grid-gap: 0.5rem;
  }

  .image-layouts-masonry-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: masonry;
    grid-gap: 0.5rem;
  }

  .image-layouts-masonry-grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: masonry;
    grid-gap: 0.5rem;
  }

  .image-layouts-masonry-grid-5 {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: masonry;
    grid-gap: 0.5rem;
  }

  .image-layouts-masonry-grid-6 {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: masonry;
    grid-gap: 0.5rem;
  }

  .image-layouts-masonry-column {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
</style>
