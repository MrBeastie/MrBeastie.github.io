/* ============================================
   blessdev Portfolio — Interactions
   ============================================ */

// ── Cursor Glow ──
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.style.opacity = '1';
});

document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
});

function animateCursor() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    cursorGlow.style.left = currentX + 'px';
    cursorGlow.style.top = currentY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// ── Nav Scroll ──
const nav = document.getElementById('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
});

// ── Counter Animation ──
function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(eased * target);
        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ── Intersection Observer ──
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;

            // Cards with delay
            if (el.dataset.delay) {
                setTimeout(() => {
                    el.classList.add('visible');
                }, parseInt(el.dataset.delay));
            } else {
                el.classList.add('visible');
            }

            // Counter animation
            if (el.classList.contains('hero-stats')) {
                el.querySelectorAll('[data-target]').forEach(counter => {
                    animateCounter(counter);
                });
            }

            observer.unobserve(el);
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.problem-card, .case-card, .service-card, .stack-item').forEach((el, i) => {
    // Stagger cards within same section
    if (!el.dataset.delay) {
        const siblings = el.parentElement.children;
        const index = Array.from(siblings).indexOf(el);
        el.dataset.delay = index * 100;
    }
    observer.observe(el);
});

// Observe stats
document.querySelectorAll('.hero-stats').forEach(el => observer.observe(el));

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});
