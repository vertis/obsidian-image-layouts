<script lang="ts">
  import LegacyGridImage from "./LegacyGridImage.svelte";

  export let layout: "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" = "a";
  export let imageUrls: string[] = [];
  export let requiredImages = 0;
  export let caption: string = "";
  export let descriptions: string[] = [];

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
    displayUrls = imageUrls.slice(0, requiredImages);
  }
</script>

<div class={`image-layouts-grid image-layouts-layout-${layout} cursor-default`}>
  {#each displayUrls as imageUrl, index (imageUrl)}
    <LegacyGridImage
      {index}
      src={imageUrl}
      description={descriptions[index] ?? `Image ${index + 1}`}
    />
  {/each}
</div>
{#if caption !== ""}
  <div class="text-center text-xs text-gray-800 my-2">{caption}</div>
{/if}

<style>
  .image-layouts-grid {
    display: grid;
    grid-gap: 0.5rem;
  }

  .image-layouts-layout-a {
    grid-template-columns: 1fr 1fr;
    grid-template-areas: "image-0 image-1";
  }

  .image-layouts-layout-b {
    grid-template-columns: 2fr 1fr;
    grid-template-areas: "image-0 image-1";
  }

  .image-layouts-layout-c {
    grid-template-columns: 1fr 2fr;
    grid-template-areas: "image-1 image-0";
  }

  .image-layouts-layout-d {
    grid-template-columns: 2fr 1fr;
    grid-template-areas:
      "image-0 image-1"
      "image-0 image-2";
  }

  .image-layouts-layout-e {
    grid-template-columns: 1fr 2fr;
    grid-template-areas:
      "image-1 image-0"
      "image-2 image-0";
  }

  .image-layouts-layout-f {
    grid-template-columns: 3fr 1fr;
    grid-template-areas:
      "image-0 image-1"
      "image-0 image-2"
      "image-0 image-3";
  }

  .image-layouts-layout-g {
    grid-template-columns: 1fr 3fr;
    grid-template-areas:
      "image-1 image-0"
      "image-2 image-0"
      "image-3 image-0";
  }

  .image-layouts-layout-h {
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: "image-0 image-1 image-2";
  }

  .image-layouts-layout-i {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-areas: "image-0 image-1 image-2 image-3";
  }
</style>