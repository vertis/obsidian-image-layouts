<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { LayoutType } from "../interfaces";
  const dispatch = createEventDispatcher();

  async function selectLayout(
    event: KeyboardEvent | MouseEvent,
    layout: LayoutType | "carousel",
    params?: any
  ) {
    event.preventDefault();
    await dispatch("layout-selected", {
      type: layout,
      params,
    });
  }
</script>

<div class="p-4 bg-gray-50">
  <div class="text-base font-semibold leading-6 text-gray-900">
    Select an image layout
  </div>
  <div class="text-xs font-normal leading-6 text-gray-900">
    More layouts coming soon
  </div>

  <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
    <label
      class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
      on:click={(event) => selectLayout(event, "carousel")}
      on:keydown={(event) => selectLayout(event, "carousel")}
    >
      <input
        type="radio"
        name="project-type"
        value="Carousel"
        class="sr-only"
        aria-labelledby="project-type-0-label"
        aria-describedby="project-type-0-description-0 project-type-0-description-1"
      />
      <span class="flex flex-1">
        <span class="flex flex-col">
          <span
            id="project-type-0-label"
            class="block text-sm font-medium text-gray-900">Carousel</span
          >
          <span
            id="project-type-0-description-0"
            class="mt-1 flex items-center text-sm text-gray-500"
            >Without thumbnails. Simple pills and slider</span
          >
        </span>
      </span>
      <svg
        class="h-5 w-5 text-indigo-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clip-rule="evenodd"
        />
      </svg>
      <span
        class="pointer-events-none absolute -inset-px rounded-lg border-2"
        aria-hidden="true"
      ></span>
    </label>
    <label
      class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
      on:click={(event) =>
        selectLayout(event, "carousel", { showThumbnails: true })}
      on:keydown={(event) =>
        selectLayout(event, "carousel", { showThumbnails: true })}
    >
      <input
        type="radio"
        name="project-type"
        value="carousel-thumbnails"
        class="sr-only"
        aria-labelledby="project-type-1-label"
        aria-describedby="project-type-1-description-0 project-type-1-description-1"
      />
      <span class="flex flex-1">
        <span class="flex flex-col">
          <span
            id="project-type-1-label"
            class="block text-sm font-medium text-gray-900">Carousel</span
          >
          <span
            id="project-type-1-description-0"
            class="mt-1 flex items-center text-sm text-gray-500"
            >With thumbnails</span
          >
        </span>
      </span>
      <svg
        class="h-5 w-5 text-indigo-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
          clip-rule="evenodd"
        />
      </svg>
      <span
        class="pointer-events-none absolute -inset-px rounded-lg border-2"
        aria-hidden="true"
      ></span>
    </label>
  </div>
</div>
