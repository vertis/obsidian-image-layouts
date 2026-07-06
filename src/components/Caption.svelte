<script lang="ts">
  export let caption: string | undefined = "";
</script>

{#if caption && caption !== ""}
  <div class="image-layouts-caption text-center text-xs my-2">{caption}</div>
{/if}

<style>
  /* Follow the active Obsidian theme instead of a fixed gray that
     disappears on dark backgrounds. */
  .image-layouts-caption {
    color: var(--text-muted);
  }
</style>
