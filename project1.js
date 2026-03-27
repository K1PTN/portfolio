function scrollToAbout(sectionId) {
    // Если ID не передан, используем значение по умолчанию
    const targetId = sectionId || 'about_pr_1';
    const element = document.getElementById(targetId);
    
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Parallax effect for hero background
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.pr_preview_1');
    
    if (hero && window.innerWidth > 768) {
        const speed = 0.5;
        hero.style.backgroundPositionY = `calc(50% + ${scrolled * speed}px)`;
    }
});

// Mouse movement effect for hero section (desktop only)
if (window.innerWidth > 1024) {
    document.querySelector('.pr_preview_1').addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const xPos = (clientX / innerWidth - 0.5) * 20;
        const yPos = (clientY / innerHeight - 0.5) * 20;
        
        const hero = document.querySelector('.pr_preview_1');
        hero.style.backgroundPosition = `calc(50% + ${xPos}px) calc(50% + ${yPos}px)`;
    });
}

// Intersection Observer for scroll animations
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

// Observe elements for animation reset
document.querySelectorAll('.about_item_pr_1').forEach(el => {
    observer.observe(el);
});