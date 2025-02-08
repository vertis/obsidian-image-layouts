// Types
type ImageLink = {
  url: string;
  alt?: string;
};

type FrontMatter = {
  type?: string;
  showThumbnails?: boolean;
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

// Register the code block processor
declare global {
  const publish: {
    registerMarkdownCodeBlockProcessor: (
      type: string,
      processor: (source: string, el: HTMLElement) => void
    ) => void;
  };
}

publish.registerMarkdownCodeBlockProcessor("image-layout", (source, el) => {
  console.log("Processing image-layout block:", { source });

  const { data, content } = parseFrontMatter(source);
  const config = {
    layout: data.layout,
    carouselShowThumbnails: data.carouselShowThumbnails,
  };

  if (!data) {
    console.error("Failed to parse front matter");
    return;
  }

  console.log("Parsed config:", config);

  if (config.layout === "carousel") {
    console.log("Creating carousel");
    const images = getImages(content);
    console.log("Parsed images:", images);

    // Create carousel element
    const carousel = createCarousel(images, config.carouselShowThumbnails);

    // Replace content with carousel
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    el.append(carousel);
  } else {
    console.log("Not a carousel layout:", config.layout);
  }
});

function createCarousel(images: ImageLink[], showThumbnails?: boolean) {
  // Create container
  const container = document.createElement("div");
  container.className = "image-layout-carousel";
  container.style.position = "relative";
  container.style.width = "100%";
  container.style.height = "400px";
  container.style.overflow = "hidden";

  // Create slides container
  const slidesContainer = document.createElement("div");
  slidesContainer.className = "slides";
  slidesContainer.style.position = "relative";
  slidesContainer.style.width = "100%";
  slidesContainer.style.height = "100%";

  // Create and append slides
  images.forEach((image, index) => {
    const slide = document.createElement("div");
    slide.className = "slide";
    slide.style.position = "absolute";
    slide.style.top = "0";
    slide.style.left = "0";
    slide.style.width = "100%";
    slide.style.height = "100%";
    slide.style.opacity = index === 0 ? "1" : "0";
    slide.style.transition = "opacity 0.5s ease-in-out";

    const img = document.createElement("img");
    img.src = image.url;
    if (image.alt) img.alt = image.alt;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";

    slide.appendChild(img);
    slidesContainer.appendChild(slide);
  });

  // Create navigation buttons
  const prevButton = document.createElement("button");
  prevButton.textContent = "←";
  prevButton.className = "nav-button prev";
  prevButton.style.position = "absolute";
  prevButton.style.left = "10px";
  prevButton.style.top = "50%";
  prevButton.style.transform = "translateY(-50%)";
  prevButton.style.zIndex = "1";
  prevButton.style.padding = "10px";
  prevButton.style.background = "rgba(0, 0, 0, 0.5)";
  prevButton.style.color = "white";
  prevButton.style.border = "none";
  prevButton.style.borderRadius = "5px";
  prevButton.style.cursor = "pointer";

  const nextButton = document.createElement("button");
  nextButton.textContent = "→";
  nextButton.className = "nav-button next";
  nextButton.style.position = "absolute";
  nextButton.style.right = "10px";
  nextButton.style.top = "50%";
  nextButton.style.transform = "translateY(-50%)";
  nextButton.style.zIndex = "1";
  nextButton.style.padding = "10px";
  nextButton.style.background = "rgba(0, 0, 0, 0.5)";
  nextButton.style.color = "white";
  nextButton.style.border = "none";
  nextButton.style.borderRadius = "5px";
  nextButton.style.cursor = "pointer";

  // Add thumbnails if enabled
  let thumbnailsContainer;
  if (showThumbnails) {
    thumbnailsContainer = document.createElement("div");
    thumbnailsContainer.className = "thumbnails";
    thumbnailsContainer.style.position = "absolute";
    thumbnailsContainer.style.bottom = "10px";
    thumbnailsContainer.style.left = "50%";
    thumbnailsContainer.style.transform = "translateX(-50%)";
    thumbnailsContainer.style.display = "flex";
    thumbnailsContainer.style.gap = "10px";
    thumbnailsContainer.style.zIndex = "1";

    images.forEach((image, index) => {
      const thumbnail = document.createElement("img");
      thumbnail.src = image.url;
      thumbnail.style.width = "50px";
      thumbnail.style.height = "50px";
      thumbnail.style.objectFit = "cover";
      thumbnail.style.cursor = "pointer";
      thumbnail.style.border =
        index === 0 ? "2px solid white" : "2px solid transparent";
      thumbnail.style.borderRadius = "5px";
      thumbnail.onclick = () => goToSlide(index);
      thumbnailsContainer.appendChild(thumbnail);
    });
  }

  let currentSlide = 0;

  function goToSlide(index: number) {
    const slides = slidesContainer.getElementsByClassName("slide");
    slides[currentSlide].style.opacity = "0";
    slides[index].style.opacity = "1";

    if (showThumbnails && thumbnailsContainer) {
      const thumbnails = thumbnailsContainer.getElementsByTagName("img");
      thumbnails[currentSlide].style.border = "2px solid transparent";
      thumbnails[index].style.border = "2px solid white";
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

  // Assemble carousel
  container.appendChild(slidesContainer);
  container.appendChild(prevButton);
  container.appendChild(nextButton);
  if (showThumbnails && thumbnailsContainer) {
    container.appendChild(thumbnailsContainer);
  }

  return container;
}

console.log("Image Layouts loaded");

// Process markdown code blocks
document.addEventListener("DOMContentLoaded", () => {
  const codeBlocks = document.querySelectorAll(
    "pre > code.language-image-layout"
  );

  codeBlocks.forEach((block) => {
    const source = block.textContent || "";
    const { data, content } = parseFrontMatter(source);

    const images = getImages(content);
    if (images.length > 0) {
      const carousel = createCarousel(images, data.showThumbnails);
      block.parentElement?.replaceWith(carousel);
    }
  });
});
