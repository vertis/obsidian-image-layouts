<script lang="ts">
  import ImageLayouts from "./ImageLayouts.svelte";
  import NextButton from "./NextButton.svelte";
  import PillButton from "./PillButton.svelte";
  import PrevButton from "./PrevButton.svelte";

  let idx = 0;
  export let imageUrls: string[]; // replace with actual image urls
  export let showThumbnails: boolean = false;

  function next() {
    if (idx < imageUrls.length - 1) {
      idx += 1;
    } else {
      idx = 0; // Loop back to the first image
    }
  }

  function prev() {
    if (idx > 0) {
      idx -= 1;
    } else {
      idx = imageUrls.length - 1; // Loop back to the last image
    }
  }
</script>

<ImageLayouts>
  <div class="px-2 md:px-8 bg-black flex flex-col gap-y-2 cursor-default">
    <div
      class="relative py-2 flex w-full overflow-hidden rounded-lg h-56 md:h-96 items-center justify-center"
    >
      <img
        src={imageUrls[idx]}
        class="object-center object-contain h-full"
        alt={`Image ${idx + 1}`}
      />
      <div
        class="absolute mx-8 flex h-full w-full justify-between items-center z-30"
      >
        <PrevButton on:click={prev} />
        <NextButton on:click={next} />
      </div>
    </div>

    <div class="w-full mb-2">
      {#if showThumbnails}
        <div
          class="overflow-x-auto overflow-y-hidden whitespace-nowrap touch-pan-x scroll-snap-x scrollbar-hide"
          on:touchmove={(e) => {
            e.preventDefault();
            const slide = e.targetTouches[0].clientX;
            if (e?.target?.scrollLeft) {
              e.target.scrollLeft += slide;
            }
          }}
        >
          {#each imageUrls as imageUrl, i}
            <div
              class="inline-block w-24 h-16 scroll-snap-align-start mr-2 mb-2"
            >
              <img
                src={imageUrl}
                class="w-full h-full object-cover rounded-md"
                alt={`Thumbnail ${i + 1}`}
                on:click={() => (idx = i)}
              />
            </div>
          {/each}
        </div>
      {:else}
        <div
          class="flex items-center justify-center space-x-3 rtl:space-x-reverse"
        >
          {#each imageUrls as _, i}
            <PillButton current={idx === i} on:click={() => (idx = i)} />
          {/each}
        </div>
      {/if}
    </div>
  </div>
</ImageLayouts>
