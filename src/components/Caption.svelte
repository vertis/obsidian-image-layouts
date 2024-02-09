<script lang="ts">
  export let caption: string | undefined = "";
</script>

{#if caption && caption !== ""}
  <div class="text-center text-xs text-gray-800 my-2">{caption}</div>
{/if}
