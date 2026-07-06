<script lang="ts">
  import type { ReadyImageLink } from "../utils/images";
  import Caption from "./Caption.svelte";
  import ImageLayouts from "./ImageLayouts.svelte";
  import NextButton from "./NextButton.svelte";
  import PillButton from "./PillButton.svelte";
  import PrevButton from "./PrevButton.svelte";

  let idx = 0;
  export let images: ReadyImageLink[] = [];
  export let showThumbnails: boolean = false;
  export let caption: string = "";
  export let descriptions: string[] = [];
  export let background: string = "var(--background-secondary)";
  export let height: number | string = "24rem";

  $: heightStyle = typeof height === "number" ? `${height}px` : height;
  $: currentDescription = descriptions[idx] ?? images[idx]?.alt;

  function next() {
    if (idx < images.length - 1) {
      idx += 1;
    } else {
      idx = 0; // Loop back to the first image
    }
  }

  function prev() {
    if (idx > 0) {
      idx -= 1;
    } else {
      idx = images.length - 1; // Loop back to the last image
    }
  }
</script>

<ImageLayouts>
  <div
    class="px-2 md:px-8 rounded-lg flex flex-col gap-y-2 cursor-default"
    style:background
  >
    <div
      class="carousel-stage relative py-2 flex w-full overflow-hidden rounded-lg items-center justify-center"
      style:height={heightStyle}
    >
      <img
        src={images[idx]?.link}
        alt={currentDescription ?? `Image ${idx + 1}`}
      />
      <div
        class="absolute mx-8 flex h-full w-full justify-between items-center z-30"
      >
        <PrevButton on:click={prev} />
        <NextButton on:click={next} />
      </div>
    </div>

    {#if currentDescription}
      <div class="carousel-description w-full px-4 text-center text-sm">
        {currentDescription}
      </div>
    {/if}

    <div class="w-full mb-2">
      {#if showThumbnails}
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div
          class="overflow-x-auto overflow-y-hidden whitespace-nowrap touch-pan-x scroll-snap-x scrollbar-hide"
          on:touchmove|stopPropagation={() => {}}
        >
          {#each images as image, i}
            <div
              class="carousel-thumbnail inline-block w-24 h-16 scroll-snap-align-start mr-2 mb-2"
            >
              <button
                type="button"
                class="w-full h-full p-0 cursor-pointer"
                on:click={() => (idx = i)}
              >
                <img
                  src={image.link}
                  alt={descriptions[i] ?? image.alt ?? `Thumbnail ${i + 1}`}
                />
              </button>
            </div>
          {/each}
        </div>
      {:else}
        <div
          class="flex items-center justify-center space-x-3 rtl:space-x-reverse"
        >
          {#each images as _, i}
            <PillButton current={idx === i} on:click={() => (idx = i)} />
          {/each}
        </div>
      {/if}
    </div>
  </div>
  <Caption {caption} />
</ImageLayouts>

<style>
  /* Sizing lives on wrappers as descendant rules rather than as classes on
     the img elements, so it stops applying when Obsidian's fullscreen image
     viewer lifts an img out of the carousel (#28). */
  .carousel-stage :global(img) {
    height: 100%;
    object-fit: contain;
    object-position: center;
  }

  .carousel-thumbnail :global(img) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 0.375rem;
  }

  .carousel-description {
    color: var(--text-muted);
  }
</style>
