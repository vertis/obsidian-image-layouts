<script lang="ts">
  import type { FitMode } from "../interfaces";
  import type { OverlayMode } from "../types";

  export let src: string;
  export let description: string | undefined;
  export let index: number;
  export let overlayMode: OverlayMode = "hover";
  export let fit: FitMode = "cover";
  export let width: number | undefined = undefined;
</script>

<div
  class={`group relative image-layouts-image-${index}`}
  class:fit-contain={fit === "contain"}
  class:fit-natural={fit === "natural"}
  style:max-width={width ? `${width}px` : undefined}
>
  <img {src} alt={description ?? `Image ${index + 1}`} />
  {#if description && overlayMode !== "never"}
    <div
      class="absolute bottom-0 left-0 right-0 flex items-end p-4"
      aria-hidden="true"
      class:opacity-0={overlayMode !== "always"}
      class:group-hover:opacity-100={overlayMode !== "always"}
    >
      <div
        class="w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter"
      >
        {description}
      </div>
    </div>
  {/if}
</div>

<style>
  /* Sizing lives on the wrapper as a descendant rule rather than as classes
     on the img itself, so it stops applying when Obsidian's fullscreen image
     viewer lifts the img out of the layout (#28). */
  div :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
  div.fit-contain :global(img) {
    object-fit: contain;
  }
  div.fit-natural :global(img) {
    height: auto;
    object-fit: unset;
  }

  .image-layouts-image-0 {
    grid-area: image-0;
  }
  .image-layouts-image-1 {
    grid-area: image-1;
  }
  .image-layouts-image-2 {
    grid-area: image-2;
  }
  .image-layouts-image-3 {
    grid-area: image-3;
  }
  .image-layouts-image-4 {
    grid-area: image-4;
  }
  .image-layouts-image-5 {
    grid-area: image-5;
  }
  .image-layouts-image-6 {
    grid-area: image-6;
  }
</style>
