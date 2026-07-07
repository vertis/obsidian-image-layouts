<script lang="ts">
  import type { FitMode } from "../interfaces";
  import type { OverlayMode } from "../types";
  import type { CustomGrid } from "../utils/custom-grid";
  import type { ReadyImageLink } from "../utils/images";
  import { PLACEHOLDER_DATA_URI, padToSlots } from "../utils/placeholder";
  import Caption from "./Caption.svelte";
  import LegacyGridImage from "./LegacyGridImage.svelte";

  export let grid: CustomGrid;
  export let images: ReadyImageLink[] = [];
  export let caption: string = "";
  export let descriptions: (string | undefined)[] = [];
  export let overlayMode: OverlayMode = "hover";
  export let fit: FitMode = "cover";
  export let placeholderUrl: string = PLACEHOLDER_DATA_URI;

  $: displayImages = padToSlots(images, grid.slots, placeholderUrl);
</script>

<div
  class="image-layouts image-layouts-grid image-layouts-custom cursor-default"
  class:fit-natural={fit === "natural"}
  style:grid-template-columns={`repeat(${grid.columns}, 1fr)`}
  style:grid-template-areas={grid.templateAreas}
>
  {#each displayImages as image, index}
    <LegacyGridImage
      {index}
      src={image.link}
      description={descriptions[index] ?? image.alt}
      width={image.width}
      gridArea={`image-${index}`}
      {overlayMode}
      {fit}
    />
  {/each}
</div>
<Caption {caption} />

<style>
  .image-layouts-custom {
    display: grid;
    grid-gap: 0.5rem;
  }

  .image-layouts-custom.fit-natural {
    align-items: start;
  }
</style>
