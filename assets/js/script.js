// ================================
// CONTENT LOADING & CAROUSEL STATE
// ================================

let destinationsData = [];
let carouselState = {
    currentIndex: 0,
    isAutoPlay: false,
    autoPlayInterval: null
};

async function loadContent() {
    try {
        const response = await fetch('assets/data/content.json');
        const data = await response.json();
        destinationsData = data.destinations;
        renderDestinations();
        populateNavigation();
        initializeCarousel();
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function renderDestinations() {
    const container = document.getElementById('destinations-container');
    if (!container || !destinationsData.length) return;

    container.innerHTML = destinationsData.map((dest, idx) => `
        <article
            id="${dest.id}"
            class="destination-card"
            role="article"
            data-index="${idx}"
            aria-label="Destination ${idx + 1} of ${destinationsData.length}: ${dest.title}"
        >
            <div class="card-image">
                <img
                    src="assets/images/${dest.imageHero}"
                    alt="${dest.title} - ${dest.description}"
                    loading="lazy"
                    decoding="async"
                >
            </div>
            <div class="card-content">
                <h3>${dest.title}</h3>
                <p class="destination-type">${dest.category}</p>
                <p class="description">${dest.description}</p>
                <ul class="highlights-list" aria-label="Highlights">
                    ${dest.highlights.slice(0, 3).map(h => `<li>${h}</li>`).join('')}
                </ul>
                <div class="card-meta">
                    <span class="location">📍 ${dest.location}</span>
                    <span class="rating">⭐ ${dest.rating}/5</span>
                </div>
                <a href="#${dest.id}" class="read-more">Discover More →</a>
            </div>
        </article>
    `).join('');

    // Re-observe cards after rendering
    const cards = document.querySelectorAll('.destination-card');
    cards.forEach((card) => observer.observe(card));

    // Re-attach card event listeners
    attachCardEventListeners();
}

function populateNavigation() {
    const navContainer = document.getElementById('nav-destinations');
    if (!navContainer || !destinationsData.length) return;

    navContainer.innerHTML = destinationsData.map((dest) => `
        <li><a href="#${dest.id}">${dest.title}</a></li>
    `).join('');

    // Re-attach nav event listeners
    attachNavEventListeners();
}

// ================================
// CAROUSEL INITIALIZATION & CONTROL
// ================================

function initializeCarousel() {
    createCarouselControls();
    createPaginationDots();
    updateCarouselDisplay();
    attachCarouselEventListeners();
    attachKeyboardNavigation();
}

function createCarouselControls() {
    const container = document.getElementById('destinations-container');
    if (!container) return;

    const controlsHTML = `
        <div class="carousel-controls" role="group" aria-label="Carousel controls">
            <button
                class="carousel-btn carousel-prev"
                aria-label="Previous destination"
                title="Previous (← arrow key)"
            >
                <span>❮</span>
            </button>
            <button
                class="carousel-btn carousel-next"
                aria-label="Next destination"
                title="Next (→ arrow key)"
            >
                <span>❯</span>
            </button>
        </div>
    `;
    container.insertAdjacentHTML('afterend', controlsHTML);
}

function createPaginationDots() {
    const container = document.getElementById('destinations-container');
    if (!container) return;

    const dotsHTML = `
        <div class="carousel-pagination" role="tablist" aria-label="Destination selector">
            ${destinationsData.map((_, idx) => `
                <button
                    class="pagination-dot ${idx === 0 ? 'active' : ''}"
                    data-index="${idx}"
                    role="tab"
                    aria-label="Go to destination ${idx + 1}"
                    aria-selected="${idx === 0}"
                    title="Destination ${idx + 1}"
                ></button>
            `).join('')}
        </div>
    `;
    container.insertAdjacentHTML('afterend', dotsHTML);
}

function updateCarouselDisplay() {
    const cards = document.querySelectorAll('.destination-card');
    cards.forEach((card, idx) => {
        card.classList.toggle('active', idx === carouselState.currentIndex);
        card.setAttribute('aria-hidden', idx !== carouselState.currentIndex);
    });

    // Update pagination dots
    const dots = document.querySelectorAll('.pagination-dot');
    dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === carouselState.currentIndex);
        dot.setAttribute('aria-selected', idx === carouselState.currentIndex);
    });
}

