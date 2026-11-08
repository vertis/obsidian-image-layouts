<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { OverlayMode } from "../types";
  import {
    type ImageReorderDetail,
    reorderImage,
  } from "../utils/drag-reorder";

  export let src: string;
  export let description: string | undefined;
  export let index: number;
  export let overlayMode: OverlayMode = "hover";
  export let width: number | undefined = undefined;
  export let reorderEnabled = false;

  const dispatch = createEventDispatcher<{
    "image-reorder": ImageReorderDetail;
  }>();
</script>

<div
  class={`group relative image-layouts-masonry-image-${index}`}
  style:max-width={width ? `${width}px` : undefined}
  use:reorderImage={{
    index,
    enabled: reorderEnabled,
    orientation: "vertical",
    onReorder: (detail) => dispatch("image-reorder", detail),
  }}
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
</style>
