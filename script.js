/* ============================================
   blessdev Portfolio — Interactions
   ============================================ */

// ── Cursor Glow (только на десктопе) ──
const cursorGlow = document.getElementById('cursorGlow');
const isTouchDevice = window.matchMedia('(hover: none)').matches;

if (!isTouchDevice) {
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
}

// ── Mobile Menu ──
function toggleMenu() {
    const links = document.getElementById('navLinks');
    const burger = document.getElementById('burger');
    const isOpen = links.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeMenu() {
    const links = document.getElementById('navLinks');
    const burger = document.getElementById('burger');
    links.classList.remove('open');
    burger.classList.remove('open');
    document.body.style.overflow = '';
}

// ── Nav Scroll ──
const nav = document.getElementById('nav');
const scrollIndicator = document.getElementById('scrollIndicator');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }

    // Скрываем scroll-индикатор после небольшого скролла
    if (scrollY > 80) {
        scrollIndicator.classList.add('hidden');
    } else {
        scrollIndicator.classList.remove('hidden');
    }
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
        if (progress < 1) requestAnimationFrame(update);
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

            if (el.dataset.delay) {
                setTimeout(() => el.classList.add('visible'), parseInt(el.dataset.delay));
            } else {
                el.classList.add('visible');
            }

            if (el.classList.contains('hero-stats')) {
                el.querySelectorAll('[data-target]').forEach(counter => animateCounter(counter));
            }

            observer.unobserve(el);
        }
    });
}, observerOptions);

document.querySelectorAll('.problem-card, .case-card, .service-card, .stack-item').forEach((el) => {
    if (!el.dataset.delay) {
        const siblings = el.parentElement.children;
        const index = Array.from(siblings).indexOf(el);
        el.dataset.delay = index * 100;
    }
    observer.observe(el);
});

document.querySelectorAll('.hero-stats').forEach(el => observer.observe(el));

// ── Smooth scroll ──
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
