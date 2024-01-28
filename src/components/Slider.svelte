<script lang="ts">
  let idx = 0;
  export let imageUrls: string[]; // replace with actual image urls

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

<div class="relative w-full">
  <!-- Carousel wrapper -->
  <div class="relative h-56 w-full overflow-hidden rounded-lg md:h-96">
    <img
      src={imageUrls[idx]}
      class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
      alt={`Image ${idx + 1}`}
    />
  </div>
  <!-- Slider indicators -->
  <div
    class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse"
  >
    {#each imageUrls as _, i}
      <button
        type="button"
        class={`w-3 h-3 rounded-full ${idx === i ? "bg-gray-500" : "bg-white"}`}
        aria-current={idx === i ? "true" : "false"}
        aria-label={`Slide ${i + 1}`}
        on:click={() => (idx = i)}
      ></button>
    {/each}
  </div>
  <!-- Slider controls -->
  <button
    type="button"
    class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
    on:click={prev}
  >
    <span
      class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"
    >
      <svg
        class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 6 10"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 1 1 5l4 4"
        />
      </svg>
      <span class="sr-only">Previous</span>
    </span>
  </button>
  <button
    type="button"
    class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
    on:click={next}
  >
    <span
      class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none"
    >
      <svg
        class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 6 10"
      >
        <path
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="m1 9 4-4-4-4"
        />
      </svg>
      <span class="sr-only">Next</span>
    </span>
  </button>
</div>
