// ================================
// CONTENT LOADING & RENDERING
// ================================

let destinationsData = [];

async function loadContent() {
    try {
        const response = await fetch('assets/data/content.json');
        const data = await response.json();
        destinationsData = data.destinations;
        renderDestinations();
        populateNavigation();
    } catch (error) {
        console.error('Error loading content:', error);
    }
}

function renderDestinations() {
    const container = document.getElementById('destinations-container');
    if (!container || !destinationsData.length) return;

    container.innerHTML = destinationsData.map((dest) => `
        <article id="${dest.id}" class="destination-card" role="article">
            <div class="card-image">
                <img src="assets/images/${dest.image}" alt="${dest.name} - ${dest.description}">
            </div>
            <div class="card-content">
                <h3>${dest.name}</h3>
                <p class="destination-type">${dest.type}</p>
                <p class="description">${dest.description}</p>
                <div class="card-meta">
                    <span class="location">${dest.location}</span>
                    <span class="rating">${dest.rating}</span>
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
        <li><a href="#${dest.id}">${dest.name}</a></li>
    `).join('');

    // Re-attach nav event listeners
    attachNavEventListeners();
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
