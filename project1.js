function scrollToAbout(sectionId) {
    // Если ID не передан, используем значение по умолчанию
    const targetId = sectionId || 'about_pr_1';
    const element = document.getElementById(targetId);
    
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Parallax effect for hero background (desktop only)
function initParallax() {
    const hero = document.querySelector('[class^="pr_preview_"]');
    if (!hero || window.innerWidth <= 768) return;

    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const speed = 0.3;
                hero.style.backgroundPositionY = `calc(50% + ${scrolled * speed}px)`;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.about_item_pr_1').forEach(el => {
        observer.observe(el);
    });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initParallax();
    initScrollAnimations();
});
