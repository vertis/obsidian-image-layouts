<script lang="ts">
  import {
    type LayoutType,
    layoutImages,
    layoutTemplates,
  } from "../interfaces";

  // One of: a grid layout letter/single, a masonry column count, or a
  // carousel variant.
  export let grid: LayoutType | undefined = undefined;
  export let masonryColumns: number | undefined = undefined;
  export let carousel: "pills" | "thumbnails" | undefined = undefined;
  // The "design your own" tile: a hero region plus two stacked cells.
  export let custom: boolean = false;

  // Alternating block heights give the masonry schematic its stagger.
  const masonryHeights = [
    ["55%", "40%"],
    ["35%", "60%"],
    ["50%", "45%"],
  ];
</script>

<div class="schematic" aria-hidden="true">
  {#if grid}
    <div
      class="schematic-grid"
      style:grid-template-columns={layoutTemplates[grid].columns}
      style:grid-template-areas={layoutTemplates[grid].areas}
    >
      {#each Array(layoutImages[grid]) as _, index}
        <div class="cell" style:grid-area={`image-${index}`}></div>
      {/each}
    </div>
  {:else if masonryColumns}
    <div class="schematic-masonry">
      {#each Array(masonryColumns) as _, col}
        <div class="masonry-column">
          {#each masonryHeights[col % masonryHeights.length] as height}
            <div class="cell" style:height></div>
          {/each}
        </div>
      {/each}
    </div>
  {:else if carousel}
    <div class="schematic-carousel">
      <div class="cell stage"></div>
      <div class="strip">
        {#if carousel === "pills"}
          {#each Array(3) as _}
            <div class="pill"></div>
          {/each}
        {:else}
          {#each Array(3) as _}
            <div class="cell thumb"></div>
          {/each}
        {/if}
      </div>
    </div>
  {:else if custom}
    <div
      class="schematic-grid"
      style:grid-template-columns="2fr 1fr"
      style:grid-template-areas={'"hero top" "hero bottom"'}
    >
      <div class="cell dashed" style:grid-area="hero"></div>
      <div class="cell dashed" style:grid-area="top"></div>
      <div class="cell dashed" style:grid-area="bottom"></div>
    </div>
  {/if}
</div>

<style>
  .schematic {
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .cell {
    background-color: var(--background-modifier-border);
    border-radius: 2px;
  }

  .cell.dashed {
    background-color: transparent;
    border: 1px dashed var(--text-muted);
  }

  .schematic-grid {
    display: grid;
    gap: 3px;
    width: 100%;
    height: 100%;
    grid-auto-rows: 1fr;
  }

  .schematic-masonry {
    display: flex;
    gap: 3px;
    width: 100%;
    height: 100%;
  }

  .masonry-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .schematic-carousel {
    display: flex;
    flex-direction: column;
    gap: 3px;
    width: 100%;
    height: 100%;
  }

  .stage {
    flex: 1;
  }

  .strip {
    display: flex;
    gap: 3px;
    height: 22%;
    align-items: center;
    justify-content: center;
  }

  .pill {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: var(--background-modifier-border);
  }

  .thumb {
    flex: 0 0 26%;
    height: 100%;
  }
</style>