function slideToIndex(index) {
    carouselState.currentIndex = (index + destinationsData.length) % destinationsData.length;
    updateCarouselDisplay();
}

function nextSlide() {
    slideToIndex(carouselState.currentIndex + 1);
}

function prevSlide() {
    slideToIndex(carouselState.currentIndex - 1);
}

// ================================
// SMOOTH SCROLLING & NAVIGATION
// ================================

// Update active navigation link on scroll
let navLinks = document.querySelectorAll('.nav-links a');
let sections = document.querySelectorAll('section, header');

function updateActiveNav() {
    let currentSection = '';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop - 300) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe destination cards
const destinationCards = document.querySelectorAll('.destination-card');
destinationCards.forEach((card) => {
    observer.observe(card);
});

// Observe section titles
const sectionTitles = document.querySelectorAll('.section-title');
sectionTitles.forEach((title) => {
    observer.observe(title);
});

// ================================
// PARALLAX EFFECT ON HERO
// ================================

const hero = document.querySelector('.hero');
const starfield = document.querySelector('.starfield');

window.addEventListener('scroll', () => {
    if (starfield) {
        const scrollPosition = window.scrollY;
        starfield.style.transform = `translateY(${scrollPosition * 0.5}px)`;
    }
});

// Note: Smooth scroll and card interactions are now handled dynamically
// See: renderDestinations(), populateNavigation(), attachNavEventListeners(), attachCardEventListeners()

// ================================
// LAZY LOADING FOR IMAGES
// ================================

if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img').forEach((img) => imageObserver.observe(img));
}

// ================================
// SCROLL PROGRESS INDICATOR
// ================================

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    // Optional: Emit custom event for external use
    window.scrollProgress = scrolled;
}

window.addEventListener('scroll', updateScrollProgress);

// ================================
// KEYBOARD NAVIGATION
// ================================

// Arrow key navigation between sections
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        window.scrollBy({
            top: 300,
            behavior: 'smooth',
        });
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        window.scrollBy({
            top: -300,
            behavior: 'smooth',
        });
    }
});

// ================================
// RESPONSIVE STARFIELD ANIMATION
// ================================

function adjustStarfieldForDevice() {
    const isMobile = window.innerWidth < 768;
    const starfield = document.querySelector('.starfield');

    if (starfield) {
        if (isMobile) {
            starfield.style.animationDuration = '2s';
        } else {
            starfield.style.animationDuration = '3s';
        }
    }
}

window.addEventListener('resize', adjustStarfieldForDevice);
window.addEventListener('load', adjustStarfieldForDevice);

// ================================
// PERFORMANCE OPTIMIZATION
// ================================

// Throttle scroll events for better performance
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

// Apply throttle to expensive operations
const throttledScroll = throttle(updateActiveNav, 100);
window.addEventListener('scroll', throttledScroll);

// ================================
// INITIALIZATION
// ================================

function attachNavEventListeners() {
    navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
    updateActiveNav();
}

function attachCarouselEventListeners() {
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const dots = document.querySelectorAll('.pagination-dot');

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'), 10);
            slideToIndex(index);
        });
    });
}

function attachKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'Enter') {
            const activeCard = document.querySelector('.destination-card.active');
            if (activeCard) {
                const readMoreBtn = activeCard.querySelector('.read-more');
                if (readMoreBtn) readMoreBtn.click();
            }
        }
    });
}

function attachCardEventListeners() {
    const cards = document.querySelectorAll('.destination-card');
    cards.forEach((card) => {
        card.addEventListener('mouseenter', function () {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function () {
            this.style.zIndex = '1';
        });

        const readMoreBtn = card.querySelector('.read-more');
        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.style.borderColor = 'rgba(124, 58, 237, 0.8)';
                    setTimeout(() => {
                        card.style.borderColor = 'rgba(124, 58, 237, 0.3)';
                    }, 2000);
                }
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Cosmic Getaways loaded successfully!');
    adjustStarfieldForDevice();

    // Load content from JSON
    loadContent();

    // Add entrance animation to hero
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.animation = 'fadeInDown 1s ease-out forwards';
    }
});

// Add fade-in animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .in-view {
        animation: slideIn 0.6s ease-out forwards;
    }

    .nav-links a.active {
        color: var(--accent-cyan);
    }

    .nav-links a.active::after {
        width: 100%;
    }

    img.loaded {
        animation: fadeIn 0.4s ease-in;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
