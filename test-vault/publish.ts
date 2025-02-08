// Types
type ImageLink = {
  url: string;
  alt?: string;
};

type LayoutType =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "single";

type FrontMatter = {
  type?: string;
  layout?: string;
  showThumbnails?: boolean;
  caption?: string;
  descriptions?: string[];
  permanentOverlay?: boolean;
};

// Layout configurations
const layoutImages: Record<LayoutType, number> = {
  a: 2,
  b: 2,
  c: 2,
  d: 3,
  e: 3,
  f: 4,
  g: 4,
  h: 3,
  i: 4,
  single: 1,
};

// Front matter parsing utility
const parseFrontMatter = (
  source: string
): { data: FrontMatter; content: string } => {
  const lines = source.split("\n");
  const result: { data: FrontMatter; content: string } = {
    data: {},
    content: source,
  };

  // Check if the content starts with front matter delimiters
  if (lines[0] !== "---") {
    return result;
  }

  // Find the closing delimiter
  const endIndex = lines.slice(1).findIndex((line) => line === "---") + 1;
  if (endIndex === 0) {
    return result;
  }

  // Extract and parse the front matter
  const frontMatter = lines.slice(1, endIndex).join("\n");
  const frontMatterLines = frontMatter.split("\n");

  frontMatterLines.forEach((line) => {
    const [key, ...valueParts] = line.split(":").map((part) => part.trim());
    const value = valueParts.join(":").trim();

    if (key && value) {
      if (value === "true") result.data[key] = true;
      else if (value === "false") result.data[key] = false;
      else result.data[key] = value;
    }
  });

  // Extract the content after front matter
  result.content = lines.slice(endIndex + 1).join("\n");

  return result;
};

// Image parsing utilities
const getImageFromLine = (line: string): ImageLink | null => {
  const mdMatch = line.match(/\[([^\]]*)\]\(([^\(]*)\)/);
  if (mdMatch) {
    const [_, alt, url] = mdMatch;
    return { url, alt };
  }
  return null;
};

const getImages = (source: string): ImageLink[] => {
  const lines = source.split("\n").filter((row) => row.startsWith("!"));
  const images = lines
    .map((line) => getImageFromLine(line.slice(1)))
    .filter((img): img is ImageLink => img !== null);
  return images;
};

console.log("Image Layouts loading...");

// Create legacy grid layout
function createLegacyGridLayout(
  images: ImageLink[],
  layout: LayoutType,
  config: FrontMatter
): HTMLElement {
  const container = document.createElement("div");
  container.className = `image-layouts image-layouts-grid image-layouts-layout-${layout}`;

  const requiredImages = layoutImages[layout];
  const displayImages =
    images.length < requiredImages
      ? [
          ...images,
          ...Array(requiredImages - images.length).fill({
            url: "https://via.placeholder.com/640x480",
          }),
        ]
      : images.slice(0, requiredImages);

  displayImages.forEach((image, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = `group relative image-layouts-image-${index}`;

    const img = document.createElement("img");
    img.src = image.url;
    img.alt = image.alt || `Image ${index + 1}`;
    img.className = "w-full h-full object-cover object-center";

    if (image.alt || (config.descriptions && config.descriptions[index])) {
      const description = config.descriptions?.[index] || image.alt;
      const overlay = document.createElement("div");
      overlay.className = "absolute bottom-0 left-0 right-0 flex items-end p-4";
      overlay.setAttribute("aria-hidden", "true");
      if (!config.permanentOverlay) {
        overlay.classList.add("opacity-0", "group-hover:opacity-100");
      }

      const text = document.createElement("div");
      text.className =
        "w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter";
      text.textContent = description;

      overlay.appendChild(text);
      wrapper.appendChild(overlay);
    }

    wrapper.appendChild(img);
    container.appendChild(wrapper);
  });

  if (config.caption) {
    const caption = document.createElement("div");
    caption.className = "text-center mt-2 text-sm text-gray-600";
    caption.textContent = config.caption;
    container.appendChild(caption);
  }

  return container;
}

