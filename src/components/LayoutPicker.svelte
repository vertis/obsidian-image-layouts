<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { LayoutType } from "../interfaces";
  const dispatch = createEventDispatcher();

  function selectLayout(layout: LayoutType | "carousel", params?: any) {
    dispatch("layout-selected", {
      type: layout,
    });
  }
</script>

<div class="flex flex-col items-center">
  <div class="text-2xl font-bold">Pick a Layout</div>
  <div class="flex flex-row justify-center">
    <div class="flex flex-col items-center">
      <div class="text-2xl font-bold">Carousel</div>
      <div class="text-lg">A simple carousel</div>
      <button on:click={() => selectLayout("carousel")}>Select</button>
    </div>
    <div class="flex flex-col items-center">
      <div class="text-2xl font-bold">Carousel</div>
      <div class="text-lg">With thumbnails</div>
      <button
        on:click={() =>
          selectLayout("carousel", {
            showThumbnails: true,
          })}>Select</button
      >
    </div>
  </div>
</div>
