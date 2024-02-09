<script lang="ts">
  import { overlayOnlyOnHover } from "../stores";
  export let src: string;
  export let description: string | undefined;
  export let index: number;
  console.log($overlayOnlyOnHover);
</script>

<div class={`group relative image-layouts-image-${index}`}>
  <img
    class="w-full h-full object-cover object-center"
    {src}
    alt={description}
  />
  {#if description}
    <div
      class="absolute bottom-0 left-0 right-0 flex items-end p-4"
      aria-hidden="true"
      class:opacity-0={$overlayOnlyOnHover}
      class:group-hover:opacity-100={$overlayOnlyOnHover}
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
