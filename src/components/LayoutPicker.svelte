<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    type LayoutType,
    layoutImages,
    layoutTemplates,
  } from "../interfaces";
  import LayoutSchematic from "./LayoutSchematic.svelte";

  // How many images the block already contains; grids needing exactly that
  // many are highlighted.
  export let imageCount: number = 0;
  // Legacy blocks can only be renamed to other legacy fences, which have no
  // carousel form.
  export let allowCarousel: boolean = true;
  // Set when switching an existing block, to mark the current layout.
  export let currentLayout: string | undefined = undefined;
  export let showCancel: boolean = false;

  const dispatch = createEventDispatcher();

  const gridLayouts = Object.keys(layoutTemplates) as LayoutType[];
  const masonryColumns = [2, 3, 4, 5, 6];

  function select(type: string, params?: { showThumbnails?: boolean }) {
    dispatch("layout-selected", { type, params });
  }
</script>

<div class="image-layouts-picker cursor-default">
  <div class="picker-header">
    <span class="picker-title">Pick an image layout</span>
    {#if imageCount > 0}
      <span class="picker-count"
        >{imageCount} image{imageCount === 1 ? "" : "s"} in this block</span
      >
    {/if}
    {#if showCancel}
      <button
        type="button"
        class="picker-cancel"
        on:click={() => dispatch("cancel")}>Cancel</button
      >
    {/if}
  </div>

  <div class="picker-section">Grids</div>
  <div class="picker-tiles">
    {#each gridLayouts as layout}
      <button
        type="button"
        class="tile"
        class:fits={imageCount > 0 && layoutImages[layout] === imageCount}
        class:current={currentLayout === layout}
        aria-label={`Grid layout ${layout} (${layoutImages[layout]} images)`}
        on:click={() => select(layout)}
      >
        <LayoutSchematic grid={layout} />
        <span class="tile-label"
          >{layout} · {layoutImages[layout]}</span
        >
      </button>
    {/each}
  </div>

  <div class="picker-section">Masonry</div>
  <div class="picker-tiles">
    {#each masonryColumns as columns}
      <button
        type="button"
        class="tile"
        class:current={currentLayout === `masonry-${columns}`}
        aria-label={`Masonry with ${columns} columns`}
        on:click={() => select(`masonry-${columns}`)}
      >
        <LayoutSchematic masonryColumns={columns} />
        <span class="tile-label">{columns} col</span>
      </button>
    {/each}
  </div>

  {#if allowCarousel}
    <div class="picker-section">Carousel</div>
    <div class="picker-tiles">
      <button
        type="button"
        class="tile"
        class:current={currentLayout === "carousel"}
        aria-label="Carousel with pill indicators"
        on:click={() => select("carousel")}
      >
        <LayoutSchematic carousel="pills" />
        <span class="tile-label">pills</span>
      </button>
      <button
        type="button"
        class="tile"
        aria-label="Carousel with thumbnails"
        on:click={() => select("carousel", { showThumbnails: true })}
      >
        <LayoutSchematic carousel="thumbnails" />
        <span class="tile-label">thumbnails</span>
      </button>
    </div>
  {/if}
</div>

<style>
  .image-layouts-picker {
    padding: 0.75rem;
    border: 1px solid var(--background-modifier-border);
    border-radius: 8px;
    background-color: var(--background-secondary);
    color: var(--text-normal);
  }

  .picker-header {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .picker-title {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .picker-count {
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .picker-cancel {
    margin-left: auto;
    font-size: 0.75rem;
    padding: 2px 8px;
    border-radius: 4px;
    background-color: transparent;
    color: var(--text-muted);
    cursor: pointer;
  }

  .picker-cancel:hover {
    color: var(--text-normal);
    background-color: var(--background-modifier-hover);
  }

  .picker-section {
    margin-top: 0.75rem;
    margin-bottom: 0.25rem;
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }

  .picker-tiles {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tile {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 76px;
    padding: 6px 6px 4px;
    border: 1px solid var(--background-modifier-border);
    border-radius: 6px;
    background-color: var(--background-primary);
    cursor: pointer;
    box-shadow: none;
  }

  .tile :global(.schematic) {
    height: 48px;
  }

  .tile:hover {
    border-color: var(--interactive-accent);
    background-color: var(--background-modifier-hover);
  }

  .tile.fits {
    border-color: var(--interactive-accent);
    box-shadow: 0 0 0 1px var(--interactive-accent);
  }

  .tile.current {
    border-style: dashed;
    border-color: var(--text-muted);
  }

  .tile-label {
    font-size: 0.7rem;
    color: var(--text-muted);
    text-align: center;
    line-height: 1.2;
  }
</style>
