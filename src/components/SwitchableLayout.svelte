<script lang="ts">
  import { createEventDispatcher, type ComponentType } from "svelte";
  import LayoutPicker from "./LayoutPicker.svelte";

  // The layout component to render (grid, masonry, or carousel) and its props.
  export let component: ComponentType;
  export let componentProps: Record<string, unknown> = {};
  // Whether the surrounding context can write the change back to the note.
  export let switchable: boolean = false;
  export let imageCount: number = 0;
  export let allowCarousel: boolean = true;
  export let allowCustom: boolean = true;
  export let currentLayout: string | undefined = undefined;

  const dispatch = createEventDispatcher();
  let picking = false;

  function apply(event: CustomEvent) {
    picking = false;
    dispatch("apply-layout", event.detail);
  }
</script>

{#if picking}
  <LayoutPicker
    {imageCount}
    {allowCarousel}
    {allowCustom}
    {currentLayout}
    showCancel={true}
    on:layout-selected={apply}
    on:cancel={() => (picking = false)}
  />
{:else}
  <div class="switchable-layout">
    <svelte:component this={component} {...componentProps} />
    {#if switchable}
      <button
        type="button"
        class="switch-button"
        aria-label="Change layout"
        title="Change layout"
        on:click={() => (picking = true)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </button>
    {/if}
  </div>
{/if}

<style>
  .switchable-layout {
    position: relative;
  }

  .switch-button {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 40;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    padding: 0;
    border-radius: 6px;
    border: 1px solid var(--background-modifier-border);
    background-color: var(--background-secondary);
    color: var(--text-muted);
    cursor: pointer;
    opacity: 0;
    transition: opacity 120ms ease-in-out;
  }

  .switchable-layout:hover .switch-button,
  .switch-button:focus-visible {
    opacity: 1;
  }

  /* No hover on touch devices — keep the button faintly visible instead. */
  @media (hover: none) {
    .switch-button {
      opacity: 0.6;
    }
  }

  .switch-button:hover {
    color: var(--text-normal);
    border-color: var(--interactive-accent);
  }
</style>
