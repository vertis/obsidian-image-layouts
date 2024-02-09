<button
  on:click
  class="rounded-full bg-gray-600 p-2 text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2
      focus-visible:outline-offset-2 focus-visible:outline-bg-gray-600 w-10 h-10"
>
  <slot />
</button>

<style>
  button {
    --un-shadow: var(--un-shadow-inset) 0 1px 2px 0
      var(--un-shadow-color, rgb(0 0 0 / 0.05));
    box-shadow: var(--un-ring-offset-shadow), var(--un-ring-shadow),
      var(--un-shadow);
    --un-bg-opacity: 1;
    background-color: rgb(75 85 99 / var(--un-bg-opacity));
  }
</style>
