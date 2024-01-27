<script lang="ts">
  export let columns: number;
  export let imageUrls: string[] = [];
</script>

<div class={`image-layouts-masonry-grid-${columns}`}>
  {#each Array(columns) as _, colIndex}
    <div class={`image-layouts-masonry-column`}>
      {#each imageUrls as imageUrl, index (imageUrl)}
        {#if index % columns === colIndex}
          <img
            class={`image-layouts-masonry-image-${index}`}
            src={imageUrl}
            alt={`Image ${index + 1}`}
          />
        {/if}
      {/each}
    </div>
  {/each}
</div>

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
