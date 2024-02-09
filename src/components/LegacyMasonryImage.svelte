<script lang="ts">
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
      class="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100"
      aria-hidden="true"
    >
      <div
        class="w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter"
      >
        {description}
      </div>
    </div>
  {/if}
</div>
