// ================================
// SMOOTH SCROLLING & NAVIGATION
// ================================

// Update active navigation link on scroll
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section, header');

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

// ================================
// SMOOTH SCROLL IMPLEMENTATION
// ================================

// Enhanced smooth scroll for CTA button and nav links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Skip if href is just '#'
        if (href === '#') {
            e.preventDefault();
            return;
        }

        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            e.preventDefault();

            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    });
});

// ================================
// CARD HOVER EFFECTS & INTERACTIONS
// ================================

const cards = document.querySelectorAll('.destination-card');

cards.forEach((card) => {
    // Add hover scale effect
    card.addEventListener('mouseenter', function () {
        this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function () {
        this.style.zIndex = '1';
    });

    // Add click interaction for read more
    const readMoreBtn = card.querySelector('.read-more');
    if (readMoreBtn) {
        readMoreBtn.addEventListener('click', function (e) {
            e.preventDefault();
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
            // Add visual feedback
            card.style.borderColor = 'rgba(124, 58, 237, 0.8)';
            setTimeout(() => {
                card.style.borderColor = 'rgba(124, 58, 237, 0.3)';
            }, 2000);
        });
    }
});

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

document.addEventListener('DOMContentLoaded', () => {
    console.log('Cosmic Getaways loaded successfully!');
    adjustStarfieldForDevice();

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
