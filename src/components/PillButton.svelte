<script>
  export let current = false;
</script>

<button
  type="button"
  class="w-3 h-3 rounded-full"
  class:current
  aria-current={current ? "true" : "false"}
  on:click
></button>

<style>
  /* Theme variables so the pills stay visible now the carousel background
     follows the active theme instead of being black. */
  button {
    background-color: var(--background-modifier-border, #d1d5db);
  }

  button.current {
    background-color: var(--text-muted, #4b5563);
  }
</style>
