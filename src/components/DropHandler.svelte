<script lang="ts">
  function handleDrop(event: DragEvent) {
    console.log(event);
    //const files = event.dataTransfer.files;
  }
</script>

<div on:drop={handleDrop}><slot /></div>