// Create masonry layout
function createMasonryLayout(
  images: ImageLink[],
  columns: number,
  config: FrontMatter
): HTMLElement {
  const container = document.createElement("div");
  container.className = `image-layouts-masonry-grid-${columns}`;

  // Create column containers
  const columnElements: HTMLElement[] = Array(columns)
    .fill(null)
    .map(() => {
      const col = document.createElement("div");
      col.className = "image-layouts-masonry-column";
      return col;
    });

  // Distribute images across columns
  images.forEach((image, index) => {
    const colIndex = index % columns;
    const wrapper = document.createElement("div");
    wrapper.className = "group relative";

    const img = document.createElement("img");
    img.src = image.url;
    img.alt = image.alt || `Image ${index + 1}`;
    img.className = "w-full h-full object-cover object-center";

    if (image.alt || (config.descriptions && config.descriptions[index])) {
      const description = config.descriptions?.[index] || image.alt;
      const overlay = document.createElement("div");
      overlay.className = "absolute bottom-0 left-0 right-0 flex items-end p-4";
      overlay.setAttribute("aria-hidden", "true");
      if (!config.permanentOverlay) {
        overlay.classList.add("opacity-0", "group-hover:opacity-100");
      }

      const text = document.createElement("div");
      text.className =
        "w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-gray-900 backdrop-blur backdrop-filter";
      text.textContent = description;

      overlay.appendChild(text);
      wrapper.appendChild(overlay);
    }

    wrapper.appendChild(img);
    columnElements[colIndex].appendChild(wrapper);
  });

  // Add columns to container
  columnElements.forEach((col) => container.appendChild(col));

  if (config.caption) {
    const caption = document.createElement("div");
    caption.className = "text-center mt-2 text-sm text-gray-600";
    caption.textContent = config.caption;
    container.appendChild(caption);
  }

  return container;
}

// Create carousel
function createCarousel(images: ImageLink[], showThumbnails?: boolean) {
  // Create main container
  const container = document.createElement("div");
  container.className = "image-layout-carousel";

  // Create slides container
  const slidesContainer = document.createElement("div");
  slidesContainer.className = "slides-container";

  // Create and append slides
  for (const [index, image] of images.entries()) {
    const slide = document.createElement("div");
    slide.className = `slide${index === 0 ? " active" : ""}`;

    const img = document.createElement("img");
    img.src = image.url;
    img.alt = image.alt || `Image ${index + 1}`;

    slide.appendChild(img);
    slidesContainer.appendChild(slide);
  }

  // Create navigation buttons
  const prevButton = document.createElement("button");
  prevButton.className = "nav-button prev";
  prevButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
  `;

  const nextButton = document.createElement("button");
  nextButton.className = "nav-button next";
  nextButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  `;

  let currentSlide = 0;

  function goToSlide(index: number) {
    const slides = Array.from(
      slidesContainer.getElementsByClassName("slide")
    ) as HTMLElement[];
    slides[currentSlide].classList.remove("active");
    slides[index].classList.add("active");

    if (thumbnailsContainer) {
      const thumbnails = Array.from(
        thumbnailsContainer.getElementsByTagName("img")
      );
      thumbnails[currentSlide].classList.remove("active");
      thumbnails[index].classList.add("active");

      // Scroll thumbnail into view
      const thumbnail = thumbnails[index];
      thumbnail.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }

    currentSlide = index;
  }

  function nextSlide() {
    const newIndex = (currentSlide + 1) % images.length;
    goToSlide(newIndex);
  }

  function prevSlide() {
    const newIndex = (currentSlide - 1 + images.length) % images.length;
    goToSlide(newIndex);
  }

  // Add event listeners
  nextButton.onclick = nextSlide;
  prevButton.onclick = prevSlide;

  // Add keyboard navigation
  container.tabIndex = 0;
  container.onkeydown = (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  };

  // Create thumbnails container if enabled
  let thumbnailsContainer: HTMLElement | undefined;
  if (showThumbnails) {
    thumbnailsContainer = document.createElement("div");
    thumbnailsContainer.className = "thumbnails-container";

    // Create thumbnail items
    for (let i = 0; i < images.length; i++) {
      const thumbnailItem = document.createElement("div");
      thumbnailItem.className = "thumbnail-item";

      const thumbnail = document.createElement("img");
      thumbnail.src = images[i].url;
      thumbnail.alt = images[i].alt || `Thumbnail ${i + 1}`;
      if (i === 0) {
        thumbnail.classList.add("active");
      }
      thumbnail.onclick = () => goToSlide(i);

      thumbnailItem.appendChild(thumbnail);
      thumbnailsContainer.appendChild(thumbnailItem);
    }
  }

  // Assemble carousel in correct order
  container.appendChild(slidesContainer);
  container.appendChild(prevButton);
  container.appendChild(nextButton);
  if (thumbnailsContainer) {
    container.appendChild(thumbnailsContainer);
  }

  return container;
}

