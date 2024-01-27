<script lang="ts">
  export let layout: "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" = "a";
  export let imageUrls: string[] = [];
  export let requiredImages = 0;
  export let caption: string = "";
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

<div class={`image-layouts-grid image-layouts-layout-${layout}`}>
  {#each displayUrls as imageUrl, index (imageUrl)}
    <div class={`image-layouts-image-${index}`}>
      <img src={imageUrl} alt={`Image ${index + 1}`} />
    </div>
  {/each}
</div>
{#if caption !== ""}
  <div class="text-center text-xs text-gray-800 mt-2">{caption}</div>
{/if}

<style>
  .image-layouts-grid {
    display: grid;
    grid-gap: 0.5rem;
  }

  .image-layouts-grid > div {
    display: flex;
    overflow: hidden;
  }

  .image-layouts-grid > div > img {
    width: 100%;
    /* aspect-ratio: calc(4 / 3); */
    object-fit: cover;
  }

  /* .image-layouts-grid-area-feature {
	grid-area: feature;
} */
  .image-layouts-image-0 {
    grid-area: image-0;
  }
  .image-layouts-image-1 {
    grid-area: image-1;
  }
  .image-layouts-image-2 {
    grid-area: image-2;
  }
  .image-layouts-image-3 {
    grid-area: image-3;
  }
  .image-layouts-image-4 {
    grid-area: image-4;
  }
  .image-layouts-image-5 {
    grid-area: image-5;
  }
  .image-layouts-image-6 {
    grid-area: image-6;
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
