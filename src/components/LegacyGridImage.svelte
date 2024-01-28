<script lang="ts">
  import { onMount } from "svelte";
  export let src: string;
  export let description: string | undefined; // Added prop for text
  let clazz = "";
  export { clazz as class };
</script>

<div class={`group relative ${clazz}`}>
  <img class="w-full h-full object-cover object-center" {src} alt={text} />
  {#if description}
    <div
      class="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100"
      aria-hidden="true"
    >
      <div
        class="w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter"
      >
        {text}
      </div>
    </div>
  {/if}
</div>

<style>
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
