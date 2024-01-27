<script lang="ts">
  export let imageUrls: string[] = [];
  const requiredImages = 2;
  let displayUrls: string[] = [];

  // If the number of imageUrls is less than requiredImages, fill the remaining with "placeholder.jpg"
  if (imageUrls.length < requiredImages) {
    displayUrls = [
      ...imageUrls,
      ...Array(requiredImages - imageUrls.length).fill(
        "https://via.placeholder.com/640x480"
      ),
    ];
  } else {
    displayUrls = imageUrls;
  }
</script>

<div class="grid gap-2 grid-cols-2">
  {#each displayUrls as imageUrl}
    <div class="flex overflow-hidden">
      <img src={imageUrl} class="w-full object-cover" />
    </div>
  {/each}
</div>
