console.log('Image Layouts loading...');

// Register the code block processor
publish.registerMarkdownCodeBlockProcessor('image-layout', (source, el, ctx) => {
    console.log('Processing image-layout block:', { source, el, ctx });
    
    // Parse the content
    const parts = source.split('---').filter(Boolean);
    if (parts.length < 2) {
        console.log('Invalid format - not enough parts');
        return;
    }
    
    const [frontMatter, ...imageLines] = parts;
    const config = parseFrontMatter(frontMatter);
    console.log('Parsed config:', config);
    
    if (config.layout === 'carousel') {
        console.log('Creating carousel');
        const images = parseImageLines(imageLines.join('---'));
        console.log('Parsed images:', images);
        
        // Create carousel element
        const carousel = createCarousel(images, config.carouselShowThumbnails);
        
        // Replace content with carousel
        el.empty();
        el.appendChild(carousel);
    } else {
        console.log('Not a carousel layout:', config.layout);
    }
});

function parseFrontMatter(frontMatter) {
    const config = {};
    for (const line of frontMatter.split('\n')) {
        const [key, value] = line.split(':').map(s => s.trim());
        if (key && value) {
            config[key] = value === 'true' ? true : value === 'false' ? false : value;
        }
    }
    return config;
}

function parseImageLines(content) {
    return content.match(/!\[.*?\]\(.*?\)/g)?.map(img => {
        const url = img.match(/\((.*?)\)/)[1];
        const alt = img.match(/\[(.*?)\]/)[1];
        return { url, alt };
    }) || [];
}

function createCarousel(images, showThumbnails) {
    const container = document.createElement('div');
    container.className = 'image-layout image-layout-carousel';
    
    const slidesContainer = document.createElement('div');
    slidesContainer.className = 'carousel-container';
    
    const slides = document.createElement('div');
    slides.className = 'carousel-slides';
    
    let currentSlide = 0;
    
    // Add images
    for (const [index, image] of images.entries()) {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.innerHTML = `<img src="${image.url}" alt="${image.alt || ''}" />`;
        slides.appendChild(slide);
    }
    
    // Add navigation
    const nav = document.createElement('div');
    nav.className = 'carousel-nav';
    nav.innerHTML = `
        <button class="carousel-button prev">←</button>
        <button class="carousel-button next">→</button>
    `;
    
    // Add thumbnails if enabled
    let thumbnails;
    if (showThumbnails) {
        thumbnails = document.createElement('div');
        thumbnails.className = 'carousel-thumbnails';
        for (const [index, image] of images.entries()) {
            const thumb = document.createElement('img');
            thumb.src = image.url;
            thumb.className = `carousel-thumbnail ${index === 0 ? 'active' : ''}`;
            thumb.addEventListener('click', () => goToSlide(index));
            thumbnails.appendChild(thumb);
        }
    }
    
    // Assemble carousel
    slidesContainer.appendChild(slides);
    container.appendChild(slidesContainer);
    container.appendChild(nav);
    if (thumbnails) {
        container.appendChild(thumbnails);
    }
    
    // Navigation functions
    function goToSlide(index) {
        currentSlide = index;
        slides.style.transform = `translateX(-${currentSlide * 100}%)`;
        if (thumbnails) {
            const thumbs = thumbnails.querySelectorAll('.carousel-thumbnail');
            for (const [i, thumb] of [...thumbs].entries()) {
                thumb.classList.toggle('active', i === currentSlide);
            }
        }
    }
    
    nav.querySelector('.prev').addEventListener('click', () => {
        goToSlide((currentSlide - 1 + images.length) % images.length);
    });
    
    nav.querySelector('.next').addEventListener('click', () => {
        goToSlide((currentSlide + 1) % images.length);
    });
    
    return container;
}

console.log('Image Layouts loaded');