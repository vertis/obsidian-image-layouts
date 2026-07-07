<script lang="ts">
  export let message: string;
</script>

<div class="image-layouts-error">{message}</div>

<style>
  .image-layouts-error {
    color: var(--text-muted);
    font-size: 0.85em;
    padding: 0.5rem;
    border: 1px dashed var(--background-modifier-border);
    border-radius: 6px;
    white-space: pre-wrap;
  }
</style>
