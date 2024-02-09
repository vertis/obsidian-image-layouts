<script lang="ts">
  import { overlayOnlyOnHover } from "../stores";
  export let src: string;
  export let description: string | undefined;
  export let index: number;
</script>

<div class={`group relative image-layouts-masonry-image-${index}`}>
  <img
    class="w-full h-full object-cover object-center"
    {src}
    alt={`Image ${index + 1}`}
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