// Register processors for all layout types
declare const publish: {
  registerMarkdownCodeBlockProcessor: (
    type: string,
    processor: (source: string, el: HTMLElement) => void
  ) => void;
};

// Register main image-layout processor
publish.registerMarkdownCodeBlockProcessor("image-layout", (source, el) => {
  console.log("Processing image-layout block:", { source });

  const { data, content } = parseFrontMatter(source);
  const images = getImages(content);

  if (!data.layout) {
    console.error("No layout specified in front matter");
    return;
  }

  console.log("Parsed config:", { data, images });

  // Clear existing content
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }

  if (data.layout === "carousel") {
    console.log("Creating carousel with thumbnails:", data.showThumbnails);
    const carousel = createCarousel(images, data.showThumbnails !== false); // Default to showing thumbnails
    el.appendChild(carousel);
  } else if (data.layout.match(/^legacy-layout-[a-i]$/)) {
    const layoutType = data.layout.charAt(data.layout.length - 1) as LayoutType;
    if (layoutImages[layoutType]) {
      const grid = createLegacyGridLayout(images, layoutType, data);
      el.appendChild(grid);
    }
  } else if (data.layout.match(/^legacy-masonry-[2-6]$/)) {
    const columns = parseInt(data.layout.charAt(data.layout.length - 1));
    if (columns >= 2 && columns <= 6) {
      const masonry = createMasonryLayout(images, columns, data);
      el.appendChild(masonry);
    }
  }
});

// Register legacy layout processors for backward compatibility
Object.keys(layoutImages).forEach((layout) => {
  publish.registerMarkdownCodeBlockProcessor(
    `image-layout-${layout}`,
    (source, el) => {
      const { data, content } = parseFrontMatter(source);
      const images = getImages(content);
      const grid = createLegacyGridLayout(images, layout as LayoutType, data);
      el.replaceChildren(grid);
    }
  );
});

// Register legacy masonry processors
for (let columns = 2; columns <= 6; columns++) {
  publish.registerMarkdownCodeBlockProcessor(
    `image-layout-masonry-${columns}`,
    (source, el) => {
      const { data, content } = parseFrontMatter(source);
      const images = getImages(content);
      const masonry = createMasonryLayout(images, columns, data);
      el.replaceChildren(masonry);
    }
  );
}

console.log("Image Layouts loaded");

// Process existing blocks on page load
document.addEventListener("DOMContentLoaded", () => {
  console.log("Processing existing image-layout blocks");
  const blocks = document.querySelectorAll("pre > code.language-image-layout");
  console.log("Found blocks:", blocks.length);

  for (const block of blocks) {
    const source = block.textContent || "";
    const { data, content } = parseFrontMatter(source);
    const images = getImages(content);

    console.log("Processing block:", { data, images });

    if (images.length > 0) {
      let layout;
      if (block.className.includes("language-image-layout-masonry-")) {
        const columns = parseInt(block.className.split("-").pop() || "2");
        layout = createMasonryLayout(images, columns, data);
      } else if (block.className.includes("language-image-layout-")) {
        const layoutType = block.className.split("-").pop() as LayoutType;
        if (layoutImages[layoutType]) {
          layout = createLegacyGridLayout(images, layoutType, data);
        }
      } else if (data.layout === "carousel") {
        layout = createCarousel(images, data.showThumbnails !== false); // Default to showing thumbnails
      }

      if (layout && block.parentElement) {
        console.log("Replacing block with layout");
        block.parentElement.replaceWith(layout);
      }
    }
  }
});
